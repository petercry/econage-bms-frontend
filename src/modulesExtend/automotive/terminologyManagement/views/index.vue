<template>
  <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
    <div class='terminology'>
      <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
      <eco-content top='0px' height='60px' type='tool'>
        <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
          <el-col :span='5' style='height: 30px;line-height: 30px;'>
            <!-- <eco-tool-title title='术语管理'></eco-tool-title> -->
            <strong>术语管理</strong>
          </el-col>
          <el-col :span='19' style="text-align: right;margin-top:2px;">
            <el-button type='primary' size='small' @click='searchBoxShowChange'>高级查询</el-button>
            <el-button type='primary' size='small' @click='addCase' v-show="btnRoleMap['ext_dongfeng_term_manage_term_manage_insert']">新增</el-button>
            <el-button type='primary' size='small' @click='updateCase' v-show="btnRoleMap['ext_dongfeng_term_manage_term_manage_update']">调整</el-button>
            <el-button type='danger' size='small' @click='invalidCase' v-show="btnRoleMap['ext_dongfeng_term_manage_term_manage_disable']">作废</el-button>
            <el-button type='primary' size='small' @click='exportCase' v-show="btnRoleMap['ext_dongfeng_term_manage_term_manage_export']">导出</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content v-show='isSearchShow' top='59px' height='120px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
        <el-row style="padding:12px 10px 16px 10px;background:#fff">
          <el-col :span='24' style='margin-bottom:7px;'>
            <span class='searchInputLabel'>&emsp;状态:</span>
            <el-select filterable v-model='searchContent.status' style='width:150px;' clearable>
              <el-option value='VALID' label='有效'></el-option>
              <el-option value='INVALID ' label='作废'></el-option>
            </el-select>
            <span class='searchInputLabel'>术语名称:</span>
            <el-input clearable style='width:150px' v-model='searchContent.termName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>英文名称:</span>
            <el-input clearable style='width:150px' v-model='searchContent.enName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
          </el-col>
          <el-col :span='24' style='margin-bottom:7px;'>
            <span class='searchInputLabel'>缩略语:</span>
            <el-input clearable style='width:150px' v-model='searchContent.abbreviations' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <span class='searchInputLabel'>&emsp;&emsp;来源:</span>
            <el-input clearable style='width:150px' v-model='searchContent.sourceName' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <!-- <span class='searchInputLabel'>所属专业:</span>
            <el-select filterable v-model='searchContent.profession' style='width:150px;' clearable>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in professionList' :key='item.id'></el-option>
            </el-select> -->
            <span class='searchInputLabel'>提出部门:</span>
            <tag-select placeholder="选择部门" style="width:150px;vertical-align: top;" :initDataStr="searchContent.initDataStrDept" :initOptions="{selectNum:1,selectType:'Dept'}"
              @callBack="selectRoleDept">
            </tag-select>
          </el-col>
          <el-col :span='24'>
            <span class='searchInputLabel'>责任人:</span>
            <tag-select placeholder="选择人员" style="width:150px;vertical-align: top;" :initDataStr="searchContent.initDataStrUser" :initOptions="{selectNum:1,selectType:'User'}"
              @callBack="selectRoleUser">
            </tag-select>
            <!-- <span class='searchInputLabel'>&emsp;&emsp;类型:</span>
            <el-select filterable v-model='searchContent.termType' clearable style='width:150px'>
              <el-option :value='item.id' :label='item.text' v-for='(item,index) in termTypeList' :key='item.id'></el-option>
            </el-select> -->
            <span class='searchInputLabel' style='margin-left:34px;'>定义:</span>
            <el-input clearable style='width:150px' v-model='searchContent.definition' placeholder='请输入'>
              <i class='el-icon-search el-input__icon' slot='suffix'></i>
            </el-input>
            <el-button type='primary' style='margin-left:5px;' @click="requestData('search')">查询</el-button>
            <el-button @click='restSearchContent'>重置</el-button>
          </el-col>
        </el-row>
      </eco-content>
      <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
        <el-row class="modelBox">
          <el-col :span='4' class="splitLine" >
            <el-scrollbar style='height:100%;'>
                <div class='noDataTree' v-if='treeData.length==0'>
                    <span>暂无数据</span>
                </div>
                <el-tree v-else :default-expand-all='true'   node-key="id" :data="treeData" empty-text='无标题' :props="defaultProps" @node-click="handleNodeClick" highlight-current ref='terminologyManagementTree'>
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <el-tooltip v-if='(node.label.length + parseInt(data.count))>=13'  effect="dark" :content="(node.label+' ('+data.count+')')" placement="right-start">
                            <span class="nodeText">{{ node.label }}<span style='margin-left:5px;'>({{data.count}})</span></span>
                        </el-tooltip>
                        <span class="nodeText" v-else>{{ node.label }}<span  style='margin-left:5px;'>({{data.count}})</span></span>
                    </span>   
                </el-tree>
            </el-scrollbar>
          </el-col>
          <el-col :span='20'>
            <el-table border @sort-change="sortTablefunc" :default-sort = "defaultSort" @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'  tooltip-effect='dark'
              height='100%' class='standardizationTable' ref='terminologyManagementTab'>
              <el-table-column type='selection' width='50' align='center'></el-table-column>
              <el-table-column type='index' label='序号'>
                <template slot-scope='scope'>
                  {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label='状态' prop='statusName' sortable='custom'></el-table-column>
              <el-table-column label='术语名称' width='140' show-overflow-tooltip prop='termName' sortable='custom'></el-table-column>
              <el-table-column label='英文名称' width='140' show-overflow-tooltip prop='enName' sortable='custom'></el-table-column>
              <el-table-column label='缩略语' width='140' show-overflow-tooltip prop='abbreviations' sortable='custom'></el-table-column>
              <el-table-column label='定义' prop='definition' sortable='custom'></el-table-column>
              <el-table-column label='提出部门' width='140' show-overflow-tooltip prop='proposeDeptName' sortable='custom'></el-table-column>
              <!-- <el-table-column label='所属专业' width='100' show-overflow-tooltip prop='professionName' sortable='custom'></el-table-column> -->
              <el-table-column label='来源' prop='sourceName' min-width='110' width='130' show-overflow-tooltip sortable='custom'></el-table-column>
              <el-table-column label='所属领域' width='100' show-overflow-tooltip prop='subProfessionalDomainName'></el-table-column>
              <el-table-column label='类型' prop='professionalDomainName' min-width='110' width='130' show-overflow-tooltip></el-table-column>
              <!-- <el-table-column label='类型' prop='termTypeName' min-width='110' width='130' show-overflow-tooltip sortable='custom'></el-table-column> -->
              <el-table-column label='责任人' prop='proposeUserName' min-width='110' width='130' show-overflow-tooltip sortable='custom'></el-table-column>
              <el-table-column label='提交时间' prop='createDate' width='160' sortable='custom'></el-table-column >
              <el-table-column label='操作' fixed='right' align='center' width='100'>
                <template slot-scope='scope'>
                  <el-button type='text' @click='viewCase(scope.row)'>查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

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
  import tagSelect from '@/components/orgPick/tagSelect.vue'
  import { EcoUtil } from '@/components/util/main.js'
  import { EcoMessageBox } from '@/components/messageBox/main.js'
  import { domainCategoryTree,termGetList, termInvalid, getWFOperateId, termUpdate, termManageAdd,termDownloadExcel } from '../service/service.js'
  import { mapState } from 'vuex'
  export default {
    name: 'terminology',
    components: {
      ecoContent,
      ecoLoading,
      ecoToolTitle,
      tagSelect
    },
    computed: {
      ...mapState(['termTypeList', 'professionList','btnRoleMap']),
      contentTop() {
        return this.isSearchShow ? '180px' : '59px';
      }
    },
    data() {
      return {
        defaultSort:{prop: 'termName', order: 'ascending'},
        sortInfo:{
          sortProp:'termName',
          orderName:'asc'
        },
        defaultProps: {
            children: 'children',
            label: 'name'
        },
        treeData:[],
        isSearchShow: false,
        baseInfo: {
          page: 1,
          rows: 30,
          total: 0
        },
        searchContent: {
          status: '',
          termName: '',
          enName: '',
          abbreviations: '',
          definition: '',
          proposeDeptName: '',
          proposeUserName: '',
          sourceName: '',
          termType: '',
          initDataStrDept: '',
          initDataStrUser: '',
          subProfessionalDomain:''
        },
        tableData: [],
        multipleSelection: []
      }
    },
    created() {
      _self = this;
      this.callAction();//监听窗口的回调函数
    },
    mounted() {
      this.getTree();
      this.requestData();
    },
    methods: {
      //表格排序
      sortTablefunc(column){
          if(column.prop && column.order){
              if(['statusName','sourceName'].includes(column.prop)){
                this.sortInfo.sortProp = column.prop.split('Name')[0];
              }else{
                this.sortInfo.sortProp = column.prop;
              }
              if(column.order == 'ascending'){
                  this.sortInfo.orderName = 'asc'
              }else if(column.order == 'descending'){
                  this.sortInfo.orderName = 'desc'
              }
          }else{
            this.sortInfo.sortProp = 'termName' ;
            this.sortInfo.orderName = 'asc'
          }
          this.$refs.terminologyManagementTab.bodyWrapper.scrollTop =0;
          this.requestData('search');
       },
      getTree(){
        domainCategoryTree().then(res=>{
            this.treeData = res.data.children || [];
            console.log(res.data);
          }).catch(err=>{
            this.treeData = [];
          }) 
      },
      handleNodeClick(data) {
          if(data.leaf){
             this.searchContent.subProfessionalDomain = data.id;
             this.requestData('search');  
          }
      },
      exportCase(){
        this.$refs.refLoading.open();
        let params = {
          sort: [this.sortInfo.sortProp],     // 排序字段列表
          order: [this.sortInfo.orderName],    // 排序方式列表，asc升序，desc降序
        };
        for (var key in this.searchContent) {
            if (this.searchContent[key] && key !== 'initDataStrDept' && key !== 'initDataStrUser') {
              params[key] = this.searchContent[key];
            }
        }
        termDownloadExcel(params).then(res => {
          if(window.navigator && window.navigator.msSaveBlob) {
            navigator.msSaveBlob(new Blob([res.data],'术语管理.xlsx'));
            this.$refs.refLoading.close();
          }else{
            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
            let url = window.URL.createObjectURL(blob);  
            let a = document.createElement("a");
            a.href = url;
            a.download = '术语管理.xlsx';
            this.$refs.refLoading.close();
            a.click();
            window.URL.revokeObjectURL(url);
          }
        }).catch(err => {
          this.$refs.refLoading.close();
        })
      },
      searchBoxShowChange() {
        this.isSearchShow = !this.isSearchShow;
      },
      validaor() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择一条数据!');
          return false;
        }
        if (this.multipleSelection.length > 1) {
          this.$message.warning('此操作只允许单条数据操作!');
          return false;
        }
        return true;
      },
      invalidCase() {
        if (this.validaor()) {
          let id = this.multipleSelection[0].id;
          termInvalid(id).then(res => {
            getWFOperateId(res.data.startTaskId).then((response) => {
              if (response.data.status == 0) {
                let operateId = response.data.operate_id;
                if (sysEnv == 1) {
                  let tabObj = {};
                  let goPage = "flowform/index.html#/wfDetail/" + res.data.startTaskId + "/" + operateId;
                  tabObj.desc = '待办流程';
                  tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                  window.parent.window.sysvm.doTab(tabObj);
                }
              } else {
                EcoMessageBox.alert(response.data.msg);
              }
            })
          });
        }
      },
      updateCase() {
        if (this.validaor()) {
          let id = this.multipleSelection[0].id;
          termUpdate(id).then(res => {
            getWFOperateId(res.data.startTaskId).then((response) => {
              if (response.data.status == 0) {
                let operateId = response.data.operate_id;
                if (sysEnv == 1) {
                  let tabObj = {};
                  let goPage = "flowform/index.html#/wfDetail/" + res.data.startTaskId + "/" + operateId;
                  tabObj.desc = '待办流程';
                  tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                  window.parent.window.sysvm.doTab(tabObj);
                }
              } else {
                EcoMessageBox.alert(response.data.msg);
              }
            })
          });
        }
      },
      addCase() {
        // let _width = '1000';
        // let _height = '600';
        // let url = '/terminologyManagement/index.html#/editTerminlogy/' + 0 + '/addCase';
        // EcoUtil.getSysvm().openDialog('新增', url, _width, _height, '15vh');
        termManageAdd().then(res => {
          getWFOperateId(res.data.startTaskId).then(response => {
            if (response.data.status == 0) {
              let operateId = response.data.operate_id;
              if (sysEnv == 1) {
                let tabObj = {};
                let goPage = "flowform/index.html#/wfDetail/" + res.data.startTaskId + "/" + operateId;
                tabObj.desc = '新建流程';
                tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                window.parent.window.sysvm.doTab(tabObj);
              }
            } else {
              EcoMessageBox.alert(response.data.msg);
            }
          })
        })
      },
      restSearchContent() {
        this.searchContent = {
          status: '',
          termName: '',
          enName: '',
          abbreviations: '',
          definition: '',
          proposeDeptName: '',
          proposeUserName: '',
          sourceName: '',
          termType: '',
          initDataStrDept: '',
          initDataStrUser: '',
          subProfessionalDomain:''
        };
        if(this.$refs.terminologyManagementTree && this.$refs.terminologyManagementTree.getCurrentNode()){
            this.$refs.terminologyManagementTree.setCurrentKey();
        }
        this.$refs.terminologyManagementTab.sort('termName','ascending');
        // this.requestData('search');
      },
      selectRoleUser(data) {
        //选择人员
        if (!data.id && data.itemArray.length === 0) {
          this.searchContent.proposeUserName = '';
          this.searchContent.initDataStrUser = '';
        } else {
          this.searchContent.proposeUserName = data.name;
          this.searchContent.initDataStrUser = data.id;
        }
      },
      selectRoleDept(data) {
        //选择机构
        if (!data.id && data.itemArray.length === 0) {
          //人员删除
          this.searchContent.initDataStrDept = '';
          this.searchContent.proposeDeptName = '';
        } else {
          //data.name  data.orgId
          this.searchContent.proposeDeptName = data.name;
          this.searchContent.initDataStrDept = data.id;
        }
      },
      callAction() {
        let callBackDialogFunc = function (obj) {
          if (obj && (obj.action === 'addTerminlogy')) {
            //修改刷新
            _self.$message.success('新增成功!');
            _self.restSearchContent();
          }
        }
        EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'terminology');
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      viewCase(row) {
        let _width = '1000';
        let _height = '400';
        let url = '/terminologyManagement/index.html#/editTerminlogy/' + row.id + '/viewCase';
        EcoUtil.getSysvm().openDialog('查看', url, _width, _height, '15vh');
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
          sort: [this.sortInfo.sortProp],
          order: [this.sortInfo.orderName],
          rows: this.baseInfo.rows
        };
        if (type === 'search') {
          this.baseInfo.page = 1;
          for (var key in this.searchContent) {
            if (this.searchContent[key] && key !== 'initDataStrDept' && key !== 'initDataStrUser') {
              params[key] = this.searchContent[key];
            }
          }
        }
        params.page = this.baseInfo.page;
        termGetList(params).then(res => {
          this.tableData = res.data.rows;
          this.baseInfo.total = res.data.total;
          this.$refs.refLoading.close();
        }).catch(err => {
          this.tableData = [];
          this.baseInfo.total = 0;
          this.$refs.refLoading.close();
        })
      }
    },
    watch: {

    }
  }
</script>
<style scoped>
  .terminology {
    color: #0f1419;
    min-width: 1000px;
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: auto;
    color: #0f1419;
  }

  .terminology .plainBtn:first-of-type {
    margin-left: 20px;
  }

  .terminology .searchInputLabel {
    font-size: 14px;
    margin-left: 5px;
  }

  .terminology .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
    background: #f5f7fa !important;
  }

  .standardizationTable /deep/ .tableHeader th {
    background: #f5f7fa;
    color: #000;
    /* border-bottom-width: 0px; */
  }

  /* .standardizationTable /deep/ .el-table__row td {
    border-bottom-width: 0px;
  } */
  .terminology .modelBox {
    height: 100%;
  }

.terminology .modelBox .el-col {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 270px;
}

.terminology .modelBox .el-col:last-child {
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
}

.terminology .modelBox .splitLine {
  top: 10px;
  left: 0px;
  width:265px;
  background-color: #f5f5f5;
}
.terminology  .splitLine /deep/ .el-tree{
  background-color: #f5f5f5;
  border:1px solid #EBEEF5
}
.terminology .noDataTree {
  text-align: center;
  line-height: 200px;
  color: #909399;
  font-size: 12px;
}
.terminology  .custom-tree-node .nodeText{
  width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.terminology .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.terminology /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
