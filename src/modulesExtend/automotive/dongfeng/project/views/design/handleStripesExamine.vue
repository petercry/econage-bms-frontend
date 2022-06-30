<template>
  <div class="handleStripes">
    <div>
      <div class="toolbar">
        <el-button type='primary' @click='searchArea'>高级搜索</el-button>
        <el-button type="primary" @click="doneInfo">确认</el-button>
        <el-button type="primary" @click="returnBack">退回</el-button>
        <el-button type="primary" @click="exportFun">导出</el-button>
      </div>
      <div class="searchBox" v-show='flag'>
        <span>状态：</span>
        <div class="itemInput">
          <el-select v-model="searchform.itemStatus" placeholder="请选择">
            <el-option label="待办" value="waiting"></el-option>
            <el-option label="已办理" value="handled"></el-option>
            <el-option label="已完成" value="complete"></el-option>
          </el-select>
        </div>

        <span>重要类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.importantType" placeholder="请选择">
            <el-option v-for="item in importantType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>所属节点：</span>
        <div class="itemInput">
          <el-select v-model="searchform.node" placeholder="请选择">
            <el-option v-for="item in node" :key="item.id" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </div>

        <span>标准法规号：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationCode" placeholder="请输入内容"></el-input>
        </div>
        <!-- <span>类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.type" placeholder="请选择">
            <el-option v-for="item in type" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->
      </div>

      <div class="searchBox" v-show='flag'>
          <span>标准法规名称：</span>
          <div class="itemInput">
            <el-input v-model="searchform.regulationName" placeholder="请输入内容"></el-input>
          </div>
          <span>部门：</span>
          <div class="itemInput">
            <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'dept'}" @callBack="selectDept">
            </tag-select>
          </div>

          <span>科室：</span>
          <div class="itemInput">
            <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'dept'}" @callBack="selectOffice">
            </tag-select>
          </div>
      </div>
      <div class="searchBox" v-show='flag'>
        <!-- <span>设计师：</span>
        <div class="itemInput">
          <tag-select style="width: 100%;vertical-align: top;" ref="tagSelect" :initOptions="{selectNum:1,selectType:'user'}" @callBack="selectProfessionDesigner">
          </tag-select>
        </div> -->

        <span>专业：</span>
        <div class="itemInput">
          <el-select v-model="searchform.profession" filterable placeholder="请选择">
            <el-option v-for="item in profession" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>交付物：</span>
        <div class="itemInputLong">
          <el-select v-model="searchform.deliverable" placeholder="请选择">
            <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>
        <span>法规符合性：</span>
        <div class="itemInput">
          <el-select v-model="searchform.regulatoryCompliance" placeholder="请选择">
            <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div>

        <!-- <span>方案类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.schemeType" placeholder="请选择">
            <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->
        <el-button type="primary" @click="getListInfo">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </div>
    </div>

    <eco-content ref="content" :top="searchHeight" bottom="42px" style="padding:0px 15px;">
      <el-table stripe height="100%" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" class="styleTableDefaulta">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="itemStatusName" label="办理标识" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.readMark ? '确定' : '待办'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="statusName" label="状态" width="120">
        </el-table-column> -->
        <el-table-column prop="regulatoryComplianceName" label="法规符合性">
        </el-table-column>
        <!-- <el-table-column prop="importantTypeName" label="重要类型">
        </el-table-column> -->
        <!-- <el-table-column prop="nodeName" label="所属节点">
        </el-table-column> -->
        <!-- <el-table-column prop="regulationCode" label="标准法规号">
        </el-table-column> -->
        <!-- <el-table-column prop="regulationName" label="标准法规名称">
        </el-table-column> -->
        <el-table-column prop="articleCode" label="条文号">
        </el-table-column>
        <el-table-column prop='articleContent' label='条文内容' width='250'>
          <template slot-scope='scope'>
            <div class="articleContentBox"  v-ckeditor='scope.row.articleContent' ></div>
            </template>
        </el-table-column>
        <el-table-column prop='articleInterpretation' label='条文释义' width='200'></el-table-column>
        <el-table-column prop='feedbackDescription' width='200' label='反馈结果的说明'></el-table-column>
        <!-- <el-table-column prop="deptName" label="所属部门">
        </el-table-column> -->
        <!-- <el-table-column prop="officeName" label="所属科室">
        </el-table-column> -->
        <!-- <el-table-column prop="professionName" label="专业" width="160">
        </el-table-column> -->
        <el-table-column prop="contactUserName" label="联络人">
        </el-table-column>
        <el-table-column prop="deliverableName" label="交付物">
        </el-table-column>
        <el-table-column prop="regulatoryCompliance" label="操作" width="120">
          <template slot-scope="scope">
            <span class="detailSpan" @click="detailItem(scope.row.taskId,scope.row.taskId)">详情</span>
            <span class="detailSpan" @click.stop='openFlowList(scope.row.taskId)'>流程历史</span>
          </template>
        </el-table-column>
      </el-table>
    </eco-content>
    <eco-content bottom="0px" type="tool" style="padding:5px 0px" ref="multipleTable">
      <el-row>
        <el-col :span="12">
          <span class="showInfo">条文任务应到{{dueQuantity}}条，实到{{actualQuantity}}条</span>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchform.page" :page-sizes="[10,30,50,100]" :page-size="searchform.rows" layout="total, sizes, prev, pager, next, jumper" :total="searchform.total" style="margin-right:20px">
          </el-pagination>
        </el-col>
      </el-row>
    </eco-content>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { EcoFile } from "@/components/file/main.js";
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import { mapState, mapActions } from "vuex";
import {
  getEnumSelectEnabled,
  getStatusAjax,
  getGroupingInfoAjax,
  getDoneAjax,
  getGroupedExportAjax,
  getGroupingInfo
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    ecoContent,
    tagSelect,
  },
  data() {
    return {
      flag:false,
      searchHeight:'60px',
      searchform: {
        phase: "",
        groupId: "",
        status: "",
        importantType: "",
        node: "",
        type: "",
        regulationCode: "",
        regulationName: "",
        deptId: "",
        officeId: "",
        designerUserId: "",
        profession: "",
        deliverable: "",
        regulatoryCompliance: "",
        schemeType: "",
        page: 1,
        rows: 30,
        total: 0,
      },
      status: [],
      importantType: [],
      node: [],
      type: [],
      profession: [],
      deliverable: [],
      regulatoryCompliance: [],
      schemeType: [],
      tableData: [],
      multipleSelection: [],
      projectId: "",
      dueQuantity: 0,
      actualQuantity: 0
    };
  },
  created() {
    this.searchform.groupId = this.$route.params.Id;
    this.searchform.phase = this.$route.params.phase;
    this.projectId = this.$route.params.proId;
    if(this.$route.query.status!=='waiting'){
      this.searchform.itemStatus = this.$route.query.status;
    }
    this.getbaseInfo();
    this.getListInfo();
    this.listAction();
    window.liaisonvm = this;
  },
  mounted() {},
  methods: {
    openFlowList(id){
         let url = '/project/index.html#/flowHistory/'+id;
         EcoUtil.getSysvm().openDialog('流程历史',url,'1000','700');
    },
    // 符合查询区域
    searchArea() {
        this.flag = !(this.flag)
        if (this.flag) {
            this.searchHeight = '200px'
        }else {
            this.searchHeight = '60px'
        }
    },
    // 获取基础数据
    getbaseInfo() {
      // 状态
      getStatusAjax().then((res) => {
        this.status = res.data;
      });
      // 重要类型
      getEnumSelectEnabled("ZYLX").then((res) => {
        this.importantType = res.data;
      });
      // 所属节点
      getEnumSelectEnabled("SSJD").then((res) => {
        this.node = res.data;
      });
      // 类型
      getEnumSelectEnabled("LX").then((res) => {
        this.type = res.data;
      });
      // 专业
      getEnumSelectEnabled("1372459642503467009").then((res) => {
        this.profession = res.data;
      });
      // 交付物
      getEnumSelectEnabled("FG002").then((res) => {
        this.deliverable = res.data;
      });
      // 法规符合性
      getEnumSelectEnabled("FGFHX").then((res) => {
        this.regulatoryCompliance = res.data;
      });
      // 方案类型
      getEnumSelectEnabled("FALX").then((res) => {
        this.schemeType = res.data;
      });
    },
    // 获取列表数据
    getListInfo() {
      getGroupingInfoAjax(this.searchform).then((res) => {
        this.tableData = res.data.rows;
        this.searchform.total = res.data.total;
      });
      getGroupingInfo(this.searchform.groupId).then((res) => {
        this.dueQuantity = res.data.itemCount
        this.actualQuantity = res.data.itemReceived
      });
    },
    // 重置
    resetForm() {
      this.searchform = {
        phase: "",
        groupId: "",
        status: "",
        importantType: "",
        node: "",
        type: "",
        regulationCode: "",
        regulationName: "",
        deptId: "",
        officeId: "",
        designerUserId: "",
        profession: "",
        deliverable: "",
        regulatoryCompliance: "",
        schemeType: "",
        page: 1,
        rows: 30,
        total: 0,
      };
      this.searchform.groupId = this.$route.params.Id;
      this.searchform.phase = this.$route.params.phase;
      this.getListInfo();
    },
    // 选择部门
    selectDept(data) {
      if (data.itemArray.length > 0) {
        this.searchform.deptId = data.itemArray[0].linkId;
      } else {
        this.searchform.deptId = null;
      }
    },
    // 选择科室
    selectOffice(data) {
      if (data.itemArray.length > 0) {
        this.searchform.officeId = data.itemArray[0].linkId;
      } else {
        this.searchform.officeId = null;
      }
    },
    // 选择科室
    selectProfessionDesigner(data) {
      if (data.itemArray.length > 0) {
        this.searchform.designerUserId = data.itemArray[0].linkId;
      } else {
        this.searchform.designerUserId = null;
      }
    },
    handleSizeChange(val) {
      this.$refs.content.scrollTop = 0;
      this.searchform.rows = val;
      this.searchform.page = 1;
      this.getListInfo();
    },
    handleCurrentChange(val) {
      this.$refs.content.scrollTop = 0;
      this.searchform.page = val;
      this.getListInfo();
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },
    // 已办
    doneInfo() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].id);
      }
      getDoneAjax(_ids).then((res) => {
        if (res.data==='ok') {
          this.$message({
            message: "已办",
            type: "success",
            duration: 1000,
            onClose: () => {
              let doObj = {};
              doObj.action = "moreList";
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },
          });
          this.getListInfo();
        }
      });
    },
    // 退回
    returnBack() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].taskId);
      }
      if(sysEnv==1){
        let url = "/project/index.html#/withdrawPage/" + JSON.stringify(_ids)+'/'+this.searchform.phase+'/'+this.projectId;
        EcoUtil.getSysvm().openDialog("退回", url, 700, 200, "12vh");
      }else{
        this.$router.push({
          name: "withdrawPage",
          params: {ids:JSON.stringify(_ids),phase:this.searchform.phase,projectId:this.projectId},
        });
      }
    },
    // 反馈
    detailItem(taskId,id) {
      if (sysEnv == 1) {
        let url = "/project/index.html#/detailTaskInfo/" + taskId +"?phase="+this.searchform.phase+'&id='+id;
        EcoUtil.getSysvm().openDialog("任务详情", url, 800, 500, "12vh");
      } else {
        this.$router.push({
          name: "detailTaskInfo",
          params: { taskId },
        });
      }
    },
    // 导出
    exportFun() {
      getGroupedExportAjax(this.searchform).then((res) => {
        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
          navigator.msSaveBlob(new Blob([res.data],"任务清单.xlsx"));
        }else{
          let blob = new Blob([res.data], { type: 'application/octet-stream' });
          EcoFile.downloadFile(blob, "任务清单.xlsx");
        }
      })
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "editfeedback") {
          window.liaisonvm.getListInfo();
        }else if(obj.action == 'withdraw'){
          window.liaisonvm.$message({
            message: "退回成功",
            type: "success",
            duration: 1000,
          });
          window.liaisonvm.getListInfo();
        }else if(obj.action === 'onlyDone'){
          //详情已办
          window.liaisonvm.$message({
            message: "已办",
            type: "success",
            // duration: 1000,
            // onClose: () => {
            //   let doObj = {};
            //   doObj.action = "moreList";
            //   doObj.close = true;
            //   EcoUtil.getSysvm().callBackDialogFunc(doObj);
            // },
          });
          window.liaisonvm.getListInfo();
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "liaisonvm");
    },
  },
};
</script>

<style scoped>
.handleStripes {
  padding: 0px 15px 20px 15px;
  background-color: #fff;
}
.handleStripes .toolbar {
  margin-top: 10px;
  margin-bottom: 10px;
}
.handleStripes .searchBox {
  font-size: 14px;
  padding: 10px 20px;
  line-height: 30px;
  overflow-y: auto;
  background-color: #fafafa;
}
.handleStripes .itemInput {
  display: inline-block;
  width: 150px;
  margin-right: 10px;
}
.handleStripes .itemInputLong {
  display: inline-block;
  width: 230px;
  margin-right: 10px;
}
.handleStripes .itemInputLLong {
  display: inline-block;
  width: 300px;
  margin-right: 10px;
}
.handleStripes .detailSpan {
  cursor: pointer;
  color: #409eff;
}
.handleStripes .showInfo {
  margin-left: 20px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 700;
  color: red;
}
</style>
