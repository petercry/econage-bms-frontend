<template>
    <div style="background-color:#fff;">

        
    
    </div>
</template>
<script>

import {initWFByMapDefAjax,getWFOperateId,getWFViewOperateId,getFormIdAndTempIdByMapDef} from'../../service/service'
import {sysEnv} from '../../config/env.js'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'

export default{
  name:'start',
  data(){
    return {
      isMultiWs:false,
    }
  },
  created(){
     
  },
  mounted(){
         this.init();
     
  },
  computed:{
  },
  methods: {

    //监听dialog 回写事件
    listAction(){
          let callBackDialogFunc = function(obj){
              if(obj && obj.action == 'initWorkflow'){
                  window.ecoVm.initWorkflowCallBack(obj);
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },


    init(){
          if(sysEnv ==1){
              EcoUtil.getSysvm().showLoadingDiv('正在初始化... 请稍等');
          }

          let targetURL = this.$route.params.targetURL;
          let requestSource = this.$route.params.requestSource;
          if(requestSource == 'portal-item'){
              this.startWFFunc(targetURL);
          }else if(requestSource == 'portal_personal_todo_assignee'){
              this.doSSOWFFunc(targetURL);
          }else if(requestSource == 'portal_personal_msg_assignee'){
              this.viewSSOWFFunc(targetURL);
          }else if(requestSource == 'flowChart'){
              this.showFlowChart(targetURL);
          }else if(requestSource == 'flowDirection'){
              
                let tabObj = {};
                tabObj.desc = '流程设计'
                let goPage = "flowform/index.html#/wfTemplateList";
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfTemplateTab',href_link:'"+goPage+"'}";
                tabObj.reload = true;
                tabObj.clearIframe = true;
                EcoUtil.getSysvm().doTab(tabObj);

                if(targetURL && targetURL!='' && targetURL !="undefined"){
                        getFormIdAndTempIdByMapDef(targetURL).then((response)=>{
                            if(response.data.result && response.data.result.formId){
                                 this.flowDirection(response.data.result.formId,response.data.result.wfTempId);
                            }else{
                                EcoMessageBox.alert('自定义标识符不存在');
                                EcoUtil.getSysvm().hideLoadingDiv();
                                this.closeFullWindow();
                            }
                        })
                }else{
                    EcoUtil.getSysvm().hideLoadingDiv();
                    this.closeFullWindow();
                }

            
             
          }else{
              this.closeFullWindow();
          }
    },

    startWFFunc(map_ref){
        /*启动流程*/
          initWFByMapDefAjax(map_ref).then((response)=>{
              if(response.data.status  <= 99){
                  if(sysEnv ==1){
                      EcoUtil.getSysvm().hideLoadingDiv();
                      let tabObj = {};
                      let goPage = 'flowform/index.html#/wfDetail/'+response.data.remap.task_id+'/'+response.data.operate_id;
                      tabObj.desc = '';
                      tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wftask_info_"+response.data.operate_id+"',href_link:'"+goPage+"',fullScreen:true}";
                     // EcoUtil.getSysvm().doTab(tabObj);
                      this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                  }else{
                      this.$router.push({name:'wfDetail',params:{taskId:response.data.remap.task_id,operateId:response.data.operate_id}});
                  }
              }else{
                   EcoMessageBox.alert(response.data.msg);
                   this.closeFullWindow();
              }
        })
    },

      //待办流程
      doSSOWFFunc(wfId){
            getWFOperateId(wfId).then((response)=>{
                  if(response.data.status == 0){
                        EcoUtil.getSysvm().hideLoadingDiv();
                        let operateId = response.data.operate_id;
                        if(sysEnv == 1){
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/"+wfId+"/"+operateId;
                            tabObj.desc = '待办流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail"+wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                            // EcoUtil.getSysvm().doTab(tabObj);
                             this.$router.push({name:'wfDetail',params:{taskId:wfId,operateId:operateId}})
                        }else{
                             this.$router.push({name:'wfDetail',params:{taskId:wfId,operateId:operateId}})
                        }
                    }else{
                         EcoUtil.getSysvm().hideLoadingDiv();
                         EcoMessageBox.alert(response.data.msg);
                         this.closeFullWindow();
                    }
            })
       },

        //查看流程
        viewSSOWFFunc(wfId){
            let formView = 1;
            getWFViewOperateId(wfId,formView).then((response)=>{
                    if(response.data.status == 0){
                            EcoUtil.getSysvm().hideLoadingDiv();
                            let operateId = response.data.operate_id;
                             if(sysEnv == 1){
                                let tabObj = {};
                                let goPage = "flowform/index.html#/wfViewDetail/"+wfId+"/"+operateId;
                                tabObj.desc = '流程查看';
                                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfViewDetail"+wfId+"',href_link:'"+goPage+"',fullScreen:true}";
                                // EcoUtil.getSysvm().doTab(tabObj);
                                 this.$router.push({name:'wfViewDetail',params:{wfId:wfId,operateId:operateId}})
                             }else{
                                 this.$router.push({name:'wfViewDetail',params:{wfId:wfId,operateId:operateId}})
                             }
                    }else{
                            EcoUtil.getSysvm().hideLoadingDiv();
                            EcoMessageBox.alert(response.data.msg);
                            this.closeFullWindow();
                    }
            })
        },

        showFlowChart(wfId){
           
            this.$router.push({name:'showFlowChart',params:{wfId:wfId}})
              EcoUtil.getSysvm().hideLoadingDiv();
        },


        //流程设计
        flowDirection(formId,wfTempId){
           
            this.$router.push({name:'flowDirection',params:{
                    formId:formId,
                    templateId:wfTempId,
            }});
            EcoUtil.getSysvm().hideLoadingDiv();
        },

        closeFullWindow(){
            let _closeObj = {};
            _closeObj.clearIframe = true;
            _closeObj.tabClick = true;
            EcoUtil.getSysvm().closeFullScreen(_closeObj);
        }
   
  },
  watch: {

  }
}
</script>
<style scoped>

</style>
