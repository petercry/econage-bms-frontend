<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='structuredApproveList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>法规结构化数据库审批</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='appropeCase' v-show='btnRoleObj["dongfeng.thinktank.structurebase.approving_agree"]'>同意</el-button>
                        <el-button type='primary' size='small' @click='withdrawCase' v-show='btnRoleObj["dongfeng.thinktank.structurebase.approving_reject"]'>驳回</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                    <el-col>
                        <span class='searchInputLabel'>办理状态:</span>
                        <el-select filterable v-model='searchContent.approveStatus' style='width:100px;' clearable>
                            <el-option value='PENDING' label='待办'></el-option>
                            <el-option value='DONE' label='已办'></el-option>
                        </el-select>
                        <!-- <span class='searchInputLabel'>状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:100px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.statusMap' :key='key'></el-option>
                        </el-select> -->
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&ensp;操作类型:</span>
                        <el-select filterable v-model='searchContent.actionType' style='width:100px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.actionTypeMap' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;分类:</span>
                        <el-select filterable v-model='searchContent.category' style='width:100px;' clearable>
                            <el-option :value='item.id' v-show='item.enableInCreate' :label='item.text' v-for='(item) in typeList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;子类:</span>
                        <el-select filterable v-model='searchContent.subCategory' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in subClassListGroup' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>法规状态:</span>
                        <el-select filterable v-model='searchContent.standardStatus' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in standardState' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>&emsp;&emsp;性质:</span>
                        <el-select filterable v-model='searchContent.nature' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in natureList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用整车/零部件:</span>
                        <el-select  filterable v-model='searchContent.applicableType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in vehicleList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>认证管理分类:</span>
                        <el-select filterable v-model='searchContent.certificationType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in authenticationList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.carModel' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>动力类型:</span>
                        <el-select filterable v-model='searchContent.powerType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in powerType' :key='item.id'></el-option>
                        </el-select> 
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>&ensp;NT:</span>
                        <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>TT:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='width:250px' v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>法规名称:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>法规编号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='structuredApproveTable' @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号' align='center'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='状态' prop='status' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'status')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='法规编号' prop='regulationCode' align='center'></el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='法规名称' prop='regulationName' align='center'></el-table-column>
                    <el-table-column label='分类' prop='category' min-width='150' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.category,'category')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='子类' prop='subCategory' min-width='150' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.subCategory,'subCategory')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='实施时间' align='center'>
                        <el-table-column show-overflow-tooltip label='NT' prop='implTimeNt' align='center' width='110'></el-table-column>
                        <el-table-column show-overflow-tooltip label='TT' prop='implTimeTt' align='center' width='110'></el-table-column>
                    </el-table-column>
                    <el-table-column label='法规状态' prop='standardStatus' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.standardStatus,'standardStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='发起人' prop='createUserName'></el-table-column>
                    <el-table-column label='到达时间' prop='approveUserAssignTime' width='150'></el-table-column>
                    <el-table-column label='操作类型' prop='actionType' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.actionType,'actionType')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作' fixed='right' align='center' width='120'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
                            <el-button type='text' @click.stop='openHistory(scope.row.id)'>历史版本</el-button>
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
        <el-drawer custom-class='oranizationDrawer' :wrapperClosable='false' :destroy-on-close='true' size='1100px' :modal='false' :append-to-body='true'
            :visible.sync="isShowDrawer" :with-header="true">
            <div slot='title' class='drawerHeader'>
                <span>{{drawerTitle}}</span>
                <div class='planBox'>
                    <span class='plan-item' @click='changePlanActive(0)' :class='{active:activeIndex==0}'>标准信息</span>
                    <span class='plan-item' @click='changePlanActive(1)' :class='{active:activeIndex==1}'>条文信息</span>
                </div>
                <el-button class='approveBtn' @click='approveCase(true)' type="primary" size="mini"  v-show='btnRoleObj["dongfeng.thinktank.structurebase.approving_agree"] && caseType==="viewCase" && (activeIndex==0) && approveStatus==="PENDING"'>同意</el-button>
                <el-button class='withdrawBtn' @click='approveCase(false)' type="primary" size="mini"  v-show='btnRoleObj["dongfeng.thinktank.structurebase.approving_reject"] && caseType==="viewCase" && (activeIndex==0) && approveStatus==="PENDING"'>驳回</el-button>
            </div> 
            <editPage ref='editPage' v-show='activeIndex==0' :caseType='caseType' :id='id' fromPage='approveList' @callActionDraw='callActionDraw'></editPage>
            <articleList v-show='activeIndex==1' :id='id' :caseType='caseType' fromPage='approveList'></articleList>
        </el-drawer>
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
    import { structurebaseWithdraw,structurebaseApprovalList, structurebaseApprove, getRoleBtnSetting } from '../service/service.js'
    import editPage from './edit.vue'
    import articleList from './articleList.vue'
    export default {
        name: 'structuredApproveList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            editPage,
            articleList
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
                timer:null,
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent: {
                    // status: '',
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
                    approveStatus:'PENDING'
                },
                tableData: [],
                multipleSelection: [],
                btnRoleObj: {},

                isShowDrawer: false,
                drawerTitle: '',
                activeIndex: 0,
                id: 0,
                caseType: '',
                approveStatus:''
            }
        },
        created() {
            _self = this;
            this.initRole();
            this.callAction();//监听窗口的回调函数
        },
        mounted() {
            this.$refs.refLoading.open();
            let requestTimer=setInterval(() => {
                if(JSON.stringify(this.subClassList)!=='{}'){
                    this.requestData();
                    clearInterval(requestTimer);
                }
            }, 200);
        },
        methods: {
            openHistory(id){
                //打开历史列表
                let url = '/regulationStructured/index.html#/historyList/'+id;
                EcoUtil.getSysvm().openDialog('历史版本',url,'1000','700');
            },
            approveCase(type){
                this.$refs.editPage.appropeCase(type);
            },
            changePlanActive(active) {
                if (this.activeIndex == active) {
                    return;
                }
                this.activeIndex = active;
            },
            initRole() {
                const btn_array = [
                    "dongfeng.thinktank.structurebase.approving_agree",
                    "dongfeng.thinktank.structurebase.approving_reject"
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
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
                    // status: '',
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
                    approveStatus:'PENDING'
                };
                this.requestData('search');
            },
            appropeCase() {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要同意的行再进行操作。', '提示');
                }
                // if (this.multipleSelection.length > 1) {
                //     return EcoMessageBox.alert('发布操作不能批量处理,请选中一条数据', '提示');
                // }
                var url = '/regulationStructured/index.html#/withdrawPage/' + true;
                EcoUtil.getSysvm().openDialog('同意', url, 700, 200, '15vh');
            },
            doAppropeCase(content){
                // var id = this.multipleSelection[0].id;
                this.$refs.refLoading.open();
                this.multipleSelection.forEach(item=>{
                    structurebaseApprove(item.id,content).then(res => {
                        if(this.timer){
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        this.timer =setTimeout(function(){
                            _self.multipleSelection = [];
                            _self.$message.success('同意成功!');
                            _self.restSearContent();
                        },450)
                    })
                    // .catch(err => {
                    //     this.$refs.refLoading.close();
                    // })
                })
            },
            doWithdraw(content){
                this.$refs.refLoading.open();
                this.multipleSelection.forEach(item=>{
                    structurebaseWithdraw({
                        id: item.id,
                        content: content
                    }).then(res => {
                        if(this.timer){
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        this.timer =setTimeout(function(){
                            _self.$message.success('驳回成功!');
                            _self.multipleSelection = [];
                            _self.requestData('search');
                        },450)
                    })
                })
            },
            withdrawCase() {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要驳回的行再进行操作。', '提示');
                }
                // if (this.multipleSelection.length > 1) {
                //     return EcoMessageBox.alert('驳回操作不能批量处理,请选中一条数据', '提示');
                // }
                var url = '/regulationStructured/index.html#/withdrawPage/' + false;
                EcoUtil.getSysvm().openDialog('驳回', url, 700, 200, '15vh');
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    //驳回
                    if (obj && (obj.action === 'withdraw')) {
                         _self.doWithdraw(obj.data.content);
                    }else if(obj && (obj.action === 'apprope')){
                        //批量同意
                        _self.doAppropeCase(obj.data.content);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'structuredApproveList');
            },
            callActionDraw(obj){
                this.isShowDrawer = false;
                if (obj && (obj.action === 'onlyWithdraw')) {
                    //单个驳回
                    _self.$message.success('驳回成功!');
                    _self.requestData('search');
                }else if(obj && (obj.action === 'onlyApprove')){
                    _self.$message.success('同意成功!');
                    _self.restSearContent();
                }
            },
            editCase(row,type) {
                this.approveStatus = row.approveStatus;
                this.caseType = type;
                this.drawerTitle = '查看';
                this.activeIndex = 0;
                this.id = row.id;
                this.isShowDrawer = true;
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
                structurebaseApprovalList(params).then(res => {
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
    .structuredApproveList {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .structuredApproveList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .structuredApproveList .searchInputLabel {
        font-size: 14px;
        margin-left: 8px;
    }

    /* .standardizationTable /deep/ .el-table__row td,
    .standardizationTable /deep/ .tableHeader th {
        border-width: 0px !important;
    } */

    .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        /* border: 0px; */
    }

    /* .standardizationTable /deep/ .el-table__row td {
        border: 0px;
    } */
    .oranizationDrawer .approveBtn,
    .oranizationDrawer .withdrawBtn{
        position: absolute;
        right: 90px;
        background: rgb(75, 150, 238);
        top: 50%;
        transform: translateY(-50%);
        border:1px solid;
    }
    .oranizationDrawer .withdrawBtn{
        right: 20px;
    }
</style>