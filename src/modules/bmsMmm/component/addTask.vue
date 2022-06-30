<template v-if="dataMounted">
    <div style="display:inline-block;width:100%;height:100%">
        <div style="display:inline-block;width:99%;border-right: 2px solid #ebebeb;padding-right:5px;" ref="taskDiv">
            <el-form label-width="120px" ref="taskForm" :rules="taskFormRules" :model="taskInfoObj" >
                <template v-for="(nodeEl,key) in taskFormItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%') , 'display': 'inline-block'}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.paramName=='priority'">
                              <div>
                                <el-radio v-model="taskInfoObj[key]" label="1" border class="priority1">1</el-radio>
                                <el-radio v-model="taskInfoObj[key]" label="2" border class="priority2">2</el-radio>
                                <el-radio v-model="taskInfoObj[key]" label="3" border class="priority3">3</el-radio>
                              </div>
                            </template>
                            <template v-else-if="nodeEl.paramName=='projectId'">
                              <el-select v-model="taskInfoObj['projectFlag']" placeholder="" @change="changeProType" style="width:105px;margin-right:-5px;">
                                <el-option label="" value=""></el-option>
                                <el-option label="实际项目" value="1"></el-option>
                                <el-option label="内部迭代" value="2"></el-option>
                              </el-select>
                              <el-select v-if="taskInfoObj['projectFlag']!=null&&taskInfoObj['projectFlag']!=''"
                                v-model="taskInfoObj['projectId']"
                                filterable
                                remote
                                :placeholder="proSearchPlaceHolder"
                                :remote-method="searchProject"
                                style="width:250px;"
                                >
                                <el-option
                                  v-for="item in proOptions"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                              </el-select>
                            </template>
                            <template v-else-if="nodeEl.paramName=='attachment'">
                              <el-table :data="taskFileList"  stripe style="width: 100%" v-if="taskFileList!=null && taskFileList.length > 0" header-row-class-name="hiddenRow" row-class-name="tinyRow" class="detTable">
                                <el-table-column v-for="(colEl,index) in fileTableColEl" :key="index"  :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                                  <template slot-scope="scope"  >
                                    <div v-if="colEl.paramName=='op'">
                                      <el-button type="text" @click.native="doFilePreviewAction(scope.row)" v-if="_isPreviewFile(scope.row.fileType)" class="fileBtn">预览</el-button>
                                      <span v-else style="padding-left:31px;">&nbsp;</span>
                                      <el-button type="text" @click.native="doFileDownloadAction(scope.row)" class="fileBtn">下载</el-button>
                                      <el-button type="text" @click.native="deleteFile(scope.row.id , scope.row.name)" class="fileBtn" style="color:red;">删除</el-button>
                                    </div>
                                    <div v-else>
                                      {{scope.row[colEl.paramName]}}
                                    </div>
                                  </template> 
                                </el-table-column>
                              </el-table>
                              <el-button type="primary" size="medium" icon="el-icon-paperclip" @click.native="toAddAttachment" style="margin-top:7px;">添加附件</el-button>
                            </template>
                            <template v-else-if="nodeEl.paramName=='requireId'">
                              <el-select
                                v-model="taskInfoObj[key]"
                                filterable
                                remote
                                :placeholder="'请选择'+nodeEl.desc"
                                :remote-method="searchRequire"
                                >
                                <el-option
                                  v-for="item in requireOptions"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                              </el-select>
                            </template>
                            <template v-else-if="nodeEl.paramName=='typeId'">
                              <el-select v-model="taskInfoObj[key]" :placeholder="'请选择'+nodeEl.desc" >
                                <el-option
                                  v-for="typeItem in taskTypeV"
                                  :key="typeItem.id"
                                  :label="typeItem.desc"
                                  :value="typeItem.id">
                                </el-option>
                              </el-select>
                            </template>
                            <template v-else-if="nodeEl.paramName=='status'">
                              <el-select v-model="taskInfoObj[key]" :placeholder="'请选择'+nodeEl.desc" >
                                <el-option
                                  v-for="statusItem in taskStatusV"
                                  :key="statusItem.id"
                                  :label="statusItem.desc"
                                  :value="statusItem.id">
                                </el-option>
                              </el-select>
                            </template> 
                            <template v-else-if="nodeEl.eleType=='date'">
                                <el-date-picker v-model="taskInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                            </template>
                            <!-- <template v-else-if="nodeEl.eleType=='textarea'">      
                                <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="taskInfoObj[key]" :rows="nodeEl.paramName=='desc'?'6':'3'"></el-input>
                            </template>   -->
                            
                            <template v-else-if="nodeEl.paramName=='desc'">
                                <ckeditor ref="taskDescRef" :content="taskInfoObj[key]" height="350"></ckeditor>
                            </template>
                           
                            <template v-else-if="nodeEl.eleType=='number'">
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="taskInfoObj[key]" ></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='selectSingleUser'">
                                <el-select
                                    v-model="taskInfoObj[key]"
                                    filterable
                                    clearable
                                    remote
                                    :placeholder="'请输入'+nodeEl.desc"
                                    :remote-method="getUserListByNameQueryForTaskDealer"
                                    >
                                    <el-option
                                    v-for="userItem in userSearchResultsV['taskDealer']"
                                    :key="userItem.id"
                                    :label="userItem.mi"
                                    :value="userItem.id">
                                    </el-option>
                                </el-select>
                            </template>      
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="taskInfoObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
            <div style="width:100%;text-align:right;"> 
             <el-button style="margin-right:28px;" type="warning" @click.native="triggerAddPlanArea">同时添加计划&nbsp;&nbsp;<i class="fa fa-arrow-right fa-lg"></i></el-button>
            </div> 
        </div>
        <div style="display:inline-block;width:550px;vertical-align:top;height:100%;overflow-y:auto;padding:0px 5px 0px 5px;" v-if="needAddPlanFlag">
           <el-form label-width="120px" ref="planForm" :rules="planFormRules" :model="planInfoObj" >
                <template v-for="(nodeEl,key) in planFormItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.paramName=='priority'">
                              <div>
                                <el-radio v-model="planInfoObj[key]" label="1" border class="priority1">1</el-radio>
                                <el-radio v-model="planInfoObj[key]" label="2" border class="priority2">2</el-radio>
                                <el-radio v-model="planInfoObj[key]" label="3" border class="priority3">3</el-radio>
                              </div>
                            </template>
                            <template v-else-if="nodeEl.eleType=='date'">
                                <el-date-picker v-model="planInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                            </template>
                            <template v-else-if="nodeEl.eleType=='textarea'">
                                <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="planInfoObj[key]" rows="10"></el-input>
                            </template> 
                            <template v-else-if="nodeEl.eleType=='number'">
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="planInfoObj[key]" ></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='selectSingleUser'">
                                <el-select
                                    v-model="planInfoObj[key]"
                                    filterable
                                    clearable
                                    remote
                                    :placeholder="'请输入'+nodeEl.desc"
                                    :remote-method="getUserListByNameQueryForPlanDealer"
                                    >
                                    <el-option
                                    v-for="userItem in userSearchResultsV['planDealer']"
                                    :key="userItem.id"
                                    :label="userItem.mi"
                                    :value="userItem.id">
                                    </el-option>
                                </el-select>
                            </template>      
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="planInfoObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @open="cleanDialog()" :destroy-on-close="false" ref="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" class="trivialDialog">
         
          <ecoFileUploadPopup v-if="dialogTab=='addFile'" modular="bmsTask" :modularInnerId="''+this.taskInfoObj['id']" ref="addFileWin"></ecoFileUploadPopup>
         
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
import axios from 'axios';
import {baseUrl} from '@/modules/bmsMmm/config/env';
import {doFilePreviewAction,doFileDownloadAction} from "@/modules/bmsMmm/util/utility.js";
import {getUserListByNameQuery,openLoading,closeLoading,dealException,taskStatusVForStaff,taskStatusVForLeader,initOpRoleList,addTaskAjax,addTaskCalendarPlanAjax,addActionLogForCreate,taskTypeV,getIterationProjectList,getRequireListByNameQuery,getTaskFileList,_isPreviewFile } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import ecoFileUploadPopup from '@/modules/bmsMmm/component/ecoFileUploadPopup.vue';
import { getProjectList } from "@/modules/bmsProject/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import {mapMutations} from 'vuex';
import ckeditor from "@/modules/bmsMmm/component/ckeditor.vue";
export default{
  name:'addTask',
  components:{
      ecoFileUploadPopup,
      ckeditor
  },
  props:['requireIdProp','requireDescProp','projectIdProp','projectFlagProp','projectDescProp','dealerIdProp','dealerNameProp'],
  data(){
    return {
      dataMounted :false,
      newTaskId:'',
      taskInfoObj:{},
      planInfoObj:{},
      userSearchResultsV:[],
      needAddPlanFlag : false,
      taskFormItemInfo:new FormItemEl()
        .add("标题","title",'',true,'textarea')
        .add("类型","typeId",'',false,'')
        .add("状态","status",'',false,'')
        .add("关联项目","projectId",'',false,'')
        .add("关联需求","requireId",'',false,'')
        .add("优先级","priority",'',false,'')
        .add("经办人","dealer",'',false,'selectSingleUser')
        .add("预估工时","estimateManHour",'',false,'number')
        .add("要求完成时间","expectFinishDate",'',false,'date')
        .add("附件","attachment",'',true,'')
        .add("详情描述","desc",'',true,'ckeditor'),
        //.add("详情描述","desc",'',true,'textarea'),
      taskFormRules: {
        title: [
          { required: true, message: '请填写标题' }
        ],
        typeId: [
          { required: true, message: '请选择类型' }
        ],
        status: [
          { required: true, message: '请选择状态' }
        ],
        dealer: [
          { required: true, message: '请指定经办人' }
        ],
        estimateManHour: [
          { required: true, message: '请填写预估工时' }
        ],
        expectFinishDate: [
          { required: true, message: '请设定要求完成时间' }
        ],
      },
      planFormItemInfo:new FormItemEl()
        .add("计划日期","date",'',true,'date')
        .add("计划完成度 (%)","planRate",'',true,'number')
        .add("日程优先级","priority",'',true,'')
        .add("备注","planComments",'',true,'textarea')
        .add("计划经办人","dealer",'',true,'selectSingleUser'),
      planFormRules: {
        date: [
          { required: true, message: '请设定计划日期' }
        ],
        planRate:[
          { required: true, message: '请填写计划完成度', trigger: 'blur' },
          { type: 'number', message: '计划完成度必须为0-100的数值'}
        ],
        dealer: [
          { required: true, message: '请指定经办人', trigger: 'blur' }
        ]
      },
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
      },
      taskStatusV:[],
      proSearchPlaceHolder:'',
      projectPaginationInfo: {
        projectName : "",
        sort: "order_seq_",
        order: "desc",
        page: 1,
        rows: 50,
        total: 0
      },
      iterationProjectList:[],
      proOptions:[],
      requireOptions:[],
      taskTypeV,
      dialogVisible:false,
      dialogTitle:'',
      dialogTab:'',
      taskFileList:[],
      fileTableColEl: new TableColEl()
        .add("文档名称","name",'300','',false,false,false)  
        .add("大小","size",'100',"",false,false,false)
        .add("上传人","createUserName",'80',"",false,false,false)
        .add("上传时间","createDate",'140',"",false,false,false)
        .add("操作","op",'150',"",false,false,false),
      opRoleList:null,
    }
  },
  created(){    
    //console.log("this.requireIdProp:" + this.requireIdProp);
    this.getIterationProjectListFunc();
    this.initData(); 
  },
  mounted(){
  },
  methods: { 
    async setDataByRole(){
      this.initOpRoleList();
      if(this.opRoleList['mmmForCalendar'].flag){ //有伙伴日程看板权限，认为是leader
        this.taskStatusV = taskStatusVForLeader;
      }else{
        this.taskStatusV = taskStatusVForStaff;
        this.taskInfoObj['status'] = 10;
        this.taskInfoObj = {...this.taskInfoObj};
      }
    },
    async initData(){
      await this.setDataByRole();
      await axios.get(baseUrl+'/bms/public/getId',{
        params:{
          time:new Date().getTime()
        }
      }).then(response => {
        this.newTaskId = response.data;
        //console.log("newTaskId:"+this.newTaskId);
        this.taskInfoObj['id'] = this.newTaskId;
        this.taskInfoObj = {...this.taskInfoObj};
      }).catch(error => {
          dealException(error);
      });
      //console.log("init data......");
      this.taskInfoObj['priority']='3';
      if(typeof this.requireIdProp!="undefined"){
        //console.log("this.requireDescProp:"+this.requireDescProp);
        this.taskInfoObj['requireId'] = this.requireIdProp;
        this.requireOptions = [];
        let node = {"id":this.requireIdProp , "name":this.requireDescProp};
        this.requireOptions.push(node);
        this.requireOptions = {...this.requireOptions};
      }
      //console.log("11111111111"+this.projectIdProp+"###"+this.projectDescProp+"##"+this.projectFlagProp);
      if(
        typeof this.projectIdProp!="undefined" && this.projectIdProp!=null && this.projectIdProp!='' &&
        typeof this.projectDescProp!="undefined" && this.projectDescProp!=null && this.projectDescProp!='' &&
        typeof this.projectFlagProp!="undefined" && this.projectFlagProp!=null && this.projectFlagProp!='' && this.projectFlagProp!='0'
      ){
        //console.log("22222222");
        this.taskInfoObj['projectFlag'] = this.projectFlagProp;
        this.taskInfoObj['projectId'] = this.projectIdProp;
        //console.log("this.projectFlagProp:"+this.projectFlagProp);
        if(this.projectFlagProp=='1'){
          this.proOptions = [];
          let node = {"id":this.projectIdProp , "name":this.projectDescProp};
          this.proOptions.push(node);
          this.proOptions = {...this.proOptions};
        }
      }
      if(!this.opRoleList['mmmForCalendar'].flag&&typeof this.dealerIdProp!="undefined"&&this.dealerIdProp!=''){
        this.taskInfoObj['dealer'] = this.dealerIdProp;
         this.userSearchResultsV['taskDealer'] = [ { "id": this.dealerIdProp, "mi": this.dealerNameProp }];
         this.userSearchResultsV = {...this.userSearchResultsV};
      }
      //console.log("dealerIdProp:" + this.dealerIdProp);
      this.taskInfoObj = {...this.taskInfoObj};
      this.planInfoObj['priority']='3';
      this.planInfoObj = {...this.planInfoObj};
      this.dataMounted = true;
    },
    getUserListByNameQueryForTaskDealer(nameQuery){
      this.getUserListByNameQuery(nameQuery,'taskDealer');
    },
    getUserListByNameQueryForPlanDealer(nameQuery){
      this.getUserListByNameQuery(nameQuery,'planDealer');
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      if(this.requireId!=null){
        obj.requireId = this.requireId;
      }
      if(this.projectId!=null){
        obj.projectId = this.projectId;
      }
      obj.preSysFlag = 'self';
      obj.time = new Date().getTime();
      obj.desc = this.$refs.taskDescRef[0].getCkeditorData();
      //console.log("obj.id:"+obj.id);
      //console.log("obj:"+obj);
      return obj;
    },
    save(){
      let formValid = false;
      this.$refs['taskForm'].validate((taskFormValid) => {
          if (taskFormValid) {
            if(this.needAddPlanFlag){
              this.$refs['planForm'].validate((planFormValid) => {
                if(planFormValid){
                  formValid = true;
                }
              });
            }else{
              formValid = true;
            }
          }
      });
      //console.log("formValid:" + formValid);
      if(formValid){
        addTaskAjax(this.setSaveData(this.taskInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                let newTaskId = res.data.id;
                console.log("new taskId:"+res.data.id);
                let parentObjId = "";
                parentObjId = this.requireId==null?"":this.requireId;
                if(parentObjId == ""){
                  parentObjId = this.projectId==null?"":this.projectId;
                }
                addActionLogForCreate(this.taskFormItemInfo , this.taskInfoObj , 'task',res.data.id , parentObjId,'create');
                this.$message({type: 'success',message: '任务添加成功！'});
                if(this.needAddPlanFlag){
                  this.planInfoObj.taskId = res.data.id;
                  addTaskCalendarPlanAjax(this.setSaveData(this.planInfoObj)).then((res)=>{
                    console.log("submit  done!!res.data:"+res.data);
                    if (res.data&&res.data.id){
                      console.log("new taskCalendarId:"+res.data.id);
                      addActionLogForCreate(this.planFormItemInfo , this.planInfoObj , 'taskCalendar' , res.data.id,newTaskId,'create');
                      this.$message({type: 'success',message: '计划添加成功！'});
                      try{
                        this.$parent.$parent.$parent.initTeamTask();
                        this.$parent.$parent.$parent.dialogVisible = false;
                      }catch(e){ //产品需求看板，走下面的刷新逻辑
                        try{
                          this.$parent.$parent.$parent.$parent.$parent.getRequireListFunc();
                          this.$parent.$parent.$parent.$parent.$parent.dialogVisible = false;
                        }catch(e){  //项目任务看板，走下面的刷新逻辑
                          try{
                            this.$parent.$parent.$parent.getTaskListFunc();
                            this.$parent.$parent.$parent.dialogVisible = false;
                          }catch(e){
                            this.$parent.$parent.callBackForDialogAdd();
                            this.$parent.$parent.dialogVisible = false;
                          }
                        }
                      }
                    }else{
                      this.$message({type: 'error',message: '计划添加失败！'});
                    }
                  }).catch((error)=>{
                    dealException(error);
                    this.$message({type: 'error',message: '计划添加失败！'});
                  })
                }else{
                  try{
                    this.$parent.$parent.$parent.initTeamTask();
                    this.$parent.$parent.$parent.dialogVisible = false;
                  }catch(e){ //产品需求看板，走下面的刷新逻辑
                    try{
                      this.$parent.$parent.$parent.$parent.$parent.getRequireListFunc();
                      this.$parent.$parent.$parent.$parent.$parent.dialogVisible = false;
                    }catch(e){  //项目任务看板，走下面的刷新逻辑
                      try{
                        this.$parent.$parent.$parent.getTaskListFunc();
                        this.$parent.$parent.$parent.dialogVisible = false;
                      }catch(e){
                        this.$parent.$parent.callBackForDialogAdd();
                        this.$parent.$parent.dialogVisible = false;
                      }
                    }
                  }
                }
              }else{
                this.$message({type: 'error',message: '任务添加失败！'});
              }
        }).catch((error)=>{
              dealException(error);
              this.$message({type: 'error',message: '任务添加失败！'});
        });
      }
    },
    cleanInfo(){
       this.planInfoObj={};
       this.taskInfoObj={};
       this.initData(); 
    },
    triggerAddPlanArea(){
      this.$refs.taskDiv.style.width = "calc(100% - 580px)";
      this.needAddPlanFlag = true;
      if(typeof this.taskInfoObj['dealer']!="undefined"){
        let checkId = this.taskInfoObj['dealer'];
        let selectedObj = this.userSearchResultsV['taskDealer'].find((item)=>{
          return item.id === checkId;
        });
        if(typeof selectedObj!="undefined"){
          this.userSearchResultsV['planDealer'] = [ { "id": checkId, "mi": selectedObj.mi }];
          this.userSearchResultsV = {...this.userSearchResultsV};
          this.planInfoObj.dealer = checkId;
          this.planInfoObj = {...this.planInfoObj};
        }
      }

    },
    changeProType(){
      if(this.taskInfoObj['projectFlag'] == '2'){
        this.proSearchPlaceHolder = "请输入关键词搜索内部迭代项目";
        this.proOptions = this.iterationProjectList;
      }else{
        this.proSearchPlaceHolder = "请输入关键词搜索实际项目";
        this.proOptions = [];
      }
      this.taskInfoObj['projectId'] = '';
      this.taskInfoObj = {...this.taskInfoObj};
    },
    searchProject(nameQuery){
      //console.log("nameQuery:" + nameQuery+"##this.proType:"+this.proType);
      if(this.taskInfoObj['projectFlag'] == '2'){
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
    getIterationProjectListFunc(nameQuery) {
      getIterationProjectList(nameQuery).then(response => {
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
    searchRequire(nameQuery){
      getRequireListByNameQuery(nameQuery).then(response => {
        let dataList = response.data.rows;
        this.requireOptions = [];
        //console.log("dataList:"+dataList);
        for (let i in dataList) {
          let node = {"id":dataList[i].id , "name":"#"+dataList[i].id+" : "+dataList[i].title+" ( 优先级："+dataList[i].priority+" )"};
          this.requireOptions.push(node);
        }
      }).catch(error => {
        dealException(error);
      });
    },
    toAddAttachment(){
      this.dialogTitle="添加附件";
      this.dialogTab = 'addFile';
      this.dialogVisible = true;
    },
    cleanDialog(){

    },
    getTaskFileListFunc(){
      this.openLoading();
      getTaskFileList(this.newTaskId ).then(response => {
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
            this.closeLoading();
        }).catch(error => {
          console.log("error:"+error);
          this.closeLoading();
        });
    },
    deleteFile(fileId,fileName){
        deleteFileDataServer(fileId).then(response => {
          this.$message({type: 'success',message: '删除成功！'});
          this.getTaskFileListFunc();      
        }).catch(error => {
          console.log("error:"+error);
          this.$message({type: 'error',message: '删除失败！'});
        });
    },
    getUserListByNameQuery,
    openLoading,
    closeLoading,
    doFilePreviewAction,
    doFileDownloadAction,
    _isPreviewFile,
    initOpRoleList
  },
  watch: {

  }
}
</script>
<style scoped>
.el-select{
  width: 100%;
}
</style>
