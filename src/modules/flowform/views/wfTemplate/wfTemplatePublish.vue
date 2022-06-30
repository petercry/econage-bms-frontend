<template>
    <div class="publish wfTemplatePublish">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <div class="page-header">
             <flowFormStep  :step="3" :title="flowName" @close="closeDialog" @clickStep="clickStep" ref="flowFormStep" :checkSave="save">
                    <span slot="rightDiv">
                         <el-button size="mini" @click="save" style="font-size:14px;"><i class="icon iconfont iconzancun"></i> 暂存</el-button>
                         <el-button size="mini" type="primary" @click="publish" style="font-size:14px;"><i class="icon iconfont iconfabu"></i> 发布</el-button>
                    </span>
            </flowFormStep>
        </div>
        <div class="page-content">

            <div class="content">
                <el-form ref="form" :model="workflow_model" label-width="120px" label-position="left" v-if="!isCustomer">

                    <el-form-item label="流程名称"  prop="name" :rules="[{ required: true, message: '流程名称不能为空'}]">
                        <el-input v-model="workflow_model.name"></el-input>
                    </el-form-item>

                    <el-form-item label="所属分支机构" v-if="branchDeptEnabled" prop="branchDeptId" :rules="[{ required: true, message: '所属分支机构不能为空'}]">
                        <el-select v-model="workflow_model.branchDeptId">
                            <el-option v-for="(item,index) in branchDept" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="允许所有人启动">
                        <el-switch v-model="workflow_model.isPublic" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>

                    <el-form-item label="允许发起人取消">
                        <el-switch v-model="workflow_model.allowInitCancel" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item v-show="workflow_model.allowInitCancel == 1" label="流程取消API">
                        <div v-for="(item,index) in cancelAPIItems" :key="index" style="margin-bottom:10px;">
                            <el-input readonly v-model="item.scName" @click.native="needIngItem=item;selectConnector(item,'cancelApi')" style="width:350px;">

                            </el-input>
                            <div class="delBtn" @click="delCancelApi(index)" style="color:rgb(245, 108, 108)">
                                <i class="iconfont icon iconshanchudelete30"></i>
                            </div>
                        </div>
                        <div>
                            <a class="addBtn" @click="addCancelApi">添加API</a>
                        </div>

                    </el-form-item>
                    <el-form-item label="流程评价">
                        <el-switch v-model="workflow_model.rateDerail" :active-value="'Y'" :inactive-value="'N'"></el-switch>
                    </el-form-item>

                    <el-form-item label="流程撤回">
                        <el-switch v-model="workflow_model.revokeFlag" :active-value="1" :inactive-value="0"></el-switch>
                     </el-form-item>

                     <el-form-item v-if="workflow_model.revokeFlag == 1" label="撤回时限">
                        <div>
                            <label style="color: #606266;margin-right:5px;">流程提交后 </label>
                            <el-input style="display:inline-block;width:100px;" type="num" v-model="workflow_model.rkTimeLimitNum"  :min=0 ></el-input>
                            <el-select v-model="workflow_model.rkTimeLimitType" style="width:100px;">
                                <el-option
                                    :key="index"
                                    v-for="(item,index) in overTimeOp"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                            </el-select>
                        </div>
                    </el-form-item>

                     <el-form-item v-if="workflow_model.revokeFlag == 1" label="下个环节查看后不允许撤回">
                        <el-switch v-model="workflow_model.viewedNoRevoke" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>

                    <el-form-item label="流程模板类别">
                        <el-select v-model="workflow_model.group" clearable placeholder="请选择类别" @change="changeGroup" @clear="clearGroup">
                            <el-option
                              v-for="item in groupKv"
                              :key="item.id"
                              :label="item.text"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="流程模板子类别">
                        <el-select v-model="workflow_model.subGroup" clearable placeholder="请选择子类别">
                            <el-option
                                v-for="item in groupKVChild"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="系统预留标示">
                        <el-switch v-model="workflow_model.sysReserveFlag" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>

                    <!-- <el-form-item label="关联知识">
                        <el-switch v-model="workflow_model.rateDerail" :active-value="'Y'" :inactive-value="'N'"></el-switch>
                    </el-form-item>
                    <el-form-item label="关联项目">
                        <el-switch v-model="workflow_model.rateDerail" :active-value="'Y'" :inactive-value="'N'"></el-switch>
                    </el-form-item>
                    <el-form-item label="关联客户">
                        <el-switch v-model="workflow_model.rateDerail" :active-value="'Y'" :inactive-value="'N'"></el-switch>
                    </el-form-item> -->


                    <el-form-item label="自定义标志">
                        <el-input v-model="workflow_model.defFieldId"></el-input>
                    </el-form-item>
                    <el-form-item label="编码">
                        <el-input v-model="workflow_model.code"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="workflow_model.comments"></el-input>
                    </el-form-item>

                    <el-form-item label="图标">
                            <el-input class="pointerClass" v-model="workflow_model.iconCard" readonly @click.native="iconChoose" v-if="workflow_model.iconCard == null || workflow_model.iconCard == ''"></el-input>
                            <span v-else><i class="icon iconfont pointerClass" v-bind:class=[workflow_model.iconCard] @click="iconChoose"></i> <i @click="deleteIconCard" class="delIcon">删除</i></span>
                    </el-form-item>
                </el-form>

                <el-form ref="form" :model="workflow_model" label-width="120px" label-position="left" v-if="isCustomer" disabled>

                    <el-form-item label="流程名称" prop="name" :rules="[{ required: true, message: '流程名称不能为空'}]">
                        <el-input v-model="workflow_model.name"></el-input>
                    </el-form-item>

                     <el-form-item label="流程模板类别">
                        <el-select v-model="workflow_model.group" clearable placeholder="请选择类别" @change="changeGroup" @clear="clearGroup">
                            <el-option
                              v-for="item in groupKv"
                              :key="item.id"
                              :label="item.text"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="流程模板子类别">
                        <el-select v-model="workflow_model.subGroup" clearable placeholder="请选择子类别">
                            <el-option
                                v-for="item in groupKVChild"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="自定义标志">
                        <el-input v-model="workflow_model.defFieldId"></el-input>
                    </el-form-item>
                 </el-form>


            </div>
        </div>
    </div>
</template>
<script>
import flowFormStep from "../../views/components/flowFormStep.vue";
import {Loading } from 'element-ui';
import {sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {getApplyUpdateWFModel,updateWFModel,publishWFModel,getBranchOrg} from '../../service/service.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {mapState,mapMutations} from 'vuex'
export default{
  data(){
    return {
       workflow_model:{},
       operate_id:"",
       groupKv:[],
       groupKVChild:[],
       groupKVChildObj:{},
       flowName:"",
       overTimeOp:[
           {
             name:"天",
             value:1,
           },
           {
             name:"小时",
             value:2,
           },
           {
             name:"分钟",
             value:3,
           }
         ],
         roleObj:{},
         branchDeptEnabled:false,
         branchDept:[],
         cancelAPIItems:[],
         needIngItem:{}
    }
  },
  components: {
        ecoLoading,
        flowFormStep
  },
  created(){
       window.wfTemplatePublishVm = this;
      this.listAction();
  },
  beforeDestroy() {

  },

  mounted(){
        try {
            this.roleObj = EcoUtil.getSysvm().getEcoSettingObj() || {};
        } catch (error) {
            this.roleObj = {};
        }
        this.getApplyUpdateWFModelFunc();
  },

  computed:{
    isCustomer(){
      return !this.roleObj.sysAdmin && this.roleObj.branchDeptEnabled;
    }
  },
  methods: {

          listAction(){
                let callBackDialogFunc = function(obj){
                    if(obj && obj.action == 'iconChooseCallBack'){
                        window.wfTemplatePublishVm.iconChooseCallBack(obj.data);
                    }
                    if(obj && obj.action == 'cancelApiSetting' ){

                        window.wfTemplatePublishVm.needIngItem.scName = obj.data.name;
                        window.wfTemplatePublishVm.needIngItem.scId = obj.data.scId;

                    }
                }

                EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'wfTemplatePublish');
          },

        getApplyUpdateWFModelFunc(){
            this.$refs.ecoLoadingRef.open();
            getApplyUpdateWFModel(this.$route.params.templateId).then((response) => {
                    this.$refs.ecoLoadingRef.close();
                    if(response.data.status <100){
                        this.operate_id = response.data.operate_id;
                        this.workflow_model = response.data.remap.workflow_model;
                        this.flowName = response.data.remap.workflow_model.name;

                        (response.data.remap.group_kv).forEach(element => {
                                this.groupKv.push(element.body);
                                this.groupKVChildObj[element.body.id+''] = element.child;
                        });

                        this.workflow_model.subGroup = this.workflow_model.subGroup?this.workflow_model.subGroup:"";
                        if( this.groupKVChildObj[this.workflow_model.group+'']){
                                this.groupKVChild = this.groupKVChildObj[this.workflow_model.group+''];
                        }else{
                                this.groupKVChild = [];
                        }
                        if(response.data.remap.hasOwnProperty('wf_scene') && response.data.remap.wf_scene ){
                            let wf_scene_map = response.data.remap.wf_scene;
                            for(let key in wf_scene_map){
                                let obj = wf_scene_map[key];
                                this.cancelAPIItems.push(obj);
                            }
                        }
                    }
                    this.getBranchOrg();

            }).catch((error) => {
                this.$refs.ecoLoadingRef.close();
            });
        },
        getBranchOrg(){
            getBranchOrg().then((response) => {
                this.branchDeptEnabled = response.data.branchDeptEnabled;
                this.branchDept = response.data.departments;
                if(this.branchDeptEnabled && (this.workflow_model.branchDeptId == -100 || this.workflow_model.branchDeptId == -1)){
                    this.workflow_model.branchDeptId = null;
                }
            }).catch((error) => {

            });
         },
        changeGroup(){
            this.workflow_model.subGroup = null;
            if( this.groupKVChildObj[this.workflow_model.group+'']){
                    this.groupKVChild = this.groupKVChildObj[this.workflow_model.group+''];
            }else{
                    this.groupKVChild = [];
            }
        },

        closeDialog(){
            let _closeObj = {};
            _closeObj.clearIframe = true;
            _closeObj.tabClick = true;
            EcoUtil.getSysvm().closeFullScreen(_closeObj);
        },

        clearGroup(){
            this.workflow_model.subGroup = null;
            this.workflow_model.group = null;
        },


        save(){
                if(sysEnv == 1){
                        EcoUtil.getSysvm().showLoadingDiv('保存中....');
                }
                this.workflow_model.operate_id = this.operate_id;
                if(this.workflow_model.allowInitCancel == 1){
                    this.workflow_model.cancelScene = this.cancelAPIItems.map(item => {
                        return item.scId;
                    }).join(',');
                }
                updateWFModel(this.workflow_model).then((response) => {
                            this.hideLoadingDiv();
                            if(response.data.status <100){
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true,
                                        duration:2000,
                                        customClass:'design-from-el-message'
                                    });
                            }
                }).catch((error) => {
                        this.hideLoadingDiv();
                });
        },

        publish(){
            this.workflow_model.operate_id = this.operate_id;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(sysEnv == 1){
                        EcoUtil.getSysvm().showLoadingDiv('保存中....');
                    }
                    if(this.workflow_model.allowInitCancel == 1){
                        this.workflow_model.cancelScene = this.cancelAPIItems.map(item => {
                            return item.scId;
                        }).join(',');
                    }
                    updateWFModel(this.workflow_model).then((response) => {
                            let that = this;
                            if(response.data.status <100){
                                publishWFModel(this.operate_id).then((response) => {
                                    this.hideLoadingDiv();
                                    if(response.data.status <100){
                                        this.$message({
                                            message: '发布成功',
                                            type: 'success',
                                            showClose: true,
                                            duration:2000,
                                            customClass:'design-from-el-message',
                                            onClose:function(){
                                                that.closeDialog();
                                            }
                                        });
                                    }
                                }).catch((error) => {
                                        this.hideLoadingDiv();
                                });
                            }else{
                                this.hideLoadingDiv();
                            }

                    }).catch((error) => { });
                }else{
                    return false;
                }
            });

        },

        clickStep(data){
            this.$refs.flowFormStep.goNextStep(data.nextStep);
        },

            hideLoadingDiv(){
                    if(sysEnv == 1){
                            EcoUtil.getSysvm().hideLoadingDiv();
                    }
            },


          iconChoose(){

                let url = '/flowform/index.html#/iconChoose';
                EcoUtil.getSysvm().openDialog('选择图标',url,700,550,'8vh');
          },

          iconChooseCallBack(data){
              this.workflow_model.iconCard = data;
          },

          deleteIconCard(){
              this.workflow_model.iconCard = null;
          },
            addCancelApi(){
                let obj = {
                    scName:"",
                    scId:""
                }
                this.cancelAPIItems.push(obj);
            },
            delCancelApi(index){
                this.cancelAPIItems.splice(index,1);
            },
            selectConnector({scId,refId} = {},flag){
                if(scId){
                    let _url = 'flowform/index.html#/cancelApiSetting/'+this.operate_id+'/'+refId+'/'+scId;
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
                }else{
                    let _url = 'flowform/index.html#/selectConnector/'+this.operate_id+'/0/0/'+flag;
                    let _height = parent.window.document.getElementById("aside").offsetHeight-180;
                    EcoUtil.getSysvm().openDialog('选择执行器',_url,'800',_height,'50px');
                }

            },



  },
  watch: {

  }
}
</script>
<style scoped>

.wfTemplatePublish .delIcon{
    font-size: 12px;
    cursor: pointer;
    color:tomato;
    margin-left:10px;
}


  .page-header{
      position: absolute;
      left:0;
      right:0;
      top:0;
      height:55px;
      vertical-align: middle;
      background-color: #fff;
  }

.page-content{
    position: absolute;
    left:0px;
    top:65px;
    bottom:0px;
    right:0px;
    background-color: #f5f5f5;
    overflow:auto;
}

.page-content .content{
    padding: 40px 40px;
    background-color: #ffffff;
    width: 520px;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
    position: relative;
  }
  .flowSave{
    position: absolute;
    top: 15px;
    right: 30px;
  }
  .addBtn{
    width: 100%;
    display: inline-block;
    text-align: center;
    border: 1px dashed #409EFF;
    color: #1ba5fa;
    cursor: pointer;
    border-radius: 5px;
  }

  .delBtn{
    height: 30px;
    line-height: 30px;
    display: inline-block;
    background: #fff;
    border-radius: 4px;
    width: 26px;
    text-align: center;
    border: 1px solid #DCDFE6;
    color: #1ba5fa;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    position: relative;
    top: 1px;
    cursor: pointer;
}
</style>
