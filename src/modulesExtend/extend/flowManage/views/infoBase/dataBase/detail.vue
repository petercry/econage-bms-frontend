<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
 <div class="dataBaseDetail">
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;box-sizing:border-box"
      >
        <el-row style="padding:12px 10px;background-color:#fff;">
          <el-col :span="24">
            <!-- <eco-tool-title
              style="line-height: 34px;margin-right:50px;fontWeight:700;"
              :title="'项目详情'"
            ></eco-tool-title> -->
            <el-button type="primary" @click="goBack" class="fr-right"><i class="el-icon-back" style="margin-right:8px"></i>返回列表</el-button>
          </el-col>
        </el-row>
      </eco-content>
        <eco-content
        bottom="0"
        top="60px"
        ref="content"
        class="ecoContentClass"
      >
      <div class="title">
        <span class="sub-title">项目基本信息</span>
      </div>
      <div class="content">
    <el-form label-position="right" label-width="240px" :model="form">
            <el-form-item label="项目名称：">
              <el-input v-model="form.name" readonly size="small"></el-input>
            </el-form-item>
              <el-form-item label="项目建设单位">
              <el-input v-model="form.unit" readonly size="small"> </el-input>
            </el-form-item>
                 <el-form-item label="年度计划项目编码：">
              <el-input v-model="form.code" readonly size="small"></el-input>
            </el-form-item>
            <el-form-item label="项目类型：">
              <el-input v-model="form.type" readonly size="small"></el-input>
            </el-form-item>
            <el-form-item label="项目总投资（万元）：">
              <el-input v-model="form.touzi" readonly size="small"></el-input>
            </el-form-item>
            <el-form-item label="项目建设内容简介：">
             <el-input v-model="form.desc"    :autosize="{ minRows: 4}"
              type="textarea" readonly> </el-input>
            </el-form-item>
          </el-form>
      </div>
      <div class="title">
        <span class="sub-title">申报数据资源归集</span>
      </div>
      <div class="table-content">
        <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :span-method="arraySpanMethod"
        height="100%"
        :header-cell-style="{backgroundColor:'#f5f5f6',color:'#526069',fontWeight:700,height:'40px'}"
        border
        :cell-style="{fontSize:'14px'}"
      >
        <el-table-column
          prop="data1"
          label="资源性质"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="data2"
          label="数据表名(中文)"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="data3"
          label="数据表名(英文)"
          width="260"
        >
        </el-table-column>
        <el-table-column
          prop="data4"
          label="字段名(中文)"
          width="240"
        >
        </el-table-column>
        <el-table-column
          prop="data5"
          label="字段名(英文)"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="data6"
          label="申报字段名(中文)"
        >
        </el-table-column>
        <el-table-column
          prop="data7"
          label="申报字段名(英文)"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="data8"
          label="字段性质"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="data9"
          label="验证状态"
          width="120"
        >
        </el-table-column>
      </el-table>
      </div>
      <el-row style="marginTop:30px">
         <el-col align="center">
            <el-button style="width:50%;color:#fff;backgroundColor:#1ab394;padding:8px" @click="goBack">返回列表</el-button>
         </el-col>
      </el-row>
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

export default {
 name: 'dataBaseDetail',
 components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
 },
 data () {
 return {
   form:{
      name:'XX市2021政府数字化转型项目',
      unit:'XX市数据资源管理局',
      code:'XXH-2021095001004*',
      type:'新建',
      touzi:'387.0',
      desc:'市级统建集约化平台建设、“好差评”分析，“国考”、“省考”技术服务和办事指南校验服务，浙江政务服务网XX站点运营和“浙里办”APPXX站点运营，“一窗受理”平台优化，政府数字化转型工作监管服务'
   },
   tableData:[
    {
        data1:'修改',
        data2:'项目建设信息',
        data3:'PROJECT_CONSTRUCT_INFO',
        data4:'报告类型',
        data5:'REPORT_TYPE',
        data6:'报告类型',
        data7:'REPORT_TYPE',
        data8:'-',
        data9:'已申报'
    },
    {
        data1:'修改',
        data2:'项目建设信息',
        data3:'PROJECT_CONSTRUCT_INFO',
        data4:'开工、年报、季报、竣工等节点的时间	',
        data5:'CONSTRUCT_YEAR',
        data6:'开工、年报、季报、竣工等节点的时间	',
        data7:'CONSTRUCT_YEAR',
        data8:'-',
        data9:'已申报'
    },
   ],
   id:'',
 }
 },
 created() {
   this.id=this.$route.params.id
 },
 methods:{
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0||columnIndex === 1||columnIndex === 2) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
    },
    goBack(){
       if(sysEnv!==1){
          this.$router.go(-1)
       }else{
        let tabObj = {};
        tabObj.desc = '数据资源目录库'
        let goPage = "flowManage/index.html#/dataBase";
        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'dataBase',href_link:'" + goPage + "'}";
        tabObj.reload = true;
        tabObj.clearIframe = true;
        EcoUtil.getSysvm().doTab(tabObj);
        let that=this
        setTimeout(() => {
            window.parent.window.sysvm.removeTab('dataBaseDetail' + that.id);
        }, 100);
       }
    }
 }
}
</script>

<style  scoped>
.dataBaseDetail {
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
  overflow-y:hidden;
}
.el-tabs /deep/ .el-tabs__header{
  background-color: #fff ;
}
.el-tabs{
  /* height: calc(100% - 80px); */
  height: 100%;
}
.el-tabs /deep/ .el-tabs__content{
  height: 95%;
  overflow: auto;
}
.el-tabs /deep/ .el-tab-pane{
  height: 100%;
}
.title{
    border-bottom: 2px solid #1c84c6;
    color: #fff;
    background-color: #fff;
    height: 25px;
    margin: 0px 0px 20px 0px;
}
.sub-title{
    background-color: #1c84c6;
    color: #FFF;
    border-radius: 4px;
    padding: 4px;
    font-weight: 700;
    cursor: pointer;
}
</style>
