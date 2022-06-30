<template>
 <eco-content top="0px" bottom="0px" type="tool" class="wfToViewVue webLayout" style="background-color:#f5f5f5">   
  <div class="toview">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
    
    <eco-content top="0px" height="60px" type="tool" style="overflow: hidden;">
        <el-row style="height:58px;line-height:58px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="6" style="padding-left: 15px;" >
                  <eco-tool-title :title="wfToViewExtObj.wfToView +'（'+baseInfo.total+'）'"></eco-tool-title>
              </el-col>
              <el-col :span="12" style="text-align:center;">
                <el-tabs class="listTab" v-model="activeName" @tab-click="handleTabClick" v-if="!wfToViewExtObj.hiddenTab">
                        <el-tab-pane label="我发起的" name="first"></el-tab-pane>
                        <el-tab-pane label="我经办的" name="second"></el-tab-pane>
                        <el-tab-pane label="抄送我的" name="third"></el-tab-pane>
                </el-tabs>
                <span v-else>&nbsp;</span>
              </el-col>
              <el-col :span="6" style="text-align:right;">
                 <el-select v-model="baseInfo.folder" placeholder="请选择" style="max-width:150px;min-width:86px;width:36%;margin-right:10px" @change="flowStateChangeFunc">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                 <el-button plain class="searchBtn" @click.native="searchShowFunc" ><i class="icon el-icon-search" style="margin-right:10px;"></i>&nbsp;高级检索</el-button>
             </el-col>
        </el-row>
    </eco-content>

    <eco-content top="58px" v-show="this.searchShow">
         <div class="searchBox" v-if="activeName=='first'">
            <div>
                <span style="width:70px;text-align:left;display:inline-block;">{{wfToViewExtObj.type}}：</span>
                <div class="state">
                    <el-cascader
                        v-model="baseInfo.groupTemp"
                        :options="groupsArray"
                        @change="handleGroupChange"
                        :props="{ disabled:'disabled1', label:'name',leaf:'1',value:'id',children:'child'}"
                    >
                        <template slot-scope="{ node, data }">
                            
                            <span v-if="data.name">{{ data.name }}</span>
                            <span v-if="!node.isLeaf"> ({{ data.child.length }}) </span>
                        </template>
                    </el-cascader> 
                </div>
                <span style="width:70px;text-align:left;display:inline-block;">{{wfToViewExtObj.name}}：</span>
                <div class="itemInput">
                    <el-input :placeholder="wfToViewExtObj.namePlaceholder" @keyup.enter.native="searchListFunc" v-model="baseInfo.searchMsg"></el-input>
                </div>
                <el-button plain class="plainBtn" style="margin-left:5px;" @click="reestSearch">清空</el-button>
                <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

            </div>
            <div>
                <span style="width:70px;text-align:left;display:inline-block;">{{wfToViewExtObj.template}}：</span>
                <div class="state">
                        <el-select v-model="baseInfo.templateId"  filterable placeholder="请选择模板">
                            <el-option
                            v-for="item in templdateArray"
                            :key="item.wfTempId"
                            :label="item.name"
                            :value="item.wfTempId">
                            </el-option>
                        </el-select>
                </div>
                <span>{{wfToViewExtObj.startTime}}：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_start_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_end_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>
               
            </div>
         </div>
          <div class="searchBox" v-if="activeName=='second'">
            <div>
                <span>类别：</span>
                <div class="state">
                    <el-cascader
                        v-model="baseInfo.groupTemp"
                        :options="groupsArray"
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
                    <el-input placeholder="请输入流程名称" @keyup.enter.native="searchListFunc" v-model="baseInfo.searchMsg"></el-input>
                </div>
                <span>办理时间：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.op_start_time" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.op_end_time"  value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>
                <el-button plain class="plainBtn" style="margin-left:5px;" @click="reestSearch">清空</el-button>
                <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

            </div>
            <div>
                <span>模板：</span>
                <div class="state">
                        <el-select v-model="baseInfo.templateId"  filterable placeholder="请选择模板">
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
                     <tag-select style="width: 100%;vertical-align: top;"
                        :initDataStr="initUserStr"
                        ref='tagSelect'
                        :initOptions="{selectNum:0,selectType:'User'}" 
                        @callBack="tagSelectCB"></tag-select>
                </div>
                <span>启动时间：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_start_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_end_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>
               
            </div>
            </div>
            <div class="searchBox" v-if="activeName=='third'">
            <div>
                <span style="width:56px;text-align:left;display:inline-block;">类别：</span>
                <div class="state" style="width:180px;">
                    <el-cascader
                        v-model="baseInfo.groupTemp"
                        :options="groupsArray"
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
                    <el-input placeholder="请输入流程名称" @keyup.enter.native="searchListFunc" v-model="baseInfo.searchMsg"></el-input>
                </div>
                <el-button plain class="plainBtn" style="margin-left:5px;" @click="reestSearch">清空</el-button>
                <el-button type="primary" size="small" style="margin-left:5px;height:34px;font-size:14px; " @click="searchListFunc">搜索</el-button>

            </div>
            <div>
                <span>抄送人：</span>
                <div class="itemInput">
                     <tag-select style="width: 100%;vertical-align: top;"
                            :initDataStr="cc_userstr"
                            ref='cctagSelect'
                            :initOptions="{selectNum:0,selectType:'User'}" 
                            @callBack="tagSelectCBCC"></tag-select>
                
                </div>
                <span>抄送时间：</span>
                <div style="display:inline-block;">
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.cc_start_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.cc_end_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                </div>
               
            </div>
         </div>
    </eco-content>
    <eco-content bottom="42px" :top="getContentTop1" ref="content" style="padding:15px;">
        <el-table
            ref="multipleTable"
            :data="processTable"
            tooltip-effect="dark"
            @selection-change="changeFun"
            style="width: 100%;"
            class="flowlist"
            v-loading="loading"
            size="mini"
            height="100%"
            stripe
            :default-sort = defaultSort
            @sort-change="sortTablefunc"
        
        >
          
            <el-table-column
                prop="groupName"
                :label="wfToViewExtObj.type"
                width='150'
                key="6"
                show-overflow-tooltip
                >
                <template slot-scope="scope">{{activeName !='third'?scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"") : scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName:"")}}</template>
            </el-table-column>

            <el-table-column
                prop="request_desc"
                :label="wfToViewExtObj.name"
                min-width="110"
                key="7"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="pointerClass" style="display:block;" @click="goDetail(scope.row.id,scope.row.wfId,scope.row.defFieldId)">{{ activeName !='third'?scope.row.requestDesc:scope.row.requestDesc}}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="statusName"
                label="状态"
                width='100'
                show-overflow-tooltip>
                 <template slot-scope="scope"><span class="circle" v-bind:class="scope.row.statusName == '已完成'?'green':scope.row.statusName == '进行中'?'blue':scope.row.statusName == '已取消'?'cancel':'red'"></span> {{ scope.row.statusName }}</template>
            </el-table-column>
             <!-- <el-table-column
                prop="delayDesc"
                label="目前环节"
                width='190'
                :key="5"
                 v-if="activeName!='third'"
                show-overflow-tooltip>
                 <template slot-scope="scope"><span v-html="scope.row.delayDesc"></span></template>
            </el-table-column> -->
            <el-table-column
                prop="fromUserName"
                label="抄送人员"
                width='150'
                :key="4"
                v-if="activeName=='third'"
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.fromUserName}}</template>
            </el-table-column>
            <el-table-column
                prop="op_date"
                label="办理时间"
                :sort-orders="['ascending', 'descending']"
                width='150'
                sortable='custom'
                :key="3"
                v-if="activeName=='second'"
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.opDate}}</template>
            </el-table-column>
            <el-table-column
                prop="create_date"
                label="抄送时间"
                :sort-orders="['ascending', 'descending']"
                width='200'
                sortable='custom'
                :key="2"
                v-if="activeName=='third'"
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate.substr(0,16):''}}</template>
            </el-table-column>

            <el-table-column
                prop="create_user_id"
                label="启动人员"
                width='100'
                :key="1"
                v-if="activeName=='second'"
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.createUser}}</template>
            </el-table-column>

            <el-table-column
                prop="start_date"
                :label="wfToViewExtObj.startTime"
                :sort-orders="['ascending', 'descending']"
                sortable='custom'
                :key="2"
                width='180'
                v-if="activeName!='third'"
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.startDate}}</template>
            </el-table-column>

            <el-table-column
                label="操作"
                width="100"
                key="8"
                v-if="activeName!='third' && (!wfToViewExtObj.hiddenOpCol)"
              >
              <template slot-scope="scope" >
                 <span v-if="scope.row.statusName == '已完成' && showRateBtn && scope.row.rateButtonStatus == 1 && activeName == 'first'" @click="rateItem(scope.row.id,scope.row.name)" class="pointerClass" style="color:#409EFF;">评价</span>
                 <span v-if="scope.row.statusName == '进行中' && scope.row.revokeFlag == 1" @click="recallItem(scope.row.id)" class="pointerClass" style="color:#F56C6C;">撤回</span>
                 <span class="split" v-if="scope.row.statusName == '进行中' && scope.row.revokeFlag == 1 && scope.row.allow_cancel == 'Y'" ></span>
                 <span v-if="scope.row.statusName == '进行中' && scope.row.allow_cancel == 'Y' " @click="cancelItem(scope.row.id)" class="pointerClass" style="color:#F56C6C;">取消</span>
                 <span v-if="showRateBtn && scope.row.rateButtonStatus == 2 && activeName != 'third'" @click="showRateInfo(scope.row.id,scope.row.name)" class="pointerClass" style="color:#409EFF;">已评价</span>
              </template>
            </el-table-column>
        </el-table>

    </eco-content>

    <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
        <el-row >
          <el-col :span="24" style="text-align:right">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="baseInfo.page"
                  :page-sizes="[10,30,50,100]"
                  :page-size="baseInfo.rows"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="baseInfo.total" style="margin-right:20px">
                </el-pagination>
          </el-col>
      </el-row>
    </eco-content>

  </div>
 </eco-content>
</template>
<script>


import {getWFViewOperateId,getWfSelfInitAjax,getWFMyAllProcessAjax,getWFGroupsAjax,getWFTemplatesAjax,getWFCCListAjax,changeWfStatus,reCallWF} from '../../service/service.js'
import {rows,sysEnv} from '../../config/env.js'
import {Loading } from 'element-ui';
import {mapState,mapMutations} from 'vuex'

import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoButton from '@/components/button/ecoButton.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import tagSelect from '../../views/direction/module/tagSelect.vue'

 export default {
     components:{
          ecoContent,
          ecoButton,
          ecoToolTitle,
          ecoLoading,
          tagSelect
     },
     data(){
         return{
           options: [{
                value: '-1',
                label: '全部状态'
                }, {
                value: '0',
                label: '进行中'
                }, {
                value: '1',
                label: '已完成/被拒绝'
                }, {
                value: '2',
                label: '已取消'
                }],
           processTable: [],
           wfGruopLevelMap:{},
           groupsArray: [],
           templdateArray: [],
           multipleSelection: [],
           baseInfo:{
               folder:'-1',                      //-1 全部 0 进行中 1 已完成/被拒绝 2 已取消
               page:1,
               rows:30,
               total:0,
               groupId: '-1',
               groupTemp:'-1',
               templateId: '-1',
               searchMsg: '',
               sort:'start_date',
               order:'desc',
               init_start_time:"",
               init_end_time:"",
               assign_start_time:"",
               assign_end_time:"",
               initValue:"",
               initValueName:"",
               op_start_time:"",
               op_end_time:"",
               cc_user:"",
               cc_start_time:"",
               cc_end_time:"",
               extendFilter:null
           },
           searchShow: false,
           activeName:"first",
           defaultSort:{
               prop: 'start_date', 
               order: 'descending'
           },
           showRateBtn:false,
           loading:true,
           initUserStr:'',
           cc_userstr:'',
           wfToViewExtObj:{}
         }
     },
     computed:{
       getContentTop1:function(){
           if(this.searchShow){
               return '160px';
           }else{
               return '58px';
           }
       }
     },
    created(){    
        this.showRateBtn = true;
        if(window && window.flowformSetting && window.flowformSetting.wfToViewExtObj){
            for(let key in window.flowformSetting.wfToViewExtObj){
                this.$set(this.wfToViewExtObj,key,window.flowformSetting.wfToViewExtObj[key]);
            }
        }else{
            this.$set(this.wfToViewExtObj,'wfToView','流程查看');
            this.$set(this.wfToViewExtObj,'type','类别');
            this.$set(this.wfToViewExtObj,'name','流程名称');
            this.$set(this.wfToViewExtObj,'template','模板');
            this.$set(this.wfToViewExtObj,'startTime','启动时间');
            this.$set(this.wfToViewExtObj,'hiddenTab',false);
            this.$set(this.wfToViewExtObj,'hiddenOpCol',false);
            this.$set(this.wfToViewExtObj,'namePlaceholder','请输入流程名称');
        }

        
     },
     mounted(){
        this.baseInfo.extendFilter = this.$route.query.extendFilter;
        this.getWfSelfInitFunc();
        this.getWFGroupsFunc();
        this.getWFTemplatesFunc();
        this.listAction();
        window.ecoToViewVm = this;
     },

     methods: {

        listAction(){
                window.tabClickFunc = function(){
               //      window.ecoTodoVm.getWfSelfInitFunc();
                }
                let this_ = this;
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'rateWorkFlow' ){
                        this_.$message({
                            message: '评价成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        window.ecoToViewVm.getWfSelfInitFunc();
                    }
                     EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfToView');
                 }
          },
        
      

        //流程状态切换
        flowStateChangeFunc(e){
           this.searchListFunc();
        },
        //获取我发起的流程列表
        getWfSelfInitFunc(){
            this.$refs.ecoLoadingRef.open();
            getWfSelfInitAjax(this.baseInfo).then((response)=>{
                this.processTable = response.data.list;
                this.baseInfo.total = response.data.count;
                this.$refs.ecoLoadingRef.close();
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.$refs.multipleTable.doLayout();
                    this.loading = false;
                });
            }).catch((error)=>{
                this.$refs.ecoLoadingRef.close();
            });
       },

        //获取我经办的流程列表
         getWfMyAffProcessFunc(){
            
           this.$refs.ecoLoadingRef.open();
           getWFMyAllProcessAjax(this.baseInfo).then((response)=>{
                this.processTable = response.data.list;
                this.baseInfo.total = response.data.count;
                this.$refs.ecoLoadingRef.close();
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.$refs.multipleTable.doLayout();
                    this.loading = false;
                    
                });
           }).catch((error)=>{
               this.$refs.ecoLoadingRef.close();
           });
       },

       //获取流程类别
        getWFGroupsFunc(){
           getWFGroupsAjax().then((response)=>{

                this.wfGruopLevelMap = response.data.leveMap||{};
                let _groupArray =  response.data.list;
                this.fillWFGroupsChildren(_groupArray);
                this.groupsArray = _groupArray;

           }).catch((error)=>{

           });
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

        //获取流程模板
        getWFTemplatesFunc(){
           getWFTemplatesAjax(this.baseInfo.groupId,this.baseInfo.subGroupId).then((response)=>{
                 this.templdateArray = response.data.remap.list.list;
                 this.templdateArray.unshift({wfTempId:'-1',name:'全部'})
           }).catch((error)=>{

           });
       },
       getWFCCListFunc(){
           this.$refs.ecoLoadingRef.open();
           getWFCCListAjax(this.baseInfo).then((response)=>{
              this.processTable = response.data.list;
              this.baseInfo.total = response.data.count;
              this.$refs.ecoLoadingRef.close();
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                 this.$refs.multipleTable.doLayout();
                 this.loading = false;
              });
           }).catch((error)=>{
               this.$refs.ecoLoadingRef.close();
           });

       },

       handleTabClick(tab,event){
            this.baseInfo.page = 1;
            this.loading = true;
            this.processTable = [];
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            //重置查询条件
            this.baseInfo.groupId = '-1';
            this.baseInfo.subGroupId = '';
            this.baseInfo.groupTemp = ['-1'];
            this.baseInfo.searchMsg = '';
            this.baseInfo.templateId = '-1';
            this.baseInfo.init_start_time = '';
            this.baseInfo.init_end_time = '';
            this.baseInfo.op_start_time = '';
            this.baseInfo.op_end_time = '';
            this.baseInfo.initValue = '';

            if(this.$refs['tagSelect']){
                  this.$refs['tagSelect'].clearTag();
            }
            if(this.$refs['cctagSelect']){
                  this.$refs['cctagSelect'].clearTag();
            }
            this.baseInfo.cc_start_time = '';
            this.baseInfo.cc_end_time = '';
            this.baseInfo.cc_user = '';
            if(tab.name === "first"){
                this.$nextTick(() => { 
                    this.$refs.multipleTable.sort("start_date","descending");
                });
            }else if(tab.name === "second"){
                this.$nextTick(() => { 
                    this.$refs.multipleTable.sort("op_date","descending");
                });
            }else if(tab.name === "third"){
                 this.$nextTick(() => { 
                    this.$refs.multipleTable.sort("create_date","descending");
                 });
            }
            
       },

       searchShowFunc(){
           if(this.searchShow){
               this.searchShow = false;
           }else{
               this.searchShow = true;
           }
       } ,

       searchListFunc(){
            this.baseInfo.page = 1;
             this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            if(this.activeName === "first"){
                this.getWfSelfInitFunc();
            }else if(this.activeName === "second"){
                this.getWfMyAffProcessFunc();
            }else if(this.activeName === "third"){
                this.getWFCCListFunc();
            }
       },

       changeFun(rows) {
           this.multipleSelection = rows;
       },

        //表格排序
       sortTablefunc(column,prop,order){

          if(column.prop && column.order){
              this.baseInfo.sort = column.prop;
              if(column.order == 'ascending'){
                  this.baseInfo.order = 'asc'
              }else if(column.order == 'descending'){
                  this.baseInfo.order = 'desc'
              }
          }else{
              this.baseInfo.order = '';
              this.baseInfo.sort  ='';
          }
         
          this.searchListFunc();
       },

       //每页条数
        handleSizeChange(val) {
              this.baseInfo.rows = val;
              this.baseInfo.page = 1;
              this.searchListFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
           this.baseInfo.page = val;
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
           if(this.activeName === "first"){
                this.getWfSelfInitFunc();
            }else if(this.activeName === "second"){
                this.getWfMyAffProcessFunc();
            }else if(this.activeName === "third"){
                this.getWFCCListFunc();
            }
        },

        goDetail(id,wfId,defFieldId){
            let formView = 1;
            let _wfId = null;
            let _ccId = null;
            if(this.activeName == 'first'){
                formView = 1;
                _wfId = id;
            }else if(this.activeName == 'second'){
                formView = 1;
                _wfId = id;
            }else if(this.activeName == 'third'){
                formView = 3;
                _ccId = id;
            }
            
            getWFViewOperateId(_wfId,formView,_ccId,defFieldId).then((response)=>{
                    if(response.data.status == 0){
                        let operateId = response.data.operate_id;
                        if(sysEnv == 1){

                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfViewDetail/"+id+"/"+operateId;
                            tabObj.desc = '流程查看';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+id+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            this.$router.push({name:'wfViewDetail',params:{wfId:id,operateId:operateId}})
                        }
                    }else{
                         EcoMessageBox.alert(response.data.msg);
                    }
            })

        },
        deleteItem(){

        },
        cancelItem(wfId){

            var that  = this;
           let confirmYesFunc = function(){
                let data = {
                    wf_id:wfId,
                    target_status_flag:"to_canceled"
                };
                changeWfStatus(data).then((response)=>{
                    if(response.data.status < 100){
                        that.$message({
                            message: '状态变更成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        if(that.activeName === "first"){
                            that.getWfSelfInitFunc();
                        }else if(that.activeName === "second"){
                            that.getWfMyAffProcessFunc();
                        }
                    }else{
                         that.$message({
                            message: response.data.msg,
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'warning'
                        });
                    }
                });
           }
          let options = {
                type: 'warning',
                lockScroll:false
           }
          EcoMessageBox.confirm('确定要取消该流程吗?','提示',options,confirmYesFunc);
        
        },
         reestSearch(){
            this.baseInfo.groupId = '-1';
            this.baseInfo.subGroupId = '';
            this.baseInfo.groupTemp = ['-1'];
            this.baseInfo.searchMsg = '';
            if(this.activeName === "first" || this.activeName === "second"){
                this.baseInfo.templateId = '-1';
                this.baseInfo.init_start_time = '';
                this.baseInfo.init_end_time = '';
                if(this.activeName === "second"){
                    this.baseInfo.op_start_time = '';
                    this.baseInfo.op_end_time = '';
                    this.baseInfo.initValue = '';
                    this.$refs['tagSelect'].clearTag();
                }
            }else if(this.activeName === "third"){
                this.baseInfo.cc_start_time = '';
                this.baseInfo.cc_end_time = '';
                this.baseInfo.cc_user = '';
                this.$refs['cctagSelect'].clearTag();
            }
            
        },
         tagSelectCB(data){
            if(data.itemArray.length > 0){
                let linkIds = [];
                for(let i = 0;i<data.itemArray.length;i++){
                    linkIds.push(data.itemArray[i].linkId);
                }
                this.baseInfo.initValue = linkIds.join('|');
            }else{
                this.baseInfo.initValue = null;
            }
        },
        tagSelectCBCC(data){
            if(data.itemArray.length > 0){
                let linkIds = [];
                for(let i = 0;i<data.itemArray.length;i++){
                    linkIds.push(data.itemArray[i].linkId);
                }
                this.baseInfo.cc_user = linkIds.join('|');
            }else{
                this.baseInfo.cc_user = null;
            }
        },
         handleGroupChange(value){
            if(value.length == 1){
                this.baseInfo.groupId = value[0];
                this.baseInfo.subGroupId = -1;
            }else{
                this.baseInfo.groupId = value[0];
                this.baseInfo.subGroupId = value[value.length-1];
            }

            this.baseInfo.templateId = '-1';
            this.getWFTemplatesFunc();
        },

         recallItem(wfId){
           var that  = this;
           let confirmYesFunc = function(){
                let data = {
                    wf_id:wfId,
                };
                reCallWF(data).then((response)=>{
                    if(response.data.status < 100){
                        that.$message({
                            message: '撤回操作成功！',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        if(that.activeName === "first"){
                            that.getWfSelfInitFunc();
                        }
                    }else{
                        that.$message({
                            message: response.data.msg,
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'warning'
                        });
                    }
                });
          }
          let options = {
                type: 'warning',
                lockScroll:false
          }
          EcoMessageBox.confirm('是否确定撤回此流程？','提示',options,confirmYesFunc);
        },
        rateItem(wfId,name){
             if(sysEnv == 1){
                let _width = '500';
                let _height = '190';
                let url = encodeURI('/wh/jsp/version3/flowform/index.html#/rateWorkFlow/'+wfId+"/"+name);
                EcoUtil.getSysvm().openDialog('评价',url,_width,_height,'15vh');
            }else{
                let wfName = encodeURI(name);
                this.$router.push({name:"rateWorkFlow",params:{wfId:wfId,wfName:wfName}})
            }
        },
        showRateInfo(wfId,name){
             if(sysEnv == 1){
                let _width = '500';
                let _height = '180';
                let url = encodeURI('/wh/jsp/version3/flowform/index.html#/showRateInfo/'+wfId+"/"+name);
                EcoUtil.getSysvm().openDialog('已评价',url,_width,_height,'15vh');
            }else{
                let wfName = encodeURI(name);
                this.$router.push({name:"showRateInfo",params:{wfId:wfId,wfName:wfName}})
            }
        }
     },
     watch: {

    },
    filters:{
       
    }

 }
</script>

<style scope>

.toview{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}
.toview .plainBtn{
    border-color: #409EFF;
    color: #409EFF;
    font-size:14px;
}
.toview .searchBtn{
    border-color: #409EFF;
    color: #409EFF;
    font-size:14px;
    margin-right: 30px;
    min-width:105px;
    width:45%;
    max-width:140px;
}
  .toview .state{
     display: inline-block;
      width: 160px;
      margin-right: 10px;
  }
  .toview .templateInput{
      display: inline-block;
      width: 300px;
  }
  .toview .templateInput div{
      display: inline-block;
      width: 376px;
  }
  .toview .itemInput{
      display: inline-block;
      width: 180px;
      margin-right: 10px;
  }
  .toview .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #f5f5f5 ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:auto;
  }
  .circle{
        width: 6px;
        height: 6px;
        position: relative;
        top: -2px;
        border-radius: 50%;
        display: inline-block;
        margin-right:2px;
  }
  .blue{
      background-color:#409EFF;
  }
  .red{
      background-color:#F56C6C;
  }
  .green{
       background-color:#67C23A;
  }
  .cancel{
      background-color:#909399;
  }
.delayDesc{
        text-overflow: ellipsis;
        overflow: hidden;
  }
  .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
    }
</style>
