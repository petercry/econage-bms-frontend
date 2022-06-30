<template>
    <div :class="{widthScreen:widthScreen}">
        <router-view ></router-view>
    </div>
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
      },
      data() {
          return {
              widthScreen:false,
          }
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

      },
      watch: {
        'sysWidth'(val){
            if(val>5000){
                this.widthScreen = true;
            }else{
                this.widthScreen = false;
            }
        }
      },
  }
</script>
<style>


</style>
