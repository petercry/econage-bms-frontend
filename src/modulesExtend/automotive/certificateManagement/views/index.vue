<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='certificate'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='10' style='height:30px;line-height: 30px;'>
            <eco-tool-title title='证书管理' style='float: left;margin-right:20px;'></eco-tool-title>
            <el-checkbox-group v-model='checkList' @change='checkChange'>
              <el-checkbox label="VALID">有效</el-checkbox>
              <el-checkbox label="INVALID">作废</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span='14' style='text-align:right'>
            <!-- class="plainBtn"  -->
            <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
            <el-button type='primary' size='small' v-show='btnRoleObj["certificate.management_CREATE_CERTICICATE"] && (checkList.length===1 && checkList[0]=="VALID")' @click='editCase({},"addcase")'>新增</el-button>
            <el-button type='primary' size='small' v-show='btnRoleObj["certificate.management_EXPORT_CERTICICATE"]' @click='exportCase'>导出</el-button>
            <el-button type='danger' size='small' v-show='btnRoleObj["certificate.management_DELETE_CERTICICATE"] && (checkList.length===1 && checkList[0]=="VALID")'  @click='deleteCase'>作废</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:15px 10px 16px 10px;background:#fff">
          <el-col>
            <span class='searchInputLabel'>&emsp;&emsp;类别:</span>
            <el-select filterable v-model='searchContent.category' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in typeList' :key='item.id'></el-option>
            </el-select>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;证书编号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.certificateNo'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;代号:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.codeName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24' style='margin-top:7px;'>
            <span class='searchInputLabel'>车辆品牌:</span>
            <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.vehicleBrand'
              placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>证书有效开始日期:</span>
            <el-date-picker style='width:150px' v-model="searchContent.validityStartDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
            <span class='searchInputLabel'>证书有效截至日期:</span>
            <el-date-picker style='width:150px' v-model="searchContent.validityEndDate" value-format='yyyy-MM-dd' type="date" placeholder="选择日期">
            </el-date-picker>
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
          <el-table-column show-overflow-tooltip label='类别' prop='category'>
            <template slot-scope='scope'>
              <span>{{scope.row.category|restData}}</span>
            </template>
          </el-table-column>
          <el-table-column label='代号' prop='codeName'></el-table-column>
          <el-table-column show-overflow-tooltip label='证书编号' prop='certificateNo'></el-table-column>
          <!-- <el-table-column label='车辆类型' prop='vehicleType'></el-table-column> -->
          <el-table-column label='车辆品牌' prop='vehicleBrand'></el-table-column>
          <el-table-column label='证书有效开始日期' prop='validityStartDate'></el-table-column>
          <el-table-column label='证书有效截止日期' prop='validityEndDate'></el-table-column>
          <el-table-column label='状态' prop='statusName'></el-table-column>
          <el-table-column label='操作' fixed='right' align='center' width='100'>
            <template slot-scope='scope'>
              <el-button type='text' @click.stop='editCase(scope.row,"editCase")' v-show='btnRoleObj["certificate.management_UPDATE_CERTICICATE"] && (checkList.length===1 && checkList[0]=="VALID")'>修改</el-button>
              <el-button type='text' @click.stop='preView(scope.row.id)'>查看</el-button>
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
  import ecoContent from '@/components/pageAb/ecoContent.vue'
  import ecoLoading from '@/components/loading/ecoLoading.vue'
  import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
  import { EcoUtil } from '@/components/util/main.js'
  import { EcoMessageBox } from '@/components/messageBox/main.js'
  import { mapState } from 'vuex'
  import { EcoFile } from '@/components/file/main.js'
  import { getFileList,certificateList, certificateDel, certificateExport,getRoleBtnSetting  } from '../service/service.js'
  export default {
    name: 'certificate',
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
        checkList:['VALID'],
        btnRoleObj:{},
        isShowSearch: false,
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContent: {
          category: '',
          codeName: '',
          certificateNo: '',
          vehicleBrand: '',
          validityStartDate: '',
          validityEndDate: ''
        },
        tableData: [],
        multipleSelection: []
      }
    },
    created() {
      _self = this;
      this.initRole();
      this.callAction();//监听窗口的回调函数
    },
    mounted() {
      this.requestData();
    },
    filters: {
      restData: function (data) {
        var str = '';
        _self.typeList.forEach(item => {
          if (item.id === data) {
            str = item.text;
          }
        })
        return str;
      }
    },
    methods: {
      preView(id){
        //附件查看
        this.$refs.refLoading.open();
        getFileList('certificate',id).then(res=>{
           if(res.data.length===0){
                this.$message.warning('暂无附件!');
                this.$refs.refLoading.close();
           }else{
                EcoFile.openFileHeaderByView(res.data[0].id, res.data[0].name);
                this.$refs.refLoading.close();
           }
        })
      },
      checkChange(val){
          if(val.length===0){
            this.checkList = ['VALID'];
          }
          this.requestData('search')
      },
      initRole() {
        const btn_array = [
            'certificate.management_VIEW_CERTICICATE',
            'certificate.management_CREATE_CERTICICATE',
            'certificate.management_UPDATE_CERTICICATE',
            'certificate.management_DELETE_CERTICICATE',
            'certificate.management_EXPORT_CERTICICATE'
        ];
        getRoleBtnSetting(btn_array).then((res) => {
          if (res.data) {
            this.btnRoleObj = res.data.authenticationMap;
          }
        })
      },
      exportCase() {
        this.$refs.refLoading.open();
        let params = {
          statusList:this.checkList,
          sort: ['modDate'],     // 排序字段列表
          order: ['desc'],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
          if (this.searchContent[key]) {
            params[key] = this.searchContent[key];
          }
        }
        certificateExport(params).then(res => {
          if(window.navigator && window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(new Blob([res.data],'证书管理.xlsx'));
              this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); // 为blob设置文件类型，这里以.xlsx为例
            let url = window.URL.createObjectURL(blob); // 创建一个临时的url指向blob对象
            let a = document.createElement("a");
            a.href = url;
            a.download = '证书管理.xlsx';
            this.$refs.refLoading.close();
            a.click();
            // 释放这个临时的对象url
            window.URL.revokeObjectURL(url);
          }
        }).catch(err => {
          this.$refs.refLoading.close();
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      changeSearchShow() {
        this.isShowSearch = !this.isShowSearch;
      },
      restSearContent() {
        this.searchContent = {
          category: '',
          codeName: '',
          certificateNo: '',
          vehicleBrand: '',
          validityStartDate: '',
          validityEndDate: ''
        };
        this.checkList = ['VALID'];
        this.requestData('search');
      },
      deleteCase() {
        if (this.multipleSelection.length === 0) {
          return EcoMessageBox.alert('当前未选中行,请点击要作废的行再进行作废操作。', '提示');
        }
        if (this.multipleSelection.length > 1) {
          return EcoMessageBox.alert('作废操作不能批量处理,请勾选一条数据。', '提示');
        }
        let doit = function () {
          var id = _self.multipleSelection[0].id;
          _self.$refs.refLoading.open();
          certificateDel(id).then(res => {
            _self.$message.success('作废成功!');
            _self.requestData('search');
          }).catch(err => {
            _self.$refs.refLoading.close();
          })
        }
        EcoMessageBox.confirm('您确定要作废此数据?', '提示', { type: 'warning', lockScroll: false }, doit)
      },
      callAction() {
        let callBackDialogFunc = function (obj) {
          if (obj && (obj.action === 'editCertificate')) {
            //修改 刷新
            _self.$message.success('修改成功!');
            _self.requestData();
          } else if (obj.action === 'addCertificate') {
            //新建 刷新
            _self.$message.success('新建成功!');
            _self.restSearContent();
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'certificate');
      },
      editCase(row, type) {
        let _width = '800';
        let _height = '370';
        let url;
        let dialogTitle;
        if (type === "editCase") {
          url = '/certificateManagement/index.html#/editcertificate/' + row.id + '/editCase';
          dialogTitle = '编辑';
        } else if (type === 'viewCase') {
          url = '/certificateManagement/index.html#/editcertificate/' + row.id + '/viewCase';
          dialogTitle = '查看';
          _height = '270';
        }
        else {
          url = '/certificateManagement/index.html#/editcertificate/' + 0 + '/addCase';
          dialogTitle = '新增';
        }
        EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
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
          statusList:this.checkList,
          sort: ['modDate'],
          order: ['desc'],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          this.baseInfo.page = 1;
          for (var key in this.searchContent) {
            if (this.searchContent[key]) {
              params[key] = this.searchContent[key];
            }
          }
        }
        params.page = this.baseInfo.page;
        certificateList(params).then(res => {
          this.baseInfo.total = res.data.total;
          this.tableData = res.data.rows;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.baseInfo.total = 0;
          this.tableData = [];
          this.$refs.refLoading.close();
        })
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
 .certificate  .el-checkbox{
    margin-right:15px;
  }
</style>
