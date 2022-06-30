<template>
    <router-view ></router-view>
</template>
<script>

  import {sysEnv} from './config/env'
  import {loginAjax} from './service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations, mapActions} from 'vuex'
  export default {
      name:'frame',
      created(){
          window.sysEnv = sysEnv;
          this.initTheme();
          this.handleLogin();
          this.setPowerType();
          this.setAplicableModelsList();
          this.setApplicable();
          this.setAvailable();
          this.setDischarge();
          this.setModelName();
          this.setApplicationCategory();
          this.setCopestatus();
        //   this.setSpotInRegulationStatus();

          this.setTypeList();
          this.setNatureList();
          this.setVehicleList();
          this.setAuthenticationList();
          this.setStandardState();
          this.setStatusSet();
        //   this.setSpotCheckStatus();
        //   this.setRespond();
        //   this.setDfhandLing();
          this.setProfession();
        //   this.setResultState();
      },
      methods: {
          ...mapActions(['setProfession','setStatusSet','setStandardState','setAuthenticationList','setVehicleList','setNatureList','setTypeList','setCopestatus','setApplicationCategory','setPowerType','setAplicableModelsList','setApplicable','setAvailable','setDischarge','setModelName']),
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
