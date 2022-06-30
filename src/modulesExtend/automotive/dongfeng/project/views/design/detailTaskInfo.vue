<template>
  <eco-content top="0px" bottom="0px" class="detailTaskInfo">

    <div class="title">基本信息</div>
    <el-form ref="form" :model="baseInfo" label-width="150px" label-position="right" style="padding-right:20px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属平台" prop="platformName">
            <el-input style="width:100%" v-model="baseInfo.platformName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input style="width:100%" v-model="baseInfo.projectName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属节点" prop="node">
            <el-input style="width:100%" v-model="baseInfo.nodeName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="重要类型" prop="importantType">
            <el-input style="width:100%" v-model="baseInfo.importantTypeName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-input style="width:100%" v-model="baseInfo.typeName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划开始日期" prop="planStartDate">
            <el-date-picker disabled style="width:100%" type="date" v-model="baseInfo.planStartDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="计划完成日期" prop="planCompleteDate">
            <el-date-picker disabled style="width:100%" type="date" v-model="baseInfo.planCompleteDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-input style="width:100%" v-model="baseInfo.deptName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属科室" prop="officeId">
            <el-input style="width:100%" v-model="baseInfo.officeName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="专业" prop="profession">
            <el-input style="width:100%" v-model="baseInfo.professionName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="交付物" prop="deliverable">
            <el-input style="width:100%" v-model="baseInfo.deliverableName" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联络人" prop="contactUser">
            <el-input style="width:100%" v-model="baseInfo.contactUserName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设计师" prop="designerUserName">
            <el-input style="width:100%" v-model="baseInfo.designerUserName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="标准法规号" prop="regulationCode">
            <el-input style="width:100%" v-model="baseInfo.regulationCode" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="标准法规名称" prop="regulationName">
            <el-input style="width:100%" v-model="baseInfo.regulationName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="条文号" prop="articleCode">
            <el-input style="width:100%" v-model="baseInfo.articleCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="条文标题" prop="articleTitle">
            <el-input style="width:100%" v-model="baseInfo.articleTitle" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="条文内容" prop="articleContent">
            <!-- <el-input style="width:100%" type="textarea" :rows="3" v-model="baseInfo.articleContent" disabled>
            </el-input>  -->
            <ckeditor  disabled :readOnly='true'  ref="articleEditor" :content="baseInfo.articleContent" height='200px'></ckeditor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="title">反馈结果</div>
    <el-form :model="feedback" label-width="150px" label-position="right" style="padding-right:20px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="方案类型" prop="schemeType">
            <el-select style="width:100%" disabled v-model="feedback.schemeType" placeholder="请选择">
              <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法规符合性" prop="regulatoryCompliance">
            <el-select disabled style="width:100%" v-model="feedback.regulatoryCompliance" placeholder="请选择">
              <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="说明" prop="description">
            <el-input style="width:100%" v-model="feedback.description" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :class='{"marginB2":btnIshow}'>
        <el-col :span="20">
          <el-form-item label="支撑材料" prop="articleCode">
            <!-- accept='.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf' -->
            <upload :isEdit='false' :showList='true' :multiple="false" modular="PRO_FEEDBACK" :modularInnerId="taskId" @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept='' @beforeFileUpload="beforeFileUpload">
              <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                <i class="el-icon-plus"></i> 上传文档
              </el-button>
            </upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <div class="title">审核结果</div>
    <el-form :model="baseInfo" label-width="150px" label-position="right" style="padding-right:20px;">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门专业负责人" prop="platformName">
            <div class="checkbox">
              <div v-for="(item,index) in approval.deptProfessionLeaderList" :key="index">
                <div v-if='item.pending'>
                   <span>{{item.dept}}-{{item.user}}  (待办)</span>
                </div>
                <div v-else-if='item.approving'>
                  <span>{{item.dept}}-{{item.user}}  (待审)</span>
                </div>
                <div v-else>
                  <span>{{item.dept}}-{{item.user}}  {{item.time}}</span><br>
                  <span>{{item.opinion}}</span>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="法规项目联络人" prop="node">
            <div class="checkbox">
              <div v-for="(item,index) in approval.regulationContactList" :key="index">
                  <div v-if='item.pending'>
                    <span>{{item.dept}}-{{item.user}}  (待办)</span>
                  </div>
                  <div v-else-if='item.approving'>
                    <span>{{item.dept}}-{{item.user}}  (待审)</span>
                  </div>
                  <div v-else>
                    <span>{{item.dept}}-{{item.user}}  {{item.time}}</span><br>
                    <span>{{item.opinion}}</span>
                  </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="法规专业负责人" prop="type">
            <div class="checkbox">
              <div v-for="(item,index) in approval.regulationProfessionLeaderList" :key="index">
                <div v-if='item.pending'>
                  <span>{{item.dept}}-{{item.user}}  (待办)</span>
                </div>
                <div v-else-if='item.approving'>
                  <span>{{item.dept}}-{{item.user}}  (待审)</span>
                </div>
                <div v-else>
                  <span>{{item.dept}}-{{item.user}}  {{item.time}}</span><br>
                  <span>{{item.opinion}}</span>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->
    <div class='btnBox'>
      <div class="btn" v-show='btnIshow'>
        <el-button @click='doneInfo'>确定</el-button>
        <el-button @click='returnBack' type="primary">退回</el-button>
      </div>
    </div>
  </eco-content>
</template>
<script>
import upload from "./upload/upload.vue";
import { EcoUtil } from "@/components/util/main.js";
import { EcoFile } from "@/components/file/main.js";
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { sysEnv } from "@/modulesExtend/automotive/dongfeng/project/config/env";
import {
  getHandleDetailAjax,
  getEnumSelectEnabled,
  getDoneAjax
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import ckeditor from '../components/ckeditor.vue'
export default {
  components: {
    ecoContent,
    tagSelect,
    upload,
    ckeditor
  },
  data() {
    return {
      id:'',
      phase:'',
      taskId: "",
      baseInfo: {},
      feedback: {},
      approval: {},
      regulatoryCompliance: [],
      schemeType: [],
      fileList:[],
    };
  },
  created() {
    this.taskId = this.$route.params.taskId;
    this.phase = this.$route.query.phase;
    this.id = this.$route.query.id;
    this.getbaseInfo();
    this.getDetailInfo();
  },
  computed:{
     btnIshow(){
       return ['deptProResponsibleApproval','regulationContactApproval','regulationProResponsibleApproval'].includes(this.phase);
     }
  },
  methods: {
    listAction() {
      let callBackDialogFunc = function (obj) {
        if (obj.action == "withdraw") {
          let doObj = {}
          doObj.action = 'withdraw';
          doObj.data = {};
          doObj.close = true;
          EcoUtil.getSysvm().callBackDialogFunc(doObj);         
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "detailTaskInfo");
    },
    // 退回
    returnBack() {
      let _ids = [this.id];
      if(sysEnv==1){ 
        let url = "/project/index.html#/withdrawPage/" + JSON.stringify(_ids)+'/'+this.phase+'/'+this.baseInfo.projectId;
        EcoUtil.getSysvm().openDialog("退回", url, 700, 200, "12vh");
      }else{
        this.$router.push({
          name: "withdrawPage",
          params: {ids:JSON.stringify(_ids),phase:this.phase,projectId:this.baseInfo.projectId},
        });
      }
    },
    doneInfo(){
      getDoneAjax([this.id]).then((res) => {
        if (res.data=='ok') {
          let doObj = {};
          doObj.action = "onlyDone";
          doObj.close = true;
          EcoUtil.getSysvm().callBackDialogFunc(doObj);
        }
      });
    },
    // 获取基础数据
    getbaseInfo() {
      // 法规符合性
      getEnumSelectEnabled("FGFHX").then((res) => {
        this.regulatoryCompliance = res.data;
      });
      // 方案类型
      getEnumSelectEnabled("FALX").then((res) => {
        this.schemeType = res.data;
      });
    },
    getDetailInfo() {
      getHandleDetailAjax(this.taskId).then((res) => {
        this.baseInfo = res.data.task;
        if (res.data.feedback) {
          this.feedback = res.data.feedback;
        }
        this.approval = res.data.approval;
      });
    },
    preView(item) {
      EcoFile.openFileHeaderByView(item.id, item.name);
    },
    fileChange(file, fileList) {
      // console.log(fileList, "123");
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
      callback(true)
    },
    fileOnSuccess(response) {},
  },
};
</script>
<style scoped>
.detailTaskInfo {
  padding: 0px 20px 20px 20px;
  background-color: #fff;
}
.detailTaskInfo .title {
  padding-left: 5px;
  margin: 70px 0 10px 70px;
  font-weight: 700;
  border-left: 5px solid #409eff;
}
.detailTaskInfo .viewAttachments .fileItem {
  color: #606266;
  margin-left: 0px;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-size: 14px;
}

.detailTaskInfo .viewAttachments .fileItem .download {
  margin-right: 5px;
  cursor: pointer;
  color: #3891eb;
}

.detailTaskInfo .viewAttachments .fileItem .preview {
  margin-left: 5px;
  cursor: pointer;
  color: #3891eb;
}

.detailTaskInfo .viewAttachments .fileItem .recovery {
  margin-left: 5px;
  cursor: pointer;
  color: #e03a3a;
}

.detailTaskInfo .viewAttachments .fileItem .imgType {
  width: 16px;
  height: 16px;
}
.detailTaskInfo .btnBox{
  position: fixed;
  bottom:0px;
  height:50px;
  left:0px;
  right:0px;
  background-color: #fff;
}
.detailTaskInfo .btn {
  text-align: right;
  margin-right: 10px;
  margin-top: 10px;
}
.detailTaskInfo .marginB2{
  margin-bottom: 25px;
}
</style>
