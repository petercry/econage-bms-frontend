<template>
  <div class="handleStripes">
    <div>
      <div class="toolbar">
        <el-button type='primary' @click='searchArea'>高级搜索</el-button>
        <el-button type="primary" @click="Issue" v-if='caseType==="editCase"'>提交</el-button>
        <el-button type="primary" @click="batchProcessing" v-if='caseType==="editCase"'>批量办理</el-button>
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

        <!-- <span>类型：</span>
        <div class="itemInput">
          <el-select v-model="searchform.type" placeholder="请选择">
            <el-option v-for="item in type" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </div> -->

        <span>标准法规号：</span>
        <div class="itemInput">
          <el-input v-model="searchform.regulationCode" placeholder="请输入内容"></el-input>
        </div>


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
      </div>

      <div class="searchBox" v-show='flag'>
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
        <!-- <el-table-column prop="statusName" label="状态" width="120">
        </el-table-column> -->
        <el-table-column prop="regulatoryComplianceName" label="法规符合性">
        </el-table-column>
        <!-- <el-table-column prop="importantTypeName" label="重要类型">
        </el-table-column>
        <el-table-column prop="nodeName" label="所属节点">
        </el-table-column>
        <el-table-column prop="regulationCode" label="标准法规号">
        </el-table-column>
        <el-table-column prop="regulationName" label="标准法规名称" width='150'>
        </el-table-column> -->
        <el-table-column prop="articleCode" label="条文号">
        </el-table-column>
        <!-- <el-table-column prop="deptName" label="所属部门">
        </el-table-column>
        <el-table-column prop="officeName" label="所属科室">
        </el-table-column> -->
        <el-table-column prop='articleContent' label='条文内容' width='250'>
          <template slot-scope='scope'>
            <div class="articleContentBox"  v-ckeditor='scope.row.articleContent' ></div>
          </template>
      </el-table-column>
      <el-table-column prop='articleInterpretation' label='条文释义' width='200'></el-table-column>
        <el-table-column prop="professionName" label="专业" width="160">
        </el-table-column>
        <el-table-column prop="contactUserName" label="联络人">
        </el-table-column>
        <el-table-column prop="deliverableName" label="交付物">
        </el-table-column>
        <el-table-column prop="rejectCause" label="退回原因">
        </el-table-column>
        <el-table-column  prop="regulatoryCompliance" label="操作" width="60" fixed='right'>
          <template slot-scope="scope">
            <span class="detailSpan" @click="handle(scope.row.taskId,'editCase')" v-if='caseType==="editCase"'>办理</span>
            <span class="detailSpan"  @click="handle(scope.row.taskId,'viewCase')" v-else>查看</span>
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
    <el-dialog title="批量办理" :visible.sync="dialogVisible" width="50%">
      <el-form :model="feedback" label-width="150px" label-position="right" style="padding-right:20px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="方案类型" prop="schemeType">
              <el-select style="width:100%" v-model="feedback.schemeType" placeholder="请选择">
                <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法规符合性" prop="regulatoryCompliance">
              <el-select style="width:100%" v-model="feedback.regulatoryCompliance" placeholder="请选择">
                <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="说明" prop="description">
              <el-input style="width:100%" v-model="feedback.description" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="支撑材料" prop="articleCode">
              <upload :isEdit='true' :showList='true' :multiple="false" modular="PRO_FEEDBACK" @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept='' @beforeFileUpload="beforeFileUpload">
                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                  <i class="el-icon-plus"></i> 上传文档
                </el-button>
              </upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { EcoFile } from "@/components/file/main.js";
import upload from "./upload/upload.vue";
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import { mapState, mapActions } from "vuex";
import {
  getEnumSelectEnabled,
  getStatusAjax,
  getIssueAjax,
  getBackAjax,
  getGroupingInfoAjax,
  getGroupedExportAjax,
  batchProcessingAjax,
  getGroupingInfo
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import { EcoUtil } from "@/components/util/main.js";
export default {
  components: {
    ecoContent,
    tagSelect,
    upload,
  },
  data() {
    return {
      flag:false,
      searchHeight:'60px',
      caseType:'',
      searchform: {
        phase: "designerHandle",
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
      feedback: {
        schemeType: "",
        regulatoryCompliance: "",
        description: "",
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
      dialogVisible: false,
      fileList:[],
      dueQuantity:0,
      actualQuantity:0
    };
  },
  created() {
    this.caseType = this.$route.params.caseType;
    if(this.caseType==='viewCase'){
        this.searchform.itemStatus = this.$route.query.status;
    }
    this.searchform.groupId = this.$route.params.Id;
    this.projectId = this.$route.params.proId;
    this.getbaseInfo();
    this.getListInfo();
    this.listAction();
    window.liaisonvm = this;
  },
  mounted() {},
  methods: {
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
        phase: "designerHandle",
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
    // 下发
    Issue() {
      getIssueAjax(
        this.searchform.phase,
        this.projectId,
        this.searchform.groupId
      ).then((res) => {
        if (res.data) {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              let doObj = {};
              doObj.action = "editTaskList";
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },
          });
        }
      });
    },
    // 反馈
    handle(id,type) {
      if (sysEnv == 1) {
        let title = type=='editCase'?"反馈":"查看"
        let url = "/project/index.html#/feedback/" + id+'/'+type;
        EcoUtil.getSysvm().openDialog(title, url, 800, 500, "12vh");
      } else {
        this.$router.push({
          name: "feedback",
          params: {
            taskId: id,
            caseType:type
          },
        });
      }
    },
    // 导出
    exportFun() {
      getGroupedExportAjax(this.searchform).then((res) => {
        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
          navigator.msSaveBlob(new Blob([res.data],"任务清单.xlsx"));
        }else{
          let blob = new Blob([res.data], { type: "application/octet-stream" });
          EcoFile.downloadFile(blob, "任务清单.xlsx");
        }
      });
    },
    // 批量办理
    batchProcessing() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择一条任务");
        return;
      }
      this.dialogVisible = true;
    },
    saveFun() {
      let _ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        _ids.push(this.multipleSelection[i].taskId);
      }
      let fileHeaderIds = [];
      for (let i = 0; i < this.fileList.length; i++) {
        fileHeaderIds.push(this.fileList[i].id);
      }
      batchProcessingAjax(_ids,this.feedback,fileHeaderIds).then((res) => {
        if (res.data) {
          this.$message({
            message: "办理成功",
            type: "success",
          });
          this.getListInfo();
          this.feedback = {
            schemeType: "",
            regulatoryCompliance: "",
            description: "",
          };
          this.dialogVisible = false;
        }
      });
    },
    preView(item) {
      EcoFile.openFileHeaderByView(item.id, item.name);
    },
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    beforeFileUpload(file, callback) {
      // var testmsg = file.name
      //   .substring(file.name.lastIndexOf(".") + 1)
      //   .toLocaleLowerCase();
      // // const isLt2M = file.size/1024/1024<6
      // const extension = testmsg === "doc";
      // const extension2 = testmsg === "docx";
      // const extension3 = testmsg === "xls";
      // const extension4 = testmsg === "xlsx";
      // const extension5 = testmsg === "ppt";
      // const extension6 = testmsg === "pptx";
      // const extension7 = testmsg === "txt";
      // const extension8 = testmsg === "pdf";
      // if (
      //   !extension &&
      //   !extension2 &&
      //   !extension3 &&
      //   !extension4 &&
      //   !extension5 &&
      //   !extension6 &&
      //   !extension7 &&
      //   !extension8
      // ) {
      //   this.$message({
      //     message:
      //       "上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!",
      //     type: "warning",
      //     customClass: "message",
      //     offset: 160,
      //   });
      // }
      // callback(
      //   extension ||
      //     extension2 ||
      //     extension3 ||
      //     extension4 ||
      //     extension5 ||
      //     extension6 ||
      //     extension7 ||
      //     extension8
      // );
      callback(true);
    },
    fileOnSuccess(response) {
      //上传组件 change事件早于suceess  所以change事件回写的附件信息是前端组件自己生成返回的
      //补fileId
      //uid 是时间戳 两个事件的uid肯定不一样
      //废弃
      // this.fileList.forEach(item=>{
      //    if(item.uid === response.uid && item.name === response.name){
      //       item.id = response.id;
      //    }
      // })
    },
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "editfeedback") {
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
.handleStripes .uploadBtn {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  background: transparent;
  color: #409eff;
  border: 0;
  padding: 5px 20px;
}
.handleStripes .showInfo {
  margin-left: 20px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 700;
  color: red;
}
</style>
