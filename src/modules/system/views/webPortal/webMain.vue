<template>
    <div class="mainVue webMainVue" id="aside">
        <div class="tab" v-bind:class="{oneTab:oneTab}">
                <el-tabs v-model="activeTabKey" type="border-card" closable @tab-remove="removeTab" @tab-click="clickTab">
                        <el-tab-pane  v-for="(item, index) in tabsArr"
                            :key="item.tabKey"
                            :label="item.desc"
                            :name="item.tabKey"
                            :title="item.desc"
                        >
                            <div v-if="item.funcObj && (item.funcObj.menuTarget == 'IFRAME' || item.funcObj.menuTarget == 'WEB' || item.funcObj.menuTarget == 'SSO' || item.funcObj.menuTarget == 'KAIFA' )" class="openIframeDiv">
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

        <ecoDialog ref="ecoDialog1" :id="'ecoDialog1'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog2" :id="'ecoDialog2'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog3" :id="'ecoDialog3'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog4" :id="'ecoDialog4'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog5" :id="'ecoDialog5'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog6" :id="'ecoDialog6'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog7" :id="'ecoDialog7'" @closeDialog="closeDialogCallBack" ></ecoDialog>
        <ecoDialog ref="ecoDialog8" :id="'ecoDialog8'" @closeDialog="closeDialogCallBack" ></ecoDialog>

    </div>
</template>
<script>

  import {EcoUtil} from '@/components/util/main.js'
  import {getSSOLinkAjax,getWFViewOperateId} from '@/modules/system/service/service.js'
  import {mapState,mapMutations} from 'vuex'
  import ecoDialog from '@/modules/system/views/components/ecoDialog.vue'
  import messageBox from '@/components/messageBox/main.js'
  import { Loading } from 'element-ui';
  import {baseUrl} from '@/modules/bmsMmm/config/env'
  export default {
    components:{
        ecoDialog,

    },
    data() {
      return {
            vueShow:false,
            activeTabKey: '',
            tabsArr: [],
            tabIndex: 1,
            openedDialog:0,
            loadingInstance:null,
            oneTab:true,

      }
   },
   computed:{
       ...mapState([
          'menuTabClickObj',
          'toggleMenuObj',
          'themeStatus',
          'tempObj',
          'ecoSettingObj'
       ])
    },
    mounted(){
        window.sysvm = this;
        this.init();
    },
    created(){

    },
    methods: {
      ...mapMutations([
            'SET_TEMP_OBJ',
            'SET_DOCUMENT_READY',
            'DELETE_TEMP_OBJ',
            'SET_TASK_STATUS'
      ]),

      init(){
            //为了开发环境能够测试
            if(this.$route.name === 'webPlatformForEnv'){
                this.forEnv = true;
                let tabObj = {};
                let name = this.$route.params.routeName;
                tabObj = {};
                tabObj.desc = name;
                tabObj.r_func = "{menuTarget:'KAIFA',tabKey:'"+name+"',routerName:'"+name+"'}";
                this.doTab(tabObj);
                return;
            }
            let _action = this.getTempStore('SYSINITACTION');
            if (window.sysSetting.homeType){
                let nextMenu = {};
                nextMenu.desc = this.$t('module.home'); //默认首页门户
                if( (window.sysSetting.homeType).startsWith('frame:')){
                    nextMenu.r_func = "{menuTarget:'IFRAME',tabKey:'contentPage',href_link:'"+ window.sysSetting.homeType.substring(6)+"'}";
                    this.frameMainPage = true;
                }else{
                    nextMenu.r_func = "{menuTarget:'VUE',tabKey:'webMainPage',routerName:'"+window.sysSetting.homeType+"'}";
                }
                this.doTab(nextMenu);
            }else{
                let nextMenu = {};
                nextMenu.desc = this.$t('module.home'); //默认首页门户
                nextMenu.r_func = "{menuTarget:'VUE',tabKey:'webMainPage',routerName:'webMainPage'}";
                this.doTab(nextMenu);
            }

            if(_action == 'sso'){
                let portalMenu = {};
                portalMenu.r_func = "{'menuTarget':'IFRAME','tabKey':'initViewFullscreen',href_link:'page/ssoAdapter.html?v="+new Date().getTime()+"',fullScreen:true}";
                this.doTab(portalMenu);  //显示全屏的
            }

            this.SET_DOCUMENT_READY({documentReady:true});
            this.deleteTempStore('SYSINITACTION');
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

          this.filterTab(_funcObj);


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

     filterTab(_funcObj){
          //过滤流程全屏或者tab页签
          if(window.sysSetting && window.sysSetting.flowformTabShow){
              if(_funcObj && _funcObj.href_link && _funcObj.href_link.indexOf('flowform/index.html#/wfDetail/')>-1){ //待办流程
                    _funcObj.fullScreen = false;
                    _funcObj.newTab = true;
              }else if(_funcObj && _funcObj.href_link && _funcObj.href_link.indexOf('flowform/index.html#/wfViewDetail/')>-1){
                    _funcObj.fullScreen = false;
                    _funcObj.newTab = true;
              }else if(_funcObj && _funcObj.href_link && _funcObj.href_link.indexOf('flowform/index.html#/wfSnapshotDetail/')>-1){
                    _funcObj.fullScreen = false;
                    _funcObj.newTab = true;
              }
          }
      },

      //添加页签具体操作
      doTabAction(menuTabObj){

        if(this.needTab(menuTabObj)){
              //获取标签的tabkey

              let tabKey = menuTabObj.funcObj.tabKey;
              if(false && this.hasTabKey(tabKey)){ //如有有的话，直接显示tab
                   this.activeTabKey = tabKey;
              }else{ //如果没有的话，添加一个新的tab
                  let tempKey = new Date().getTime()+'';
                  if(tabKey){
                      tempKey = tabKey;
                  }
                  let tabObj = menuTabObj;
                  tabObj.tabKey = tempKey;

                  if(menuTabObj.funcObj.newTab){
                      if(this.hasTabKey(tabKey)){ //如有有的话，直接显示tab
                           this.activeTabKey = tabKey;
                      }else{
                          this.$set(this.tabsArr,(this.tabsArr.length) ,tabObj);
                      }
                  }else{
                      if(this.tabsArr.length > 1){
                         this.tabsArr = this.tabsArr.filter((tab,idx) => idx == 0);
                      }
                      this.$set(this.tabsArr,0,tabObj);
                  }
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
              this.$router.replace({name:'webNonePage'});
              let activeTabKeyIframe = null;
              activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');

              if(activeTabKeyIframe){
                  if(menuTabObj.reload){
                      try{
                          let reloadSrc = this.getIframeSrc(menuTabObj);
                          if(reloadSrc.indexOf('.html#')>-1){ //vue项目
                                let _tempStc = reloadSrc;
                                _tempStc = reloadSrc.substring(0,reloadSrc.indexOf("#"));
                                _tempStc+="?refreshTime="+new Date().getTime()+reloadSrc.substring(reloadSrc.indexOf("#"));
                                 activeTabKeyIframe.src = _tempStc;
                          }else{
                                if(reloadSrc.substring(reloadSrc.length-1)=='&'){
                                    reloadSrc+='refreshTime='+new Date().getTime();
                                }else{
                                    if(reloadSrc.indexOf("?")>-1){
                                        reloadSrc+='&refreshTime='+new Date().getTime();
                                    }else{
                                        reloadSrc+='?refreshTime='+new Date().getTime();
                                    }
                                }
                                activeTabKeyIframe.src = reloadSrc;
                          }
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
          }else if(menuTabObj.funcObj.menuTarget == 'KAIFA'){
              this.vueShow = false;
              //this.$router.replace({name:'nonePage'}).catch((err)={});;

              let activeTabKeyIframe = null;
              activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
              activeTabKeyIframe.src = window.location.origin + "/#/"+ this.$route.path.replace('/web/','');
          }else{
              this.vueShow = false;
              this.$router.replace({name:'webNonePage'});
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

     removeActiveTab(){
         this.removeTab(this.activeTabKey);
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
            if(str){
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
          }else if(tabObj.funcObj && tabObj.funcObj['menuTarget'] == 'KAIFA'){
              //let urljson = EcoUtil.url2json(window.location.href);
              let url = this.$route.path.replace('/web/','');
              return window.location.origin+"/#/"+url;
          }else{
              if (tabObj.funcObj['href_link']&&tabObj.funcObj['href_link']=='/druid'){
                  return baseUrl+'/druid/index.html'
              }

              let params = '';
              for(let param in tabObj.funcObj){
                    if(param != 'menuTarget' && param != 'tabKey' && param!='fullScreen' && param!='newTab'){
                          params += tabObj.funcObj[param];
                    }
              }


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

      openDialog(_title,url,_width,_height,_top,win_obj,extData,closedDialogCallBack){
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
                    oneDialog.fullscreen = extData.fullscreen;
               }else{
                    oneDialog.closeOnClickModal  = false;
                    oneDialog.showClose  = true;
                    oneDialog.closeOnPressEscape  = false;
                    oneDialog.fullscreen  = false;
               }
              if(closedDialogCallBack){
                  oneDialog.closedDialogCallBack = closedDialogCallBack;
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
            /*如果是全屏的*/

            if(false&& window.fullScreenVm.fullScreenIfmShow){
                    /*回调全盘的事件*/
                    let activeTabKeyIframe = null;
                    activeTabKeyIframe = document.getElementById('fullScreenIfm');
                    if(activeTabKeyIframe){
                        try{
                                if(activeTabKeyIframe.contentWindow){
                                    console.log("调用fullscreen callBackDialogFunc ");
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
                    let activeTabKeyIframe2 = null;

                    if(window.fullScreenVm.fullScreenIfmShow){
                        activeTabKeyIframe = document.getElementById('fullScreenIfm');
                        if(obj.tabCallable){
                            activeTabKeyIframe2 = document.getElementById(this.activeTabKey+'ifm');
                        }
                     }else{
                        activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                     }

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

                    if(activeTabKeyIframe2){
                         try{
                                if(activeTabKeyIframe2.contentWindow){
                                    if(obj && obj.action == 'userSelectCallBack'){

                                    }else{
                                        if( activeTabKeyIframe2.contentWindow.callBackDialogFunc){
                                            activeTabKeyIframe2.contentWindow.callBackDialogFunc(obj);
                                        }
                                    }
                                }
                        }catch(e){
                            console.log("调用iframe中callBackDialogFunc报错 activeTab");
                            console.log(e);
                        };
                    }
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
                if(window.fullScreenVm.fullScreenIfmShow){
                        /*回调全盘的事件*/
                        activeTabKeyIframe = document.getElementById('fullScreenIfm');
                }else{
                        activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                }


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
      openFullScreenDialog(url,closeCB){
        let _width = document.body.clientWidth;
        let _height =   document.getElementById("aside").offsetHeight + 60;
        this.openDialog('',url,_width,_height,'0','',{
            showClose:false,
            fullscreen:true,
        },closeCB);
      },
       closeFullScreenDialog(){
            this.$refs['ecoDialog'+this.openedDialog].closeDialog();
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
          let _height =   document.getElementById("aside").offsetHeight-100;
          let url = '/wh/jsp/version3/knowledge/index.html#/fileCard/'+reqId+'/'+id;
          this.openDialog('',url,_width,_height,'20px');
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
      onFileUploadForEnv(obj){
          let key = EcoUtil.getUID();
          this.setTempStore(key,obj);
          let url = window.location.origin+'/#/env/attachement/'+key;
          let _title = '上传附件';
          if(obj && obj.uploadType == 'IMAGE'){
              _title = '上传图片';
          }
          this.openDialog(_title,url,600,500,'15vh');
      },
      openCommentDialogEnv(obj){
          let key = EcoUtil.getUID();
          this.setTempStore(key,obj);
          let url = window.location.origin+'/#/env/comments/'+key;
          this.openDialog(obj.title || '评论',url,600,600,'8vh',null,null,obj.closedDialogCallBack);
      },
      openCommentDialog(obj){
          let key = EcoUtil.getUID();
          this.setTempStore(key,obj);
          let url = '/globalServices/index.html#/comments/'+key;
          this.openDialog(obj.title || '评论',url,600,600,'8vh',null,null,obj.closedDialogCallBack);
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
        },

        deleteTempStore(key){
                this.DELETE_TEMP_OBJ(key);
        },

        /*关闭全局窗口*/
        closeFullScreen(obj){
                window.fullScreenVm.setFullScreenStatus(false);
                if(obj && obj.clearIframe){
                    window.fullScreenVm.clearIframe();
                }
                if(obj && obj.tabClick){
                    let activeTabKeyIframe = null;
                    activeTabKeyIframe = document.getElementById(this.activeTabKey+'ifm');
                    if(activeTabKeyIframe){
                        try{
                            if(activeTabKeyIframe.contentWindow.tabClickFunc){
                                activeTabKeyIframe.contentWindow.tabClickFunc();
                            }
                        }catch(e){};
                    }
                    this.SET_TASK_STATUS();
                }
        },

        getEcoSettingObj(){
            return this.ecoSettingObj;
        },

        getWebPlatform(){
            if(this.openedDialog == 0){
                return true;
            }else{
                return false;
            }
        },

    },

    watch:{
       menuTabClickObj(value,oldValue){

           this.doTab(value);
       },



       themeStatus(value,oldValue){
            let doObj = {}
            doObj.action = 'setEcoThemeCallBack';
            doObj.data = {};
            doObj.close = true;
            this.callBackAllTabFunc(doObj);
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
  .webMainVue{
      position: fixed;;
      top: 48px;
      bottom: 0px;
      right:0;
      left: 0;
      background-color: #fff;
      min-width:400px;
      transition: left 1s;
  }

  .webMainVue .tab{
      position: absolute;
      top:0;
      bottom:0;
      left: 0;
      right: 0;
      background-color: #fff;
  }

 .webMainVue .ifr{
      width: 100%;
      height: 100%;
      position: absolute;
  }

 .webMainVue .content{
     position:absolute;
     left: 0;
     right: 0;
     top: 34px;
     bottom:0px;
     background-color: #fafafa;
     z-index: 100;
     overflow-y: auto;
  }

 .webMainVue .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
 }

 .webMainVue .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
 }

 .webMainVue .openIframeDiv{
   position: absolute;
   width: 100%;
   height: 100%;
   background: #fff;
 }

 .webMainVue .oneTab .el-tabs--border-card>.el-tabs__header{
    display: none
}
</style>
