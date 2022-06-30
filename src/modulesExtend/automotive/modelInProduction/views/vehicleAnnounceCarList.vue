<template>
  <eco-content top='0px' bottom='0px' type='tool'  :style='{"background-color":(!isOpenDialog?"!isOpenDialog":"")}'>
    <div class='vehicleAnnounceCarList' :class="{isOpenDialog:!isOpenDialog}">
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
        <el-row  class='headerRow'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>公告车型管理{{titleList[pageType]}}</strong>
          </el-col>
          <el-col :span='19' style='text-align:right'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show='!isOpenDialog && btnRoleObj["announcementCarModel.planning_create"] && pageType==="organizationList"'>新增
            </el-button>
            <el-button type='danger' size='small' @click='deleteCase' v-show='!isOpenDialog && btnRoleObj["announcementCarModel.planning_delete"] && pageType==="organizationList"'>删除</el-button>
            <el-button type='primary' size='small'  v-show='!isOpenDialog  && pageType==="organizationList" && btnRoleObj["announcementCarModel.planning_submit"]'  @click='openApprope'>提交</el-button>
            <el-button type='primary' size='small' @click='importCase' v-show='!isOpenDialog && btnRoleObj["announcementCarModel.planning_upload"] && pageType==="organizationList"'>导入</el-button>
            <el-button type='primary' size='small' @click="exportCase" v-show='!isOpenDialog  && btnRoleObj["announcementCarModel.planning_download"] && pageType==="organizationList"'>导出</el-button>
            <el-upload v-show='false' ref='vehicleAnnounceCarUpload' :auto-upload='true' :http-request="uploadFile"
              action="" :before-upload='beforeUpload' :show-file-list='false' accept='.xls,.xlsx'>
            </el-upload>
            <el-button type='primary' size='small' v-show='!isOpenDialog  &&  pageType==="approveList" && btnRoleObj["announcementCarModel.approving_agree"]'  @click='appropeCase'>同意</el-button>
            <el-button type='primary' size='small' v-show='!isOpenDialog  &&  pageType==="approveList" && btnRoleObj["announcementCarModel.approving_reject"]'  @click='withdrawCase'>驳回</el-button>
            <el-button type='danger' size='small' v-show='!isOpenDialog  &&  pageType==="finishList" && btnRoleObj["announcementCarModel.finish_delete"]'   @click='ApplyDeleteCase'>删除</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='130px' type='tool'
        style='border:1px solid #ddd;overflow: hidden;'>
        <el-row class='searchRow'>
          <el-col :span='24'>
            <span class='searchInputLabel'>申请单编号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.applicationCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;车型型号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.carModelCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>备注(商品名称):</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.remarks' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;&ensp;单位:</span>
            <el-input clearable style='width:155px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.unit' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24'>
            <span class='searchInputLabel'>&emsp;排放阶段:</span>
            <el-select filterable style='width:150px' v-model='searchContent.dischargeStage'>
              <el-option v-for='(item) in dischargeStageList' :value='item.id' :label='item.text' :key='item.id'>
              </el-option>
            </el-select>
            <span class="searchInputLabel">&emsp;&emsp;&emsp;依据:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.according' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;&ensp;适用车型:</span>
            <el-select filterable v-model='searchContent.carModelType' style='width:150px;' clearable multiple collapse-tags>
              <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels' :key='item.id'>
              </el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;动力类型:</span>
            <el-select filterable style='width:150px' v-model="searchContent.carModelValue" placeholder="请选择" clearable multiple
              collapse-tags>
              <el-option v-for="(item) in powerType" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='24'>
            <span class='searchInputLabel'>&emsp;项目代号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.projectCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>认证负责人:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.certResponsible' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;&ensp;是否有效:</span>
            <el-select filterable style='width:150px' v-model="searchContent.available" placeholder='请选择'>
              <el-option v-for="(item) in available" :key="item.id" :label="item.text" :value="item.id">
              </el-option>
            </el-select>
            <span class='searchInputLabel' v-if='pageType==="approveList"'>&emsp;办理状态:</span>
            <el-select v-if='pageType==="approveList"' filterable v-model='searchContent.approveStatus' style='width:120px;' clearable>
                <el-option value='PENDING' label='待办'></el-option>
                <el-option value='DONE' label='已办'></el-option>
            </el-select>
            <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='78px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table border ref='statisticsTable' @selection-change="handleSelectionChange" stripe :data='tableData'
          header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable' row-key='id'>
          <el-table-column type="selection" width="55" reserve-selection></el-table-column>
          <el-table-column type='index' label='序号' align='center'>
            <template slot-scope='scope'>
              {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
          </el-table-column>
          <el-table-column label='申请单编号' prop='applicationCode' width='180'>
              <template slot-scope='scope'>
                 <span class='cursorP' @click.stop='editCase(scope.row,"viewCase")' v-if='!isOpenDialog'>{{scope.row.applicationCode}}</span>
                 <span v-else>{{scope.row.applicationCode}}</span>
              </template>  
          </el-table-column>
          <el-table-column label='车型型号' prop='carModelCode'></el-table-column>
          <el-table-column label='排量(ml)' prop='displacement'></el-table-column>
          <el-table-column label='发动机/动力电池型号' prop='engineModel' width='180'></el-table-column>
          <el-table-column label='外形尺寸' prop='shapeSize'></el-table-column>
          <el-table-column label='轴距(mm)' prop='wheelbase'></el-table-column>
          <el-table-column label='VIN' prop='vin'></el-table-column>
          <el-table-column label='备注(商品名称)' prop='remarks' width='180'></el-table-column>
          <el-table-column label='单位' prop='unit'></el-table-column>
          <el-table-column label='项目代号' prop='projectCode'></el-table-column>
          <el-table-column label='排放阶段' prop='dischargeStage'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.dischargeStage,'dischargeStage')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='车型名称' prop='modelName'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.modelName,'modelName')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='适用车型' prop='modelList' width='180'>
            <template slot-scope='scope'>
              <span>{{restData(scope.row.modelList,'modelList')}}</span>
            </template>
          </el-table-column>
          <el-table-column label='驳回原因' prop='rejectCause' width='200' show-overflow-tooltip v-if='pageType==="organizationList"'></el-table-column>
          <el-table-column label='操作' fixed='right' align='center' width='100' v-if='!isOpenDialog && (pageType==="organizationList" && btnRoleObj["announcementCarModel.planning_modify"]) || (pageType==="finishList" && btnRoleObj["announcementCarModel.finish_modify"]) '>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")'>修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </eco-content>
      <eco-content bottom="36px" type="tool" style="padding:5px 0px">
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
              layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
            </el-pagination>
          </el-col>
        </el-row>
      </eco-content>
      <div class='btn' v-if='isOpenDialog'>
        <el-button size="medium" @click="onCancel">取消</el-button>
        <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
      </div>
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
  import { 
    announcementModelApplyDelete,
    announcementModelApproveDisagree,
    announcementModelApproveAgree,
    announcementModelSubmit,
    getRoleBtnSetting,
    vehicleAnnounceCarList, 
    vehicleAnnounceCarDel, 
    vehicleAnnounceCarDfvaImport, 
    vehicleAnnounceCarDfvaExport 
  } from '../service/service.js'
  export default {
    name: "vehicleAnnounceCarList",
    data() {
      return {
        titleList:{"organizationList":'编制',"approveList":'审批',"finishList":'完成'},
        timer:null,
        btnRoleObj:{},
        multipleSelection: [],
        isShowSearch: true,
        searchContent: {
          applicationCode: '',
          carModelCode: '',
          remarks: '',
          unit: '',
          projectCode: '',
          certResponsible: '',
          dischargeStage: '',
          according: '',
          carModelType: [],
          carModelValue: [],
          available: '',
          approveStatus:''
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
    computed: {
      ...mapState(['applicableModels', 'powerType', 'available', 'dischargeStageList']),
      contentTop() {
        return this.isShowSearch ? "190px" : "59px";
      },
      isOpenDialog() {
        return this.$route.params.isOpenDialog=='true';
      },
      pageType(){
        return this.$route.params.pageType;
      }
    },
    created() {
      _self = this;
      if(!this.isOpenDialog){
        this.initRole();
      };
      this.callAction();//监听窗口的回调函数 
    },
    mounted() {
      if(this.pageType === 'approveList'){
        this.searchContent.approveStatus='PENDING'
      }
      this.requestData('',false,false);
    },
    methods: {
      ApplyDeleteCase() {
        if (this.multipleSelection.length === 0) {
            return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        if(this.multipleSelection.length>1){
            return EcoMessageBox.alert('删除操作不能批量处理,请选择一条数据。', '提示');
        }
        let doit = function () {
            var id = _self.multipleSelection[0].id;
            _self.$refs.refLoading.open();
            announcementModelApplyDelete(id).then(res => {
                _self.multipleSelection=[];
                _self.$message.success('申请删除成功!');
                _self.restSearContent();
            }).catch(err => {
                _self.$refs.refLoading.close();
            })
        }
        EcoMessageBox.confirm('申请删除会在"公告车型编制"界面的列表中生成一条记录！', '提示', { type: 'warning', lockScroll: false }, doit)
      },
      doWithdraw(content){
        this.$refs.refLoading.open();
        this.multipleSelection.forEach(item=>{
          announcementModelApproveDisagree({
            id: item.id,
            content:content
          }).then(res => {
            if(this.timer){
                clearTimeout(this.timer);
                this.timer=null;
            }
            this.timer = setTimeout(function(){
                _self.$message.success('驳回成功!');
                _self.multipleSelection = [];
                _self.requestData('search',true,true);
            },450)
          }) 
        })
      },
      withdrawCase() {
        if (this.multipleSelection.length === 0) {
            return EcoMessageBox.alert('当前未选中行,请勾选要驳回的行再进行操作。', '提示');
        }      
        var url = '/modelInProduction/index.html#/withdrawPage/' + false;
        EcoUtil.getSysvm().openDialog('驳回', url, 700, 200, '15vh');
      },
      doAppropeCase(content){
        this.$refs.refLoading.open();
        this.multipleSelection.forEach(item=>{
          announcementModelApproveAgree(item.id,content).then(res => {
                  if(this.timer){
                      clearTimeout(this.timer);
                      this.timer=null;
                  }
                  this.timer = setTimeout(function(){
                      _self.multipleSelection = [];
                      _self.$message.success('同意成功!');
                      _self.restSearContent();
                  },400);
              }).catch(err => {
                  this.$refs.refLoading.close();
              })
          })
      },
      appropeCase() {
         if (this.multipleSelection.length === 0) {
            return EcoMessageBox.alert('当前未选中行,请勾选要同意的行再进行操作。', '提示');
         }
         var url = '/modelInProduction/index.html#/withdrawPage/' + true;
         EcoUtil.getSysvm().openDialog('同意', url, 700, 200, '15vh');
      },
      submitCase(assigneeId){
        this.$refs.refLoading.open();
        this.multipleSelection.forEach(item=>{
          announcementModelSubmit(item.id,assigneeId).then(res => {
            if(this.timer){
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(function(){
              _self.multipleSelection = [];
              _self.$message.success('提交成功!');
              _self.restSearContent();
            },450);
          }).catch(err => {
            this.$refs.refLoading.close();
          })
        })
      },
      openApprope(){
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要提交的行再进行操作。', '提示');
        }
        let bool = this.multipleSelection.every(item=>{
          return item.status == 'APPROVE_REJECT' || item.status == 'PLANNING'
        })
        if(!bool){
          return EcoMessageBox.alert('状态为编制中、退回的项才可提交审核', '提示');
        }
        var url;
        if(this.multipleSelection.length===1 && this.multipleSelection[0].status==='APPROVE_REJECT'){
          //单选并且退回项
          url = '/modelInProduction/index.html#/appropeUser?assigneeId='+this.multipleSelection[0].approvingAssignee;
        }else{
          url = '/modelInProduction/index.html#/appropeUser'
        }
        EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
      },
      initRole() {
        const btn_array = [
              'announcementCarModel.planning_create',
              'announcementCarModel.planning_delete',
              'announcementCarModel.planning_submit',
              'announcementCarModel.planning_upload',
              'announcementCarModel.planning_download',
              'announcementCarModel.planning_modify'
        ];
        const btn_array2 = [
              'announcementCarModel.approving_agree',
              'announcementCarModel.approving_reject'
        ];
        const btn_array3 = [
             'announcementCarModel.finish_delete',
             'announcementCarModel.finish_modify'
        ];
        Promise.all([
            getRoleBtnSetting(btn_array),
            getRoleBtnSetting(btn_array2),
            getRoleBtnSetting(btn_array3)
        ]).then((resArr) => {
            this.btnRoleObj = Object.assign(resArr[0].data.authenticationMap,resArr[1].data.authenticationMap,resArr[2].data.authenticationMap);
        })
     },
      onCancel() {
        EcoUtil.getSysvm().closeDialog();
      },
      onSubmit() {
        if (this.multipleSelection.length === 0 || this.multipleSelection.length > 1) {
          this.$message.warning('请选择一条车型号数据!');
          return;
        }
        let doObj = {};
        doObj.action = 'selectVehicleAnnounce';
        doObj.dataArr = this.multipleSelection[0];
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
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
        form.append('excel', fileObj);//file
        form.append('time', new Date().getTime());
        vehicleAnnounceCarDfvaImport(form).then(res => {
          this.$message.success('导入成功');
          this.restSearContent();
          this.$refs.refLoading.close();
        }).catch(err => {
          this.$message.error('导入失败');
          this.$refs.refLoading.close();
        })
      },
      importCase() {
        let doit = function () {
          _self.$refs.vehicleAnnounceCarUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        }
        EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?', '提示', { type: 'warning', lockScroll: false }, doit)
      },
      exportCase() {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],     // 排序字段列表
          order: ['desc'],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
          if (Array.isArray(this.searchContent[key])) {
            if (this.searchContent[key].length !== 0) {
              params[key] = this.searchContent[key];
            }
          } else if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
        vehicleAnnounceCarDfvaExport(params).then(res => {
          if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
            navigator.msSaveBlob(new Blob([res.data],'公告车型编制统计表.xlsx'));
            this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = '公告车型编制统计表.xlsx';
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
            _self.requestData('search',false,true);
          } else if (obj.action === 'add') {
            //新建 刷新
            _self.$message.success('新建成功!');
            _self.restSearContent();
          }else if(obj.action === 'appropeUser'){
              //选择审批人提交
              _self.submitCase(obj.data.assigneeId);
          }else if(obj && (obj.action === 'submitCase')){
            //新增或编辑界面提交
            _self.$message.success('提交成功!');
            _self.restSearContent();
          }else if(obj && (obj.action === 'apprope')){
            //批量同意
            _self.doAppropeCase(obj.data.content);
          }else if (obj && (obj.action === 'withdraw')) {
            //批量驳回
            _self.doWithdraw(obj.data.content);
          }else if(obj && (obj.action === 'applyEdit')){
            //申请修改
            _self.$message.success('申请修改成功!');
            _self.requestData('search',true,true);
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'vehicleAnnounceCarList');
      },
      editCase(row, type) {
        let _width = '1100';
        let _height = '650';
        let url;
        let dialogTitle;
        if (type === "editCase") {
          url = '/modelInProduction/index.html#/editVehicleAnnounceCar/' + row.id + '/editCase';
          dialogTitle = '编辑';
        } else if (type === 'viewCase') {
          url = '/modelInProduction/index.html#/editVehicleAnnounceCar/' + row.id + '/viewCase';
          dialogTitle = '查看';
        } else {
          url = '/modelInProduction/index.html#/editVehicleAnnounceCar/' + 0 + '/addCase';
          dialogTitle = '新增';
        }
        url += '/'+this.pageType;
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        // if (this.multipleSelection.length > 1) {
        //   return EcoMessageBox.alert('删除操作不能批量处理,请选中一条', '提示');
        // }
        let doit = function () {
          // var id = _self.multipleSelection[0].id;
          _self.$refs.refLoading.open();
          _self.multipleSelection.forEach(item=>{
            vehicleAnnounceCarDel(item.id).then(res => {
              if(_self.timer){
                  clearTimeout(_self.timer);
                  _self.timer = null;
              }
              _self.timer = setTimeout(function(){
                _self.multipleSelection = [];
                _self.$message.success('删除成功!');
                _self.restSearContent();
              },500)
            }).catch(err => {
              _self.$refs.refLoading.close();
            })
          })
        }
        EcoMessageBox.confirm(`您确定要删除此条数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
      requestData(type,isFirstP,isClearS) {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          for (var key in this.searchContent) {
            if (Array.isArray(this.searchContent[key])) {
              if (this.searchContent[key].length !== 0) {
                params[key] = this.searchContent[key];
              }
            } else if (this.searchContent[key]) {
              params[key] = this.searchContent[key];
            }
          }
        }
        if(isFirstP){
          this.baseInfo.page = 1;
        }
        if(isClearS){
          this.$refs.statisticsTable.clearSelection();
        }
        params.page = this.baseInfo.page;
        vehicleAnnounceCarList(params,this.pageType).then(res => {
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
          applicationCode: '',
          carModelCode: '',
          remarks: '',
          unit: '',
          projectCode: '',
          certResponsible: '',
          dischargeStage: '',
          according: '',
          carModelType: [],
          carModelValue: [],
          available: '',
          approveStatus:''
        };
        if(this.pageType === 'approveList'){
          this.searchContent.approveStatus='PENDING'
        }
        this.requestData('search',true,true);
      },
      handleSizeChange(val) {
        this.baseInfo.rows = val;
        this.requestData("search",true,false);
      },
      handleCurrentChange(val) {
        this.baseInfo.page = val;
        this.requestData("search",false,false);
      }
    },
    watch: {}
  };
</script>
<style scoped>
  .vehicleAnnounceCarList {
    position: relative;
    height: 100%;
    overflow-y: auto;
    color: #0f1419;
  }

  .vehicleAnnounceCarList.isOpenDialog {
    /* min-width: 1450px; */
    min-width: 1000px;
    margin: 0 24px;
    top: 2%;
    height: 96%;
  }

  .vehicleAnnounceCarList .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .vehicleAnnounceCarList .searchRow {
    padding: 15px 10px 16px 10px;
    background: #fff
  }

  .vehicleAnnounceCarList .el-col+.el-col {
    margin-top: 7px;
  }

  .vehicleAnnounceCarList .cursorP {
    cursor: pointer;
    color:#409eff;
  }

  .vehicleAnnounceCarList .btn {
    position: absolute;
    bottom: 0px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }
  .vehicleAnnounceCarList .headerRow{
    padding: 14px;background:#fff;
    border: 1px solid #ddd;
  }
  .vehicleAnnounceCarList .headerRow .el-button{
    margin-left:10px;
  }
</style>