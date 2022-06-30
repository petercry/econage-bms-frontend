<template>
    <eco-content top='0px' bottom='0px' type='tool' :style='{"background-color":(!isOpenDialog?"#F5F5F5":"")}'>
        <div class='selectCriteriaPage' :class="{isOpenDialog:!isOpenDialog}">
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;' v-if='!isOpenDialog'>
                        <strong>选择标准界面</strong>
                    </el-col>
                    <el-col :span='!isOpenDialog?19:24' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='addBatch'>批量协同</el-button>
                        <el-button type='danger' size='small'  @click='deleteBatch'>批量取消</el-button>
                    </el-col>
                </el-row>
            </eco-content> 
            <eco-content v-show='isShowSearch' top='59px' height='120px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col>
                        <span class='searchInputLabel'>标准编号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search',true,true)" v-model='searchContent.stdName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准选择状态:</span>
                        <el-select filterable v-model='searchContent.filterCooperateSelect' style='width:100px;' clearable>
                            <el-option value='Y' label='已选'></el-option>
                            <el-option value='N' label='未选'></el-option>
                        </el-select>
                        <el-button @click='searchCase' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
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
                            <el-tree v-else :default-expand-all='true'   node-key="id" :data="treeData" empty-text='无标题' :props="defaultProps" highlight-current ref='selectCriteriaTree' :expand-on-click-node='false' @node-click="handleNodeClick">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <el-tooltip v-if='(node.label.length + parseInt(data.count))>=13'  effect="dark" :content="(node.label+' ('+data.count+')')" placement="right-start">
                                        <span class="nodeText">{{ node.label }}<span style='margin-left:5px;' v-if='!data.leaf'>({{data.count}})</span></span>
                                    </el-tooltip>
                                    <span class="nodeText" v-else>{{ node.label }}<span  style='margin-left:5px;' v-if='!data.leaf'>({{data.count}})</span></span>
                                </span>
                            </el-tree>
                        </el-scrollbar>
                    </el-col>
                    <el-col :span='20'>
                            <el-table  ref='selectCriteriaTab' @selection-change="handleSelectionChange"  stripe :data='tableData' row-key='id'
                                header-row-class-name='tableHeader' border tooltip-effect='dark' style="width:100%" height='100%' class='standardizationTable'>
                                <el-table-column type="selection" width="55" reserve-selection>
                                </el-table-column>
                                <el-table-column type='index' label='序号'>
                                    <template slot-scope='scope'>
                                        {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                                    </template>
                                </el-table-column>
                                <el-table-column label='标准编号' prop='stdCode'></el-table-column>
                                <el-table-column label='标准名称' prop='stdName'></el-table-column>
                                <el-table-column label='有效性' prop='effectivenessName'></el-table-column>
                                <el-table-column label='标准选择状态' prop='selectStatus'></el-table-column>
                                <el-table-column label='操作'  align='center' width='120'>
                                    <template slot-scope='scope'>
                                        <el-button type='text' v-if='scope.row.selectStatus==="未选"' @click='addBatchSignl(scope.row.id)'>协同</el-button>
                                        <el-button type='text' v-if='scope.row.selectStatus==="已选"' @click='deleteSignl(scope.row.id)'>取消</el-button>
                                    </template>
                                </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px;background-color: #fff;">
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
        <div class='dialogBtn'>
            <el-button size="medium" @click="btnOnCancel">返回</el-button>
            <el-button type="primary" size="medium" @click="btnOnSubmit">返回并刷新列表</el-button>
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
    import {cooperateManageCategorySelectList,cooperateManageCategoryTree,cooperateManageDeleteBatch,cooperateManageAddBatch} from '../service/service.js'
    export default {
        name: 'selectCriteriaPage',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        computed: {
            contentTop() {
                return this.isShowSearch ? '120px' : '59px';
            },
            isOpenDialog() {
                return this.$route.params.isOpenDialog=='true';
            }  
        },
        data() {
            return {
                masterId:'',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                treeData: [],
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent: {
                    filterCooperateSelect:'N',
                    stdCode:'',
                    stdName:'',
                    parentId:''
                },
                tableData: [],
                multipleSelection: [],
            }
        },
        created() {
            _self = this;
            this.masterId= this.$route.params.masterId;
        },
        mounted() {
            this.$refs.refLoading.open();
            this.getTree();
            this.requestData('search',false,false);
        },
        methods: {
            deleteBatch(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("请至少选择一条数据。","提示");
                }
                let isReturn = false;
                this.multipleSelection.forEach(item=>{
                    if(item.selectStatus === '未选'){
                        isReturn = true;
                    }
                })
                if(isReturn){
                    return EcoMessageBox.alert("勾选中的数据包含未选数据","提示");
                }
                let doit = function () {
                    var ids = _self.multipleSelection.map(item=>{
                        return item.id;
                    })
                    _self.$refs.refLoading.open();
                    cooperateManageDeleteBatch(ids,_self.masterId).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('取消成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要取消数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            deleteSignl(id){
                let doit = function () {
                    _self.$refs.refLoading.open();
                    cooperateManageDeleteBatch([id],_self.masterId).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('取消成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('你确定要取消数据?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            addBatch(){
                if(this.multipleSelection.length===0){
                    return EcoMessageBox.alert("请至少选择一条数据。","提示");
                }
                let isReturn = false;
                var ids = this.multipleSelection.map(item=>{
                       if(item.selectStatus==="已选"){
                           isReturn = true;
                       }
                        return item.id;
                })
                if(isReturn){
                    return EcoMessageBox.alert("勾选中的数据包含已选数据!。","提示");
                }
                cooperateManageAddBatch(ids,this.masterId).then(res=>{
                    this.$message.success('协同成功!');
                    this.requestData('search',false,true);
                })
            },
            addBatchSignl(id){
                cooperateManageAddBatch([id],this.masterId).then(res=>{
                    this.$message.success('协同成功!');
                    this.requestData('search',false,true);
                })
            },
            searchCase(){
                this.requestData("search",true,true);
            },
            handleNodeClick(data) {
                if(data.children && data.children.length!==0){
                    this.searchContent.parentId = data.id;
                    this.requestData('search',true,true);  
                }
            },
            getTree(){
                cooperateManageCategoryTree().then(res=>{
                     this.treeData = res.data.children || [];
                }).catch(err=>{
                     this.treeData = [];
                }) 
            },
            btnOnCancel() {
                EcoUtil.getSysvm().closeDialog();
            },
            btnOnSubmit() {
                let doObj = {};
                doObj.action = 'selectCriteriaCase';
                doObj.dataObj = this.multipleSelection[0];
                doObj.close = true;
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            restSearContent() {
                this.searchContent = {
                    filterCooperateSelect:'',
                    stdCode:'',
                    stdName:'',
                    parentId:''
                };
                if(this.$refs.selectCriteriaTree.getCurrentNode()){
                    this.$refs.selectCriteriaTree.setCurrentKey();
                }
                this.requestData('search',true,true);
                this.getTree();
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            requestData(type,isFirstP,isClearS) {
                this.$refs.refLoading.open();
                let params = {
                    masterId:this.masterId,
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstP){
                    this.baseInfo.page = 1;
                }
                if(isClearS){
                    this.$refs.selectCriteriaTab.clearSelection();
                }
                params.page = this.baseInfo.page;
                cooperateManageCategorySelectList(params).then(res => {
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
    .selectCriteriaPage {
        position: relative;
        overflow-y: auto;
        height: 96%;
        color: #0f1419;
    }
    .selectCriteriaPage.isOpenDialog{
        /* min-width: 1000px; */
        margin: 0 24px;
        top: 2%;
        height: 96%;
    }
     .dialogBtn {
        position: absolute;
        bottom: 0px;
        text-align: center;
        left: 50%;
        transform: translateX(-50%);
    }

    .selectCriteriaPage .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .selectCriteriaPage .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
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
    .selectCriteriaPage .modelBox {
        height: 100%;
    }

.selectCriteriaPage .modelBox .el-col {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 270px;
}

.selectCriteriaPage .modelBox .el-col:last-child {
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
  right:0px;
}

.selectCriteriaPage .modelBox .splitLine {
  top: 10px;
  left: 0px;
  width:265px;
  background-color: #f5f5f5;
}
.selectCriteriaPage  .splitLine /deep/ .el-tree{
  background-color: #f5f5f5;
  border:1px solid #EBEEF5
}
.selectCriteriaPage .noDataTree {
  text-align: center;
  line-height: 200px;
  color: #909399;
  font-size: 12px;
}
.selectCriteriaPage  .custom-tree-node .nodeText{
  width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.selectCriteriaPage .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.selectCriteriaPage /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.selectCriteriaPage .searchRow {
        padding: 16px 10px 16px 10px;
        background: #fff;
    }

    .selectCriteriaPage .searchRow .el-select,
    .selectCriteriaPage .searchRow .el-input{
        width: 130px;
    }
</style>