<template>
  <eco-content top="0px" bottom="0px" type="tool" style="background-color:#f5f5f5;" class="webLayout">
        <div class="wfTemplateList wfEco">
            <ecoLoading ref='ecoLoadingRef' text='加载中...' ></ecoLoading>
            <eco-content top="0px" height="60px" type="tool">
                <el-row style="padding:12px 10px;background-color:#fff;border-bottom:1px solid #ddd;">
                    <el-col :span="6">
                        <eco-tool-title style="line-height: 34px;" :title="'流程模板 ('+baseInfo.total+')'"></eco-tool-title>
                    </el-col>
                    <el-col :span="18" style="text-align:right;padding-right:10px;">
                            <el-select v-model="baseInfo.validFlag" placeholder="请选择" style="width:100px;margin-right:10px" @change="changeValid">
                                <el-option
                                    v-for="item in validFlagOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            
                            <el-cascader
                                v-model="baseInfo.groupTemp"
                                :options="groupsArray"
                                ref="groupCascader"
                                @change="handleGroupChange"
                                :props="{ disabled:'disabled1', label:'name',leaf:'1',value:'id',children:'child'}"
                                clearable
                            >
                                <template slot-scope="{ node, data }">
                                    <span v-if="data.name">{{ data.name }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.child.length }}) </span>
                                </template>
                            </el-cascader> 
                            <el-input
                                placeholder="搜索模板名称"
                                v-model="searchInfo.schName"
                                style="width:200px;margin-right:10px" 
                                @keyup.enter.native="searchFunc"
                                >
                                <i slot="suffix" @click="searchFunc" style="cursor:pointer;" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-button plain  style="border-color: #409EFF;color:#409EFF" v-if="isAdmin || btnRoleMap['bpm95-designworkflow_TEMPLATE_INOUT']" class="addWFModule" @click="importTemplate"><i class="icon iconfont icondaoru"></i>导入流程模板</el-button>
                            <el-button type="primary" class="addWFModule" v-if="isAdmin || btnRoleMap['bpm95-designworkflow_CREATE_TEMP']" @click="addTemplate"><i class="icon iconfont iconxinjianwenjian"></i>新建流程模板</el-button>
                    </el-col>
                </el-row>
            </eco-content>

            <eco-content bottom="42px" top="59px" ref="content" class="ecoContentClass"  style="padding:15px;">
                <el-table
                ref="multipleTable"
                    :data="dataList"
                    stripe
                    class="flowlist"
                    style="width: 100%"
                    size="mini" 
                    height="100%"
                    :default-sort = "{prop: 'create_date_', order: 'descending'}"
                    @sort-change="sortTablefunc"
                >

                    <el-table-column 
                        class="font"
                        label="流程模板名称"
                        show-overflow-tooltip
                        prop="request_desc"
                    >
                    <template slot-scope="scope">
                        <span class="pointerClass" >{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                    label="类别"
                    width="130"
                    prop="groupName"
                    show-overflow-tooltip
                    >
                     <template slot-scope="scope">{{scope.row.groupName + (scope.row.subGroupName? "-" + scope.row.subGroupName :"")}}</template>
                </el-table-column>
                 <el-table-column
                    label="所属分支机构"
                    width="130"
                    key="8"
                    v-if="roleObj.branchDeptEnabled"
                    prop="deptName"
                    show-overflow-tooltip
                    >
                     <template slot-scope="scope">{{scope.row.branchDeptId == -1 || scope.row.branchDeptId == -100? "无" :scope.row.branchDeptName}}</template>
                </el-table-column>

                <el-table-column
                        label="当前版本"
                        width="150"
                    >
                    <template slot-scope="scope" >
                        <div v-if="scope.row.serialVersion>0">
                                <span class="circle green"></span>
                                已发布V{{scope.row.serialVersion}}.0
                                <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content">发布人：{{scope.row.pbUser}}<br/>发布日期：{{scope.row.pbDate}}</div>
                                <i class="iconfont icon iconbangzhu-kong"></i> 
                                </el-tooltip>

                        </div>
                        <div v-if="scope.row.serialVersion==0">
                                <span class="circle red"></span>
                                设计中
                        </div>
                        </template>
                </el-table-column>

                <el-table-column
                        label="创建人"
                        width="80"
                    >
                        <template slot-scope="scope" ><span>{{scope.row.createUserName}}</span></template>
                </el-table-column>

                <el-table-column
                        label="创建时间"
                        width="170"
                        :sort-orders="['ascending', 'descending']"
                        sortable="custom"
                        prop="create_date_"
                    >
                    <template slot-scope="scope" ><span>{{scope.row.createDate?scope.row.createDate.substr(0,16):''}}</span></template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="220"
                    >
                    <template slot-scope="scope" >
                        <div v-show="baseInfo.validFlag == 0">
                            <span @click="editForm(scope.row.formId,scope.row.wfTempId)" class="pointerClass" style="color:#409EFF;">设计</span> 
                            <span class="split"></span>
                            
                            <div style="display:inline" v-if="isAdmin || btnRoleMap['bpm95-designworkflow_UPDATE_TEMP']">
                                <span class="pointerClass"  @click="showQuanXian(scope.row.wfTempId)" style="color:#409EFF;">权限</span>  
                                <span class="split"></span>
                            </div>
                            
                            <span @click="startWF(scope.row)" class="pointerClass" style="color:#409EFF;">启动</span> 
                            
                            <div style="display:inline" v-if="isAdmin || btnRoleMap['bpm95-designworkflow_DELETE_TEMP'] || btnRoleMap['bpm95-designworkflow_COPY_TEMP']">
                                <span class="split"></span>
                                <el-dropdown trigger="click">
                                    <span class="el-dropdown-link pointerClass" style="color:#409EFF;display:inline-block;">
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-if="isAdmin || btnRoleMap['bpm95-designworkflow_DELETE_TEMP']" @click.native="deleteTemplate(scope.row.wfTempId)">
                                            <span style="color:#F56C6C;" >删除</span>
                                        </el-dropdown-item>
                                    
                                        <el-dropdown-item  v-if="isAdmin || btnRoleMap['bpm95-designworkflow_COPY_TEMP']" @click.native="copyTemplate(scope.row.wfTempId,scope.row.name)">
                                            <span>复制</span>
                                        </el-dropdown-item>

                                        <el-dropdown-item  v-if="isAdmin || btnRoleMap['bpm95-designworkflow_TEMPLATE_INOUT']" @click.native="exportTemplate(scope.row.wfTempId,scope.row.name)">
                                            <span>导出</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>

                        </div>
                        <div v-show="baseInfo.validFlag == 2">
                            <span @click="recoverTemplate(scope.row.wfTempId)" class="pointerClass" style="color:#409EFF;">恢复</span> 
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
        
            </eco-content>

        <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
            <el-row>
                <el-col :span="24" class="top-bottom" style="text-align:right;">
                        <div >
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page"
                            :page-sizes="[10,30,50,100]"
                            :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="baseInfo.total">
                        </el-pagination>
                        </div>
                </el-col>
                </el-row>
            </eco-content>
        </div>
  </eco-content>
</template>
<script>

  import {initWFAjax,getWFModelListAjax,deleteWFTemplateSingle,recoverWFTemplateSingle,getWFGroupsAjax,getRoleBtnSetting,exportWFTemplateSingle} from '../../service/service'
  import {rows,sysEnv} from '../../config/env.js'

  import {Loading} from 'element-ui';
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import {EcoMessageBox} from '@/components/messageBox/main.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {EcoFile} from '@/components/file/main.js'

  export default {
      components:{
          ecoContent,
          ecoToolTitle,
          ecoLoading
      },
      data(){
          return{
              baseInfo:{
                  validFlag:0,
                  page:1,
                  rows:rows,
                  sort:['create_date_'],
                  order:['desc'],
                  schName:null,
                  total:0,
                  groupTemp:'-1',
                  groupId: '-1',
              },
              searchInfo:{
                    schName:null,
              },
              dataList:[],
             
              validFlagOptions:[],
              showImportTemplate:true,

              wfGruopLevelMap:{},
              groupsArray: [],
              btnRoleMap:{},
              isAdmin:false,
              roleObj:{
                  branchDeptEnabled:false
              }
          }
      },

      created(){
            try {
                this.roleObj = EcoUtil.getSysvm().getEcoSettingObj() || {};
            } catch (error) {
                this.roleObj = {
                    branchDeptEnabled:false
                };
            }
         
            this.validFlagOptions.push({value:0,label:'使用中'});
            this.validFlagOptions.push({value:2,label:'已失效'});
      },
      mounted(){
           this.getWFGroupsFunc();
           this.getWFModelListFunc();
           this.getRoleBtnSetting();
           this.listAction();
           window.ecoTemplateListVm = this;
      },
      computed:{
            getOpWidth:function(){
                let _width = 110;
                if(this.isAdmin || this.btnRoleMap['bpm95-designworkflow_UPDATE_TEMP']){
                    _width += 50;
                }
                if(this.isAdmin || this.btnRoleMap['bpm95-designworkflow_DELETE_TEMP'] || this.btnRoleMap['bpm95-designworkflow_COPY_TEMP']){
                    _width += 60;
                }
                return _width;
            }
        
      },
      methods: {
          listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'addWFTempAddBack'){
                          window.ecoTemplateListVm.addWFTempAddBack(obj.data);
                    }
                    if(obj && obj.action == 'copyTemplate'){
                          window.ecoTemplateListVm.getWFModelListFunc();
                    }
                     if(obj && obj.action == 'templateExportSuccess'){
                          window.ecoTemplateListVm.getWFModelListFunc();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfTemplateList');
                window.tabClickFunc = function(){
                     window.ecoTemplateListVm.getWFModelListFunc();
                }
          },
          getRoleBtnSetting(){
              const btn_array = ['bpm95-designworkflow_CREATE_TEMP',
              'bpm95-designworkflow_DELETE_TEMP',
              'bpm95-designworkflow_COPY_TEMP',
              'bpm95-designworkflow_UPDATE_TEMP',
              'bpm95-designworkflow_TEMPLATE_INOUT'
              ];
              getRoleBtnSetting(btn_array).then((res)=>{
                 if(res.data){
                     this.isAdmin = res.data.admin || this.roleObj.sysAdmin;
                     this.btnRoleMap = res.data.authenticationMap;
                 }
              })
          },
          addWFTempAddBack(data){
                /*刷新列表页面*/
                this.getWFModelListFunc();
                /*跳转到设计页面*/
                if(data.remap){
                    this.editForm(data.remap.form_id,data.remap.wftemp_id);
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

          getWFModelListFunc(){
                this.$refs.ecoLoadingRef.open();
                getWFModelListAjax(this.baseInfo).then((response)=>{
                      if(response.data.status <= 99){
                            this.dataList = response.data.remap.list.list;
                            this.baseInfo.total = response.data.remap.list.total;
                      }
                       this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.$refs.multipleTable.doLayout();
                        });
                      this.$refs.ecoLoadingRef.close();
                }).catch((error)=>{
                      this.$refs.ecoLoadingRef.close();
                });
          },

         sortTablefunc(column,prop,order){
              if(column.prop && column.order){
                  this.baseInfo.sort = [column.prop];
                  if(column.order == 'ascending'){
                      this.baseInfo.order =  ['asc'];
                  }else if(column.order == 'descending'){
                      this.baseInfo.order =  ['desc'];
                  }
              }else{
                  this.baseInfo.sortCol  = [];
              }

              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.getWFModelListFunc();
         },

          // 分页
          handleSizeChange(val) {
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.baseInfo.rows = val;
              this.baseInfo.page = 1;
              this.getWFModelListFunc();
          },
          
          handleCurrentChange(val) {
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.baseInfo.page = val;
              this.getWFModelListFunc();
          },
          changeValid(){
               this.$refs.multipleTable.bodyWrapper.scrollTop =0;
               this.baseInfo.page = 1;
               this.getWFModelListFunc();
          },
          searchFunc(){
              this.baseInfo.page = 1;
              this.baseInfo.schName = this.searchInfo.schName;
              this.$refs.multipleTable.bodyWrapper.scrollTop =0;
              this.getWFModelListFunc();
          },

          addTemplate(){
                if(sysEnv == 1){
                    let url = '/flowform/index.html#/wfTemplateAdd';
                    EcoUtil.getSysvm().openDialog('创建流程模板',url,600,500,'8vh');
                }else{
                    this.$router.push({name:'wfTemplateAdd'})
                }
          },

          editForm(formId,wfTempId){
                if(sysEnv == 1){
                    let tabObj = {};
                    let goPage = null;
                    if(this.roleObj && this.roleObj.branchDeptEnabled && !this.roleObj.sysAdmin){
                        tabObj.desc = '流向设计';
                        goPage =  "flowform/index.html#/flowDirection/"+formId+"/"+wfTempId;
                    }else{
                        tabObj.desc = '表单设计';
                        goPage =  "flowform/index.html#/formDesign/"+formId+"/"+wfTempId;
                    }
                    tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'formDesign"+formId+"',href_link:'"+goPage+"' ,fullScreen:true}";
                    window.parent.window.sysvm.doTab(tabObj);
                }else{
                    this.$router.push({name:'formDesign',params:{formId:formId,templateId:wfTempId}})
                }
          },

          startWF(row){
               
                let loadingInstance = Loading.service({ fullscreen: true,text:"启动中...."});
                initWFAjax(row.wfTempId).then((response)=>{
                    this.$nextTick(() => { 
                        loadingInstance.close();
                    })
                    if(response.data.status == 0){
                        if(sysEnv ==1){
                            let tabObj = {};
                            let goPage = 'flowform/index.html#/wfDetail/'+response.data.remap.task_id+'/'+response.data.operate_id;
                            tabObj.desc = row.name;
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+response.data.operate_id+"',href_link:'"+goPage+"',fullScreen:true}";
                            window.parent.window.sysvm.doTab(tabObj);
                        }else{
                            this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                        }
                    }
                })
          },
          deleteTemplate(temp_id){
               this.$confirm('是否确认删除此模板', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                    deleteWFTemplateSingle(temp_id).then((response)=>{
                        if(response.data.status < 100){
                            this.getWFModelListFunc();
                        }
                    })
              }).catch(() => {

              });
             
          },
          recoverTemplate(temp_id){
                recoverWFTemplateSingle(temp_id).then((response)=>{
                    if(response.data.status < 100){
                        this.getWFModelListFunc();
                    }
                })
          },
          showQuanXian(temp_id){
                let _width = '676';
                let _height = '350';
                let url = '/flowform/index.html#/flowStartQuanXian/'+temp_id;
                EcoUtil.getSysvm().openDialog('权限设置',url,_width,_height,'15vh');
          },
          copyTemplate(temp_id,name){
                let _width = '500';
                let _height = '250';
                let url = '/flowform/index.html#/copyTemplateDialog/'+temp_id+'/'+encodeURIComponent(name);
                EcoUtil.getSysvm().openDialog('流程模板复制',url,_width,_height,'15vh');
          },
          importTemplate(){
                let _width = '550';
                let _height = '400';
                let url = encodeURI('/flowform/index.html#/importTemplateDialog');
                EcoUtil.getSysvm().openDialog('导入流程模板',url,_width,_height,'15vh');
          },

          exportTemplate(wfTempId,name){
                let _data = {};
                _data.wfTempId = wfTempId;
                exportWFTemplateSingle(_data).then((response)=>{
                    var blob = new Blob([response.data], { type: 'application/octet-stream' });
                    EcoFile.downloadFile(blob,name+".xml");
                })
          },

           handleGroupChange(value){
                this.baseInfo.groupId = value.join(',');
                this.searchFunc();
          },
      },
      destroyed(){
          delete window.ecoTemplateListVm;
      }

  }

</script>

<style>
.body{
    background:#f5f5f5;
}
</style>
<style scoped>
.wfTemplateList{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
}
.wfTemplateList .title{
  color:#262626;
  font-size: 14px;
  line-height: 28px;
  height:28px;
}

.wfTemplateList .addWFModule i{
  margin-right:5px;
  font-size: 12px;
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
     
</style>
