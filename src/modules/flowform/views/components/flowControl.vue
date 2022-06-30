<template>
    <div class="flowControl">
        <div class="container" v-loading="loading">
            <div class="name">
                <p>操作节点</p>
                <el-select @change="driveTaskChange" placeholder="请选择操作节点" style="width: 100%;" v-model="chooseIndex">
                    <el-option
                      :key="index"
                      v-for="(item,index) in driveTaskList"
                      :label="item.task_name"
                      :disabled="item.task_level == 1 && activeName == 3 "
                      :value="index">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-tabs v-model="activeName" :before-leave="checkEdit">
                  <el-tab-pane label="更改节点状态" name="1">
                      <div class="box">
                          <el-row>
                            <p style="margin:0;">节点当前状态：<span style="color:#000">{{status_desc}}</span></p>
                          </el-row>
                          <el-row>
                            <p>状态更改为</p>
                            <el-select placeholder="请选择状态" style="width: 100%;" v-model="target_status_flag">
                                <el-option
                                :key="index"
                                v-for="(item,index) in statusOption"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                          </el-row>
                      </div>
                  </el-tab-pane>
                  <el-tab-pane label="更改人员办理状态" name="2">
                       <div class="box">
                          <el-row>
                            <p style="margin:0px 0 10px 0;">节点人员</p>
                            <el-select placeholder="请选择" style="width: 100%;" @change="processTaskChange" v-model="process_index" popper-class="flowControlSelect">
                                <el-option
                                :key="index"
                                v-for="(item,index) in processTaskList"
                                :label="item.assignee_name"
                                :value="index">
                                </el-option>
                            </el-select>
                          </el-row>
                          <el-row v-if="process_index== '0' || process_index>0">
                            <p style="margin:10px 0 0px 0;">节点当前状态：<span style="color:#000">{{process_status_desc}}</span></p>
                          </el-row>
                          <el-row>
                            <p>状态更改为</p>
                            <el-select placeholder="请选择状态" style="width: 100%;" v-model="target_status_flag">
                                <el-option
                                :key="index"
                                v-for="(item,index) in statusOption"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                          </el-row>
                      </div>
                  </el-tab-pane>
                  <el-tab-pane label="更改节点办理人员" name="3">
                     <div class="box">
                       <el-row>
                            <p style="margin:0px 0 10px 0;">节点人员</p>
                            <el-select placeholder="请选择" style="width: 100%;" v-model="task_idfor3" popper-class="flowControlSelect">

                                <el-option
                                    label="全部"
                                    v-if="processTaskList.length>0"
                                    :value=0>
                                </el-option>

                                <el-option
                                    :key="index"
                                    v-for="(item,index) in processTaskList"
                                    :label="item.assignee_name"
                                    :value="item.task_id">
                                </el-option>

                            </el-select>
                        </el-row>
                        <el-row>
                            <p>办理人更改为</p>
                            <tag-select
                                  ref="tagSelect1"
                                  placeholder="请选择角色或人员"
                                  style="width: 100%;vertical-align: top;"
                                  :initDataStr="assignee"
                                  :initOptions="{selectNum:0,selectType:'User-Role'}"
                                  @callBack="tagSelectCB" >
                            </tag-select>

                        </el-row>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="添加同环节办理人员" name="4">
                    <div class="box">
                        <el-row>
                            <p>添加办理人</p>

                            <tag-select
                                ref="tagSelect2"
                                placeholder="请选择办理人"
                                style="width: 100%;vertical-align: top;"
                                :initDataStr="assigneeFor4"
                                :initOptions="{selectNum:0,selectType:'User-Role'}"
                                @callBack="tagSelectCB4" >
                            </tag-select>
                        </el-row>
                    </div>
                  </el-tab-pane>

                </el-tabs>
            </div>
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
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import tagSelect from '../../views/direction/module/tagSelect.vue'
import {getDriveTaskList,changeTaskStatusForLevel,changeTaskStatus,getProcessTaskListByTaskLevel,changeTaskAssingee,addTaskLevelAssignee} from '../../service/service.js'
export default{
  data(){
    return {
      value:"",
      activeName:"1",
      wfId:"",
      driveTaskList:[],
      loading:true,
      chooseIndex:"",
      task_level:"",
      status_desc:"",
      process_status_desc:"",
      value1:"",
      statusOption:[
      {
        name:"未到达",
        value:"to_pending"
      },
      {
        name:"待办",
        value:"to_assigned"
      },
      {
        name:"办理中",
        value:"to_working"
      },
      {
        name:"已完成",
        value:"to_completed"
      },
      {
        name:"已取消",
        value:"to_canceled"
      }
      ],
      target_status_flag:"",
      isEdit:false,
      task_id:"",
      task_idfor3:"",
      process_index:"",
      processTaskList:[],
      assignee:"",
      assigneeFor4:"",
    }
  },
  components: {
   ecoLoading,
   tagSelect

  },
  created(){
      this.wfId = this.$route.params.wfId;
      this.getDriveTaskList();

  },
  beforeDestroy() {

  },
  mounted(){

  },
  computed:{

  },
  methods: {
      getDriveTaskList(){
          this.loading = true;
          getDriveTaskList(this.wfId).then((response) => {
              this.loading = false;
              if(response.data.status<100){
                  this.driveTaskList = JSON.parse(response.data.remap.task_list);

              }
              console.log(this.driveTaskList);

          }).catch((error) => {
              this.loading = false;
          });
      },

      changeTaskStatusForLevel(){
          let data = {
            wf_id:this.wfId,
            task_level:this.task_level,
            target_status_flag:this.target_status_flag
          }
          this.loading = true;
          changeTaskStatusForLevel(data).then((response) => {
              this.loading = false;
              if(response.data.status<100){
                    let doObj = {}
                    doObj.action = 'flowControl';
                    doObj.data = {};
                    doObj.close = true;
                    EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }
          }).catch((error) => {
              this.loading = false;
          });
      },

      changeTaskStatus(){
          let data = {
            wf_id:this.wfId,
            task_id:this.task_id,
            target_status_flag:this.target_status_flag
          }
          this.loading = true;
          changeTaskStatus(data).then((response) => {
              this.loading = false;
              if(response.data.status<100){
                  let doObj = {}
                  doObj.action = 'flowControl';
                  doObj.data = {};
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }

          }).catch((error) => {
              this.loading = false;
          });
      },
      getProcessTaskListByTaskLevel(){

          getProcessTaskListByTaskLevel(this.wfId,this.task_level).then((response) => {
              if(response.data.status<100){
                  this.processTaskList = JSON.parse(response.data.remap.task_list);

              }

          }).catch((error) => {

          });
      },

      driveTaskChange(index){
            this.task_level = this.driveTaskList[index].task_level;
            this.status_desc = this.driveTaskList[index].status_desc;

            this.process_index = '';
            this.task_idfor3 = '';
            this.$refs.tagSelect1.clearTag();

            this.getProcessTaskListByTaskLevel();
      },
      processTaskChange(index){
        this.task_id = this.processTaskList[index].task_id;
        this.process_status_desc = this.processTaskList[index].status_desc;
      },
      checkEdit(activeName,oldActiveName){
         if(this.task_level == 1 && activeName == 3) {
            this.chooseIndex = "";
         }
         if(this.isEdit){
              let that = this;
             var p = new Promise((resolve, reject) => {
               let callBack = function(){
                  that.target_status_flag = "";
                  that.isEdit = false;
                  that.task_level = "";
                  that.status_desc = "";
                  that.chooseIndex = "";
                  that.process_index = "";
                  that.task_id = "";
                  that.process_status_desc = "";
                  that.processTaskList = [];
                  that.assignee = "";
                  resolve()
              }
              let cancelCallBack = function(){
                   reject()
              }
               EcoMessageBox.confirm('有未保存内容，是否离开？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                },callBack,cancelCallBack);
            })
            return p;
         }
      },
      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },
      onSubmit(){
          if(!this.chooseIndex && this.chooseIndex != '0' ){
             EcoMessageBox.alert('请选择操作节点','提示');
             return;
          }
          if(this.activeName == "1"){
               if(!this.target_status_flag){
                  EcoMessageBox.alert('请选择变更状态','提示');
                  return;
                }
              this.changeTaskStatusForLevel();
          }else if(this.activeName == "2"){
               if(!this.target_status_flag){
                  EcoMessageBox.alert('请选择变更状态','提示');
                  return;
                }
              if(!this.process_index && this.process_index != '0'){
                  EcoMessageBox.alert('请选择节点人员','提示');
                  return;
              }
              this.changeTaskStatus();
          }else if(this.activeName == "3"){
              if(!this.task_idfor3 && this.task_idfor3 != '0'){
                  EcoMessageBox.alert('请选择节点人员','提示');
                  return;
              }
              if(!this.assignee && this.assignee != '0'){
                  EcoMessageBox.alert('请选择更改的办理人员或角色','提示');
                  return;
              }
              this.changeTaskAssingee();
          }else if(this.activeName == "4"){
              if(!this.assigneeFor4 && this.assigneeFor4 != '0'){
                  EcoMessageBox.alert('请选择办理人','提示');
                  return;
              }
              this.addTaskLevelAssignee();
          }
      },
      changeTaskAssingee(){
         let data = {
              wf_id:this.wfId,
              task_id:this.task_idfor3,
              task_level:this.task_level,
              assignee:this.assignee
          }
          this.loading = true;
          changeTaskAssingee(data).then((response) => {
              this.loading = false;
              if(response.data.status<100){
                  let doObj = {}
                  doObj.action = 'flowControl';
                  doObj.data = {};
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }

          }).catch((error) => {
             this.loading = false;
          });
      },

      addTaskLevelAssignee(){
          let data = {
            wf_id:this.wfId,
            task_level:this.task_level,
            assignee:this.assigneeFor4
          }
          this.loading = true;
          addTaskLevelAssignee(data).then((response) => {
              this.loading = false;
              if(response.data.status<100){
                  let doObj = {}
                  doObj.action = 'flowControl';
                  doObj.data = {};
                  doObj.close = true;
                  EcoUtil.getSysvm().callBackDialogFunc(doObj);
              }

          }).catch((error) => {
             this.loading = false;
          });
      },
      tagSelectCB(data){
        this.assignee = data.id;
      },

      tagSelectCB4(data){
         this.assigneeFor4 = data.id;
      }
  },
  watch: {
     target_status_flag(newValue,oldValue){
        if(newValue && newValue != oldValue){
            this.isEdit = true;
        }else{
            this.isEdit = false;
        }
     }
  }
}
</script>
<style scoped>

   .flowControl{
    width:100%;
    min-height: 100%;
    height:auto;
    position: absolute;
    background: #fff;
  }
  .container{
     padding: 20px 12px 10px;
  }
  .name{
    margin-bottom:20px;
  }
  .flowControl p{
    color: #8b8b8b;
    margin:10px 0;
  }
  .flowControl .box{
    padding: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
    height:200px;
  }
  .flowControl .btn{
    text-align: right;
    margin:10px;
  }
  .flowControl .plainBtn{
      border-color: #409eff;
      color: #409eff;
      font-size: 14px;
      margin-right:10px;
  }
</style>
<style>
.flowControlSelect{
  width:500px;
}

.flowControlSelect .el-select-dropdown__item{
    text-overflow:unset;
    overflow: unset;
}
</style>
