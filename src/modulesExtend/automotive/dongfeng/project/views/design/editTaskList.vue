<template>
  <eco-content top="0px" bottom="0px" class="editTaskList">
    <eco-content top="0px" bottom="50px">
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
              <el-select :disabled = 'stage == "contactConfirm" ? true : false' style="width:100%" v-model="baseInfo.importantType" placeholder="请选择">
                <el-option v-for="item in importantType" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
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
              <el-select @change="changeFun" filterable style="width:100%" v-model="baseInfo.profession" placeholder="请选择">
                <el-option v-for="item in profession" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交付物" prop="deliverable">
              <el-select disabled style="width:100%" v-model="baseInfo.deliverable" placeholder="请选择">
                <el-option v-for="item in deliverable" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
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
          </el-row>
        <el-row>
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
              <!-- <el-input class="content" type="textarea" :rows="3" v-html="baseInfo.articleContent" disabled>
              </el-input> -->
              <ckeditor  disabled :readOnly='true'  ref="articleEditor" :content="baseInfo.articleContent" height='200px'></ckeditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </eco-content>

    <eco-content bottom="0px" height="50px">
      <div class="btn">
        <el-button @click="cancelFunc">取消</el-button>
        <el-button type="primary" @click="saveFun">保存</el-button>
      </div>
    </eco-content>

  </eco-content>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { EcoUtil } from "@/components/util/main.js";
import {
  getEnumSelectEnabled,
  getDesignDetailAjax,
  updateTaskInfo,
  getchangeFunAjax
} from "../../service/service";
import tagSelect from "@/components/orgPick/tagSelect.vue";
import ckeditor from '../components/ckeditor.vue'
export default {
  components: {
    ecoContent,
    tagSelect,
    ckeditor
  },
  data() {
    return {
      importantType: [],
      node: [],
      type: [],
      profession: [],
      deliverable: [],
      taskId: "",
      baseInfo: {},
      stage:'',
      projectId:''
    };
  },
  created() {
    this.taskId = this.$route.params.taskId;
    this.stage = this.$route.params.stage;
    this.projectId = this.$route.params.proId;
    this.getbaseInfo();
    this.getDetailInfo();
  },
  methods: {
    // 获取基础数据
    getbaseInfo() {
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
    },
    getDetailInfo() {
      getDesignDetailAjax(this.taskId).then((res) => {
        this.baseInfo = res.data;
      });
    },
    changeFun(val) {
      getchangeFunAjax(this.projectId,val).then((res) => {
        if(res.data) {
          this.baseInfo.deptName = res.data.deptName
          this.baseInfo.deptId = res.data.deptId
          this.baseInfo.officeName = res.data.officeName
          this.baseInfo.officeId = res.data.officeId
          this.baseInfo.contactUserName = res.data.contactUserName
          this.baseInfo.contactUserId = res.data.contactUserId
          this.baseInfo.designerUserName = res.data.designerUserName
          this.baseInfo.designerUserId = res.data.designerUserId
        }
      })
    },
    cancelFunc() {
      EcoUtil.getSysvm().closeDialog();
    },
    saveFun() {
      updateTaskInfo(this.taskId,this.baseInfo).then((res) => {
        if (res.data) {
          this.$message({
            message: "保存成功",
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
  },
};
</script>
<style scoped>
.editTaskList {
  padding: 0px 20px 20px 20px;
  background-color: #fff;
}
.editTaskList .btn {
  text-align: right;
  margin-right: 10px;
  margin-top: 10px;
}
.editTaskList .content{
  width:100%;
  box-sizing: border-box;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  background-color: #F5F7FA;
  color: #C0C4CC;
  padding: 0 15px;
}
</style>
