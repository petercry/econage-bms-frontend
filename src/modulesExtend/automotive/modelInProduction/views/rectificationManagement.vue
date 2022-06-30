<template>
  <eco-content top='0px' bottom='0px':style='{"background-color":(!isOpenDialog?"#F5F5F5":"")}'>
    <div class='rectificationManagement' :class="{isOpenDialog:!isOpenDialog}">
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height:30px;line-height: 30px;'>
            <strong>整改应对管理</strong>
          </el-col> 
          <el-col :span='19' style='text-align: right;'>
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show="(!isOpenDialog) && btnRoleObj['productioncar.rectifyingSolution_create']">新增</el-button>
            <el-button type='danger' size='small' @click='deleteCase' v-show="!isOpenDialog && btnRoleObj['productioncar.rectifyingSolution_delete']">删除</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='130px' type='tool'
        style='border:1px solid #ddd;overflow: hidden;'>
        <el-row class='searchRow'>
          <el-col :span='24'>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;编号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.applicationCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class="searchInputLabel">&emsp;&ensp;&emsp;公告应对状态:</span>
            <el-select filterable v-model='searchContent.annoucementCopeStatus' style='width:150px;' clearable>
                <el-option v-for='(item,key) in copeStatus' :value='key' :label='item' :key='key'></el-option>
            </el-select>
            <span class="searchInputLabel">&emsp;&ensp;&emsp;CCC应对状态:</span>
            <el-select filterable v-model='searchContent.cccCopeStatus' style='width:150px;' clearable>
                <el-option v-for='(item,key) in copeStatus' :value='key' :label='item' :key='key'></el-option>
            </el-select>
          </el-col>
          <el-col :span='24'>
            <span class='searchInputLabel'>主要涉及标准:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.mainlyStandard' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>认证政策/法规编号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.certPolicyCode' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>认证政策/法规名称:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)"
              v-model='searchContent.certPolicyName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col>
            <span class='searchInputLabel'>&emsp;&emsp;发布日期:</span>
            <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="searchContent.dateRange1" value-format='yyyy-MM-dd' type="daterange"
              placeholder="选择日期">
            </el-date-picker>
            <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
            <el-button @click='restSearContent'>重置</el-button>
          </el-col>
        </el-row>

      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-table border ref='rectificationManagementTab' @selection-change="handleSelectionChange" stripe :data='tableData'
          header-row-class-name='tableHeader' tooltip-effect='dark' height='100%' class='statisticsTable' row-key='id'>
          <el-table-column type="selection" width="55" reserve-selection></el-table-column>
          <el-table-column type='index' label='序号' align='center'>
            <template slot-scope='scope'>
             {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
            </template>
         </el-table-column>
         <el-table-column label='编号' prop='applicationCode'></el-table-column>
         <el-table-column label='认证政策/法规编号' prop='certPolicyCode'>
           <template slot-scope='scope'>
              <span class='cursorP linkBlue' v-if='!isOpenDialog' @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.certPolicyCode}}</span>
              <span v-else>{{scope.row.certPolicyCode}}</span>
           </template>
        </el-table-column>
         <el-table-column label='认证政策/法规名称' prop='certPolicyName'></el-table-column>
         <el-table-column label='发布日期' prop='startDate'></el-table-column>
         <el-table-column label='主要涉及标准' prop='mainlyStandard'></el-table-column>
         <el-table-column label='具体车型应对状态' prop='modelName'>
            <template slot-scope='scope'>
                <span class='cursorP linkBlue' v-if='!isOpenDialog'  @click.stop='goModelDetails(scope.row)'>{{restData(scope.row.modelName,'modelName')}}(详情)</span>
                <span v-else>{{restData(scope.row.modelName,'modelName')}}(详情)</span>
            </template>
         </el-table-column>
         <el-table-column label='公告应对状态' prop='annoucementCopeStatus'>
              <template slot-scope='scope'>
                  <span>{{restData(scope.row.annoucementCopeStatus,'copeStatus')}}</span>
              </template>
         </el-table-column>
         <el-table-column label='CCC应对状态' prop='cccCopeStatus'>
               <template slot-scope='scope'>
                   <span>{{restData(scope.row.cccCopeStatus,'copeStatus')}}</span>
               </template>  
         </el-table-column>
         <el-table-column label='跟踪人' prop='tracker'>
              <template slot-scope='scope'>
                   <span>{{scope.row.trackerName}}</span>
              </template>  
         </el-table-column>
         <!-- <el-table-column label='审核人' prop=''></el-table-column> -->
         <el-table-column label='操作' fixed='right' align='center' v-if="!isOpenDialog && btnRoleObj['productioncar.rectifyingSolution_modify']">
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
                :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
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
import {productioncarVcmList,productioncarVcmDel,getUserInfoByOrgId,getRoleBtnSetting} from '../service/service.js'
  export default {
    data() {
      return {
        btnRoleObj:{},
        tableData: [],
        isShowSearch: false,
        searchContent: {
          applicationCode: '',
          certPolicyCode: '',
          certPolicyName: '',
          mainlyStandard: '',
          annoucementCopeStatus: '',
          cccCopeStatus: '',
          dateRange1: []
        },
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        multipleSelection: []
      }
    },
    created(){
      _self = this;
      if(!this.isOpenDialog){
        this.callAction();
         this.initRole();
      }
    },
    mounted(){
       this.requestData('',false,false);
    },
    components:{
      ecoContent,
      ecoLoading,
      ecoToolTitle
    },
    computed: {
       ...mapState(['copeStatus']),
      contentTop() {
        return this.isShowSearch ? "190px" : "59px";
      },
      isOpenDialog() {
        return this.$route.params.isOpenDialog=='true';
      }
    },
    methods: {
      onCancel() {
        EcoUtil.getSysvm().closeDialog();
      },
      onSubmit() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择一条数据!');
          return;
        }
        let doObj = {};
        doObj.action = 'selectAccording';
        doObj.dataArr = this.multipleSelection;
        doObj.close = true;
        EcoUtil.getSysvm().callBackDialogFunc(doObj);
      },
      initRole() {
        const btn_array = [
          'productioncar.rectifyingSolution_create',
          'productioncar.rectifyingSolution_delete',
          'productioncar.rectifyingSolution_modify'
        ];
        getRoleBtnSetting(btn_array).then((res) => {
            if (res.data) {
                this.btnRoleObj = res.data.authenticationMap;
            }
        })
     },
      goModelDetails(row){
        let  url = '/modelInProduction/index.html#/certPolicyCodeList/'+encodeURIComponent(row.mainlyStandard); //certPolicyCode
        EcoUtil.getSysvm().openDialog(`详情`, url, '1100', '650', '15vh');
      },
      restTracker(row){
        row.trackerName = '';
        if(row.tracker){
          getUserInfoByOrgId(row.tracker).then(res=>{
            row.trackerName = res.data.mi;
          })
        }
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
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'rectificationManagement');
    },
      editCase(row, type) {
        let _width = '800';
        let _height = '450';
        let url;
        let dialogTitle;
        if (type === "editCase") {
          url = '/modelInProduction/index.html#/editManagement/' + row.id + '/editCase';
          dialogTitle = '编辑';
        } else if (type === 'viewCase') {
          url = '/modelInProduction/index.html#/editManagement/' + row.id + '/viewCase';
          dialogTitle = '查看';
          _height = '350';
        } else {
          url = '/modelInProduction/index.html#/editManagement/' + 0 + '/addCase';
          dialogTitle = '新增';
        }
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
    },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
        }
        if (this.multipleSelection.length > 1) {
          return EcoMessageBox.alert('删除操作不能批量处理,请选中一条', '提示');
        }
        let doit = function () {
          var id = _self.multipleSelection[0].id;
          _self.$refs.refLoading.open();
          productioncarVcmDel(id).then(res => {
            _self.multipleSelection = [];
            _self.$message.success('删除成功!');
            _self.restSearContent();
          }).catch(err => {
            _self.$refs.refLoading.close();
          })
        }
        EcoMessageBox.confirm(`您确定要删除此条数据?`, '提示', { type: 'warning', lockScroll: false }, doit)
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
            if(Array.isArray(this.searchContent[key])){
                if(this.searchContent[key].length!==0){
                    params['startDate'] = this.searchContent[key][0];
                    params['endDate'] = this.searchContent[key][1];
                }   
            }else if(this.searchContent[key]){
                params[key] = this.searchContent[key];
            }
          }
        }
        if(isFirstP){
          this.baseInfo.page = 1;
        }
        if(isClearS){
          this.$refs.rectificationManagementTab.clearSelection();
        }
        params.page = this.baseInfo.page;
        productioncarVcmList(params).then(res => {
          this.baseInfo.total = res.data.total;
          res.data.rows.forEach(item=>{
             this.restTracker(item);
          })
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        })
    },
      handleSizeChange(val) {
        this.baseInfo.rows = val;
        this.requestData("search",true,true);
      },
      handleCurrentChange(val) {
        this.baseInfo.page = val;
        this.requestData('search',false,false);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      restSearContent() {
        this.searchContent = {
          applicationCode: '',
          certPolicyCode: '',
          certPolicyName: '',
          mainlyStandard: '',
          annoucementCopeStatus: '',
          cccCopeStatus: '',
          dateRange1: []
        }
        this.requestData('search',true,true);
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
    }
  }
</script>
<style scoped>
  .rectificationManagement {
    position: relative;
    height: 100%;
    overflow-y: auto;
    color: #0f1419;
  }
  .rectificationManagement.isOpenDialog{
        /* min-width: 1450px; */
        min-width: 1000px;
        margin: 0 24px;
        top: 2%;
        height: 96%;
  }
  .rectificationManagement .searchRow {
    padding: 15px 10px 16px 10px;
    background: #fff
  }

  .rectificationManagement .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .searchRow .el-col+.el-col {
    margin-top: 7px;
  }
  .linkBlue{
    color:#409eff;
  }
  .rectificationManagement .btn {
    position: absolute;
    bottom: 0px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }
</style>