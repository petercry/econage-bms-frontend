<template>
    <div >
        <el-form label-width="100px" ref="myform" :rules="rules" :model="projectInfoObj" v-if="dataMounted">
            <template v-for="(nodeEl,key) in formItemInfo" >
                <div :key="nodeEl.paramName" :style="{'width':(nodeEl.isWholeRow ? '98%' : '49%')}" class="formItemDiv">
                    <el-form-item :label="nodeEl.desc" :prop="nodeEl.paramName" >
                        <template v-if="nodeEl.eleType=='textarea'">
                            <el-input type="textarea" :placeholder="'请输入'+nodeEl.desc" v-model="projectInfoObj[key]" rows="3"></el-input>
                        </template>
                         <template v-else-if="nodeEl.eleType=='date'">
                            <el-date-picker v-model="projectInfoObj[key]" type="date" :placeholder="'请选择'+nodeEl.desc" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                        </template>
                        <template v-else>
                            <el-input  :placeholder="'请输入'+nodeEl.desc" v-model="projectInfoObj[key]" ></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>
        </el-form>
    </div>
</template>
<script>
import { getEnumText } from "@/modules/bmsBa/service/service.js";
import { getProjectDetail,editProjectAjax} from "@/modules/bmsProject/service/service.js";
import { FormItemEl } from "@/modules/bmsBa/util/FormItemEl.js";
import { KvGroup } from "@/modules/bmsBa/util/KvGroup.js";
import {mapMutations} from 'vuex';
export default{
  name:'editProject',
  components:{
  },
  data(){
    return {
      projectInfoObj:{},
      projectId:'',
      kvInfo:new KvGroup(),
      formItemInfo:new FormItemEl()
        .add("总金额","contractAmt",'',false)
        .add("已开票比例","invoicedPct",'',false)
        .add("下次付款比例","nextPaymtPct",'',false)
        .add("下次付款时间","nextPaymtDate",'',false,'date')
        .add("下次付款条件","nextPaymtCond",'',true,'textarea')
        .add("已收款比例","receivedPaymtPct",'',false)
        .add("已收款金额","receivedPaymtAmt",'',false)
        .add("剩余金额","restPaymtAmt",'',false),
      rules: {
      },
      dataMounted:false
    }
  },
  created(){
    this.kvInfo = this.$parent.$parent.kvInfo;
    this.projectId = this.$parent.$parent.projectId;
    this.getFinSummaryInfo(this.projectId);
  },
  mounted(){
  },
  methods: {
    getFinSummaryInfo(projectId){
      if(projectId=='')return;
      this.$parent.$parent.openLoading();
      this.projectId = projectId;
      //console.log("getProjectaInfo in editProject--> projectId:" + projectId);
      getProjectDetail(projectId).then((response)=>{
          //console.log("response back:" + projectId);
        if (response.data&&response.data.id){
            this.projectInfoObj = response.data;
            if(this.projectInfoObj.relatedBaList!=null&&this.projectInfoObj.relatedBaList.length > 0){
              this.projectInfoObj.relatedBaIds = [];
              for(let i in this.projectInfoObj.relatedBaList){
                let baNode = this.projectInfoObj.relatedBaList[i];
                this.projectInfoObj.relatedBaIds.push(baNode.id);
              }
            }
            this.dataMounted = true;
            this.$parent.$parent.closeLoading();
        }
      }).catch((error)=>{
          console.log("error!!!!!:" + error);
         this.$parent.$parent.closeLoading();
      });
    },
    cleanInfo(){
      this.projectInfoObj={};
      this.projectId = '';
    },
    setSaveData(data){
      let obj = {};
      for (let i in data) {
        obj[i] = data[i];
      }
      obj.time = new Date().getTime();
      return obj;
    },
    save(){
      this.$refs['myform'].validate((valid) => {
          if (valid) {
            //console.log("submit!!");
            //return;
            this.$parent.$parent.openLoading();
            editProjectAjax(this.projectId,this.setSaveData(this.projectInfoObj)).then((res)=>{
              //console.log("submit  done!!");
              this.$message({type: 'success',message: '编辑成功！'});
              this.$parent.$parent.dialogVisible = false;
              this.$parent.$parent.getProjectInfo(this.projectId);
              try{this.$parent.$parent.$parent.$parent.refreshSingleRowInTable(this.projectId);}catch(error){console.log("error:"+error);}
            }).catch((error)=>{
              this.$parent.$parent.closeLoading();
              console.log("error:"+error);
              this.$message({type: 'error',message: '编辑失败！'});
            })
          } else {
            //console.log("invalid!!");
            return false;
          }
      });
    },
    getEnumText
  },
  watch: {

  }
}
</script>
<style scoped>
.formItemDiv{
    display:inline-block;
}
.el-form-item {
    margin-bottom: 15px;
}
.el-form-item__error {
  padding-top: 1px;
}
</style>
