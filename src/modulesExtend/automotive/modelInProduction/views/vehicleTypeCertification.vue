<template>
  <eco-content top='60px' bottom='0px' type='tool'>
    <div class='vehicleTypeCertificationList'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>车型认证符合性管控</strong>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <!-- <el-button type='primary' size='small' @click="initCase" v-show='isEdit'>初始化</el-button> -->
            <el-button type='danger' size='small' @click='deleteCase'  v-show='isEdit && (fromPage === "organizationList" && btnRoleObj["announcementCarModel.planning_modify"]) || ((fromPage === "finishList" && btnRoleObj["announcementCarModel.finish_modify"]))'>删除</el-button>
            <!-- <el-button class='plainBtn' size='small' @click='dispatchCase' v-show='isEdit'>发布</el-button> -->
            <el-button type='primary' size='small' @click='importCase'  v-show='isEdit && (fromPage === "organizationList" && btnRoleObj["announcementCarModel.planning_modify"]) || ((fromPage === "finishList" && btnRoleObj["announcementCarModel.finish_modify"]))'>导入</el-button>
            <el-button type='primary' size='small' @click="exportCase">导出</el-button>
            <!-- <el-button type='primary' size='small' @click='viewHistory'>历史版本</el-button> -->
            <el-button type='primary' size='small' @click='importHistory'>导入记录</el-button>
            <el-upload v-show='false' ref='vehicleTypeCertificationUpload' :auto-upload='true'
              :http-request="uploadFile" action="" :before-upload='beforeUpload' :show-file-list='false'
              accept='.xls,.xlsx'>
            </el-upload>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
        style='border:1px solid #ddd;overflow: hidden;'>
        <el-row class='searchRow'>
          <el-col :span='24'>
            <!-- <span class='searchInputLabel'>&emsp;&emsp;&emsp;序号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
              v-model='searchContent.seq' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input> -->
            <span class='searchInputLabel'>检验项目:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
              v-model='searchContent.testProject' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>检验依据:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
              v-model='searchContent.testAccording' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <!-- <el-col :span='24'>
            <span class='searchInputLabel'>公告: NT-TT</span>
            <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="searchContent.dateRange1" value-format='yyyy-MM-dd' type="daterange"
              placeholder="选择日期">
            </el-date-picker>
            <span class='searchInputLabel'>CCC: NT-TT</span>
            <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="searchContent.dateRange2" value-format='yyyy-MM-dd' type="daterange"
              placeholder="选择日期">
            </el-date-picker>
            <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col> -->
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table  border ref='statisticsTable' @selection-change="handleSelectionChange" stripe :data='tableData'
          header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable'>
          <el-table-column type="selection" width="55" v-if='isEdit'></el-table-column>
          <el-table-column label='序号' prop='seq'></el-table-column>
          <el-table-column label='项目代号' prop='projectCode' width='120'></el-table-column>
          <el-table-column label='检验项目' prop='testProject' width='120'></el-table-column>
          <el-table-column label='检验依据' prop='testAccording' width='120'></el-table-column>
          <el-table-column label='申请检验类别' prop='applyType' width='120'></el-table-column>
          <el-table-column label='视同情况'>
            <el-table-column label='视同产品ID' prop='deemedProductId'  width='120'></el-table-column>
            <el-table-column label='视同产品型号' prop='deemedProductModel' width='120'></el-table-column>
            <el-table-column label='视同报告编号' prop='deemedReportCode' width='120'></el-table-column>
          </el-table-column>
          <el-table-column label='实测情况'>
            <el-table-column label='实测项目数' prop='measuredProjectNum' width='120'></el-table-column>
            <el-table-column label='实测报告编号' prop='measuredReportCode' width='120'></el-table-column>
            <el-table-column label='配置说明' prop='configDesc' width='120'></el-table-column>
          </el-table-column>
          <el-table-column label='检验结果' prop='testResult' min-width='200'></el-table-column>
          <el-table-column label='项目说明' prop='projectDesc' min-width='200' fixed='right'></el-table-column>
          <!-- <el-table-column label='操作' fixed='right' align='center' width='100' v-if='isEdit'>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")'>修改</el-button>
            </template>
          </el-table-column> -->
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
  import { getRoleBtnSetting,productioncarTempInit,modelCocRegulateDelete,pvACarRList, pvACarRDelte, pvACarRUpdateStatus,pvACarRInit,pvACarRImport,pvACarRDfvpExport} from '../service/service.js'
  export default {
    name: "vehicleTypeCertificationList",
    data() {
      return {
        btnRoleObj:{},
        timer:null,
        multipleSelection: [],
        isShowSearch: false,
        searchContent: {
          // seq: '',
          testProject: '',
          testAccording: '',
          // dateRange1: [],
          // dateRange2: []
        },
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        tableData: []
      };
    },
    components: { 
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    props:{
      tempId:{
        type:String,
        default:''
      },
      fromPage:{
        type:String,
        default:''
      },
      masterId:{
        type:String,
        default:''
      },
      isEdit:{
        type:Boolean,
        default:true
      }
    },
    computed: {
      ...mapState(['applicableModels', 'available', 'dischargeStageList']),
      contentTop() {
        return this.isShowSearch ? "150px" : "59px";
      }
    },
    created() {
      _self = this;
      this.callAction();//监听窗口的回调函数 
      if(this.isEdit){
        this.initRole();
      }
    },
    mounted() {
      if(this.fromPage==='finishList' && this.isEdit){
          //拷贝操作
          this.$refs.refLoading.open();
          let timer = setInterval(() => {
              if(_self.tempId){
                _self.requestData();
                clearInterval(timer);
              }
          }, 200);
          // productioncarTempInit(this.masterId).then(res=>{
          //    this.tempId = res.data;
          //    this.requestData();
          // })
      }else{
        this.requestData();
      }
    },
    methods: {
      initRole() {
        const btn_array = [
              'announcementCarModel.planning_modify',
              'announcementCarModel.finish_modify'
        ];
        getRoleBtnSetting(btn_array).then((res) => {
            this.btnRoleObj = res.data.authenticationMap
        })
      },
      importHistory(){
        let _width = '800';
        let _height = '500';
        let url = '/modelInProduction/index.html#/importHistory/'+this.masterId;
        let dialogTitle = '导入文件历史';
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
      },
      viewHistory(){
        let _width = '800';
        let _height = '500';
        let url = '/modelInProduction/index.html#/historyList'
        let dialogTitle = '历史版本';
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
      },
      initCase(){
        let doit = function () {
          _self.$refs.refLoading.open();
          pvACarRInit(_self.masterId).then(res=>{
              if(res.data){
                _self.restSearContent();
              }else{
                _self.$message.warning('初始化失败!');
                _self.$refs.refLoading.close();
              }
              
          }).catch(err=>{
            _self.$refs.refLoading.close();
          })  
        }
        EcoMessageBox.confirm(`您确定要初始化操作`, '提示', { type: 'warning', lockScroll: false }, doit)
      },
      dispatchCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要发布的行再进行操作。', '提示');
        }
        if (this.multipleSelection.length > 1) {
          return EcoMessageBox.alert('此操作不能批量处理,请选择一条数据。', '提示');
        }
        var id = this.multipleSelection[0].id;
        this.$refs.refLoading.open();
        pvACarRUpdateStatus(id).then(res => {
            this.multipleSelection = [];
            this.$message.success('发布成功!');
            this.restSearContent();
        }).catch(err => {
            this.$refs.refLoading.close();
        })
      },
      beforeUpload(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const extension = testmsg === "xls";
        const extension2 = testmsg === "xlsx";
        if (!extension && !extension2) {
          this.$message({
            message: "导入文件只能是.xls,.xlsx格式!",
            type: "warning"
          });
        }
        return extension || extension2;
      },
      uploadFile(params) {
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('excel', fileObj);
        form.append('time', new Date().getTime());
        form.append('masterId',this.tempId||this.masterId);
        pvACarRImport(form,this.fromPage).then(res=>{ 
            this.$message.success('导入成功');
            this.restSearContent();
            this.$refs.refLoading.close();
        }).catch(err=>{
            this.$message.error('导入失败');
            this.$refs.refLoading.close();
        })
      },
      importCase() {
        let doit = function () {
          _self.$refs.vehicleTypeCertificationUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        }
        EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?', '提示', { type: 'warning', lockScroll: false }, doit)
      },
      exportCase() {
        this.$refs.refLoading.open();
        let params = {
          masterId:this.tempId||this.masterId,
          sort: ['modDate'],     // 排序字段列表
          order: ['desc'],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
          if (Array.isArray(this.searchContent[key])) {
            if (key == 'dateRange1') {
              params['announcementNt'] = this.searchContent[key][0];
              params['announcementTt'] = this.searchContent[key][1];
            }
            if (key == 'dateRange2') {
              params['cccNt'] = this.searchContent[key][0];
              params['cccTt'] = this.searchContent[key][1];
            }
          } else if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
        pvACarRDfvpExport(params,this.fromPage).then(res => {
          if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
            navigator.msSaveBlob(new Blob([res.data],'车型认证符合性管控统计表.xlsx'));
            this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
            let url = window.URL.createObjectURL(blob);  
            let a = document.createElement("a");
            a.href = url;
            a.download = '车型认证符合性管控统计表.xlsx';
            this.$refs.refLoading.close();
            a.click();
            window.URL.revokeObjectURL(url);
          }
        }).catch(err => {
          this.$refs.refLoading.close();
        })
      },
      callAction() {
        let callBackDialogFunc = function (obj) {
          if (obj && (obj.action === 'edit')) {
            //修改 刷新
            _self.$message.success('修改成功!');
            _self.requestData();
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'vehicleTypeCertificationList');
      },
      editCase(row, type) {
        let _width = '1000';
        let _height = '600';
        let url;
        let dialogTitle;
        if (type === "editCase") {
          url = '/modelInProduction/index.html#/editVehicleTypeCertification/' + row.id + '/editCase';
          dialogTitle = '编辑';
        } else if (type === 'viewCase') {
          url = '/modelInProduction/index.html#/editVehicleTypeCertification/' + row.id + '/viewCase';
          dialogTitle = '查看';
          _height = '450';
        } else {
          url = '/modelInProduction/index.html#/editVehicleTypeCertification/' + 0 + '/addCase';
          dialogTitle = '新增';
        }
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        let doit = function () {
          _self.$refs.refLoading.open();
          // _self.multipleSelection.forEach(item=>{
          //   pvACarRDelte(item.id).then(res => {
          //     if(_self.timer){
          //         clearTimeout(_self.timer);
          //         _self.timer = null;
          //     }
          //     _self.timer = setTimeout(function(){
          //       _self.multipleSelection = [];
          //       _self.$message.success('删除成功!');
          //       _self.restSearContent();
          //     },500)
          //   }).catch(err => {
          //     _self.$refs.refLoading.close();
          //   })
          // })
          let ids = _self.multipleSelection.map(item=>{
              return item.id;
          })
          modelCocRegulateDelete(ids,_self.fromPage).then(res=>{
              _self.multipleSelection = [];
              _self.$message.success('删除成功!');
              _self.restSearContent();
          }).catch(err => {
              _self.$refs.refLoading.close();
            })
        }
        EcoMessageBox.confirm(`您确定要删除数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
      requestData(type) {
        this.$refs.refLoading.open();
        let params = {
          masterId: this.tempId || this.masterId,
          sort: ['modDate'],
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          this.baseInfo.page = 1;
          for (var key in this.searchContent) {
            if (Array.isArray(this.searchContent[key])) {
              if (key == 'dateRange1') {
                params['announcementNt'] = this.searchContent[key][0];
                params['announcementTt'] = this.searchContent[key][1];
              }
              if (key == 'dateRange2') {
                params['cccNt'] = this.searchContent[key][0];
                params['cccTt'] = this.searchContent[key][1];
              }
            } else if (this.searchContent[key]) {
              params[key] = this.searchContent[key];
            }
          }
        }
        params.page = this.baseInfo.page;
        pvACarRList(params,this.fromPage,this.isEdit).then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        })

      },
      restSearContent() {
        this.searchContent = {
          // seq: '',
          testProject: '',
          testAccording: '',
          // dateRange1: [],
          // dateRange2: []
        };
        this.requestData('search');
      },
      handleSizeChange(val) {
        this.baseInfo.rows = val;
        this.requestData("search");
      },
      handleCurrentChange(val) {
        this.baseInfo.page = val;
        this.requestData();
      }
    },
    watch: {}
  };
</script>
<style scoped>
  .vehicleTypeCertificationList {
    position: relative;
    height: 96%;
    overflow-y: auto;
    color: #0f1419;
  }

  .vehicleTypeCertificationList .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .vehicleTypeCertificationList .searchRow {
    padding: 15px 10px 16px 10px;
    background: #fff
  }

  .vehicleTypeCertificationList .el-col+.el-col {
    margin-top: 7px;
  }

  .vehicleTypeCertificationList .cursorP {
    cursor: pointer;
  }
  .vehicleTypeCertificationList .el-table.statisticsTable /deep/ .el-table__empty-text{
    text-align:left;
  }
</style>