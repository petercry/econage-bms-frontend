<template>
<div    class="main" id="aside">

    <div  class="openIframeDiv">
        <iframe  v-bind:src='getIframeSrc()' frameborder="0" class="ifr" id="activeTabKeyifm"></iframe>
    </div>

    <ecoDialog ref="ecoDialog1" :id="'ecoDialog1'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog2" :id="'ecoDialog2'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog3" :id="'ecoDialog3'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog4" :id="'ecoDialog4'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog5" :id="'ecoDialog5'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog6" :id="'ecoDialog6'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog7" :id="'ecoDialog7'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog8" :id="'ecoDialog8'" @closeDialog="closeDialogCallBack"></ecoDialog>


     
     <form name="eMainForm" action="/singleSystem/index.html" method="post" >
         <input type="hidden" name="goPage" value=""/>
    </form>

  </div>
</template>
<script>

  import {EcoUtil} from '@/components/util/main.js'
  import {getOAConfigAjax,getWFViewOperateId} from '../../service/service.js'
  import {mapState,mapMutations} from 'vuex'
  import ecoDialog from '../../views/components/ecoDialog.vue'
  import { Loading } from 'element-ui';


  export default {
    components:{
        ecoDialog
    },
    data() {
      return {
            activeTabKey: 'activeTabKey',
            openedDialog:0,
            loadingInstance:null,
            url:null,
            urlKey:'EcoWebUrl',
      }
   },
   computed:{
       ...mapState([
          'menuTabClickObj',
          'tempObj'
       ])
    },
    mounted(){
       
    },
    created(){
        window.sysvm = this; 
      //  this.url =  sessionStorage.getItem(this.urlKey);
        this.url = decodeURIComponent(this.$route.params.url);
        sessionStorage.removeItem(this.urlKey);
    },
    methods: {
        ...mapMutations([
          'SET_TEMP_OBJ',
          'DELETE_TEMP_OBJ',
          'ecoSettingObj'
      ]),

      //添加页签
      doTab(menuTabObj){
           //描述取前面15个字符
           menuTabObj.funcObj = this.getObj(menuTabObj.r_func);
           menuTabObj.desc = this.getTabShotName(menuTabObj.desc);
           this.doTabOpenAction(menuTabObj);
      },


      doTabOpenAction(menuTabObj){
            sessionStorage.setItem(this.urlKey,menuTabObj.funcObj.href_link);
            document.eMainForm.target = "_blank";
            document.eMainForm.submit();
      },

   
     //获取标签名称
     getTabShotName(name){
        let tempName = name;
        if(name){
            let length = name.length;
            if(length > 15){
                length = 15;
                tempName =  name.substring(0,15)+"...";
            }
        }
        return tempName;
     },

     getObj(str){
        let obj = {};
        try{
            obj = eval("("+str+")");
            if(!obj.tabKey){
                let tabKey = '';
                Object.keys(obj).forEach(function(key){
                      tabKey +=obj[key];
                });
                obj.tabKey = tabKey+'Tab';
            }
            if(!obj.menuTarget){
                obj.menuTarget = 'IFRAME';
            }
        }catch(e){
            console.log(e);
        }
        return obj;
     },

     //设置iframe的src
     getIframeSrc(){
            return this.url;
      },

      returnUrl(url){
          return url;
      },

      //弹出窗口
      _open(v1,_title,_width,_height,url,v2,v3,v4,win_obj,_top){
            this.openDialog(_title,url,_width,_height,_top,win_obj);
      },

      openDialog(_title,url,_width,_height,_top,win_obj,extData){
              let oneDialog = {};
              oneDialog.title = _title;
              try{
                  if(Number.isInteger(parseFloat(_width))){
                        oneDialog.width = _width;
                  }else{
                        oneDialog.width = 500;
                  }
              }catch(e){
                    oneDialog.width = 500;
              }
              try{
                  if(Number.isInteger(parseFloat(_height))){
                        oneDialog.height = _height;
                  }else{
                        oneDialog.height = 400-116;
                  }
              }catch(e){
                    oneDialog.height = 400-116;
              }
              if(_top){
                  oneDialog.top = _top;
              }else{
                  oneDialog.top = "15vh";
              }
              oneDialog.url = url;
              oneDialog.show = true;

              if(extData){
                    oneDialog.closeOnClickModal  = extData.closeOnClickModal;
                    oneDialog.showClose  = extData.showClose;
                    oneDialog.closeOnPressEscape  = extData.closeOnPressEscape;
               }else{
                    oneDialog.closeOnClickModal  = false;
                    oneDialog.showClose  = true;
                    oneDialog.closeOnPressEscape  = false;
               }

              //获取弹出窗口的父窗口
              let _window = null;
              if(win_obj){
                  _window = win_obj;
              }else{
                  if(this.openedDialog == 0){
                        let activeTabKeyIframe = null;
                        activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                        if(activeTabKeyIframe){
                            try{
                                _window = activeTabKeyIframe.contentWindow;
                            }catch(e){
                                console.log(e);
                            };
                        }
                  }else{
                      let activeIframe = null;
                      activeIframe = document.getElementById('ecoDialog'+(this.openedDialog));
                      if(activeIframe){
                          try{
                                _window = activeIframe.contentWindow ;
                          }catch(e){

                          };
                      }
                  }
              }
              this.openedDialog ++;
              this.$refs['ecoDialog'+this.openedDialog].open(oneDialog,_window);
      },

      callBackDialogFunc(obj){
          /*回调弹出iframe 的 事件 */
          //回调特定的tab
          if(obj && obj.callTab){
              let activeTabKeyIframe = null;
              activeTabKeyIframe = document.getElementById(obj.callTab+'ifm');
              if(activeTabKeyIframe){
                  try{
                      activeTabKeyIframe.contentWindow.callBackDialogFunc(obj);
                  }catch(e){
                      console.log("调用iframe中callBackDialogFunc报错"+obj.callTab);
                      console.log(e);
                  };
              }
          }else{
          
                for(var i = 1;i<= this.openedDialog-1 ;i++){
                        let activeIframe = null;
                        activeIframe = document.getElementById('ecoDialog'+i);
                        if(activeIframe){
                            try{
                                if(activeIframe.contentWindow){
                                    //如果是选人的回调
                                    if(obj && obj.action == 'userSelectCallBack'){
                                        if( activeIframe.contentWindow.callBackUserSelectDialogFunc){
                                            activeIframe.contentWindow.callBackUserSelectDialogFunc(obj);
                                        }
                                    }else{
                                        if( activeIframe.contentWindow.callBackDialogFunc){
                                            activeIframe.contentWindow.callBackDialogFunc(obj);
                                        }
                                    }
                                }
                            }catch(e){
                                console.log("调用iframe中callBackDialogFunc报错dialog"+i);
                                console.log(e);
                            };
                        }
                    }

                    /*回调当前页签的 事件*/
                    let activeTabKeyIframe = null;
                    activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                     
                    if(activeTabKeyIframe){
                        try{
                                if(activeTabKeyIframe.contentWindow){
                                    console.log("调用activeTabKeyIframe中callBackDialogFunc ");
                                    if(obj && obj.action == 'userSelectCallBack'){
                                        if( activeTabKeyIframe.contentWindow.callBackUserSelectDialogFunc){
                                            activeTabKeyIframe.contentWindow.callBackUserSelectDialogFunc(obj);
                                        }
                                    }else{
                                        if( activeTabKeyIframe.contentWindow.callBackDialogFunc){
                                            activeTabKeyIframe.contentWindow.callBackDialogFunc(obj);
                                        }
                                    }
                                }
                        }catch(e){
                            console.log("调用iframe中callBackDialogFunc报错 activeTab");
                            console.log(e);
                        };
                    }
              
              if(obj && obj.close){
                    window.sysvm.closeDialog();
              }
          }
      },

      _getMyWinParent(){
          let activeIframe = null;
          if(this.openedDialog-1 > 0){
                activeIframe = document.getElementById('ecoDialog'+(this.openedDialog-1));
          }else{
                activeIframe = document.getElementById(this.activeTabKey+'ifm');
          }
          return   activeIframe.contentWindow ;
      },

      //关闭窗口
      _close(){
          this.closeDialog();
      },
      closeDialog(){
            this.$refs['ecoDialog'+this.openedDialog].closeDialog();
      },
      closeDialogCallBack(callObj){
          this.openedDialog =   this.openedDialog -1;
      },
      alert(message, title, options){
          this.$alert(message, title, options);
      },
      confirm(message,title,options){
          this.$confirm(message,title,options).then(()=>{
              this.confirmOnAction({action:'confirmActionYes'});
          }).catch(()=>{
              this.confirmOnAction({action:'confirmActionNo'});
          })
      },
      confirmOnAction(obj){
          /*回调弹出iframe 的 事件 */
          for(let i = this.openedDialog;i<= this.openedDialog && i > 0;i++){
              let activeIframe = null;
              activeIframe = document.getElementById('ecoDialog'+(this.openedDialog));
              if(activeIframe){
                  try{
                        // console.log("调用callBackConfirm dialog"+this.openedDialog);
                          activeIframe.contentWindow.callBackConfirmFunc(obj);
                  }catch(e){
                      console.log("调用iframe中 callBackConfirmFunc报错dialog"+this.openedDialog);
                      console.log(e);
                  };
              }
          }
          /*回调当前页签的 事件*/
          if(this.openedDialog == 0){
              let activeTabKeyIframe = null;
              activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
              if(activeTabKeyIframe){
                  try{
                          activeTabKeyIframe.contentWindow.callBackConfirmFunc(obj);
                   }catch(e){
                      console.log("调用iframe中callBackDialogFunc报错 activeTab");
                      console.log(e);
                 };
             }
         }
      },

     //显示loading
      showLoadingDiv(text){
            try{
                let _text = '正在处理... 请稍等';
                if(text){
                    _text = text;
                }
                this.loadingInstance = Loading.service({ fullscreen: true ,text:_text});
            }catch(e){
                console.log(e);
            }
      },

      //关闭loading
      hideLoadingDiv(){
          try{
              this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.loadingInstance.close();
              });
          }catch(e){
              console.log(e);
          }
      },

      openMaxDialog(title,url){
           let _width = document.body.clientWidth-50;
           let _height =   document.getElementById("aside").offsetHeight-120;
           this.openDialog(title,url,_width,_height,'50px');
      },

      //显示流程图
      showFlowChart(wf_id){
            let url = '/flowform/index.html#/showFlowChart/'+wf_id;
            this.openMaxDialog('流程图',url);
      },

      //显示流程
      showTopFormContent(wf_id){
            let formView = 1;
            let _wfId = wf_id;
            let _ccId = null;
            getWFViewOperateId(_wfId,formView,_ccId).then((response)=>{
                    if(response.data.status <= 99){
                                let url = "/flowform/index.html#/wfViewDetail/"+wf_id+"/"+response.data.operate_id+"?noCloseBtn=true";
                                this.openMaxDialog('流程查看',url);
                    }else{
                               messageBox.alert(response.data.msg);
                    }
            })
      },

      //显示流程历史
      showFlowHis(operateId){
            let _width = 640;
            let _height =   document.getElementById("aside").offsetHeight-180;
            let url = '/flowform/index.html#/showFlowHis/'+operateId;
            this.openDialog('流程历史记录',url,_width,_height,'50px');
     },

        //调用附件上传接口
      onFileUpload(obj){
          let key = EcoUtil.getUID();
          this.setTempStore(key,obj);
          let url = '/globalServices/index.html#/attachement/'+key;
          let _title = '上传附件';
          if(obj && obj.uploadType == 'IMAGE'){
              _title = '上传图片';
          }
          this.openDialog(_title,url,600,500,'15vh');
      },
   
      setTempStore(key,value){
          let tempStore = this.tempObj;
          tempStore[key] = null;
          tempStore[key] = value;
          this.SET_TEMP_OBJ(tempStore);
      },

      getTempStore(key){
          let tempStore = this.tempObj;
          if(tempStore && tempStore[key]){
              return tempStore[key];
          }else{
              return '';
          }
      },

       removeTempStore(key){
          let tempStore = this.tempObj;
          if(tempStore && tempStore[key]){
             delete tempStore[key] ;
          }
          this.SET_TEMP_OBJ(tempStore);
      },

       deleteTempStore(key){
            this.DELETE_TEMP_OBJ(key);
       },

      setHtmlTitle(title){
          document.title = title;
      },

      /*关闭全局窗口*/
      closeFullScreen(obj){
            window.close();
      },

      getEcoSettingObj(){
            return this.ecoSettingObj;
      },

      isSingleSystem(){
          return true;
      }

    },

    watch:{
       menuTabClickObj(value,oldValue){
           this.doTab(value);
       },

    },
    beforeRouteLeave (to, from, next) {
       next(true);
    },

    beforeRouteEnter (to,from,next){
         next(vm => {
             window.sysvm = vm;
         })
    },
    destroyed(){
       window.sysvm = null;
    }

  }
</script>
<style >

  .main{
      position: absolute;
      top: 0px;
      bottom: 0px;
      right:0;
      left:0;
      background-color: #ccc;
  }


  .tab{
      position: absolute;
      top:0;
  /*    height:45px; */
      bottom:0;
      left: 0;
      right: 0;
      background-color: #ccc;
  }

  .ifr{
      width: 100%;
      height: 100%;
      position: absolute;
  }
  
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
 }

 .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
 }


 .openIframeDiv{
   position: absolute;
   width: 100%;
   height: 100%;
   background: #fff;
 }
</style>
