<template>
<div :class="{mainLeftMax:toggleFlag==1}"  class="mainVue">
    <eHeader ref="header"></eHeader>
    <div class="tab" v-bind:class="{oneTab:oneTab}">
        <el-tabs v-model="activeTabKey" type="border-card" closable @tab-remove="removeTab" @tab-click="clickTab">
              <el-tab-pane  v-for="(item, index) in tabsArr"
                :key="item.tabKey"
                :label="item.desc"
                :name="item.tabKey"
                :title="item.desc"
              >
                  <div v-if="item.funcObj && (item.funcObj.menuTarget == 'IFRAME' || item.funcObj.menuTarget == 'WEB' || item.funcObj.menuTarget == 'SSO' )" class="openIframeDiv">
                      <iframe  v-bind:name="item.tabKey+'ifm'"  v-bind:id="item.tabKey+'ifm'" :ref="item.tabKey"  v-bind:src='getIframeSrc(item)' frameborder="0" class="ifr" ></iframe>
                  </div>
              </el-tab-pane>
       </el-tabs>
    </div>

    <div class="content" v-show="vueShow" v-bind:style="{top:oneTab?0:'34px'}">
        <transition name="router-fade" mode="out-in">
              <router-view></router-view>
        </transition>
    </div>

    <ecoDialog ref="ecoDialog1" :id="'ecoDialog1'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog2" :id="'ecoDialog2'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog3" :id="'ecoDialog3'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog4" :id="'ecoDialog4'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog5" :id="'ecoDialog5'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog6" :id="'ecoDialog6'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog7" :id="'ecoDialog7'" @closeDialog="closeDialogCallBack"></ecoDialog>
    <ecoDialog ref="ecoDialog8" :id="'ecoDialog8'" @closeDialog="closeDialogCallBack"></ecoDialog>

  </div>
</template>
<script>

  import {EcoUtil} from '@/components/util/main.js'
  import {getSSOLinkAjax} from '@/modules/system2/service/service.js'
  import {mapState,mapMutations} from 'vuex'
  import ecoDialog from '@/modules/system2/views/components/ecoDialog.vue'
  import eHeader from "@/modules/system2/views/layout/eHeader.vue"
  import messageBox from '@/components/messageBox/main.js'
  import { Loading } from 'element-ui';
  import {baseUrl,oneTab} from '@/modules/system2/config/env'

  export default {
    components:{
        ecoDialog,
        eHeader
    },
    data() {
      return {
        vueShow:false,
        activeTabKey: '',
        tabsArr: [],
        tabIndex: 1,
        iframeH:0,
        dialogArray:[0,0,0,0,0],
        openedDialog:0,
        loadingInstance:null,
        msgArrObj:{},
        // toggleFlag:1,
        //toggleFlag:0,
        leftMain:190,
        //leftMain:0,
        objTimer:null,
        filelimitsize:20,
        oneTab:oneTab
      }
   },
   computed:{
       ...mapState([
          'toggleFlag',
          'menuTabClickObj',
          'toggleMenuObj',
          'themeStatus',
          'tempObj'
       ])
    },
    mounted(){

    },

    created(){
          window.sysvm = this;
          this.init();
       
        //this.getOAConfigFunc();
        //setInterval(this.recieveMsgFunc,10000);
    },
    methods: {
      ...mapMutations([
          'SET_TOGGLE_FLAG',
          'SET_TEMP_OBJ',
          'SET_DOCUMENT_READY'
      ]),

      init(){
            let nextMenu = {};
            this.SET_DOCUMENT_READY({documentReady:true});
           
            nextMenu.desc = this.$t('module.home'); //默认首页门户
       //   nextMenu.r_func = '{menuTarget:"VUE", tabKey:"mainPage", routerName:"mainPage", routerParams:"{}"}';  
            nextMenu.r_func = "{menuTarget:'IFRAME',tabKey:'contentPage',href_link:'portal1/index.html#/serviceList'}";
            this.doTab(nextMenu);
            
      },

      logout(){
            sessionStorage.removeItem('ecoToken');
            this.$router.replace({name:'login'});       
      },

      //添加页签
      doTab(menuTabObj){
          /*全屏显示*/
          let _funcObj = null;
          try{
              _funcObj = this.getObj(menuTabObj.r_func);
          }catch(e){
              console.log(e);
          }

          /*隐藏全屏*/
          if(menuTabObj && menuTabObj.hideFullScreen){
                window.fullScreenVm.setFullScreenStatus(false);
                if(menuTabObj.clearIframe){
                        window.fullScreenVm.clearIframe();
                }
          }

          if(_funcObj && _funcObj.fullScreen){
                window.fullScreenVm.doTab(menuTabObj);
          }else{
              if(this.tabsArr.length>=12){
                  messageBox.alert(this.$t('message.tabNoMore'))
              }else{
                //描述取前面15个字符
          //    menuTabObj.funcObj = this.getObj(menuTabObj.r_func);
                menuTabObj.funcObj = _funcObj;
                menuTabObj.desc = this.getTabShotName(menuTabObj.desc);
                if(menuTabObj.funcObj.menuTarget == 'SSO'){
                        this.getAndChangeSSO(menuTabObj);
                }else{
                        this.doTabAction(menuTabObj);
                }
              }
          }
      },
      //添加页签具体操作
      doTabAction(menuTabObj){
        if(this.needTab(menuTabObj)){
              //获取标签的tabkey
              let tabKey = menuTabObj.funcObj.tabKey;
              
              /*单页签*/
              if(this.oneTab){
                 tabKey = 'contentPage';
                 menuTabObj.funcObj.tabKey = tabKey;
              }
              
              if(this.hasTabKey(tabKey)){ //如有有的话，直接显示tab
                   this.activeTabKey = tabKey;
              }else{ //如果没有的话，添加一个新的tab
                  let tempKey = new Date().getTime()+'';
                  if(tabKey){
                      tempKey = tabKey;
                  }
                  let tabObj = menuTabObj;
                  tabObj.tabKey = tempKey;
                  this.tabsArr.push(tabObj);
                  this.activeTabKey = tempKey;
              }
              this.actionTab(menuTabObj);
        }else{
            let openUrl = menuTabObj.funcObj.href_link;
            window.open(openUrl);
        }
      },

      //判断是否需要弹窗
      needTab(menuTabObj){
          if(menuTabObj.funcObj.menuTarget == 'WEB'){
              if(menuTabObj.funcObj.href_target == "_blank"){
                  return false;
              }else{
                  return true;
              }
          }else{
              return true;
          }
      },

      //如果是SSO链接，和后台进行数据交换后，转化为WEB 链接
      getAndChangeSSO(tabObj){
            let ssolink1 = tabObj.funcObj['ssolink1'];
            let ssolink2 = tabObj.funcObj['ssolink2'];
            getSSOLinkAjax(ssolink1,ssolink2).then((response)=>{
                  let newTabObj = {};
                  newTabObj.menuTarget = 'WEB';
                  newTabObj.tabKey = tabObj.funcObj.tabKey;
                  newTabObj.href_link = response.data.link;
                  if(ssolink2 !="N"){
                      newTabObj.href_target = "_blank";
                  }else{
                      newTabObj.href_target = '';
                  }
                  tabObj.funcObj = newTabObj;
                  this.doTabAction(tabObj);
            }).catch((e)=>{
                console.log(e);
            })
      },

      //form 表单提交 添加新的页签
      goTabWithFormSubmit(tab_key,tab_name,form_obj){
            let tabObj = {};
            if(EcoUtil.isDOMElement(form_obj)){

            }else{
               try{
                   form_obj = form_obj[0];
               }catch(e){}
            }
            tabObj.desc = tab_name;
            tabObj.tabKey = tab_key;
            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'"+tab_key+"',doNothing:'Y',nextPage:'/page/blank.html'}";
            this.doTab(tabObj);
            let that = this;
            setTimeout(
            function(){
                that.doFormSubmit(1,tab_key,form_obj);
            },100);
      },

      //from 表单提交 具体的操作
      doFormSubmit(index,tab_key,form_obj){
          if(index >=10){
              return ;
          }else{
              index++;
              document.getElementById(tab_key+'ifm');
              let targetIframe = document.getElementById(tab_key+'ifm');
              if(targetIframe){
                    index = 5;
                    form_obj.setAttribute('target',tab_key+'ifm');
                    form_obj.submit();
                    return ;
              }else{
                   let that  = this;
                   setTimeout(
                   function(){
                        that.doFormSubmit(index,tab_key,form_obj);
                  } ,300);
              }
          }
      },

      //添加标签具体操作
      actionTab(menuTabObj){
          if(menuTabObj.funcObj.menuTarget == 'IFRAME' || menuTabObj.funcObj.menuTarget == 'WEB' ||  menuTabObj.funcObj.menuTarget == 'SSO' ){
              this.vueShow = false;
              this.$router.replace({name:'nonePage'});
              let activeTabKeyIframe = null;
              activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
              if(activeTabKeyIframe){
                  if(menuTabObj.reload){
                      try{
                          let reloadSrc = this.getIframeSrc(menuTabObj);
                          if(reloadSrc.substring(reloadSrc.length-1)=='&'){
                              reloadSrc+='refreshTime='+new Date().getTime();
                          }else{
                              if(reloadSrc.indexOf("?")>-1){
                                  reloadSrc+='&refreshTime='+new Date().getTime();
                              }else{
                                  reloadSrc+='?refreshTime='+new Date().getTime();
                              }
                          }
                    //       var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                    //       var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
                    //       var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
                          function isIE() {
                            if (!!window.ActiveXObject || "ActiveXObject" in window){
                                return true;
                            }else{
                                return false;
                            }
                          }
                          if (isIE()){
                            let module1 = activeTabKeyIframe.src.replace(/[\s\S]*\/([\s\S]+)\/(index.html)?#[\s\S]*/,'$1');
                            let module2 = reloadSrc.replace(/[\s\S]*\/([\s\S]+)\/(index.html)?#[\s\S]*/,'$1');
                            if (module1==module2){
                                if(activeTabKeyIframe.contentWindow){
                                    activeTabKeyIframe.contentWindow.location.reload(true);
                                }
                            }else{
                                if(activeTabKeyIframe.contentWindow){
                                    activeTabKeyIframe.contentWindow.location.reload(false);
                                }
                            }
                          }
                          activeTabKeyIframe.src = reloadSrc;
                          // if(activeTabKeyIframe.contentWindow){
                          //     activeTabKeyIframe.contentWindow.location.reload(true);
                          // }
                      }catch(e){
                          console.log(e);
                      };
                  }else{
                    try{
                        if(activeTabKeyIframe.contentWindow.tabClickFunc){
                            activeTabKeyIframe.contentWindow.tabClickFunc();
                        }
                    }catch(e){};
                  }
              }
          }else if(menuTabObj.funcObj.menuTarget == 'VUE'){
              this.vueShow = true;
              let routerName = menuTabObj.funcObj.routerName;
              let routerParams = this.getObj(menuTabObj.funcObj.routerParams);
              this.$router.replace({name:routerName,params:routerParams});
          }else{
              this.vueShow = false;
              this.$router.replace({name:'nonePage'});
          }
      },

      //删除当前标签
      removeActionTab(menuTabObj){
          if(menuTabObj){
              if(menuTabObj.funcObj.menuTarget == 'IFRAME' || menuTabObj.funcObj.menuTarget == 'WEB' || menuTabObj.funcObj.menuTarget == 'SSO'){
                  this.vueShow = false;
              }else if(menuTabObj.funcObj.menuTarget == 'VUE'){
                  // console.log(menuTabObj.funcObj);
                  this.vueShow = true;
                  let routerName = menuTabObj.funcObj.routerName;
                  let routerParams = this.getObj(menuTabObj.funcObj.routerParams);
                  this.$router.replace({name:routerName,params:routerParams});
              }else{
                  this.vueShow = false;
              }
          }
      },

      //删除标签
      removeTab(targetName) {
          if(targetName == "mainPage"){
              return ;
          }
          let tabs = this.tabsArr;
          let activeName = this.activeTabKey;
          let clickTab = null;
          if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.tabKey === targetName) {
                    let nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        activeName = nextTab.tabKey;
                        clickTab = nextTab;
                    }
                }
             });
          }
          this.activeTabKey = activeName;
          this.tabsArr = tabs.filter(tab => tab.tabKey !== targetName);
          if(clickTab){
              clickTab.reload = false;
          }

          this.removeActionTab(clickTab);
          let activeTabKeyIframe = null;
          activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
          if(activeTabKeyIframe){
              try{
                  if(activeTabKeyIframe.contentWindow.tabClickFunc){
                      activeTabKeyIframe.contentWindow.tabClickFunc();
                  }
              }catch(e){};
          }
     },

     //点击标签
     clickTab(target) {
         let tabs = this.tabsArr;
         let activeName = this.activeTabKey;
         let clickTab = null;
         tabs.forEach((tab, index) => {
             if (tab.tabKey === target.name) {
                    clickTab = tab;
             }
         });
         clickTab.reload = false;
         this.actionTab(clickTab);
    },

    //判断是否有标签
    hasTabKey(tabKey){
         let re = false;
         if(tabKey){
             for(let i = 0;i < this.tabsArr.length;i++){
                 let tempTabKey = this.tabsArr[i].tabKey;
                 if(tabKey == tempTabKey){
                       re = true;
                       break;
                 }
             }
         }
         return re;
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
        console.log("菜单点击事件："+str);
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
     getIframeSrc(tabObj){
          if(tabObj.funcObj && tabObj.funcObj['menuTarget'] == 'WEB'){
              let url = tabObj.funcObj['href_link'];
              return url;
          }else if(tabObj.funcObj && tabObj.funcObj['menuTarget'] == 'SSO'){
               let ssolink1 = tabObj.funcObj['ssolink1'];
               let ssolink2 = tabObj.funcObj['ssolink2'];
               getSSOLinkAjax(ssolink1,ssolink2).then((response)=>{
                    try{
                          document.getElementById(tabObj.tabKey+'ifm').src = response.data.link;
                    }catch(e){}
               }).catch((e)=>{
                  try{
                       document.getElementById(tabObj.tabKey+'ifm').src = '';
                     }catch(e){}
               })
               return '';
          }else{
              if (tabObj.funcObj['href_link']&&tabObj.funcObj['href_link']=='/druid'){
                  return baseUrl+'/druid/index.html'
              }
              let params = '';
              for(let param in tabObj.funcObj){
                    if(param != 'menuTarget' && param != 'tabKey'){
                   //     params += (param+"="+tabObj.funcObj[param])+"&";
                          params += tabObj.funcObj[param];
                    }
              }
            //  return "/wh/servlet/MainServer?"+params;
                return "/"+params;
          }
      },

      returnUrl(url){
          return url;
      },

      //弹出窗口
      _open(v1,_title,_width,_height,url,v2,v3,v4,win_obj,_top){
            if(_width == ''){
                _width = document.body.clientWidth-50;
            }
            if(_height == ''){
                _height =   document.getElementById("aside").offsetHeight-120;
            }
            this.openDialog(_title,url,_width,_height,_top,win_obj);
      },

      openDialog(_title,url,_width,_height,_top,win_obj){
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
                      // console.log("调用iframe中callBackDialogFunc"+obj.callTab);
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
                      //    console.log("调用iframe中callBackDialogFunc "+i);
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


      callBackAllTabFunc(obj){
              for(let i = 0;i<this.tabsArr.length;i++){
                  let activeTabKeyIframe = null;
                  activeTabKeyIframe = document.getElementById(this.tabsArr[i].tabKey+'ifm');
                  if(activeTabKeyIframe){
                      try{
                          if(activeTabKeyIframe.contentWindow){
                              if( activeTabKeyIframe.contentWindow.callBackDialogFunc){
                                    activeTabKeyIframe.contentWindow.callBackDialogFunc(obj);
                              }
                          }
                      }catch(e){
                            console.log("调用iframe中callBackDialogFunc报错 activeTab");
                            console.log(e);
                      };
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
      showLoadingDiv(){
            try{
                this.loadingInstance = Loading.service({ fullscreen: true ,text:'正在处理... 请稍等'});
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


      //显示流程图
      showFlowChart(wf_id){
             let _width = document.body.clientWidth-50;
             let _height =   document.getElementById("aside").offsetHeight-180;
             let url = '/wh/jsp/component/workflow/appletframe.jsp?refresh=Y&workflow_id='+wf_id+'&currentTaskId=0';
             this.openDialog('流程图',url,_width,_height,'50px');
      },

      //显示流程
      showTopFormContent(wf_id){
          let _width = document.body.clientWidth-50;
          let _height =   document.getElementById("aside").offsetHeight-180;
          let url = "/wh/jsp/component/workflow/wfformhisview.jsp?refresh=Y&workflow_id="+wf_id+"&currentTaskId=0";
          this.openDialog('流程',url,_width,_height,'50px');
      },

      //显示流程历史
      showFlowHis(wf_id){
        let _width = document.body.clientWidth-50;
        let _height =   document.getElementById("aside").offsetHeight-180;
        let url = '/wh/jsp/component/workflow/history.jsp?workflow_id='+wf_id;
        this.openDialog('历史列表',url,_width,_height,'50px');
     },

      //我发起的流程
      selectMyFlowFunc(){
            let _width = document.body.clientWidth-50;
            let _height =   document.getElementById("aside").offsetHeight-180;
            let url = '/wh/jsp/version3/flow/index.html#/selectMyFlow';
            this.openDialog('我发起的流程',url,_width,_height,'50px');
      },

      //显示知识
      showKnowledge(reqId,id){
          let _width = document.body.clientWidth-50;
          let _height =   document.getElementById("aside").offsetHeight-180;
          let url = '/wh/jsp/version3/knowledge/index.html#/fileCard/'+reqId+'/'+id;
          this.openDialog('',url,_width,_height,'50px');
      },

      showMsgNotify(msgObj){
             msgObj.info.showBackMsg  = 'hideMsgBtn'; //点击回复
             msgObj.info.showClickShow = 'hideMsgBtn';//点击查看
            if(msgObj.info.type_id == 1){ //一般通知
                msgObj.showBackMsg = 'hideMsgBtn';
                msgObj.showClickShow = 'hideMsgBtn';
            }else if(msgObj.info.type_id == 4 || msgObj.info.type_id == 10){ //流程
                msgObj.info.workflow_task_id = msgObj.info.title.substring(msgObj.info.title.lastIndexOf("_")+1).trim();
                msgObj.info.title=msgObj.info.title.substring(0,msgObj.info.title.lastIndexOf("_"));
                msgObj.showBackMsg = 'hideMsgBtn';
                msgObj.showClickShow = 'showMsgBtn';
            }else if(msgObj.info.type_id == 6){ //日程
                msgObj.showBackMsg = 'hideMsgBtn';
                msgObj.showClickShow = 'hideMsgBtn';
            }else if(msgObj.info.type_id == 20){
                msgObj.showBackMsg = 'hideMsgBtn';
                msgObj.showClickShow = 'hideMsgBtn';
            }
            //优先级赋值
            if(msgObj.info.priority_id==1){
                msgObj.info.priority_name = "非常低";
            }else if(msgObj.info.priority_id==2){
                msgObj.info.priority_name = "低";
            }else if(msgObj.info.priority_id==3){
                msgObj.info.priority_name = "普通";
            }else if(msgObj.info.priority_id==4){
                msgObj.info.priority_name = "高";
            }else if(msgObj.info.priority_id==5){
                msgObj.info.priority_name = "非常高";
            }
            let options = {};
            options.title = msgObj.info.type_desc;
            options.dangerouslyUseHTMLString = true;
            options.type = 'success';
            let that = this;
            options.onClose = function(){
                that.msgArrObj[msgObj.info.id+''] = null;
            }

            options.message = `
            <div class="m_prompt">
                <div class="m_Line">
                    <div class="m_title">标题 :</div>
                    <div class="m_content">${msgObj.info.title}</div>
                </div>
                <div class="m_Line">
                    <div class="m_title">内容 :</div>
                    <div class="m_content">${msgObj.info.content}</div>
                </div>
                <div class="m_Line">
                    <div class="m_title">优先级 :</div>
                    <div class="m_content">${msgObj.info.priority_name}</div>
                </div>
                <div class="m_point">
                    <button type="button" class="el-button el-button--default el-button--mini" onClick="clickMsgButton('IKNOW','${msgObj.info.type_id}','${msgObj.info.id}')"><span>我知道了</span></button>
                    <button type="button" class="el-button el-button--primary el-button--mini ${msgObj.showBackMsg}" onClick="clickMsgButton('BACKMSG','${msgObj.info.type_id}','${msgObj.info.id}')"><span>回复信息</span></button>
                    <button type="button" class="el-button el-button--success el-button--mini ${msgObj.showClickShow}" onClick="clickMsgButton('CLICKMSG','${msgObj.info.type_id}','${msgObj.info.id}','${msgObj.info.title}','${msgObj.info.workflow_task_id}')"><span>点击查看</span></button>
                </div>
            </div>
           `;
          // options.duration = 0;
           this.msgArrObj[msgObj.info.id+''] = this.$notify(options);
      },

 

      doMainToggle(flag){
            if(this.objTimer){
                window.clearInterval(this.objTimer) ;
                this.objTimer = null;
            }
            if(flag == "LEFT"){
                //   this.toggleFlag = 0;
                  this.SET_TOGGLE_FLAG(0);
                  this.objTimer = setInterval(this.moveMainPageLeft,1);
               // this.leftMain = 0;

            }else{
                //   this.toggleFlag = 1;
                  this.SET_TOGGLE_FLAG(1);
                  this.objTimer = setInterval(this.moveMainPageRight,1);
            //      this.leftMain = 190;
            }
      },

      moveMainPageLeft(){
          if(this.leftMain <=64 ){
              window.clearInterval(this.objTimer) ;
          }

          if(this.leftMain - 6 <=64){
              this.leftMain = 64;
          }else{
              this.leftMain = this.leftMain - 6;
          }

      },

      moveMainPageRight(){
          if(this.leftMain >=190 ){
              window.clearInterval(this.objTimer) ;
          }
          if(this.leftMain + 6 >=190){
              this.leftMain = 190;
          }else{
              this.leftMain = this.leftMain + 6;
          }
      },

      getEcoCookie(name){
          let cookieName = name;
          if(!cookieName){
              cookieName = 'ecoTheme';
          }
          let theme = this.$cookies.get(cookieName);
          return theme;
      },

      contentBodyAction(action,v1,v2,v3,v4,v5){
          if(action == 'showWorkFlow'){
             this.showTopFormContent(v1);
          }else if(action == 'showKnowledge'){
             this.showKnowledge(v1,v2);
          }
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
      }
    },

    watch:{
       menuTabClickObj(value,oldValue){
           this.doTab(value);
       },
      toggleMenuObj(value,oldValue){
            if(this.toggleFlag == 0){
                this.doMainToggle('RIGHT');
            }else if(this.toggleFlag == 1){
                this.doMainToggle('LEFT');
            }
            this.$refs.header.fitHeaderMenu(document.body.clientWidth)
       },
       themeStatus(value,oldValue){
            let doObj = {}
            doObj.action = 'setEcoThemeCallBack';
            doObj.data = {};
            doObj.close = true;
            this.callBackAllTabFunc(doObj);
       }

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

  .m_prompt{
      font-size: 14px;
  }
  .m_Line{
      padding: 4px 0;
  }
  .m_title{
      width: 60px; float: left;
  }
 .m_content{
      padding-left:60px;
  }

 .m_point{
     margin-top:8px;
 }

  .mainVue{
      position: fixed;;
      top: 65px;
      bottom: 0px;
      right:0;
      left: 64px;
      background-color: #ccc;
      min-width:400px;
      transition: left 1s;
  }
  .mainLeftMax{
      left: 190px;
  }
  @media only screen and (min-width: 768px){
    .mainLeftMax {
        left: 205px;
    }
  }

  @media only screen and (min-width: 1400px){
    .mainLeftMax {
        left: 230px;
    }
  }

  .mainVue .mainLeft0{
      position: absolute;
      top: 50px;
      left: 0px;
      bottom: 0px;
      right:0;
      background-color: #ccc;
  }


  .mainVue .tab{
      position: absolute;
      top:0;
  /*    height:45px; */
      bottom:0;
      left: 0;
      right: 0;
      background-color: #ccc;
  }

 .mainVue .ifr{
      width: 100%;
      height: 100%;
      position: absolute;
  }

 .mainVue .content{
     position:absolute;
     left: 0;
     right: 0;
     top: 34px;
     bottom:0px;
     background-color: #fff;
     z-index: 100;

  }

 .mainVue .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
 }

 .mainVue .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
 }

 .mainVue .openIframeDiv{
   position: absolute;
   width: 100%;
   height: 100%;
   background: #fff;
 }
</style>
