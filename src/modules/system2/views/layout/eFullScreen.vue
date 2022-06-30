<template>
  <div class="eFullScreenVue"  v-show="fullScreenIfmShow" id="eFullScreenVue">
      <iframe  name="fullScreenIfm"  id="fullScreenIfm" ref="fullScreenIfm"  :src="iframeSrc" frameborder="0" class="fullScreenClass" ></iframe>
  </div>
</template>
<script>
  import {getSSOLinkAjax} from '@/modules/system2/service/service.js'
  import {mapState,mapMutations} from 'vuex'

  export default {
    name:'eFullScreen',
    data(){
      return {
          fullScreenIfmShow:false,
          iframeSrc:'',
      }
    },

    created(){
          window.fullScreenVm = this;
    },
    mounted() {

    },
    computed:{

    },
    methods: {
        ...mapMutations([
            'SET_MENU_TAB_CLICK'
        ]),

        //显示Iframe内容
        doTab(menuTabObj){
              menuTabObj.funcObj = this.getObj(menuTabObj.r_func);
              if(menuTabObj.funcObj.menuTarget == 'SSO'){
                    this.getAndChangeSSO(menuTabObj);
              }else{
                    this.doTabAction(menuTabObj);
              }
        },

        //添加Iframe具体内容
        doTabAction(menuTabObj){
            if(this.needTab(menuTabObj)){
                  let tabKey = menuTabObj.funcObj.tabKey;
                  let tempKey = new Date().getTime()+'';
                  if(tabKey){
                      tempKey = tabKey;
                  }
                  let tabObj = menuTabObj;
                  tabObj.tabKey = tempKey;
                  this.actionTab(menuTabObj);
            }else{
                  let openUrl = menuTabObj.funcObj.href_link;
                  window.open(openUrl);
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

          //设置IFRAME具体操作
          actionTab(menuTabObj){
              if(menuTabObj.funcObj.menuTarget == 'IFRAME' || menuTabObj.funcObj.menuTarget == 'WEB' ||  menuTabObj.funcObj.menuTarget == 'SSO' ){

                  let activeTabKeyIframe = null;
                  activeTabKeyIframe = document.getElementById('fullScreenIfm');
                  if(activeTabKeyIframe){
                      if(true||menuTabObj.reload){
                          try{
                              activeTabKeyIframe.src = null;
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
                              activeTabKeyIframe.src = reloadSrc;
                              this.$emit('setBtnDisplay',{display:true});
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

                  this.fullScreenIfmShow = true;
              }else if(menuTabObj.funcObj.menuTarget == 'VUE'){


              }else{
                  this.fullScreenIfmShow = true;
                  document.getElementById('fullScreenIfm').src = null;
                  this.$emit('setBtnDisplay',{display:false});
              }
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
                               document.getElementById('fullScreenIfm').src = response.data.link;
                                this.$emit('setBtnDisplay',{display:true});
                         }catch(e){}
                    }).catch((e)=>{
                       try{
                            document.getElementById('fullScreenIfm').src = '';
                            this.$emit('setBtnDisplay',{display:false});
                          }catch(e){}
                    })
                    return '';
               }else{
                   let params = '';
                   for(let param in tabObj.funcObj){
                         if(param != 'menuTarget' && param != 'tabKey'){
                             params += (param+"="+tabObj.funcObj[param])+"&";
                         }
                   }
                   return "/wh/servlet/MainServer?"+params;
               }
           },

           getObj(str){
              console.log("fullScreen 点击菜单："+str);
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

           setFullScreenStatus(flag){
              this.fullScreenIfmShow = flag;
           },
           clearIframe(){
               document.getElementById('fullScreenIfm').src = null;
               this.$emit('setBtnDisplay',{display:false});
           }

    },

    destroyed() {


    }
  }
</script>
<style scoped>
.eFullScreenVue{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2050;
  background-color: #fff
}


.eFullScreenVue .fullScreenClass{
    width: 100%;
    height: 100%;
    position: absolute;
}

</style>
