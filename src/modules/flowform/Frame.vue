<template>
     <router-view></router-view>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {loginAjax} from './service/service.js'
  import {sysEnv} from './config/env'

  export default{
      name:'frame',
      data(){
          return {
              sysEnv:sysEnv
          }
      },
      created(){
          this.initTheme();
          this.listAction();
          this.handleLogin();
          this.setWebConfig();
      },
      methods: {
          /*初始化主题*/
          initTheme(){
              let theme ;
              try{
              //    theme =   window.parent.window.sysvm.getEcoCookie();
              }catch(e){}
              if(!theme){
                  theme = '1ba5fa';
              }
              this.setTheme(theme);
          },

          setTheme(color){
              EcoUtil.toggleClass(document.body,"custom-"+color);
          },

          //监听dialog 回写事件
          listAction(){
              let that =this;
              let callBackDialogFunc = function(obj){
                  if(obj && obj.action == 'setEcoThemeCallBack'){
                      that.initTheme();
                  }
              }
              EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'FRAME');
          },

          handleLogin(){
              if(false && sysEnv == 0){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
              }
          },

          setWebConfig(){
              try{
                  if(EcoUtil.getSysvm() && EcoUtil.getSysvm().getWebPlatform &&  EcoUtil.getSysvm().getWebPlatform()){
                        document.body.classList.add('webPlatform');
                  }
              }catch(e){
                  console.log(e);
              }
          }
      },

      watch: {

      },
  }

</script>
<style>


</style>
