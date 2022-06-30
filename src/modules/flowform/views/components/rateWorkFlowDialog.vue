<template>
    <div class="rateWorkFlowDialog">
        <div class="wfName item">
            {{form.wfName}}
        </div>
        <div class="item">
          <el-rate
            v-model="form.score"
            show-text
            :texts="rateTexts"
            text-color="#666">
          </el-rate>
        </div>
        <div class="item">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 99}"
            placeholder="请输入内容"
            v-model="form.comments">
          </el-input>
        </div>
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {rateWorkFlow} from '@/flowform/service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
        form:{
          wfName:"",
          wfId:"",
          score:5,
          comments:"",
        },
        rateTexts:['非常不满意', '不满意', '一般', '满意', '非常满意']
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
    this.form.wfName = decodeURI(this.$route.params.wfName);
    this.form.wfId = this.$route.params.wfId;
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
      onSubmit(){
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在复制...'});
          rateWorkFlow(this.form).then((response) => {

               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
                 if(response.data.success){
                        this.$message({
                            message: '评价成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                         let doObj = {}
                          doObj.action = 'rateWorkFlow';
                          doObj.data = {};
                          doObj.close = true;
                          EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }

          }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
          });
      },
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
</style>
