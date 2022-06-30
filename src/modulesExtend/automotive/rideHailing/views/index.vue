<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background: #f5f5f5'>
        <div class="rideHailingIndex">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding:16px;background: #fff;border:1px solid #ddd;'>
                    <el-col :span='5'>
                        <strong>网约车{{ecoTitle[pageType]}}</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["ride_hailing.management_CREATE_RIDE"]' @click='editCase({},"addCase")'>新增</el-button>
                        <el-button type='danger' size='small' v-show='((pageType=="organization" && btnRoleObj["ride_hailing.management_DELETE_RIDE"]) || (pageType=="finish" && btnRoleObj["ride_hailing.finish_DELETE_RIDE"]))' @click='deleteCase'>删除</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["ride_hailing.management_SUBMIT_RIDE"]' @click='openApprope'>提交</el-button>
                        <el-button type='primary' size='small' v-show='pageType=="organization" && btnRoleObj["ride_hailing.management_IMPORT_RIDE"]' @click='importCase'>导入</el-button>
                        <el-upload v-show='false' ref='rideHailingUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                            :show-file-list='false'  accept='.xls,.xlsx'>
                        </el-upload>
                        <el-button type='primary' size='small' v-show='((pageType=="organization" && btnRoleObj["ride_hailing.management_EXPORT_RIDE"]) || (pageType=="finish" && btnRoleObj["ride_hailing.finish_EXPORT_RIDE"]))' @click='exportCase'>导出</el-button>
                        <el-button type='primary' size='small' v-show='pageType==="approve" && btnRoleObj["ride_hailing.approve_AGREE_RIDE"]'  @click='appropeCase'>同意</el-button>
                        <el-button type='primary' size='small' v-show='pageType==="approve" && btnRoleObj["ride_hailing.approve_REJECT_RIDE"]'  @click='withdrawCase'>退回</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='180px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel Tright' style='display: none'>状态:</span>
                        <el-select v-model='searchContent.status' style='width:140px;display: none' multiple>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusMenu' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel Tright'>操作类型:</span>
                        <el-select filterable v-model='searchContent.operate' style='width:140px;'>
                            <el-option :value='key' :label='item' v-for='(item,key) in operateMenu' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel Tright'>城市:</span>
                        <el-input v-model='searchContent.city' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>牌照:</span>
                        <el-input v-model='searchContent.license' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>轴距:</span>
                        <el-input v-model='searchContent.wheelBase' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>车价:</span>
                        <el-input v-model='searchContent.price' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel Tright'>车身尺寸:</span>
                        <el-input v-model='searchContent.bodySize' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>发动机/电机功率:</span>
                        <el-input v-model='searchContent.motorPower' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>发动机/电机扭矩:</span>
                        <el-input v-model='searchContent.motorTorque' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>综合工况油耗:</span>
                        <el-input v-model='searchContent.fuelConsumption' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>纯电动续驶里程:</span>
                        <el-input v-model='searchContent.drivingRange' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel Tright'>车龄:</span>
                        <el-input v-model='searchContent.carAge' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>排量:</span>
                        <el-input v-model='searchContent.displacement' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel Tright'>安全气囊:</span>
                        <el-input v-model='searchContent.airbag' clearable style='width:140px;' placeholder='请输入' @keyup.enter.native='requestData("search")'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:35px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table border ref='organizationListTable' @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'
                    tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type='selection' width='55'></el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='status' label='状态' v-if='pageType!=="approve"'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'status')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='operate' label='操作类型'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.operate,'operate')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='createUserName' label='发起人'></el-table-column>
                    <el-table-column v-if='pageType=="organization"' prop='createDate' label='发起时间'></el-table-column>
                    <el-table-column v-if='pageType=="approve"' prop='approveUserAssignTime' label='到达时间'></el-table-column>
                    <el-table-column  v-if='pageType=="finish"' prop='approveCompleteTime' label='完成时间'></el-table-column>
                    <el-table-column prop='city' label='城市'>
                        <template slot-scope='scope'>
                            <span class='cursorP' @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.city}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='license' label='牌照'></el-table-column>
                    <el-table-column prop='wheelBase' label='轴距'></el-table-column>
                    <el-table-column prop='price' label='车价'></el-table-column>
                    <el-table-column prop='displacement' label='排量'></el-table-column>
                    <el-table-column prop='carAge' label='车龄'></el-table-column>
                    <el-table-column prop='bodySize' label='车身尺寸'></el-table-column>
                    <el-table-column prop='motorPower' label='发动机/电机功率' width='130'></el-table-column>
                    <el-table-column prop='motorTorque' label='发动机/电机扭矩' width='130'></el-table-column>
                    <el-table-column prop='fuelConsumption' label='综合工况油耗' width='130'></el-table-column>
                    <el-table-column prop='drivingRange' label='纯电动续驶里程' width='130'></el-table-column>
                    <el-table-column prop='airbag' label='安全气囊'></el-table-column>
                    <el-table-column prop='satellitePosition' label='卫星定位'></el-table-column>
                    <el-table-column prop='alarmDevice' label='应急报警装置' width='130'></el-table-column>
                    <el-table-column prop='frontFogLights' label='前雾灯'></el-table-column>
                    <el-table-column prop='ebd' label='电子制动力分配系统' width='130'></el-table-column>
                    <el-table-column prop='esp' label='车身电子稳定系统' width='130'></el-table-column>
                    <el-table-column prop='tcs' label='牵引力控制系统' width='130'></el-table-column>
                    <el-table-column prop='ba' label='刹车辅助系统(BA)' width='130'></el-table-column>
                    <el-table-column prop='terminalEquipment' label='车载终端设备' width='130'></el-table-column>
                    <el-table-column prop='compartmentVolume' label='行李厢容积(L)' width='130'></el-table-column>
                    <el-table-column prop='other' label='其他'></el-table-column>
                    <el-table-column label='操作' fixed='right' align='center' width='120' v-if='((pageType==="organization" && btnRoleObj["ride_hailing.management_UPDATE_RIDE"]) || (pageType==="finish" && btnRoleObj["ride_hailing.finish_UPDATE_RIDE"]))'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row,"editCase")'>修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]"
                            :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
                            style="margin-right:20px">
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
import { EcoUtil } from "@/components/util/main.js";
import { EcoMessageBox } from "@/components/messageBox/main.js";
import {ridehailingList,ridehailingSubmit,ridehailingDel,ridehailingApprove,ridehailingApplyDel,ridehailingExport,ridehailingImport,getRoleBtnSetting,ridehailingWithdraw} from "../service/service.js";
import { mapState } from "vuex";
export default {
  name: "rideHailingIndex",
  data() {
    return {
      timer:null,
      ecoTitle: { organization: "编制", approve: "审批", finish: "完成" },
      isShowSearch: true,
      searchContent: {
        fuelConsumption: "",
        status: [],
        operate: "",
        city: "",
        license: "",
        wheelBase: "",
        price: "",
        displacement: "",
        carAge: "",
        bodySize: "",
        motorPower: "",
        motorTorque: "",
        drivingRange: "",
        airbag: ""
      },
      tableData: [],
      multipleSelection: [],
      baseInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      btnRoleObj:{}
    };
  },
  components: {
    ecoContent,
    ecoLoading
  },
  computed: {
    ...mapState(["statusMenu", "operateMenu"]),
    pageType() {
      return this.$route.params.pageType;
    },
    contentTop() {
      return this.isShowSearch ? "239px" : "59px";
    }
  },
  created() {
    _self = this;
    this.initRole();
    this.initStatus();
    this.callAction();
  },
  mounted() {
    this.requestData("search");
  },
  methods: {
   initRole() {
      //网约车编制
      let btn_array1 = [
          'ride_hailing.management_VIEW_RIDE',
          'ride_hailing.management_CREATE_RIDE',
          'ride_hailing.management_UPDATE_RIDE',
          'ride_hailing.management_DELETE_RIDE',
          'ride_hailing.management_EXPORT_RIDE',
          'ride_hailing.management_IMPORT_RIDE',
          'ride_hailing.management_SUBMIT_RIDE',
          'ride_hailing.management_AUDIT_RIDE',
      ];
      //网约车查询
      let btn_array2=[
        'ride_hailing.finish_UPDATE_RIDE',
        'ride_hailing.finish_DELETE_RIDE',
        'ride_hailing.finish_EXPORT_RIDE'];
      //网约车审批
      let btn_array3=['ride_hailing.approve_AGREE_RIDE','ride_hailing.approve_REJECT_RIDE'];
      Promise.all([
        getRoleBtnSetting(btn_array1),
        getRoleBtnSetting(btn_array2),
        getRoleBtnSetting(btn_array3)
      ]).then((resArr) => {
          this.btnRoleObj = Object.assign(resArr[0].data.authenticationMap,resArr[1].data.authenticationMap,resArr[2].data.authenticationMap);
          console.log(this.btnRoleObj);
      })
    },
    uploadFile(params){
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('file',fileObj);
        form.append('time',new Date().getTime());
        ridehailingImport(form).then(res=>{
            this.$message.success('导入成功');
            this.restSearContent();
            this.$refs.refLoading.close();
        }).catch(err=>{
            this.$message.error('导入失败');
            this.$refs.refLoading.close();
        })
    },
    importCase(){
        // let doit = function(){

        // }
        // EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
        _self.$refs.rideHailingUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
    },
    exportCase(){
        this.$refs.refLoading.open();
        ridehailingExport({
            status:this.searchContent.status
        }).then(res=>{
          if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
            navigator.msSaveBlob(new Blob([res.data],`网约车${this.ecoTitle[this.pageType]}.xlsx`));
            this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
            let a = document.createElement("a");
            a.href = url;
            a.download = `网约车${this.ecoTitle[this.pageType]}.xlsx`;
            this.$refs.refLoading.close();
            a.click();
            // 释放这个临时的对象url
            window.URL.revokeObjectURL(url);
          }
        }).catch(err=>{
            this.$refs.refLoading.close();
        })
    },
    withdrawCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要退回的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "退回操作不能批量处理,请选中一条数据",
      //     "提示"
      //   );
      // }
      // var url ="/rideHailing/index.html#/withdrawPage/" + this.multipleSelection[0].id;
      var url ="/rideHailing/index.html#/withdrawPage";
      EcoUtil.getSysvm().openDialog("退回", url, 700, 200, "15vh");
    },
    openApprope(){
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要提交的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "提交操作不能批量处理,请选择一条数据。",
      //     "提示"
      //   );
      // }
      this.multipleSelection.forEach(item=>{
        if (item.status !== "REJECT" && item.status !== "SCHEDULE") {
          return EcoMessageBox.alert("状态为编制中、退回的项才可提交审核","提示");
        }
      })
      var url = '/rideHailing/index.html#/appropeUser';
      EcoUtil.getSysvm().openDialog('选择审批人', url, 700, 200, '15vh');
    },
    appropeCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要同意的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "同意操作不能批量处理,请选中一条数据",
      //     "提示"
      //   );
      // }
      // var id = this.multipleSelection[0].id;
      this.$refs.refLoading.open();
      this.multipleSelection.forEach(item=>{
        ridehailingApprove(item.id).then(res => {
           if(this.timer){
              clearTimeout(this.timer);
              this.timer = null;
           }
           this.timer = setTimeout(function(){
              _self.multipleSelection = [];
              _self.$message.success("同意成功!");
              _self.restSearContent();
           },450)
        })
        // .catch(err => {
        //   this.$refs.refLoading.close();
        // });
      })
    },
    deleteCase() {
      if (this.multipleSelection.length === 0) {
        return EcoMessageBox.alert(
          "当前未选中行,请勾选要删除的行再进行操作。",
          "提示"
        );
      }
      // if (this.multipleSelection.length > 1) {
      //   return EcoMessageBox.alert(
      //     "删除操作不能批量处理,请选择一条数据。",
      //     "提示"
      //   );
      // }
      let doit = function() {
        // var id = _self.multipleSelection[0].id;
        _self.$refs.refLoading.open();
        if (_self.pageType === "organization") {
          _self.multipleSelection.forEach(item=>{
            ridehailingDel(item.id).then(res => {
              if(_self.timer){
                clearTimeout(_self.timer);
                _self.timer = null;
              }
              _self.timer = setTimeout(function(){
                  _self.multipleSelection = [];
                  _self.$message.success("删除成功!");
                  _self.restSearContent();
              },450)
            })
            // .catch(err => {
            //   _self.$refs.refLoading.close();
            // });
          })
        }else{
            //申请删除
            _self.multipleSelection.forEach(item=>{
              ridehailingApplyDel(id).then(res => {
                  if(_self.timer){
                    clearTimeout(_self.timer);
                    _self.timer = null;
                  }
                  _self.timer = setTimeout(function(){
                    _self.multipleSelection = [];
                    _self.$message.success("申请删除成功!");
                    _self.restSearContent();
                  },450)
              });
            })
        }
      };
      let ecoBoxTitle =
        this.pageType === "organization"? "你确定要删除数据吗?": "删除申请会在'网约车编制'界面的列表中生成一条记录";
        EcoMessageBox.confirm(
            ecoBoxTitle,
            "提示",
            { type: "warning", lockScroll: false },
            doit
        );
    },
    initStatus() {
      if (this.pageType === "organization") {
        this.searchContent.status = ["SCHEDULE", "REJECT"];
      } else if (this.pageType === "approve") {
        this.searchContent.status = ["AUDITING"];
      } else if (this.pageType === "finish") {
        this.searchContent.status = ["PUBLISHED"];
      }
    },
    submitCase(assigneeId) {
      this.$refs.refLoading.open();
      // var id = this.multipleSelection[0].id;
      this.multipleSelection.forEach(item=>{
        ridehailingSubmit(item.id,assigneeId).then(res => {
          if(this.timer){
            clearTimeout(this.timer);
            this.timer=null;
          }
          this.timer = setTimeout(function(){
            _self.multipleSelection = [];
            _self.$message.success("提交成功!");
            _self.restSearContent();
          },450)
        })
        // .catch(err => {
        //   this.$refs.refLoading.close();
        // });
      })
    },
    doRidehailingWithdraw(content){
        this.multipleSelection.forEach(item=>{
            ridehailingWithdraw({
              id: item.id,
              content: content
            }).then(res => {
               if(this.timer){
                  clearTimeout(this.timer);
                  this.timer = null;
               }
               this.timer = setTimeout(function(){
                  _self.multipleSelection = [];
                  _self.$message.success("退回成功!");
                  _self.requestData("search");
               },450)
            })
        })
    },
    callAction() {
      let callBackDialogFunc = function(obj) {
        //修改
        if (obj && obj.action === "add") {
          _self.multipleSelection = [];
          _self.$message.success("新增成功!");
          _self.restSearContent();
        } else if (obj && obj.action === "edit") {
          _self.multipleSelection = [];
          _self.$message.success("修改成功!");
          _self.requestData();
        } else if (obj && obj.action == "withdraw") {
          _self.doRidehailingWithdraw(obj.data.content);
        }else if(obj && obj.action == 'applyEdit') {
          _self.multipleSelection = [];
          _self.$message.success("申请修改成功!");
          _self.requestData();
        }else if(obj && (obj.action === 'appropeUser')){
          _self.submitCase(obj.data.assigneeId);
        }
      };
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc, "rideHailing");
    },
    requestData(type) {
      this.$refs.refLoading.open();
      let params = {
        sort: ["modDate"],
        order: ["desc"],
        rows: this.baseInfo.rows,
        status: this.searchContent.status //区分页必传字段 (编制、审批、完成)
      };
      if (type === "search") {
        this.baseInfo.page = 1;
        for (var key in this.searchContent) {
          if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
      }
      params.page = this.baseInfo.page;
      ridehailingList(params)
        .then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        })
        .catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        });
    },
    editCase(row, type) {
      let _width = "1100";
      let _height = "600";
      let url;
      let dialogTitle;
      if (type === "editCase") {
        url ="/rideHailing/index.html#/editPage/" +row.id +"/editCase/" + this.pageType + "List";
        dialogTitle = "编辑";
      } else if (type === "viewCase") {
        url ="/rideHailing/index.html#/editPage/" + row.id +"/viewCase/" +this.pageType +"List";
        dialogTitle = "查看";
        _height = "500";
      } else {
        url =
          "/rideHailing/index.html#/editPage/" +0 +"/addCase/" +this.pageType +"List";
        dialogTitle = "新增";
      }
      EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, "15vh");
    },
    handleSizeChange(val) {
      this.baseInfo.rows = val;
      this.requestData("search");
    },
    handleCurrentChange(val) {
      this.baseInfo.page = val;
      this.requestData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeSearchShow() {
      this.isShowSearch = !this.isShowSearch;
    },
    restSearContent() {
      this.searchContent = {
        fuelConsumption: "",
        operate: "",
        city: "",
        license: "",
        wheelBase: "",
        price: "",
        displacement: "",
        carAge: "",
        bodySize: "",
        motorPower: "",
        motorTorque: "",
        drivingRange: "",
        airbag: ""
      };
      this.initStatus();
      this.requestData("search");
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
  }
};
</script>
<style scoped>
.rideHailingIndex {
  color: #0f1419;
  min-width: 1000px;
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: auto;
  color: #0f1419;
}

.rideHailingIndex .searchInputLabel {
  font-size: 14px;
  margin: 0px 5px 0px 8px;
  width: 75px;
  display: inline-block;
}

.rideHailingIndex .searchInputLabel.Tright {
  text-align: right;
}

.rideHailingIndex .searchRow {
  padding: 16px 10px 16px 10px;
  background: #fff;
}

.rideHailingIndex .searchRow .el-col {
  display: flex;
  align-items: center;
}

.rideHailingIndex .searchRow .el-col + .el-col {
  margin-top: 10px;
}

.rideHailingIndex .cursorP {
  color:#409eff;
  cursor: pointer;
}
.rideHailingIndex .standardizationTable.el-table /deep/ .el-table__empty-text {
  text-align: left;
}

/* .rideHailingIndex .searchRow .el-col .searchInputLabel+.searchInputLabel{
        margin-right: 5px;
    } */
</style>
