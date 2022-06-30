<template>
    <div style="display:inline-block;width:100%;height:100%">
        <div style="display:inline-block;width:350px;border-right: 2px solid #ebebeb;padding-right:25px;">
            <el-form label-width="120px" ref="taskForm" :rules="taskFormRules" :model="taskInfoObj" v-if="dataMountedFlag">
                <template v-for="(nodeEl,key) in taskFormItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.eleType=='selectSingleUser'">
                                <el-select
                                    v-model="taskInfoObj[key]"
                                    filterable
                                    clearable
                                    remote
                                    :placeholder="'请输入'+nodeEl.desc"
                                    :remote-method="getUserListByNameQueryForTaskDealer"
                                    >
                                    <el-option
                                    v-for="userItem in userSearchResultsV['taskDealer']"
                                    :key="userItem.id"
                                    :label="userItem.mi"
                                    :value="userItem.id">
                                    </el-option>
                                </el-select>
                            </template>      
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="taskInfoObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
            <div style="text-align:center;">
                <el-button type="primary" @click.native="save()" >保 存</el-button>
            </div>
        </div>
        <div style="display:inline-block;width:calc(100% - 390px);vertical-align:top;height:100%;overflow-y:auto;">
            <taskInfo ref="taskInfoComponent" :taskId="taskId"></taskInfo>
        </div>
    </div>
</template>
<script>
import {getUserListByNameQuery,getTaskDetail,openLoading,closeLoading,dealException,updateTaskAjax,addActionLogForCreate,addActionLogForEdit } from "@/modules/bmsMmm/service/service.js";
import { formatFileSize,deleteFileDataServer } from "@/modules/bmsBa/service/service.js";
import { getProjectList } from "@/modules/bmsProject/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
import {mapMutations} from 'vuex';
export default{
  name:'changeDealer',
  components:{
      taskInfo
  },
  data(){
    return {
      taskId:'',
      taskInfoObj:{},
      oriTaskInoObj:{},
      userSearchResultsV:[],
      dataMountedFlag : false,
      taskFormItemInfo:new FormItemEl()
        .add("变更经办人","dealer",'',true,'selectSingleUser'),
      taskFormRules: {
        dealer: [
          { required: true, message: '请填写经办人' }
        ]
      }
    }
  },
  created(){
    this.taskId = this.$parent.$parent.seq_num;
    this.getTaskInfo();
  },
  mounted(){
    
  },
  methods: { 
    getUserListByNameQueryForTaskDealer(nameQuery){
      this.getUserListByNameQuery(nameQuery , 'taskDealer');
    },  
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.taskId = this.taskId;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      let formValid = false;
      this.$refs['taskForm'].validate((taskFormValid) => {
          if (taskFormValid) {
              formValid = true;
          }
      });
      //console.log("formValid:" + formValid);
      if(formValid){
        updateTaskAjax(this.taskId , this.setSaveData(this.taskInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id:"+res.data.id + "@@requireId"+res.data.requireId);
                addActionLogForEdit(this.taskFormItemInfo , this.oriTaskInoObj , this.taskInfoObj , 'task',this.taskId , (res.data.requireId==null?"":res.data.requireId),'edit');
                this.$message({type: 'success',message: '任务编辑成功！'});
                
                try{
                this.$parent.$parent.$parent.$parent.initTeamTask();
                }catch(e){ 
                    try{
                        //项目任务看板，走下面的刷新逻辑
                        this.$parent.$parent.$parent.$parent.$parent.getTaskListFunc();
                    }catch(e){
                        //看板的“任务数”中的popup弹窗中的操作
                        try{
                            this.$parent.$parent.$parent.$parent.$parent.initTeamTask();
                        }catch(e){
                            try{
                                this.$parent.$parent.$parent.$parent.$parent.$parent.initTeamTask();
                            }catch(e){
                                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getRequireListFunc();
                            }
                        }
                    }
                }
                this.$parent.$parent.dialogVisible = false;
                
              }else{
                this.$message({type: 'error',message: '任务编辑失败！'});
              }
        }).catch((error)=>{
              dealException(error);
              this.$message({type: 'error',message: '任务编辑失败！'});
        });
      }
    },
    cleanInfo(){
       this.taskId='';
       this.taskInfoObj={};
    },
    setTaskId(taskId){
      this.taskId = taskId;
    },
    async getTaskInfo(){
      getTaskDetail(this.taskId).then((response)=>{
        if (response.data&&response.data.id){
            this.taskInfoObj = response.data;
            this.oriTaskInoObj = JSON.parse(JSON.stringify(this.taskInfoObj));
            this.userSearchResultsV['taskDealer'] = [ { "id": this.taskInfoObj.dealer, "mi": this.taskInfoObj.dealerName }];
            this.userSearchResultsV = {...this.userSearchResultsV};
            this.dataMountedFlag = true;
        }
      }).catch((error)=>{
         dealException(error);
      });
    },
    cleanDialog(){

    },
    openLoading,
    closeLoading,
    getUserListByNameQuery
  },
  watch: {

  }
}
</script>
<style >

</style>
