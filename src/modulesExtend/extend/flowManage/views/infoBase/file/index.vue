<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
    <div class="file">
      <!-- 文档库管理 -->
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
             <el-col :span="14">
                <!-- <el-select v-model="selectValue" placeholder="请选择" size="small" @change="handleSelect">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span>
                  项目总数：<div class="tag">53个</div>
                  财政审核资金总额：<div class="tag">38481.6万元</div>
                </span> -->
                <el-input placeholder="文档名称" style="width:190px" size="small">

                </el-input>
                <el-input placeholder="文档类型" style="width:190px" size="small">

                </el-input>
                <el-input placeholder="项目名称" style="width:190px" size="small">

                </el-input>
                <el-button style="background-color:#22b9bb;color:#fff;fontSize:14px" size="small">查询</el-button>
             </el-col>
             <el-col :span="10" align="right">
                  <el-input
                  v-model="search"
                  size="small"
                  style="width:180px"
                  placeholder="搜索"/>
                  <el-button-group  style="">
                  <el-button  icon="el-icon-refresh-right"  style="fontSize:16px;"></el-button>
                  <el-button  icon="el-icon-film"  style="fontSize:16px;"></el-button>
                  <el-button  icon="el-icon-s-operation" style="fontSize:16px;" ></el-button>
                  <!-- <el-button  icon="iconfont icon-shaixuan" style="fontSize:16px;" ></el-button> -->
                  <!-- <el-button  icon="iconfont icon-daochu" style="fontSize:16px;" ></el-button> -->
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
        border
        style="width: 100%"
        height="100%"
        :header-cell-style="{backgroundColor:'#f3f7f9',color:'#526069',fontWeight:700,height:'40px'}"
        :cell-style="{fontSize:'14px'}"
      >
      <!-- <el-table-column type="selection" width="55">

      </el-table-column> -->
        <el-table-column
          prop="docname"
          label="文档名称"
          width="480"
        >
        </el-table-column>
        <el-table-column
          prop="docsize"
          label="文档大小(kb)"
          width="120"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="PROJECTTYPE"
          label="项目类型"

          width="120"
        >
        </el-table-column> -->
        <el-table-column
          prop="doctags"
          label="文档类型"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="projectname"
          label="项目名称"
          width="380"
        >
        </el-table-column>
        <el-table-column
          prop="orgname"
          label="建设单位"
          width="420"
        >
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="上传时间"
          width="140"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
        <template slot-scope="scope">
          <div >
             <el-button icon="el-icon-download" type="text" @click="goDetail(scope.row.id)">下载附件</el-button>
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
  name:'file',
   components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,

  },
  data(){
    return {
       listData:data.fileData,
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
    this.pageInfo.total=data.fileData.length
    this.listData=data.fileData
    //   this.listData=data.fileData.filter((item=>{
    //     return item.APPROVALYEAR==0
    // }))
    this.pageInfo.total=this.listData.length
  },
  mounted(){

  },
  methods: {
    // handleSelect(val){
    //  if(val===0){
    //    this.listData=data.fileData
    //    this.pageInfo.total=this.listData.length
    //  }else{
    //     this.listData=data.fileData.filter((item=>{
    //     return item.APPROVALYEAR==val
    // }))
    // this.pageInfo.total=this.listData.length
    //  }
    // },
    goDetail(id){
      // this.$router.push({name:'fileDetail',params:{id}})
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
.file {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.ecoContentClass{
  padding: 20px;
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
.el-button {
  font-size: 14px;
}
</style>
