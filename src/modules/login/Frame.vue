<template>

        <router-view></router-view>
</template>

<script>
  import {EcoUtil} from '@/components/util/main.js'
  export default{
      name:'frame',
      created(){
      //    this.initTheme();
          this.listAction();
      },
      methods: {
          /*初始化主题*/
          initTheme(){
              let theme ;
              try{
                  theme =   window.parent.window.sysvm.getEcoCookie();
              }catch(e){}
              if(!theme){
                  theme = '1ba5fa';
              }
              this.setTheme(theme);
          },
          setTheme(color){
              EcoUtil.toggleClass(document.body,"custom-"+color);
          },
          //监听dialog 回写事件
          listAction(){
              let that =this;
              let callBackDialogFunc = function(obj){
                  if(obj && obj.action == 'setEcoThemeCallBack'){
                      that.initTheme();
                  }
              }
              EcoUtil.addCallBackDialogFunc(callBackDialogFunc,'FRAME');
          },
      },
      watch: {

      }
  }

</script>
<style>


</style>
