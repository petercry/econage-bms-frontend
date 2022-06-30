<template>
    <div style="display:inline-block;width:100%;height:100%">
        <div style="display:inline-block;width:620px;border-right: 2px solid #ebebeb;padding-right:5px;">
            <el-form label-width="120px" ref="myform" :rules="rules" :model="calendarInfoObj" v-if="dataMountedFlag">
                <template v-for="(nodeEl,key) in formItemInfo" >
                    <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                        <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                            <template v-if="nodeEl.paramName=='priority'">
                              <div>
                                <el-radio v-model="calendarInfoObj[key]" label="1" border class="priority1">1</el-radio>
                                <el-radio v-model="calendarInfoObj[key]" label="2" border class="priority2">2</el-radio>
                                <el-radio v-model="calendarInfoObj[key]" label="3" border class="priority3">3</el-radio>
                              </div>
                            </template>
                            <template v-else-if="nodeEl.eleType=='date'">
                                <el-date-picker v-model="calendarInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                            </template>
                            <template v-else-if="nodeEl.eleType=='textarea'">
                                <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="calendarInfoObj[key]" rows="10"></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='number'">
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model.number="calendarInfoObj[key]" ></el-input>
                            </template>   
                            <template v-else-if="nodeEl.eleType=='selectSingleUser'">
                                <el-select
                                    v-model="calendarInfoObj[key]"
                                    filterable
                                    clearable
                                    remote
                                    :placeholder="'请输入'+nodeEl.desc"
                                    :remote-method="getUserListByNameQuery"
                                    >
                                    <el-option
                                    v-for="userItem in userSearchResultsV"
                                    :key="userItem.id"
                                    :label="userItem.mi"
                                    :value="userItem.id">
                                    </el-option>
                                </el-select>
                            </template>      
                            <template v-else>
                                <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="calendarInfoObj[key]" ></el-input>
                            </template>
                        </el-form-item>
                    </div>
                </template>
            </el-form>
        </div>
        <div style="display:inline-block;width:calc(100% - 640px);vertical-align:top;height:100%;overflow-y:auto;">
            <taskInfo ref="taskInfoComponent" :taskId="taskId"></taskInfo>
        </div>
    </div>
</template>
<script>

import {addTaskCalendarPlanAjax,getUserListByNameQuery,getTaskDetail,dealException,addActionLogForCreate,addActionLogForEdit } from "@/modules/bmsMmm/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import {mapMutations} from 'vuex';
import taskInfo from "@/modules/bmsMmm/component/taskInfo.vue";
export default{
  name:'addPlan',
  components:{
      taskInfo
  },
  data(){
    return {
      taskId:'',
      taskInfoObj:{},
      calendarInfoObj:{},
      userSearchResultsV:[],
      dataMountedFlag : false,
      formItemInfo:new FormItemEl()
        .add("计划日期","date",'',true,'date')
        .add("计划完成度 (%)","planRate",'',true,'number')
        .add("日程优先级","priority",'',true,'')
        .add("备注","planComments",'',true,'textarea')
        .add("计划经办人","dealer",'',true,'selectSingleUser'),
      rules: {
        date: [
          { required: true, message: '请设定计划日期' }
        ],
        planRate:[
          { required: true, message: '请填写计划完成度', trigger: 'blur' },
          { type: 'number', message: '计划完成度必须为0-100的数值'}
        ],
        dealer: [
          { required: true, message: '请指定经办人', trigger: 'blur' }
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
    this.calendarInfoObj['priority']='3';
    this.calendarInfoObj = {...this.calendarInfoObj};
  },
  mounted(){
    
  },
  methods: {
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
      //console.log("saving event");
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            addTaskCalendarPlanAjax(this.setSaveData(this.calendarInfoObj)).then((res)=>{
              console.log("submit  done!!res.data:"+res.data);
              if (res.data&&res.data.id){
                console.log("new id111:"+res.data.id);
                addActionLogForCreate(this.formItemInfo , this.calendarInfoObj , 'taskCalendar',res.data.id , this.taskId,'create');
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
                this.$message({type: 'success',message: '添加成功！'});
              }else{
                this.$message({type: 'error',message: '添加失败！'});
              }
            }).catch((error)=>{
              dealException(error);
              this.$message({type: 'error',message: '添加失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    cleanInfo(){
       this.taskId='';
       this.calendarInfoObj={};
    },
    setTaskId(taskId){
      this.taskId = taskId;
    },
    getTaskInfo(){
      getTaskDetail(this.taskId).then((response)=>{
        if (response.data&&response.data.id){
            this.taskInfoObj = response.data;
            this.userSearchResultsV = [ { "id": this.taskInfoObj.dealer, "mi": this.taskInfoObj.dealerName }];
            this.calendarInfoObj.dealer = this.taskInfoObj.dealer;
            this.calendarInfoObj = {...this.calendarInfoObj};
            this.dataMountedFlag = true;
        }
      }).catch((error)=>{
         dealException(error);
      });
    },
    getUserListByNameQuery
  },
  watch: {

  }
}
</script>