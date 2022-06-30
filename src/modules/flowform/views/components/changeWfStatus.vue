<template>
    <div class="changeWfStatus">
        <div class="container">
            <el-row>
                <p>流程当前状态：<span style="color:#000">{{status}}</span></p>
               
            </el-row>
            <el-row>
                <p>状态更改为</p>
                <el-select placeholder="请选择状态" style="width: 100%;" v-model="changeStatus">
                     <el-option
                      :key="index"
                      v-for="(item,index) in statusOption"
                      :label="item.name"
                      :value="item.value">
                      </el-option>

                </el-select>
            </el-row>
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
import {changeWfStatus} from '../../service/service.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
export default{
  data(){
    return {
      status:"",
      changeStatus:"",
      statusOption:[
      {
        name:"进行中",
        value:"to_working"
      },
      {
        name:"已完成(正常结束)",
        value:"to_normal_end"
      },
      {
         name:"已完成(驳回结束)",
        value:"to_abnormal_end"
      },
      {
        name:"已取消",
        value:"to_canceled"
      }
      ],
      wfId:""
    }
  },
  components: {
   ecoLoading
  
  },
  created(){
     this.status = decodeURI(this.$route.params.folder);
     this.wfId = decodeURI(this.$route.params.wfId);
  },
  beforeDestroy() {
     
  },
  mounted(){

  },
  computed:{

  },
  methods: {
      onCancel(){
          let errorBack = function(){
              EcoUtil.getSysvm().closeDialog();
          }
          if(this.changeStatus == "to_canceled"){
               EcoMessageBox.confirm('确定要取消该流程吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                },this.changeWfStatus,errorBack);
          }else{
              EcoUtil.getSysvm().closeDialog();
          }
      },
      onSubmit(){
          this.changeWfStatus(); 
      },
      changeWfStatus(){
        if(!this.changeStatus){
            EcoMessageBox.alert('请选择变更状态','提示');
            return;
        }
        let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存中...'});
        let data = {
            wf_id:this.wfId,
            target_status_flag:this.changeStatus
        }
        changeWfStatus(data).then((response) => {

                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
                    if(response.data.status <=99){
                          
                        let doObj = {}
                          doObj.action = 'changeWfStatus';
                          doObj.data = {};
                          doObj.close = true;
                          EcoUtil.getSysvm().callBackDialogFunc(doObj);
                    }

              }).catch((error) => {
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });
              });
      }
  },
  watch: {
     
  }
}
</script>
<style scoped>
 
   .changeWfStatus{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
  }
  .container{
     padding: 20px 12px 10px;
  }
  .changeWfStatus p{
    color: #8b8b8b;
    margin:5px 0;
  }
  .changeWfStatus .btn{
    text-align: right;
    margin:10px;
  }
  .changeWfStatus .plainBtn{
      border-color: #409eff;
      color: #409eff;
      font-size: 14px;
      margin-right:10px;
  }
</style>
