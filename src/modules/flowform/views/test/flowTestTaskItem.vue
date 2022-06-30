<template>
    <div class="flowTestTaskItmes"  >
        <div class="errorDiv" v-show="errorData && attributeCount(errorData)> 0">
            <div>提示:</div>
            <div v-for="(value,key,idx) in errorData" :key="key">
                {{idx+1}}. {{key}} {{value}}
            </div>
        </div>
        <div class="title">当前待办</div>
        <el-card shadow="never" class="box-card taskItem" v-for="(item,idx) in taskItems" :key="idx"  v-bind:class="{active:item.id == activeTaskId}" @click.native="clickTask(item)">
                <el-row>
                    <el-col :span="12">{{item.name}}</el-col>
                    <el-col :span="12" class="taskType"><span class="status" v-bind:class="statusCalssFunc(item.status)">{{statusNameFunc(item.status)}}</span></el-col>
                </el-row>
                <el-row class="desc2">
                    <el-col :span="24">待办人员:{{item.assigneeName}}</el-col>
                </el-row>
        </el-card>
    </div>
</template>
<script>
import {getFlowTestProcessForm} from'@/flowform/service/service'
import {Loading } from 'element-ui';
export default{
   props:{
      
  },

  data(){
    return {
        taskItems:[],
        activeTaskId:null,
        errorData:null
    }
  },
  components: {
  
  },
  created(){
    
  },
  mounted(){
      
  },
  computed:{

  },
  methods: {
      setItems(items,flag){
          this.taskItems = items;
          this.errorData = null;
          if(flag){
                if(this.taskItems && this.taskItems.length > 0){
                    this.clickTask(this.taskItems[0]);
                }
          }
      },

      //1 待办 3 办理中 6 已完成 11已取消 -1 待审
      statusCalssFunc(status){
          if(status == 1){
              return 'blue';
          }else if(status == 3){
              return 'blue';
          }else if(status == 6){
              return 'green';
          }else if(status == 11){
              return 'red';
          }else if(status == -1){
              return 'blue'
          }
      },

      statusNameFunc(status){
          if(status == 1){
              return '待办';
          }else if(status == 3){
              return '办理中';
          }else if(status == 6){
              return '已完成';
          }else if(status == 11){
              return '已取消';
          }else if(status == -1){
              return '待审'
          }
      },


      /*切换环节*/
      clickTask(item){
            this.activeTaskId = item.id;
            getFlowTestProcessForm(item.id).then((response)=>{
                this.operateId = response.data.operate_id;
                this.errorData = response.data.remap;

                this.$emit('clickTask',{operateId:this.operateId,testTaskItem:item})
            })
      },

     attributeCount(obj) {
        let count = 0;
        for(let i in obj) {
            if(obj.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
                count++;
            }
        }
        return count;
    }
  }
}
</script>
<style scoped>
.flowTestTaskItmes{
    background-color: #fff;
    padding-bottom:10px;
    padding-top:10px;
}

.flowTestTaskItmes .errorDiv{
    border: 1px solid #e03a3a;
    background-color: #fef0f0;
    border-radius: 4px;
    padding: 8px 16px;
    line-height: 32px;
    font-size: 14px;
    color: #f56c6c;
    margin:0px 10px 20px 10px;
}


 .flowTestTaskItmes .title{
     padding-left:15px;
     line-height: 30px;
     height: 30px;
     vertical-align: middle;
     font-size: 14px;
     font-weight: 700;
     color: #262626;
 }

  .flowTestTaskItmes .taskItem{
     background-color: #fafafa;
     cursor: pointer;
     margin:10px 15px;
 }

 .flowTestTaskItmes .active{
     border:1px solid #1ba5fa;
 }

 .flowTestTaskItmes .taskType{
     text-align: right;
     padding-right:5px;
 }

 .flowTestTaskItmes .status{
     padding: 2px 4px;
     color: #fff;
 }

  .flowTestTaskItmes .status.green{
     background-color:#08cc15
 }

 .flowTestTaskItmes .status.blue{
      background-color:#1ba5fa
 }

  .flowTestTaskItmes .status.red{
      background-color:#e03b3a
 }

 .flowTestTaskItmes .desc2{
     margin-top:10px;
     color: #8b8b8b;
     font-size: 14px;
 }



</style>
