<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="42px" type="tool" style="position:fixed !important;">
        <el-row style="padding:3px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="18" >
            <eco-tool-title style="line-height: 34px;" title="产品技术中心伙伴考核"></eco-tool-title>
            <el-divider direction="vertical"></el-divider>
            选择考核窗口：<el-input v-model="paginationInfo.searchExamineId" size="mini" style="width:50px;"></el-input>
            选择晋升窗口：<el-input v-model="paginationInfo.searchPromoteId"  size="mini" style="width:50px;"></el-input>
            选择考核模型：<el-input v-model="paginationInfo.searchExamineModel"  size="mini" style="width:300px;"></el-input>
            <el-button icon="el-icon-search" size="mini" circle @click.native="searchData"></el-button>
          </el-col>
          <el-col :span="6" style="text-align:right;">
            <el-button type="success" @click.native="expEmployeeExamineExl" icon="el-icon-finished" size="mini" v-if="dataArray!=null&&dataArray.length>0">导出报表</el-button>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <ecoContent top="41px" bottom="0" style="position:fixed !important;" v-if="dataArray!=null&&dataArray.length>0">
      <ecoContent top="0px" bottom="0px" ref="content">
          <el-table :data="dataArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'createDate', order: 'descending'}" size="mini" class="finComputeTable">
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.paramName.indexOf('.')>0" >
                  {{scope.row[colEl.paramName.substring(0,colEl.paramName.indexOf('.'))][colEl.paramName.substr(colEl.paramName.indexOf('.')+1)]}}
                </div>
                <div v-else>
                  {{scope.row[colEl.paramName]}}
                </div>
              </template>
            </el-table-column>
          </el-table>
      </ecoContent>
    </ecoContent>
  </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import { openLoading,closeLoading} from "@/modules/bmsBa/service/service.js";
import { EMPLOYEE_GRADE_MODEL_OBJ , getEmployeeExamineList ,searchEmployeeExamineXlsExpAjax } from "@/modules/bmsProject/service/service.js";
import {EcoFile} from '@/components/file/main.js'
export default {
  name: "finCompute",
  components: {
    ecoContent,
    ecoToolTitle
  },
  data() {
    return {
      loading:true,
      paginationInfo: {
        searchExamineId: "1",
        searchPromoteId: "1",
        searchExamineModel:"EMPLOYEE_GRADE_MODEL_FOR_AF_DEV",
        autoComputeFinalData : true,
        order:"desc",
        sort:"position_grade_",
        page: 1,
        rows: 2000,
        total: 0
      },
      dataArray:[],
      tableColEl: null,
      tableColElForAfDev: new TableColEl()
        .add("姓名","userName",'75','',false,false,false)
        .add("当前职级","positionGradeTotalDesc",'80','',false,false,false)
        .add("转正时间","regularTime",'90','',false,false,false)
        .add("平均薪资基数","employeeExamineDetailEntity.wageBase",'105','',false,false,false)
        .add("上级评分","employeeExamineDetailEntity.leaderGrade",'80','',false,false,false)
        .add("产品Leader评分","employeeExamineDetailEntity.productLeaderGrade",'125','',false,false,false)
        .add("产品助理评分","employeeExamineDetailEntity.productAssistantGrade",'105','',false,false,false)
        .add("CTO评分","employeeExamineDetailEntity.ctoGrade",'80','',false,false,false)
        .add("职等权重评分","employeeExamineDetailEntity.posLevelGrade",'105','',false,false,false)
        .add("最终考核评分","employeeExamineDetailEntity.finalGrade",'105','',false,false,false)
        .add("最终奖金系数","employeeExamineDetailEntity.finalRewardScore",'105','',false,false,false)
        .add("最终考核奖金","employeeExamineDetailEntity.examineReward",'105','',false,false,false),
      tableColElForIbpmDev: new TableColEl()
        .add("姓名","userName",'75','',false,false,false)
        .add("当前职级","positionGradeTotalDesc",'80','',false,false,false)
        .add("转正时间","regularTime",'90','',false,false,false)
        .add("平均薪资基数","employeeExamineDetailEntity.wageBase",'105','',false,false,false)
        .add("上级评分","employeeExamineDetailEntity.leaderGrade",'80','',false,false,false)
        .add("伙伴评分","employeeExamineDetailEntity.coworkerGrade",'80','',false,false,false)
        .add("PMO经理评分","employeeExamineDetailEntity.pmoGrade",'115','',false,false,false)
        .add("工时计分","employeeExamineDetailEntity.manhourGrade",'80','',false,false,false)
        .add("CTO评分","employeeExamineDetailEntity.ctoGrade",'80','',false,false,false)
        .add("职等权重评分","employeeExamineDetailEntity.posLevelGrade",'105','',false,false,false)
        .add("最终考核评分","employeeExamineDetailEntity.finalGrade",'105','',false,false,false)
        .add("最终奖金系数","employeeExamineDetailEntity.finalRewardScore",'105','',false,false,false)
        .add("最终考核奖金","employeeExamineDetailEntity.examineReward",'105','',false,false,false),
      tableColElForRookie: new TableColEl()
        .add("姓名","userName",'75','',false,false,false)
        .add("当前职级","positionGradeTotalDesc",'80','',false,false,false)
        .add("转正时间","regularTime",'90','',false,false,false)
        .add("当前薪资","employeeExamineDetailEntity.wageBase",'105','',false,false,false)
        .add("奖金系数","employeeExamineDetailEntity.finalRewardScore",'105','',false,false,false)
        .add("奖金","employeeExamineDetailEntity.examineReward",'105','',false,false,false),
      tableColElForITSupport: new TableColEl()
        .add("姓名","userName",'75','',false,false,false)
        .add("当前职级","positionGradeTotalDesc",'80','',false,false,false)
        .add("转正时间","regularTime",'90','',false,false,false)
        .add("平均薪资基数","employeeExamineDetailEntity.wageBase",'105','',false,false,false)
        .add("上级评分","employeeExamineDetailEntity.leaderGrade",'80','',false,false,false)
        .add("CTO评分","employeeExamineDetailEntity.ctoGrade",'80','',false,false,false)
        .add("职等权重评分","employeeExamineDetailEntity.posLevelGrade",'105','',false,false,false)
        .add("最终考核评分","employeeExamineDetailEntity.finalGrade",'105','',false,false,false)
        .add("最终奖金系数","employeeExamineDetailEntity.finalRewardScore",'105','',false,false,false)
        .add("最终考核奖金","employeeExamineDetailEntity.examineReward",'105','',false,false,false),
        
    };
  },
  created(){

  },
  mounted() {
 
  },
  methods: {
      searchData(){
        if(this.paginationInfo.searchExamineModel == EMPLOYEE_GRADE_MODEL_OBJ.EMPLOYEE_GRADE_MODEL_FOR_AF_DEV){
            this.tableColEl = this.tableColElForAfDev;
        }else if(this.paginationInfo.searchExamineModel == EMPLOYEE_GRADE_MODEL_OBJ.EMPLOYEE_GRADE_MODEL_FOR_IBPM_DEV){
            this.tableColEl = this.tableColElForIbpmDev;
        }else if(this.paginationInfo.searchExamineModel == EMPLOYEE_GRADE_MODEL_OBJ.EMPLOYEE_GRADE_MODEL_FOR_ROOKIE){
            this.tableColEl = this.tableColElForRookie;
        }else if(this.paginationInfo.searchExamineModel == EMPLOYEE_GRADE_MODEL_OBJ.EMPLOYEE_GRADE_MODEL_FOR_IT_SUPPORT){
            this.tableColEl = this.tableColElForITSupport;    
        }
        
        this.openLoading();
        getEmployeeExamineList(this.paginationInfo).then(response => {
          this.dataArray = response.data;
          this.paginationInfo.total = this.dataArray.length;
          for (let i in this.dataArray) {
            let checkNode = this.dataArray[i];
            checkNode.employeeExamineDetailEntity.finalGrade = parseFloat(checkNode.employeeExamineDetailEntity.finalGrade).toFixed(2);
            checkNode.employeeExamineDetailEntity.finalRewardScore = parseFloat(checkNode.employeeExamineDetailEntity.finalRewardScore).toFixed(2);
            checkNode.employeeExamineDetailEntity.examineReward = parseFloat(checkNode.employeeExamineDetailEntity.examineReward).toFixed(2);
          }
          //this.finDataArray = {...this.finDataArray};
          this.closeLoading();
          //console.log("nextTriggerFlag:" + nextTriggerFlag);
        }).catch(error => {
          this.closeLoading();
        });
      },
      handleSizeChange(val) {
          this.$refs.content.setScollTop(0);
          this.paginationInfo.rows = val;
          this.paginationInfo.page = 1;
          //this.getProjectListFunc();
      },
      handleCurrentChange(val) {
          this.$refs.content.setScollTop(0);
          this.paginationInfo.page = val;
          //this.getProjectListFunc();
      },
      expEmployeeExamineExl(){
          searchEmployeeExamineXlsExpAjax(this.paginationInfo).then((response)=>{
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            EcoFile.downloadFile(blob, "绩效考核表.xlsx");
        });

      },
      openLoading,closeLoading,
  },
  computed:{
    
  },
  watch: {}
};
</script>
<style >

</style>
