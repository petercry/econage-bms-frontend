<template>
    <div style="display:inline-block;width:100%;height:100%">
        <div style="display:inline-block;width:500px;border-right: 2px solid #ebebeb;padding-right:5px;">
            <el-form label-width="120px" ref="myform" :rules="rules" :model="confirmTaskObj" v-if="dataMountedFlag">
                <template v-for="(nodeEl,key) in formItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.eleType=='textarea'">
                                <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="confirmTaskObj[key]" rows="10"></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='number'">
                              <template v-if="nodeEl.paramName=='performManHour'">
                                <el-input  placeholder="请确认绩效工时" type="number" v-model="confirmTaskObj[key]" maxlength="3" :ref="nodeEl.paramName"></el-input>
                              </template> 
                              <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="confirmTaskObj[key]" ></el-input>
                              </template>
                            </template>       
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="confirmTaskObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
        </div>
        <div style="display:inline-block;width:calc(100% - 520px);vertical-align:top;height:100%;overflow-y:auto;">
            <taskInfo ref="taskInfoComponent" :taskId="taskId"></taskInfo>
        </div>
    </div>
</template>
<script>
import {getTaskDetail,dealException,addActionLogForEdit,leaderConfirmTaskAjax } from "@/modules/bmsMmm/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import {mapMutations} from 'vuex';
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
export default{
  name:'addLeaderConfirm',
  components:{
      taskInfo
  },
  data(){
    return {
      taskId:'',
      taskInfoObj:{},
      confirmTaskObj:{},
      dataMountedFlag : true,
      formItemInfo:new FormItemEl()
        .add("确认绩效工时","performManHour",'',true,'number')
        .add("任务评价","leaderConfirmDesc",'',true,'textarea'),
      rules: {
        performManHour: [
          { required: true, message: '请确认绩效工时' }
        ],
        leaderConfirmDesc: [
          { required: true, message: '请填写评价' }
        ]
      },
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
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
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.id = this.taskId;
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      //console.log("saving event");
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            leaderConfirmTaskAjax(this.taskId , this.setSaveData(this.confirmTaskObj)).then((res)=>{
                console.log("submit  done!!res.data:"+res.data);
                if (res.data&&res.data.id){
                    console.log("new id:"+res.data.id );
                    this.$message({type: 'success',message: '确认评价成功！'});
                    addActionLogForEdit(this.formItemInfo , this.taskInfoObj , this.confirmTaskObj , 'task',this.taskId , (this.taskInfoObj.requireId==null?"":this.taskInfoObj.requireId),'leaderConfirm');
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
                                try{
                                    this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getRequireListFunc();
                                }catch(e){
                                    this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.initTeamTask();
                                }
                            }
                        }
                        }
                    }
                    this.$parent.$parent.dialogVisible = false;
                }else{
                    this.$message({type: 'error',message: '确认评价失败！'});
                }
            }).catch((error)=>{
                dealException(error);
                this.$message({type: 'error',message: '确认评价失败！'});
            });
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    cleanInfo(){
       this.taskId='';
       this.confirmTaskObj={};
    },
    getTaskInfo(){
      getTaskDetail(this.taskId).then((response)=>{
        if (response.data&&response.data.id){
            this.taskInfoObj = response.data;
            //console.log("this.taskInfoObj.performManHour:"+this.taskInfoObj.performManHour);
            //console.log("this.confirmTaskObj:"+this.confirmTaskObj);
            if(typeof this.taskInfoObj.performManHour!="undefined") this.confirmTaskObj.performManHour = this.taskInfoObj.performManHour;
            if(typeof this.taskInfoObj.leaderConfirmDesc!="undefined") this.confirmTaskObj.leaderConfirmDesc = this.taskInfoObj.leaderConfirmDesc;
            this.confirmTaskObj = {...this.confirmTaskObj};
        }
      }).catch((error)=>{
         dealException(error);
      });
    }
  },
  watch: {

  }
}
</script>
