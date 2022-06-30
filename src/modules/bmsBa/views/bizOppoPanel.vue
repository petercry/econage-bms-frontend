<template>
    <div  style="margin:0px 20px;" class="bizOppoPanel">
      <eco-content top="0px" bottom="0px">
        <el-row style="padding:6px 10px ;background-color:#fff;border-bottom:1px solid #ddd;">
          <el-col :span="16" >
            <eco-tool-title style="line-height: 34px;" title="商机监控"></eco-tool-title>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-top:2px;">
            
          </el-col>
        </el-row>
        <div class="bizOppoPanelTopTipDiv">
            <div :class="sourceFlag==2?'topTipBlockActive topTipBlock':'topTipBlock'" @click="getBaListFuncWithReset(2)">
                <div class="topTipBlockTitle">
                    来自<span class="focusSpan">alphaflow.cn</span>的预约演示
                </div>
                <div class="topTipBlockDesc">
                    总共<span class="focusNum">{{bizOppoStatisticsCount.func2.totalCount}}</span>；过去7天<span class="focusNum">{{bizOppoStatisticsCount.func2.day7Count}}</span>；今日<span class="focusNum">{{bizOppoStatisticsCount.func2.todayCount}}</span>
                </div>
            </div>
            <div :class="sourceFlag==3?'topTipBlockActive topTipBlock':'topTipBlock'" @click="getBaListFuncWithReset(3)">
                <div class="topTipBlockTitle">
                    来自<span class="focusSpan">flowyun.com</span>的申请试用
                </div>
                <div class="topTipBlockDesc">
                    总共<span class="focusNum">{{bizOppoStatisticsCount.func3.totalCount}}</span>；过去7天<span class="focusNum">{{bizOppoStatisticsCount.func3.day7Count}}</span>；今日<span class="focusNum">{{bizOppoStatisticsCount.func3.todayCount}}</span>
                </div>
            </div>
            <div :class="sourceFlag==1?'topTipBlockActive topTipBlock':'topTipBlock'" @click="getBaListFuncWithReset(1)">
                <div class="topTipBlockTitle">
                    来自<span class="focusSpan">Alpha审批</span>的注册
                </div>
                <div class="topTipBlockDesc">
                    总共<span class="focusNum">{{bizOppoStatisticsCount.func1.totalCount}}</span>；过去7天<span class="focusNum">{{bizOppoStatisticsCount.func1.day7Count}}</span>；今日<span class="focusNum">{{bizOppoStatisticsCount.func1.todayCount}}</span>
                </div>
            </div>
        </div>
         <div  style="padding:0px 10px 0px 10px;height: calc(100% - 210px);" ref="content">
            <el-table :data="bizOppoListArray" border stripe style="width: 100%" :height="'100%'" :default-sort = "{prop: 'sourceApplyDate', order: 'descending'}" @sort-change="changeSort" size="mini" class="bizOppoTable" >
                <el-table-column v-for="(colEl,index) in tableColEl" :key="index" :sortable="colEl.isSortable?'custom':false" :fixed="colEl.isColFixed" :prop="colEl.paramName" :label="colEl.desc" :width="colEl.colWidth">
                <template slot-scope="scope"  >
                    <div class="tdContent">
                    {{scope.row[colEl.paramName]}}
                    </div>
                </template>
                </el-table-column>
            </el-table>
         </div>
         <div style="text-align: left;padding:5px 15px 0px 15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginationInfo.page"
              :page-sizes="[20,30,50,100]"
              :page-size="paginationInfo.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paginationInfo.total">
            </el-pagination>
          </div>
      </eco-content>
    </div>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue';
import { TableColEl } from "@/modules/bmsBa/util/TableColEl.js";
import { formatDateToMinute} from "@/modules/bmsMmm/service/service.js";
import { getBizOppoList,openLoading,closeLoading,getBizOppoSourceFlagDesc,getBizOppoStatisticsCountList } from "@/modules/bmsBa/service/service.js";
export default{
  name:'',
  components:{
    ecoContent,
    ecoToolTitle
  },
  data(){
    return {
        bizOppoStatisticsCount : {
          "func1":{
            "totalCount": "_",
            "day7Count": "_",
            "todayCount": "_"
          },
          "func2":{
            "totalCount": "_",
            "day7Count": "_",
            "todayCount": "_"
          },
          "func3":{
            "totalCount": "_",
            "day7Count": "_",
            "todayCount": "_"
          }
        },
        sourceFlag : -1,
        bizOppoListArray:[],
        paginationInfo: {
            sourceFlag : -1 ,
            sort: "source_apply_date_,order_seq_",
            order: "desc,desc",
            page: 1,
            rows: 50,
            total: 0
        },
        tableColEl: new TableColEl()
        .add("申请公司名","applyBaName",'450',"",false,false,false)
        .add("联系人","applyContactorName",'200',"",false,false,false)
        .add("电话","applyPhone",'170',"",false,false,false)
        .add("商机来源","sourceFlagDesc",'170',"",false,false,false)
        .add("商机时间","sourceApplyDate",'150',"",false,false,true)
       
/*
     * @param {string} desc  描述
     * @param {string} paramName  值
     * @param {string} kvGroupDesc  如果是个基础数据，此处显示基础数据的group desc
     * @param {boolean} isColFixed  此列是否冻结
     * @param {boolean} isLinkStyle 此列为链接形式
     * @param {boolean} isSortable 此列是否可排序
*/
    }
  },
  created(){
   
  },
  mounted(){
    this.getBizOppoStatisticsCountListFunc();
  },
  methods: {
    getBizOppoStatisticsCountListFunc(){
        getBizOppoStatisticsCountList().then(response => {
          this.bizOppoStatisticsCount = response.data;
        }).catch(error => {
          console.log("error:" + error);
        });

    },
    getBaListFuncWithReset(checkSourceFlag){
      this.paginationInfo.page = 1;
      this.paginationInfo.rows = 50;
      this.paginationInfo.sort = "sourceApplyDate,orderSeq";
      this.paginationInfo.order = "desc,desc";
      this.getBizOppoListFunc(checkSourceFlag);
    },
    getBizOppoListFunc(checkSourceFlag){
        this.getBizOppoStatisticsCountListFunc();
        //console.log("this.sourceFlag:" + this.sourceFlag);
        this.sourceFlag = checkSourceFlag;
        this.paginationInfo.sourceFlag = checkSourceFlag;
        //console.log("this.sourceFlag:" + this.sourceFlag);
        this.openLoading();
        //return;
        getBizOppoList(this.paginationInfo).then(response => {
          this.bizOppoListArray = response.data.rows;
          this.paginationInfo.total = response.data.total;
          this.closeLoading();
          for(let i in this.bizOppoListArray){
            this.bizOppoListArray[i].sourceApplyDate = formatDateToMinute(this.bizOppoListArray[i].sourceApplyDate);
            this.bizOppoListArray[i].sourceFlagDesc = getBizOppoSourceFlagDesc(this.bizOppoListArray[i].sourceFlag);
            
          }
        }).catch(error => {
          this.closeLoading();
        });

    },
    changeSort(val){
      //console.log("##changeSort##:"+val.prop+"##"+val.order);
      if(val.order == null){
          this.paginationInfo.sort = "sourceApplyDate,orderSeq";
          this.paginationInfo.order = "desc,desc";
          val.prop = "sourceApplyDate";
          val.order = "descending";
      }else{
        this.paginationInfo.sort = val.prop+",orderSeq";
        if(val.order == "ascending") this.paginationInfo.order = "asc,desc";
        else this.paginationInfo.order = "desc,desc";
      }
      this.getBizOppoListFunc(this.sourceFlag);
    },
    handleSizeChange(val) {
        //this.$refs.content.setScollTop(0);
        this.paginationInfo.rows = val;
        this.paginationInfo.page = 1;
        this.getBizOppoListFunc(this.sourceFlag);
    },
    handleCurrentChange(val) {
        //this.$refs.content.setScollTop(0);
        this.paginationInfo.page = val;
        this.getBizOppoListFunc(this.sourceFlag);
    },
    openLoading,closeLoading
  },
  watch: {

  }
}
</script>

