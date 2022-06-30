<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='structurebaseOrganizationList'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>法规结构化数据库编制</strong>
          </el-col>
          <el-col :span='19' style='text-align:right;margin-top:2px;'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show='btnRoleObj["dongfeng.thinktank.structurebase.planning_create"]'>新增</el-button>
            <el-button type='danger' size='small' @click='deleteCase' v-show='btnRoleObj["dongfeng.thinktank.structurebase.planning_delete"]'>删除</el-button>
            <el-button type='primary' size='small' @click='openApprope' v-show="btnRoleObj['dongfeng.thinktank.structurebase.planning_submit']">提交</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>状态:</span>
            <el-select v-model='searchContent.status' style='width:100px;' clearable>
              <el-option :value='key' :label='item' v-for='(item,key) in statusSet.statusMap' :key='key'></el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&ensp;操作类型:</span>
            <el-select v-model='searchContent.actionType' style='width:100px;' clearable>
              <el-option :value='key' :label='item' v-for='(item,key) in statusSet.actionTypeMap' :key='key'></el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;分类:</span>
            <el-select v-model='searchContent.category' style='width:100px;' clearable>
              <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in typeList' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;&emsp;子类:</span>
            <el-select v-model='searchContent.subCategory' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in subClassListGroup' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>法规状态:</span>
            <el-select v-model='searchContent.standardStatus' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
            </el-select>
          </el-col>
          <el-col :span='24' style='margin-top:7px;'>
            <span class='searchInputLabel'>性质:</span>
            <el-select v-model='searchContent.nature' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>适用整车/零部件:</span>
            <el-select v-model='searchContent.applicableType' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in vehicleList' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>认证管理分类:</span>
            <el-select v-model='searchContent.certificationType' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in authenticationList' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>适用车型:</span>
            <el-select v-model='searchContent.carModel' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in applicableModels' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>动力类型:</span>
            <el-select v-model='searchContent.powerType' style='width:100px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in powerType' :key='item.id'></el-option>
            </el-select>
          </el-col>
          <el-col :span='24' style='margin-top:7px;'>
            <span class='searchInputLabel'>&ensp;NT:</span>
            <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
              value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
            </el-date-picker>
            <span class='searchInputLabel'>TT:</span>
            <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='width:250px' v-model="searchContent.dateRange2"
              value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col style='margin-top:7px;'>
            <span class='searchInputLabel'>法规编号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationCode'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>法规名称:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationName'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table border ref='organizationListTable' @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'
          tooltip-effect='dark' height='100%' class='standardizationTable'>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type='index' label='序号' align='center'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width='160' label='状态' prop='status' align='center'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.status,'status')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='操作类型' prop='actionType' align='center'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.actionType,'actionType')}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width='160' label='法规编号' prop='regulationCode' align='center'></el-table-column>
          <el-table-column show-overflow-tooltip width='160' label='法规名称' prop='regulationName' align='center'>
            <template slot-scope='scope'>
              <span class="lineBlue" @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.regulationName}}</span>
            </template>
          </el-table-column>
          <el-table-column label='分类' prop='category' min-width='150' align='center'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.category,'category')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='子类' prop='subCategory' min-width='150' align='center'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.subCategory,'subCategory')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='实施时间' align='center'>
            <el-table-column show-overflow-tooltip label='NT' prop='implTimeNt' align='center' width='140'></el-table-column>
            <el-table-column show-overflow-tooltip label='TT' prop='implTimeTt' align='center' width='140'></el-table-column>
          </el-table-column>
          <el-table-column label='法规状态' prop='standardStatus' align='center'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.standardStatus,'standardStatus')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='发起人' prop='createUserName'></el-table-column>
          <el-table-column label='发起时间' prop='createDate' width='140'></el-table-column>
          <el-table-column label='驳回原因' prop='rejectCause' width='200' show-overflow-tooltip></el-table-column>
          <el-table-column label='操作' fixed='right' align='center' width='120' v-if='btnRoleObj["dongfeng.thinktank.structurebase.planning_modify"]'>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")' v-if='scope.row.status!="approving"'>修改</el-button>
              <el-button type='text' @click.stop='openHistory(scope.row.id)'>历史版本</el-button>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
              :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <el-drawer custom-class='oranizationDrawer' :wrapperClosable='false' :destroy-on-close='true' :before-close='drawerBeforeClose'
      size='1100px' :modal='false' :append-to-body='true' :visible.sync="isShowDrawer"  :with-header="true">
      <div slot='title' class='drawerHeader'>
        <span>{{drawerTitle}}</span>
        <div class='planBox'>
          <span class='plan-item' @click='changePlanActive(0)' :class='{active:activeIndex==0}'>标准信息</span>
          <span class='plan-item' @click='changePlanActive(1)' :class='{active:activeIndex==1}' v-if='caseType!=="addCase"'>条文信息</span>
        </div>
        <el-button class='saveBtn' type="primary" size="mini" @click="onSubmit" v-show='isEdit && (activeIndex==0)'>保存</el-button>
      </div>
      <editPage ref='editPage' v-show='activeIndex==0' :caseType='caseType' v-if='isShowDrawer'  :id='id' fromPage='organizationList' @callAction='callAction'></editPage>
      <articleList v-show='activeIndex==1' :caseType='caseType' v-if='caseType!=="addCase" && isShowDrawer' :id='id'  fromPage='organizationList'></articleList>
    </el-drawer>
  </eco-content>
</template>
<script>
  var _self;
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import { EcoUtil } from '@/components/util/main.js'
  import { EcoMessageBox } from '@/components/messageBox/main.js'
  import { mapState } from 'vuex'
  import editPage from './edit.vue'
  import articleList from './articleList.vue'
  import { structurebaseManageList, structurebaseDel, structurebaseCommit, getRoleBtnSetting } from '../service/service.js'
  export default {
    name: 'structurebaseOrganizationList',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      editPage,
      articleList
    },
    computed: {
      ...mapState(['typeList', 'subClassList', 'natureList', 'vehicleList', 'authenticationList', 'applicableModels', 'powerType', 'standardState', 'statusSet']),
      contentTop() {
        return this.isShowSearch ? '220px' : '59px';
      },
      isEdit() {
        return this.caseType !== 'viewCase'
      },
      subClassListGroup(){
          let data = [];
          if(this.searchContent.category){
            data = this.subClassList[this.searchContent.category];
          }
          this.searchContent.subCategory='';
          return data;
      } 
    },
    data() {
      return {
        timer:null,
        isShowSearch: false,
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContent: {
          status: '',
          actionType: '',
          category: '',
          subCategory: '',
          standardStatus: '',
          regulationName: '',
          nature: '',
          applicableType: '',
          certificationType: '',
          carModel: '',
          powerType: '',
          regulationCode: '',
          dateRange1: [],
          dateRange2: []
        },
        tableData: [],
        multipleSelection: [],
        btnRoleObj: {},
        isShowDrawer: false,
        drawerTitle: '',
        activeIndex: 0,
        id: 0,
        caseType: ''
      }
    },
    created() {
      _self = this;
      this.callAction2();
      this.initRole();
    },
    mounted() {
      this.$refs.refLoading.open();
        let requestTimer=setInterval(() => {
            if(JSON.stringify(this.subClassList)!=='{}'){
                this.requestData();
                clearInterval(requestTimer);
            }
      }, 200);
    },
    methods: {
      openHistory(id){
         //打开历史列表
         let url = '/regulationStructured/index.html#/historyList/'+id;
         EcoUtil.getSysvm().openDialog('历史版本',url,'1000','700');
      },
      onSubmit() {
        this.$refs.editPage.onSubmit();
      },
      changePlanActive(active) {
        if (this.activeIndex == active) {
          return;
        }
        this.activeIndex = active;
      },
      drawerBeforeClose(done) {
        if(this.isEdit && this.activeIndex==0){
          let keyArr = { 'editCase': '编辑', 'viewCase': '查看', 'addCase': '新增' };
          let doit = function(){
            done();
          }
          EcoMessageBox.confirm(`您确定要放弃${keyArr[this.caseType]}操作吗?`, '提示', { type: 'warning', lockScroll: false }, doit)
        }else{
          done();
        }
      },
      initRole() {
        const btn_array = [
           'dongfeng.thinktank.structurebase.planning_create',
           'dongfeng.thinktank.structurebase.planning_delete',
           'dongfeng.thinktank.structurebase.planning_modify',
           'dongfeng.thinktank.structurebase.planning_submit'
        ];
        getRoleBtnSetting(btn_array).then((res) => {
          if (res.data) {
            this.btnRoleObj = res.data.authenticationMap;
          }
        })
      },
      openApprope(){
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要提交的行再进行操作。', '提示');
        }
        // if (this.multipleSelection.length > 1) {
        //   return EcoMessageBox.alert('提交操作不能批量处理,请选择一条数据。', '提示');
        // }
        // if (this.multipleSelection[0].status !== 'withdraw' && this.multipleSelection[0].status !== 'planning') {
        //   return EcoMessageBox.alert('状态为编制中、退回的项才可提交审核', '提示');
        // }
        let bool = this.multipleSelection.every(item=>{
            return item.status == 'withdraw' || item.status == 'planning'
        })
        if(!bool){
          return EcoMessageBox.alert('状态为编制中、退回的项才可提交审核', '提示');
        }
        var url;
        if(this.multipleSelection.length===1 && this.multipleSelection[0].status==='withdraw'){
            url = '/regulationStructured/index.html#/appropeUser?assigneeId='+this.multipleSelection[0].approveUser;
        }else{
            url = '/regulationStructured/index.html#/appropeUser'
        }
        EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
      },
      submitCase(assigneeId) {
        this.$refs.refLoading.open();
        // var id = this.multipleSelection[0].id;
        this.multipleSelection.forEach(item=>{
          structurebaseCommit(item.id,assigneeId).then(res => {
            if(this.timer){
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(function(){
              _self.multipleSelection = [];
              _self.$message.success('提交成功!');
              _self.restSearContent();
            },450)
          }).catch(err => {
            this.$refs.refLoading.close();
          })
        })
    
      },
      callAction2(){
          let callBackDialogFunc = function (obj) {
            if(obj && (obj.action === 'appropeUser')){
                _self.submitCase(obj.data.assigneeId);
            }  
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'structuredOrganizationList');
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
      restSearContent() {
        this.searchContent = {
          status: '',
          actionType: '',
          category: '',
          subCategory: '',
          standardStatus: '',
          regulationName: '',
          nature: '',
          applicableType: '',
          certificationType: '',
          carModel: '',
          powerType: '',
          regulationCode: '',
          dateRange1: [],
          dateRange2: []
        };
        this.requestData('search');
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        // if (this.multipleSelection.length > 1) {
        //   return EcoMessageBox.alert('删除操作不能批量处理,请选中一条', '提示');
        // }
        let isReturn = this.multipleSelection.some(item=>{
            return item.status === "approving"
        })
        if(isReturn){
          return EcoMessageBox.alert('状态为待审核的项不能删除!', '提示');
        }
        let doit = function () {
          // var id = _self.multipleSelection[0].id;
          _self.$refs.refLoading.open();
          _self.multipleSelection.forEach(item=>{
              structurebaseDel(item.id).then(res => {
                  if(_self.timer){
                     clearTimeout(_self.timer);
                     _self.timer = null;
                  }
                  _self.timer = setTimeout(function(){
                      _self.multipleSelection = [];
                      _self.$message.success('删除成功!');
                      _self.restSearContent();
                  },450)
              }).catch(err => {
                _self.$refs.refLoading.close();
              })
          })
        }
        // EcoMessageBox.confirm(`您确定要删除,法规编号为${this.multipleSelection[0].regulationCode}的数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
        EcoMessageBox.confirm(`您确定要进行删除操作?`, '提示', { type: 'warning', lockScroll: false }, doit)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      callAction(obj) {
        this.isShowDrawer = false;
        if (obj && (obj.action === 'edit')) {
          //修改 刷新
          this.$message.success('修改成功!');
          this.requestData();
        } else if (obj.action === 'add') {
          //新建 刷新
          this.$message.success('新建成功!');
          this.restSearContent();
        }
      },
      editCase(row, type) {
        var keyArr = { 'editCase': '编辑', 'viewCase': '查看', 'addCase': '新增' };
        this.caseType = type;
        this.drawerTitle = keyArr[type];
        this.activeIndex = 0;
        if (type === "editCase" || type === 'viewCase') {
          this.id = row.id;
        } else {
          this.id = '0';
        }
        this.isShowDrawer = true;
      },
      handleSizeChange(val) {
        this.baseInfo.rows = val;
        this.requestData('search')
      },
      handleCurrentChange(val) {
        this.baseInfo.page = val;
        this.requestData();
      },
      requestData(type) {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],// 
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          this.baseInfo.page = 1;
          for (var key in this.searchContent) {
            if (this.searchContent[key]) {
              if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                params.ntStartDate = this.searchContent[key][0];//nt开始时间
                params.ntEndDate = this.searchContent[key][1]; //nt结束时间
              } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                params.ttStartDate = this.searchContent[key][0]; //tt开始时间
                params.ttEndDate = this.searchContent[key][1]; //tt结束时间
              } else {
                params[key] = this.searchContent[key];
              }
            }
          }
        }
        params.page = this.baseInfo.page;
        structurebaseManageList(params).then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        })
      }
    },
    watch: {

    }
  }
</script>
<style scoped>
  .structurebaseOrganizationList {
    color: #0f1419;
    min-width: 1000px;
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: auto;
    color: #0f1419;
  }

  .structurebaseOrganizationList .plainBtn:first-of-type {
    margin-left: 20px;
  }

  .structurebaseOrganizationList .searchInputLabel {
    font-size: 14px;
    margin-left: 8px;
  }

  .structurebaseOrganizationList .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
    background: #f5f7fa !important;
  }

  .structurebaseOrganizationList .standardizationTable /deep/ .tableHeader th {
    background: #f5f7fa;
    color: #000;
    /* border-bottom-width: 0px; */
  }

  /* .structurebaseOrganizationList .standardizationTable /deep/ .el-table__row td {
    border-bottom-width: 0px;
  }

  .structurebaseOrganizationList .standardizationTable /deep/ .el-table__row td,
  .structurebaseOrganizationList .standardizationTable /deep/ .tableHeader th {
    border: 0px;
  } */
</style>