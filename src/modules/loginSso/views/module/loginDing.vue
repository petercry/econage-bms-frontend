<template>
    <div>
     
    </div>
</template>
<script>
// import VConsole from 'vconsole/dist/vconsole.min.js'
import {EcoUtil} from '@/components/util/main.js'
// import * as dd from 'dingtalk-jsapi';
import {getPublicSetting,dingdingLoginAjax} from'../../service/service'
export default {
  name:'loginDing',
  components: {
     
  },
  data() {
    return {
      json:{},
      corpId:"",
      code:"",
      type:"",
      loginMethod:"common"
    }
  },
  created() {
    // window.vConsole = new VConsole({
    //                       defaultPlugins: ['system', 'network', 'element', 'storage'], // 可以在此设定要默认加载的面板
    //                       maxLogNumber: 1000,
    //                       onReady: function() {
    //                           // console.log('vConsole is ready.');
    //                       },
    //                       onClearLog: function() {
    //                           // console.log('on clearLog');
    //                       }
    //     });
  },
  activated(){

  },

  mounted(){
    this.json = EcoUtil.url2json(window.location.href);
    this.type = this.$route.params.type;
    if(this.type == 'edd-qr'){
      this.loginMethod = "qr";
    }else if(this.type == 'edd-qr-mobilephone'){
      this.loginMethod = "mobile_phone";
    }else if(this.type == 'edd-by-gdd-link'){
      this.loginMethod = "gdd";
    }else if (this.type =='edd-mobilephone'){
      this.loginMethod = "mobile_phone";
    }
    this.init();

  },

  computed: {
    
  },

  methods: {
      init(){
        console.log('获取公共配置信息')
          getPublicSetting().then((response) => {
            console.log(response.data);
            if(response.data.hasOwnProperty('dingding')){
                let data = response.data.dingding;
                if(data.enabled){

                    this.corpId = data.corpId;
                    if(this.type == 'edd-qr'){
                        this.code =  this.json['code'];
                        this.dingdingLoginFunc();
                        return ;
                    }
                    if(this.type == 'edd-qr-mobilephone'){
                        this.code =  this.json['code'];
                        this.dingdingLoginFunc();
                        return ;
                    }
                    let corpId = data.corpId;
                    if(corpId){
                       this.initDingConfig(corpId);
                    }else{
                       this.$emit('checkError');
                    }
                    
                  
                }else{
                   this.$emit('checkError');
                }
               
            }else{
               this.$emit('checkError');
            }
          }).catch((error) => {
            console.log(error);
               this.$emit('checkError');
          });
         
      },
      initDingConfig(corpId){
         let that = this;
            if (dd.env.platform != 'notInDingTalk') {
              dd.error(function(error){
                  console.log(error);
                    alert('dd error: ' + JSON.stringify(error));
              });
              dd.ready(function(){
                 console.log('钉钉初始化')
                      console.log(676767);
                      console.log(corpId);
                   dd.runtime.permission.requestAuthCode({
                      corpId:corpId,
                      onSuccess:function(result){
                         console.log('验证成功')
                          that.code = result.code;
                          console.log(result)
                          that.dingdingLoginFunc();
                          
                      },
                      onFail:function(err){
                        console.log('验证失败')
                          console.log(err);
                          that.dingdingLoginError();
                      }
                  });
                  
              });
             
            }else{
               
              alert('请在钉钉浏览器中打开')
              that.dingdingLoginError();
              return;
            
            }
          
      },
      dingdingLoginFunc(){
          console.log('ee 信息验证');
          dingdingLoginAjax(this.code,this.corpId,this.loginMethod).then((res)=>{
                // sessionStorage.setItem('ecoToken',res.data);
                // this.$router.push({name:'index'});
                //window.open('#/loginDisplay/'+res.data)
              
                this.$emit('checkSuccess',res.data,this.json);
          }).catch((error)=>{
                console.log(error);
                this.dingdingLoginError();
          })
      },

      dingdingLoginError(){
                let that = this;
                this.$emit('checkError');
                //that.dingdingGoBack();
      },

      dingdingGoBack(){
             dd.biz.navigation.goBack({
                    onSuccess : function(result) {
                       
                    },
                   onFail : function(err) {}
            })
      }     
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
