<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="'登陆中'"></ecoLoading>
    </div>
</template>
<script>

import {dingdingLoginAjax} from '@/modules/system2/service/service.js'
import * as dd from 'dingtalk-jsapi';
import ecoLoading from '@/components/loading/ecoLoading.vue'
// import { Toast } from 'vant'
// import { Dialog } from 'vant';

export default {
  name:'loginCheck',
  components: {
     ecoLoading
  },
  data() {
    return {
        corpId:'',
        code:'',
        // toast:null


    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
    this.corpId = this.$route.params.corpId;
    this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
          this.$refs.ecoLoadingRef.open();
        //    window.open('#/loginDisplay/'+3)
        //    return ;
           let _that = this;
           dd.ready(function() {
                // dd.ready 参数为回调函数 , 在环境准备就绪时触发 , jsapi的调用需要保证在该回调函数触发后调用，否则无效。
                dd.runtime.permission.requestAuthCode({
                    corpId:_that.corpId,
                    onSuccess: function(result) {
                        _that.code = result.code;
                        _that.dingdingLoginFunc();
                    },
                    onFail : function(err) {
                        _that.dingdingLoginError();
                    }
                });
            });
      },

      dingdingLoginFunc(){
          console.log('ee 信息验证');
          dingdingLoginAjax(this.code,this.corpId).then((res)=>{
                console.log(res);
                this.$refs.ecoLoadingRef.close();
                // sessionStorage.setItem('ecoToken',res.data);
                // this.$router.push({name:'index'});
                window.open('#/loginDisplay/'+res.data)
          }).catch((error)=>{
                console.log(error);
                this.dingdingLoginError();
          })
      },

      dingdingLoginError(){
                let that = this;
                this.$refs.ecoLoadingRef.close();
                this.$message({
                  showClose: true,
                  message: '用户验证失败',
                  type: 'error'
                });
                that.dingdingGoBack();
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
