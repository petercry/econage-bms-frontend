<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='statisticsList'>
        <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
        <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
          <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
            <el-col :span='5'  style='height:30px;line-height: 30px;'> 
              <strong>在产车型统计表</strong>
            </el-col>
            <el-col :span='19' style='text-align:right'>
               <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
               <el-button type='primary' size='small' @click='editCase({},"addCase")' v-show="btnRoleObj['vehicleStatistic_create']">新增</el-button>
               <el-button type='danger' size='small' @click='deleteCase' v-show="btnRoleObj['vehicleStatistic_delete']">删除</el-button>
               <el-button type='primary' size='small' @click='importCase' v-show="btnRoleObj['vehicleStatistic_upload']">导入</el-button>
               <el-button type='primary' size='small' @click="exportCase" v-show="btnRoleObj['vehicleStatistic_download']">导出</el-button>
               <el-upload v-show='false' ref='statisticsUpload' :auto-upload='true' :http-request="uploadFile" action="" :before-upload='beforeUpload'
                :show-file-list='false'  accept='.xls,.xlsx'>
               </el-upload>
            </el-col>
          </el-row>
        </eco-content>
         <eco-content v-show='isShowSearch' top='59px' height='130px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
             <el-row class='searchRow'>
                <el-col :span='24'>
                   <span class='searchInputLabel'>&emsp;&emsp;序号:</span>
                   <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.seq' placeholder='请输入'>
                      <i class='el-icon-search el-input__icon' slot='suffix'></i>
                   </el-input>
                   <span class='searchInputLabel'>&emsp;检验项目:</span>
                   <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.testProject' placeholder='请输入'>
                      <i class='el-icon-search el-input__icon' slot='suffix'></i>
                   </el-input>
                   <span class='searchInputLabel'>检验依据:</span>
                   <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.testBasis' placeholder='请输入'>
                      <i class='el-icon-search el-input__icon' slot='suffix'></i>
                   </el-input>
                </el-col>
                <el-col :span='24'>
                    <span class='searchInputLabel'>适用车型:</span>
                    <el-select filterable v-model='searchContent.carModelType' style='width:150px;' clearable multiple collapse-tags>
                      <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels' :key='item.id'></el-option>
                    </el-select>
                    <span class='searchInputLabel'>&emsp;动力类型:</span>
                    <el-select filterable style='width:150px' v-model="searchContent.carModelValue" placeholder="请选择"  clearable multiple collapse-tags>
                      <el-option v-for="(item) in powerType" :key="item.id" :label="item.text" :value="item.id">
                      </el-option>
                    </el-select>
                    <span class='searchInputLabel'>是否有效:</span>
                    <el-select filterable style='width:150px' v-model="searchContent.available" placeholder='请选择'>
                      <el-option v-for="(item) in available" :key="item.id" :label="item.text" :value="item.id">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col>
                  <span class='searchInputLabel'>公告: NT-TT</span>
                  <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                    value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                  </el-date-picker>
                  <span class='searchInputLabel'>CCC: NT-TT</span>
                  <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange2"
                    value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                  </el-date-picker>
                    <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                    <el-button @click='restSearContent'>重置</el-button>
                </el-col>
             </el-row>
         </eco-content>
          <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
              <el-table row-key='id' border ref='statisticsTable' @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'
                tooltip-effect='dark' height='100%' class='statisticsTable'>
                  <el-table-column type="selection" width="55" reserve-selection>
                  </el-table-column>
                  <el-table-column  label='序号' prop='seq' align='center'></el-table-column>
                  <el-table-column label="检验项目" width='160' prop='testProject'>
                     <template slot-scope="scope">
                         <span class='cursorP' @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.testProject}}</span>
                     </template>
                  </el-table-column> 
                  <el-table-column label="校验依据" prop='testBasis' width='200' show-overflow-tooltip></el-table-column> 
                  <el-table-column label="公告" align='center'>
                    <el-table-column label="是否适用" prop='announcementApplicable' align='center'>
                       <template slot-scope='scope'>
                          {{restData(scope.row.announcementApplicable,'applicable')}}
                       </template>
                    </el-table-column> 
                    <el-table-column label="NT" width='150' prop='announcementNt' align='center'></el-table-column> 
                    <el-table-column label="TT" width='150' prop='annoucementTt' align='center'></el-table-column> 
                  </el-table-column> 
                  <el-table-column label="CCC" align='center'>
                    <el-table-column label="是否适用" prop='cccApplicable' align='center'>
                       <template slot-scope="scope">
                           {{restData(scope.row.cccApplicable,'applicable')}}
                       </template>
                    </el-table-column> 
                    <el-table-column label="NT" width='150' prop='cccNt' align='center'></el-table-column> 
                    <el-table-column label="TT" width='150' prop='cccTt' align='center'></el-table-column> 
                  </el-table-column> 
                  <el-table-column label="实施情况说明" show-overflow-tooltip width='200' prop='implementDesciption'></el-table-column> 
                  <el-table-column label="适用车型" prop='modelList' show-overflow-tooltip width="200">
                      <template slot-scope="scope">
                          {{restData(scope.row.modelList,'modelList')}}
                      </template>
                  </el-table-column> 
                  <el-table-column label="动力类型" prop='powerList' show-overflow-tooltip width="200">
                       <template  slot-scope="scope">
                           {{restData(scope.row.powerList,'powerList')}}
                       </template>  
                  </el-table-column> 
                  <el-table-column label="是否有效" prop='available'>
                     <template slot-scope="scope">
                         {{restData(scope.row.available,'available')}}
                     </template>
                  </el-table-column>
                  <el-table-column label='操作' fixed='right' align='center' width='100' v-if="btnRoleObj['vehicleStatistic_modify']">
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
import {getRoleBtnSetting,productioncarVehicleList,productioncarVehicleDel,productioncarVehicleExport,productioncarVehicleImport} from '../service/service.js'
export default {
  name: "statisticsList",
  data() {
    return {
      timer:null,
      multipleSelection:[],
      isShowSearch: true,
      searchContent: {
        seq:'',
        testProject:'',
        testBasis:'',
        carModelType:[],
        carModelValue:[],
        available:'',
        dateRange1:[],
        dateRange2:[]
      },
      baseInfo: {
        page: 1,
        rows: 30,
        total: 0
      },
      tableData:[],
      btnRoleObj:{}
    };
  },
  components:{
    ecoContent,
    ecoLoading,
    ecoToolTitle
  },
  computed:{
     ...mapState(['applicableModels','powerType','available']),
     contentTop() {
      return this.isShowSearch ? "190px" : "59px";
    }
  },
  created(){
     _self = this;
     this.initRole();
      this.callAction();//监听窗口的回调函数 
  },
  mounted() {
        this.requestData('',false,false);
  },
  methods: {
    initRole() {
        const btn_array = [
          'vehicleStatistic_create',
          'vehicleStatistic_delete',
          'vehicleStatistic_modify',
          'vehicleStatistic_lookup',
          'vehicleStatistic_upload',
          'vehicleStatistic_download',
        ];
        getRoleBtnSetting(btn_array).then((res) => {
            if (res.data) {
                this.btnRoleObj = res.data.authenticationMap;
            }
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
    uploadFile(params){
        this.$refs.refLoading.open();
        var fileObj = params.file;
        var form = new FormData();
        form.append('excel',fileObj);//file
        form.append('time',new Date().getTime());
        productioncarVehicleImport(form).then(res=>{
            this.$message.success('导入成功');
            this.restSearContent();
            this.$refs.refLoading.close();
        }).catch(err=>{
            this.$message.error('导入失败');
            this.$refs.refLoading.close();
        })
    },
    importCase(){
        let doit = function(){
            _self.$refs.statisticsUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
        }
        EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?','提示',{ type: 'warning', lockScroll: false }, doit)
    },
    exportCase() {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],     // 排序字段列表
          order: ['desc'],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
          if(this.searchContent[key]){
              if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                params.announcementNt = this.searchContent[key][0];
                params.annoucementTt = this.searchContent[key][1]; 
              } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                params.cccNt = this.searchContent[key][0];  
                params.cccTt = this.searchContent[key][1];  
              } else if((key === 'carModelType' || key ==='carModelValue') && this.searchContent[key].length!==0){
                params[key] = this.searchContent[key];
              }else if (typeof this.searchContent[key] !=='object') {
                  params[key] = this.searchContent[key];
              }
          }
        }
        productioncarVehicleExport(params).then(res => {
          let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
          let url = window.URL.createObjectURL(blob);  
          let a = document.createElement("a");
          a.href = url;
          a.download = '在产车型统计表.xlsx';
          this.$refs.refLoading.close();
          a.click();
          window.URL.revokeObjectURL(url);
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
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'statisticsList');
    },
   editCase(row, type) {
        let _width = '1000';
        let _height = '600';
        let url;
        let dialogTitle;
        if (type === "editCase") {
          url = '/modelInProduction/index.html#/editPage/' + row.id + '/editCase';
          dialogTitle = '编辑';
        } else if (type === 'viewCase') {
          url = '/modelInProduction/index.html#/editPage/' + row.id + '/viewCase';
          dialogTitle = '查看';
          _height = '450';
        } else {
          url = '/modelInProduction/index.html#/editPage/' + 0 + '/addCase';
          dialogTitle = '新增';
        }
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
          _self.$refs.refLoading.open();
          // var id = _self.multipleSelection[0].id;
          _self.multipleSelection.forEach(item=>{
            productioncarVehicleDel(item.id).then(res => {
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
    requestData(type,isFirstPage,isClearSel) {
        this.$refs.refLoading.open();
        let params = {
          sort: ['modDate'],
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          for (var key in this.searchContent) {
            if(this.searchContent[key]){
              if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                params.announcementNt = this.searchContent[key][0];
                params.annoucementTt = this.searchContent[key][1]; 
              } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                params.cccNt = this.searchContent[key][0];  
                params.cccTt = this.searchContent[key][1];  
              } else if((key === 'carModelType' || key ==='carModelValue') && this.searchContent[key].length!==0){
                params[key] = this.searchContent[key];
              }else if (typeof this.searchContent[key] !=='object') {
                  params[key] = this.searchContent[key];
              }
            }
          }
        }
        if(isFirstPage){
          this.baseInfo.page = 1;
        }
        if(isClearSel){
          this.$refs.statisticsTable.clearSelection(); //清除选项
        }
        params.page = this.baseInfo.page;
        productioncarVehicleList(params).then(res => {
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
        seq:'',
        testProject:'',
        testBasis:'',
        carModelType:[],
        carModelValue:[],
        available:'',
        dateRange1:[],
        dateRange2:[]
      };
      this.requestData('',true,true);
    },
    handleSizeChange(val) {
      this.baseInfo.rows = val;
      this.requestData("search",false,true);
    },
    handleCurrentChange(val) {
      this.baseInfo.page = val;
      this.requestData('search',false,false);
    }
  },
  watch: {}
};
</script>
<style scoped>
.statisticsList{
    min-width: 1000px;
    position: relative;
    margin: 0 24px;
    top: 2%;
    height:96%;
    overflow-y: auto;
    color: #0f1419;
}
.statisticsList .searchInputLabel {
  font-size: 14px;
  margin-left: 5px;
}
.statisticsList .searchRow{
  padding:15px 10px 16px 10px;
  background:#fff
}
.statisticsList .el-col+.el-col{
  margin-top:7px;
}
.statisticsList .cursorP{
  cursor: pointer;
  color:#409eff;
}
</style>
