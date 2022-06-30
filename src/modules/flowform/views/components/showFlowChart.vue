<template>
    <div class="flowChart">
        <ecoLoading ref='ecoLoadingRef' text='加载中...'></ecoLoading>
        <iframe ref="flowChartClient" class="directionClient" v-bind:src="getIframeSrc"></iframe>
        <!-- <iframe ref="flowChartClient" class="directionClient" v-bind:src="'/static/directionClient/index.html'"></iframe> -->
    </div>
</template>
<script>
import {sysEnv} from '../../config/env.js'
import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default{
  data(){
    return {
       _window:{}
    }
  },

  components: {
   ecoLoading

  },
  created(){

  },
  beforeDestroy() {

  },
  mounted(){
    this.initIframe();
  },
  computed:{
        getIframeSrc(){
            if(sysEnv == 0){
                return '/static/directionClient/index.html';
            }else{
                if(window.sysSetting && window.sysSetting.ngrootUrl){
                    return window.sysSetting.ngrootUrl + '/assets/directionClient/index.html';
                }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
                    return window.parent.sysSetting.ngrootUrl + '/assets/directionClient/index.html';
                }else{
                    return '/assets/directionClient/index.html'
                }
            }
        },
  },
  methods: {
       async initIframe(){
            this.$refs.ecoLoadingRef.open();
            this._window = this.$refs.flowChartClient.contentWindow;
            this._window.reqId = this.$route.params.wfId;
             this._window.formId = '';
            this._window.onLoading = this.$refs.ecoLoadingRef.open;
            this._window.onClose = this.close_;
            this._window.readonlyXml = true;//只读
            this._window.showError = this.showError;
            this._window.ecoToken = sessionStorage.getItem('ecoToken');
       },
        close_(){
            this.$refs.ecoLoadingRef.close();
        },

        showError(msg){
            this.$message({
                showClose: true,
                duration:2000,
                message: msg,
                customClass:'design-from-el-message',
                type: 'warning'
            });
        }
  },
  watch: {

  }
}
</script>
<style scoped>

   .directionClient{
    width:100%;
    height: 100%;
    position: absolute;
  }
</style>
