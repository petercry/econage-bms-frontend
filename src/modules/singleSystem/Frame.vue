<template>
    <router-view ></router-view>
</template>
<script>

  import * as dd from 'dingtalk-jsapi'
  import openLink from 'gdt-jsapi/openLink'
  export default{
      name:'frame',
      created(){
            window.dd = dd;
            window.openLink = openLink;
            if(window.sysSetting && window.sysSetting.theme){
                this.setTheme(window.sysSetting.theme)
            }
      },
      methods: {
           setTheme(color){
                EcoUtil.toggleClass(document.body,"custom-"+color);
            }, 
      }
  }
</script>
<style>

  html,body{width:100%;height:100%;overflow:hidden;margin:0;}
  html{_height:auto;_padding:100px 0 50px;}

  html {
    background-color: #f5f5f5;
    font-size: 14px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    min-width: 300px;
    overflow-x: hidden;
    /*overflow-y: hidden;*/
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
  }

  body {
    color: #4a4a4a;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }

  .animated {
    animation-duration: .5s;
  }

  .el-tabs--border-card>.el-tabs__content{
    padding:2px
  }
</style>
