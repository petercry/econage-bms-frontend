<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='certificate'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <eco-tool-title title='标准信息发布'></eco-tool-title>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <!-- class="plainBtn"  -->
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='releaseDynamics'>发布动态</el-button>
            <!-- <el-button type='primary' size='small' @click='viewSent'>查看已发</el-button> -->
            <el-button type='primary' size='small' @click='drafts'>草稿箱</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;标题:</span>
            <el-input clearable style='width:150px' v-model='searchContent.title'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;类别:</span>
            <el-select filterable v-model='searchContent.type' style='width:150px;' clearable @change="handleClick">
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in typeData' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;日期:</span>
            <el-date-picker style='width:150px' v-model="searchContent.startDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col :span='24' style='margin-top:7px;'>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;发送人:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.publisher'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;状态:</span>
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
          <el-table-column type='index' label='序号'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label='标题' prop='title'>
            <template slot-scope="scope">
              <!-- <span @click="toView(scope.row)">{{scope.row.title}}</span> -->
              <el-button @click="toView(scope.row)" type="text">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label='类别' prop='type'>
            <template slot-scope='scope'>
              <span>{{scope.row.typeText}}</span>
            </template>
          </el-table-column>
          <el-table-column label='日期' prop='createDate'></el-table-column>
          <el-table-column show-overflow-tooltip label='发送人' prop='publisher'></el-table-column>
          <el-table-column label='状态' prop='status'>
            <template slot-scope='scope'>
              <span>{{statusObj[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column label='意见反馈条数' prop='feedbackTotal'></el-table-column>
          <el-table-column label='今日反馈条数' prop='feedbackToday'></el-table-column>
          <el-table-column label='阅读总人数' prop='readTotal'></el-table-column>
          <!-- <el-table-column label='操作' fixed='right' align='center' width='100'>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")' v-show='btnRoleObj["certificate.management_UPDATE_CERTICICATE"]'>修改</el-button>
              <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
            </template>
          </el-table-column> -->
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
  import { getGroupList, getStatusData, getStandardList,getRoleBtnSetting,getPublicSettingUnion  } from '../service/service.js'
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
          title: '',
          type: '',
          publisher: '',
          startDate: '',
          status: ''
        },
        tableData: [],
        multipleSelection: [],
        typeData: [],
        statusData: [],
        typeObj:{},
        statusObj:{}
      }
    },
    created() {
      if(this.$route.query.type){
          //门户会议 标准动态 意见
          this.searchContent.type = this.$route.query.type;
      }
      this.getStatusData()
      this.getStandardList()
    },
    mounted() {
      this.listAction();
      if(this.$route.query.targetURL){
        //门户会议
        this.toView({title:'详情',id:this.$route.query.targetURL});
      }
    },
    filters: {

    },
    methods: {
      listAction() {
          let that = this
          let callBackDialogFunc = function (obj) {
              if (obj && obj.action) {
                  that.getStandardList(that.searchContent)
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'InformationRelease')
      },
      //搜索
      requestData() {
        this.getStandardList(this.searchContent)
      },
      //获取table数据
      getStandardList(data) {
        this.getTypeData()
        getStandardList(data).then(res => {
          this.tableData = res.data.rows.map(x => {
            var typeText = this.typeData.find(a => a.id == x.type) ? this.typeData.find(a => a.id == x.type).text : ''
            return {
              ...x,
              createDate: x.createDate.slice(0,10),
              typeText: typeText
            }
          })
          this.baseInfo.total = res.data.total
        })
      },
      //获取类型数据
      getTypeData() {
        getGroupList().then(res => {
          this.typeData = res.data
        })
      },
      handleClick(e) {
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
      releaseDynamics() {
        if (sysEnv==0){
            this.$router.push({name:'addProcess',params:{id: '1'}})
        }else{
            EcoUtil.getSysvm().openDialog('动态发布','/standardInformationRelease/#/addProcess/' + '1',800,700,'10vh');
        }
      },
      viewSent() {

      },
      drafts() {
        if (sysEnv==0){
            this.$router.push({name:'draftBox'})
        }else{
            EcoUtil.getSysvm().openDialog('草稿箱','/standardInformationRelease/#/draftBox',700,500,'10vh',null,false);
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
