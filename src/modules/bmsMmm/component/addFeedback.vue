<template>
    <div style="display:inline-block;width:100%;height:100%">
      <div style="display:inline-block;width:620px;border-right: 2px solid #ebebeb;padding-right:5px;">
        <template v-if="allowFeedbackFlag&&taskCalendarMountFlag">
          <div style="padding:0px 10px 20px 12px;font-size:16px;line-height:25px;color:#409EFF;font-weight:bold;">
            <span>当前日程计划完成度：{{this.taskCalendarInfoObj.planRate}}%</span><br>
            <span v-if="this.taskCalendarInfoObj.planComments!=null">计划备注：{{this.taskCalendarInfoObj.planComments}}<br></span>
            <span>此任务总预估工时：{{this.taskInfoObj.estimateManHour}}</span><br>
            <span>前置已反馈工时：{{this.taskUsedManHour}}</span>
          </div>
          <div style="margin-bottom:20px;">
              <span style="font-weight:bold;font-size:16px;padding-left:45px;">快捷操作</span>
              <span style="padding-left:10px;">
                  <el-switch v-model="quickDoneFlag" active-text="完成了！" @change="triggerQuickDone"> </el-switch>
              </span>
          </div>
          <el-form label-width="120px" ref="myform" :rules="rules" :model="calendarInfoObj">
              <template v-for="(nodeEl,key) in formItemInfo" >
                  <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                      <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                          <template v-if="nodeEl.eleType=='date'">
                              <el-date-picker v-model="calendarInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                          </template>
                          <template v-else-if="nodeEl.eleType=='textarea'">
                              <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="calendarInfoObj[key]" rows="10" :ref="nodeEl.paramName"></el-input>
                          </template>   
                          <template v-else-if="nodeEl.eleType=='number'">
                            <template v-if="nodeEl.paramName=='feedbackRate'">
                              <el-input  placeholder="请输入完成度" v-model.number="calendarInfoObj[key]" maxlength="3" :ref="nodeEl.paramName" style="width:130px;"></el-input> %
                            </template>  
                            <template v-else-if="nodeEl.paramName=='feedbackManHour'">
                              <el-input  placeholder="请输入日程工时" type="number" v-model="calendarInfoObj[key]" maxlength="3" :ref="nodeEl.paramName" style="width:130px;"></el-input>
                            </template> 
                            <template v-else>  
                              <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="calendarInfoObj[key]" maxlength="3" :ref="nodeEl.paramName"></el-input>
                            </template>  
                          </template>    
                          <template v-else>
                              <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="calendarInfoObj[key]" ></el-input>
                          </template>
                      </el-form-item>
                      <div class="promptTip" v-if="nodeEl.paramName=='feedbackComments'&&taskFinishFlag" style="margin-top:-20px;">"反馈描述"将作为此任务整体的二开反馈，回写至任务流程的“经办工程师反馈”中，请认真填写！</div>
                  </div>
              </template>
              <div key="correctTotalTaskManHour" style="width:98%" class="formItemDiv" v-if="taskFinishFlag">
                <el-form-item label="修正任务总工时" prop="correctTotalTaskManHour" style="font-weight:bold;">
                  <el-input  placeholder="请输入修正后的任务总工时" type="number" v-model="calendarInfoObj['correctTotalTaskManHour']" maxlength="3" ref="correctTotalTaskManHour" style="width:130px;"></el-input>
                </el-form-item>
                <div class="promptTip" style="margin-top:-20px;">"任务总工时"将回写至任务流程的“实际工时”，请认真填写！</div>
              </div>
              <div class="formItemDiv" v-if="taskFinishFlag" >
                <el-button type="warning" size="small" icon="el-icon-paperclip" @click.native="toAddAttachment" style="margin-left:10px;">添加反馈文档</el-button>
                <div class="promptTip">此处上传的文档将作为任务整体的经办反馈文档，并回写至任务流程的“经办工程师反馈文档”中</div>
                <div v-for="(fileNode , fileNodeIdx) in feedbackFileList" :key="fileNodeIdx" style="margin-left:10px;">
                   {{fileNode.name}}
                  <el-button type="text" @click.native="doFilePreviewAction(fileNode)" v-if="_isPreviewFile(fileNode.fileType)" class="fileBtn">预览</el-button>
                  <el-button type="text" @click.native="doFileDownloadAction(fileNode)" class="fileBtn">下载</el-button>
                  <el-button type="text"  @click.native="deleteFile(fileNode.id , fileNode.name)" class="fileBtn" style="color:rgb(230, 162, 60);margin-left:0px;padding:0px;">[删除]</el-button>
                </div>                   
              </div>
          </el-form>
        </template>
        <template v-else-if="!allowFeedbackFlag&&taskCalendarMountFlag">
          <div style="line-height:30px;padding:30px 30px;">
            <span style="color:red;font-weight:bold;">当前日程已由{{this.taskCalendarInfoObj.feedbackInputerName}}于{{formatDateToMinute(this.taskCalendarInfoObj.feedbackCreateTime)}}反馈</span><br>
            <span>反馈完成度：{{this.taskCalendarInfoObj.feedbackRate}}%</span><br>
            <span v-if="this.taskCalendarInfoObj.feedbackComments!=null">反馈备注：{{this.taskCalendarInfoObj.feedbackComments}}</span>
          </div>
        </template>
      </div>
      <div style="display:inline-block;width:calc(100% - 660px);vertical-align:top;height:100%;overflow-y:auto;">
          <taskInfo ref="taskInfoComponent" :taskId="taskId"></taskInfo>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
         
          <ecoFileUploadPopup v-if="dialogTab=='addFile'" modular="bmsTaskCalendarFeedback" :modularInnerId="''+this.taskCalendarInfoObj['id']" ref="addFileWin"></ecoFileUploadPopup>
         
          <div slot="footer" class="dialog-footer" v-if="dialogTab!='addFile'">
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
          </div>
          <div slot="footer" class="dialog-footer" v-else>
            <el-button @click.native="dialogVisible = false">关 闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import {openLoading,closeLoading,feedbackCalendarTaskAjax,getTaskCalendarDetail,dealException,formatDateToMinute,addActionLogForCreate,addActionLogForEdit,getTaskDetail,getTaskUsedManHour,_isPreviewFile,getFeedbackFileList } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import {mapMutations} from 'vuex';
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
export default{
  name:'addFeedback',
  components:{
    ecoFileUploadPopup,
    taskInfo
  },
  data(){
    return {
      taskId:'',
      taskInfoObj:{},
      taskUsedManHour:0,
      taskCalendarInfoObj:{},
      taskCalendarId:'',
      quickDoneFlag:false,
      allowFeedbackFlag:false,
      taskCalendarMountFlag:false,
      calendarInfoObj:{},
      userSearchResultsV:{},
      formItemInfo:new FormItemEl()
        .add("反馈完成度","feedbackRate",'',true,'number')
        .add("本次日程工时","feedbackManHour",'',true,'number')
        .add("反馈描述","feedbackComments",'',true,'textarea'),
      rules: {
        feedbackRate:[
          { required: true, message: '请填写目前完成度'  }
        ],
        feedbackManHour:[
          { required: true, message: '请填写本次日程工时'  }
        ]
      },
      taskFinishFlag:false,
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      feedbackFileList:[]
    }
  },
  created(){
    this.taskId = this.$parent.$parent.seq_num;
    this.taskCalendarId =  this.$parent.$parent.taskCalendarId;
    this.checkTaskCalendarInfo();
    this.getTaskInfo();
    this.getTaskUsedManHourFunc();
  },
  mounted(){
    
  },
  methods: {
    async getTaskInfo(){
        //console.log("####taskInfoObj:"+this.$parent.$parent.$parent.taskInfoObj);
        if(typeof this.$parent.$parent.$parent.taskInfoObj!="undefined"&& this.$parent.$parent.$parent.taskInfoObj!=null){
          this.taskInfoObj = this.$parent.$parent.$parent.taskInfoObj;
        }else if(typeof this.$parent.$parent.taskInfoObj!="undefined"&& this.$parent.$parent.taskInfoObj!=null){
          this.taskInfoObj = this.$parent.$parent.taskInfoObj;
        }else{
          //console.log("####taskInfoObj:"+this.$parent.$parent.taskInfoObj);
          console.log("taskInof重新获取");
          await getTaskDetail(this.taskId).then((response)=>{
              if (response.data&&response.data.id){
                  this.taskInfoObj = response.data;
              }
          }).catch((error)=>{
              dealException(error);
          });
        }
    },
    async getTaskUsedManHourFunc(){
      await getTaskUsedManHour(this.taskId , this.taskCalendarId).then((response)=>{
          if (response.data){
              this.taskUsedManHour = response.data;
          }
      }).catch((error)=>{
          dealException(error);
      });
    },
    async checkTaskCalendarInfo(){
        await getTaskCalendarDetail(this.taskCalendarId).then((response)=>{
            if (response.data&&response.data.id){
                this.taskCalendarInfoObj = response.data;
                //console.log("this.taskCalendarInfoObj.feedbackCreateTime：" + this.taskCalendarInfoObj.feedbackCreateTime);
                if(this.taskCalendarInfoObj.feedbackCreateTime == null){
                  this.allowFeedbackFlag = true;
                }
            }
        }).catch((error)=>{
            dealException(error);
        });
        await this.getFeedbackFileListFunc();
        this.taskCalendarMountFlag = true;
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.taskId = this.taskId;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      //console.log("this.calendarInfoObj.feedbackRate:##" + this.calendarInfoObj.feedbackRate+"##");
      if(!this.allowFeedbackFlag) return;
      if(typeof this.calendarInfoObj.feedbackRate=="undefined"||this.calendarInfoObj.feedbackRate == ''){
          this.$message({type: 'error',message: '请反馈目前完成度！'});
          return;
      }else if(isNaN(this.calendarInfoObj.feedbackRate)||Number(this.calendarInfoObj.feedbackRate)>100||Number(this.calendarInfoObj.feedbackRate)<0){
          this.$message({type: 'error',message: '完成度必须为0-100的数值！'});
          return;
      }
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("this.calendarInfoObj.correctTotalTaskManHour:"+this.calendarInfoObj.correctTotalTaskManHour);
            if(typeof this.calendarInfoObj.correctTotalTaskManHour!="undefined"&&Number(this.calendarInfoObj.correctTotalTaskManHour) > Number(this.taskInfoObj.estimateManHour)){
              this.$confirm('<span>反馈的总工时('+this.calendarInfoObj.correctTotalTaskManHour+')大于预估工时('+this.taskInfoObj.estimateManHour+')，<br>将提交Leader确认情况，是否确定？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  dangerouslyUseHTMLString: true
              }).then(() => {
                  if(typeof this.calendarInfoObj.feedbackComments=="undefined" || this.calendarInfoObj.feedbackComments=="" || this.calendarInfoObj.feedbackComments=="搞定！"){
                    this.$message({type: 'error',message: '请在\"反馈描述\"中填写工时超出预期的原因！'});
                    //console.log("this.$refs.feedbackComments:"+this.$refs.feedbackComments);
                    //this.$refs.feedbackComments.focus();
                  }else{
                    this.triggerFeedbackCalendar();
                  }
              }).catch((error) => {console.log("error:"+error);});
            }else{
              this.triggerFeedbackCalendar();
            }
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    triggerFeedbackCalendar(){
      this.openLoading();
      feedbackCalendarTaskAjax(this.taskCalendarId,this.setSaveData(this.calendarInfoObj)).then((res)=>{
        console.log("submit  done!!res.data:"+res.data);
        if (res.data&&res.data.id){
          console.log("new id:"+res.data.id);
          addActionLogForEdit(this.formItemInfo , this.taskCalendarInfoObj , this.calendarInfoObj , 'taskCalendar',res.data.id , this.taskId,'feedback');
          this.$parent.$parent.$parent.$parent.initTeamTask();
          this.$parent.$parent.dialogVisible = false;
          this.$message({type: 'success',message: '反馈成功！'});
        }else{
          this.$message({type: 'error',message: '反馈失败！'});
        }
        this.closeLoading();
      }).catch((error)=>{
        console.log("error:"+error);
        this.$message({type: 'error',message: '反馈失败！'});
        this.closeLoading();
      })
    },
    cleanInfo(){
       this.taskId='';
       this.calendarInfoObj={};
    },
    callBackForUploadFile(){
      //console.log("trigger callBackForUploadFile");
      this.getFeedbackFileListFunc();
    },
    async getFeedbackFileListFunc(){
      this.feedbackFileList = [];
      await getFeedbackFileList(this.taskCalendarInfoObj.id).then(response => {
            this.feedbackFileList = response.data;
            let tmp_feedbackFileList = [];
            for (let i in this.feedbackFileList) {
              let checkNode = this.feedbackFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_feedbackFileList.unshift(checkNode);
            }
            this.feedbackFileList = tmp_feedbackFileList;
            //console.log("#this.feedbackFileList:" + this.feedbackFileList.length);
        }).catch(error => {
          console.log("error:"+error);
        });
    },
    setTaskId(taskId){
      this.taskId = taskId;
    },
    triggerQuickDone(){
        if(this.quickDoneFlag){
            this.calendarInfoObj['feedbackRate'] = Number('100');
            this.calendarInfoObj['feedbackComments'] = "搞定！";
        }else{
            this.calendarInfoObj['feedbackRate'] = '';
            this.calendarInfoObj['feedbackComments'] = "";
        }
        this.calendarInfoObj = {...this.calendarInfoObj};
    },
    setTotalTaskManHourStyle(){
      //console.log("this.calendarInfoObj.feedbackManHour:"+this.calendarInfoObj.feedbackManHour);
      if(this.calendarInfoObj.feedbackRate==100){
        this.quickDoneFlag = true;
      }else{
        this.quickDoneFlag = false;
      }
      if(this.calendarInfoObj.feedbackRate==100 && typeof this.calendarInfoObj.feedbackManHour!="undefined" && this.calendarInfoObj.feedbackManHour!=''){
        //console.log("true");
        this.calendarInfoObj.correctTotalTaskManHour = Number(this.calendarInfoObj.feedbackManHour) + Number(this.taskUsedManHour);
        this.calendarInfoObj = {...this.calendarInfoObj};
        this.taskFinishFlag = true;
      }else{
        //console.log("false");
        this.taskFinishFlag = false;
      }
    },
    toAddAttachment(){
      this.dialogTitle="添加反馈文档";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    cleanDialog(){
    },
    deleteFile(fileId,fileName){
        deleteFileDataServer(fileId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.getFeedbackFileListFunc();      
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
    },
    formatDateToMinute,
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
  },
  watch: {
    'calendarInfoObj.feedbackRate' : function(newVal , oldVal){
      this.setTotalTaskManHourStyle();
    },
    'calendarInfoObj.feedbackManHour' : function(newVal , oldVal){
      this.setTotalTaskManHourStyle();
    }
  }
}
</script>
<style scoped>
.promptTip{
  font-weight:normal;
  color:red;
  font-size:10px;
  padding-left:10px;
  line-height: 21px;
}
</style>
