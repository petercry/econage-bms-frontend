<template>
   <eco-content top="0px" bottom="0px" class="proPlanProcess">
      <ecoContent top="0px" bottom="60px" >
            <eco-tool-title style="line-height: 38px;" title="基本信息"></eco-tool-title>
            <el-form ref="form" :model="form" label-width="110px" >

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="任务名称" prop="taskName">
                            <el-input v-model="form.taskName" readonly></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                            <el-form-item label="责任人" prop="responsibleUserId">
                                <el-input v-model="form.responsibleUserName" readonly></el-input>
                            </el-form-item>
                     </el-col>

                     <el-col :span="12">
                         <el-form-item label="计划开始日期" prop="planStartDate">
                            <el-date-picker readonly style="width:100%" type="date" v-model="form.planStartDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                     </el-col>

                      <el-col :span="12">
                         <el-form-item label="计划完成日期" prop="planCompleteDate">
                            <el-date-picker readonly style="width:100%" type="date" v-model="form.planCompleteDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                     </el-col>
                </el-row>
        </el-form>

        <eco-tool-title style="line-height: 38px;" title="办理信息"></eco-tool-title>
        <el-form ref="form" :model="form" label-width="110px">
             <el-form-item label="状态" prop="status">
                        <el-select
                                style="width:100%"
                                v-model="form.status"
                                placeholder="请选择"
                                clearable
                        >
                                <el-option
                                            v-for="(item,index) in statusOptions"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                >
                                </el-option>
                        </el-select>
                </el-form-item>

                <el-form-item label="办理情况" prop="processContent">
                        <el-input v-model="form.processContent" type="textarea" rows="4"></el-input>
                </el-form-item>

              
                <el-form-item label="交付文件" >
                        <ecoFileUploadChunk
                            style="max-width:500px"
                            modular="PRO_PLAN_PROCESS"
                            :modularInnerId="form.id"
                            ref="ecoFileUploadRef"
                            :btnFlag=true
                        ></ecoFileUploadChunk>
                </el-form-item>
              
          </el-form>
      </ecoContent>

        <eco-content bottom="0px" height="50px" >
                <div class="btn">
                    <el-button @click="cancelFunc">取消</el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                </div>
        </eco-content>



        

   </eco-content>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import ecoFileUploadChunk from '@/components/file/ecoFileUploadChunk.vue'
import {processProPlan,getProPlanSingle} from '../../service/service.js'
import {EcoUtil} from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import {Loading } from 'element-ui';


export default{
  name:'proPlanProcess',
  components:{
        ecoLoading,
        ecoContent,
        ecoToolTitle,
        tagSelect,
        ecoFileUploadChunk
  },
  data(){
    return {
        form:{
            id:null,
            projectId:null,
            taskName:null,
            responsibleUserId:null,
            responsibleUserName:null,
            planStartDate:null,
            planCompleteDate:null,
            actualCompleteDate:null,
            status:null,
            processContent:null
        },
        statusOptions:[]
    }
  },
  created(){
      this.form.id = this.$route.params.id;
      this.statusOptions.push({text:'进行中',id:'processing'});
      this.statusOptions.push({text:'已完成',id:'complete'});
      this.getProPlanSingleFunc();
  },
  mounted(){
     
  },
  methods: {

      getProPlanSingleFunc(){
          getProPlanSingle(this.form.id).then((response)=>{
                this.form.projectId = response.data.projectId;
                this.form.taskName = response.data.taskName;
                this.form.responsibleUserId = response.data.responsibleUserId;
                this.form.responsibleUserName = response.data.responsibleUserName;
                this.form.planStartDate = response.data.planStartDate;
                this.form.planCompleteDate = response.data.planCompleteDate;
                this.form.actualCompleteDate = response.data.actualCompleteDate;
                this.form.status = response.data.status;
                this.form.processContent = response.data.processContent;
          })
      },
      

      save(){
          this.$refs['form'].validate((valid) => {
                if (valid) {
                    let loadingInstance = Loading.service({ fullscreen: true,text:'正在反馈中...'});
                    processProPlan(this.form).then((res)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close();
                        });

                        let doObj = {}
                        doObj.action = 'proPlanProcessCallBack';
                        doObj.data = {};
                        doObj.close = true;
                        EcoUtil.getSysvm().callBackDialogFunc(doObj);

                    }).catch((error)=>{
                        
                        this.$message({type: 'error',message: '修改失败！'});
                    })
                } else {
                    return false;
                }
        });
    },

    cancelFunc(){
              EcoUtil.getSysvm().closeDialog();
    }

  }
}
</script>
<style scoped>

.proPlanProcess .toolbar{
    padding:10px 10px;
    background-color:#fff;
    border-bottom:1px solid #ddd;
}

.proPlanProcess .btn{
    text-align: right;
    margin-right:10px;
    margin-top:10px;
}
</style>
