<template>
    <router-view ></router-view>
</template>
<script>

  import {sysEnv} from '@/modules/integration/config/env'
  import {loginAjax} from '@/modules/integration/service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations} from 'vuex'
  export default{
      name:'frame',
      created(){
          this.initTheme();
          this.handleLogin();
          this.setWebConfig();
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

          handleLogin(){
              if(sysEnv == 0){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
              }
          },

        setWebConfig(){
              try{
                  if( EcoUtil.getSysvm().getWebPlatform &&  EcoUtil.getSysvm().getWebPlatform()){
                        document.body.classList.add('webPlatform');
                  }
              }catch(e){ 
                
              }
          }

      }
  }
</script>
<style>


</style>
