<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='finishList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='法规跟踪表编制'></eco-tool-title> -->
                        <strong>标准法规数据库({{baseInfo.total}})</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' v-show='btnRoleObj["dongfeng.thinktank.regulationtrack.search_modify"]&&isVALID' @click='editCase({},"editCase")'>修改</el-button>
                        <el-button type='danger' size='small' v-show='btnRoleObj["dongfeng.thinktank.regulationtrack.search_delete"]&&isVALID'   @click='deleteCase'>删除</el-button>
                        <el-button type='primary' size='small' v-show='btnRoleObj["dongfeng.thinktank.regulationtrack.search_download"]'  @click='exportCase'>导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                    <el-col>
                        <!-- <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:120px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.statusMap' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>操作类型:</span>
                        <el-select filterable v-model='searchContent.actionType' style='width:150px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.actionTypeMap' :key='key'></el-option>
                        </el-select> -->
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;分类:</span>
                        <el-select filterable v-model='searchContent.category' style='width:140px;' clearable>
                            <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in typeList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;子类:</span>
                        <el-select filterable v-model='searchContent.subCategory' style='width:150px;' clearable>
                            <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in subClassListGroup' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;性质:</span>
                        <el-select filterable v-model='searchContent.nature' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>状态:</span>
                        <el-select filterable v-model='searchContent.validStatus' style='width:150px;'>
                            <el-option value='VALID' label='有效'></el-option>
                            <el-option value='INVALID' label='失效'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>&emsp;&emsp;法规状态:</span>
                        <el-select filterable v-model='searchContent.standardStatus' style='width:140px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>法规名称:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&ensp;动力类型:</span>
                        <el-select filterable v-model='searchContent.powerType' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in powerType' :key='item.id'></el-option>
                        </el-select>    
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>认证管理分类:</span>
                        <el-select filterable v-model='searchContent.certificationType' style='width:140px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in authenticationList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.carModel' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in applicableModels' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用整车/零部件:</span>
                        <el-select filterable v-model='searchContent.applicableType' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in vehicleList' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col  style='margin-top:7px;'>
                        <span class='searchInputLabel'>法规编号:</span>
                        <el-input clearable style='width:170px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>NT:</span>
                        <el-date-picker style='width:220px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>TT:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='width:220px' v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
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
                            <el-tree v-else :default-expand-all='true'   node-key="id" :data="treeData" empty-text='无标题' :props="defaultProps" @node-click="handleNodeClick" highlight-current ref='finishTree'>
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
                        <el-table ref='finishListTable' @selection-change="handleSelectionChange"  highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader'
                            border tooltip-effect='dark' height='100%' class='standardizationTable'>
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column type='index' label='序号'>
                                <template slot-scope='scope'>
                                    {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column show-overflow-tooltip width='160' label='状态' prop='status' align='center'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.status,'status')}}</span>
                                </template>
                            </el-table-column> -->
                            <!-- <el-table-column label='操作类型' prop='actionType' align='center'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.actionType,'actionType')}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column show-overflow-tooltip width='160' label='法规编号' prop='regulationCode' align='center'></el-table-column>
                            <el-table-column show-overflow-tooltip width='200' label='法规名称' prop='regulationName' align='center'></el-table-column>
                            <!-- <el-table-column label='分类' prop='category' min-width='150' align='center'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.category,'category')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='子类' prop='subCategory' min-width='150' align='center'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.subCategory,'subCategory')}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column label='实施时间' align='center'>
                                <el-table-column show-overflow-tooltip label='NT' prop='implTimeNt' align='center'></el-table-column>
                                <el-table-column show-overflow-tooltip label='TT' prop='implTimeTt' align='center'></el-table-column>
                            </el-table-column>
                            <el-table-column label='法规状态' prop='standardStatus' align='center'>
                                <template slot-scope='scope'>
                                    <span>{{restData(scope.row.standardStatus,'standardStatus')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='发起人' prop='createUserName'></el-table-column>
                            <el-table-column label='完成时间' prop='approveCompleteTime' width='160'></el-table-column>
                            <el-table-column label='操作' fixed='right' align='center' width='150'>
                                <template slot-scope='scope'>
                                    <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
                                    <el-button type='text' @click.stop='openHistory(scope.row.id)'>历史版本</el-button>
                                    <el-button type='text' @click.stop='openFlowList(scope.row.id,"flowList")'>流程历史</el-button>
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
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { mapState } from 'vuex'
    import { finishCategoryTree,finishList, regulationtrackApprove, applyDiscard,getRoleBtnSetting,regulationtrackExport} from '../service/service.js'
    export default {
        name: 'finishList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        computed: {
            ...mapState(['typeList', 'subClassList', 'natureList', 'vehicleList', 'authenticationList', 'applicableModels', 'powerType', 'standardState', 'statusSet']),
            contentTop() {
                return this.isShowSearch ? '220px' : '59px';
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
                isVALID:true,
                expandedKeys:[],
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
                    dateRange2: [],
                    validStatus:'VALID'
                },
                tableData: [],
                multipleSelection:[],
                btnRoleObj:{}
            }
        },
        created() {
            _self = this;
            this.initRole();
            this.callAction();//监听窗口的回调函数
        },
        mounted() {
            this.$refs.refLoading.open();
            this.getTree();
            let requestTimer=setInterval(() => {
                if(JSON.stringify(this.subClassList)!=='{}'){
                    this.requestData();
                    if(this.$route.query.targetURL){
                        this.editCase({id:this.$route.query.targetURL},'viewCase');
                    }
                    clearInterval(requestTimer);
                }
            }, 200);
        },
        methods: {
            searchCase(){
                this.requestData("search");
                this.getTree();
            },
            openFlowList(id,type){
                let url = '/regulatoryTrackingForm/index.html#/flowHistory/'+id+'/'+type;
                EcoUtil.getSysvm().openDialog('流程历史',url,'1000','700');
            },
            handleNodeClick(data) {
                if(data.leaf){
                    this.searchContent.regulationCode = data.name;
                    this.requestData('search');  
                }
            },
            getTree(){
                if(this.searchContent.validStatus){
                    finishCategoryTree(this.searchContent.validStatus).then(res=>{
                        this.treeData = res.data.children || [];
                    }).catch(err=>{
                        this.treeData = [];
                    }) 
                }
            },
            exportCase(){
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                };
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
                regulationtrackExport(params).then(res => {
                    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                        navigator.msSaveBlob(new Blob([res.data],'法规跟踪表.xlsx'));
                        this.$refs.refLoading.close();
                    }else{
                        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }); 
                        let url = window.URL.createObjectURL(blob);  
                        let a = document.createElement("a");
                        a.href = url;
                        a.download = '法规跟踪表.xlsx';
                        this.$refs.refLoading.close();
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }
                }).catch(err => {
                    this.$refs.refLoading.close();
                })
            },
            initRole() {
                const btn_array = [
                    'dongfeng.thinktank.regulationtrack.search_modify',
                    'dongfeng.thinktank.regulationtrack.search_delete',
                    'dongfeng.thinktank.regulationtrack.search_download'
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj=res.data.authenticationMap;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            editCase(row, type) {
                if (!row.id && this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要修改的行再进行操作。', '提示');
                }
                if (!row.id && this.multipleSelection.length > 1) {
                    return EcoMessageBox.alert('修改操作不能批量处理,请选择一条数据。', '提示');
                }

                let _width = '1000';
                let _height = '500';
                let url = '/regulatoryTrackingForm/index.html#/editPage/' + (row.id||this.multipleSelection[0].id) + '/' + type + '/finishList';
                let dialogTitle = '查看';
                if (type === 'viewCase') {
                    dialogTitle = '查看'
                } else if (type === 'editCase') {
                    dialogTitle = '修改'
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
            },
            openHistory(id){
                //打开历史列表
                let url = '/regulatoryTrackingForm/index.html#/historyList/'+id;
                EcoUtil.getSysvm().openDialog('历史版本',url,'1000','700');
            },
            deleteCase() {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要删除的行再进行操作。', '提示');
                }
                if(this.multipleSelection.length>1){
                    return EcoMessageBox.alert('删除操作不能批量处理,请选择一条数据。', '提示');
                }
                let doit = function () {
                    var id = _self.multipleSelection[0].id;
                    _self.$refs.refLoading.open();
                    applyDiscard(id).then(res => {
                        _self.multipleSelection=[];
                        _self.$message.success('申请删除成功!');
                        _self.restSearContent();
                    }).catch(err => {
                        _self.$refs.refLoading.close();
                    })
                }
                EcoMessageBox.confirm('删除申请会在"法规跟踪表编制"界面的列表中生成一条记录！', '提示', { type: 'warning', lockScroll: false }, doit)
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
                    dateRange2: [],
                    validStatus:'VALID'
                };
                if(this.$refs.finishTree.getCurrentNode()){
                    this.$refs.finishTree.setCurrentKey();
                }
                this.requestData('search');
                this.getTree();
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    //申请修改
                    if (obj && (obj.action === 'edit')) {
                        _self.multipleSelection=[];
                        _self.$message.success('申请修改成功!');
                        _self.requestData('search');
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'finishList');
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
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
                    this.baseInfo.page = 1;
                    for (var key in this.searchContent) {
                        if(key==='validStatus'){
                             this.isVALID = this.searchContent[key] === 'VALID';
                        }
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
                finishList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    // console.log(res);
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
    .finishList {
        color: #0f1419;
        /* min-width: 1000px; */
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .finishList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .finishList .searchInputLabel {
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
    .standardizationTable  /deep/ .el-table__row td,
    .standardizationTable  /deep/  .tableHeader th {
        border:0px;
    } */
.finishList .modelBox {
  height: 100%;
}

.finishList .modelBox .el-col {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 270px;
}

.finishList .modelBox .el-col:last-child {
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
}

.finishList .modelBox .splitLine {
  top: 10px;
  left: 0px;
  width:265px;
  background-color: #f5f5f5;
}
.finishList  .splitLine /deep/ .el-tree{
  background-color: #f5f5f5;
  border:1px solid #EBEEF5
}
.finishList .noDataTree {
  text-align: center;
  line-height: 200px;
  color: #909399;
  font-size: 12px;
}
.finishList  .custom-tree-node .nodeText{
  width:100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.finishList .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.finishList /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>