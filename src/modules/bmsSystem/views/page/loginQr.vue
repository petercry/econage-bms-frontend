<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="'登陆中'"></ecoLoading>
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import {dingdingLoginAjax} from '@/modules/system2/service/service.js'
// import { Toast } from 'vant'
// import { Dialog } from 'vant';

export default {
  name:'loginQr',
  components: {
     ecoLoading
  },
  data() {
    return {
        code:'',
    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
   this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
        this.$refs.ecoLoadingRef.open();
        let code = this.$route.query.code;
        this.dingdingLoginFunc(code,null,{loginMethod:'qr'});

      },
      dingdingLoginFunc(code,corpId,data){
          console.log('ee 信息验证');
          dingdingLoginAjax(code,corpId,data).then((res)=>{
                console.log(res);
                this.$refs.ecoLoadingRef.close();
                sessionStorage.setItem('ecoToken',res.data);
                // this.$router.push({name:'index'});
                    location.href="/portalIndex/#/";
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
                location.href="/#/login";
      },
      
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
