<template>
 <eco-content top="0px" bottom="0px" type="tool" class="wfToControl webLayout" style="background-color:#f5f5f5">

  <div class="relevanceFlowVue">
    <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>

    <eco-content top="0px" height="60px" type="tool">
        <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
              <el-col :span="8" >
                  <eco-tool-title style="line-height: 34px;" :title="'流程监控'+'（'+baseInfo.total+'）'"></eco-tool-title>
              </el-col>
              <el-col :span="16" style="text-align: right;">
                    <el-checkbox v-model="abnormalFlag" @change="changeAbnormal" v-if="checkBtnShow('FILTER_ABNORAML')">仅显示异常流程</el-checkbox>&nbsp;
                    <el-select v-model="baseInfo.folder" placeholder="请选择" style="width:150px;margin-right:10px" @change="flowStateChangeFunc">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                    </el-select>

                  <el-button plain v-if=" ifDeal && baseInfo.folder != '2' && checkBtnShow('CANCEL_WF')" class="plainBtn searchBtn btnred" @click.native="batchCancelWf" ><i class="icon el-icon-close" style="margin-right:10px;"></i>&nbsp;批量取消</el-button>
                  <el-button plain v-if=" ifDeal && baseInfo.folder == '2' && checkBtnShow('DELETE_WF')" class="plainBtn searchBtn btnred" @click.native="batchDeleteWf" ><i class="icon el-icon-close" style="margin-right:10px;"></i>&nbsp;批量删除</el-button>

                  <el-button plain class="plainBtn searchBtn" @click.native="searchShowFunc" ><i class="icon el-icon-search" style="margin-right:10px;"></i>&nbsp;高级检索</el-button>

             </el-col>
        </el-row>
    </eco-content>

    <eco-content top="59px" v-show="this.searchShow">
        <div class="searchBox">
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
                <span style="width:70px;text-align:left;display:inline-block;">流程ID:</span>
                <div class="itemInput">
                    <el-input placeholder="请输入流程ID" @keyup.enter.native="searchListFunc" v-model="workflowfId" clearable></el-input>
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
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_start_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
                    -
                    <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" value-format="yyyy-MM-dd HH:mm" v-model="baseInfo.init_end_time"  format="yyyy-MM-dd HH:mm" ></el-date-picker>
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
          size="mini"
          height="100%"
          stripe
          :default-sort = "{prop: 'start_date', order: 'descending'}"
          @sort-change="sortTablefunc"
          :row-class-name="tableRowClassName"

        >
           <el-table-column
            type="selection"
            :selectable="selectable"
            key="10"
            v-if="ifDeal"
            width="45">

            </el-table-column>

            <el-table-column
                prop="groupName"
                label="类别"
                width='130'
                show-overflow-tooltip
                >
                 <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"")}}</template>
            </el-table-column>

            <el-table-column
                prop="request_desc"
                label="流程名称"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="pointerClass" style="display:block;" @click="goDetail(scope.row.id)" v-bind:style="{paddingLeft:scope.row.ecoLevel+'px'}">
                        {{ scope.row.requestDesc}}
                    </span>
                </template>
            </el-table-column>

             <el-table-column
                prop="status_id"
                label="状态"
                width='100'
                show-overflow-tooltip>
                 <template slot-scope="scope">
                     <span class="circle" v-bind:class="scope.row.statusName == '已完成'?'green':scope.row.statusName == '进行中'?'blue':scope.row.statusName == '已取消'?'cancel':'red'"></span> {{ scope.row.statusName }}

                     <el-tooltip class="item" effect="dark" content="异常" placement="top" v-if=" scope.row.abnormalFlag == 1" >
                        <i v-if=" scope.row.abnormalFlag == 1" class="icon iconfont iconjinggao pointerCalss"></i>
                     </el-tooltip>

                </template>
            </el-table-column>

            <el-table-column
                prop="delayDesc"
                label="目前环节"
                width='190'
                show-overflow-tooltip>
                 <template slot-scope="scope">
                     <span v-html="scope.row.delayDesc" class="delayDesc"></span>
                </template>
            </el-table-column>


            <el-table-column
                prop="initUserName"
                label="启动人员"
                width='80'
                show-overflow-tooltip>
                 <template slot-scope="scope">{{ scope.row.initUserName}}</template>
            </el-table-column>

            <el-table-column
                prop="start_date"
                label="启动时间"
                sortable='custom'
                :sort-orders="['ascending', 'descending']"
                width='150'
                show-overflow-tooltip>
                 <template slot-scope="scope">{{scope.row.startDate?scope.row.startDate.substring(0,16):''}}</template>
            </el-table-column>

            <el-table-column
              label="操作"
              :width="getOpWidth"
              >
              <template slot-scope="scope" >
                  <div class="dealCol">
                            <span class="pointerClass" v-if="checkBtnShow('MANAGE_NODE') && scope.row.statusName == '进行中' "  @click="showControl(scope.row.id)" style="color:#409EFF;">节点管理</span>
                            <span class="" v-if="checkBtnShow('MANAGE_NODE') && scope.row.statusName != '进行中'" ><i style="width:56px;display:inline-block">&nbsp;</i></span>

                            <span class="pointerClass" v-if="checkBtnShow('CHANGE_STATUS')" @click="showChangeStatus(scope.row.id,scope.row.statusName)" style="color:#409EFF;">状态变更</span>

                            <span class="pointerClass" v-if="scope.row.statusName == '进行中' && scope.row.abnormalFlag == 0 && checkBtnShow('SET_ABNORMAL')"  @click="setAbnormalFunc(scope.row.id)" style="color:#F56C6C;">标记异常</span>
                            <span class="pointerClass" v-else-if="scope.row.statusName == '进行中' && scope.row.abnormalFlag == 1 && checkBtnShow('SET_ABNORMAL')"  @click="cancelAbnormalFunc(scope.row.id)" style="color:#F56C6C;">取消异常</span>
                            <span v-else-if="checkBtnShow('SET_ABNORMAL')" ><i style="width:56px;display:inline-block">&nbsp;</i></span>

                            <span class="pointerClass"  v-if="scope.row.statusName == '进行中' && checkBtnShow('CANCEL_WF')" @click="cancelItem(scope.row.id) " style="color:#F56C6C;">取消</span>
                            <span class="pointerClass"  v-if="scope.row.statusName == '已取消' && checkBtnShow('DELETE_WF')" @click="deleteItem(scope.row.id) " style="color:#F56C6C;">删除</span>

                            <span class="pointerClass"  v-if="scope.row.statusName == '进行中' && checkBtnShow('QUICK_MANAGE')"  @click="showSimpleControl(scope.row.id)" style="color:#409EFF;">快捷运维</span>
                    </div>
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


import {getWFControlListAjax,getWFControlListByWfIdAjax,getWFViewOperateId,getWFGroupsAjax,getWFTemplatesAjax,changeWfStatus,batchCancelWf,deleteWorkFlow,batchDeleteWf,setAbnormal,cancelAbnormal,getRoleBtnSetting} from '../../service/service.js'
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
           groupsArray: [],
           wfGruopLevelMap:{},
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
               initValue:"",
               initValueName:"",
               abnormalFlag:0,
               subGroupId:''
           },
           workflowfId:null,
           searchShow: false,
           ifDeal:true,
           abnormalFlag:false,
           isAdmin:false,
           btnRoleMap:[],
           initUserStr:''
         }
     },
     computed:{
            getContentTop1:function(){
                if(this.searchShow){
                    return '161px';
                }else{
                    return '59px';
                }
            },
            getOpWidth:function(){
                let _width = 0;
                if(this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_MANAGE_NODE']){
                    _width += 80;
                }
                if(this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_CHANGE_STATUS']){
                    _width += 80;
                }
                if(this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_SET_ABNORMAL']){
                    _width += 80;
                }
                if(this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_CANCEL_WF'] || this.btnRoleMap['bpm95-monitorworkflow_DELETE_WF'] ){
                    _width += 50;
                }
                if(this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_QUICK_MANAGE']){
                    _width += 80;
                }
                return _width==0?50:_width;
            }

     },
    created(){
            this.getRoleBtnSetting();
     },
     mounted(){
           this.getWFControlListFunc();
           this.getWFGroupsFunc();
           this.getWFTemplatesFunc();
           this.listAction();
           window.ecoTodoVm = this;
     },

     methods: {

        listAction(){
                window.tabClickFunc = function(){
                     window.ecoTodoVm.tabClickFunc();
                }
                let this_ = this;
                let callBackDialogFunc = function(obj){
                    if(obj && (obj.action == 'changeWfStatus' || obj.action == 'flowControl') ){
                        this_.$message({
                            message: '状态变更成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        window.ecoTodoVm.getWFControlListFunc(true);
                    }
                    if(obj && obj.action == "flowStartQuanXian"){
                        this_.$message({
                            message: '权限设置成功！',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfToControl');
        },

         tableRowClassName({row, rowIndex}) {
             if(row.abnormalFlag == 1){
                 return 'warning-row'
             }
             return '';
        },
         getRoleBtnSetting(){
              const btn_array = ['bpm95-monitorworkflow_MANAGE_NODE',
              'bpm95-monitorworkflow_QUICK_MANAGE',
              'bpm95-monitorworkflow_CHANGE_STATUS',
              'bpm95-monitorworkflow_SET_ABNORMAL',
              'bpm95-monitorworkflow_CANCEL_WF',
              'bpm95-monitorworkflow_DELETE_WF',
              'bpm95-monitorworkflow_FILTER_ABNORAML'];

              getRoleBtnSetting(btn_array).then((res)=>{
                 if(res.data){
                    //  this.isAdmin = res.data.admin;
                    //  try{
                    //      this.isAdmin = this.isAdmin || EcoUtil.getSysvm().getEcoSettingObj().sysAdmin;
                    //  }catch(e){}
                     this.btnRoleMap = res.data.authenticationMap;
                 }
              })

          },
         //保存选择事件
        saveChoiceFlowFunc(){
            // console.log(this.multipleSelection);
            if (this.multipleSelection.length == 0) {
               EcoMessageBox.alert('请选择要操作的数据','提示');
                return false;
            }
            // window.returnValue = this.multipleSelection;
            let doObj = {}
                doObj.action = 'saveMyWorkflowCKAction';
                doObj.data = this.multipleSelection;
                doObj.close = true;
                parent.window.sysvm.callBackDialogFunc(doObj);
        },

        //流程状态切换
        flowStateChangeFunc(e){
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = 1;
            this.getWFControlListFunc();
        },

        //获取流程监控列表
        getWFControlListFunc(flag){
           this.$refs.ecoLoadingRef.open();

           getWFControlListAjax(this.baseInfo).then((response)=>{
               let _array = [];
               (response.data.list).forEach((item)=>{
                   if(item.delayDesc){
                        item.delayDesc =  item.delayDesc.replace(/&nbsp;/g,'<br/>');
                   }
                   item.ecoLevel = 0;
                   _array.push(item);
               })

                this.processTable = _array;
                this.baseInfo.total = response.data.count;
                if(this.processTable.every( item => item.is_manager == 0 )){
                    this.ifDeal = false;
                }else{
                    this.ifDeal = true;
                }

                this.$refs.ecoLoadingRef.close();
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    if(!flag){
                        this.$refs.multipleTable.doLayout();
                    }
                });
           }).catch((error)=>{
               this.$refs.ecoLoadingRef.close();
           });
       },


       //获取我发起的流程列表
        getWFControlListByIdFunc(flag){
           this.$refs.ecoLoadingRef.open();
           getWFControlListByWfIdAjax(this.workflowfId).then((response)=>{
                let _array = [];
                if(response.data.list){
                    (response.data.list).forEach((item)=>{
                        if(item.node && item.node.delayDesc){
                            item.node.delayDesc =  item.node.delayDesc.replace(/&nbsp;/g,'<br/>');
                        }
                        item.node.ecoLevel = 0;
                        _array.push(item.node);
                        this.filterChildData(item.children,_array,1);
                    })
                }

                this.processTable = _array;
                this.baseInfo.total = response.data.count;
                if(this.processTable.every( item => item.is_manager == 0 )){
                    this.ifDeal = false;
                }else{
                    this.ifDeal = true;
                }
                this.$refs.ecoLoadingRef.close();
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    if(!flag){
                        this.$refs.multipleTable.doLayout();
                    }
                });
           }).catch((error)=>{
               this.$refs.ecoLoadingRef.close();
           });
       },

       filterChildData(childrenData,_array,level){
           if(childrenData){
                (childrenData).forEach((item)=>{
                    if(item.node && item.node.delayDesc){
                        item.node.delayDesc =  item.node.delayDesc.replace(/&nbsp;/g,'<br/>');
                    }
                    item.node.ecoLevel = level*10;
                    _array.push(item.node);
                    this.filterChildData(item.children,_array,level+1);
                })
           }
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

       groupsStateChangeFunc(e){
           this.getWFTemplatesFunc();
       },

       searchShowFunc(){
           if(this.searchShow){
               this.searchShow = false;
           }else{
               this.searchShow = true;
           }
       } ,

       tabClickFunc(){
            if(this.workflowfId && this.workflowfId!=''){
                this.searchListByWFIdFunc();
            }else{
                this.getWFControlListFunc();
            }
       },

       searchListFunc(){
            if(this.workflowfId && this.workflowfId!=''){
                this.searchListByWFIdFunc();
            }else{
                this.$refs.multipleTable.bodyWrapper.scrollTop =0;
                this.baseInfo.page = 1;
                this.getWFControlListFunc();
            }
       },

       searchListByWFIdFunc(){
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = 1;
            this.getWFControlListByIdFunc();
       },

       changeFun(rows) {
           this.multipleSelection = rows;
       },

       changeAbnormal(){
           this.baseInfo.abnormalFlag = this.abnormalFlag?1:0;
           this.baseInfo.page = 1;
           this.$refs.multipleTable.bodyWrapper.scrollTop =0;
           this.getWFControlListFunc();
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
          }
          this.$refs.multipleTable.bodyWrapper.scrollTop =0;
          this.getWFControlListFunc();
       },

       //每页条数
        handleSizeChange(val) {
             this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.baseInfo.rows = val;
              this.baseInfo.page = 1;
              this.getWFControlListFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
            this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = val;
            this.getWFControlListFunc();
        },

        goDetail(wfId){
            let formView = 2;
            getWFViewOperateId(wfId,formView).then((response)=>{
                    if(response.data.status == 0){
                        let operateId = response.data.operate_id;
                        if(sysEnv == 1){
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfViewDetail/"+wfId+"/"+operateId;
                            tabObj.desc = '流程查看';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }else{
                             this.$router.push({name:'wfViewDetail',params:{wfId:wfId,operateId:operateId}})
                        }
                    }else{
                         EcoMessageBox.alert(response.data.msg);
                    }
            })

        },
        reestSearch(){
            this.baseInfo.groupId = '-1';
            this.baseInfo.subGroupId = '';
            this.baseInfo.groupTemp = ['-1'];
            this.baseInfo.templateId = '-1';
            this.baseInfo.searchMsg = '';
            this.baseInfo.init_start_time = '';
            this.baseInfo.init_end_time = '';
            this.baseInfo.initValue = '';
            this.workflowfId = null;
            this.$refs['tagSelect'].clearTag();
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
        handleGroupChange(value){
            if(value.length == 1){
                this.baseInfo.groupId = value[0];
                this.baseInfo.subGroupId = '';
            }else{
                this.baseInfo.groupId = value[0];
                this.baseInfo.subGroupId = value[value.length-1];
            }
            this.baseInfo.templateId = '-1';
            this.getWFTemplatesFunc();
        },

        showControl(id){
            if(sysEnv == 1){
                let _width = '800';
                let _height = '480';
                let url = '/flowform/index.html#/flowControl/'+id;
                EcoUtil.getSysvm().openDialog('节点管理',url,_width,_height,'15vh');
            }else{
                 this.$router.push({name:"flowControl",params:{wfId:id}})
            }
        },

         showSimpleControl(id){
            if(sysEnv == 1){
                let _width = '800';
                let _height = '480';
                let url = '/flowform/index.html#/flowSimpleControl/'+id;
                EcoUtil.getSysvm().openDialog('快捷运维',url,_width,_height,'15vh');
            }else{
                 this.$router.push({name:"flowSimpleControl",params:{wfId:id}})
            }
        },



        showChangeStatus(wf_id,folder){
            if(sysEnv == 1){
                let _width = '500';
                let _height = '320';
                let url = encodeURI('/flowform/index.html#/changeWfStatus/'+wf_id+"/"+folder);
                EcoUtil.getSysvm().openDialog('流程状态变更',url,_width,_height,'15vh');
            }else{
                this.$router.push({name:"changeWfStatus",params:{wfId:wf_id,folder:folder}})
            }
        },
        showChangeTaskLevel(){

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
                        that.getWFControlListFunc();

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
        batchCancelWf(){
            if(this.multipleSelection.length == 0){
               EcoMessageBox.alert('请选择记录');
               return;
            }

           var that  = this;
           let confirmYesFunc = function(){
                let wf_id_array = [];
                for(let i=0;i<that.multipleSelection.length;i++){
                    wf_id_array.push(that.multipleSelection[i].id);
                }

                let data = {
                    wf_id_str:wf_id_array.join('|')
                };
                 batchCancelWf(data).then((response)=>{
                        if(response.data.status < 100){
                            that.$message({
                                message: '状态变更成功',
                                showClose: true,
                                duration:2000,
                                customClass:'design-from-el-message',
                                type: 'success'
                            });

                            that.getWFControlListFunc();

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
          EcoMessageBox.confirm('确定要取消这些流程吗？?','提示',options,confirmYesFunc);

        },
        selectable(row,index){
            if(row.is_manager == 0){
                return false;
            }
            return true;
        },
        batchDeleteWf(){
            if(this.multipleSelection.length == 0){
               EcoMessageBox.alert('请选择记录');
               return;
            }

           var that  = this;
           let confirmYesFunc = function(){
                let wf_id_array = [];
                for(let i=0;i<that.multipleSelection.length;i++){
                    wf_id_array.push(that.multipleSelection[i].id);
                }

                let data = {
                    wf_ids:wf_id_array.join(',')
                };
                 batchDeleteWf(data).then((response)=>{
                        if(response.data.status < 100){
                            that.$message({
                                message: '删除成功',
                                showClose: true,
                                duration:2000,
                                customClass:'design-from-el-message',
                                type: 'success'
                            });

                            that.getWFControlListFunc();

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
          EcoMessageBox.confirm('确定要删除这些流程吗？','提示',options,confirmYesFunc);
        },

        deleteItem(wfId){

           var that  = this;
           let confirmYesFunc = function(){
               let data = {
                    wf_id:wfId
                };
               deleteWorkFlow(data).then((response)=>{
                    if(response.data.status < 100){
                        that.$message({
                            message: '删除成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        that.getWFControlListFunc();

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
          EcoMessageBox.confirm('确定要删除该流程吗?','提示',options,confirmYesFunc);
        },


        setAbnormalFunc(wfId){
            setAbnormal(wfId).then((response)=>{
                    if(response.data.status < 100){
                        this.$message({
                            message: '设置异常成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        this.getWFControlListFunc();
                    }else{
                        this.$message({
                                message: response.data.msg,
                                showClose: true,
                                duration:2000,
                                customClass:'design-from-el-message',
                                type: 'warning'
                        });
                    }
            });
        },

        cancelAbnormalFunc(wfId){
            cancelAbnormal(wfId).then((response)=>{
                    if(response.data.status < 100){
                        this.$message({
                            message: '取消异常成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        this.getWFControlListFunc();
                    }else{
                        this.$message({
                                message: response.data.msg,
                                showClose: true,
                                duration:2000,
                                customClass:'design-from-el-message',
                                type: 'warning'
                        });
                    }
            });
        },

        checkBtnShow(type){
            return this.isAdmin || this.btnRoleMap['bpm95-monitorworkflow_'+type];
        },

     },
     watch: {

    },
    filters:{

    }

 }
</script>

<style scope>

.relevanceFlowVue{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}
.relevanceFlowVue .plainBtn{
    border-color: #409EFF;
    color: #409EFF;
    font-size:14px;
}
.relevanceFlowVue .plainBtn.btnred{
    color: #f56c6c;
    border-color: #f56c6c;
}
.relevanceFlowVue .plainBtn.btnred:hover{
    color: #f56c6c;
    border-color: #f56c6c;
}
.relevanceFlowVue .searchBtn{
    float:right;
    margin-right: 15px;
    min-width:105px;
    width:45%;
    max-width:140px;
}
  .relevanceFlowVue .state{
      display: inline-block;
      width: 160px;
      margin-right: 10px;
  }
  .relevanceFlowVue .templateInput{
      display: inline-block;
      width: 300px;
  }
  .relevanceFlowVue .templateInput div{
      display: inline-block;
      width: 376px;
  }
  .relevanceFlowVue .itemInput{
      display: inline-block;
      width: 180px;
      margin-right: 10px;
  }
  .relevanceFlowVue .searchBox{
      font-size: 14px;
      padding: 0px 20px;
      line-height: 50px;
      background-color: #f5f5f5 ;
      border-bottom: 1px solid #ddd;
      height:101px;
      overflow-y:auto;
  }

  .relevanceFlowVue .iconjinggao{
      color:red;
      font-size: 14px;
  }

  .relevanceFlowVue .delayDesc{
      height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
  }




  .split{
    border-right: 1px solid #ddd;
    margin: 0 10px 0 5px;
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

  .dealCol span:not(:last-child):after{
      content: " ";
      border-right: 1px solid #ddd;
      margin: 0 10px 0 5px;
  }
</style>
