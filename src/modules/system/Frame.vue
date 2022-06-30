<template>
    <router-view v-show="iframeShowElement && iframeShowEco"></router-view>
</template>
<script>
    import {loginAjax} from '@/modules/bmsBa/service/service.js'
  import {sysEnv} from '@/modules/bmsMmm/config/env'
  import {EcoUtil} from '@/components/util/main.js'
  import * as dd from 'dingtalk-jsapi'
  import openLink from 'gdt-jsapi/openLink'
  import {mapState,mapMutations} from 'vuex'

  export default{
      name:'frame',
      data(){
            return {
                iframeShowElement:false,
                iframeShowEco:false,
                themeMapElement:{}, //element 主题样式
                themeMapEco:{}, //自定义主题样式

                ecoBodySizeClassName:null,
                ecoBodySizeIframeShow:false,
                ecoBodySizeMap:{}
            }
       },
       computed:{
            ...mapState([
                'settingChange',
            ])
        },
       created(){
           console.log("start to login.....");
            this.handleLogin();
            window.dd = dd;
            window.openLink = openLink;

            if(window.sysSetting.theme){
                this.setTheme(window.sysSetting.theme)
            }else{
                this.iframeShowElement = true;
                this.iframeShowEco = true;
            }

            this.setFontSize();

       },
       methods: {
             async handleLogin(){
                if(false&&sysEnv == 0){
                    await loginAjax().then((res)=>{
                        sessionStorage.setItem('ecoToken',res.data);
                    })
                }
          },
            setTheme(color){
                EcoUtil.toggleClass(document.body,"custom-"+color);

                this.iframeShowEco = false;
                this.iframeShowElement = false;

                let _that = this;
                if(_that.themeMapEco[String(color)]){ //已经加载主题颜色
                    _that.iframeShowEco = true;
                }else{
                     let _css;
                    if(sysEnv == 1){
                        _css = '/assets/theme/'+color+'/ecoTheme.css?v='+new Date().getTime();
                    } else {
                        _css = '/static/assets/theme/'+color+'/ecoTheme.css?v='+new Date().getTime();
                    }
                    EcoUtil.dynamicLoading.css(_css,function(){
                            _that.iframeShowEco = true;
                            _that.iframeShowElement = true;
                            _that.themeMapEco[String(color)] = 1;
                        });
                    }

                    // if(_that.themeMapElement[String(color)]){ //已经加载element主题颜色
                    //    _that.iframeShowElement = true;
                    // }else{
                    //     EcoUtil.dynamicLoading.css('/assets/theme/'+color+'/index.css',function(){
                    //         _that.iframeShowElement = true;
                    //         _that.themeMapElement[String(color)] = 1;
                    //     },'before');
                    // }
                },

                //设置字体大小
                setFontSize(){
                        let ecoBodySize = null;
                        try {
                            ecoBodySize =  localStorage.getItem("ecoBodySize");
                        } catch (e) {}

                        if (ecoBodySize) {
                            if(this.ecoBodySizeClassName){
                                document.body.classList.remove(this.ecoBodySizeClassName);
                            }
                            document.body.classList.add(ecoBodySize);
                            this.ecoBodySizeClassName = ecoBodySize;

                            this.ecoBodySizeIframeShow = false;
                            let _that = this;
                            if(_that.ecoBodySizeMap[String(ecoBodySize)]){ //已经加载字体大小
                                    _that.ecoBodySizeIframeShow = true;
                            }else{
                                EcoUtil.dynamicLoading.css('/assets/fontSize/system/'+ecoBodySize+'.css?v='+new Date().getTime(),function(){
                                    _that.ecoBodySizeIframeShow = true;
                                    _that.ecoBodySizeMap[String(ecoBodySize)] = 1;
                                });
                            }
                        }else{
                            this.ecoBodySizeIframeShow = true;
                        }
                }
        },
        watch:{
            settingChange(value,oldValue){
                this.setFontSize();
            }
        }
  }
</script>
<style>


</style>
