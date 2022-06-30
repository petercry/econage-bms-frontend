<template>
    <router-view ></router-view>
</template> 
<script>

  import {sysEnv} from './config/env'
  import {loginAjax} from './service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations,mapActions} from 'vuex'
  export default {
      name:'frame',
      created(){
          window.sysEnv = sysEnv;
          this.initTheme();
          this.handleLogin();
          this.setTypeList();
          this.setNatureList();
          this.setVehicleList();
          this.setAuthenticationList();
          this.setAplicableModelsList();
          this.setPowerType();
          this.setStandardState();
          this.setStatusSet();
      },
      methods: {
          ...mapActions(['setTypeList','setNatureList','setVehicleList','setAuthenticationList','setAplicableModelsList','setPowerType','setStandardState','setStatusSet']),
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
                if(!sessionStorage.getItem('ecoToken') && sessionStorage.getItem('ecoToken') != "null"){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
                }
              }
          },

      }
  }
</script>
<style>


</style>
