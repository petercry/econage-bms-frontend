<template>

        <router-view></router-view>
</template>

<script>
    // import VConsole from 'vconsole/dist/vconsole.min.js'
  export default{
      name:'frame',
      created(){
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
      },
      methods: {
       
      },
      watch: {

      }
  }

</script>
<style>


</style>
