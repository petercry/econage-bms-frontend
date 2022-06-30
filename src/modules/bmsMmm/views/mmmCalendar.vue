<template>
  <el-container style="height:100%;width:100%" v-if="user_size == checked_user_size" >
    <el-header style="height:120px;">
        <div class="pageTop">
          <div style="display:inline-block;">
            <div class="pageTitle">
              <i class="fa fa-calendar-check-o" style="vertical-align:middle;line-height:42px;"></i>
              <template v-if="getPageViewOptions().length>1">
              <el-select v-model="pageViewFlag" @change="jumpPage" class="pageViewSel">
                  <el-option
                    v-for="item in getPageViewOptions()"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              </template>
              <template v-else-if="getPageViewOptions().length==1">
                <span style="vertical-align:middle;">{{getPageViewOptions()[0].label}}</span>
              </template>
            </div>
            <div class="toolbarDiv">
              <el-select v-model="teamUserGroupCode" placeholder="请选择团队" @change="changeTeamTask" style="width:170px;vertical-align:top;" v-if="this.pageViewFlag=='forCalendar'">
                <el-option label="不限团队" value="" ></el-option>
                <el-option
                  v-for="item in userGroupList"
                  :key="''+item.code"
                  :label="item.name"
                  :value="''+item.code">
                </el-option>
                <!--
                <el-option label="iBpm技术团队" value="ibpm" v-if="opRoleList['iBpmTeamView'].flag"></el-option>
                <el-option label="AlphaFlow技术团队" value="af" v-if="opRoleList['afTeamView'].flag"></el-option>
                -->
              </el-select>
              <tag-select 
                    placeholder="请选择人员"  
                    style="width: 250px;"
                    :initDataStr="selRoleUser"
                    :initOptions="{selectNum:2,selectType:'User',maxOrgPathLevel:0,idSplit:'_'}" 
                    @callBack="selectRoleUser" 
                    v-if="teamUserGroupCode=='' && this.pageViewFlag=='forCalendar'"
                    >
              </tag-select>
              <el-badge :value="this.userList.length" v-if="this.pageViewFlag=='forCalendar'&&teamUserGroupCode!=''" style="margin-right:17px;" type="primary">
                <el-button size="medium" style="color:#409EFF;border-color:#409EFF;height:40px;" @click="setUserFilter"><i class="fa fa-filter"></i> 筛选{{this.userList.length}}人</el-button>
              </el-badge>
              <el-select v-model="dateSelType" placeholder="请选择" @change="changeDateSelType" style="width:92px;vertical-align:top;">
                <el-option label="本周" value="1"></el-option>
                <el-option label="下周" value="2"></el-option>
                <el-option label="自定义" value="3"></el-option>
              </el-select>
              <el-date-picker v-if="dateSelType=='3'"
                v-model="fromToDateArray"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="—"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:250px;vertical-align:top;"
                @change="changeDateSel">
              </el-date-picker>
              <div class="prioritySearchDiv" v-if="false">
                <el-checkbox-group v-model="priorityList" @change="initTeamTask" >
                  <el-checkbox label="1" class="priority1"></el-checkbox>
                  <el-checkbox label="2" class="priority2"></el-checkbox>
                  <el-checkbox label="3" class="priority3"></el-checkbox>
                </el-checkbox-group>
              </div>
              <el-button type="primary" size="medium" icon="el-icon-plus" @click.native="toAddTask" v-if="opRoleList['addTask'].flag" style="vertical-align:top;height:40px;">新建任务</el-button>

              <el-dropdown style="vertical-align:top;">
                <el-button size="medium" class="dropDownBtn" style="height:40px;">...</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  @click.native="allTaskCardFold">全部折叠/展开</el-dropdown-item>
                  <el-dropdown-item  @click.native="jumpToTaskListView(null , null , null ,teamUserGroupCode , (pageViewFlag == 'forPersonal'?true:false) , 'forCalendar')">列表模式查看</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-badge :value="this.exceptionTaskList.getLength()" v-if="opRoleList['leaderConfirm'].flag&&this.exceptionTaskList.getLength()>0" style="vertical-align:top;">
                <el-button size="medium" style="color:red;border-color:red;height:40px;" v-popover:exception_task_popover>异常任务确认</el-button>
                <el-popover v-if="user_size>0 && user_size == checked_user_size"
                    ref="exception_task_popover"
                    placement="right"
                    :width="taskColWidth+18"
                    trigger="click">
                      <div class="headTaskListDiv">
                        <taskCard v-for="(taskCardItem) in exceptionTaskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :ref="taskCardItem.seq_num"/>
                      </div>
                  </el-popover>
              </el-badge>
            </div>
          </div>
          <div class="pageViewChangeDiv">
            <div class="head_tag red_bg" v-if="false">
                <headTag title="总工时" :num="this.headTag_mh_total" desc="小时"/>
                <div class="el-divider"></div>
                <headTag title="已完成工时" :num="this.headTag_mh_complete" desc="小时"/>
            </div>
            <div class="head_tag blue_bg" >
                <headTag title="未安排任务数" :num="this.pending_task_num" desc="" v-if="pageViewFlag!='forPersonal'&&false" />
                <div class="el-divider" v-if="pageViewFlag!='forPersonal'&&false"></div>
                <headTag title="待办任务数" :num="this.assigned_task_num" desc="" v-if="false"/>
                <div class="el-divider" v-if="false"></div>
                <div class="tagDiv">
                    <div class="title">进行中任务数</div>
                    <div >
                     <el-button type="text" style="padding:4px 20px 4px 0px;" v-popover:working_task_popover><span class="num">{{working_task_num}}</span></el-button>
                      <el-popover v-if="user_size>0 && user_size == checked_user_size"
                        ref="working_task_popover"
                        placement="right"
                        :width="taskColWidth+18"
                        trigger="click">
                         <div class="headTaskListDiv">
                           <taskCard v-for="(taskCardItem) in workingTaskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :ref="taskCardItem.seq_num"/>
                         </div>
                      </el-popover>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </el-header>
    <div style="height:calc(100vh - 120px);padding-left:20px;overflow-x:auto;white-space: nowrap;">
      <div class="listColDiv">
          <div class="listColTitle" :style="'width:'+(taskColWidth+35)+'px;'" v-if="pendingTaskList.getLength()>0">未安排 ({{pendingTaskList.getLength()}})</div>
          <div class="listColTitle" :style="'width:'+(userNameColWidth+20)+'px;padding-left:10px;'">员工 ({{user_size}})</div>
          <div class="listColTitle" :style="'width:'+taskColWidth+'px;'" v-for="(item,index) in taskColTemplate" :key="index">{{item.colName}}</div>
      </div>
      <div class="el-aside-div" :style="'width:'+(taskColWidth-10)+'px;'" v-if="pendingTaskList.getLength()>0">
        <taskCard v-for="(taskCardItem) in pendingTaskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
      </div>
      <div class="el-main-div">
        <div class="rowDiv" v-for="(item) in teamTaskList" :key="item.id" >
          <template v-if="isInUserList(item.id)">
            <div class="colDiv userInfoDiv" :style="'width:'+userNameColWidth+'px;'">{{item.userName}}</div>
            <div class="colDiv" :style="'width:'+taskColWidth+'px;'+(pageViewFlag=='forPersonal'?'max-height:100%':'')+''" v-for="(taskColItem,taskColIdx) in taskColTemplate" :key="taskColIdx">
              <taskCard v-for="(taskCardItem) in item.taskColList[taskColItem.colId].taskList" :key="taskCardItem.seq_num + taskColItem.colId" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :taskCalendarId="taskCardItem.taskCalendarId" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addTask v-if="dialogTab=='addTask'" :dealerIdProp="userIdForPersonal" :dealerNameProp="userMiForPersonal" ref="addTaskWin"></addTask>
        <div slot="footer" class="dialog-footer" >
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
    </el-dialog>
    <el-dialog width="490px" style="height:650px;" title="筛选人员" :visible.sync="filterUserDialogVisible"  :destroy-on-close="false" ref="userFilterDialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
      <el-cascader v-model="selectedUserFilterOptions" :options="totalTeamUserFilterOptions" :props="userFilterProps" clearable style="width:450px;"></el-cascader>
      <div slot="footer" class="dialog-footer" >
            <el-button @click.native="cancelUserFilter">取 消</el-button>
            <el-button type="primary" @click.native="doUserFilter()" >确 定</el-button>
        </div>
    </el-dialog>
  </el-container>
</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import headTag from "@/modules/bmsMmm/component/headTag.vue";
import taskCard from "@/modules/bmsMmm/component/taskCard.vue";
import addTask from "@/modules/bmsMmm/component/addTask.vue";
import { TaskCard } from "@/modules/bmsMmm/util/TaskCard.js";
import { TeamTask } from "@/modules/bmsMmm/util/TeamTask.js";
import { TaskCol } from "@/modules/bmsMmm/util/TaskCol.js";
import { openLoading,closeLoading,dealException,getPageViewOptions,jumpPage,putObjToMap,initOpRoleList,jumpToTaskListView,getTeamName } from "@/modules/bmsMmm/service/service.js";
import tagSelect from '@/components/orgPick/tagSelect.vue';
import {mapMutations} from 'vuex'
export default{
  name:'taskCalendar',
  components:{
    headTag,
    taskCard,
    TaskCol,
    addTask,
    tagSelect
  },
  data(){
    return {
      loading:true,
      totalTaskFoldFlag:false,
      headTag_mh_complete:0,
      headTag_mh_total:0,
      headTag_mh_working:0,
      pending_task_num:0,//未安排任务数
      assigned_task_num:0, //待办任务数
      working_task_num:0, //进行中任务数
      bug_num:0,
      userNameColWidth:90, //显示人员的列的宽度
      taskColWidth:325,//显示任务卡片列表的列的宽度
      pendingTaskList: new TaskCard(),
      workingTaskList: new TaskCard(),
      teamTaskList:{},
      userGroupList:[], //用户组团队列表
      selRoleUser:'',
      user_size:0,
      userList:[],         //筛选后的团队成员列表
      totalTeamUserList:[],//整个团队成员列表，不参与筛选
      checked_user_size:0,
      working_task_total:0,
      self_finish_task_total:0,
      taskColTemplate:{},
      viewDateFrom:'',
      viewDateTo:'',
      viewDateArray:[],
      fromToDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
      totalWorkingTaskMap:new Map(),
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      filterUserDialogVisible:false,
      pageViewFlag:'forCalendar',
      dateSelType:'1',
      teamUserGroupCode: '',
      cardObjMap:new Map(),
      priorityList:["1","2","3"],
      pageTitle:"",
      userIdForPersonal:'',
      userMiForPersonal:'',
      exceptionTaskList: new TaskCard(),
      opRoleList:null,
      userFilterProps: { multiple: true },
      totalTeamUserFilterOptions:[],    //整个团队成员的选择框选项，不参与筛选
      selectedUserFilterOptions:[],     //与筛选框绑定的opt选项
    }
  },
  created(){
    //console.log("$route.params.pageViewFlagProp:" + this.$route.params.pageViewFlagProp);
    //this.selRoleUser = '{"type":"PERSONNEL","orgId":"1292475767798575107.1292475794252050434","linkId":"1292475794252050434","name":"徐镭","orgPath":"徐镭"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1503370492087566338","linkId":"1503370492087566338","name":"蔡京园","orgPath":"蔡京园"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1292475801671774209","linkId":"1292475801671774209","role":null,"name":"潘琦","orgPath":"杭州微宏科技有限公司-产品技术中心-iBpm研发事业部-潘琦"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1292475798073061377","linkId":"1292475798073061377","role":null,"name":"王俊杰","orgPath":"杭州微宏科技有限公司-产品技术中心-iBpm研发事业部-王俊杰"}';
    this.pageViewFlag = this.$route.params.pageViewFlagProp;
    if(this.pageViewFlag == 'forPersonal'){
      this.pageTitle = "个人日程看板"
    }else{
      this.pageTitle = "伙伴任务日程看板"
    }
    this.viewDateFrom = this.getBriefDate("s",0);
    this.viewDateTo = this.getBriefDate("e",0);
    this.setViewDateArray();
    this.taskColTemplate = new TaskCol()
      .add("t10","待办 ( 尚未列入日程计划 )",new TaskCard());
    for(let i in this.viewDateArray){
        this.taskColTemplate.add("t"+this.viewDateArray[i] , this.viewDateArray[i]+" "+this.getWeek(this.viewDateArray[i]), new TaskCard());
    }
    this.initData();
  },
  mounted(){
  },
  methods: {
    async initData(){
      this.userList = [];
      this.initOpRoleList();
      await axios.get(baseUrl+'/bms/public/userGroupListForKanban',{
          params:{
            time:new Date().getTime()
          }
      }).then(response => {
        this.userGroupList = response.data;
      }).catch(error => {
        dealException(error);
      });
      //console.log("sessionStorage.getItem('teamUserGroupCodeForKanban'):" + sessionStorage.getItem('teamUserGroupCodeForKanban'));
      if(this.pageViewFlag != "forPersonal" && sessionStorage.getItem('teamUserGroupCodeForKanban')!=null && sessionStorage.getItem('teamUserGroupCodeForKanban')!=''){
        this.teamUserGroupCode = sessionStorage.getItem('teamUserGroupCodeForKanban');
      }
      this.initTeamTask();
    },
    changeTeamTask(){
      this.userList = [];
      if(this.pageViewFlag != "forPersonal"){
        sessionStorage.setItem('teamUserGroupCodeForKanban',this.teamUserGroupCode);
      }
      this.initTeamTask();
    },
    formatDate(checkDate){
        let s = '';
        let mouth = (checkDate.getMonth() + 1)>=10?(checkDate.getMonth() + 1):('0'+(checkDate.getMonth() + 1));
        let day = checkDate.getDate()>=10?checkDate.getDate():('0'+checkDate.getDate());
        s += checkDate.getFullYear() + '-';
        s += mouth + "-";
        s += day;
        return (s);
    },
    getWeek(dateString) {
        let dateArray = dateString.split("-");
        let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        return "周" + "日一二三四五六".charAt(date.getDay());
    },
    initTeamTask(){
      //this.totalTeamUserFilterOptions = [];
      //this.userList = [];
      this.cardObjMap = new Map(); //需要先清空，否则比如反馈之后，进度数据不会刷新成最新
      this.getUserListByOrg();
    },
    async getPendingTaskList(){
      if(this.pageViewFlag == 'forPersonal') return;
      let userV = [];
      for(let i in this.userList){
        //console.log("this.userList[i].id:"+this.userList[i].id);
        userV.push(this.userList[i].id);
      }
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          status:-1,
          userIdStr: userV.join(','),
          time:new Date().getTime()
        }
      }).then(response => {
        this.pendingTaskList = new TaskCard();
        let dataList = response.data.rows;
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          this.pending_task_num ++;
          this.pendingTaskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
        }
        //console.log("#### this.pendingTaskList:" +  this.pendingTaskList.getLength());
      }).catch(error => {
          dealException(error);
      });
    },
    async getTotalWorkingTaskMap(){
      let userV = [];
      for(let i in this.userList){
        //console.log("this.userList[i].id:"+this.userList[i].id);
        userV.push(this.userList[i].id);
      }
      //console.log("userV.join(',':"+userV.join(','));
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          userIdStr: userV.join(','),
          calendarDateArrangeStr: this.viewDateFrom + "," + this.viewDateTo,
          time:new Date().getTime()
        }
      }).then(response => {
        let dataList = response.data.rows;
        this.totalWorkingTaskMap = new Map();
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          this.totalWorkingTaskMap.set(dataList[i].id , dataList[i]);
        }
      }).catch(error => {
        dealException(error);
      });
    },
    async getExceptionTaskListByUser(){
      let userV = [];
      for(let i in this.userList){
        //console.log("this.userList[i].id:"+this.userList[i].id);
        userV.push(this.userList[i].id);
      }
      //console.log("userV.join(',':"+userV.join(','));
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          userIdStr: userV.join(','),
          statusStr: '30,40',
          needLeaderConfirm: true,
          time:new Date().getTime()
        }
      }).then(response => {
        let dataList = response.data.rows;
        this.exceptionTaskList = new TaskCard();
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          this.exceptionTaskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
        }
      }).catch(error => {
        dealException(error);
      });
    },
    async getUserListByOrg() {
      this.openLoading();
      this.workingTaskList = new TaskCard();
      this.pending_task_num = 0;
      this.assigned_task_num = 0;
      this.working_task_num = 0;
      this.checked_user_size = 0;
      this.teamTaskList = new TeamTask();
      this.pendingTaskList = new TaskCard();
      this.totalWorkingTaskMap = new Map();
      this.exceptionTaskList = new TaskCard();
      if(this.pageViewFlag == "forPersonal"){
        await axios.get(baseUrl+'/bms/public/myUserInfo',{
          params:{
            time:new Date().getTime()
          }
        }).then(response => {
          let userData = response.data;
          this.userIdForPersonal = userData.id;
          this.userMiForPersonal = userData.mi;
          let userNode = {"id":userData.id , "mi":userData.mi};
          this.userList = [];
          this.userList.push(userNode);
        }).catch(error => {
            dealException(error);
        });
        await this.getPendingTaskList();
        await this.getTotalWorkingTaskMap();
        await this.getExceptionTaskListByUser();

        this.user_size = this.userList.length;
        this.teamTaskList = new TeamTask();
        for (let i in this.userList) {
          this.teamTaskList.add(this.userList[i].id , this.userList[i].mi , this.copyNewTaskCol());
          let user_id = this.userList[i].id;
          await this.getTaskListBySingleUser(user_id);
        }
      }else{
        //console.log("@@@@@this.teamUserGroupCode:" + this.teamUserGroupCode + "###" + this.user_size + "##" + this.checked_user_size);
        if(this.teamUserGroupCode !='' || this.selRoleUser != ''){  //选了用户组，或者选过人
          if(this.teamUserGroupCode !=''){ //如果是选了用户组
            await axios.get(baseUrl+'/bms/public/userListByUserGroupCode',{
              params:{
                userGroupCode: this.teamUserGroupCode,
                time:new Date().getTime()
              }
            }).then(response => {
              let dataList = response.data;
              this.totalTeamUserList = dataList;
              if(this.userList.length==0){
                this.userList = JSON.parse(JSON.stringify(dataList));
                let optionChilren = [];
                this.selectedUserFilterOptions = [];
                for (let i in this.totalTeamUserList) {
                  optionChilren.push({ "value": this.totalTeamUserList[i].id, "label": this.totalTeamUserList[i].mi });
                  this.selectedUserFilterOptions.push([this.teamUserGroupCode , this.totalTeamUserList[i].id]);
                }
                //this.selectedUserFilterOptions = {...this.selectedUserFilterOptions};
                this.totalTeamUserFilterOptions = [];
                let teamName = getTeamName(this.teamUserGroupCode , this.userGroupList);
                this.totalTeamUserFilterOptions.push({ "value": this.teamUserGroupCode, "label": teamName , children: optionChilren });
              }
            }).catch(error => {
                dealException(error);
            });
          }else{ //如果是选了人
            this.userList = [];
            if(this.selRoleUser!=''){
              let selRoleUserList = this.selRoleUser.split("_");
              selRoleUserList.forEach((nodeItem)=>{
                try{
                    let _item = JSON.parse(nodeItem);
                    this.userList.push({ "mi": _item.name, "id": _item.linkId } );
                }catch(e){
                    console.log(e);
                }
              });
            }
          }
          await this.getPendingTaskList();
          await this.getTotalWorkingTaskMap();
          await this.getExceptionTaskListByUser();

          this.user_size = this.userList.length;
          this.teamTaskList = new TeamTask();
          for (let i in this.userList) {
            this.teamTaskList.add(this.userList[i].id , this.userList[i].mi , this.copyNewTaskCol());
            let user_id = this.userList[i].id;
            await this.getTaskListBySingleUser(user_id);
          }
        }else{
          this.user_size = 0;
          this.totalTeamUserList = [];
          this.userList = [];
          
        }
      }

      
      //console.log("this.userList.length:"+this.userList.length);
      this.closeLoading();
    },
    async getTaskListBySingleUser(user_id) {
      let e = this.teamTaskList[user_id];
      //以下查询用户的待办任务（已安排给他但未排入过计划）
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          dealer:e.id,
          statusStr:'10,20',
          time:new Date().getTime()
        }
      }).then(response => {
              let dataList = response.data.rows;
              for (let i in dataList) {
                //console.log("aaaadataList[i].id:"+dataList[i].id);

                putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
                if(dataList[i].status == 10){
                  this.assigned_task_num ++ ;
                  e.taskColList["t10"].taskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
                  this.taskColTemplate["t10"].taskList.add(dataList[i].id);//用于计数
                }else if(dataList[i].status == 20){
                  this.totalWorkingTaskMap.set(dataList[i].id , dataList[i]);
                  this.workingTaskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
                  this.working_task_num ++;
                }
              }
              axios.get(baseUrl+'/bms/kanban/taskCalendar/search',{
                params:{
                  viewDateFrom: this.viewDateFrom,
                  viewDateTo: this.viewDateTo,
                  dealer_str: e.id,
                  time:new Date().getTime()
                }
              }).then(response => {
                let dataList = response.data.rows;
                for (let i in dataList) {
                  //console.log("node check key:" + dataList[i].taskId);
                  let taskNode = this.totalWorkingTaskMap.get(dataList[i].taskId);
                  if(typeof taskNode=="undefined") continue;
                  //console.log("##taskNode:"+taskNode+"##dataList[i].taskId:"+dataList[i].taskId);
                  //console.log("dataList[i].date:" + dataList[i].date+"@@@@"+e.taskColList["t" + dataList[i].date]);
                  //console.log("@@@@@dataList[i].date:" + dataList[i].date);
                  //console.log("%%%"+e.taskColList["t" + dataList[i].date]);
                  //console.log("%%%"+e.taskColList.getLength());
                  e.taskColList["t" + dataList[i].date].taskList.add(taskNode.id,taskNode.title,taskNode.status,taskNode.expectFinishDate,taskNode.estimateManHour,0,taskNode.sourceDesc,taskNode.typeId,1,'T',0,dataList[i].id,dataList[i].priority);
                  this.taskColTemplate["t" + dataList[i].date].taskList.add(taskNode.id);
                }
                this.checked_user_size ++;
              }).catch(error => {
                dealException(error);
              });
      }).catch(error => {
         dealException(error);
      });

    },
    allTaskCardFold(){
      this.totalTaskFoldFlag = !this.totalTaskFoldFlag;
      for (let i in this.pendingTaskList) {
        this.$refs[this.pendingTaskList[i].seq_num][0].setFoldFlag(this.totalTaskFoldFlag);
      }
      for (let i in this.teamTaskList) {
        for(let j in this.teamTaskList[i].taskColList){
          for(let k in this.teamTaskList[i].taskColList[j].taskList){
            this.$refs[this.teamTaskList[i].taskColList[j].taskList[k].seq_num][0].setFoldFlag(this.totalTaskFoldFlag);
          }
        }
      }
    },
    copyNewTaskCol(){
      let newTaskCol = new TaskCol();
       for (let i in this.taskColTemplate) {
         newTaskCol.add(this.taskColTemplate[i].colId , this.taskColTemplate[i].colName , new TaskCard());
       }
       return newTaskCol;
    },
    toAddTask(){
      this.dialogTitle="添加任务";
      this.dialogTab = 'addTask';
      this.dialogVisible = true;
    },
    cleanDialog(){
      if(typeof this.$refs.addTaskWin!="undefined"){
        this.$refs.addTaskWin.cleanInfo();
      }
    },
    dialogSave(){
        if(this.dialogTab == 'addTask'){
            this.$refs.addTaskWin.save();
        }
    },
    changeDateSelType(){
      if(this.dateSelType=='1'){
        this.checked_user_size = 0;
        this.viewDateFrom = this.getBriefDate("s",0);
        this.viewDateTo = this.getBriefDate("e",0);
        this.setViewDateArray();
        this.taskColTemplate = new TaskCol()
          .add("t10","待办 ( 尚未列入日程计划 )",new TaskCard());
        for(let i in this.viewDateArray){
            this.taskColTemplate.add("t"+this.viewDateArray[i] , this.viewDateArray[i]+" "+this.getWeek(this.viewDateArray[i]), new TaskCard());
        }
        this.initTeamTask();
      }else if(this.dateSelType=='2'){
        this.checked_user_size = 0;
        this.viewDateFrom = this.getBriefDate("s",1);
        this.viewDateTo = this.getBriefDate("e",1);
        this.setViewDateArray();
        this.taskColTemplate = new TaskCol()
          .add("t10","待办 ( 尚未列入日程计划 )",new TaskCard());
        for(let i in this.viewDateArray){
            this.taskColTemplate.add("t"+this.viewDateArray[i] , this.viewDateArray[i]+" "+this.getWeek(this.viewDateArray[i]), new TaskCard());
        }
        this.initTeamTask();
      }else {
        this.fromToDateArray=[];
      }
    },
    changeDateSel(){
      this.viewDateFrom = this.fromToDateArray[0];
      this.viewDateTo = this.fromToDateArray[1];
      if(typeof this.viewDateFrom=="undefined"||this.viewDateTo=="undefined") return;
      this.setViewDateArray();
      this.taskColTemplate = new TaskCol()
        .add("t10","待办 ( 尚未列入日程计划 )",new TaskCard());
      for(let i in this.viewDateArray){
          this.taskColTemplate.add("t"+this.viewDateArray[i] , this.viewDateArray[i]+" "+this.getWeek(this.viewDateArray[i]), new TaskCard());
      }
      this.initTeamTask();
    },
    setViewDateArray(){
      this.viewDateArray = [];
      if(typeof this.viewDateFrom=="undefined"||this.viewDateTo=="undefined") return;
      //this.viewDateFrom = '2021-02-01';
      //console.log(this.viewDateFrom+"$$"+this.viewDateTo);
      let ab = this.viewDateFrom.split("-");
      let ae = this.viewDateTo.split("-");
      let db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      db.setFullYear(ab[0]);
      db.setMonth(parseInt(ab[1]) - 1);
      //console.log("####db.getMonth():" + db.getMonth() + "#####" +(parseInt(ab[1]) - 1));
      db.setDate(ab[2]);
      let de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      de.setFullYear(ae[0]);
      de.setMonth(ae[1] - 1);
      de.setDate(ae[2]);
      var unixDb = db.getTime();
      var unixDe = de.getTime();
      //console.log("@@@ab[1]:" + ab[1] +"##unixDb:"+ new Date(parseInt(unixDb)).getMonth());
      for (var k = unixDb; k <= unixDe;) {
          let date_desc = this.formatDate(new Date(parseInt(k)));
          //console.log("push it!!!!date_desc:" + date_desc);
          //arr.push((new Date(parseInt(k))).format());
          this.viewDateArray.push(date_desc);
           k = k + 24 * 60 * 60 * 1000;
      }
    },
    getBriefDate(type, dates) {  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
        var now = new Date();
        var nowTime = now.getTime();
        var day = now.getDay();
        if(day == 0) day = 7;
        var longTime = 24 * 60 * 60 * 1000;
        var n = longTime * 7 * (dates || 0);
        if (type == "s") {
            var dd = nowTime - (day - 1) * longTime + n;
        };
        if (type == "e") {
            var dd = nowTime + (7 - day) * longTime + n;
        };
        dd = new Date(dd);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        m = m < 10 ? "0" + m: m;
        d = d < 10 ? "0" + d: d;
        var day = y + "-" + m + "-" + d;
        return day;
    },
    cancelUserFilter(){
      this.selectedUserFilterOptions = [];
      for (let i in this.userList) {
        this.selectedUserFilterOptions.push([this.teamUserGroupCode , this.userList[i].id]);
      }
      this.filterUserDialogVisible = false;
    },
    setUserFilter(){
      this.filterUserDialogVisible = true;
    },
    doUserFilter(){
      if(this.selectedUserFilterOptions.length == 0){
        this.$message({type: 'error',message: '请至少选择一位伙伴！'});
        return;
      }
      this.filterUserDialogVisible = false;
      //this.getUserListByOrg();
      this.userList = [];
      for(let i in this.selectedUserFilterOptions){
        //console.log("$$"+this.selectedUserFilterOptions[i][1]);
        let focus_user_id = this.selectedUserFilterOptions[i][1];
        for(let j in this.totalTeamUserList){
          if(this.totalTeamUserList[j].id == focus_user_id){
            this.userList.push(this.totalTeamUserList[j]);
            break;
          }
        }
      }
      this.user_size = this.userList.length;
      this.checked_user_size = this.userList.length;
    },
    isInUserList(checkUserId){
      let re = false;
      for(let i in this.userList){
        if(this.userList[i].id == checkUserId){
          re = true;break;
        }
      }
      return re;
    },
    selectRoleUser(data){
      console.log("data:" + data);
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.selRoleUser = data.id.split("|").join('_');
      console.log("this.selRoleUser:" + this.selRoleUser);
      this.changeTeamTask();
    },
    openLoading,
    closeLoading,
    jumpPage,
    getPageViewOptions,
    initOpRoleList,
    jumpToTaskListView
  },
  watch: {
    '$route' (to, from) {
		  // 监听路由参数变化，重新加载数据
      this.$router.go(0);
	  }
  }
}
</script>
<style scoped>
body,html{
  height:100%;
  overflow-y: hidden;
}
body {
   font-family: "Microsoft YaHei";
}
.el-aside-div{
  padding:0px 20px;
  margin:5px 0px 0px 15px;
  background-color: #f5f5f9;
  display:inline-block;
  vertical-align: top;
}
.el-main-div{
  overflow-y:visible;
  padding:5px 20px 0px 0px;
  overflow-x:visible;
  display:inline-block;
  height: calc(100% - 31px);
}
.head_tag{
  margin: 15px 15px;
  padding:13px 20px;
  border-radius: 5px;
  display: inline-block;
}
.red_bg{
  background-color: #d05a56;
}
.green_bg{
  background-color: #369a8e;
}
.blue_bg{
  background-color: #3a76d6;
}
.head_tag .tagDiv{
  display: inline-block;
}
.head_tag .title{
  color: white;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  padding-bottom: 6px;
}
.head_tag .num{
  color: white;
  font-family: "Microsoft YaHei";
  font-size: 30px;
  font-weight:400;
  padding-left:0px;
}
.head_tag .desc{
  color: white;
  font-family: "Microsoft YaHei";
  font-size: 14px;
}
.el-divider {
    display: inline-block;
    width: 1px;
    height: 45px;
    margin: 10px 30px 0px 30px;
    padding-top: 5px;
    vertical-align: top;
    background-color: #b9b9bd;
}
.listColDiv{
  padding:0px 10px 5px 10px;
  white-space: nowrap;
}
.listColTitle{
  display: inline-block;
  font-family: "Microsoft YaHei",PingFangSC-Medium, sans-serif;
  font-weight: bold;
  color: #323234;
  font-size: 14px;
  padding-left: 10px;
}
.rowDiv{
  margin: 0px 0px 7px 2px;
  background-color: #f5f5f9;
  white-space: nowrap;
  overflow-x:visible;
}
.rowDiv .userInfoDiv{
  font-family: "Microsoft YaHei",PingFangSC-Medium, sans-serif;
  color: #1d1e22;
  font-size: 14px;
  font-weight: bold;
  padding: 20px 0px 0px 20px;
}
.rowDiv .colDiv{
  display: inline-block;
  vertical-align: top;
  margin-right:10px;
  min-height: 75px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
/*整体部分*/
.colDiv::-webkit-scrollbar
{
	width: 10px;
	height: 10px;
}
/*滑动轨道*/
.colDiv::-webkit-scrollbar-track
{
	border-radius: 0px;
	background: #f1f1f1;
}
/*滑块*/
.colDiv::-webkit-scrollbar-thumb
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color:#d3d1d1;
}
body{
  overflow:hidden;
}
</style>
