<template>
    <eco-content top="0px" bottom="0px" type="tool" class="wfToDoVue webLayout" style="background-color:#f5f5f5">
        <div class="relevanceFlowVue">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <eco-content top="0px" height="60px" type="tool">
                <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="8" >
                        <eco-tool-title style="line-height: 34px;" :title="'待办流程'+'（'+baseInfo.total+'）'"></eco-tool-title>
                    </el-col>
                    <el-col :span="16">
                        <el-button plain class="plainBtn toolBtn" @click.native="searchShowFunc" ><i class="icon el-icon-search" style="margin-right:10px;"></i>&nbsp;高级检索</el-button>
                        <el-button  type="primary" class="toolBtn" style="font-size:14px;" @click.native="multipleAppr" ><i class="icon iconfont iconpiliang" style="margin-right:10px;font-size: 14px;"></i>&nbsp;批量审批</el-button>
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
                        <el-input placeholder="请输入流程名称" @keyup.enter.native="searchListFunc" v-model="baseInfo.searchMsg"></el-input>
                    </div>
                    <span>到达时间：</span>
                    <div style="display:inline-block;">
                        <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.assign_start_time" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
                        -
                        <el-date-picker placeholder="请选择" type="datetime" style="width:176px;" v-model="baseInfo.assign_end_time"  value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" ></el-date-picker>
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

        <eco-content bottom="42px" :top="getContentTop1" ref="content" style="padding:10px 15px;">
            <el-table
                ref="multipleTable"
                :data="dataList"
                tooltip-effect="dark"
                @selection-change="changeFun"
                style="width: 100%;"
                class="flowlist"
                size="mini"
                height="100%"
                stripe
                :default-sort = "{prop: 'assign_date', order: 'descending'}"
                @sort-change="sortTablefunc"
            >
                <el-table-column
                    type="selection"
                    :selectable="selectable"
                    key="10"
                    width="55">
                </el-table-column>

                <el-table-column
                    prop="groupName"
                    label="类别"
                    width='160'
                    show-overflow-tooltip
                    >
                    <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"")}}</template>
                </el-table-column>

                <el-table-column
                    prop="request_desc"
                    label="任务名称"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="pointerClass" style="display:block;" @click="goDetail(scope.row.id,scope.row.defFieldId)">{{ scope.row.requestDesc }} | <i v-if="scope.row.taskName" class="taskName">{{scope.row.taskName}}</i></span>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="status_id"
                    label="状态"
                    width='100'
                    show-overflow-tooltip>
                    <template slot-scope="scope"><span class="circle" v-bind:class="scope.row.statusName == '待办'?'red':'blue'"></span> {{ scope.row.statusName }}</template>
                </el-table-column>

                <el-table-column
                    prop="formUsername"
                    label="来自"
                    width='100'
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.formUsername}}</template>
                </el-table-column>

                <el-table-column
                    prop="assign_date"
                    label="到达时间"
                    sortable='custom'
                    :sort-orders="['ascending', 'descending']"
                    width='180'
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.assignDate}}</template>
                </el-table-column>


                <el-table-column
                    prop="initUserName"
                    label="启动人员"
                    width='100'
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.initUserName}}</template>
                </el-table-column>

                <el-table-column
                    prop="init_date"
                    label="启动时间"
                    sortable='custom'
                    :sort-orders="['ascending', 'descending']"
                    width='180'
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.initDate}}</template>
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


import {getTaskWFModuleAjax,getWFOperateId,getWFGroupsAjax,getWFTemplatesAjax} from '../../service/service.js'
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
                label: '全部'
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

           dataList: [],
           wfGruopLevelMap:{},
           groupsArray: [],
           templdateArray: [],
           multipleSelection: [],
           baseInfo:{
               folder:'0',                      //-1 全部 0 进行中 1 已完成/被拒绝 2 已取消
               page:1,
               rows:30,
               total:0,

               groupTemp:'-1',
               groupId: '-1',
               subGroupId:'-1',

               templateId: '-1',
               searchMsg: '',
               sort:'assign_date',
               order:'desc',
               init_start_time:"",
               init_end_time:"",
               assign_start_time:"",
               assign_end_time:"",
               initValue:"",
               initValueName:""
           },
           searchShow: false,
           initUserStr:""
         }
     },
     computed:{
       getContentTop1:function(){
           if(this.searchShow){
               return '161px';
           }else{
               return '59px';
           }
       }
     },
    created(){
        if(this.$route.query.templateId){
              this.baseInfo.templateId = this.$route.query.templateId;
        }

     },
     mounted(){
           this.getWFToDoFunc();
           this.getWFGroupsFunc();

           this.getWFTemplatesFunc();
           this.listAction();
           window.ecoTodoVm = this;
     },

     methods: {

        listAction(){
                window.tabClickFunc = function(){
                     window.ecoTodoVm.getWFToDoFunc();
                }
                let this_ = this;
                let callBackDialogFunc = function(obj){
                    if(obj && (obj.action == 'batchAppr') ){
                        this_.$message({
                            message: obj.data.msg || '批量审批成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                        window.ecoTodoVm.getWFToDoFunc(true);
                    }

                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfToDo');
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

        getWFToDoFunc(){
           this.$refs.ecoLoadingRef.open();
           getTaskWFModuleAjax(this.baseInfo).then((response)=>{
                this.dataList = response.data.list;
                this.baseInfo.total = response.data.count;
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.$refs.multipleTable.doLayout();
                });
                this.$refs.ecoLoadingRef.close();
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



       searchShowFunc(){
           if(this.searchShow){
               this.searchShow = false;
           }else{
               this.searchShow = true;
           }
       } ,

       searchListFunc(){
             this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = 1;
            this.getWFToDoFunc();
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
          }
          this.$refs.multipleTable.bodyWrapper.scrollTop =0;
          this.getWFToDoFunc();
       },

       //每页条数
        handleSizeChange(val) {
               this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.baseInfo.rows = val;
              this.baseInfo.page = 1;
              this.getWFToDoFunc();
        },

        //跳转页码
        handleCurrentChange(val) {
             this.$refs.multipleTable.bodyWrapper.scrollTop =0;
            this.baseInfo.page = val;
            this.getWFToDoFunc();
        },

        goDetail(wfId,defFieldId){
            getWFOperateId(wfId,defFieldId).then((response)=>{
                    if(response.data.status == 0){
                        let operateId = response.data.operate_id;
                        // AlphaManual
                        if(response.data.remap && response.data.remap.pc_url){
                                let tabObj = {};
                                let goPage = response.data.remap.pc_url;
                                let reg = new RegExp("{{taskId}}", "g");
                                goPage=goPage.replace(reg,response.data.remap.task_id);
                                tabObj.desc = response.data.remap.agent_name;
                                tabObj.tabKey = "documanageAdd";
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'documanageAdd"+response.data.remap.task_id+"',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
                                window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            if(sysEnv == 1){
                                let tabObj = {};
                                let goPage = "flowform/index.html#/wfDetail/"+wfId+"/"+operateId;
                                tabObj.desc = '待办流程';
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                                window.parent.window.sysvm.doTab(tabObj);
                            }else{
                                this.$router.push({name:'wfDetail',params:{taskId:wfId,operateId:operateId}})
                            }
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
            this.baseInfo.assign_start_time = '';
            this.baseInfo.assign_end_time = '';
            this.baseInfo.initValue = '';
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
                this.baseInfo.subGroupId = -1;
            }else{
                this.baseInfo.groupId = value[0];
                this.baseInfo.subGroupId = value[1];
            }

            this.baseInfo.templateId = '-1';
            this.getWFTemplatesFunc();
        },
        selectable(row,index){
            if(row.type_id == 1 || row.approvable == 0 ){
                return false;
            }
            return true;
        },
        multipleAppr(){

            if(this.multipleSelection.length == 0){
                  EcoMessageBox.alert('请先选择要批量审批的流程','提示');
            }else{
                let batchTasksArry = [];
                for(let i = 0;i<this.multipleSelection.length;i++){
                    batchTasksArry.push(this.multipleSelection[i].id);
                }
                let batchTasks = batchTasksArry.join(',');
                  if(sysEnv == 1){
                        let _width = '700';
                        let _height = '450';
                        let url = encodeURI('/flowform/index.html#/multipleApprDialog/'+batchTasks);
                        EcoUtil.getSysvm().openDialog('批量审批',url,_width,_height,'15vh');
                    }else{
                        this.$router.push({name:"multipleApprDialog",params:{batchTasks:batchTasks}})
                    }
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
.relevanceFlowVue .toolBtn{
    float:right;
    margin-right: 30px;
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
      height:105px;
      overflow-y:auto;
  }
  .relevanceFlowVue .circle{
        width: 6px;
        height: 6px;
        position: relative;
        top: -2px;
        border-radius: 50%;
        display: inline-block;
        margin-right:2px;
  }
  .relevanceFlowVue .blue{
      background-color:#409EFF;
  }
  .relevanceFlowVue .red{
      background-color:#F56C6C;
  }
</style>
