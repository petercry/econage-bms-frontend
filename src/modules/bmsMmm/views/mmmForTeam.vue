<template>
  <el-container style="height:100%;width:100%" v-if="user_size == checked_user_size">
    <el-header style="height:120px;">
        <div class="pageTop">
          <div style="display:inline-block;">
            <div class="pageTitle">
                <i class="fa fa-users" style="vertical-align:middle;line-height:42px;"></i> 
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
              <el-select v-model="teamUserGroupCode" placeholder="请选择团队" @change="changeTeamTask" style="width:170px;vertical-align:top;">
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
                    v-if="teamUserGroupCode==''"
                    >
              </tag-select>
              <el-badge :value="this.userList.length"  style="margin-right:17px;vertical-align:top;" type="primary" v-if="teamUserGroupCode!=''">
                <el-button size="medium" style="color:#409EFF;border-color:#409EFF;height:40px;" @click="setUserFilter"><i class="fa fa-filter"></i> 筛选{{this.userList.length}}人</el-button>
              </el-badge>
              <div class="prioritySearchDiv">
                <el-checkbox-group v-model="priorityList" @change="getUserListByOrg" >
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
                  <el-dropdown-item  @click.native="jumpToTaskListView(null , null , null ,teamUserGroupCode , false , 'forTeam')">列表模式查看</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>  
          <div class="pageViewChangeDiv" v-if="false">
            <div>
                <div class="head_tag red_bg" >
                    <headTag title="总工时" :num="this.headTag_mh_total" desc="小时"/>
                    <div class="el-divider"></div>
                    <headTag title="已完成工时" :num="this.headTag_mh_complete" desc="小时"/>
                </div>
                <div class="head_tag blue_bg" >
                    <headTag title="需求" :num="this.require_num" desc=""/>
                    <div class="el-divider"></div>
                    <headTag title="任务" :num="this.task_num" desc=""/>
                    <div class="el-divider"></div>
                    <headTag title="BUG" :num="this.bug_num" desc=""/>
                </div>
            </div>
          </div>
        </div>
    </el-header>
    <div style="height:calc(100vh - 120px);padding-left:20px;overflow-x:auto;white-space: nowrap;">
      <div class="listColDiv">
          <div class="listColTitle" :style="'width:'+(taskColWidth+35)+'px;'" v-if="pendingTaskList.getLength()>0">未安排 ({{pendingTaskList.getLength()}})</div>
          <div class="listColTitle" :style="'width:'+(userNameColWidth+20)+'px;padding-left:10px;'">员工 ({{user_size}})</div>
          <div class="listColTitle" :style="'width:'+taskColWidth+'px;'" v-for="(item,index) in taskColTemplate" :key="index">{{item.colName}} ({{item.taskList.getLength()}})</div>
      </div>
      <div class="el-aside-div" :style="'width:'+(taskColWidth-10)+'px;'" v-if="pendingTaskList.getLength()>0">
        <taskCard v-for="(taskCardItem) in pendingTaskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
      </div>
      <div class="el-main-div">
        <div class="rowDiv" v-for="(item) in teamTaskList" :key="item.id" >
          <template v-if="isInUserList(item.id)">
            <div class="colDiv userInfoDiv" :style="'width:'+userNameColWidth+'px;'" >{{item.userName}}</div>
            <div class="colDiv" :style="'width:'+taskColWidth+'px;'" v-for="(taskColItem,taskColIdx) in taskColTemplate" :key="taskColIdx" >
              <taskCard v-for="(taskCardItem) in item.taskColList[taskColItem.colId].taskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addTask v-if="dialogTab=='addTask'" ref="addTaskWin"></addTask>
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
      require_num:0,
      task_num:0,
      bug_num:0,
      userNameColWidth:90, //显示人员的列的宽度
      taskColWidth:325,//显示任务卡片列表的列的宽度
      pendingTaskList: new TaskCard(),
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
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      filterUserDialogVisible:false,
      pageViewFlag:'forTeam',
      teamUserGroupCode:'',
      cardObjMap:new Map(),
      priorityList:["1","2","3"],
      opRoleList:null,
      userFilterProps: { multiple: true },
      totalTeamUserFilterOptions:[],    //整个团队成员的选择框选项，不参与筛选
      selectedUserFilterOptions:[],     //与筛选框绑定的opt选项
    }
  },
  created(){
    //this.selRoleUser = '{"type":"PERSONNEL","orgId":"1292475767798575107.1292475794252050434","linkId":"1292475794252050434","name":"徐镭","orgPath":"徐镭"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1503370492087566338","linkId":"1503370492087566338","name":"蔡京园","orgPath":"蔡京园"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1292475801671774209","linkId":"1292475801671774209","role":null,"name":"潘琦","orgPath":"杭州微宏科技有限公司-产品技术中心-iBpm研发事业部-潘琦"}_{"type":"PERSONNEL","orgId":"1292475767798575107.1292475798073061377","linkId":"1292475798073061377","role":null,"name":"王俊杰","orgPath":"杭州微宏科技有限公司-产品技术中心-iBpm研发事业部-王俊杰"}';
    this.initData();
  },
  mounted(){
  },
  methods: {
    async initData(){
      this.userList = [];
      this.taskColTemplate = new TaskCol()
      .add("r10","待办",new TaskCard())
      .add("r20","进行中",new TaskCard())
      .add("r30","已完成未确认",new TaskCard())
      //.add("r40","已完结",new TaskCard())
      //.add("r50","挂起",new TaskCard());
      console.log("begin getOpRole!!!");     
      this.initOpRoleList();
      if(sessionStorage.getItem('teamUserGroupCodeForKanban')!=null && sessionStorage.getItem('teamUserGroupCodeForKanban')!=''){
        this.teamUserGroupCode = sessionStorage.getItem('teamUserGroupCodeForKanban');
      }
      await axios.get(baseUrl+'/bms/public/userGroupListForKanban',{
          params:{
            time:new Date().getTime()
          }
      }).then(response => {
        this.userGroupList = response.data;
      }).catch(error => {
        dealException(error);
      });
      this.initTeamTask();
    },
    changeTeamTask(){
      this.userList = [];
      this.taskColTemplate = new TaskCol()
      .add("r10","待办",new TaskCard())
      .add("r20","进行中",new TaskCard())
      .add("r30","已完成未确认",new TaskCard())
      //.add("r40","已完结",new TaskCard())
      //.add("r50","挂起",new TaskCard());
      sessionStorage.setItem('teamUserGroupCodeForKanban',this.teamUserGroupCode);
      this.initTeamTask();
    },
    initTeamTask(){
      //this.totalTeamUserFilterOptions = [];
      //this.userList = [];
      //this.cardObjMap = new Map();
      
      this.getUserListByOrg();
        /**
     * @param {string} seq_num  编号
     * @param {string} content  内容
     * @param {string} status_id  状态
     * @param {string} date  日期
     * @param {string} manHour  工时
     * @param {string} percent  完成百分比
     * @param {string} sourceDesc  来源（项目）
     */ 
    /* 
      }*/
    },
    async getPendingTaskList(){
      let userV = [];
      for(let i in this.totalTeamUserList){
        //console.log("this.userList[i].id:"+this.userList[i].id);
        userV.push(this.totalTeamUserList[i].id);
      }
      let priorityStr = null;
      if(this.priorityList.length<3){
        priorityStr = this.priorityList.join(',');
      }
      //console.log("userV.join(','):"+userV.join(','));
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          status: -1,
          userIdStr: userV.join(','),
          priorityStr: priorityStr,
          time:new Date().getTime()
        }
      }).then(response => {
        this.pendingTaskList = new TaskCard();
        let dataList = response.data.rows;
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          this.pendingTaskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
        }
      }).catch(error => {
          dealException(error);
      });
    },
    async getUserListByOrg() {
      this.openLoading();
      if(this.priorityList.length == 0){
        this.priorityList = ["1","2","3"];
      }
      //return;
      this.checked_user_size = 0;
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
            //console.log("####this.userList.length:"+this.userList.length);
            if(this.userList.length==0){
              this.userList =JSON.parse(JSON.stringify(dataList)); 
              let optionChilren = [];
              this.selectedUserFilterOptions = [];
              for (let i in this.totalTeamUserList) {
                optionChilren.push({ "value": this.totalTeamUserList[i].id, "label": this.totalTeamUserList[i].mi });
                this.selectedUserFilterOptions.push([this.teamUserGroupCode , this.totalTeamUserList[i].id]);
              }
              this.totalTeamUserFilterOptions = [];
              let teamName = getTeamName(this.teamUserGroupCode , this.userGroupList);
              this.totalTeamUserFilterOptions.push({ "value": this.teamUserGroupCode, "label": teamName , children: optionChilren });
            }
            //console.log("####dataList.length:"+dataList.length);
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
        this.user_size = this.userList.length;
        this.teamTaskList = new TeamTask();
        for (let i in this.userList) {
          this.teamTaskList.add(this.userList[i].id , this.userList[i].mi , this.copyNewTaskCol());
          let user_id = this.userList[i].id;
          this.getTaskListBySingleUser(user_id);
        }
        await this.getPendingTaskList();
      }else{
        this.user_size = 0;
        this.totalTeamUserList = [];
        this.userList = [];
        //this.totalTeamUserFilterOptions = [];
        //this.selectedUserFilterOptions = [];
        this.teamTaskList = new TeamTask();
        this.pendingTaskList = new TaskCard();
      }
      this.closeLoading();  
    },
    async getTaskListBySingleUser(user_id) {
      let e = this.teamTaskList[user_id];
      let priorityStr = null;
      if(this.priorityList.length<3){
        priorityStr = this.priorityList.join(',');
      }
      await axios.get(baseUrl+'/bms/kanban/task/search',{
        params:{
          dealer:e.id,
          priorityStr:priorityStr,
          statusStr:'10,20,30',
          time:new Date().getTime()
        }
      }).then(response => {
        let dataList = response.data.rows;
        for (let i in dataList) {
          let checkStatus = dataList[i].status;
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          //console.log("checkStatus:"+checkStatus);
          //console.log("e.taskColList[\"r\"+checkStatus]:"+e.taskColList["r"+checkStatus]);
          if(typeof e.taskColList["r"+checkStatus]!="undefined"){
            e.taskColList["r"+checkStatus].taskList.add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
            this.taskColTemplate["r"+checkStatus].taskList.add(dataList[i].id);//用于计数
          }
        }  
        if(this.isInUserList(user_id)) this.checked_user_size ++;
      }).catch(error => {
          dealException(error);
      });
      //console.log("####this.checked_user_size:"+this.checked_user_size+"##this.user_size:"+this.user_size);
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
      //this.teamTaskList = new TeamTask();
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
    initOpRoleList,
    getPageViewOptions,
    jumpToTaskListView
  },
  watch: {

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
  height: 100%;
}
.head_tag{
  margin: 15px 15px;
  padding:20px 40px;
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
</style>