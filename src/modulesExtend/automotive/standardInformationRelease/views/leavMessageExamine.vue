<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='certificate'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <eco-tool-title title='留言审核'></eco-tool-title>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <!-- class="plainBtn"  -->
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='okCase'>通过</el-button>
            <el-button type='primary' size='small' @click='cancelCase'>不通过</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>&emsp;&emsp;留言人姓名:</span>
            <el-input clearable style='width:150px' v-model='searchContent.publisher'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;留言时间:</span>
            <el-date-picker style='width:150px' v-model="searchContent.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;留言人工号:</span>
            <el-input clearable style='width:150px' v-model='searchContent.publisherEmId'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24' style='margin-top:7px;'>

            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;&emsp;状态:</span>
            <el-select filterable v-model='searchContent.status' style='width:150px;' clearable>
              <el-option :value='item.val' :label='item.text' v-for='(item,index) in statusData' :key='index'></el-option>
            </el-select>
            &emsp;&emsp;
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table ref='certificateListTable' stripe :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark'
          height='100%' @selection-change="handleSelectionChange" class='standardizationTable'>
          <el-table-column type="selection" width="55" align='center'>
          </el-table-column>
          <el-table-column type='index' label='序号' width="80px">
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="publisherEmId" width="100px">
          </el-table-column>
          <el-table-column label="留言人" prop="publisher" width="100px">
          </el-table-column>
          <el-table-column label="时间" prop="createDate" width="100px">
          </el-table-column>
          <el-table-column label="标题" prop="standardMessageTitle">
          </el-table-column>
          <el-table-column label="内容" prop="content">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column label='状态' prop='status' width="100px">
            <template slot-scope='scope'>
              <span>{{statusObj[scope.row.status]}}</span>
            </template>
          </el-table-column>
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
  import {sysEnv} from '../config/env.js'
  import { EcoUtil } from '@/components/util/main.js'
  import { EcoMessageBox } from '@/components/messageBox/main.js'
  import { mapState } from 'vuex'
  import { getStatusData, getExamineLeavMsg,getLeavMsgIsok,leavStatus  } from '../service/service.js'
  export default {
    name: 'InformationRelease',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed: {
      ...mapState(['typeList']),
      contentTop() {
        return this.isShowSearch ? '150px' : '59px';
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
        searchContent: {
          publisherEmId: '',
          type: '',
          publisher: '',
          startDate: '',
          status: ''
        },
        tableData: [],
        multipleSelection: [],
        statusData: [],
        typeObj:{},
        statusObj:{},
        currentSelect: null
      }
    },
    created() {
      this.leavStatus()
      this.getStatusData()
      this.getExamineLeavMsg()
    },
    mounted() {
    },
    filters: {

    },
    methods: {
      //留言数据状态
      leavStatus() {
        leavStatus().then(res => {
        })
      },
      //搜索
      requestData() {
        this.getExamineLeavMsg(this.searchContent)
      },
      //获取table数据
      getExamineLeavMsg(data) {
        getExamineLeavMsg(data).then(res => {
          this.tableData = res.data.rows.map(x => {
            return {
              ...x,
              createDate: x.createDate.slice(0,10)
            }
          })
          this.baseInfo.total = res.data.total
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
      handleSelectionChange(e) {
        this.currentSelect = e
      },
      handleCurrentChange(e) {
        this.baseInfo.page = e;
        this.getExamineLeavMsg(this.searchContent)
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch
      },
      releaseDynamics() {
        if (sysEnv==0){
            this.$router.push({name:'addProcess'})
        }else{
            EcoUtil.getSysvm().openDialog('动态发布','/standardInformationRelease/#/addProcess',700,500,'10vh');
        }
      },
      //通过
      okCase() {
        this.currentSelect = this.currentSelect.map(x => {
          return {
            id: x.id
          }
        })
        var ids = []
        this.currentSelect.forEach(x => {
          ids.push(x.id)
        });
        ids = ids.join(',')
        var data = {}
        data.id = ids
        data.reviewFlag = true
        getLeavMsgIsok(data).then(res => {
          this.$message.success("审核已通过")
          this.getExamineLeavMsg(this.searchContent)
        })
      },
      //不通过
      cancelCase() {
        this.currentSelect = this.currentSelect.map(x => {
          return {
            id: x.id
          }
        })
        var ids = []
        this.currentSelect.forEach(x => {
          ids.push(x.id)
        });
        ids = ids.join(',')
        var data = {}
        data.id = ids
        data.reviewFlag = false
        getLeavMsgIsok(data).then(res => {
          this.$message.success("审核不通过")
          this.getExamineLeavMsg(this.searchContent)
        })
      },
      drafts() {
        if (sysEnv==0){
            this.$router.push({name:'draftBox'})
        }else{
            EcoUtil.getSysvm().openDialog('动态发布','/standardInformationRelease/#/draftBox',300,80,'30vh');
        }
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
          let goPage = "/wh/jsp/version3/project/index.html@/informationView/?id=" + data.id;
          tabObj.desc = data.name;
          tabObj.tabKey = "informationView";
          tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'informationView',doNothing:'N',cmd:'v3.goPage',goPage:'"+goPage+"'}";
          window.sysvm.doTab(tabObj);
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
