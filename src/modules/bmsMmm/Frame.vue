<template>
    <router-view ></router-view>
</template>
<script>

  import {sysEnv} from './config/env'
  import {loginAjax} from './service/service.js'
  import {loadOpRole} from './util/utility.js'
  
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations} from 'vuex'

  export default{
      name:'frame',
      created(){
          this.initTheme();
          this.handleLogin();
          this.initData();
          window.sysEnv = sysEnv;
      },
      methods: {
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
          async handleLogin(){
                if(false&&sysEnv == 0){
                    await loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
                }
          },
          async initData(){
              await this.loadOpRole(false);
          },
          loadOpRole  
      }
  }
</script>
<style>


</style>
