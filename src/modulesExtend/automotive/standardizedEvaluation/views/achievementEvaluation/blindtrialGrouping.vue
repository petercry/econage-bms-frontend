<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='certificate'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <eco-tool-title title='盲审分组'></eco-tool-title>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <el-button type='primary' size='small' @click='addCase'>新增</el-button>
            <el-button type='primary' size='small' @click='addCase'>删除</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content top='59px' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table ref='certificateListTable' stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark'
          height='100%' @selection-change="handleSelectionChange" class='standardizationTable'>
          <el-table-column type="selection" width="55" align='center'>
          </el-table-column>
          <el-table-column type='index' label='序号'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column label='年份' prop='year'>
            <template slot-scope="scope">
              <span @click="toView(scope.row)">{{scope.row.year}}</span>
            </template>
          </el-table-column>
          <el-table-column label='状态' prop='user'></el-table-column>
          <el-table-column label='组号' prop='user'></el-table-column>
          <el-table-column label='部门' prop='user'></el-table-column>
          <el-table-column label='标准分类' prop='user'></el-table-column>
          <el-table-column label='标准类型' prop='user'></el-table-column>
          <el-table-column label='标准编号' prop='user'></el-table-column>
          <el-table-column label='标准名称' prop='user'></el-table-column>
          <el-table-column label='会签完成时间' prop='user' width="100px"></el-table-column>
          <el-table-column label='科室' prop='user'></el-table-column>
          <el-table-column label='制定人' prop='user'></el-table-column>
          <el-table-column label='分标委' prop='user'></el-table-column>
          <el-table-column label='材料' prop='user'></el-table-column>
          <el-table-column label='平均分' prop='user'></el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[10,30,50,100]"
              :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
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
  import {sysEnv} from '../../config/env.js'
  import { EcoUtil } from '@/components/util/main.js'
  import { EcoMessageBox } from '@/components/messageBox/main.js'
  import { mapState } from 'vuex'
  import {   } from '../../service/service.js'
  export default {
    name: 'InformationRelease',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed: {
    },
    data() {
      return {
        btnRoleObj:{},
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContent: {
          isRecommend: '',
          title: '',
          type: '',
          publisher: '',
          startDate: '',
          status: ''
        },
        tableData: [
            {year: '2019',user: 'xyd',time:"2011-9-9"},
            {year: '2019',user: 'xyd',time:"2011-9-9"},
            {year: '2019',user: 'xyd',time:"2011-9-9"}
        ],
        multipleSelection: [],
        typeData: [],
        statusData: [],
        typeObj:{},
        statusObj:{}
      }
    },
    created() {
    //   this.getTypeData()
    //   this.getStatusData()
      this.getStandardList()
    },
    mounted() {
      this.listAction()
    },
    filters: {

    },
    methods: {
      listAction() {
          let that = this
          let callBackDialogFunc = function (obj) {
              if (obj && obj.action) {
                //   that.getStandardList(that.searchContent)
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'InformationRelease')
      },
      //获取table数据
      getStandardList(data) {
        // getStandardList(data).then(res => {
        //   this.tableData = res.data.rows.map(x => {
        //     return {
        //       ...x,
        //       createDate: x.createDate.slice(0,10)
        //     }
        //   })
        //   this.baseInfo.total = res.data.total
        // })
      },
      //获取状态数据
      getStatusData() {
        getStatusData().then(res => {
          this.statusObj = res.data
          for (var i in res.data) {
              this.statusData.push({val: i,text: res.data[i]})
          }
        })
      },
      handleSelectionChange() {

      },
      handleCurrentChange(e) {
        this.baseInfo.page = e;
        this.getStandardList(this.searchContent)
      },
      addCase() {
        if (sysEnv==0){
            this.$router.push({name:'addGroup'})
        }else{
            EcoUtil.getSysvm().openDialog('新增评比','/standardizedEvaluation/#/addGroup',500,300,'35vh');
        }
      },
      handleSizeChange() {

      },
      //发布信息查看
      toView(data) {
        if (sysEnv==0){
            this.$router.push({name:'informationView',params: {id: data.id}})
        }else{
          let tabObj = {};
          let goPage = "standardInformationRelease/index.html#/informationView/" + data.id;
          tabObj.desc = data.title;
          tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'" + data.title + "',href_link:'" + goPage + "',fullScreen:false}";
          window.parent.window.sysvm.doTab(tabObj);
        }
      }
    }
  }
</script>
<style scoped>
  .certificate {
    color: #0f1419;
    min-width: 1000px;
    position: relative;
    height: 95%;
    margin: 0 24px;
    top: 5%;
    overflow-y: auto;
    color: #0f1419;
  }

  .certificate .plainBtn:first-of-type {
    margin-left: 20px;
  }

  .certificate .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
    background: #f5f7fa !important;
  }

  .standardizationTable /deep/ .tableHeader th {
    background: #f5f7fa;
    color: #000;
    /* border-bottom-width: 0px; */
  }

  /* .standardizationTable /deep/ .el-table__row td {
    border-bottom-width: 0px;
  }

  .standardizationTable /deep/ .el-table__row td,
  .standardizationTable /deep/ .tableHeader th {
    border: 0px;
  } */
</style>
