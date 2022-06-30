<template>
  <div style="padding:20px;">
    <el-card class="subject-card" style="position:relative">
    <!--   <div slot="header" class="clearfix">
        <span>事项汇总表</span>
      </div> -->
      <div style="line-height:50px;">
        <div class="el-input el-input--mini el-input-group el-input--suffix s-selectHasLabel" style="width:260px">
          <div class="el-input-group__prepend">时间选择</div>
          <el-select v-model="timeType" placeholder="请选择" style="width:100%;">
            <el-option v-for="item in timeList" :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </div>
        <el-date-picker
          v-if="selectShow"
          style="vertical-align: middle;"
          v-model="timeSelect"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button v-if="selectShow" type="primary" size="mini" @click.native="search">搜索</el-button>
      </div>
      <el-table
        :header-cell-style="{backgroundColor:'#E9EAEF'}"
        :data="tableData"
        border
        show-summary
        style="width: 100%">
        <el-table-column
          label="单位名称"
          prop="titleName">
        </el-table-column>
        <el-table-column
          label="已公开承诺事项数"
          prop="pubPromiseCount">
        </el-table-column>
        <el-table-column
          label="可在线办理事项数"
          prop="enableHandleOnlineCount">
        </el-table-column>
        <el-table-column
          label="可掌上办理事项数"
          prop="enableHandleMobileCount">
        </el-table-column>
        <el-table-column
          label="已受理办件数"
          prop="acceptedCount">
        </el-table-column>
        <el-table-column
          label="已办结件数"
          prop="finishedCount">
        </el-table-column>
        <el-table-column
          label="跑一次事项数"
          prop="runOneCount">
        </el-table-column>
        <el-table-column
          label="跑零次事项数"
          prop="runZeroCount">
        </el-table-column>
        <!-- <el-table-column
          label="其他"
          prop="appName">
        </el-table-column> -->
        <!-- <template slot-scope="scope">
          <div>
            
          </div>
        </template> -->
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {getTitleItemCount} from '@/modules/portal1/service/service.js'
import {mapMutations,mapState} from 'vuex'
  export default{
      name:'serviceCount',
      components:{
      },
      data() {
        return {
          tableData:[],
          timeType:'',
          timeList:[
            {key:'',text:'全部'},
            {key:'year',text:'本年'},
            {key:'month',text:'本月'},
            {key:'week',text:'本周'},
            {key:'day',text:'本天'},
            {key:'select',text:'选择'},
          ],
          selectShow: false,
          timeSelect: '',
        }
      },
      created(){
      },
      mounted() {
        this.getTitleItemCount();
      },
      computed: {
      },
      methods: {
        getTitleItemCount(mod){
          let form = this.getFormTime(mod);
          getTitleItemCount(form).then(res=>{
            if (res.data&&res.data.rows){
              this.tableData = res.data.rows;
            }
          }).catch(e=>{})
        },
        getFormTime(mod){
          let that = this;
          let form = {
            createDateFrom:null,
            createDateTo:null,
          }
          let year = new Date().getFullYear();
          let month = new Date().getMonth()+1;
          if (month<10){
            month='0'+month;
          }
          let day = new Date().getDate();
          if (day<10){
            day='0'+day;
          }
          switch (mod) {
            case '':
              break;
            case 'year':
              form.createDateFrom = year +'-01-01';
              break;
            case 'month':
              form.createDateFrom = year +'-'+month+'-01';
              break;
            case 'week':
              let todayWeek = new Date().getDay();
              let Monday = null;
              if (todayWeek==0){
                Monday = new Date(year,month-1,day-6);
              }else{
                Monday = new Date(year,month-1,day-todayWeek+1);
              }
              let yearMon = Monday.getFullYear();
              let monthMon = Monday.getMonth()+1;
              if (monthMon<10){
                monthMon='0'+monthMon;
              }
              let dayMon = Monday.getDate();
              if (dayMon<10){
                dayMon='0'+dayMon;
              }
              form.createDateFrom = yearMon +'-'+monthMon+'-'+dayMon;
              break;
            case 'day':
              form.createDateFrom = year +'-'+month+'-'+day;
              break;
            case 'select':
              if(that.timeSelect&&that.timeSelect.length){//数组
                form.createDateFrom  = that.timeSelect[0]+'';
                form.createDateTo  = that.timeSelect[1]+'';
              }
              break;
            default:
              break;
          }
          return form;
        },
        search(){
          this.getTitleItemCount(this.timeType)
        }
      },
      watch: {
        'timeType'(val){
          if (val=='select'){
            this.selectShow = true;
          } else {
            this.selectShow = false;
            this.timeSelect='';
            this.getTitleItemCount(val)
          }
        }
      },
  }
</script>
<style scoped>
.subject-card{
  height: 100%;
}
</style>
<style lang="css">
.s-selectHasLabel .el-input__inner{
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>