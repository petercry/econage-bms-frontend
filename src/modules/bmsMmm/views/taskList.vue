<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="65px" type="tool" >
        <el-row style="padding:12px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="16" >
            <eco-tool-title style="line-height: 34px;" :title="'任务列表'+'（'+paginationInfo.total+'）'"></eco-tool-title>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-right:10px;">
             <el-button type="primary" class="btn"  icon="el-icon-plus" @click.native="toAddTask" v-if="opRoleList['addTask'].flag">新建任务</el-button>
             <div class="toolbarDiv" style="display: inline-block;">
             <el-dropdown>
              <el-button size="medium" class="dropDownBtn">...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="jumpToTaskKanbanView(paginationInfo.projectId , paginationInfo.proType , isProjectExclusive ,teamUserGroupCode,projectName)">看板模式查看</el-dropdown-item>
                <el-dropdown-item  @click.native="exportTaskListXls()">导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
             </div>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top="65px" height="95px" type="tool">
        <el-row style="padding:5px 5px 5px 25px ;background-color:#fff;">
          <el-col :span="24">
            <el-select v-model="paginationInfo.proType"  placeholder="请选择" @change="changeProType" style="width:105px;" v-bind:disabled="isProjectExclusive||isPersonalExclusive" >
              <el-option label="不限项目" value="0"></el-option>
              <el-option label="实际项目" value="1"></el-option>
              <el-option label="内部迭代" value="2"></el-option>
            </el-select>
            <el-select v-if="!isProjectExclusive"
              v-model="paginationInfo.projectId"
              filterable
              remote
              :placeholder="proSearchPlaceHolder"
              :remote-method="searchProject"
              style="width:250px;"
              v-bind:disabled="paginationInfo.proType==0"
              >
              <el-option
                v-for="item in proOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-tag v-if="isProjectExclusive" style="text-align:center;font-size:16px;letter-spacing:2px;font-weight:bold;width:250px;">{{projectName}}</el-tag>
            &nbsp;&nbsp;
            任务名称：
            <el-input placeholder="请输入任务名称" v-model="paginationInfo.title" style="width:193px;"></el-input>&nbsp;&nbsp;
            状态：　　　　
            <el-select v-model="paginationInfo.statusList" multiple placeholder="请选择任务状态" style="width:325px;">
              <el-option
                v-for="item in taskStatusVForLeader"
                :key="''+item.id"
                :label="item.desc"
                :value="''+item.id">
              </el-option>
            </el-select>&nbsp;&nbsp;
            <el-button type="warning" icon="el-icon-search" size="medium" @click.native="getTaskListFuncWithPageReset()">搜索</el-button>
            <el-button type="info" size="medium" @click.native="clearSearchParam()">清空条件</el-button>
          </el-col>
          <el-col :span="24" style="padding-top:5px;" class="searchRow">
            <el-select v-model="teamUserGroupCode" placeholder="请选择团队" @change="changeTeamTask" :style="'width:'+(teamUserGroupCode==''?'105':'205')+'px;'" v-bind:disabled="isPersonalExclusive">
              <el-option label="不限团队" value="" ></el-option>
              <!--
              <el-option label="iBpm技术团队" value="ibpm" v-if="opRoleList['iBpmTeamView'].flag"></el-option>
              <el-option label="AlphaFlow技术团队" value="af" v-if="opRoleList['afTeamView'].flag"></el-option>
              -->
              <el-option
                v-for="item in userGroupList"
                :key="''+item.code"
                :label="item.name"
                :value="''+item.code">
              </el-option>
            </el-select>
            <tag-select 
                  placeholder="请选择人员"  
                  style="width: 250px;"
                  :initDataStr="selRoleUser"
                  :initOptions="{selectNum:2,selectType:'User',maxOrgPathLevel:0,idSplit:'_'}" 
                  @callBack="selectRoleUser" 
                  v-if="teamUserGroupCode==''&&!isPersonalExclusive"
                  >
            </tag-select>
            <el-tag v-if="isPersonalExclusive" style="width:100px;text-align:center;font-size:14px;letter-spacing:2px;font-weight:bold;margin-right:150px;">{{myName}}</el-tag>
            <el-badge :value="this.userList.length" type="primary" v-if="teamUserGroupCode!=''">
              <el-button size="medium" style="width:150px;color:#409EFF;border-color:#409EFF;" @click="setUserFilter"><i class="fa fa-filter"></i> 筛选{{this.userList.length}}人</el-button>
            </el-badge>
            &nbsp;&nbsp;优先级：　
            <div class="prioritySearchDiv" style="vertical-align:top;padding-top:5px;">
              <el-checkbox-group v-model="paginationInfo.priorityList" >
                <el-checkbox label="1" class="priority1"></el-checkbox>
                <el-checkbox label="2" class="priority2"></el-checkbox>
                <el-checkbox label="3" class="priority3"></el-checkbox>
              </el-checkbox-group>
            </div>&nbsp;&nbsp;
            要求完成日期：
            <el-date-picker 
                v-model="paginationInfo.fromToExpectFinishDateArray"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="—"
                start-placeholder="开始"
                end-placeholder="结束"
                format="yyyy-MM-dd" 
                value-format="yyyy-MM-dd"
                style="width:250px;">
            </el-date-picker>&nbsp;&nbsp;
            录入日期：
            <el-date-picker 
                v-model="paginationInfo.fromToCreateDateArray"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="—"
                start-placeholder="开始"
                end-placeholder="结束"
                format="yyyy-MM-dd" 
                value-format="yyyy-MM-dd"
                style="width:250px;">
            </el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
            
          </el-col>    
        </el-row>
      </eco-content>
    </div>
    <ecoContent top="160px" bottom="0px" >
      <ecoContent top="0px" bottom="42px" ref="content">
          <el-table :data="taskListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'createDate', order: 'descending'}" @sort-change="changeSort">
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.isLinkStyle" class="taskListBtnDiv">
                 <el-button class="taskListBtn" @click="showDetWin(scope.row.id)" type="text" >{{scope.row[colEl.paramName]}}</el-button><br>
                 <span class="miniTextSpan1 miniTextSpan2">{{scope.row['projectDesc']}}</span>
                </div>
                <div v-else-if="colEl.paramName=='status'">
                  {{getTaskStatusDesc(scope.row[colEl.paramName])}}
                </div>
                <div v-else-if="colEl.paramName=='createDate'">
                  {{formatDateToMinute(scope.row[colEl.paramName])}}
                </div>
                <div v-else-if="colEl.paramName=='op'">
                  <el-button type="text" @click.native="editTask(scope.row.id)" v-if="opRoleList['editTask'].flag">编辑</el-button>
                  <el-button type="text" style="color:red;" @click.native="deleteTask(scope.row.id)" v-if="opRoleList['deleteTask'].flag">删除</el-button>
                </div>
                <div v-else>
                  {{scope.row[colEl.paramName]}}
                </div>
              </template> 
            </el-table-column>
          </el-table>
        
      </ecoContent>

      <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
          <div style="text-align: right;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginationInfo.page"
              :page-sizes="[20,30,50,100]"
              :page-size="paginationInfo.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paginationInfo.total">
            </el-pagination>
          </div>
      </eco-content>
    </ecoContent>  
    <el-drawer :title="detDialogTitle" :with-header="false" :visible.sync="detDialogVisible" direction="rtl" size="70%" :destroy-on-close="true" ref="detDialog" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
          <br>
          <taskInfo :taskId="focusTaskId" ></taskInfo>
    </el-drawer>
    <el-dialog width="90%" :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="true" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
        <addTask v-if="dialogTab=='addTask'" :projectIdProp="paginationInfo.projectId" :projectFlagProp="paginationInfo.proType" :projectDescProp="projectName" ref="addTaskWin"></addTask>
        <editTask v-if="dialogTab=='editTask'" ref="editTaskWin"></editTask>
        <div slot="footer" class="dialog-footer" >
            <el-button @click.native="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="dialogSave()" >保 存</el-button>
        </div>
    </el-dialog>
    <el-dialog width="490px" style="height:650px;" title="筛选人员" :visible.sync="filterUserDialogVisible"  :destroy-on-close="false" ref="userFilterDialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
      <el-cascader v-if="filterUserDialogVisible" v-model="selectedUserFilterOptions" :options="totalTeamUserFilterOptions" :props="userFilterProps" clearable style="width:450px;"></el-cascader>
      <div slot="footer" class="dialog-footer" >
            <el-button @click.native="cancelUserFilter">取 消</el-button>
            <el-button type="primary" @click.native="doUserFilter()" >确 定</el-button>
        </div>
    </el-dialog>
  </div>
  
</template>
<script>
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import {openLoading,closeLoading} from "@/modules/bmsBa/service/service.js";
import { formatDateToMinute,searchTaskList,getTaskStatusDesc,taskStatusVForLeader,getTaskDetail,deleteTaskAjax,getIterationProjectList,dealException,initOpRoleList,searchTaskListXlsExpAjax,getTeamName} from "@/modules/bmsMmm/service/service.js";
import { getProjectList } from "@/modules/bmsProject/service/service.js";
import { mapMutations } from "vuex";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
import addTask from "@/modules/bmsMmm/component/addTask.vue";
import editTask from "@/modules/bmsMmm/component/editTask.vue";
import tagSelect from '@/components/orgPick/tagSelect.vue';
import {getCurrDateSecond} from "@/modules/bmsMmm/util/utility.js";
import {EcoFile} from '@/components/file/main.js';
export default {
  name: "taskList",
  components: {
    ecoContent,
    ecoToolTitle,
    taskInfo,
    addTask,
    editTask,
    tagSelect
  },
  data() {
    return {
      isProjectExclusive : false,//如果是从项目过来的查看，则为独占模式
      isPersonalExclusive : false,//如果是看本人日历
      myName:'',//如果是本人查看模式，显示本人姓名
      projectName:'',//项目独占模式时，存放项目名称
      proSearchPlaceHolder:'不限项目',
      iterationProjectList:[],
      proOptions:[],
      teamUserGroupCode:'',
      userGroupList:[], //用户组团队列表
      userList:[],         //筛选后的团队成员列表
      productId:'',
      //selRoleUser:'{"orgId":"1292475767886655491.1292475805387927553","type":"PERSONNEL","linkId":"1292475805387927553"}_{"orgId":"1292475767886655491.1292475805979324417","type":"PERSONNEL","linkId":"1292475805979324417"}',
      selRoleUser:'',
      productList:[],
      productDataMount:false,   
      loading:true, 
      loadingTimer:null,
      detDialogTitle:'',
      detDialogVisible:false,
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      focusTaskId:'',
      paginationInfo: {
        projectId:'',
        proType:'0',
        title:'',
        userIdStr:'',
        priorityList:["1","2","3"],
        statusList:[],
        fromToExpectFinishDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        fromToCreateDateArray:[],//存放日期区间选择组件的值，数组等式存放viewDateFrom和viewDateTo
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      taskListArray:[],
      tableColEl: new TableColEl()
        .add("任务名称","title",'650','','left',true,true)  
        .add("经办人","dealerName",'80',"",false,false,false)
        .add("优先级","priority",'65',"",false,false,false)
        .add("状态","status",'110',"",false,false,false)
        .add("要求完成时间","expectFinishDate",'108',"",false,false,false)
        .add("实际完成时间","actualFinishDate",'108',"",false,false,false)
        .add("预估工时","estimateManHour",'80',"",false,false,false)
        .add("实际工时","actualManHour",'80',"",false,false,false)
        .add("绩效工时","performManHour",'80',"",false,false,false)
        .add("关联项目","projectDesc",'250',"",false,false,false)
        .add("关联日程","calendarCount",'80',"",false,false,false)
        .add("对接人","followuperName",'80',"",false,false,false)
        .add("录入人员","createUserName","80",'',false,false,false)
        .add("录入时间","createDate","143",'',false,false,true)
        .add("操作","op","100",'',false,false,false),
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
      projectPaginationInfo: {
        projectName : "",
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      totalTeamUserFilterOptions:[],    //整个团队成员的选择框选项，不参与筛选
      selectedUserFilterOptions:[],     //与筛选框绑定的opt选项
      userFilterProps: { multiple: true },
      filterUserDialogVisible:false,
      sourcePageViewFlag:'forProject',  //从某个看板切过来的
      opRoleList:null,
      taskStatusVForLeader
    };
  },
  created(){
    this.initData();
  },
  mounted() {
  },
  methods: {
    async initData(){
      this.initOpRoleList();
      console.log("projectIdProp:" + this.$route.params.projectIdProp);
      if(typeof this.$route.params.projectIdProp!="undefined"&&this.$route.params.projectIdProp!=null){
        this.paginationInfo.projectId = this.$route.params.projectIdProp;
      }
      console.log("projectNameProp:" + this.$route.params.projectNameProp);
      if(typeof this.$route.params.projectNameProp!="undefined"&&this.$route.params.projectNameProp!=null){
        this.projectName = this.$route.params.projectNameProp;
      }
      console.log("this.$route.params.proTypeProp:" + this.$route.params.proTypeProp);
      if(typeof this.$route.params.proTypeProp!="undefined"&&this.$route.params.proTypeProp!=null){
        this.paginationInfo.proType = this.$route.params.proTypeProp;
      }
      if(typeof this.$route.params.pageViewFlagProp!="undefined"){
        this.sourcePageViewFlag = this.$route.params.pageViewFlagProp;
      }
      console.log("this.$route.params.isProjectExclusiveProp:" + this.$route.params.isProjectExclusiveProp);
      if(typeof this.$route.params.isProjectExclusiveProp!="undefined" && this.$route.params.isProjectExclusiveProp!=null){
        this.isProjectExclusive = this.$route.params.isProjectExclusiveProp;
      }
      console.log("this.sourcePageViewFlag:" + this.sourcePageViewFlag);
      await axios.get(baseUrl+'/bms/public/userGroupListForKanban',{
          params:{
            time:new Date().getTime()
          }
      }).then(response => {
        this.userGroupList = response.data;
      }).catch(error => {
        dealException(error);
      });
      if(
        (typeof this.$route.params.isPersonalExclusiveProp!="undefined" && this.$route.params.isPersonalExclusiveProp!=null && this.$route.params.isPersonalExclusiveProp)||  //传进来就是个本人查看日程的模式
        (!this.isProjectExclusive && !this.opRoleList['mmmForCalendar'].flag)  //非项目独占查看模式，且没有“伙伴任务日程看板”的权限，则认为强制为本人查看模式
        ){
        this.isPersonalExclusive = true;
        this.sourcePageViewFlag = 'forCalendar';
        this.teamUserGroupCode = '';
        await axios.get(baseUrl+'/bms/public/myUserInfo',{
          params:{
            time:new Date().getTime()
          }
        }).then(response => {
          let userData = response.data;
          this.myName = userData.mi;
          this.selRoleUser = '{"orgId":"'+userData.departments[0].id+'.'+userData.id+'","type":"PERSONNEL","linkId":"'+userData.id+'"}';
          //console.log("this.selRoleUser:" + this.selRoleUser);
        }).catch(error => {
            dealException(error);
        });
        //{"orgId":"1292475767886655491.1292475805387927553","type":"PERSONNEL","linkId":"1292475805387927553"}
      }else if(typeof this.$route.params.teamUserGroupCodeProp!="undefined"){
        this.teamUserGroupCode = this.$route.params.teamUserGroupCodeProp;
        await this.changeTeamTask();
      }else if(sessionStorage.getItem('teamUserGroupCodeForKanban')!=null && sessionStorage.getItem('teamUserGroupCodeForKanban')!=''){
        this.teamUserGroupCode = sessionStorage.getItem('teamUserGroupCodeForKanban');
        await this.changeTeamTask();
      }
      
      await this.getIterationProjectListFunc();
      if(this.paginationInfo.proType == '1' && this.paginationInfo.projectId !='' && this.projectName != ''){
        this.proOptions = [];
        this.proOptions.push({"id":this.paginationInfo.projectId , "name":this.projectName});
      }
      this.getTaskListFunc();
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
    async getIterationProjectListFunc(nameQuery) {
      await getIterationProjectList(nameQuery).then(response => {
        this.iterationProjectList = response.data.rows;
        this.proOptions = this.iterationProjectList;
      })
      .catch(error => {
          dealException(error);
      });
    },
    async changeTeamTask(){
      this.userList = [];
      sessionStorage.setItem('teamUserGroupCodeForKanban',this.teamUserGroupCode);
      if(this.teamUserGroupCode!=''){
        await this.getUserListByOrg();
      }else{
        this.getTaskListFuncWithPageReset();
      }
    },
    async getUserListByOrg(){
      this.openLoading();
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
          let teamName = getTeamName(this.teamUserGroupCode,this.userGroupList);
          this.totalTeamUserFilterOptions.push({ "value": this.teamUserGroupCode, "label": teamName , children: optionChilren });
        }
        //console.log("####dataList.length:"+dataList.length);
        this.user_size = this.userList.length;
        this.getTaskListFuncWithPageReset();
      }).catch(error => {
          dealException(error);
      });
      this.closeLoading(); 
    },
    selectRoleUser(data){
      console.log("data:" + data);
      //console.log("aaaa"+data.orgId);
      //aaaa1292475767718883331.1292475792939233282,1292475767718883331.1292475793580961793,1292475767966347266.1292475809762586626 赖明桃、周彩霞、王珂伟
      this.selRoleUser = data.id.split("|").join('_');
      console.log("this.selRoleUser:" + this.selRoleUser);
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
    changeProType(){
      if(this.paginationInfo.proType == '2'){
        this.proSearchPlaceHolder = "请输入关键词搜索内部迭代项目";
        this.proOptions = this.iterationProjectList;
        this.paginationInfo.projectId = '';
      }else if(this.paginationInfo.proType == '1'){  
        this.proSearchPlaceHolder = "请输入关键词搜索实际项目";
        this.proOptions = [];
        this.paginationInfo.projectId = '';
      }else{  
        this.proSearchPlaceHolder = "不限项目";
        this.proOptions = [];
        this.paginationInfo.projectId = '';
      }
    },
    searchProject(nameQuery){
      //console.log("nameQuery:" + nameQuery+"##this.paginationInfo.proType:"+this.paginationInfo.proType);
      if(this.paginationInfo.proType == '2'){
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
    toAddTask(){
      this.dialogTitle="添加任务";
      this.dialogTab = 'addTask';
      this.dialogVisible = true;
    },
    jumpToTaskKanbanView(checkProjectId , checkProjectType , checkIsProjectExclusive , checkTeamUserGroupCode , checkProjectName ){
      //console.log(this.sourcePageViewFlag);
      if(this.sourcePageViewFlag == "forProject"){
        let routerName = "mmmForProject";
        if(checkIsProjectExclusive){         //如果是项目查看独占模式，那么是个弹出窗口，走定制路由
          routerName = "mmmForProjectInDialog";
        } 
        this.$router.push({ 
          name: routerName, 
          params: { 
            projectIdProp: checkProjectId ,
            proTypeProp: checkProjectType ,
            isProjectExclusiveProp:  checkIsProjectExclusive, 
            teamUserGroupCodeProp: checkTeamUserGroupCode ,
            projectNameProp: checkProjectName
          }
        });
      }else if(this.sourcePageViewFlag == "forCalendar"){
        if(this.isPersonalExclusive){
          this.$router.push({ 
            path:'/mmmCalendar/forPersonal',
          });
        }else{
          this.$router.push({ 
            name: 'mmmCalendar', 
            params: {
              teamUserGroupCodeProp: checkTeamUserGroupCode ,
            }
          });
        }
      }else if(this.sourcePageViewFlag == "forTeam"){
        this.$router.push({ 
          name: 'mmmForTeam', 
          params: { 
            teamUserGroupCodeProp: checkTeamUserGroupCode 
          }
        });
      }
    },
    callBackForDialogEdit(checkTaskId){
      this.refreshSingleRowInTable(checkTaskId);
    },
    deleteTask(taskId){
      this.$confirm('确定要删除此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTaskAjax(taskId).then((res)=>{
          //console.log("submit  done!!");
          this.$message({type: 'success',message: '删除成功！'});
          this.getTaskListFunc();
        }).catch((error)=>{
          this.$parent.$parent.closeLoading();
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
      }).catch((error) => {console.log("error:"+error);});
    },
    editTask(taskId){
      this.focusTaskId = taskId;
      this.dialogTitle="编辑任务";
      this.dialogTab = 'editTask';
      this.dialogVisible = true;
    },
    callBackForDialogAdd(){
      this.clearSearchParam();
      this.getTaskListFuncWithPageReset();
    },
    dialogSave(){
        if(this.dialogTab == 'addTask'){
            this.$refs.addTaskWin.save();
        }else if(this.dialogTab == 'editTask'){
            this.$refs.editTaskWin.save();    
        }
    },
    cleanDialog(){
      //console.log("#####cleanDialog:");
      if(typeof this.$refs.addTaskWin!="undefined"){
        this.$refs.addTaskWin.cleanInfo();
      }else if(typeof this.$refs.editTaskWin!="undefined"){
        this.$refs.editTaskWin.initData();
      }
    },
    showDetWin(taskId){
        this.focusTaskId=taskId;
        this.detDialogTitle="任务详情";
        this.detDialogVisible = true;
    },
    clearSearchParam(){
      if(!this.isProjectExclusive){  //如果是项目查看独占模式，则不清
        this.paginationInfo.proType = '0';
        this.changeProType();
      }
      this.teamUserGroupCode = '';
      this.userList = [];
      if(!this.isPersonalExclusive){ //如果是个人查看模式，则不清
        this.selRoleUser = "";
      }
      this.paginationInfo.title = '';
      this.paginationInfo.priorityList=["1","2","3"];
      this.paginationInfo.statusList=[];
      this.paginationInfo.fromToExpectFinishDateArray=[];
      this.paginationInfo.fromToCreateDateArray=[];
      this.paginationInfo.sort = "orderSeq";
      this.paginationInfo.order = "desc";
    },
    changeSort(val){
      //console.log("##changeSort##:"+val.prop+"##"+val.order);
      if(val.order == null){
          this.paginationInfo.sort = "orderSeq";
          this.paginationInfo.order = "desc";
          val.prop = "createDate";
          val.order = "descending";
      }else{
        this.paginationInfo.sort = val.prop+",orderSeq";
        if(val.order == "ascending") this.paginationInfo.order = "asc,desc";
        else this.paginationInfo.order = "desc,desc";
      }
      //console.log("$$$$$this.paginationInfo:" + this.paginationInfo.sort);
      this.getTaskListFunc();
    },
    getTaskListFuncWithPageReset(){
      this.paginationInfo.page = 1;
      this.getTaskListFunc();
    },
    setUserList(){
      if(this.teamUserGroupCode==''){
        this.userList = [];
        if(this.selRoleUser!=''){
          let selRoleUserList = this.selRoleUser.split("_");
          selRoleUserList.forEach((nodeItem)=>{
            try{
                let _item = JSON.parse(nodeItem);
                this.userList.push(_item.linkId);
            }catch(e){
                console.log(e);
            }
          });
        }
      }
    },
    setPaginationInfoBeforeSearch(){
      this.setUserList();
      this.paginationInfo.userIdStr = '';
      if(this.userList.length>0){
        let userV = [];
        for(let i in this.userList){
          console.log("this.userList[i]):" + this.userList[i]);
           if((typeof this.userList[i]) == 'string'){
              userV.push(this.userList[i]);
           }else{
              userV.push(this.userList[i].id);
           }
        }
        this.paginationInfo.userIdStr = userV.join(',');
      }
    },
    getTaskListFunc(nextTriggerFlag) {
      this.openLoading();
      this.setPaginationInfoBeforeSearch();
      //console.log("this.paginationInfo.userIdStr:" + this.paginationInfo.userIdStr);
      searchTaskList(this.paginationInfo).then(response => {
          this.taskListArray = response.data.rows;
          this.paginationInfo.total = response.data.total;
          this.closeLoading();
          //console.log("this.taskListArray:" + this.taskListArray.length);
          if(typeof nextTriggerFlag != "undefined"){
            if(nextTriggerFlag.indexOf("showTaskInfo_")==0){
              let opBaId = nextTriggerFlag.substring(nextTriggerFlag.indexOf("_")+1);
              this.showTaskInfo(opBaId);
            }
          }
        }).catch(error => {
          this.closeLoading();
        });
    },
    handleSizeChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.rows = val;
        this.paginationInfo.page = 1;
        this.getTaskListFunc();
    },
    handleCurrentChange(val) {
        this.$refs.content.setScollTop(0);
        this.paginationInfo.page = val;
        this.getTaskListFunc();
    },
    hideDialog(){
      this.dialogVisible = false;
    },
    showTaskInfo(task_id){
      this.dialogVisible = true;
      //console.log("333"+ this.$refs.sideRouterViewRef);
      if(typeof this.$refs.sideRouterViewRef=="undefined"){
         this.$router.push({name:'taskInfo',query:{task_id:task_id}});
      }else{
        this.$refs.sideRouterViewRef.getTaskInfo(task_id);
      } 
    },
    cleanDialogData(){
      //console.log("clean data");
      if(typeof this.$refs.sideRouterViewRef!="undefined"){
        this.$refs.sideRouterViewRef.cleanInfo();
      } 
    },
    refreshSingleRowInTable(checkTaskId){
      for (let i in this.taskListArray) {
        let e = this.taskListArray[i];
        if(e.id == checkTaskId){
          getTaskDetail(checkTaskId).then((response)=>{
            if (response.data&&response.data.id){
                e.title = response.data.title;
                e.dealerName = response.data.dealerName;
                e.priority = response.data.priority;
                e.status = response.data.status;
                e.expectFinishDate = response.data.expectFinishDate;
                e.estimateManHour = response.data.estimateManHour;
                e.actualManHour = response.data.actualManHour;
                e.performManHour = response.data.performManHour;
                e.projectDesc = response.data.projectDesc;
                e.calendarCount = response.data.calendarCount;
            }
          }).catch((error)=>{
            console.log("error:"+error);
          });
          break;
        }
      }
    },
    exportTaskListXls(){
      this.setPaginationInfoBeforeSearch();
      searchTaskListXlsExpAjax(this.paginationInfo).then((response)=>{
        var blob = new Blob([response.data], { type: 'application/octet-stream' });
        EcoFile.downloadFile(blob, "任务列表"+getCurrDateSecond()+".xlsx");
      });
    },
    openLoading,closeLoading,formatDateToMinute,getTaskStatusDesc,initOpRoleList
  },
  computed:{
  },
  watch: {}
};
</script>
