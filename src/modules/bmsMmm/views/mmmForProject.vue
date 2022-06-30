<template>
  <el-container style="height:100%;" v-if="dataMountedFlag">
    <el-header :style="'height:100px;'">
      <div class="pageTop">
        <div style="display:inline-block;">
          <div class="pageTitle" v-if="!isProjectExclusive">
              <i class="fa fa-tasks" style="vertical-align:middle;line-height:42px;"></i> 
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
            <el-select v-model="proType" slot="prepend" placeholder="请选择" @change="changeProType" style="width:105px;margin-right:-5px;" v-if="!isProjectExclusive">
              <el-option label="实际项目" value="1"></el-option>
              <el-option label="内部迭代" value="2"></el-option>
            </el-select>
            <el-select v-if="!isProjectExclusive"
              v-model="projectId"
              filterable
              remote
              :placeholder="proSearchPlaceHolder"
              :remote-method="searchProject"
              style="width:250px;"
              @change="changeProject"
              >
              <el-option
                v-for="item in proOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-tag v-if="isProjectExclusive" style="text-align:center;font-size:16px;letter-spacing:2px;font-weight:bold;">{{projectDesc}}</el-tag>
            <div class="prioritySearchDiv">
              <el-checkbox-group v-model="priorityList" @change="getTaskListFunc" >
                <el-checkbox label="1" class="priority1"></el-checkbox>
                <el-checkbox label="2" class="priority2"></el-checkbox>
                <el-checkbox label="3" class="priority3"></el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button type="primary" size="medium" icon="el-icon-plus" @click.native="toAddTask" v-if="opRoleList['addTask'].flag">新建任务</el-button>
            <el-dropdown>
              <el-button size="medium" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="allTaskCardFold">全部折叠/展开</el-dropdown-item>
                <el-dropdown-item  @click.native="jumpToTaskListView(projectId , proType , isProjectExclusive ,'' , false , 'forProject',projectDesc)">列表模式查看</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>  
        <div class="pageViewChangeDiv" >
          <div class="head_tag blue_bg" >
            <headTag title="已完结任务数" :num="this.finish_task_num" desc=""/>
            <div class="el-divider"></div>
            <headTag title="挂起任务数" :num="this.suspend_task_num" desc=""/>
            <div class="el-divider"></div>
            <headTag title="取消任务数" :num="this.cancel_task_num" desc=""/>
          </div>
        </div>
      </div>
    </el-header>
    <el-main :style="(isProjectExclusive?'padding-top:0px;':'')">
      <div class="colDiv" :style="'width:'+taskColWidth+'px;'" v-for="(item,index) in taskStatusColList" :key="index">
        <div class="colTitle">{{item.colName}} ({{item.taskList==null?0:item.taskList.getLength()}})</div>
        <div class="colContent">
          <taskCard v-for="(taskCardItem) in item.taskList" :key="taskCardItem.seq_num" :seq_num="taskCardItem.seq_num" :content="taskCardItem.content" :date="taskCardItem.date" :manHour="taskCardItem.manHour" :percent="taskCardItem.percent" :status_id="taskCardItem.status_id" :defaultFold="totalTaskFoldFlag?1:0" :sourceDesc="taskCardItem.sourceDesc" :typeId="taskCardItem.typeId" :isAdmin="taskCardItem.isAdmin" :cardTypeProp="taskCardItem.cardTypeProp" :childrenCount="taskCardItem.childrenCount" :priority="''+taskCardItem.priority" :ref="taskCardItem.seq_num"/>
        </div>
      </div>
    </el-main>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addTask v-if="dialogTab=='addTask'" :projectIdProp="projectId" :projectFlagProp="proType" :projectDescProp="projectDesc" ref="addTaskWin"></addTask>
        <div slot="footer" class="dialog-footer" >
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
    </el-dialog>
    
  </el-container>
</template>
<script>
import headTag from "@/modules/bmsMmm/component/headTag.vue";
import taskCard from "@/modules/bmsMmm/component/taskCard.vue";
import addTask from "@/modules/bmsMmm/component/addTask.vue";
import { TaskCard } from "@/modules/bmsMmm/util/TaskCard.js";
import { TaskCol } from "@/modules/bmsMmm/util/TaskCol.js";
import { getTaskCountByProject,getTaskListByProject,openLoading,closeLoading,dealException,getPageViewOptions,jumpPage,getIterationProjectList,putObjToMap,initOpRoleList,jumpToTaskListView } from "@/modules/bmsMmm/service/service.js";
import { getProjectList } from "@/modules/bmsProject/service/service.js";
import {mapMutations} from 'vuex';
export default{
  name:'mmmList',
  components:{
    headTag,
    taskCard,
    TaskCol,
    addTask
  },
  data(){
    return {
      isProjectExclusive : false,//如果是从项目过来的查看，则为独占模式
      loading:true,
      taskColWidth:345,//显示任务卡片列表的列的宽度
      dataMountedFlag : false ,//数据加载完后再渲染页面
      projectId : "crm88_128191",
      projectDesc:'',
      priorityList:["1","2","3"],
      totalTaskFoldFlag:false,
      headTag_mh_complete:0,
      headTag_mh_total:0,
      headTag_mh_working:0,
      finish_task_num:0,
      suspend_task_num:0,
      cancel_task_num:0,
      taskStatusColList:new TaskCol(),
      pageViewFlag:'forProject',
      proType:'2',
      proSearchPlaceHolder:'请输入关键词搜索内部迭代项目',
      iterationProjectList:[],
      proOptions:[],
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      projectPaginationInfo: {
        projectName : "",
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      projectList:[],
      cardObjMap:new Map(),
      opRoleList:null,
    }
  },
  props:['projectIdForView','projectNameForView','projectTypeForView'],
  created(){
    this.initData();
  },
  methods: {
    async initData(){
      //console.log("#############initData for mmmForProject");
      if(typeof this.projectIdForView!="undefined"){
        this.projectId = this.projectIdForView;
        this.isProjectExclusive = true;
        if(typeof this.projectNameForView!="undefined"){
          this.projectDesc = this.projectNameForView;
        }
      }else if(typeof this.$route.params.projectIdProp!="undefined"){
        this.projectId = this.$route.params.projectIdProp;
        console.log("this.$route.params.projectNameProp:" + this.$route.params.projectNameProp);
        if(typeof this.$route.params.projectNameProp!="undefined"){
          this.projectDesc = this.$route.params.projectNameProp;
        }
      }
      console.log("this.projectId:" + this.projectId);
      if(typeof this.projectTypeForView!="undefined"){
        this.proType = this.projectTypeForView;
      }else if(typeof this.$route.params.proTypeProp!="undefined"){
        this.proType = this.$route.params.proTypeProp;
      }
      console.log("this.proType:" + this.proType);
      if(typeof this.$route.params.isProjectExclusiveProp!="undefined"){
        this.isProjectExclusive = this.$route.params.isProjectExclusiveProp;
      }
      console.log("this.isProjectExclusive:" + this.isProjectExclusive);
     
      await this.getIterationProjectListFunc();
      if(this.proType == '1' && this.projectId !='' && this.projectDesc != ''){
        this.proOptions = [];
        this.proOptions.push({"id":this.projectId , "name":this.projectDesc});
      }
      this.getTaskListFunc();
    },
    countOtherStatusTaskNumByProject(){
      getTaskCountByProject(this.projectId,'40' ).then(response => {
        this.finish_task_num = response.data;
      }).catch(error => {
        dealException(error);
        this.closeLoading();
      });
      getTaskCountByProject(this.projectId,'50' ).then(response => {
        this.suspend_task_num = response.data;
      }).catch(error => {
        dealException(error);
        this.closeLoading();
      });
      getTaskCountByProject(this.projectId,'60' ).then(response => {
        this.cancel_task_num = response.data;
      }).catch(error => {
        dealException(error);
        this.closeLoading();
      });
    },
    async getIterationProjectListFunc(nameQuery) {
      await getIterationProjectList(nameQuery).then(response => {
        this.iterationProjectList = response.data.rows;
        this.proOptions = this.iterationProjectList;
      })
      .catch(error => {
          dealException(error);
      });
    },
    getProjectListFunc(nameQuery) {
      this.openLoading();
      this.projectPaginationInfo.projectName = nameQuery;
      getProjectList(this.projectPaginationInfo,1).then(response => {
          this.projectList = response.data.rows;
          //console.log("####this.projectList:"+this.projectList.length);
          this.proOptions = [];
          for(let i in this.projectList){
            let node = {"id":this.projectList[i].id , "name":this.projectList[i].projectName};
            this.proOptions.push(node);
          }
          //console.log("####this.proOptions:"+this.proOptions);
          this.projectPaginationInfo.total = response.data.total;
          this.closeLoading();   
        }).catch(error => {
          this.closeLoading();
        });
    },
    allTaskCardFold(){
      this.totalTaskFoldFlag = !this.totalTaskFoldFlag;
      for(let i in this.taskStatusColList){
        let nodeTaskList = this.taskStatusColList[i].taskList;
        for(let j in nodeTaskList){
          this.$refs[nodeTaskList[j].seq_num][0].setFoldFlag(this.totalTaskFoldFlag);
        }
      }
    },
    async getTaskListFunc() {
      this.openLoading();
      this.initOpRoleList();
      if(this.priorityList.length == 0){
        this.priorityList = ["1","2","3"];
      }
      this.cardObjMap = new Map();
      this.taskStatusColList = new TaskCol()
        .add("t-1","未安排",null)
        .add("t10","已安排(待办)",null)
        .add("t20","进行中",null)
        .add("t30","已完成未确认",null);
      getTaskListByProject(this.projectId,this.priorityList,'-1,10,20,30' ).then(response => {
        let dataList = response.data.rows;
        this.countOtherStatusTaskNumByProject();
        for (let i in dataList) {
          putObjToMap(this.cardObjMap,dataList[i].id,dataList[i]);
          let checkStatus = "t" + dataList[i].status;
          let checkNode = this.taskStatusColList[checkStatus];
          if(typeof checkNode == "undefined" || checkNode == null) continue;
          if(typeof checkNode.taskList == "undefined" || checkNode.taskList == null) checkNode.taskList = new TaskCard();
          (checkNode.taskList).add(dataList[i].id,dataList[i].title,dataList[i].status,dataList[i].expectFinishDate,dataList[i].estimateManHour,0,dataList[i].sourceDesc,dataList[i].typeId,1,'T',0,'',dataList[i].priority);
        }
        this.dataMountedFlag = true;
        this.closeLoading();
        })
        .catch(error => {
          dealException(error);
          this.closeLoading();
        });
    },
    changeProType(){
      if(this.proType == '2'){
        this.proSearchPlaceHolder = "请输入关键词搜索内部迭代项目";
        this.proOptions = this.iterationProjectList;
        this.projectId = '';
      }else{
        this.proSearchPlaceHolder = "请输入关键词搜索实际项目";
        this.proOptions = [];
        this.projectId = '';
      }
    },
    searchProject(nameQuery){
      //console.log("nameQuery:" + nameQuery+"##this.proType:"+this.proType);
      if(this.proType == '2'){
          getIterationProjectList(nameQuery).then(response => {
            this.proOptions = response.data.rows;
          })
          .catch(error => {
              dealException(error);
          });
      }else{
        this.getProjectListFunc(nameQuery);
      }
    },
    changeProject(){
       for(let i in this.proOptions){
         if(this.proOptions[i].id == this.projectId){
           this.projectDesc = this.proOptions[i].name;
         }
       }
       this.getTaskListFunc();
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

.red_bg{
  background-color: #d05a56;
}
.green_bg{
  background-color: #369a8e;
}
.blue_bg{
  background-color: #3a76d6;
}
.el-main{
  height:calc(100vh - 100px);
  overflow-y:hidden;
  padding:10px 20px 0px 30px;
  white-space: nowrap;
}
.el-main .colDiv{
  display: inline-block;
  vertical-align: top;
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
.colDiv .colTitle{
  font-family: "Microsoft YaHei",PingFangSC-Medium, sans-serif;
  font-weight: bold;
  color: #323234;
  font-size: 14px;
  padding:15px 0px 0px 20px;
}
.colDiv .colContent{
  overflow-x:hidden;
  height:calc(100% - 49px);
  overflow-y: auto;
  padding: 0px 20px 0px 15px;
  margin:10px 10px 0px 0px;
  background-color: #f5f5f9;
}
.colDiv{
  height:100%;
  overflow-y: auto;
  overflow-x: hidden;
}
/*整体部分*/ 
.colContent::-webkit-scrollbar
{
	width: 10px;
	height: 10px;
}
/*滑动轨道*/ 
.colContent::-webkit-scrollbar-track
{
	border-radius: 0px;
	background: #f1f1f1;
}
/*滑块*/
.colContent::-webkit-scrollbar-thumb
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color:#d3d1d1;
}
.loadingClass{
  background-color: rgba(0, 0, 0, 0.411) !important;
}
.loadingClass .el-loading-spinner .el-loading-text {
  color: rgb(32, 87, 141);
  margin: 3px 0;
  font-size: 24px;
}
.loadingClass .el-loading-spinner .el-icon-loading{
  color: rgb(32, 87, 141);
  margin: 3px 0;
  font-size: 64px;
}
</style>