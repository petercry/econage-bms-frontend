<template>
    <div class="rateWorkFlowDialog" v-loading="loading">
        <div  v-show="showInfo">
          <div class="wfName item">
              {{wfName}}
          </div>
          <div class="item">
            <el-rate
              v-model="detailObj.score"
              show-text
              disabled
              :texts="rateTexts"
              text-color="#666">
            </el-rate>
          </div>
          <div class="item">
              {{detailObj.comment || '暂无评论'}}
          </div>
          <div class="item userInfo">
              {{detailObj.createUser}} | {{detailObj.createDate}}
          </div>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getWorkFlowRateInfo} from '@/flowform/service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
        
          wfName:"",
          wfId:"",
         detailObj:{},
        loading:true,
        showInfo:false,
        rateTexts:['非常不满意', '不满意', '一般', '满意', '非常满意']
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
    this.wfName = decodeURI(this.$route.params.wfName);
    this.wfId = this.$route.params.wfId;
    this.getWorkFlowRateInfo();
  },
  beforeDestroy() {
     
  },
  mounted(){

  },
  computed:{

  },
  methods: {
       onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      getWorkFlowRateInfo(){
        this.loading = true;
        getWorkFlowRateInfo(this.wfId).then((response) => {
            this.loading = false;
            this.showInfo = true;
            let data = JSON.parse(response.data.queryObj);
            this.detailObj = data;
           

        });
      }
      
  },
  watch: {
     
  }
}
</script>
<style scoped>
.rateWorkFlowDialog{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
 .rateWorkFlowDialog .btn{
    text-align: right;
    margin:10px;
}
.rateWorkFlowDialog .item{
  margin: 10px;
}
.wfName{
  font-size:16px;
}
.userInfo{
    color: #999;
    position: absolute;
    bottom: 0;
}
</style>
