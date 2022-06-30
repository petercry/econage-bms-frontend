<template>
    <router-view ></router-view>
</template>
<script>

  import {loginAjax} from '@/modules/bmsSystem/service/service.js'
  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations} from 'vuex'
  import * as dd from 'dingtalk-jsapi'
  
  export default{
      name:'frame',
      created(){
            window.dd = dd;
            
            if(window.sysSetting.theme){
                this.setTheme(window.sysSetting.theme)
            }
      },
      methods: {
            /*初始化主题*/
            initTheme(){
                    let theme = this.$cookies.get('ecoTheme');
                    theme  = "2F54B6";
                    this.$cookies.set('ecoTheme',theme);
            //    this.setTheme(theme);
            },

            setTheme(color){
                EcoUtil.toggleClass(document.body,"custom-"+color);
            }, 

      }
  }
</script>
<style>


</style>
