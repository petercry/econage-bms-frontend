<template>
        <router-view></router-view>
</template>

<script>
  import {sysEnv} from './config/env'
  import {loginAjax} from './service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  export default{
      name:'frame',
      created(){
          this.listAction();
          this.handleLogin();
      },
      methods: {
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
      },
      watch: {

      }
  }

</script>
<style>


</style>
