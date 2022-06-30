<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='managementMethods'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height: 30px;line-height: 30px;'>
            <!-- <eco-tool-title title='参与制修订的国标'></eco-tool-title> -->
            <strong>参与制修订的国标</strong>
          </el-col>
          <el-col :span='19' style='text-align:right;margin-top:2px'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='addCase'
              v-show='btnRoleObj["ext_dongfeng_participate_national_standard_participate_national_standard_insert"]'>新增
            </el-button>
            <el-button type='danger' size='small' @click='deleteCase'
              v-show='btnRoleObj["ext_dongfeng_participate_national_standard_participate_national_standard_disable"]'>删除
            </el-button>
            <el-button type='primary' size='small' @click='exportCase'
              v-show='btnRoleObj["ext_dongfeng_participate_national_standard_participate_national_standard_export"]'>导出
            </el-button>
            <el-button type='primary' size='small'
              v-show='btnRoleObj["ext_dongfeng_participate_national_standard_participate_national_standard_import"]'
              @click='importCase'>导入</el-button>
            <el-upload v-show='false' ref='managementMethodsUpload' :auto-upload='true' :http-request="uploadFile"
              action="" :before-upload='beforeUpload' :show-file-list='false' accept='.xls,.xlsx'>
            </el-upload>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top='59px' height='130px' type='tool' style='border:1px solid #ddd;overflow: hidden;'
        v-show='isShowSearch'>
        <el-row style="padding:16px 10px;background:#fff">
          <el-col :span='24'>
            <span class='searchInputLabel'>&emsp;&emsp;标准类型:</span>
            <el-select filterable v-model='searchContent.standardType' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item) in standardTypeList' :key='item.id'>
              </el-option>
            </el-select>
            <span class='searchInputLabel'>标准编号/计划号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native='requestData("search")'
              v-model='searchContent.standardCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>标准名称:</span>
            <el-input clearable style='width:150px' @keyup.enter.native='requestData("search")'
              v-model='searchContent.standardName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24' style='margin-top:8px'>
            <span class='searchInputLabel'>标准颁布状态:</span>
            <el-select filterable v-model='searchContent.standardStatus' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item) in standardStatusNameList' :key='item.id'>
              </el-option>
            </el-select>
            <span class='searchInputLabel'>&ensp;制/修订:</span>
            <el-select filterable v-model='searchContent.revisionType' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item) in revisionTypeNameList' :key='item.id'>
              </el-option>
            </el-select>
            <span class='searchInputLabel'>参与形式:</span>
            <el-select filterable v-model='searchContent.participationForm' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item) in participationFormList' :key='item.id'>
              </el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;所属分标委:</span>
            <el-input clearable style='width:150px' @keyup.enter.native='requestData("search")'
              v-model='searchContent.subcommittee' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24' style='margin-top:8px'>
            <span class='searchInputLabel'>颁布时间:</span>
            <el-date-picker style='width:220px' value-format='yyyy-MM-dd' v-model="searchContent.promulgatedDate"
              type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
            </el-date-picker>
            <span class='searchInputLabel'>实施时间:</span>
            <el-date-picker style='width:220px' value-format='yyyy-MM-dd' v-model="searchContent.forecastImplementTime"
              type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
            </el-date-picker>
            <el-button type='primary' @click='requestData("search")' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearchContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table border @selection-change="handleSelectionChange" stripe :data='tableData'
          header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='standardizationTable'>
          <el-table-column type='selection' width='50' align='center' fixed='left'></el-table-column>
          <el-table-column type='index' label='序号' fixed='left'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <!-- <el-table-column label='标准类型' prop='standardTypeName'></el-table-column> -->
          <el-table-column label='标准编号/计划号' prop='standardCode'></el-table-column>
          <el-table-column label='标准名称' width='110px' show-overflow-tooltip prop='standardName'></el-table-column>
          <el-table-column label='标准颁布状态' width='100px' prop='standardStatusName'></el-table-column>
          <el-table-column label='颁布时间' width='110px' prop='promulgatedDate'></el-table-column>
          <el-table-column label='实施时间' width='110px' prop='forecastImplementTime'></el-table-column>
          <el-table-column label='制/修订' prop='revisionTypeName' align='center'></el-table-column>
          <!-- <el-table-column label='参与形式' prop='participationFormName'></el-table-column> -->
          <el-table-column label='所属分标委' width='100px' prop='subcommittee'></el-table-column>
          <el-table-column label='领域' prop='professionName'></el-table-column>
          <el-table-column label='起草单位' prop='draftUnit'></el-table-column>
          <el-table-column label='科技创新部联络员' prop='liaisonUserName'></el-table-column>
          <el-table-column label='操作' fixed='right' width='100'>
            <template slot-scope='scope'>
              <el-button type='text' @click='editCase(scope.row)'
                v-if='btnRoleObj["ext_dongfeng_participate_national_standard_participate_national_standard_update"]'>修改
              </el-button>
              <el-button type='text' @click='goDetail(scope.row)'>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
              layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <table id='exportTable'>
      <tbody id='tableBody'></tbody>
    </table>
  </eco-content>
</template>
<script>
  var _self;
  import ecoContent from "@/components/pageAb/ecoContent.vue";
  import ecoLoading from "@/components/loading/ecoLoading.vue";
  import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
  import { EcoUtil } from "@/components/util/main.js";
  import { EcoMessageBox } from "@/components/messageBox/main.js";
  import {
    standardPaginationList,
    standardDeleteSingle,
    getRoleBtnSetting,
    participateNationalUpload
  } from "../service/service.js";
  import { mapState } from "vuex";
  export default {
    name: "managementMethods",
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed: {
      ...mapState([
        "standardTypeList",
        "standardStatusNameList",
        "revisionTypeNameList",
        "participationFormList"
      ]),
      contentTop() {
        return this.isShowSearch ? "190px" : "59px";
      }
    },
    data() {
      return {
        btnRoleObj: {},
        isShowSearch: false,
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContent: {
          standardName: "",
          standardCode: "",
          standardType: "",
          subcommittee: "",
          participationForm: "",
          forecastImplementTime: [],
          revisionType: "",
          promulgatedDate: [], //时间范围
          standardStatus: "" //标准颁布状态
        },
        tableData: [],
        multipleSelection: [],
        timer: null
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
      uploadFile(params) {
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('file', fileObj);//file
        form.append('time', new Date().getTime());
        participateNationalUpload(form).then(res => {
          this.$message.success('导入成功');
          this.restSearchContent();
          this.$refs.refLoading.close();
        }).catch(err => {
          this.$message.error('导入失败');
          this.$refs.refLoading.close();
        })
      },
      importCase() {
        let doit = function () {
          _self.$refs.managementMethodsUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        }
        EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?', '提示', { type: 'warning', lockScroll: false }, doit)
      },
      initRole() {
        const btn_array = [
          "ext_dongfeng_participate_national_standard_participate_national_standard_insert",
          "ext_dongfeng_participate_national_standard_participate_national_standard_update",
          "ext_dongfeng_participate_national_standard_participate_national_standard_disable",
          "ext_dongfeng_participate_national_standard_participate_national_standard_export",
          "ext_dongfeng_participate_national_standard_participate_national_standard_import"
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
      exportCase() {
        this.$refs.refLoading.open();
        let params = {
          sort: ["modDate"],
          order: ["desc"],
        };
        for (var key in this.searchContent) {
          if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
        standardPaginationList(params).then(res => {
          let i = 0;
          let tableBody = document.getElementById("tableBody");
          let htmlStr = `
          <tr>
            <td>序号</td>
            <td>标准类型</td>
            <td>标准编号/计划号</td>
            <td>标准名称</td>
            <td>标准颁布状态</td>
            <td>颁布时间</td>
            <td>实施时间</td>
            <td>制/修订</td>
            <td>参与形式</td>
            <td>所属分标委</td>
            <td>领域</td>
            <td>起草单位</td>
            <td>科技创新部联络员</td>
            <td>人员姓名</td>
            <td>工号</td>
            <td>起草人位列排序</td>
            <td>单位</td>
            <td>部门</td>
            <td>职务/职称</td>
            <td>邮箱</td>
            <td>座机</td>
            <td>手机</td>
          </tr>
          `;
          res.data.rows.forEach((item, index) => {
            if (item.staffList && item.staffList.length != 0) {
              item.staffList.forEach((item2, index2) => {
                i += 1;
                htmlStr += `<tr>
                      <td>${i}</td>
                      <td>${item.standardTypeName}</td>
                      <td>${item.standardCode}</td>
                      <td>${item.standardName}</td>
                      <td>${item.standardStatusName}</td>
                      <td>${item.promulgatedDate || ""}</td>
                      <td>${item.forecastImplementTime || ""}</td>
                      <td>${item.revisionTypeName}</td>
                      <td>${item.participationFormName}</td>
                      <td>${item.subcommittee}</td>
                      <td>${item.professionName}</td>
                      <td>${item.draftUnit}</td>
                      <td>${item.liaisonUserName}</id>
                      <td>${item2.employee || ''}</td>
                      <td>${item2.employeeNum || ''}</td>
                      <td>${item2.rankOrder || ''}</td>
                      <td>${item2.unit || ''}</td>
                      <td>${item2.dept || ''}</td>
                      <td>${item2.position || ''}</td>
                      <td>${item2.email || ''}</td>
                      <td>${item2.telephone || ''}</td>
                      <td>${item2.mobilePhone || ''}</td>
                    </tr>
                  `;
              })
            } else {
              i += 1;
              htmlStr += `
             <tr>
                <td>${i}</td>
                <td>${item.standardTypeName}</td>
                <td>${item.standardCode}</td>
                <td>${item.standardName}</td>
                <td>${item.standardStatusName}</td>
                <td>${item.promulgatedDate || ""}</td>
                <td>${item.forecastImplementTime || ""}</td>
                <td>${item.revisionTypeName}</td>
                <td>${item.participationFormName}</td>
                <td>${item.subcommittee}</td>
                <td>${item.professionName}</td>
                <td>${item.draftUnit}</td>
                <td>${item.liaisonUserName}</id>
              </tr>
             `;
            }
          });
          tableBody.innerHTML = htmlStr;
          this.$refs.refLoading.close();
          this.$nextTick(function () {
            $("#exportTable").table2excel({
              // exclude: '', //过滤打印类名
              filename: "参与制修订的国标.xls", //文件名称
              name: "Excel Document Name.xls",
              exclude_img: true,
              exclude_links: true,
              exclude_inputs: true
            });
          });
        });
      },
      restSearchContent() {
        this.searchContent = {
          standardName: "",
          standardCode: "",
          standardType: "",
          subcommittee: "",
          participationForm: "",
          forecastImplementTime: [],
          revisionType: "",
          promulgatedDate: [],
          standardStatus: "" //标准颁布状态
        };
        this.requestData("search");
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          EcoMessageBox.alert("请先选择要删除的数据", "提示");
        } else {
          let doit = function () {
            _self.$refs.refLoading.open();
            _self.multipleSelection.forEach(item => {
              standardDeleteSingle(item.id).then(res => {
                if (_self.timer !== null) {
                  clearTimeout(_self.timer);
                  _self.timer = null;
                }
                _self.timer = setTimeout(function () {
                  _self.multipleSelection = []; //删除后清空选择列表数据
                  _self.requestData("search"); //刷新数据
                  _self.$message({
                    message: "删除成功!",
                    type: "success"
                  });
                }, 350);
              });
            });
          };
          EcoMessageBox.confirm(
            "您确认要删除数据?",
            "提示",
            { type: "warning", lockScroll: false },
            doit
          );
        }
      },
      addCase() {
        let _width = "1100";
        let _height = "600";
        let url = "/standardization/index.html#/editManagement/" + 0 + "/addCase";
        EcoUtil.getSysvm().openDialog("新建", url, _width, _height, "15vh");
      },
      callAction() {
        let callBackDialogFunc = function (obj) {
          if (obj && obj.action === "editManagement") {
            //修改刷新
            _self.$message.success("修改成功!");
            _self.requestData();
          } else if (obj.action === "addManagement") {
            _self.$message.success("新增成功!");
            _self.restSearchContent();
          }
        };
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "manageMentMethods");
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      editCase(row) {
        let _width = "1100";
        let _height = "600";
        let url = "/standardization/index.html#/editManagement/" + row.id + "/editCase";
        EcoUtil.getSysvm().openDialog("编辑", url, _width, _height, "15vh");
      },
      goDetail(row) {
        let _width = "1100";
        let _height = "400";
        let url = "/standardization/index.html#/editManagement/" + row.id + "/viewCase";
        EcoUtil.getSysvm().openDialog("查看", url, _width, _height, "15vh");
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
            if (key === "promulgatedDate" || key === "forecastImplementTime") {
              if (this.searchContent[key] && this.searchContent[key].length !== 0) {
                params[key + "From"] = this.searchContent[key][0];
                params[key + "To"] = this.searchContent[key][1];
              }
            } else if (this.searchContent[key]) {
              params[key] = this.searchContent[key];
            }
          }
        }
        params.page = this.baseInfo.page;
        standardPaginationList(params).then(res => {
          this.tableData = res.data.rows;
          this.baseInfo.total = res.data.total;
          this.$refs.refLoading.close();
        }).catch(err => {
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
  .managementMethods {
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: auto;
    min-width: 1000px;
    color: #0f1419;
  }

  .managementMethods .plainBtn:first-of-type {
    margin-left: 20px;
  }

  .managementMethods .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .managementMethods .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
    background: #f5f7fa !important;
  }

  .standardizationTable /deep/ .tableHeader th {
    background: #f5f7fa;
    color: #000;
    /* border-bottom-width: 0px; */
    height: 50px;
  }

  /* .standardizationTable /deep/ .el-table__row td {
  border-bottom-width: 0px;
} */
</style>
