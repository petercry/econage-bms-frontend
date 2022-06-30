<template>
        <div style="width:calc(100% - 30px);margin:0px 10px 0px 20px;">
          <template v-for="(nodeEl,key,i) in detInfo" >
            <div :key="i" :style="{'width':(nodeEl.isWholeRow ? '100%' : '49%')}" class="detRowDiv devDiv" v-if="taskInfoObj[nodeEl.paramName]!=null">
              <div class="devTitleDiv" :style="{'width':(nodeEl.isWholeRow ? '15%' : '30%')}"><span class="titleSpan" >{{nodeEl.desc}}</span></div>
              <div class="devInfoDiv" :style="{'width':(nodeEl.isWholeRow ? '82%' : '67%')}">
                <template v-if="nodeEl.paramName=='desc'">
                  <div class="infoCkDiv" v-ckeditor="taskInfoObj[nodeEl.paramName]"></div>
                </template>
                <template v-else-if="nodeEl.paramName=='id'">
                  <span class="infoSpan" v-html="taskInfoObj[nodeEl.paramName]">
                    {{taskInfoObj[nodeEl.paramName]}}
                  </span>&nbsp;&nbsp;&nbsp;
                  <el-popover placement="top"  trigger="click" v-if="taskInfoObj['comments']!=null&&taskInfoObj['comments']!=''">
                    <div v-html="handleCommentsInfo(taskInfoObj['comments'])" style="font-size:16px;line-height:25px;">
                    </div>
                    <el-button class="infoTableBtn" type="text" slot="reference" style="font-weight:bold;font-size:14px;">[ 备注信息 ]</el-button>
                  </el-popover>
                </template>
                <template v-else>
                  <span class="infoSpan" v-html="taskInfoObj[nodeEl.paramName]">{{taskInfoObj[nodeEl.paramName]}}</span>
                </template>  
              </div>
            </div>
          </template>
          <div style="margin-top:20px;">
            <el-tabs v-model="focusPanelName" @tab-click="setTabPanel">
                <el-tab-pane :label="'已有计划 ('+this.planInfoList.length+')'" name="planInfo">
                    {{noPlanInfoToShow}}
                    <el-timeline v-if="planDataMounted">
                              <el-timeline-item v-for="(item,index) in planInfoList" :key="index" v-bind:timestamp="item.date" placement="top">
                                  <el-card>
                                      <el-row >
                                        <el-col :span="24" >
                                            <span class="planTitleSpan" style="font-weight:bold;">计划在{{item.date}}完成{{item.planRate}}%</span>
                                            <span style="font-size:5px;" v-if="item.planInputerName!=null&&item.planInputerName!=''">（{{item.planInputerName}}于{{formatDateToMinute(item.planCreateTime)}}设定计划）</span>
                                        </el-col>
                                      </el-row>
                                      <el-row v-if="item.planComments!=null&&item.planComments!=''">
                                        <el-col :span="4" ><span class="planTitleSpan" >计划备注</span></el-col>
                                        <el-col :span="20" ><span class="planInfoSpan" >{{item.planComments}}</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.dealerName!=null&&item.dealerName!=''">
                                        <el-col :span="4" ><span class="planTitleSpan" >任务执行人</span></el-col>
                                        <el-col :span="20" ><span class="planInfoSpan" >{{item.dealerName}}</span></el-col>  
                                      </el-row>
                                      <el-row v-if="item.feedbackInputer==null||item.feedbackInputer==''">
                                        <el-col :span="24" ><span class="planTitleSpan" style="font-weight:bold;">尚无反馈</span></el-col>
                                      </el-row>
                                      <el-row v-if="item.feedbackRate!=null&&item.feedbackRate!=''">
                                         <el-col :span="24" >
                                             <span class="planTitleSpan" style="font-weight:bold;">反馈已完成{{item.feedbackRate}}%，本次工时为{{item.feedbackManHour}}</span>
                                             <span style="font-size:5px;" v-if="item.feedbackInputerName!=null&&item.feedbackInputerName!=''">（{{item.feedbackInputerName}}于{{formatDateToMinute(item.feedbackCreateTime)}}反馈）</span>
                                         </el-col> 
                                      </el-row>    
                                      <el-row v-if="item.feedbackComments!=null&&item.feedbackComments!=''">
                                        <el-col :span="3" ><span class="planTitleSpan" >反馈备注</span></el-col>
                                        <el-col :span="21" ><span class="planInfoSpan" >{{item.feedbackComments}}</span></el-col>
                                      </el-row>  
                                      <el-row v-if="item.feedbackFileList!=null&&item.feedbackFileList.length > 0">
                                        <el-col :span="3" ><span class="planTitleSpan" >反馈文档</span></el-col>
                                        <el-col :span="21" >
                                          <span class="planInfoSpan" style="line-height:21px;">
                                            <div v-for="(fileNode , fileNodeIdx) in item.feedbackFileList" :key="fileNodeIdx" >{{fileNode.name}}<el-button type="text" @click.native="doFilePreviewAction(fileNode)" v-if="_isPreviewFile(fileNode.fileType)" class="fileBtn" >预览</el-button><el-button type="text" @click.native="doFileDownloadAction(fileNode)" class="fileBtn" >下载</el-button>
                                            </div>
                                          </span>
                                        </el-col>
                                      </el-row>
                                  </el-card>
                              </el-timeline-item>
                          </el-timeline>
                </el-tab-pane>
                <el-tab-pane :label="'附件文档 ('+this.taskFileList.length+')'" name="taskFile">
                    {{noTaskFileToShow}}
                    <el-table :data="taskFileList"  stripe style="width: 100%" v-if="taskFileList!=null && taskFileList.length > 0" class="detTable">
                      <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                        <template slot-scope="scope"  >
                          <div v-if="colEl.paramName=='op'">
                            <el-button type="text" @click.native="doFilePreviewAction(scope.row)" v-if="_isPreviewFile(scope.row.fileType)" class="fileBtn" >预览</el-button>
                            <span v-else style="padding-left:31px;">&nbsp;</span>
                            <el-button type="text" @click.native="doFileDownloadAction(scope.row)" class="fileBtn" >下载</el-button>
                          </div>
                          <div v-else>
                            {{scope.row[colEl.paramName]}}
                          </div>
                        </template> 
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="'操作历史 ('+this.opActionList.length+')'" name="opActionHis">
                  <el-collapse v-model="opActionActiveNames" @change="changeActionHis">
                    <el-collapse-item :title="(index+1)+'. '+item.actionDesc" :name="item.id" v-for="(item,index) in opActionList" :key="index" :disabled="item.detail.length==0">
                      <div style="margin-left:10px;">
                        <div v-for="(detItem , detIdx) in item.detail" :key="detIdx">
                            <div style="width:100px;white-space:nowrap;display:inline-block;color:rgb(107, 106, 106);font-weight:bold;">{{detItem.fieldDesc}}</div>
                            <div style="display:inline-block;" v-if="detItem.oldValue==''">{{detItem.newValue}}</div>
                            <div style="display:inline-block;" v-else>由旧值 {{detItem.oldValue}} 更改为 {{detItem.newValue}}</div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>  
                </el-tab-pane>  
            </el-tabs>            
          </div>
        </div>
</template>
<script>
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import {openLoading,closeLoading,getTaskDetail,getPlanListByTaskId,dealException,formatDateToMinute,extSearchOpAction,setActionDesc,getTaskFileList,_isPreviewFile,getFeedbackFileList } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize } from "@/modules/bmsBa/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import {mapMutations} from 'vuex';
import { DetShowEl } from "@/modules/bmsBa/util/DetShowEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import { handleCommentsInfo } from "@/modules/bmsMmm/util/utility.js";
export default{
  name:'taskInfo',
  components:{
      
  },
  props:['taskId'],
  data(){
    return {
      taskInfoObj:{},
      planInfoList:[],
      planDataMounted : false,
      focusPanelName:'planInfo',
      noPlanInfoToShow:'',
      noTaskFileToShow:'',
      noInfoMsg:'　暂无数据 ...',
      detInfo:new DetShowEl()
        .add("任务ID","id",'',true)
        .add("标题","title",'',true)
        .add("状态","statusDesc",'',false)
        .add("经办人","dealerName",'',false)
        .add("优先级","priority",'',false)
        .add("对接人","followuperName",'',false)
        .add("关联项目","projectDesc",'',true)
        .add("关联需求","requireDesc",'',true)
        .add("预估工时","estimateManHour",'',false)
        .add("要求完成时间","expectFinishDate",'',false)
        .add("实际工时","actualManHour",'',false)
        .add("实际完成时间","actualFinishDate",'',false)
        .add("绩效工时","performManHour",'',true)
        .add("Leader评价","leaderConfirmDesc",'',true)
        .add("详细描述","desc",'',true),
      opActionActiveNames:[],
      opActionList:[],
      taskFileList:[],
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'400','',false,false,false)  
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
    }
  },
  created(){
      //console.log("####"+this.taskId);
      this.getTaskInfo();
      this.getPlanListFunc();
      this.getOpActionListFunc();
      this.getTaskFileListFunc();
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
    getTaskFileListFunc(){
      this.openLoading();
      this.noTaskFileToShow='';
      getTaskFileList(this.taskId ).then(response => {
            this.taskFileList = response.data;
            let tmp_taskFileList = [];
            for (let i in this.taskFileList) {
              let checkNode = this.taskFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_taskFileList.unshift(checkNode);
            }
            this.taskFileList = tmp_taskFileList;
            //console.log("this.taskFileList.length:"+this.taskFileList.length);
            if(this.taskFileList.length==0){
              this.noTaskFileToShow=this.noInfoMsg;
            }
            this.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.closeLoading();
        });
    },
    async getPlanListFunc() {
      this.noPlanInfoToShow='';
      this.planDataMounted = false;
      await getPlanListByTaskId(this.taskId).then(response => {
            this.planInfoList = response.data.rows;
            //console.log("#####this.planInfoList:" + this.planInfoList);
            if(this.planInfoList.length==0){
              this.noPlanInfoToShow=this.noInfoMsg;
            }
        })
        .catch(error => {
            dealException(error);
        });
        if(this.planInfoList!=null&&this.planInfoList.length>0){
          for(let i in this.planInfoList){
            this.planInfoList[i].feedbackFileList = await this.getFeedbackFileListFunc(this.planInfoList[i].id);
            //console.log("@@@this.baEventListArray[i].checkEventFileList.length:"+this.baEventListArray[i].checkEventFileList.length);
          }
        }
        this.planDataMounted = true;
    },
    async getFeedbackFileListFunc(checkTaskCalendarId){
      let checkFeedbackFileList = [];
      await getFeedbackFileList(checkTaskCalendarId).then(response => {
            checkFeedbackFileList = response.data;
            let tmp_feedbackFileList = [];
            for (let i in checkFeedbackFileList) {
              let checkNode = checkFeedbackFileList[i];
              if(checkNode.createDate.length == 19){
                checkNode.createDate = checkNode.createDate.substring(0,16);
              }
              checkNode.size = formatFileSize(checkNode.size);
              tmp_feedbackFileList.unshift(checkNode);
            }
            checkFeedbackFileList = tmp_feedbackFileList;
            
        }).catch(error => {
          console.log("error:"+error);
        });
        return checkFeedbackFileList;
    },
    getOpActionListFunc() {
      extSearchOpAction('task' , 'taskCalendar' , this.taskId).then(response => {
            this.opActionList = response.data;
            //console.log("#####this.opActionList:" + this.opActionList);
            if(this.opActionList!=null&&this.opActionList.length>0){
              for(let i in this.opActionList){
                let actionNode = this.opActionList[i];
                let actionDesc = formatDateToMinute(actionNode.date)+",由"+actionNode.actorName+setActionDesc(actionNode);
                actionNode.actionDesc = actionDesc;
                //console.log("#####actionDesc:" + actionDesc);
              }
            }
        })
        .catch(error => {
            dealException(error);
        });
    },
    setTabPanel(){},
    changeActionHis(){

    },
    formatDateToMinute,
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    handleCommentsInfo
  },
  watch: {

  }
}
</script>
<style scoped>
body{
  font-size: 14px;
}
.detRowDiv{
  margin-bottom: 5px;
  display:inline-block;
  vertical-align: top;
}
.devTitleDiv{
  display:inline-block;
  vertical-align: top;
}
.devInfoDiv{
  display:inline-block;
  word-wrap:break-word;
}
.titleSpan{
    font-weight: bold;
    color: rgb(107, 106, 106);
    line-height: 30px;
}
.infoSpan{
    border-bottom:1px solid rgb(187, 186, 186);
    padding-bottom:2px;
    line-height: 25px;
    white-space: pre-wrap;
}
.planTitleSpan{
    color: rgb(107, 106, 106);
    line-height: 30px;
}
.planInfoSpan{
    border-bottom:1px solid rgb(187, 186, 186);
    line-height: 30px;
    white-space: pre-wrap;
}
.el-timeline-item__timestamp{
  font-weight: bold;
  font-size: 16px;
}
.el-collapse-item.is-disabled .el-collapse-item__header {
    color: #303133;
    cursor: default;
}
.el-collapse-item.is-disabled .el-collapse-item__arrow {
  display: none;
}

</style>
