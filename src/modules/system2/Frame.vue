<template>
    <router-view ></router-view>
</template>
<script>

    // import VConsole from 'vconsole/dist/vconsole.min.js'

  import {EcoUtil} from '@/components/util/main.js'
  import {mapMutations} from 'vuex'
  export default{
      name:'frame',
      created(){
          this.initTheme();
            // window.vConsole = new VConsole({
            //     defaultPlugins: ['system', 'network', 'element', 'storage'], // 可以在此设定要默认加载的面板
            //     maxLogNumber: 1000,
            //     onReady: function() {
            //         // console.log('vConsole is ready.');
            //     },
            //     onClearLog: function() {
            //         // console.log('on clearLog');
            //     }
            // });
            this.$cookies.set('eco-device-info', 'pc')
      },
      methods: {
          /*初始化主题*/
          initTheme(){
                let theme = this.$cookies.get('ecoTheme');
                theme  = "3a4149";
                this.$cookies.set('ecoTheme',theme);
          //     this.setTheme(theme);
          },
          setTheme(color){
              EcoUtil.toggleClass(document.body,"custom-"+color);
          }
      }
  }
</script>
<style>


</style>
