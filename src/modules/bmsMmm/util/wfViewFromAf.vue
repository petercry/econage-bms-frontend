<template>
    <div  style="margin:0px ;" class="wfViewDiv" v-if="wfViewObj!=null && wfViewObj.workflowName!=null && wfViewObj.workflowName!=''">
        <div class="blockCard" >
            <div class="blockCardHeader">
                <span class="colorTip" >&nbsp;</span><span class="title" >流程概要</span>
            </div>
            <div class="blockCardBody">
                <table class="wfViewInfoTable">
                    <tbody>
                        <tr>
                            <th>流程名称</th>
                            <td>{{this.wfViewObj.workflowName}}</td>
                        </tr>
                        <tr>
                            <th>启动人</th>
                            <td>{{this.wfViewObj.initUserName}}</td>
                        </tr>
                        <tr>
                            <th>启动时间</th>
                            <td>{{formatDateToMinute(this.wfViewObj.initDate)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="blockCard" >
            <div class="blockCardHeader">
                <span class="colorTip" >&nbsp;</span><span class="title" >表单内容</span>
            </div>
            <div class="blockCardBody">
              <table class="wfViewInfoTable">
                <tbody>
                    <template v-for="(nodeEl,key,i) in this.wfViewObj.itemList" >
                        <tr  :key="i" v-if="nodeEl.itemValue!=null&&nodeEl.itemValue!=''">
                            <th >{{nodeEl.itemName}}</th>
                            <td v-html="formatBrText(nodeEl.itemValue)"></td>
                        </tr>
                    </template>
                </tbody>
                </table>
            </div>
        </div>
        <div class="blockCard" >
            <div class="blockCardHeader">
                <span class="colorTip" >&nbsp;</span><span class="title" >审批记录</span>
            </div>
            <div class="blockCardBody">
                <table class="wfViewInfoTable" v-if="this.wfViewObj.taskList!=null&&this.wfViewObj.taskList.length>0">
                    <tbody>
                        <template v-for="(nodeEl,key,i) in this.wfViewObj.taskList" >
                            <tr  :key="i" >
                                <th >{{nodeEl.taskName}}</th>
                                <td>
                                    <template v-for="(cosignNodeEl,cosignNodeKey) in nodeEl.assigneeList" >
                                        <template v-for="(cosignDecisionNodeEl,cosignDecisionNodeKey) in cosignNodeEl.decisionList" >
                                            <div :key="cosignNodeKey+'#'+cosignDecisionNodeKey">
                                                <div :class="cosignDecisionNodeKey==0?'cosignFirstTitle':'cosignTitle'">
                                                    {{cosignNodeEl.assigneeName}} <i class="el-icon-check" v-if="cosignDecisionNodeEl.decisionValue==1"></i><i class="el-icon-close" v-if="cosignDecisionNodeEl.decisionValue==0"></i><span style="font-size:8px;padding-left:10px;">( {{formatDateToMinute(cosignDecisionNodeEl.decisionDate)}} )</span>
                                                </div>
                                                <div class="cosignText" v-html="formatBrText(cosignDecisionNodeEl.decisionDesc)">
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div v-if="this.wfViewObj.taskList==null || this.wfViewObj.taskList.length == 0" style="padding-left:5px;">
                     暂无数据...
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="textStr!=''">
      <div v-html="handleDataJournalExtContent(textStr)">
      </div>
    </div>
    <div v-else>
        暂无数据...
    </div>
</template>
<script>
import {formatDateToMinute,formatBrText,handleDataJournalExtContent} from "@/modules/bmsMmm/util/utility.js";
export default{
  name:'',
  components:{
  },
  data(){
    return {
        wfViewObj:null,
        textStr:''
    }
  },
  props:['jsonStr'],
  created(){
    //console.log("##jsonStr:" + this.jsonStr);
    try{
        this.wfViewObj = JSON.parse(this.jsonStr);
    }catch(e){
        this.textStr = this.jsonStr;
        console.log("##jsonStr有误! ");
    }
  },
  mounted(){

  },
  methods: {
      formatDateToMinute,formatBrText,handleDataJournalExtContent
  },
  watch: {
  }
}
</script>
<style scoped>
.wfViewDiv{
  background-color:#f1f1f1;
  padding: 10px;
  height: 600px;
  overflow-y: auto;
}
.wfViewDiv .blockCard{
  background-color: #ffffff;
  padding: 10px;
  margin-bottom: 5px;
}
.wfViewDiv .blockCard .blockCardHeader{
  margin-bottom: 10px;
}
.wfViewDiv .blockCard .blockCardHeader .title{
  font-size: 16px;
  font-weight: 600;
  padding-left: 5px;
}
.wfViewDiv .blockCard .blockCardHeader .colorTip{
  background: #23b7e5;
  width: 5px;
  height: 18px;
}
.wfViewDiv .blockCard .blockCardBody{
  width:auto;
  padding:0px 5px 5px 5px;
}
.wfViewInfoTable{
  border:1px solid #dee2e6;
  width: 100%;
}
.wfViewInfoTable th{
  border:1px solid #dee2e6;
  padding: 6px 10px 6px 10px;
  font-weight: 600;
  background-color: #f2f2f2;
  width: 100px;
  text-align: right;
  vertical-align: top;
}
.wfViewInfoTable td{
  border:1px solid #dee2e6;
  padding: 6px 10px 6px 10px;
}
.wfViewInfoTable .el-icon-check{
  color:#28a745;
  font-weight: 800;
  font-size: 16px;
}
.wfViewInfoTable .el-icon-close{
  color:#ff0000;
  font-weight: 800;
  font-size: 16px;
}
.wfViewInfoTable .cosignText{
  font-size:12px;
  padding-top: 5px;
}
.wfViewInfoTable .cosignTitle{
  padding-top: 5px;
  margin-top: 7px;
  border-top:1px dashed #c2c2c2;
}
</style>
