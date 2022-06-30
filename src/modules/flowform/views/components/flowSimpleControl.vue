<template>
    <div class="flowControl">
        <div class="container" v-loading="loading">

            <div class="name">
                <p>操作节点</p>

                <el-select @change="driveTaskChange" placeholder="请选择操作节点" style="width: 100%;" v-model="chooseIndex">
                    <el-option
                      v-show="item.status_id == 1 || item.status_id == 3"
                      :key="index"
                      v-for="(item,index) in driveTaskList"
                      :label="item.task_name"
                      :value="index">
                    </el-option>
                </el-select>
            </div>

            <div>
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
                                  v-show="item.status_id == 1 || item.status_id == 3"
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
import {getDriveTaskList,getProcessTaskListByTaskLevel,changeTaskAssingee} from '../../service/service.js'
export default{
  data(){
    return {
      value:"",
      activeName:"3",
      wfId:"",
      driveTaskList:[],
      loading:true,
      chooseIndex:null,
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
                  this.driveTaskList = this.driveTaskList.filter(single => single.status_id == 1 || single.status_id == 3);
                  if(this.driveTaskList.length > 0){
                      this.chooseIndex = 0;
                  }else{
                      this.chooseIndex = null;
                  }

                  this.driveTaskChange(0);
              }

              // for(let i = 0;i<this.driveTaskList.length;i++){
              //     if(this.driveTaskList[i].status_id ==1 || this.driveTaskList[i].status_id == 3){
              //         this.chooseIndex = i;
              //         this.driveTaskChange(i);
              //         break;
              //     }
              // }
          }).catch((error) => {
              this.loading = false;
          });
      },


      getProcessTaskListByTaskLevel(){
          getProcessTaskListByTaskLevel(this.wfId,this.task_level).then((response) => {
              if(response.data.status<100){
                  this.processTaskList = JSON.parse(response.data.remap.task_list);
                  if(this.processTaskList.length > 0){
                      this.task_idfor3 = 0;
                  }
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

      onCancel(){
          EcoUtil.getSysvm().closeDialog();
      },

      onSubmit(){

          if(this.chooseIndex == null || ( !this.chooseIndex && this.chooseIndex != '0')){
             EcoMessageBox.alert('请选择操作节点','提示');
             return;
          }

          if(!this.task_idfor3 && this.task_idfor3 != '0'){
                  EcoMessageBox.alert('请选择节点人员','提示');
                  return;
          }

          if(!this.assignee && this.assignee != '0'){
                  EcoMessageBox.alert('请选择更改的办理人员或角色','提示');
                  return;
          }
          this.changeTaskAssingee();

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
