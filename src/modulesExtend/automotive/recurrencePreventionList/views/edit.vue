<template>
    <div class='recurrenceEdit'>
        <div class='editForm'>
            <el-form :model='formData' ref='recurrenceForm' :rules='rules' v-loading='loading' label-width='200px' label-position='right'>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='标题:' prop='title'>
                            <el-input style="width:100%" v-if='isEdit' placeholder='请输入' v-model='formData.title' :disabled='caseType=="editCase" && fromPage=="finishList"'></el-input>
                            <span class="viewContent" v-else>{{formData.title}}</span>
                        </el-form-item>
                    </el-col>     
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='问题描述及风险:' prop='problemDesc'>
                            <el-input v-if='isEdit' v-model='formData.problemDesc' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.problemDesc}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
               <el-row>
                    <el-col :span='22'>
                        <el-form-item label='问题原因:' prop='problemReason'>
                            <el-input v-if='isEdit' v-model='formData.problemReason' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.problemReason}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='解决方案:' prop='solution'>
                            <el-input v-if='isEdit' v-model='formData.solution' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.solution}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='标准编号:' prop='standardNumber'>
                            <!-- <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardNumber'></el-input> -->
                            <div class='selectStandardNumber' @click.stop='selectStandardNumber' v-if='isEdit'>{{formData.standardNumber||'请选择'}}</div>
                            <span class="viewContent" v-else>{{formData.standardNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='标准名称:' prop='standardName'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.standardName'></el-input>
                            <span class="viewContent" v-else>{{formData.standardName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='标准相关要求:' prop='standardRequire'>
                            <el-input v-if='isEdit' v-model='formData.standardRequire' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.standardRequire}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='法规专业积累(再发防止):' prop='lawsAccumulate'>
                            <el-input v-if='isEdit' v-model='formData.lawsAccumulate' type='textarea' :rows='4' resize='none' show-word-limit maxlength='1000'
                                placeholder='请输入'></el-input>
                            <span class="viewContent" v-else>{{formData.lawsAccumulate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='项目:' prop='project'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.project' style='width:100%'></el-input>
                            <span class="viewContent" v-else>{{formData.project}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label='阶段:' prop='stage'>
                            <el-input v-if='isEdit' placeholder='请输入' v-model='formData.stage'></el-input>
                            <span class="viewContent" v-else>{{formData.stage}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label='年份:' prop='year'>
                            <el-date-picker v-if='isEdit' v-model="formData.year" value-format='yyyy' type="year" placeholder="选择年"></el-date-picker>
                            <span class="viewContent" v-else>{{formData.year}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='22'>
                        <el-form-item label='法规文档:'>
                          <!-- .doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf -->
                            <upload :isEdit='isEdit' :showList='true' :multiple="false" :modular="modular" :modularInnerId="recurrenceModularInnerId"
                                @fileChange="fileChange" @preView='preView' @fileOnSuccess="fileOnSuccess" accept=''
                                @beforeFileUpload="beforeFileUpload">
                                <el-button slot="uploadBtn" size="medium" class="uploadBtn">
                                    <i class="el-icon-plus"></i> 上传附件</el-button>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="btn" v-if='isEdit'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">保存</el-button>
            <el-button type="primary" size="medium" @click="submitCase" v-if='fromPage==="organizationList" && isShowSubmitBtn'>提交</el-button>
        </div>
    </div>
</template>
<script>
var _self;
import { EcoUtil } from "@/components/util/main.js";
import { EcoFile } from "@/components/file/main.js";
import {getRoleBtnSetting,recurrencePreventionSaveSubmit,getItemFetchId,recurrencePreventionUpdate,recurrencePreventionDetails,recurrencePreventionAdd,recurrencePreventionApplyUpdate} from "../service/service.js";
import upload from "./components/upload.vue";
import { mapState,mapMutations } from "vuex";
export default {
  name: "recurrenceEdit",
  data() {
    return {
      isShowSubmitBtn:false,
      formData: {
        title: "",
        problemDesc: "",
        problemReason:"",
        solution: "",
        standardNumber: "",
        standardName: "",
        standardRequire: "",
        lawsAccumulate: "",
        project: "",
        stage: "",
        year: ""
      },
      loading: false,
      modular: "recurrence_documents",
      recurrenceModularInnerId: "",
      fileList: []
    };
  },
  computed: {
    ...mapState(["publicRole"]),
    id() {
      return this.$route.params.id;
    },
    caseType() {
      return this.$route.params.caseType;
    },
    isEdit() {
      return this.caseType !== "viewCase";
    },
    fromPage() {
      return this.$route.params.fromPage;
    },
    ruleKeys() {
      return {
        title: "标题",
        problemDesc: "问题描述及风险",
        problemReason:"问题原因",
        solution: "解决方案",
        standardNumber: "标准编号",
        standardName: "标准名称",
        standardRequire: "标准相关要求",
        lawsAccumulate: "法规专业积累",
        project: "项目",
        stage: "阶段",
        year: "年份"
      };
    },
    rules() {
      var obj = {};
      for (var key in this.ruleKeys) {
        var trigger = key == "year" ? "change" : "blur";
        obj[key] = [
            {
              required: true,
              message: `${this.ruleKeys[key]}为必填项`,
              trigger: trigger
            }
          ];
      }
      return obj;
    }
  },
  components: {
    upload
  },
  created() {
    _self = this;
    this.initRole();
    if (this.id && this.id != "0") {
      this.getDetailsInfo();
    } else {
      getItemFetchId().then(res => {
        this.recurrenceModularInnerId = res.data;
      });
    }
  },
  mounted(){
    if(this.isEdit && this.fromPage=="organizationList"){
        this.callAction();
    }
  },
  methods: {
    ...mapMutations(["SET_PUBLIC_ROle"]),
    initRole(){
        let btn_array=[
           'recurrence_prevention.management_SUBMIT_RECURRENCE'
        ];
        getRoleBtnSetting(btn_array).then(res=>{  
           this.isShowSubmitBtn = res.data.authenticationMap['recurrence_prevention.management_SUBMIT_RECURRENCE'];
           this.SET_PUBLIC_ROle(res.data.authenticationMap);
        })
    },
    selectStandardNumber(){
      if(this.caseType==='addCase'){
          var url = '/recurrencePreventionList/index.html#/regulatoryFormList'
          EcoUtil.getSysvm().openDialog('法规跟踪表', url, 1000, 600, '15vh');
      }
    },
    callAction() {
      let callBackDialogFunc = function (obj) {
        if(obj && (obj.action === 'appropeUser')){
             _self.doSubmit(obj.data.assigneeId);
        }else if(obj && (obj.action === 'selectStandardNumber')){
             _self.formData.standardNumber = obj.data.regulationCode;
             _self.formData.standardName = obj.data.regulationName;
        }   
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'recurrencePreventionList');
    },
    doSubmit(assigneeId){
      this.$refs.recurrenceForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
                title: this.formData.title,
                problemDesc: this.formData.problemDesc,
                problemReason:this.formData.problemReason,
                solution: this.formData.solution,
                standardNumber: this.formData.standardNumber,
                standardName: this.formData.standardName,
                standardRequire: this.formData.standardRequire,
                lawsAccumulate: this.formData.lawsAccumulate,
                project: this.formData.project,
                stage: this.formData.stage,
                year: this.formData.year
          };
          if (this.caseType === "editCase") {
            params.id = this.id;
          } else {
            //新增
            params.id = this.recurrenceModularInnerId;
          }
          recurrencePreventionSaveSubmit(params,assigneeId).then(res => {
              this.loading = false;
              let doObj = {}
              doObj.action = 'submitCase';
              doObj.data = {};
              doObj.close = true;
              EcoUtil.getSysvm().callBackDialogFunc(doObj);
          }).catch(err => {
                this.loading = false;
          })
        } else {
          return false;
        }
      });
      
    },
    submitCase(){
         //提交 打开选择审批页面
         var url;
         if(this.caseType ==='editCase' && this.formData.status==='REJECT'){
            url = '/recurrencePreventionList/index.html#/appropeUser?assigneeId='+this.formData.approveUser;
         }else{
            url = '/recurrencePreventionList/index.html#/appropeUser';
         }
         EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
    },
    numberInput(key) {
      if (this.formData[key]) {
        if (/^\d+(\.(\d+)?)?$/.test(this.formData[key])) {
          var len = this.formData[key].length - 1;
          if (this.formData[key].indexOf(".") == -1) {
            this.formData[key] = this.formData[key] + ".00";
          } else if (this.formData[key].indexOf(".") === len) {
            this.formData[key] = this.formData[key] + "00";
          } else if (this.formData[key].indexOf(".") === len - 1) {
            this.formData[key] = this.formData[key] + "0";
          }
          //开头为0
          if (this.formData[key][0] == "0" && this.formData[key][1] !== ".") {
            this.formData[key] = this.formData[key].slice(1);
          }
        } else {
          this.formData[key] = this.formData[key].replace(/[^\d]/g, "");
        }
      }
    },
    onCancel() {
      EcoUtil.getSysvm().closeDialog();
    },
    onSubmit() {
      this.$refs.recurrenceForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
                title: this.formData.title,
                problemDesc: this.formData.problemDesc,
                problemReason:this.formData.problemReason,
                solution: this.formData.solution,
                standardNumber: this.formData.standardNumber,
                standardName: this.formData.standardName,
                standardRequire: this.formData.standardRequire,
                lawsAccumulate: this.formData.lawsAccumulate,
                project: this.formData.project,
                stage: this.formData.stage,
                year: this.formData.year
          };
          if (this.caseType === "editCase") {
            params.id = this.id;
            if (this.fromPage == "finishList") {
              recurrencePreventionApplyUpdate(params).then(res=>{
                  this.loading = false;
                  let doObj = {};
                  doObj.action = 'applyEdit';
                  doObj.data = {};
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }).catch(err => {
                  this.loading = false;
              })
            } else {
              recurrencePreventionUpdate(params).then(res => {
                  this.loading = false;
                  let doObj = {};
                  doObj.action = 'edit';
                  doObj.data = {};
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }).catch(err => {
                  this.loading = false;
              })
            }
          } else {
            //新增
            params.id = this.recurrenceModularInnerId;
            recurrencePreventionAdd(params).then(res => {
                this.loading = false;
                let doObj = {}
                doObj.action = 'add';
                doObj.data = {};
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            }).catch(err => {
                this.loading = false;
            })
          }
        } else {
          return false;
        }
      });
    },
    getDetailsInfo() {
      this.loading = true;
      recurrencePreventionDetails(this.id).then(res => {
          this.formData = res.data;
          this.recurrenceModularInnerId = res.data.id;
          this.loading = false;
      })
    },
    fileOnSuccess(response) {},
    preView(item) {
      EcoFile.openFileHeaderByView(item.id, item.name);
    },
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    beforeFileUpload(file, callback) {
      // var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLocaleLowerCase();
      // const extension = testmsg === "doc";
      // const extension2 = testmsg === "docx";
      // const extension3 = testmsg === "xls";
      // const extension4 = testmsg === "xlsx";
      // const extension5 = testmsg === "ppt";
      // const extension6 = testmsg === "pptx";
      // const extension7 = testmsg === "txt";
      // const extension8 = testmsg === "pdf";
      // if (!extension &&!extension2 &&!extension3 &&!extension4 &&!extension5 &&!extension6 &&!extension7 &&!extension8) {
      //   this.$message({
      //     message:
      //       "上传文件只能是.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf格式!",
      //     type: "warning",
      //     customClass: "message",
      //     offset: 160
      //   });
      // }
      // callback(extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8);
      callback(true);
    }
  }
};
</script>
<style scoped>
.recurrenceEdit {
  background: #fff;
  height: 100%;
}

.recurrenceEdit .editForm {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  padding: 0 10px;
}

.recurrenceEdit .editForm .el-input,
.recurrenceEdit .editForm .el-select,
.recurrenceEdit .editForm .el-date-editor {
  width: 225px;
}

.recurrenceEdit .viewContent {
  color: #606266;
}

.recurrenceEdit .uploadBtn {
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

.recurrenceEdit .btn {
  text-align: center;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
}
.recurrenceEdit .selectStandardNumber{
  width:200px;
  height:28px;
  border:1px solid #DCDFE6;
  border-radius:4px;
  cursor: pointer;
  box-sizing: border-box;
  padding-left: 15px;
  font-size:12px;
  color:rgb(193, 195, 197);
  line-height:25px;
}
</style>