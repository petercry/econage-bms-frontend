<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='certificate'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <eco-tool-title title='评委打分'></eco-tool-title>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <!-- class="plainBtn"  -->
            <!-- <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='addCase'>新增评比</el-button> -->
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col :span='24' style='margin-top:7px;'>
            <span class='searchInputLabel'>&emsp;评委专家姓名:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContentYear'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            &emsp;&emsp;
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table ref='certificateListTable' stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark'
          height='100%' @selection-change="handleSelectionChange" class='standardizationTable'>
          <el-table-column label='部门' prop='time'></el-table-column>
          <el-table-column label='标准编号' prop='time'></el-table-column>
          <el-table-column label='标准名称' prop='time'></el-table-column>
          <el-table-column label='会签完成时间' prop='time'></el-table-column>
          <el-table-column label='制定人' prop='time'></el-table-column>
          <el-table-column label='标准主要内容，应用情况及效益' prop='time'></el-table-column>
          <el-table-column label='材料' prop='time'></el-table-column>
          <el-table-column label='打分' prop='time'>
            <el-input clearable style='width:100%' v-model='searchContentYear'
              placeholder='请输入'>
            </el-input>
          </el-table-column>
          <el-table-column label='备注' prop='time'>
            <el-input clearable style='width:100%' v-model='searchContentYear'
              placeholder='请输入'>
            </el-input>
          </el-table-column>
        </el-table>
      </eco-content>
      <!-- <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[10,30,50,100]"
              :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content> -->
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
            <el-col :span="24" style="text-align:center">
                <el-button>取消</el-button>
                <el-button type="primary" @click="saveCase">保存</el-button>
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
    name: 'judgesWaitList',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed: {
      ...mapState(['typeList']),
      contentTop() {
        return this.isShowSearch ? '125px' : '59px';
      }
    },
    data() {
      return {
        btnRoleObj:{},
        isShowSearch: true,
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContentyear: '1',
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
      //搜索
      requestData() {
        console.log(this.searchContent)
        this.getStandardList(this.searchContent)
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
      //获取类型数据
      getTypeData() {
        getTypeData().then(res => {
          this.typeObj = res.data
          for (var i in res.data) {
              this.typeData.push({val: i,text: res.data[i]})
          }
        })
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
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch
      },
      handleCase() {
        if (sysEnv==0){
            this.$router.push({name:'judgesScoreList',params:{id: '1'}})
        }else{
            EcoUtil.getSysvm().openDialog('新增评比','/standardizedEvaluation/#/judgesScoreList/' + '1',800,700,'10vh');
        }
      },
      viewSent() {

      },
      //重置输入框
      restSearContent() {
        this.searchContent = {}
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
    height: 96%;
    margin: 0 24px;
    top: 2%;
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
