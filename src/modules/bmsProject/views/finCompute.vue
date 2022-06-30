<template>
  <div>
    <div class="kn-header" >
      <eco-content top="0px" height="42px" type="tool" style="position:fixed !important;">
        <el-row style="padding:3px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="14" >
            <eco-tool-title style="line-height: 34px;" :title="'项目财务结算'"></eco-tool-title>
            <el-divider direction="vertical"></el-divider>
            选择到款时间区间：
            <el-date-picker
              v-model="fromToDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini" style="width:250px;margin-right:5px;">
            </el-date-picker>
            <el-button icon="el-icon-search" size="mini" circle @click.native="searchData"></el-button>
          </el-col>
          <el-col :span="10" style="text-align:right;">
            <el-button type="success" @click.native="expProjectFinExl" icon="el-icon-finished" size="mini" v-if="finDataArray!=null&&finDataArray.length>0">导出报表</el-button>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <ecoContent top="41px" bottom="0" style="position:fixed !important;" v-if="finDataArray!=null&&finDataArray.length>0">
      <ecoContent top="0px" bottom="0px" ref="content">
          <el-table :data="finDataArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'createDate', order: 'descending'}" size="mini" class="finComputeTable">
            <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
              <template slot-scope="scope"  >
                <div v-if="colEl.paramName=='existPaymentBefore'" >
                  <span v-if="scope.row['existPaymentBefore']" style="color:#ff0000;font-weight:600">
                    是
                  </span>
                  <span v-else>
                    否
                  </span>
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
import { searchProjectFinXlsExpAjax,getFinDataList } from "@/modules/bmsProject/service/service.js";
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
      fromToDate:["2021-01-01","2021-12-31"],
      paginationInfo: {
        searchFromDate: "2021-01-01",
        searchToDate: "2021-01-01",
        page: 1,
        rows: 2000,
        total: 0
      },
      finDataArray:[],
      tableColEl: new TableColEl()
        .add("#","idx",'50','',false,false,false)
        .add("项目名称","projectName",'500','',false,false,false)
        .add("合同金额","contractAmt",'100','',false,false,false)
        .add("已收款金额","receivedPaymtAmt",'100','',false,false,false)
        .add("已收款比例","receivedPaymtPct",'100','',false,false,false)
        .add("待回款金额","restPaymtAmt",'100','',false,false,false)
        .add("已耗费成本(含税)","expenseSum",'95','',false,false,false)

        .add("报销流程支出","reimburseFeeExpense",'80','',false,false,false)
        .add("付款流程支出","payFeeExpense",'80','',false,false,false)
        .add("费用预支流程支出","advanceFeeExpense",'80','',false,false,false)
        .add("商务费用流程支出","bizFeeExpense",'80','',false,false,false)
        .add("税费支出","taxExpense",'80','',false,false,false)

        .add("此时间段前是否已有到款","existPaymentBefore",'105','',false,false,false)
        
        .add("本次到款时间","currPaymentDate",'105','',false,false,false)
        .add("到款类型","currPaymentTypeDesc",'80','',false,false,false)
        .add("到款金额","currPaymentAmt",'80','',false,false,false)
        .add("到款备注","paymentComments",'120','',false,false,false)
        .add("税费类别","currTaxTypeDesc",'50','',false,false,false)
        .add("增值税","valueAddedTax",'70','',false,false,false)
        .add("附加税","superTax",'70','',false,false,false)
        .add("印花税","stampTax",'70','',false,false,false),
    };
  },
  created(){

  },
  mounted() {
 
  },
  methods: {
      searchData(){
        if(this.fromToDate==null || this.fromToDate.length!=2){
          this.$message({type: 'error',message: '请选择日期区间'});
          return;
        }
        this.paginationInfo.searchFromDate = this.fromToDate[0];
        this.paginationInfo.searchToDate = this.fromToDate[1];
        this.openLoading();
        getFinDataList(this.paginationInfo).then(response => {
          this.finDataArray = response.data;
          this.paginationInfo.total = this.finDataArray.length;
          //this.finDataArray = {...this.finDataArray};
          this.closeLoading();
          //console.log("nextTriggerFlag:" + nextTriggerFlag);
        }).catch(error => {
          this.closeLoading();
        });
      },
      expProjectFinExl(){
        //console.log("111");
        searchProjectFinXlsExpAjax(this.fromToDate).then((response)=>{
            var blob = new Blob([response.data], { type: 'application/octet-stream' });
            EcoFile.downloadFile(blob, this.fromToDate[0] + "至" + this.fromToDate[1] + "项目财务结算表.xlsx");
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
      openLoading,closeLoading,
  },
  computed:{
    
  },
  watch: {}
};
</script>
<style >

</style>
