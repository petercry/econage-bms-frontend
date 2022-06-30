<template>
    <div class="taskCard" v-bind:class="{ 'priority1Card': priority=='1', 'priority2Card': priority=='2', 'priority3Card': priority=='3' }" >
        <div title="此日程已反馈" style="cursor:pointer;float:right;width:0;height:0;border-top:14px solid green;border-left:14px solid transparent;" v-if="taskCalendarMountFlag&&taskCalendarInfoObj.feedbackCreateTime!=null"></div>
        <div :class="{headRow:true,headBriefRow:foldFlag}">
            <span class="icon">
                <i class="fa fa-bug fa-lg icon-red" v-if="typeId==2" title="BUG任务" ></i>
            </span>
            <span class="seq_num" @click="showDetWin">{{cardTitle}}</span>
            <div class="foldBtnDiv">
                <el-button @click.native="fold">
                    <i class="fa fa-angle-up fa-lg" v-if="!foldFlag"></i>
                    <i class="fa fa-angle-down fa-lg" v-else></i>
                </el-button>
                <el-dropdown style="margin-left:0px;">
                    <el-button type="text" v-if="isAdmin==1" style="padding-left:0px;margin-left:0px;">
                        <i class="fa fa-pencil-square-o fa-lg detIcon" ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" style="white-space:nowrap;">
                        <el-dropdown-item  @click.native="addLeaderConfirm" v-if="opRoleList['leaderConfirm'].flag&&cardType=='T'&&(status_id==30||status_id==40)&&this.taskInfoObj.leaderConfirmCreateTime==null">Leader确认评价</el-dropdown-item>
                        <el-dropdown-item  @click.native="addPlan" v-if="opRoleList['addCalendar'].flag&&cardType=='T'&&(status_id==-1||status_id==10||status_id==20)">添加日程计划</el-dropdown-item>
                        <el-dropdown-item  @click.native="addFeedback" v-if="opRoleList['addFeedback'].flag&&taskCalendarMountFlag&&taskCalendarInfoObj.feedbackCreateTime==null">添加反馈</el-dropdown-item>
                        <el-dropdown-item  @click.native="editTask" v-if="opRoleList['editTask'].flag&&cardType=='T'">编辑任务</el-dropdown-item>
                        <el-dropdown-item  @click.native="changeDealer" v-if="opRoleList['assignTask'].flag&&cardType=='T'&&(status_id==-1||status_id==10||status_id==20)&&(this.taskCalendarId==null||this.taskCalendarId=='')">转派</el-dropdown-item>
                        <el-dropdown-item  @click.native="deleteTask" v-if="cardType=='T'&&canDeleteTaskFlag">删除任务</el-dropdown-item>
                        <el-dropdown-item  @click.native="removeCalendar" v-if="opRoleList['deleteCalendar'].flag&&this.taskCalendarId!=null&&this.taskCalendarId!=''&&!(taskCalendarMountFlag&&taskCalendarInfoObj.feedbackCreateTime!=null)">删除此日程</el-dropdown-item>
                        <el-dropdown-item  @click.native="editRequire" v-if="cardType=='R'">编辑需求</el-dropdown-item>
                        <el-dropdown-item  @click.native="addRequireTask" v-if="cardType=='R'">添加关联任务</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="det" v-if="foldFlag&&cardType=='R'">
                    <el-dropdown>
                        <el-button size="small" class="dropDownBtn"><i class="fa fa-list-ul fa-lg detIcon" style="font-size:12px;color:#878789;vertical-align:baseline;padding-right:5px;"></i><span class="detNum">{{childrenCount}}</span></el-button>
                        <el-dropdown-menu slot="dropdown" v-if="this.childrenTaskDataMountedFlag&&childrenCount>0">
                            <div v-if="this.childrenTaskDataMountedFlag" class="subTaskDiv">
                                <taskCard v-for="(taskCardItem) in childrenTaskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="1" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :ref="taskCardItem.seq_num"/>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </div>
        </div>
        <div :class="{contentRow:true,briefRow:foldFlag}" @click="showDetWin">{{content}}</div>
        <div class="statusRow" v-if="!foldFlag">
            <div :class="'status ' + cardStatusClass" >{{cardStatusDesc}}</div>
            <div class="status bug" v-if="typeId==2">BUG</div>
            <div class="date" v-if="date!=null">{{date}}</div>
            <div class="sub" v-if="cardType=='R'">
                <el-button size="small" class="dropDownBtn" v-if="this.childrenTaskDataMountedFlag&&childrenCount==0"><i class="fa fa-list-ul fa-lg detIcon"></i><span class="detNum">{{childrenCount}}</span></el-button>
                <el-dropdown v-if="this.childrenTaskDataMountedFlag&&childrenCount>0" @visible-change="showSubTaskDrop">
                <el-button size="small" class="dropDownBtn"><i class="fa fa-list-ul fa-lg detIcon"></i><span class="detNum">{{childrenCount}}</span></el-button>
                <el-dropdown-menu slot="dropdown" >
                    <div v-if="this.childrenTaskDataMountedFlag" class="subTaskDiv">
                        <el-table :data="subTaskList"  stripe style="width: 100%" v-if="subTaskList!=null && subTaskList.length > 0" >
                            <el-table-column v-for="(colEl,index) in subTaskTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                <template slot-scope="scope"  >
                                <div v-if="colEl.paramName=='op'">
                                    <el-button type="text" @click="getSubTaskDet(scope.row.id)">详情</el-button>
                                </div>
                                <div v-else>
                                    {{scope.row[colEl.paramName]}}
                                </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="scheduleRow" v-if="!foldFlag">
            <div class="desc" v-if="manHour!=null&&manHour!=''">{{manHour}}小时</div>
            <div class="currRate" v-if="taskInfoObj!=null">
                当前{{taskInfoObj.currentRate}}%
            </div>
            <div class="dealerName" v-if="taskInfoObj!=null">
                <el-tag size="mini" >{{taskInfoObj.dealerName}}</el-tag>
            </div>
            <div class="progress" v-if="percent > 0">
                <el-progress :percentage="percent" :stroke-width="4" :color="customColorMethod"></el-progress>
            </div>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
            <addPlan v-if="dialogTab=='addPlan'" ref="addPlanWin"></addPlan>
            <addFeedback v-if="dialogTab=='addFeedback'" ref="addFeedbackWin"></addFeedback>
            <editTask v-if="dialogTab=='editTask'" ref="editTaskWin"></editTask>
            <changeDealer v-if="dialogTab=='changeDealer'" ref="changeDealerWin"></changeDealer>
            <editRequire v-if="dialogTab=='editRequire'" ref="editRequireWin"></editRequire>
            <addTask v-if="dialogTab=='addRequireTask'" ref="addRequireTaskWin" :requireIdProp="seq_num" :requireDescProp="requireDesc"></addTask>
            <addLeaderConfirm v-if="dialogTab=='addLeaderConfirm'" ref="addLeaderConfirmWin"></addLeaderConfirm>
            <div slot="footer" class="dialog-footer" >
                <el-button @click.native="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
            </div>
        </el-dialog>
        <el-drawer :title="detDialogTitle" :with-header="false" :visible.sync="detDialogVisible" direction="rtl" size="70%" :destroy-on-close="true" ref="detDialog" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
             <br>
             <requireInfo :requireId="seq_num" v-if="cardType=='R'&&focusSubTaskId==''"></requireInfo>
             <taskInfo    :taskId="seq_num"  v-if="cardType=='T'&&focusSubTaskId==''"></taskInfo>
             <taskInfo    :taskId="focusSubTaskId" v-if="focusSubTaskId!=''"></taskInfo>
        </el-drawer>
    </div>
</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import {mapMutations} from 'vuex';
import { getTaskDetail,getTaskListByRequire,dealException,getTaskCalendarDetail,getPlanListByTaskId,deleteTaskCalendarAjax,deleteTaskAjax,putObjToMap,getObjInMap,addActionLogForDelete  } from "@/modules/bmsMmm/service/service.js";
import taskCard from "@/modules/bmsMmm/component/taskCard.vue";
import { TaskCard } from "@/modules/bmsMmm/util/TaskCard.js";
import addPlan from "@/modules/bmsMmm/component/addPlan.vue";
import addLeaderConfirm from "@/modules/bmsMmm/component/addLeaderConfirm.vue";
import addFeedback from "@/modules/bmsMmm/component/addFeedback.vue";
import editTask from "@/modules/bmsMmm/component/editTask.vue";
import editRequire from "@/modules/bmsMmm/component/editRequire.vue";
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
import requireInfo from "@/modules/bmsMmm/component/requireInfo.vue";
import addTask from "@/modules/bmsMmm/component/addTask.vue";
import changeDealer from "@/modules/bmsMmm/component/changeDealer.vue";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
export default{
  name:'taskCard',
  components:{
      taskCard,
      addPlan,
      addFeedback,
      editTask,
      taskInfo,
      requireInfo,
      editRequire,
      addTask,
      addLeaderConfirm,
      changeDealer
  },
  data(){
    return {
        foldFlag:false,
        cardType:"",
        childrenTaskDataMountedFlag: false,
        childrenTaskList:new TaskCard(),
        cardStatusDesc:"",
        cardStatusClass:"",
        cardTitle:"",
        dialogVisible:false,
        dialogTitle:'',
        dialogTab:'',
        taskCalendarInfoObj:{},
        taskCalendarMountFlag:false,
        detDialogTitle:'',
        detDialogVisible:false,
        taskInfoObj:null,
        requireInfoObj:null,
        requireDesc:'',
        cardObjMap:new Map(),
        subTaskTableColEl: new TableColEl()
        .add("任务ID","id",'100','',false,false,false)
        .add("标题","title",'500',"",false,false,false)
        .add("状态","statusDesc",'120',"",false,false,false)
        .add("经办人","dealerName",'80',"",false,false,false)
        .add("要求完成时间","expectFinishDate",'110',"",false,false,false)
        .add("优先级","priority",'70',"",false,false,false)
        .add("操作","op",'70',"",false,false,false),
        subTaskList:null,
        focusSubTaskId:'',
        opRoleList:null,
        canDeleteTaskFlag:false
    }
  },
  props:['seq_num','content','status_id','date','manHour','percent','defaultFold','sourceDesc','typeId','isAdmin','cardTypeProp','childrenCount','taskCalendarId','priority'],
  created(){
      //console.log("##this.priority:" + this.priority);
      this.getParentRoleList();
      if(typeof this.cardTypeProp == "undefined") this.cardType = "T";
      else this.cardType = this.cardTypeProp;
      if(this.cardType == 'T'){
          this.getTaskInfo();
      }else if(this.cardType == 'R'){
          this.getRequireInfo();
      }
      this.cardStatusClass = "working";
      if(this.status_id == -1){
          this.cardStatusDesc = "未安排";
          this.cardStatusClass = "pending";
      }else if(this.cardType == "R"){
          if(this.status_id == 10){
              this.cardStatusDesc = "已立项";
          }else if(this.status_id == 20){
              this.cardStatusDesc = "研发中";
          }else if(this.status_id == 30){
              this.cardStatusDesc = "研发完毕";
          }else if(this.status_id == 40){
              this.cardStatusDesc = "测试中";
          }else if(this.status_id == 50){
              this.cardStatusDesc = "测试完毕";
          }else if(this.status_id == 60){
              this.cardStatusDesc = "已发布";
              this.cardStatusClass = "done";
          }else if(this.status_id == 70){
              this.cardStatusDesc = "已关闭";
              this.cardStatusClass = "done";
          }
      }else{
          if(this.status_id == 10){
              this.cardStatusDesc = "待办";
          }else if(this.status_id == 20){
              this.cardStatusDesc = "进行中";
          }else if(this.status_id == 30){
              this.cardStatusDesc = "已完成未确认";
              this.cardStatusClass = "selfFinish";
          }else if(this.status_id == 40){
              this.cardStatusDesc = "已完成已确认";
              this.cardStatusClass = "done";
          }else if(this.status_id == 50){
              this.cardStatusDesc = "挂起";
              this.cardStatusClass = "done";
          }else if(this.status_id == 60){
              this.cardStatusDesc = "取消";
              this.cardStatusClass = "done";
          }
      }
      let seqNumDesc = this.seq_num;
      if(seqNumDesc.indexOf("_")>0) seqNumDesc = "#" + seqNumDesc.substring(seqNumDesc.indexOf("_")+1);
      this.cardTitle = seqNumDesc;

      if(this.seq_num == '1355572795579224000'){
            console.log("this.projectDesc:" + this.projectDesc);
      }
      if(this.sourceDesc!=null&&this.sourceDesc!=""){
          this.cardTitle = this.sourceDesc;
      }else if(this.projectDesc!=null&&this.projectDesc!=""){
          this.cardTitle = this.projectDesc;
      }
      this.getTaskCalendarInfo();

  },
  mounted(){
      if(this.defaultFold=="1"){
        this.setFoldFlag(true);
      }else{
        this.setFoldFlag(false);
      }
      if(this.childrenCount > 0){
        this.childrenTaskDataMountedFlag = true;
        //this.getChilrenTaskListFunc();
      }else{
        this.childrenTaskDataMountedFlag = true;
      }
  },
  methods: {
    showSubTaskDrop(){
        if(this.subTaskList == null){
            this.getChilrenTaskListFunc();
        }
    },
    async canDeleteTask(){
        this.canDeleteTaskFlag = false;
        //console.log("this.taskInfoObj.createUser:"+this.taskInfoObj.createUser+"##"+this.taskInfoObj.createDate);
        if(this.taskInfoObj.createUser!=null&&this.taskInfoObj.createUser!=''){
            let nowDate = new Date();
            let createDate = new Date(this.taskInfoObj.createDate.replace(/\-/g,'\/'));
            //console.log("1nowDate:"+nowDate+"##createDate:"+createDate);
            createDate.setHours(createDate.getHours()+1);
            //console.log("2nowDate:"+nowDate+"##createDate:"+createDate);
            if(nowDate<=createDate){//当前时间未超过任务新建时间的1小时，则进一步判断是不是本人
                await axios.get(baseUrl+'/bms/public/myUserInfo',{
                    params:{
                        time:new Date().getTime()
                    }
                }).then(response => {
                    let userData = response.data;
                    let myUserId = userData.id;
                    if(myUserId == this.taskInfoObj.createUser){
                        this.canDeleteTaskFlag = true;
                    }
                }).catch(error => {
                    dealException(error);
                });
            }
        }
    },
    async deleteTask(){
        await getPlanListByTaskId(this.seq_num).then(response => {
            if(response.data.rows.length > 0){
              this.$message({type: 'error',message: '此任务已存在有效日程，无法删除！'});
              return;
            }else{
                this.$confirm('<span>确定要删除此任务吗？</span>', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    deleteTaskAjax(this.seq_num).then((res)=>{
                        //console.log("submit  done!!");
                        addActionLogForDelete( 'task',this.seq_num , this.taskInfoObj.requireId,'delete');
                        this.$message({type: 'success',message: '任务删除成功！'});
                        try{
                            this.$parent.$parent.initTeamTask();
                        }catch(e){
                            try{
                                this.$parent.$parent.$parent.$parent.initTeamTask();
                            }catch(e){
                                //项目任务看板，走下面的刷新逻辑
                                this.$parent.$parent.$parent.getTaskListFunc();
                            }
                        }
                    }).catch((error)=>{
                        dealException(error);
                        this.$message({type: 'error',message: '任务删除失败！'});
                    });
                }).catch((error) => {console.log("error:"+error);});
            }
        })
        .catch(error => {
            dealException(error);
        });
    },
    getParentRoleList(){
        let checkRoleList = this.$parent.$parent.$parent.opRoleList;
        if(typeof checkRoleList=="undefined") checkRoleList = this.$parent.$parent.opRoleList;
        if(typeof checkRoleList=="undefined") checkRoleList = this.$parent.$parent.$parent.$parent.opRoleList;
        if(typeof checkRoleList=="undefined") checkRoleList = this.$parent.$parent.$parent.$parent.$parent.opRoleList;
        if(typeof checkRoleList!="undefined") this.opRoleList = checkRoleList;
    },
    async getTaskInfo(){
        //console.log("this.$parent.$parent.cardObjMap:"+this.$parent.$parent.cardObjMap);
        let checkObjMap = this.$parent.$parent.$parent.cardObjMap;
        if(typeof checkObjMap=="undefined") checkObjMap = this.$parent.$parent.cardObjMap;
        if(typeof checkObjMap=="undefined") checkObjMap = this.$parent.$parent.$parent.$parent.cardObjMap;
        if(typeof checkObjMap=="undefined") checkObjMap = this.$parent.$parent.$parent.$parent.$parent.cardObjMap;
        //console.log("#######checkObjMap:"+checkObjMap);
        let checkObj = getObjInMap(checkObjMap , this.seq_num);
        //console.log("checkObj:"+checkObj+"@@this.seq_num:"+this.seq_num);
        if(checkObj!=null){
            this.taskInfoObj = checkObj;
        }else{
            console.log("重新获取！！！");
            await getTaskDetail(this.seq_num).then((response)=>{
                if (response.data&&response.data.id){
                    this.taskInfoObj = response.data;
                }
            }).catch((error)=>{
                dealException(error);
            });
        }
        await this.canDeleteTask();
    },
    getRequireInfo(){
        let checkObjMap = this.$parent.$parent.$parent.cardObjMap;
        if(typeof checkObjMap=="undefined") checkObjMap = this.$parent.$parent.cardObjMap;
        //console.log("checkObjMap:"+checkObjMap);
        let checkObj = getObjInMap(checkObjMap , this.seq_num);
        if(checkObj!=null){
            this.requireInfoObj = checkObj;
            this.requireDesc = "#"+this.requireInfoObj.id+" : "+this.requireInfoObj.title+" ( 优先级："+this.requireInfoObj.priority+" )"
        }else{
            console.log("需要重新获取！！！");
        }
    },
    getTaskCalendarInfo(){
        if(this.taskCalendarId==null||this.taskCalendarId=='') return;
        getTaskCalendarDetail(this.taskCalendarId).then((response)=>{
            if (response.data&&response.data.id){
                this.taskCalendarInfoObj = response.data;
                this.taskCalendarMountFlag = true;
            }
        }).catch((error)=>{
            dealException(error);
        });
    },
    customColorMethod(percentage) {
        if (percentage == 100) {
            return '#3e9990';
        } else {
            return '#3478cd';
        }
    },
    fold(){
        if(this.foldFlag){  //已折叠
            this.foldFlag = false;
        }else{
            this.foldFlag = true;
        }
    },
    setFoldFlag(checkFoldFlag){
        this.foldFlag = checkFoldFlag;
    },
    getChilrenTaskListFunc() {
      getTaskListByRequire(this.seq_num ).then(response => {
        let dataList = response.data.rows;
        this.subTaskList = dataList;
        this.cardObjMap = new Map();
        this.childrenTaskList = new TaskCard();
        for (let i in dataList) {
            putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
            this.childrenTaskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,this.isAdmin,"T",0);
        }
        //console.log("this.childrenTaskList:"+this.childrenTaskList.getLength());
        this.childrenTaskDataMountedFlag = true;
        })
        .catch(error => {
          dealException(error);
        });
    },
    addLeaderConfirm(){
      this.dialogTitle="Leader确认评价";
      this.dialogTab = 'addLeaderConfirm';
      this.dialogVisible = true;
    },
    addPlan(){
      this.dialogTitle="添加日程计划";
      this.dialogTab = 'addPlan';
      this.dialogVisible = true;
    },
    addFeedback(){
      this.dialogTitle="添加反馈";
      this.dialogTab = 'addFeedback';
      this.dialogVisible = true;
    },
    async changeDealer(){
      await getPlanListByTaskId(this.seq_num).then(response => {
        if(response.data.rows.length > 0){
            this.$message({type: 'error',message: '此任务已存在有效日程，无法变更经办人！'});
            return;
        }else{
            this.dialogTitle="转派任务";
            this.dialogTab = 'changeDealer';
            this.dialogVisible = true;
        }
      }).catch(error => {
        dealException(error);
      });
    },
    editTask(){
      this.dialogTitle="编辑任务";
      this.dialogTab = 'editTask';
      this.dialogVisible = true;
    },
    editRequire(){
      this.dialogTitle="编辑需求";
      this.dialogTab = 'editRequire';
      this.dialogVisible = true;
    },
    removeCalendar(){
        this.$confirm('<span>确定要删除此日程计划吗？</span><br><span style=\'color:red;\'>注意：删除的是当日的日程计划，而非此任务本身</span>', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
        }).then(() => {
            deleteTaskCalendarAjax(this.taskCalendarId).then((res)=>{
                //console.log("submit  done!!");
                addActionLogForDelete( 'taskCalendar',this.taskCalendarId , this.seq_num,'delete');
                this.$message({type: 'success',message: '日程删除成功！'});
                this.$parent.$parent.initTeamTask();
            }).catch((error)=>{
                dealException(error);
                this.$message({type: 'error',message: '日程删除失败！'});
            });
        }).catch((error) => {console.log("error:"+error);});
    },
    cleanDialog(){
    },
    dialogSave(){
        if(this.dialogTab == 'addPlan'){
            this.$refs.addPlanWin.save();
        }else if(this.dialogTab == 'addFeedback'){
            this.$refs.addFeedbackWin.save();
        }else if(this.dialogTab == 'editTask'){
            this.$refs.editTaskWin.save();
        }else if(this.dialogTab == 'editRequire'){
            this.$refs.editRequireWin.save();
        }else if(this.dialogTab == 'addRequireTask'){
            this.$refs.addRequireTaskWin.save();
        }else if(this.dialogTab == 'addLeaderConfirm'){
            this.$refs.addLeaderConfirmWin.save();
        }else if(this.dialogTab == 'changeDealer'){
            this.$refs.changeDealerWin.save();
        }
    },
    showDetWin(){
        this.focusSubTaskId='';
        if(this.cardType=='R'){
            this.detDialogTitle="需求详情";
            this.detDialogVisible = true;
        }else{
            this.detDialogTitle="任务详情";
            this.detDialogVisible = true;
        }
    },
    getSubTaskDet(subTaskId){
        this.focusSubTaskId = subTaskId;
        this.detDialogTitle="任务详情";
        this.detDialogVisible = true;
    },
    addRequireTask(){
        this.dialogTitle="添加关联任务";
        this.dialogTab = 'addRequireTask';
        this.dialogVisible = true;
    }
  },
  watch: {

  }
}
</script>
<style>

.detDialog .el-dialog{
  margin-top:65px !important;
  height:90%;
  overflow-y: auto;
}
.detDialog .el-dialog__body {
  padding-top:10px;
  height:calc(100% - 170px);
}

</style>
