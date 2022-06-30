<template>
    <div class="addAgent">
        <el-form ref="form" :model="form" label-width="100px" style="margin-top:20px;margin-right:10px;">
          <el-form-item label="Agent名称" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 99}" v-model="form.comment"></el-input>
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
import {EcoUtil} from '@/components/util/main.js'
import {addAgent} from '@/modules/integration/service/service.js'
export default{
  name:'addAgent',
  components:{

  },
  data(){
    return {
      form:{
        name:"",
        comment:""
      }
    }
  },
  mounted(){

  },
  methods: {
      onCancel(){
          if(EcoUtil.getSysvm()){
              EcoUtil.getSysvm().closeDialog();
          }else{
              window.parent.ecoTodoVm.closeDialog();
          }
      },
      onSubmit(){
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在添加...'});
          addAgent(this.form).then((response) => {

               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });

                let doObj = {}
                doObj.action = 'addAgent';
                doObj.data = {};
                doObj.close = true;
                if(EcoUtil.getSysvm()){
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
                }else{
                    window.parent.ecoTodoVm.callBackDialogFunc(doObj);
                }


          }).catch((error) => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
                console.log(error)
          });
      },
  },
  watch: {

  }
}
</script>
<style>
.addAgent{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
 .addAgent .btn{
    text-align: right;
    margin:10px;
}
</style>
