<template>
        <router-view></router-view>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  import {login} from './api/common.js'
  import { mapActions } from 'vuex'
  export default{
      name:'frame',
      created(){
          this.handleLogin();
      },
      methods: {

          handleLogin(){
            if(!sessionStorage.getItem('ecoToken') && sessionStorage.getItem('ecoToken') != "null"){
                login("18806723365","1234abcd").then((res)=>{
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
