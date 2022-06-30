<template>
    <div class="editAgent">
        <el-form ref="form" v-loding="loading" :model="form" label-width="100px" style="margin-top:20px;margin-right:10px;">
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
import {getAgentInfo,editAgent} from '@/modules/integration/service/service.js'
export default{
  name:'editAgent',
  components:{

  },
  data(){
    return {
      form:{
        name:"",
        comment:""
      },
      id:"",
      loading:true,
    }
  },
  created(){
      this.id = this.$route.params.id;
      this.getAgentInfo();
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
      getAgentInfo(){
        getAgentInfo(this.id).then((response)=>{
            this.loading = false;
            this.form.name = response.data.name;
            this.form.comment = response.data.comment;
        }).catch((error)=>{
            this.loading = false;
        })
      },
      onSubmit(){
          let loadingInstance = Loading.service({ fullscreen: true,text:'保存中...'});
          editAgent(this.id,this.form).then((response) => {

               this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });

                let doObj = {}
                doObj.action = 'editAgent';
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
          });
      },
  },
  watch: {

  }
}
</script>
<style>
.editAgent{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
}
 .editAgent .btn{
    text-align: right;
    margin:10px;
}
</style>
