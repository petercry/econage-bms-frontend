<template>
    <div>
       <ecoLoading ref='ecoLoadingRef' :text="'登录中'"></ecoLoading>
       <component ref="loginSso" :is="comName" @checkSuccess="checkSuccess" @checkError="checkError"></component>
       <iframe style="height:0;width:0;visibility: hidden;" id="ifr" src="" frameborder="0"></iframe>
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
// import { Toast } from 'vant'
// import { Dialog } from 'vant';
import {EcoUtil} from '@/components/util/main.js'
import {getUserSelfInfo,getRoleExists} from'../service/service'
import {mapState,mapMutations} from 'vuex'
import e9 from './module/loginE9.vue'
import appUser from './module/loginAppUser.vue'
import cas from './module/loginCas.vue'
import dingding from './module/loginDing.vue'
import gdd from './module/loginGdd.vue'
import appUserToken from './module/loginAppUserToken.vue'
export default {
  name:'loginSso',
  components: {
     ecoLoading,
     e9,
     appUser,
     cas,
     dingding,
     gdd,
     appUserToken
  },
  data() {
    return {
      comName:"",
      type:"",
      lastName:""

    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
    this.type = this.$route.params.type;
    this.init();
    window.vm = this;
  },

  computed: {

  },

  methods: {
       ...mapMutations(['SET_LOGIN_STATUS','SET_USEROBJ','SET_ROLE']),
      init(){
        this.$refs.ecoLoadingRef.open();
        let ecoToken = sessionStorage.getItem('ecoToken');

        switch(this.type){
          case "edd":
              this.comName = "dingding";
              break;
          case "edd-mobilephone":
              this.comName = "dingding";
              break;
          case "edd-qr-mobilephone":
              this.comName = "dingding";
              break;
          case "edd-qr":
              this.comName = "dingding";
              break;
          case "edd-by-gdd-link":
              this.comName = "dingding";
              break;
          case "gdd":
              this.comName = "gdd";
              break;
          case "gdd-by-account-id":
              this.comName = "gdd";
              break;
          case "gdd-by-edd-link":
              this.comName = "gdd";
              break;
          case "app-user":
              this.comName = "appUser";
              break;
          case "app-user-token":
              this.comName = "appUserToken";
              break;
          case "cas":
              this.comName = "cas";
              break;
          default:
            let that = this;
            this.$message({
              showClose: true,
              message: '不支持的登陆方式',
              type: 'error',
              duration:2000,
              onClose(){
                  that.returnLogin();
              }
            });
        }
      },
      checkSuccess(ecoToken,{goto,goto_mobile} = {}){
          this.$refs.ecoLoadingRef.close();
          if(ecoToken){
             sessionStorage.setItem('ecoToken',ecoToken);
             this.SET_LOGIN_STATUS(true)
             this.getUserSelfInfo();
             this.getRoleExists('portal_link_item_manage');
             let url = window.location.href;
              if(url.indexOf('?')>-1){
                let str = url.substring(url.lastIndexOf('?'),url.lastIndexOf("#/"));
                url.replace(str,'');
                window.history.pushState({},0,url.replace(str,''));
              }
              let urlObj = EcoUtil.url2json(window.location.href);
              if (urlObj['redirect']){
                goto  = decodeURIComponent(urlObj['redirect']);
              }
              if (urlObj['redirect-mobile']){
                goto_mobile  = decodeURIComponent(urlObj['redirect-mobile']);
              }
             if (EcoUtil.IsPC()){
                this.returnSuccessPage(goto)
             }else{
                this.returnSuccessPage(goto_mobile)
             }

          }else{
            this.checkError();
          }
      },
      checkError({goto_error,goto_mobile_error} = {}){
        let that = this;
        //  this.$message({
        //     showClose: true,
        //     message: '用户验证失败,10s后跳转至登陆页..',
        //     type: 'error',
        //     duration:10000,
        //     onClose(){
                let urlObj = EcoUtil.url2json(window.location.href);
                if (urlObj['redirect-err']){
                  goto_error  = decodeURIComponent(urlObj['redirect-err']);
                }
                if (urlObj['redirect-mobile-err']){
                  goto_mobile_error  = decodeURIComponent(urlObj['redirect-mobile-err']);
                }
                if (EcoUtil.IsPC()){
                     if (goto_error) {
                        this.$message({ showClose: true, message: '用户验证失败,10s后跳转..', type: 'error', duration:10000,
                          onClose(){
                            location.href=decodeURIComponent(goto_error);
                          }
                        });
                     }else{
                        if(window.isError){
                          setTimeout(()=>{ that.returnLogin(); },3000)
                        }else{
                          that.returnLogin();
                        }
                     }
                }else{
                    if (goto_mobile_error) {
                        this.$message({ showClose: true, message: '用户验证失败,10s后跳转..', type: 'error', duration:10000,
                          onClose(){
                            location.href = decodeURIComponent(goto_mobile_error);
                          }
                        });
                    }else{
                        if(window.isError){
                          setTimeout(()=>{ that.returnLogin(); },3000)
                        }else{
                          that.returnLogin();
                        }
                    }
                }
          //   }
          // });
        this.SET_LOGIN_STATUS(false);
        this.SET_USEROBJ(null);
        // sessionStorage.setItem('ecoToken','');
        this.$refs.ecoLoadingRef.close();

        //this.$router.replace({name:'login'});
      },
      getRoleExists(key){
        getRoleExists(key).then(res=>{
          this.SET_ROLE({
              key:key,
              value:res.data
          })
        }).catch(e=>{})
    },
    getUserSelfInfo(){
      getUserSelfInfo().then(res=>{
        if (res.data){
          this.SET_USEROBJ(res.data)
        }else{
          this.SET_USEROBJ(null)
        }
      }).catch(e=>{})
    },
    returnLogin(){
      // if (EcoUtil.IsPC()){
      //    window.location.href = window.location.origin + '/#/login';
      // }else{
      //    window.location.href = window.location.origin + "/mobile/#/none/pub/home";
      // }
      let ngrooturl = EcoUtil.getNGRootUrl();
      console.log(ngrooturl);
      if (EcoUtil.IsPC()){
         document.getElementById('ifr').src = window.location.origin + ngrooturl + '/page/ssoDefault.html?loginType=error&v='+new Date().getTime();
      }else{
         document.getElementById('ifr').src = window.location.origin + ngrooturl + '/page/ssoDefault.html?loginType=error-mob&v='+new Date().getTime();
      }
    },
    returnSuccessPage(page){
       if(page){
         window.location.href = decodeURIComponent(page);
       }else{
         this.returnMainPage();
       }
    },
    returnMainPage(){
      // if (EcoUtil.IsPC()){
      //   window.location.href = window.location.origin + '/#/workPlatform/mainpage';
      //   // window.location.href = window.location.origin + '/portalIndex/#/';
      // }else{
      //   window.location.href = window.location.origin + '/mobile/#/none/pub/home';
      // }
     let ngrooturl = EcoUtil.getNGRootUrl();
      console.log(ngrooturl);
      if (EcoUtil.IsPC()){
         document.getElementById('ifr').src = window.location.origin + ngrooturl + '/page/ssoDefault.html?loginType=success&v='+new Date().getTime();
      }else{
         document.getElementById('ifr').src = window.location.origin + ngrooturl + '/page/ssoDefault.html?loginType=success-mob&v='+new Date().getTime();
      }
    }

  },
  beforeRouteEnter (to, from, next) {
    next((vm)=>{
      vm.lastName=from.name;
    });
  },
  watch:{

  },

};
</script>

<style scoped>

</style>
