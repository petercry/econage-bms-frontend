<template>
    <router-view ></router-view>
</template>
<script>

  import {sysEnv} from '../standardization/config/env'
  import {loginAjax} from '../standardization/service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapActions} from 'vuex'
  export default {
      name:'frame',
      created(){
          window.sysEnv = sysEnv; 
          this.initTheme();
          this.handleLogin();
          this.setStandardType();
          this.setStandardStatusName();
          this.setRevisionTypeNameList();
          this.setParticipationForm();
          this.setGbType();
          this.setProfession();
      },
      methods: {
          ...mapActions(['setProfession','setGbType','setStandardType','setStandardStatusName','setRevisionTypeNameList','setParticipationForm']),
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
            if(!sessionStorage.getItem('ecoToken') && sessionStorage.getItem('ecoToken') != "null"){
                    loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
              }
          },

      }
  }
</script>
<style>


</style>
