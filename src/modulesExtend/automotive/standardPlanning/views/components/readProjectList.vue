<template>
  <div class="projectList">
    <el-form ref="form" :model="form" label-width="130px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准名称">
            <el-input v-model="form.programName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准标号">
            <el-input v-model="form.programNumber" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="适用范围、目的" prop="applicationScope">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.applicationScope" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="标准的主要内容" prop="mainContent">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.mainContent" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="需要解决的主要问题和补充实验，研究内容">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.mainProblem" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="相关的国际标准、国外先进标准和国内相关标准（名称、编号）" prop="relatedStandard">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.relatedStandard" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="对实际工作的指导作用" prop="guidingFunction">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.guidingFunction" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input style=" margin-top: 10px;" type="textarea" :rows="4"  v-model="form.remarks" readonly>
        </el-input>
      </el-form-item>
      <el-form-item label="相关文档">
        <upload :isEdit='false' :showList='true' :multiple="false" :modular="modular" :modularInnerId="id" @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept='' @beforeFileUpload="beforeFileUpload">
          <el-button slot="uploadBtn" size="medium" class="uploadBtn">
            <i class="el-icon-plus"></i> 上传附件
          </el-button>
        </upload>
      </el-form-item>
      <!-- <el-form-item>
        <div class="btn">
          <el-button type="primary" @click="saveTable('form')">保 存</el-button>
          <el-button @click="onClose">取 消</el-button>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
import upload from "./upload/upload.vue";
import { EcoUtil } from "@/components/util/main.js";
import { EcoFile } from "@/components/file/main.js";
import { getProjectList, saveProjectListAjax } from "../../service/service.js";
export default {
  components: {
    upload,
  },
  data() {
    return {
      form: {},
      id: "",
      modular: "STANDARD_PROJECT_DOCTMENT",
      fileList: [],
      rules: {
        applicationScope: [
          { required: true, message: "请输入适用范围、目的", trigger: "blur" },
        ],
        mainContent: [
          { required: true, message: "请输入标准的主要内容", trigger: "blur" },
        ],
        relatedStandard: [
          {
            required: true,
            message:
              "请输入相关的国际标准、国外先进标准和国内相关标准（名称、编号）",
            trigger: "blur",
          },
        ],
        guidingFunction: [
          {
            required: true,
            message: "请输入对实际工作的指导作用",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getform();
  },
  methods: {
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
    getform() {
      getProjectList(this.id).then((res) => {
        this.form = res.data.data;
      });
    },
    saveTable(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveProjectListAjax(this.form).then((res) => {
            if (res.data.success) {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  let doObj = {};
                  doObj.action = "projectList";
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
                },
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    onClose() {
      EcoUtil.getSysvm().closeDialog();
    },
  },
};
</script>
<style scoped>
.projectList {
  margin: 10px 20px;
}
.projectList .btn {
  text-align: right;
  margin: 20px 10px;
}
.projectList .uploadBtn {
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