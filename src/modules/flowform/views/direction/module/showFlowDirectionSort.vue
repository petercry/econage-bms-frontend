<template>
    <div class="flowDirectionSort" v-loading="loading">
        <div class="container">
            <draggable :list="taskList" class="list-group" handle=".handle"  v-bind="dragOptions">
                <transition-group type="transition" name="flip-list">
                    <div
                      
                        v-for="item in taskList"
                        :key="item.task_id"
                      class="task-item handle"
                    >
                        <label>
                            {{item.task_name}}
                            <span>[{{item.task_type_desc}}]</span>
                        </label>
                        <i class="icon iconfont icondrag-handle"></i>
                      
                    </div>
                </transition-group>
            </draggable>
            <div class="btn">
                  <el-button class="plainBtn" size="medium" @click="onCancel">取消</el-button>
                  <el-button type="primary" size="medium"  @click="onSubmit">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>

import {Loading } from 'element-ui';
import ecoLoading from '@/components/loading/ecoLoading.vue'
import {getAllTaskListForDesign,updateAllTaskListOrderForDesign} from '../../../service/service.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {EcoUtil} from '@/components/util/main.js'
import draggable from "../../../assets/js/vuedraggable";
export default{
  data(){
    return {
        reqId:"",
        taskList:[],
        loading:true,
        isEdit:false,
        dragOptions:{
             animation: 200,
             group: "description",
             disabled: false,
             ghostClass: "ghost",  
        }
    }
  },
  components: {
   ecoLoading,
   draggable
  
  },
  created(){
    this.reqId = this.$route.params.reqId;
    this.getAllTaskListForDesign();
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
          let loadingInstance = Loading.service({ fullscreen: true,text:'正在保存中...'});
          let array = [];
          for(let i=0;i<this.taskList.length;i++){
            let obj = {
               task_id:this.taskList[i].task_id,
               task_order:i+1
            }
            array.push(obj);
          }
          let data = {
              task_order_str:JSON.stringify(array)
          }
       
          updateAllTaskListOrderForDesign(data).then((response) => {

                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                      loadingInstance.close();
                  });
                  if(response.data.status <=99){
                        
                      let doObj = {}
                        doObj.action = 'flowDirection';
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
      getAllTaskListForDesign(){
          this.loading = true;
          getAllTaskListForDesign(this.reqId).then((response) => {
            this.loading = false;
             if(response.data.status <=99){
                  this.taskList = JSON.parse(response.data.remap.task_list);
              }

          }).catch((error) => {
             
          }); 
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
 
   .flowDirectionSort{
    width:100%;
      min-height: 100%;
      height:auto;
      position: absolute;
      background: #fff;
  }
   .container{
     padding: 20px 12px 10px;
  }
   .flowDirectionSort .btn{
    text-align: right;
    margin:20px 10px;
  }
  .flowDirectionSort .plainBtn{
      border-color: #409eff;
      color: #409eff;
      font-size: 14px;
      margin-right:10px;
  }
  .flowDirectionSort .task-item{
      background-color:rgba(0, 0, 0, .04);
      margin:10px 0;
      padding:10px 20px;
      border:1px solid #ddd;
      cursor: move;
  }
  .flowDirectionSort .task-item:focus{
      cursor: move;
  }
  .flowDirectionSort .task-item label{
      font-size:16px;
      color:#606266;
      font-weight:500;
      cursor: move;
  }
  .flowDirectionSort .task-item label span{
      font-size:12px;
      color:#8b8b8b;
  }
  .flowDirectionSort .task-item .icondrag-handle{
      color:#409EFF;
      font-size:30px;
      float:right;
      line-height: 23px;
  }
</style>
