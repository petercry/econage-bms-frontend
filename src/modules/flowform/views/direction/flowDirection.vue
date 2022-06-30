<template>
    <div class="direction">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>

        <div class="page-header">
           <flowFormStep  :step="1" :title="flowName" @close="closeDialog" :checkSave="flowSave">
                    <span slot="rightDiv">
                         <el-button size="medium" type="primary" @click="flowSave(true)">保存</el-button>
                    </span>
            </flowFormStep>
        </div>

        <div class="page-content">
            <!-- <iframe ref="directionClient" class="directionClient" v-bind:src="'../../assets/directionClient/index.html'"></iframe> -->
             <iframe ref="directionClient" class="directionClient" :src="getIframeSrc"></iframe>
             <!-- <v-direction :dialogVisible.sync="dialogVisible"></v-direction> -->
        </div>


         <el-dialog
            :visible="dialogVisible"
            :show-close="false"
            width="50%"
            top="0"
            @close="hideDialog()"
            class="attrDialog"
            >
           <component ref="directionattr" @saveLoading="saveLoading" @closeSaveLoading="closeSaveLoading" :is="comName" :taskId="taskId" :roleObj="roleObj" :dialogVisible.sync="dialogVisible" @hideDialog="hideDialog"></component>
        </el-dialog>

    </div>
</template>

<script>

import startDirection from './module/startDirectionAttr.vue'
import workDirection from './module/workDirectionAttr.vue'
import conditionDirection from './module/conditionDirectionAttr.vue'
import subprocessDirection from './module/subprocessDirectionAttr.vue'
import alphaBotDirection from './module/alphaBotDirectionAttr.vue'
import ccDirection from './module/ccDirectionAttr.vue'
import alphaManualDirection from './module/alphaManualDirectionAttr.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {EcoUtil} from '@/components/util/main.js'
import flowFormStep from "../../views/components/flowFormStep.vue";
import {getTemplateOperateId,updateTopoXml,loadTopoXml,getApplyTaskModel} from '../../service/service.js'
import {sysEnv} from '../../config/env.js'
import { Loading } from 'element-ui';
import {mapState,mapMutations} from 'vuex'
export default{
  name:'flowDirection',
  data(){
    return {
       receiveData:{},
       dialogVisible:false,
       _window:{},
       comName:"",
       taskId:0,
       flowName:"",
       flowOperateId:"",
       loadingInstance:{},
       _target:{},
       isCheckSave:true,
       roleObj:{}
    }
  },
  components: {
    startDirection,
    workDirection,
    conditionDirection,
    subprocessDirection,
    alphaBotDirection,
    ccDirection,
    ecoLoading,
    flowFormStep,
    alphaManualDirection
  },
  created(){
      this.getTemplateOperateIdFunc();
      // window.addEventListener('message',this.showDialog);
  },
  beforeDestroy() {
      //流程图修改过

      // window.removeEventListener('message',this.showDialog);
  },
  mounted(){
    try {
        console.log(EcoUtil.getSysvm().getEcoSettingObj());
        this.roleObj = EcoUtil.getSysvm().getEcoSettingObj() || {};
    } catch (error) {
        this.roleObj = {};
    }
    this.initIframe();
    this.listAction();
    window.flowDirection = this;

    // this.branchOrg = obj.branchOrg;
    // this.sysAdmin = obj.branchOrg;

  },
  computed:{
        getIframeSrc(){
            if(sysEnv == 0){
                return '/static/directionClient/index.html';
            }else{
                if(window.sysSetting && window.sysSetting.ngrootUrl){
                    return window.sysSetting.ngrootUrl + '/assets/directionClient/index.html';
                }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
                    return window.parent.sysSetting.ngrootUrl + '/assets/directionClient/index.html';
                }else{
                    return '/assets/directionClient/index.html'
                }
            }
        },
  },
  methods: {
     ...mapMutations([
        'SET_DIRECTION_DATA',
        'SET_OPERATE_ID'
    ]),
     listAction(){
        let this_ = this;
        let callBackDialogFunc = function(obj){

            if(obj && obj.action == 'flowDirection' ){
                this_.$message({
                    message: '排序保存成功',
                    showClose: true,
                    duration:2000,
                    customClass:'design-from-el-message',
                    type: 'success'
                });
            }

        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'flowDirection');
    },


    async initIframe(){
       this.$refs.ecoLoadingRef.open();

       this._window = this.$refs.directionClient.contentWindow;
       this._window.onLoading = this.$refs.ecoLoadingRef.open;
       this._window.onClose = this.close_;
       this._window.showDialog = this.showDialog;
       this._window.readonlyXml = false;//只读
       this._window.reqId = this.$route.params.templateId;
       this._window.formId = this.$route.params.formId;
       this._window.showError = this.showError;
       this._window.isCustomer = !this.roleObj.sysAdmin && this.roleObj.branchDeptEnabled;
       this._window.showFlowDirectionSort = this.showFlowDirectionSort;
       this._window.ecoToken = sessionStorage.getItem('ecoToken');
    },

    getTemplateOperateIdFunc(){
        getTemplateOperateId(this.$route.params.templateId).then((response) => {
            if(response.data.status <100){
                this.flowOperateId = response.data.operate_id;
                this.flowName = response.data.remap.workflow_model.name;
            }
        }).catch((error) => {
             this.dialogVisible = false;
        });
    },

    goBack(){
        history.go(-1);
    },

    close_(){
        this.$refs.ecoLoadingRef.close();
        this.loading = false;
    },

    showError(msg){
        this.$message({
            showClose: true,
            duration:2000,
            message: msg,
            customClass:'design-from-el-message',
            type: 'warning'
        });
    },
    hideDialog(){
        if(this.$refs.directionattr.isEdit){
            this.$confirm('有未保存内容，是否离开？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                  this.dialogVisible = false;
                  this.$refs.directionattr.isEdit = false;
                  this.comName = "";
              }).catch(() => {

              });
        }else{
            this.dialogVisible = false;
            this.comName = "";
        }

    },
    showDialog(type,target){
          this.isCheckSave = false;
         this._target = target;
         if(typeof type== "string" && type.indexOf('image')>-1){

            this.getApplyTaskModelFunc(type,target.taskId);
            this.taskId = target.taskId;

         }else{
            this.dialogVisible = false;
            return;
        }

    },
    getApplyTaskModelFunc(type,taskId){
       let data = {
         operate_id:this.flowOperateId,
         task_id:taskId
       }
       this.$refs.ecoLoadingRef.open();
       getApplyTaskModel(data).then((response) => {
            this.close_();
            if(response.data.status <100){
                this.SET_OPERATE_ID(response.data.operate_id);//更新操作id
                let remap = response.data.remap;

                this.SET_DIRECTION_DATA(remap);
                this.dialogVisible = true;
                if(type.indexOf('start') > -1){
                    this.comName = "startDirection";
                }else if(type.indexOf('work') > -1){
                    this.comName = "workDirection";
                }else if(type.indexOf('condition') > -1){
                    this.comName = "conditionDirection";
                }else if(type.indexOf('subprocess') > -1){
                    this.comName = "subprocessDirection";
                }else if(type.indexOf('afbot') > -1 || type.indexOf('abt') > -1){
                    this.comName = "alphaBotDirection";
                }else if(type.indexOf('cc') > -1){
                    //this.comName = 'alphaManualDirection';
                    this.comName = "ccDirection";
                }else if(type.indexOf('alphaManual') > -1){
                    this.comName = "alphaManualDirection";
                }else{
                    this.dialogVisible = false;
                    this.$message({
                        showClose: true,
                        duration:2000,
                        message: '未知错误',
                        customClass:'design-from-el-message',
                        type: 'warning'
                    });
                }

            }
        }).catch((error) => {
                this.close_();
                this.$message({
                  showClose: true,
                  duration:2000,
                  message: '网络错误',
                  customClass:'design-from-el-message',
                  type: 'warning'
              });
             this.dialogVisible = false;
        });
    },
    saveLoading(){
         this.loadingInstance = Loading.service({ fullscreen: true,text:"保存中...."});
    },
    closeSaveLoading(taskName,style){
         this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                this.loadingInstance.close();
                if(taskName){
                    this._window.editorUi.editor.graph.getModel().setValue(this._target, taskName);//更新环节名称
                }
                if(style){
                     this._window.editorUi.editor.graph.getModel().setStyle(this._target, style);//更新环节名称
                }
          });
    },
    flowSave(flag) {
        //在切换标签时候，偶尔会出现保存失败报错，发现是DOMParser 不是一个构造器，
        //猜测是切换过去的时候，可能有时间差导致流程图已被清除，所以找不到该方法。
        //解决思路，在切换标签时候，去掉载入流程图。
        this.saveLoading();
        this._window.editorUi.editor.graph.stopEditing();//停止编辑状态
        const _root = this._window.editorUi.editor.graph.getModel().getRoot();
        if (_root.children == null || _root.children == undefined) return;
        const _children = _root.children[0].children;
        if (_children == null || _children == undefined) {
          return;
        }
        _children.map((val, index) => {
          if (!val.edge && val.topoId !== undefined) {
            val.id = val.topoId;
          }
        });

        const xml_str = this._window.mxUtils.getPrettyXml(this._window.editorUi.editor.getGraphXml());
        let data = {
            reqId:this.$route.params.templateId,
            xmlStr:xml_str
        }
        updateTopoXml(data).then((response) => {
            if(response.data.status <100){
                if(flag){
                    this.loadTopoXmlFunc();
                }else{
                    this.closeSaveLoading();
                    this.$message({
                        message: '保存成功',
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message',
                        type: 'success'
                    });
                }


             }else{
               this.closeSaveLoading();
                this.$message({
                    showClose: true,
                    duration:2000,
                    message: response.data.msg,
                    customClass:'design-from-el-message',
                    type: 'warning'
                });
              }

        }).catch((error) => {
            console.log(error)
             this.closeSaveLoading();
              this.$message({
                  showClose: true,
                  duration:2000,
                  message: '保存失败',
                  customClass:'design-from-el-message',
                  type: 'warning'
              });
        });
      },
      loadTopoXmlFunc(){
          loadTopoXml(this.$route.params.templateId).then((response) => {
              this.closeSaveLoading();
              if(response.data.status <100){
                    this.$message({
                        message: '保存成功',
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message',
                        type: 'success'
                    });
                    if(this._window && this._window.editorUi){
                        this._window.editorUi.editor.setGraphXml(this._window.mxUtils.parseXml(response.data.remap.xml_str).documentElement);
                        this._window.editorUi.editor.setModified(false);
                        this._window.editorUi.refresh();
                    }


             }else{
                this.$message({
                    showClose: true,
                    duration:2000,
                    message: response.data.msg,
                    customClass:'design-from-el-message',
                    type: 'warning'
                });
              }

        }).catch((error) => {
            console.log(error)
             this.closeSaveLoading();
            this.$message({
                message: '保存失败',
                showClose: true,
                duration:2000,
                customClass:'design-from-el-message',
                type: 'warning'
            });
        });
      },
        closeDialog(){
            let _closeObj = {};
            _closeObj.clearIframe = true;
            _closeObj.tabClick = true;
            EcoUtil.getSysvm().closeFullScreen(_closeObj);
        },
        showFlowDirectionSort(reqId){
             let _width = '676';
            let _height = '400';
            let url = '/flowform/index.html#/showFlowDirectionSort/'+reqId;
            EcoUtil.getSysvm().openDialog('环节排序',url,_width,_height,'15vh');
        }
  },
  watch: {

  }
}
</script>
<style scoped>
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
    background-color: #fff;
    overflow:auto;
  }

  .directionClient{
    width:100%;
    height: 100%;
    position: absolute;
  }
  .flowSave{
    position: absolute;
    top: 15px;
    right: 30px;
  }
</style>
