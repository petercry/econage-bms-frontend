<template>
        <router-view></router-view>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {login} from './api/common.js'
  import {sysEnv} from './config/env'
  import { mapActions } from 'vuex'
  export default{
      name:'frame',
      created(){

          if(sysEnv == 0){
            this.handleLogin();
          }
      },
      methods: {
          handleLogin(){
            if(!sessionStorage.getItem('ecoToken') || sessionStorage.getItem('ecoToken') == "null" || sessionStorage.getItem('ecoToken') == "underfined"){
                login("admin","Econage123!").then((res)=>{
                   this.$ecoToken.setToken(res);
                })
            }
          }
      },
      watch: {

      }
  }

</script>
<style>


</style>
