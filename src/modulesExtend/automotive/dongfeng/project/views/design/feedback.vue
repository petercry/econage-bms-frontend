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
        <el-col :span='24'>
          <el-form-item label='条文释义' prop='articleInterpretation'>
            <el-input style="width:100%" type="textarea" resize='none' :rows="4" v-model="baseInfo.articleInterpretation" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="条文内容" prop="articleContent">
            <!-- <el-input style="width:100%" type="textarea" :rows="3" v-model="baseInfo.articleContent" disabled>
            </el-input> -->
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
            <el-select :disabled='caseType!=="editCase"' style="width:100%" v-model="feedback.schemeType" placeholder="请选择">
              <el-option v-for="item in schemeType" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法规符合性" prop="regulatoryCompliance">
            <el-select :disabled='caseType!=="editCase"' style="width:100%" v-model="feedback.regulatoryCompliance" placeholder="请选择">
              <el-option v-for="item in regulatoryCompliance" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="说明" prop="description">
            <el-input :disabled='caseType!=="editCase"' style="width:100%" v-model="feedback.description" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="支撑材料" prop="articleCode">
            <upload :isEdit='(caseType=="editCase")' :showList='true' :multiple="false" modular="PRO_FEEDBACK" :modularInnerId="taskId" @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept='' @beforeFileUpload="beforeFileUpload">
              <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                <i class="el-icon-plus"></i> 上传文档
              </el-button>
            </upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <div class="title">审核结果</div>
    <el-form :model="approval" label-width="150px" label-position="right" style="padding-right:20px;">
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
    <div class="btn" v-if='caseType=="editCase"'>
      <el-button @click="cancelFunc">取消</el-button>
      <el-button type="primary" @click="saveFun">保存</el-button>
    </div>
  </eco-content>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import upload from "./upload/upload.vue";
import { EcoFile } from "@/components/file/main.js";
import { EcoUtil } from "@/components/util/main.js";
import {
  getHandleDetailAjax,
  getEnumSelectEnabled,
  saveFeedbackAjax,
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
      caseType:'',
      taskId: "",
      baseInfo: {},
      feedback: {
        schemeType: "",
        regulatoryCompliance: "",
        description: "",
      },
      approval: {},
      regulatoryCompliance: [],
      schemeType: [],
      fileList:[],
    };
  },
  created() {
    this.caseType = this.$route.params.caseType;
    this.taskId = this.$route.params.taskId;
    this.getbaseInfo();
    this.getDetailInfo();
  },
  methods: {
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
    cancelFunc() {
      EcoUtil.getSysvm().closeDialog();
    },
    saveFun() {
      saveFeedbackAjax(this.taskId, this.feedback).then((res) => {
        if (res.data) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              let doObj = {};
              doObj.action = "editfeedback";
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },
          });
        }
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
      callback(true);
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
.detailTaskInfo .btn {
  text-align: right;
  margin-right: 10px;
  margin-top: 10px;
}
.detailTaskInfo .uploadBtn {
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
</style>
