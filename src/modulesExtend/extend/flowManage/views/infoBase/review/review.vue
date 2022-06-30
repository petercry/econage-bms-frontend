<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
    <div class="review">
      <!-- 评审库 -->
      <ecoLoading
        ref='ecoLoadingRef'
        text='加载中...'
      ></ecoLoading>
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;box-sizing:border-box"
      >
        <el-row style="padding:12px 20px;background-color:#fff;">
          <el-col>
             <el-col :span="12">
                <el-select v-model="selectValue" placeholder="请选择" size="small" @change="handleSelect">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span>
                  新建：<div class="tag">21个</div>
                  续建：<div class="tag">1个</div>
                  运维：<div class="tag">0个</div>
                </span>
             </el-col>
             <el-col :span="12" align="right">
                  <el-input
                  v-model="search"
                  size="small"
                  style="width:180px"
                  placeholder="搜索"/>
                  <el-button-group  style="">
                  <el-button  icon="el-icon-refresh-right"  style="fontSize:16px;"></el-button>
                  <el-button  icon="el-icon-film"  style="fontSize:16px;"></el-button>
                  <el-button  icon="el-icon-s-operation" style="fontSize:16px;" ></el-button>
                  <el-button  icon="iconfont icon-shaixuan" style="fontSize:16px;" ></el-button>
                  <el-button  icon="iconfont icon-daochu" style="fontSize:16px;" ></el-button>
                </el-button-group>
             </el-col>
          </el-col>
        </el-row>
      </eco-content>
    <eco-content
      bottom="42px"
      top="60px"
      ref="content"
      class="ecoContentClass"
    >
      <el-table
        :data="listData.slice((pageInfo.page-1)*pageInfo.rows,pageInfo.page*pageInfo.rows)"
        stripe
        style="width: 100%"
        height="100%"
         :header-cell-style="{backgroundColor:'#f3f7f9',color:'#526069',fontWeight:700,height:'40px'}"
        border
        :cell-style="{fontSize:'14px'}"
      >
      <!-- <el-table-column type="selection" width="55">

      </el-table-column> -->
      </el-table-column>
        <el-table-column
          prop="SN"
          label="项目编号"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="SUBJECTTYPE"
          label="项目类型"
          sortable="custom"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="APPLYYEAR"
          label="起始年度"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="SUBJECTNAME"
          label="项目名称"
          sortable="custom"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="ORGNAME"
          label="建设单位"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="ORGANCODE"
          label="单位预算代码"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="CONTACT"
          label="联系人"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="CONTACTMOBILE"
          label="联系人手机号码"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="CONTACTPHONE"
          label="联系人电话"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="STARTTIME"
          label="申报时间"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="ESTIMATEBUDGET"
          label="申报项目总投资（万元）"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="APPLYFINACE"
          label="其中：市财政资金（万元）"
          sortable="custom"
          width="190"
        >
        </el-table-column>
        <el-table-column
          prop="APPLYBUDGETTYPE"
          label="申请资金类型"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="ISEVA"
          label="是否参与评审"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="SUBJECTRESULT"
          label="预审结果"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="PROJECTRESULT"
          label="建设方案评审结果"
          sortable="custom"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="PROJECTSUGGESTBUDGET"
          label="评审项目总投资（万元）"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="FINACERESULT"
          label="财政审核结果"
          sortable="custom"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="FINACEBUDGETTYPE"
          label="财政审核资金类型"
          sortable="custom"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="ACTBUDGET"
          label="财政审核项目总投资（万元）"
          sortable="custom"
          width="220"
        >
        </el-table-column>
        <el-table-column
          prop="PROJECTPROCESS"
          label="项目进度"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
        <template slot-scope="scope">
          <div>
             <el-button type="text" @click="goDetail(scope.row)">查看详情</el-button>
          </div>
        </template>
        </el-table-column>
      </el-table>
    </eco-content>
      <eco-content  bottom="0px" type="tool" style="padding:5px 0px">
          <div>
            <div style="text-align: right;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageInfo.page"
                :page-sizes="[15,30,50,100]"
                :page-size="pageInfo.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo.total">
              </el-pagination>
            </div>
          </div>
    </eco-content>
    </div>
  </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '@/modulesExtend/extend/flowManage/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
import data   from '../data.json'
export default{
  name:'review',
   components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,

  },
  data(){
    return {
       listData:data.reviewData,
       pageInfo:{
         page:1,
         rows:15,
         total:0
       },
       selectValue:2021,
       search:'',
       options:[
         {
           label:'全部',
           value: 0
         },
         {
           label:'申报年度:2021',
           value: 2021
         },
         {
           label:'申报年度:2020',
           value: 2020
         },
         {
           label:'申报年度:2019',
           value: 2019
         },
         {
           label:'申报年度:2018',
           value: 2018
         },
         {
           label:'申报年度:2017',
           value: 2017
         },
         {
           label:'申报年度:2016',
           value: 2016
         },
         {
           label:'申报年度:2015',
           value: 2015
         },
       ]
    }
  },
  created(){
    this.pageInfo.total=data.reviewData.length
      this.listData=data.reviewData.filter((item=>{
        return item.APPLYYEAR==2021
    }))
    this.pageInfo.total=this.listData.length
  },
  mounted(){

  },
  methods: {
    handleSelect(val){
     if(val===0){
       this.listData=data.reviewData
       this.pageInfo.total=this.listData.length
     }else{
        this.listData=data.reviewData.filter((item=>{
        return item.APPLYYEAR==val
    }))
    this.pageInfo.total=this.listData.length
     }
    },
    goDetail(item){
      if(sysEnv!==1){
              this.$router.push({name:'reviewDetail',params:{id:item.ID}})
      }else{
        let tabObj = {};
        tabObj.desc = item.SUBJECTNAME
        let goPage = "flowManage/index.html#/reviewDetail" + '/' + item.ID;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'reviewDetail" + item.ID + "',href_link:'" + goPage + "'}"
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
      }
    },
    handleSizeChange(val){
      this.pageInfo.rows=val
    },
    handleCurrentChange(val){
      this.pageInfo.page=val
    }
  },
  watch: {

  }
}
</script>
<style scoped>
.review {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.tag{
  display: inline-block;
  background-color: #1c84c6;
  color: #FFF;
  width: 44px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  height: 20px;
  border-radius: 4px;
}
.ecoContentClass{
  padding: 20px;
}
</style>
