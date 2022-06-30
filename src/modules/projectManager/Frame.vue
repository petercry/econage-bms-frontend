<template>
        <router-view></router-view>

</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {login} from './api/common.js'
  import { mapActions } from 'vuex'
  import {sysEnv} from './config/env'
  export default{
      name:'frame',
      created(){
          window.sysEnv = sysEnv;
          if(sysEnv == 0){
            this.handleLogin();
          }
         
      },
      methods: {
          handleLogin(){
            if(!sessionStorage.getItem('ecoToken') && sessionStorage.getItem('ecoToken') != "null"){
                login("admin","Econage123!").then((res)=>{
                   this.$ecoToken.setToken(res);
                })
            }else{
               //this.$router.replace({name:'projectList'});
            }
          }
      },
      watch: {

      }
  }

</script>
<style>


</style>
