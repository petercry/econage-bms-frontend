<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
    <div class="dataBase">
      <!-- 数据资源目录库 -->
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
                  <!-- 项目总数：<div class="tag">53个</div>
                  财政审核资金总额：<div class="tag">38481.6万元</div> -->
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
                  <!-- <el-button  icon="iconfont icon-shaixuan" style="fontSize:16px;" ></el-button>
                  <el-button  icon="iconfont icon-daochu" style="fontSize:16px;" ></el-button> -->
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

      </el-table-column>
        <el-table-column
          prop="sn"
          label="项目编号"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="yearsn"
          label="年度计划项目编号"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="项目类型"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="projectname"
          label="项目名称"
          sortable="custom"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="year"
          label="起始年度"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="orgname"
          label="建设单位"
          sortable="custom"
          width="300"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="BUDGETTYPE"
          label="资金类型"
          sortable="custom"
          width="100"
        >
        </el-table-column> -->
        <el-table-column
          prop="budget"
          label="项目总投资（万元）"
          sortable="custom"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="applydatacount"
          label="数据资源申报（条）"
          sortable="custom"
          width="160"
        >
        </el-table-column>
             <el-table-column
          prop="verifydatacount"
          label="数据资源归集验证（条）"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="verifydatarate"
          label="数据资源归集率"
          sortable="custom"
          width="160"
        >
        </el-table-column>

        <el-table-column
          prop="verifystatus"
          label="当前状态"
          sortable="custom"
          width="160"
        >
        <!-- <template slot-scope="scope">
            <el-progress :percentage="50"></el-progress>
        </template> -->
        </el-table-column>
        <!-- <el-table-column
          prop="PROJECTSCORE"
          label="项目管理评分"
          sortable="custom"
          width="120"
        >
        <template slot-scope="scope">
            <el-tag type="success"  effect="dark">
                {{scope.row.PROJECTSCORE}}
            </el-tag>
        </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          width="100"
        >
        <template slot-scope="scope">
          <div>
             <el-button type="text"icon="el-icon-tickets"  @click="goDetail(scope.row.id)">查看详情</el-button>
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
  name:'dataBase',
   components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,

  },
  data(){
    return {
       listData:data.dataBase,
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
    this.pageInfo.total=data.dataBase.length
    this.listData=data.dataBase
      this.listData=data.dataBase.filter((item=>{
        return item.year==2021
    }))
    this.pageInfo.total=this.listData.length
  },
  mounted(){

  },
  methods: {
    handleSelect(val){
     if(val===0){
       this.listData=data.dataBase
       this.pageInfo.total=this.listData.length
     }else{
        this.listData=data.dataBase.filter((item=>{
        return item.APPROVALYEAR==val
    }))
    this.pageInfo.total=this.listData.length
     }
    },
    goDetail(id){
      if(sysEnv!==1){
              this.$router.push({name:'dataBaseDetail',params:{id}})
      }else{
        let tabObj = {};
        tabObj.desc = '数据库资源目录库详情'
        let goPage = "flowManage/index.html#/dataBaseDetail" + '/' +id;
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'dataBaseDetail" + id + "',href_link:'" + goPage + "'}"
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
.dataBase {
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
  min-width: 44px;
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
