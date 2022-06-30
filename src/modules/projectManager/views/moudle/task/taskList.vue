<template>
    <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5">
        <div class="taskList">
            <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
            <eco-content top="0px" height="60px" type="tool" style="overflow:hidden;">
                     <el-row style="height:100%;padding-left:10px;line-height:60px;background-color:#fff;border-bottom:1px solid #ddd;">
                        <el-col :span="10">
                            <eco-tool-title style="line-height: 34px;margin-right:50px;" :title="'任务列表（'+total+'）'"></eco-tool-title>

                            <!-- <el-button plain class="plainBtn toolBtn" @click.native="addProject"><i class="icon el-icon-document-add"></i>&nbsp;添加项目</el-button>
                            <el-button plain @click.native="showExportProjectDialog" class="plainBtn toolBtn"><i class="icon el-icon-upload2"></i>&nbsp;导 入</el-button>

                            <el-button plain @click.native="exportProject" class="plainBtn toolBtn"><i class="icon el-icon-download"></i>&nbsp;导 出</el-button> -->
                            <el-button plain class="plainBtn toolBtn" @click.native="searchShow = !searchShow"><i class="icon el-icon-search"></i>&nbsp;高级搜索</el-button>
                        </el-col>
                        <el-col :span="7" style="text-align:center;">
                            <el-tabs class="listTab" v-model="activeName" @tab-click="handleTabClick">
                                <el-tab-pane label="任务类" name="task"></el-tab-pane>
                                <el-tab-pane label="问题风险类" name="notice" lazy></el-tab-pane>
                                <el-tab-pane label="流程类" name="flowform" lazy></el-tab-pane>
                                <el-tab-pane label="公告类" name="annocement" lazy></el-tab-pane>
                            </el-tabs>
                        </el-col>
                        <el-col :span="7" v-show="activeName == 'notice' || activeName == 'annocement'">
                            <el-radio-group v-model="params.click" @change="searchListFunc" style="float:right;line-height: 60px;margin-right:15px;">
                                <el-radio-button label="-1">全部</el-radio-button>
                                <el-radio-button label="false">未读</el-radio-button>
                                <el-radio-button label="true">已读</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
            </eco-content>
            <eco-content top="61px" v-show="searchShow" style="overflow:hidden">
                <div class="searchBox" v-show="activeName == 'task'">
                    <div>

                        <span>名称：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入名称" @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                        </div>
                        <span>开始时间：</span>
                        <div class="itemInput">
                            <el-date-picker
                                v-model="s_dates"
                                type="daterange"
                                @change="datesChange"
                                range-separator="至"
                                unlink-panels
                                style="width:250px;"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                align="right">
                            </el-date-picker>
                        </div>

                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                    </div>
                    <div>
                        <span>状态：</span>
                        <div class="state" style="width:200px">
                            <el-select v-model="params.status" clearable style="width:100%">
                                <el-option
                                    v-for="(item,index) in baseData['faw_pm_work_status']" :key="index"
                                    :label="item.text"
                                    :value="item.id"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                        <span  style="width:70px;text-align:left;display:inline-block;">责任人：</span>
                        <div class="itemInput" style="width:250px">
                            <el-input placeholder="请输入责任人名称" @keyup.enter.native="searchListFunc" v-model="params.liableUserName"></el-input>
                        </div>

                    </div>
                </div>
                <div class="searchBox" v-show="activeName == 'notice' || activeName == 'annocement'">
                    <span>名称：</span>
                    <div class="itemInput">
                        <el-input placeholder="请输入名称" @keyup.enter.native="searchListFunc" v-model="params.name"></el-input>
                    </div>
                    <span>类别：</span>
                    <div class="state" style="width:200px">
                        <el-select v-model="params.type" clearable style="width:100%">
                            <el-option
                                v-for="(item,index) in baseData['faw_pm_notice_type']" :key="index"
                                :label="item.text"
                                :value="item.id"
                                >
                            </el-option>
                        </el-select>
                    </div>
                    <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                    <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                </div>
                <div class="searchBox" v-if="activeName == 'flowform'">
                    <div>
                        <span>类别：</span>
                        <div class="state">
                            <el-cascader
                                v-model="params.groupTemp"
                                :options="groupsArray"
                                ref="groupCascader"
                                @change="handleGroupChange"
                                :props="{ disabled:'disabled1', label:'name',leaf:'1',value:'id',children:'child'}"
                            >
                                <template slot-scope="{ node, data }">
                                    <span v-if="data.name">{{ data.name }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.child.length }}) </span>
                                </template>
                            </el-cascader>
                        </div>
                        <span style="width:70px;text-align:left;display:inline-block;">名称：</span>
                        <div class="itemInput">
                            <el-input placeholder="请输入流程名称" @keyup.enter.native="searchListFunc" v-model="params.searchMsg"></el-input>
                        </div>
                        <span>到达时间：</span>
                        <div style="display:inline-block;">
                            <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="params.assign_start_time" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                            -
                            <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="params.assign_end_time"  value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                        </div>
                        <el-button plain class="plainBtn" style="margin-left:5px;" @click="resetSearch">清空</el-button>
                        <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

                    </div>
                    <div>
                        <span>模板：</span>
                        <div class="state">
                                <el-select v-model="params.templateId"  filterable placeholder="请选择模板">
                                    <el-option
                                    v-for="item in templdateArray"
                                    :key="item.wfTempId"
                                    :label="item.name"
                                    :value="item.wfTempId">
                                    </el-option>
                                </el-select>
                        </div>
                        <span>启动人员：</span>
                        <div class="itemInput">
                            <tag-select
                                    style="width: 100%;vertical-align: top;"
                                    :initDataStr="initUserStr"
                                    ref="tagSelect"
                                    :initOptions="{selectNum:0,selectType:'User'}"
                                    @callBack="tagSelectCB" >
                            </tag-select>
                        </div>
                        <span>启动时间：</span>
                        <div style="display:inline-block;">
                            <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="params.init_start_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                            -
                            <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="params.init_end_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                        </div>

                    </div>
                </div>
            </eco-content>
            <eco-content bottom="42px" :top="getContentTop" ref="content" style="padding:10px 15px;">
                <el-table
                    :data="taskList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    size="mini"
                    border
                    @header-dragend="changeColWidth"
                    ref="multipleTable"
                    class="ecoList"
                    height="100%"
                    min-width="100%"
                    v-show="!loading"
                    @row-dblclick="goDetail"
                    stripe
                    :row-class-name="rowClassName"
                >

                        <el-table-column  min-width="50" width="50" :key="1" v-if="activeName == 'task'">
                            <template slot-scope="scope">
                                <div class="color-tag height-red" v-if="scope.row.color=='red'"></div>
                                <div class="color-tag medium-yellow" v-if="scope.row.color=='yellow'"></div>
                                <div class="color-tag low-green" v-if="scope.row.color=='green'" ></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="index"
                            label="序号"
                            width='60'
                            :key="2"

                            min-width="60"
                            >
                            <template slot-scope="scope">

                                {{scope.$index+(params.page-1)*params.rows+1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            label="类别"
                            width="120"
                            v-if="activeName == 'notice' || activeName == 'annocement'"
                            :key="8"
                            min-width="120"
                        >
                            <template slot-scope="scope">
                                {{getBaseDataTextByKey(scope.row.type,"faw_pm_notice_type")}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="groupName"
                            label="类别"
                            width='160'
                            key="10"
                            v-if="activeName == 'flowform'"
                            min-width="160"
                            >
                            <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"")}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="任务名称"
                            min-width="100"
                            :key="3"
                            v-if="activeName == 'task' || activeName == 'notice' || activeName == 'annocement'"
                            >
                            <template slot-scope="scope">

                                <span @click="goDetail(scope.row)" class="pointerClass">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="request_desc"
                            label="任务名称"
                            min-width="120"
                            :key="11"
                            v-if="activeName == 'flowform'"
                            >
                            <template slot-scope="scope">
                                <span class="pointerClass" style="display:block;" @click="goDetail(scope.row)">{{ scope.row.requestDesc }} | <i v-if="scope.row.taskName" class="taskName">{{scope.row.taskName}}</i></span>
                            </template>
                        </el-table-column>
                         <el-table-column
                            prop="infoName"
                            label="项目名称"
                            min-width="120"
                            width="300"
                            :key="16"
                            v-if="activeName == 'task' && !params.infoId"
                            >

                        </el-table-column>
                        <el-table-column
                            prop="status_id"
                            label="任务状态"
                            width='100'
                            key="12"
                            v-if="activeName == 'flowform'"
                            min-width="100">
                            <template slot-scope="scope"><span class="circle" v-bind:class="scope.row.statusName == '待办'?'red':'blue'"></span> {{ scope.row.statusName }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="任务状态"
                            width='120'
                            :key="4"
                            min-width="100"
                            v-if="activeName == 'task'"
                            >
                            <template slot-scope="scope">
                                {{getBaseDataTextByKey(scope.row.status,"faw_pm_work_status")}}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            prop="pdtManagerName"
                            label="所属项目"
                            width='120'
                            min-width="100"
                            >
                        </el-table-column> -->
                        <el-table-column
                            prop="startDate"
                            label="开始时间"
                            width='120'
                            v-if="activeName == 'task'"
                            key="5"
                            min-width="100"
                            >
                            <template slot-scope="scope">{{scope.row.planStartDate?scope.row.planStartDate.substring(0,10):''}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="planEndDate"
                            label="计划完成时间"
                            width='120'
                            key="6"
                            v-if="activeName == 'task'"
                            min-width="100"
                            >
                            <template slot-scope="scope">{{scope.row.planEndDate?scope.row.planEndDate.substring(0,10):''}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="actualEndDate"
                            label="实际完成时间"
                            width='120'
                            key="7"
                            v-if="activeName == 'task'"
                            min-width="100"
                            >
                            <template slot-scope="scope">{{scope.row.actualEndDate?scope.row.actualEndDate.substring(0,10):''}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="formUsername"
                            label="来自"
                            width='100'
                            :key="13"
                            min-width="100"
                            v-if="activeName == 'flowform'">
                            <template slot-scope="scope">{{scope.row.formUsername}}</template>
                        </el-table-column>

                        <el-table-column
                            prop="assign_date"
                            label="到达时间"
                            width='180'
                            :key="14"

                            min-width="160"
                            v-if="activeName == 'flowform'">
                            <template slot-scope="scope">{{scope.row.assignDate?scope.row.assignDate.substring(0,16):''}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="createDate"
                            label="到达时间"
                            width='120'

                            key="9"
                            v-if="activeName == 'notice' || activeName == 'annocement'"
                            min-width="100"
                            >
                            <template slot-scope="scope">{{scope.row.createDate?scope.row.createDate.substring(0,10):''}}</template>
                        </el-table-column>
                        <el-table-column
                            prop="initUserName"
                            label="启动人员"
                            width='100'
                            :key="15"
                            min-width="160"
                            v-if="activeName == 'flowform'">
                        </el-table-column>
                        <el-table-column
                            prop="init_date"
                            label="启动时间"
                            width='180'

                            :key="17"
                            min-width="160"
                            v-if="activeName == 'flowform'">
                            <template slot-scope="scope">{{ scope.row.initDate?scope.row.initDate.substring(0,16):''}}</template>
                        </el-table-column>
                </el-table>

            </eco-content>
             <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
                <el-row >
                    <el-col :span="24" style="text-align:right">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="params.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="params.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total" style="margin-right:20px">
                            </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>
        </div>
    </eco-content>

</template>

<script>
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import { mapActions,mapGetters } from 'vuex'
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import { getWFGroupsAjax , getWFTemplatesAjax,getWFOperateId,getTaskWFModuleAjax,getWfTaskListByProject} from '../../../api/common.js'
  import {getTaskList,getTaskDoInfo,getTaskNoticeList,readNoticeInfo} from '../../../api/task.js'
  export default{
      name:'taskList',
      components: {
        ecoContent,
        ecoLoading,
        ecoToolTitle,
        tagSelect
      },
      data(){
        return {
          params:{
            infoId:"",
            status:"",
            name:"",
            currentUserId:"",
            liableUserId:"",
            liableUserName:"",
            planStartDate:"",
            planEndDate:"",
            page:1,
            rows:10,
            order:"desc",
            sort:"createDate",
          },
          pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近半个月',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        let end = new Date();
                        end = new Date(end.getFullYear(),end.getMonth(),end.getDate());
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
          s_dates:[],
          taskList:[],
          total:0,
          searchShow:false,
          activeName:"task",
          loading:false,
          groupsArray: [],
          templdateArray:[],
          initUserStr:""
        }
      },
      computed:{
         ...mapGetters([
            'baseData',
            'milesType',
            'userInfo',
            'getBaseDataTextByKey'
        ]),
        getContentTop:function(){
           if(this.searchShow){
               if(this.activeName == 'notice' || this.activeName == 'annocement'){
                   return '113px';
               }
               return '162px';
           }else{
               return '61px';
           }
        },
      },
      created(){
        this.setMilesType();
        this.callAction();
        this.initSomeBaseData({array:['faw_pm_work_status','faw_pm_notice_type']});

      },
      mounted(){
        if(this.$route.params.infoId && this.$route.params.infoId >0){
           this.params.infoId = this.$route.params.infoId;
        }
        this.params.currentUserId = this.userInfo.id;
        this.getDataList();
        this.getWFGroupsFunc();
        this.getWFTemplatesFunc();
      },
      activated() {
        this.getDataList();
        this.getWFGroupsFunc();
        this.getWFTemplatesFunc();
      },
      methods: {
        ...mapActions([
          'setMilesType',
          'initSomeBaseData',
        ]),
        callAction(){
            let this_ = this;
            window.tabClickFunc = function(){
                this_.getDataList();
            }
        },
        getTaskListDataFunc(){
            let params = JSON.parse(JSON.stringify(this.params));
            getTaskList(params).then(res => {
                this.$refs.ecoLoadingRef.close();
                this.total = res.total;
                this.taskList = res.rows;
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    //this.$refs.multipleTable.doLayout();
                    this.loading = false;
                });
            })
        },
        fillWFGroupsChildren(list){
             try{
                   for(let i = 0;i < list.length;i++){
                        if(this.wfGruopLevelMap[String(list[i].id)]){
                            let _child = [{name:'全部',id:'-1'}];
                            _child =  _child.concat(this.wfGruopLevelMap[String(list[i].id)]);
                            list[i].child = _child;
                            for(let j = 0;j< list[i].child.length;j++){
                                this.fillWFGroupsChildren(list[i].child[j]);
                            }
                        }
                }
             }catch(e){
                 console.log(e);
             }
         },
            //获取流程类别
        getWFGroupsFunc(){
            getWFGroupsAjax().then((response)=>{

                this.wfGruopLevelMap = response.leveMap||{};
                let _groupArray =  response.list;
                this.fillWFGroupsChildren(_groupArray);
                this.groupsArray = _groupArray;

            }).catch((error)=>{

            });
       },
        getDataList(){
            this.$refs.ecoLoadingRef.open();
            this.loading = true;
            if(this.activeName === 'task'){
                this.getTaskListDataFunc();
            }else if(this.activeName === 'notice' || this.activeName === 'annocement'){
                this.getNoticeListDataFunc();
            }else if(this.activeName === 'flowform'){
                this.getWFToDoFunc();
            }
        },
        getWFToDoFunc(){
            this.$refs.ecoLoadingRef.open();
            let params = JSON.parse(JSON.stringify(this.params));
            //在项目管理中
            if(this.$route.params.infoId && this.$route.params.infoId > 0){
                params.type = 'faw_pm_sign';
                params.typeId = this.$route.params.infoId;
                getWfTaskListByProject(params).then((response)=>{
                    this.taskList = response.list;
                    this.total = response.count;
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        //this.$refs.multipleTable.doLayout();
                        this.loading = false;
                    })
                    this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                });
            }else{
                getTaskWFModuleAjax(params).then((response)=>{
                    this.taskList = response.list;
                    this.total = response.count;
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        //this.$refs.multipleTable.doLayout();
                        this.loading = false;
                    });
                    this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                    this.$refs.ecoLoadingRef.close();
                });
            }

        },
        getNoticeListDataFunc(){
            let params = JSON.parse(JSON.stringify(this.params));
            getTaskNoticeList(params).then(res=>{
                this.$refs.ecoLoadingRef.close();
                this.total = res.total;
                this.taskList = res.rows;
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    //this.$refs.multipleTable.doLayout();
                    this.loading = false;
                });
            })
        },
        searchListFunc(){
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.params.page = 1;
            this.getDataList();
        },
        //表格排序
        sortTablefunc(column,prop,order){
            if(column.prop && column.order){
                this.params.sort = column.prop;
                if(column.order == 'ascending'){
                    this.params.order = 'asc'
                }else if(column.order == 'descending'){
                    this.params.order = 'desc'
                }
            }
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.getDataList();
        },

        //每页条数
        handleSizeChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.params.rows = val;
            this.params.page = 1;
            this.getDataList();
        },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
            this.params.page = val;
            this.getDataList();
        },
        resetSearch(){
            if(this.activeName == 'task'){
                this.resetTaskParams();
            }else if(this.activeName == 'notice'){
                this.resetNoticeParams();
                this.params.model = ['faw_pm_model_problem','faw_pm_model_risk'];
            }else if(this.activeName == 'annocement'){
                this.resetNoticeParams();
                this.params.model = ['faw_pm_model_plan'];
            }else{
                this.resetFlowformParams();
            }
        },
        resetTaskParams(){
            this.$set(this.params,"name","");
            this.$set(this.params,"status","");
            this.$set(this.params,"liableUserName","");
            this.$set(this.params,"liableUserId","");
            this.$set(this.params,"planStartDate","");
            this.$set(this.params,"planEndDate","");
            this.$set(this.params,"currentUserId",this.userInfo.id);
            this.s_dates = [];
        },
        resetNoticeParams(){
            this.$set(this.params,"name","");
            this.$set(this.params,"click","-1");
            this.$set(this.params,"type","");
            this.$set(this.params,"model",new Array);
            this.params.userId = this.userInfo.id;
        },
        resetFlowformParams(){
            this.$set(this.params,"groupTemp","-1");
            this.$set(this.params,"groupId","-1");
            this.$set(this.params,"subGroupId","-1");
            this.$set(this.params,"templateId","-1");
            this.$set(this.params,"searchMsg","");
            this.$set(this.params,"sort","assign_date");
            this.$set(this.params,"order","desc");
            this.$set(this.params,"init_start_time","");
            this.$set(this.params,"init_end_time","");
            this.$set(this.params,"assign_start_time","");
            this.$set(this.params,"init_end_time","");
            this.$set(this.params,"assign_end_time","");
            this.$set(this.params,"initValue","");
            this.$set(this.params,"initValueName","");
        },
        goDetail(item){

            if(this.activeName == 'task'){
                if(item.status == 'faw_pm_work_status1'){
                    getTaskDoInfo(item.id).then(res=>{
                        if( this.params.infoId > 0){
                            this.$router.push({name:"taskInfoInProjectCard",params:{id:item.id}})
                        }else{
                            this.$router.push({name:"taskInfoInProjectCard",params:{infoId:item.infoId,id:item.id}})
                        }

                    })
                }else{
                    if( this.params.infoId > 0){
                        this.$router.push({name:"taskInfoInProjectCard",params:{id:item.id}})
                    }else{
                        this.$router.push({name:"taskInfoInProjectCard",params:{infoId:item.infoId,id:item.id}})
                    }
                }
            }else if(this.activeName == 'notice'){
                let data = {
                    name:"handleTabClick",
                    activeName:""
                }
                readNoticeInfo(item.id).then(res=>{
                    item.click = true;
                    if(item.type == 'faw_pm_notice_type1'){

                    }else if(item.type == 'faw_pm_notice_type2'){
                        this.$router.push({name:"detailProblem",params:{infoId:item.infoId,prId:item.modelId}})
                        data.activeName = "question";
                        this.$emit("callback",data);
                    }else if(item.type == 'faw_pm_notice_type3'){
                        this.$router.push({name:"detailRisk",params:{infoId:item.infoId,riskId:item.modelId}})
                        data.activeName = "risk";
                        this.$emit("callback",data);
                    }
                })
            }else if(this.activeName == 'flowform'){
                getWFOperateId(item.id).then((response)=>{
                    if(response.status == 0){
                        let operateId = response.operate_id;
                        // AlphaManual
                        if(response.remap && response.remap.pc_url){
                                let tabObj = {};
                                let goPage = response.remap.pc_url;
                                let reg = new RegExp("{{taskId}}", "g");
                                goPage=goPage.replace(reg,response.remap.task_id);
                                tabObj.desc = response.remap.agent_name;
                                tabObj.tabKey = "documanageAdd";
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'documanageAdd"+response.remap.task_id+"',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
                                window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            if(sysEnv == 1){
                                let tabObj = {};
                                let goPage = "flowform/index.html#/wfDetail/"+item.id+"/"+operateId;
                                tabObj.desc = '待办流程';
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+item.id+"',href_link:'"+goPage+"',fullScreen:true}";
                                window.parent.window.sysvm.doTab(tabObj);
                            }else{
                                this.$router.push({name:'wfDetail',params:{taskId:item.id,operateId:operateId}})
                            }
                        }

                    }else{
                         EcoMessageBox.alert(response.msg);
                    }
                })
            }else if(this.activeName == 'annocement'){
                 let data = {
                    name:"handleTabClick",
                    activeName:""
                }
                readNoticeInfo(item.id).then(res=>{
                    item.click = true;
                    this.$router.push({name:"planGantt",params:{infoId:item.infoId}})
                    data.activeName = "plan";
                    this.$emit("callback",data);
                })
            }
        },
        changeColWidth(nw,ow,col,evt){
            if(nw < col.minWidth){
                col.width = col.minWidth;
            }
        },
        datesChange(values){
            if(values){
                this.params.planStartDate = this.formatDate(values[0]);
                this.params.planEndDate = this.formatDate(values[1]);
            }else{
                this.params.planStartDate = "";
                this.params.planEndDate = "";
            }
        },
        handleTabClick(tab,event){
            this.taskList = [];
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            //重置查询条件
            this.searchShow = false;
            this.params = {
                page:1,
                rows:10,
                order:"desc",
                sort:"createDate",
                infoId:this.$route.params.infoId,
                name:"",
            }

            if(tab.name === "task"){

                this.resetTaskParams();
            }else if(tab.name === "notice"){
                this.resetNoticeParams();
                this.params.model = ['faw_pm_model_problem','faw_pm_model_risk'];
            }else if(tab.name === "flowform"){
                this.resetFlowformParams();
            }else if(tab.name === "annocement"){
                this.resetNoticeParams();
                this.params.model = ['faw_pm_model_plan'];
            }
            this.searchListFunc();
        },
        handleGroupChange(value){

            if(value.length == 1){
                this.params.groupId = value[0];
                this.params.subGroupId = -1;
            }else{
                this.params.groupId = value[0];
                this.params.subGroupId = value[1];
            }

            this.params.templateId = '-1';
            this.getWFTemplatesFunc();
        },
        //获取流程模板
        getWFTemplatesFunc(){
           getWFTemplatesAjax(this.params.groupId,this.params.subGroupId).then((response)=>{
                 this.templdateArray = response.remap.list.list;
                 this.templdateArray.unshift({wfTempId:'-1',name:'全部'})
           }).catch((error)=>{

           });
        },
        tagSelectCB(data){
           if(data.itemArray.length > 0){
                let linkIds = [];
                for(let i = 0;i<data.itemArray.length;i++){
                    linkIds.push(data.itemArray[i].linkId);
                }
                this.params.initValue = linkIds.join('|');
            }else{
                this.params.initValue = null;
            }
        },
        rowClassName({row,rowIndex}){
            if((this.activeName == 'notice' || this.activeName == 'annocement') && !row.click){
                return 'red';
            }
        }

      },
      watch: {

      }
  }

</script>
<style scoped>

.taskList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.taskList .plainBtn{
    border-color: #003b90;
    color: #003b90;
    font-size:14px;
}
.taskList .toolBtn{
    margin:0 10px;
}
.color-tag{
   width: 16px;
   height: 16px;
   border-radius: 50%;
}
.height-red{
   background-color: red;
}
.low-green{
   background-color: #66cc00;
}
.medium-yellow{
  background-color: yellow;
}
.taskList .circle{
    width: 6px;
    height: 6px;
    position: relative;
    top: -2px;
    border-radius: 50%;
    display: inline-block;
    margin-right:2px;
}
.taskList .blue{
    background-color:#409EFF;
}
.taskList .red{
    background-color:#F56C6C;
}
</style>
