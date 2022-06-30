<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='listofQuestions'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <!-- <eco-tool-title title='标准相关质量问题清单'></eco-tool-title>  -->
            <strong>标准相关质量问题清单</strong>
          </el-col>
          <el-col :span='19' style='text-align:right'>
              <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
              <el-button type='danger' size='small' @click='editCase({},"addcase")' v-show='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_create"]'>新增</el-button>
              <el-button type='primary' size='small' @click='deleteCase' v-show='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_delete"]'>删除</el-button>
              <el-button type='primary' size='small' @click='importCase' v-show='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_upload"]'>导入</el-button>
              <el-button type='primary' size='small' @click="exportCase" v-show='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_download"]'>导出</el-button>
              <el-upload v-show='false' ref='listofQuestionsUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                :show-file-list='false'  accept='.xls,.xlsx'>
              </el-upload>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>问题编号:</span>
            <el-input clearable style='width:135px' @keyup.enter.native="requestData('search')" v-model='searchContent.problemNo' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>问题名称:</span>
            <el-input clearable @keyup.enter.native="requestData('search')" style='width:135px' v-model='searchContent.problemName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>责任部门:</span>
            <tag-select ref='selectDept' placeholder="选择机构" style="width:135px;vertical-align: top;" initDataStr=""
              :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="selectRoleDept">
            </tag-select>
            <span class='searchInputLabel'>制修订状态:</span>
            <el-select filterable v-model='searchContent.revisionStatus' style='width:135px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item) in revisionTypeList' :key='item.id'></el-option>
            </el-select>
          </el-col>
          <el-col style='margin-top:7px'>
            <span class='searchInputLabel'>标准名称:</span>
            <el-input clearable @keyup.enter.native="requestData('search')" style='width:135px' v-model='searchContent.standardName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;责任人:</span>
            <tag-select ref='selectUser' placeholder="选择人员" style="width:135px;vertical-align: top;" initDataStr=""
              :initOptions="{selectNum:1,selectType:'User'}" @callBack="selectRoleUser">
            </tag-select>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table ref='questionListTable'   @current-change="handleRowClickChange" highlight-current-row  stripe :data='tableData' header-row-class-name='tableHeader'
          border tooltip-effect='dark' height='100%'>
          <el-table-column type='index' label='序号'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column label='问题编号' prop='problemNo' width='150'></el-table-column>
          <el-table-column label='问题名称' prop='problemName' width='180' show-overflow-tooltip></el-table-column>
          <el-table-column show-overflow-tooltip label='问题描述' width='180' prop='problemDescription'></el-table-column>
          <el-table-column label='责任部门' prop='responsibleDeptName'></el-table-column>
          <el-table-column label='制修订状态' prop='revisionStatus'></el-table-column>
          <el-table-column label='标准名称'  prop='standardName' show-overflow-tooltip width='150'></el-table-column>
          <el-table-column label='责任人' prop='responsibleName'></el-table-column>
          <el-table-column label='操作' align='center' width='100' v-if='(btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_modify"]||btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_lookup"])'>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")' v-if='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_modify"]'>修改</el-button>
              <el-button type='text' @click.stop='editCase(scope.row,"viewCase")' v-if='btnRoleObj["dongfeng.stdlifecycle.std-quality-problem-list_lookup"]'>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
              :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content>
    </div>
  </eco-content>
</template>
<script>
var _self;
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoLoading from "@/components/loading/ecoLoading.vue";
import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
import { EcoUtil } from "@/components/util/main.js";
import { EcoMessageBox } from "@/components/messageBox/main.js";
import { mapState } from "vuex";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import {
  problemListDownloadExcel,
  problemListExcel,
  problemList,
  problemDeleteBatch,
  getUserInfoByOrgId,
  getOrgsMemberByIds,
  getRoleBtnSetting
} from "../service/service.js";
export default {
  name: "listofQuestions",
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    tagSelect
  },
  computed: {
    ...mapState(["revisionTypeList"]),
    contentTop() {
      return this.isShowSearch ? "150px" : "59px";
    }
  },
  data() {
    return {
      isShowSearch: false,
      baseInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      searchContent: {
        problemNo: "",
        problemName: "",
        responsibleDept: "",
        revisionStatus: "",
        standardName:'',
        responsible:''
      },
      tableData: [],
      currentRow: null,
      btnRoleObj:{}
    };
  },
  created() {
    _self = this;
    this.initRole();
    this.callAction(); //监听窗口的回调函数
  },
  mounted() {
    this.requestData();
  },
  methods: {
    exportCase() {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],     // 排序字段列表
          order: ['desc'],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
            if (this.searchContent[key]) {
              params[key] = this.searchContent[key];
            }
        }
        problemListDownloadExcel(params).then(res => {
          if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
              navigator.msSaveBlob(new Blob([res.data],'问题清单.xlsx'));
              this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
            let url = window.URL.createObjectURL(blob);  
            let a = document.createElement("a");
            a.href = url;
            a.download = '问题清单.xlsx';
            this.$refs.refLoading.close();
            a.click();
            window.URL.revokeObjectURL(url);
          }
        }).catch(err => {
          this.$refs.refLoading.close();
        })
    },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "导入文件只能是.xls,.xlsx格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
    uploadFile(params){
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('file',fileObj);//file
        form.append('time',new Date().getTime());
        problemListExcel(form).then(res=>{
            this.$message.success('导入成功');
            this.restSearContent();
            this.$refs.refLoading.close();
        }).catch(err=>{
            this.$message.error('导入失败');
            this.$refs.refLoading.close();
        })
    },
    importCase(){
        // let doit = function(){
            
        // }
        // EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
        _self.$refs.listofQuestionsUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
    },
    initRole() {
      const btn_array = [
         'dongfeng.stdlifecycle.std-quality-problem-list_create',
         'dongfeng.stdlifecycle.std-quality-problem-list_delete',
         'dongfeng.stdlifecycle.std-quality-problem-list_modify',
         'dongfeng.stdlifecycle.std-quality-problem-list_lookup',
         'dongfeng.stdlifecycle.std-quality-problem-list_upload',
         'dongfeng.stdlifecycle.std-quality-problem-list_download'
      ];
      getRoleBtnSetting(btn_array).then(res => {
        if (res.data) {
          this.btnRoleObj = res.data.authenticationMap;
        }
      });
    },
    changeSearchShow() {
      this.isShowSearch = !this.isShowSearch;
    },
    selectRoleDept(data) {
      if (!data.id && data.itemArray.length === 0) {
        this.searchContent.responsibleDept = "";
      } else {
        this.searchContent.responsibleDept = data.orgId;
      }
    },
    selectRoleUser(data){
      if (!data.id && data.itemArray.length === 0) {
        this.searchContent.responsible = "";
      } else {
        this.searchContent.responsible =  data.itemArray[0].linkId;
      }
    },
    restSearContent() {
      this.$refs.selectDept.initDataStrFunc();
      this.$refs.selectUser.initDataStrFunc();
      this.searchContent = {
        problemNo: "",
        problemName: "",
        responsibleDept: "",
        revisionStatus: "",
        standardName:'',
        responsible:''
      };
      this.requestData("search");
    },
    deleteCase() {
      if (this.currentRow === null) {
        return EcoMessageBox.alert(
          "当前未选中行,请点击要删除的行再进行删除操作。",
          "提示"
        );
      }
      let doit = function() {
        var id = _self.currentRow.id;
        _self.$refs.questionListTable.setCurrentRow();
        _self.$refs.refLoading.open();
        problemDeleteBatch(id)
          .then(res => {
            _self.$message.success("删除成功!");
            _self.requestData("search");
          })
          .catch(err => {
            _self.$refs.refLoading.close();
          });
      };
      EcoMessageBox.confirm(
        "您确定要删除数据?",
        "提示",
        { type: "warning", lockScroll: false },
        doit
      );
    },
    handleRowClickChange(newRow) {
      this.currentRow = newRow;
    },
    callAction() {
      let callBackDialogFunc = function(obj) {
        if (obj && obj.action === "editListQuestions") {
          //修改 刷新
          _self.$message.success("修改成功!");
          _self.requestData();
        } else if (obj.action === "addListQuestions") {
          //新建 刷新
          _self.$message.success("新建成功!");
          _self.restSearContent();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "listofQuestions");
    },
    editCase(row, type) {
      let _width = "800";
      let _height = "600";
      let url;
      let dialogTitle;
      if (type === "editCase") {
        url =
          "/listofQuestions/index.html#/editListQuestions/" +
          row.id +
          "/editCase";
        dialogTitle = "编辑";
      } else if (type === "viewCase") {
        url =
          "/listofQuestions/index.html#/editListQuestions/" +
          row.id +
          "/viewCase";
        dialogTitle = "查看";
        _height = "500";
      } else {
        url =
          "/listofQuestions/index.html#/editListQuestions/" + 0 + "/addCase";
        dialogTitle = "新增";
      }
      EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
    },
    handleSizeChange(val) {
      this.baseInfo.rows = val;
      this.requestData("search");
    },
    handleCurrentChange(val) {
      this.baseInfo.page = val;
      this.requestData();
    },
    requestData(type) {
      this.$refs.refLoading.open();
      let params = {
        sort: ["modDate"],
        order: ["desc"],
        rows: this.baseInfo.rows
      };
      if (type === "search") {
        this.baseInfo.page = 1;
        for (var key in this.searchContent) {
          if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
      }
      params.page = this.baseInfo.page;
      problemList(params)
        .then(res => {
          this.baseInfo.total = res.data.total;
          res.data.rows.forEach((item, index) => {
            item.responsibleName = "";
            item.responsibleDeptName = "";
            if (item.revisionStatus) {
              _self.revisionTypeList.forEach(item2 => {
                if (item2.id == item.revisionStatus) {
                  item.revisionStatus = item2.text;
                }
              });
            }
            getUserInfoByOrgId(item.responsible).then(userRes => {
              item.responsibleName = userRes.data.mi;
            });
            getOrgsMemberByIds([
              {
                type: "DEPT",
                orgId: item.responsibleDept,
                linkId: item.responsibleDept
              }
            ]).then(deptRes => {
              item.responsibleDeptName = deptRes.data[0];
            });
          });
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        })
        .catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        });
    }
  },
  watch: {}
};
</script>
<style scoped>
.listofQuestions {
  color: #0f1419;
  min-width: 1000px;
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: auto;
  color: #0f1419;
}

.listofQuestions .plainBtn:first-of-type {
  margin-left: 20px;
}

.listofQuestions .searchInputLabel {
  font-size: 14px;
  margin-left: 5px;
}
</style>
