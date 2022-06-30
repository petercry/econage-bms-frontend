<template>
    <div class="copyTemplateDialog">
        <el-form ref="form" :model="form" label-width="150px" style="margin-top:20px;margin-right:10px;" @submit.native.prevent>
          <el-form-item label="新流程模板名称：" >
            <el-input v-model="form.wf_name"></el-input>
          </el-form-item>
        </el-form>
          
        <div class="btn">
            <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {copyWFTemplate} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
        form:{
          wf_name:"",
          wftemp_id:""
        }
    }
  },
  components: {
   ecoLoading
  
  },
  created(){

    this.form.wf_name = decodeURIComponent(this.$route.params.wfName)+" 拷贝";
    this.form.wftemp_id = this.$route.params.templateId;
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
          copyWFTemplate(this.form).then((response) => {
               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
                 if(response.data.status <=99){
                        this.$message({
                            message: '复制成功',
                            showClose: true,
                            duration:2000,
                            customClass:'design-from-el-message',
                            type: 'success'
                        });
                         let doObj = {}
                          doObj.action = 'copyTemplate';
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
.copyTemplateDialog{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
 .copyTemplateDialog .btn{
    text-align: right;
    margin:10px;
}
</style>
