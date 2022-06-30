<template>
  <eco-content top='0px' bottom='0px' style='background-color:#F5F5F5;'>
    <div class='taskMaintenance'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>在产车点检清单</strong>
          </el-col>
          <el-col :span='19' style='text-align: right;'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show='btnRoleObj["productioncar.productionModelCheck_create"]'>新增</el-button>
            <el-button type='danger' size='small' @click='deleteCase' v-show='btnRoleObj["productioncar.productionModelCheck_delete"]'>删除</el-button>
            <!-- <el-button class='plainBtn' size='small'>导出</el-button> -->
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool'
        style='border:1px solid #ddd;overflow: hidden;'>
        <el-row class='searchRow'>
          <el-col :span='24'>
            <!-- <span class="searchInputLabel">状态:</span>
            <el-select filterable v-model='searchContent.status' style='width:150px;' clearable>
              <el-option v-for='(item,key) in statusList' :value='key' :label='item' :key='key'></el-option>
            </el-select> -->
            <span class='searchInputLabel'>点检标准法规号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
              v-model='searchContent.regulationCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>点检标准法规名称:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
              v-model='searchContent.regulationName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table border @row-click='rowClick' ref='taskMaintenanceTab' @selection-change="handleSelectionChange" stripe :data='tableData'
          header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type='index' label='序号' align='center'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <!-- <el-table-column label='状态' prop='status'>
             <template slot-scope='scope'>
                <span>{{restData(scope.row.status,'status')}}</span>
             </template>
          </el-table-column> -->
          <el-table-column label='点检标准法规号' prop='regulationCode'>
            <template slot-scope='scope'>
              <span class="linkBlue">{{scope.row.regulationCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label='点检标准法规名称' prop='regulationName'></el-table-column>
          <el-table-column label='车型类型' prop='carModel'>
            <!-- <template slot-scope='scope'>
                <span>{{restData(scope.row.carModel,'modelList')}}</span>
          </template> -->
          </el-table-column>
          <el-table-column label='动力类型' prop='powerType'>
            <!-- <template slot-scope='scope'>
                <span>{{restData(scope.row.powerType,'powerList')}}</span>
          </template> -->
          </el-table-column>
          <el-table-column label='实施时间' align='center'>
            <el-table-column label='NT' prop='implTimeNt' width='120' align='center'></el-table-column>
            <el-table-column label='TT' prop='implTimeTt' width='120' align='center'></el-table-column>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="0px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
              layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content>
    </div>
    <drawer ref='taskDrawer' :goRoute='goRoute' :paramsValue='paramsValue' :caseType='caseType' :isShowDrawer='isShowDrawer' :drawerTitle='drawerTitle' @changeDrawerInfo='changeDrawerInfo'  @initDrawerInfo='initDrawerInfo'></drawer>
  </eco-content>
</template>
<script>
  var _self;
  import ecoContent from "@/components/pageAb/ecoContent.vue";
  import ecoLoading from "@/components/loading/ecoLoading.vue";
  import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
  import { EcoUtil } from "@/components/util/main.js";
  import { EcoMessageBox } from "@/components/messageBox/main.js";
  import { mapState } from "vuex";
  import {productioncarChecklistDelete,productioncarChecklistAdd,getRoleBtnSetting,productioncarSpotStandrList,productioncarSpotStandrDel} from '../../service/service.js'
  import drawer from './drawer.vue'
  export default {
    name: 'taskMaintenance',
    data() {
      return {
        btnRoleObj:{},
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        tableData: [],
        isShowSearch: false,
        multipleSelection: [],
        searchContent: {
          // status: '',
          regulationCode: '',
          regulationName: ''
        },
        caseType:'',
        isShowDrawer:false,
        goRoute:"",
        drawerTitle:'',
        paramsValue:{}
      }
    },
    created(){
      _self = this;
      this.initRole();
      this.callAction();
    },
    mounted(){
        this.requestData();
        if(this.toDoRegulationNo){
          this.caseType = 'viewCase';
          this.goRoute = 'spotCheckPage';
          this.drawerTitle = '';
          this.paramsValue = {
            standardRegulationNo:this.toDoRegulationNo,
            toDoStep:this.$route.query.toDoStep
          }
          this.$refs.taskDrawer.activeIndex = 1;
          this.changeShowDrawer(true);
        }
    },
    components:{
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      drawer
    },
    computed: {
       ...mapState(['statusList']),
      contentTop() {
        return this.isShowSearch ? "120px" : "59px";
      },
      toDoRegulationNo(){
           if(this.$route.query.toDoRegulationNo){
             return decodeURIComponent(this.$route.query.toDoRegulationNo);
           }else{
             return false;
           }
      },
    },
    methods: {
      callAction() {
        let callBackDialogFunc = function (obj) {
            if (obj && (obj.action === 'selectRegulationCode')) {
              //选择法规编号
              _self.addCase(obj.data);
            }     
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'taskMaintenance');
      },
      addCase(data){
          //新增
          this.$refs.refLoading.open();
          productioncarChecklistAdd(data.id).then(res=>{
              this.$message.success('新增成功!');
              this.restSearContent();
          })
      },
      initRole() {
        const btn_array = [
           'productioncar.productionModelCheck_create',
           'productioncar.productionModelCheck_delete'
        ];
        getRoleBtnSetting(btn_array).then((res) => {
            if (res.data) {
                this.btnRoleObj = res.data.authenticationMap;
            }
        })
     },
      changeDrawerInfo(obj){
        this.goRoute =obj.goRoute;
        this.caseType=obj.caseType;
        this.drawerTitle=obj.drawerTitle;
        this.paramsValue = obj.paramsValue
      },
      initDrawerInfo(isRefresh){
          this.goRoute ='';
          this.caseType='';
          this.drawerTitle='';
          this.paramsValue = {};
          this.changeShowDrawer(false);
          if(isRefresh){
            this.requestData();
          }
      },
      requestData(type) {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          this.baseInfo.page = 1;
          for (var key in this.searchContent) {
            if(this.searchContent[key]){
                params[key] = this.searchContent[key];
            }
          }
        }
        params.page = this.baseInfo.page;
        productioncarSpotStandrList(params).then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        })
    },
      handleCurrentChange(val) {
        this.baseInfo.page = val;
        this.requestData();
      },
      handleSizeChange(val) {
        this.baseInfo.rows = val;
        this.requestData("search");
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      restSearContent() {
        this.searchContent = {
          // status: '',
          regulationCode: '',
          regulationName: ''
        }
        this.requestData('search');
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
      rowClick(row,column,e){
        //row.id
        // if(this.btnRoleObj['handlingInterfaceBaseDEf_modify']){

        // }
        this.caseType = 'viewCase';
        this.goRoute = 'vehicleInfoList';
        this.drawerTitle = '';
        this.paramsValue = {
          standardRegulationNo:row.regulationCode,
          masterId:row.id
        }
        this.changeShowDrawer(true);
      },
      editCase(row, type) {
          // this.caseType = 'addCase';
          // this.goRoute = 'generateTask';
          // this.drawerTitle = '新增';
          // this.changeShowDrawer(true);
          var url = '/modelInProduction/index.html#/regulatoryForm';
          EcoUtil.getSysvm().openDialog('选择标准法规编号', url, 1100, 600, '15vh');
      },
      changeShowDrawer(bool){
           if(this.isShowDrawer == bool){
              return;
           }
           this.isShowDrawer = bool;
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        // if (this.multipleSelection.length > 1) {
        //   return EcoMessageBox.alert('删除操作不能批量处理,请选中一条', '提示');
        // }
        let doit = function () {
          _self.$refs.refLoading.open();
          // var id = _self.multipleSelection[0].id;
          // productioncarSpotStandrDel(id).then(res => {
          //   _self.multipleSelection = [];
          //   _self.$message.success('删除成功!');
          //   _self.restSearContent();
          // }).catch(err => {
          //   _self.$refs.refLoading.close();
          // })
          let ids = _self.multipleSelection.map(item=>{
              return item.id;
          }) 
          productioncarChecklistDelete(ids).then(res=>{
            _self.multipleSelection = [];
            _self.$message.success('删除成功!');
            _self.restSearContent();    
          })
        }
        EcoMessageBox.confirm(`您确定要删除数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
      },
    }
  }
</script>
<style scoped>
  .taskMaintenance {
    min-width: 1000px;
    position: relative;
    margin: 0 24px;
    top: 2%;
    height: 96%;
    overflow-y: auto;
    color: #0f1419;
  }

  .taskMaintenance .searchRow {
    padding: 15px 10px 16px 10px;
    background: #fff
  }

  .taskMaintenance .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }
</style>