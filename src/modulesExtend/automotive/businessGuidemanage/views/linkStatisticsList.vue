<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
      <div class="linkStatisticsList">
          <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
          <eco-content top='0px' height='60px' type='tool' style='overflow:hidden;'>
              <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                  <el-col :span='12'>
                      <strong>环节统计</strong>
                  </el-col>
                  <el-col :span='12' style="text-align: right;">
                      <el-button type='primary' size='small' @click="exportCase">导出</el-button>
                  </el-col>
              </el-row>
          </eco-content>
          <eco-content top='59px' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
              <el-table  border   stripe :data='tableData' header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='businessGuideTableTable'>
                  <el-table-column type='index' label='序号' align='center'>
                      <template slot-scope='scope'>
                          {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="DEPT" label="部门"></el-table-column>
                  <el-table-column prop="DEPT_LIAISON" label="部门联络人" width='120'></el-table-column>
                  <el-table-column prop="TASK01" label="科技创新部编制发起" width="130"></el-table-column>
                  <el-table-column prop="TASK02" label="部门联络员校对" width="130"></el-table-column>
                  <el-table-column prop="TASK03" label="业务科室联络员指定责任人" width="170"></el-table-column>
                  <el-table-column prop="TASK04" label="责任人办理" width='150'></el-table-column>
                  <el-table-column prop="TASK05" label="业务部门科长审核" width="130"></el-table-column>
                  <el-table-column prop="TASK06" label="部门联络员审核" width="130"></el-table-column>
                  <el-table-column prop="TASK07" label="标准审查人员审核" width="130"></el-table-column>
                  <el-table-column prop="TASK08" label="业务部门部长审核" width="130"></el-table-column>
                  <el-table-column prop="TASK09" label="分标委审核" width='130'></el-table-column>
                  <el-table-column prop="TASK10" label="科技创新部发起" width="130"></el-table-column>
                  <el-table-column prop="TASK11" label="标准法规室科长审核" width="130"></el-table-column>
                  <el-table-column prop="TASK12" label="科技创新部部长审核" width="130"></el-table-column>
                  <el-table-column prop="TASK13" label="标准法规室科长发起" width="130"></el-table-column>
                  <el-table-column prop="TASK14" label="科技创新部部长二次审核" width="160"></el-table-column>
                  <el-table-column prop="TASK15" label="中心标委会议长审核" width="130"></el-table-column>
                  <el-table-column prop="END" label="完成"></el-table-column>
                  <el-table-column prop="TOTAL" label="总计" fixed='right'></el-table-column>
              </el-table>
          </eco-content>
          <eco-content bottom="0px" type="tool" style="padding:5px 0px">
              <el-row>
                  <el-col :span='24' style="text-align:right">
                      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                          layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                          style="margin-right:20px">
                      </el-pagination>
                  </el-col>
              </el-row>
          </eco-content>
      </div>
  </eco-content>
</template>
<script>
  var _self;
  import ecoContent from "@/components/pageAb/ecoContent.vue";
  import ecoLoading from "@/components/loading/ecoLoading.vue";
  import {downloadTaskCountList,statisticsTaskCountList} from '../service/service.js'
  export default {
      name:'linkStatisticsList',
      data(){
          return {
              tableData: [],
              baseInfo: {
                  page: 1,
                  rows: 30,
                  total: 0
              }
          }
      },
      components: {
          ecoContent,
          ecoLoading
      },
      created(){
          _self = this;
      },
      mounted(){
        this.requestData();
      },
      methods:{
          exportCase(){
              this.$refs.refLoading.open();
              let params = {
                  sort: ['modDate'],
                  order: ['desc'],
              };
              downloadTaskCountList(params).then(res=>{
                  if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                      navigator.msSaveBlob(new Blob([res.data],'业务指南规划-环节统计.xlsx'));
                      this.$refs.refLoading.close();
                  }else{
                      let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                      let url = window.URL.createObjectURL(blob); 
                      let a = document.createElement("a");
                      a.href = url;
                      a.download = '业务指南规划-环节统计.xlsx';
                      this.$refs.refLoading.close();
                      a.click();
                      // 释放这个临时的对象url
                      window.URL.revokeObjectURL(url);
                  }
              }).catch(err => {
                 this.$refs.refLoading.close();
              })
          },
          handleSizeChange(val) {
              this.baseInfo.rows = val;
              this.requestData()
          },
          handleCurrentChange(val) {
              this.baseInfo.page = val;
              this.requestData();
          },
          requestData(){
              this.$refs.refLoading.open();
              let params = {
                  sort: ['modDate'],
                  order: ['desc'],
                  rows: this.baseInfo.rows
              };
              params.page = this.baseInfo.page;
              statisticsTaskCountList(params).then(res => {
                  this.baseInfo.total = res.data.total;
                  this.tableData = res.data.rows;
                  this.$refs.refLoading.close();
              }).catch(err => {
                  this.baseInfo.total = 0;
                  this.tableData = [];
                  this.$refs.refLoading.close();
              })

          }
      }
  }
</script>
<style scoped>
.linkStatisticsList {
      color: #0f1419;
      min-width: 1000px;
      position: relative;
      height: 96%;
      margin: 0 24px;
      top: 2%;
      overflow-y: auto;
      color: #0f1419;
  }
</style>