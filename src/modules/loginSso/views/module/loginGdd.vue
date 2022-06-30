<template>
    <div>
        <ecoLoading ref='ecoLoadingRef' :text="'登录中'"></ecoLoading>
    </div>
</template>
<script>

  import ecoLoading from '@/components/loading/ecoLoading.vue'
//   import iHeader from './views/components/iHeader.vue'
  import {sysEnv} from '../../config/env'
  import {loginAjax,getPublicSetting,loginSSOGddAjax} from '../../service/service.js'
//   import * as gdd from 'gdt-jsapi';
//   import getAuthCode from 'gdt-jsapi/getAuthCode';
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations,mapState} from 'vuex'
  export default{
      name:'frame',
      data() {
          return {
               json:{},
               type:"",
               loginMethod:"common"
          }
      },
      components:{
        //   iHeader,
          ecoLoading
      },
      created(){
          //this.initTheme();
          window.sysvm = this;
      },
      mounted() {
          this.json = EcoUtil.url2json(window.location.href);
          this.type = this.$route.params.type;
          if(this.type == 'gdd-by-edd-link'){
                this.loginMethod = "edd";
          }else if (this.type == 'gdd-by-account-id'){
                this.loginMethod = "account_id";
          }
          this.getPublicSetting();
      },
      computed: {
         
      },
      methods: {
          
          getPublicSetting(){
              getPublicSetting().then(res=>{
                        console.log(res.data)
                  if (res.data&&res.data.gdd){
                      let corpId = res.data.gdd.tenantId;
                        //   console.log(gdd)
                        //   console.log(getAuthCode)
                    //   if(dd.env.platform!="notInDingTalk"){
                          console.log('开始请求登陆')
                          this.ddLogin(corpId);
                    //   }else{
                    //     this.dingdingLoginError();
                    //   }
                  }
              }).catch(e=>{
                  this.dingdingLoginError();
              })
          },
          ddLogin(corpId){
              let _that = this;
                this.$refs.ecoLoadingRef.open();
                // dd.ready(function() {
                //     // dd.ready 参数为回调函数 , 在环境准备就绪时触发 , jsapi的调用需要保证在该回调函数触发后调用，否则无效。
                //     dd.runtime.permission.requestAuthCode({
                //         corpId:corpId,
                //         onSuccess: function(result) {
                //             let code = result.code;
                //             _that.dingdingLoginFunc(code,corpId);
                //         },
                //         onFail : function(err) {
                //             _that.dingdingLoginError();
                //         }
                //     });
                // });
                console.log('开始获取code/auth_code')
                dd.getAuthCode({
                    corpId: corpId
                }).then(res => {
                        console.log(res)
                        let code = res['code']||res['auth_code'];
                        console.log('开始验证登陆')
                        _that.dingdingLoginFunc(code,corpId);
                }).catch(err => {
                    _that.dingdingLoginError();
                })
          },
          dingdingLoginFunc(code,corpId){
            loginSSOGddAjax(code,loginMethod).then((res)=>{
                    this.$refs.ecoLoadingRef.close();
                    if(res.data){
                        this.$emit('checkSuccess',res.data,this.json);
                    }else{
                        this.dingdingLoginError();
                    }
            }).catch((error)=>{
                this.dingdingLoginError();
            })
          },
          dingdingLoginError(){
            this.$emit('checkError',this.json);
          },
          /*初始化主题*/
          initTheme(){
                let theme = this.$cookies.get('ecoTheme');
                theme  = "1ba5fa";
                this.$cookies.set('ecoTheme',theme);
                this.setTheme(theme);
          },

          setTheme(color){
              EcoUtil.toggleClass(document.body,"custom-"+color);
          },
          handleLogin(){
                if(sysEnv == 0){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
                }
          },
          logout(){
              location.href="/#/login"
          }

      },
      watch:{
      }
  }
</script>
<style>


</style>
