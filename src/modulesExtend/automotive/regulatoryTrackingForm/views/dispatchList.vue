<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='dispatchList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='法规跟踪表编制'></eco-tool-title> -->
                        <strong>法规跟踪表发放</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='dispatchCase("1")' v-show='btnRoleObj["dongfeng.thinktank.regulationtrack.dispatch_dispatch"]'>发放</el-button>
                        <el-button type='primary' size='small' @click='dispatchCase("2")' v-show='btnRoleObj["dongfeng.thinktank.regulationtrack.dispatch_dispatch"]'>不发放</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                    <el-col>
                        <!-- <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:120px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.statusMap' :key='key'></el-option>
                        </el-select> -->
                        <span class='searchInputLabel'>&emsp;&emsp;操作类型:</span>
                        <el-select filterable v-model='searchContent.actionType' style='width:120px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.actionTypeMap' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;分类:</span>
                        <el-select filterable v-model='searchContent.category' style='width:150px;' clearable>
                            <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in typeList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;子类:</span>
                        <el-select filterable v-model='searchContent.subCategory' style='width:120px;' clearable>
                            <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in subClassListGroup' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>&emsp;&emsp;法规状态:</span>
                        <el-select filterable v-model='searchContent.standardStatus' style='width:120px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>法规名称:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&emsp;&emsp;性质:</span>
                        <el-select filterable v-model='searchContent.nature' style='width:120px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用整车/零部件:</span>
                        <el-select filterable v-model='searchContent.applicableType' style='width:120px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in vehicleList' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>认证管理分类:</span>
                        <el-select filterable v-model='searchContent.certificationType' style='width:120px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in authenticationList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.carModel' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in applicableModels' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>动力类型:</span>
                        <el-select filterable v-model='searchContent.powerType' style='width:120px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in powerType' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>法规编号:</span>
                        <el-input clearable style='width:170px' @keyup.enter.native="requestData('search',true)" v-model='searchContent.regulationCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col style='margin-top:7px;'>
                        <span class='searchInputLabel'>NT:</span>
                        <el-date-picker style='width:220px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>TT:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='width:220px' v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='dispatchListTable' @selection-change="handleSelectionChange" highlight-current-row stripe :data='tableData'
                    header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='状态' prop='status' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'status')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作类型' prop='actionType' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.actionType,'actionType')}}</span>
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
                        <el-table-column show-overflow-tooltip label='NT' prop='implTimeNt' align='center'></el-table-column>
                        <el-table-column show-overflow-tooltip label='TT' prop='implTimeTt' align='center'></el-table-column>
                    </el-table-column>
                    <el-table-column label='法规状态' prop='standardStatus' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.standardStatus,'standardStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='发起人' prop='createUserName'></el-table-column>
                    <el-table-column label='操作' fixed='right' align='center' width='100'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row)'>查看</el-button>
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
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { mapState } from 'vuex'
    import { dispatchList, regulationtrackFinish,getRoleBtnSetting } from '../service/service.js'
    export default {
        name: 'dispatchList',
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
                    dateRange2: []
                },
                tableData: [],
                multipleSelection: [],
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
            let requestTimer=setInterval(() => {
                if(JSON.stringify(this.subClassList)!=='{}'){
                    this.requestData('',false);
                    clearInterval(requestTimer);
                }
            }, 200);
        },
        methods: {
            initRole() {
                const btn_array = [
                    'dongfeng.thinktank.regulationtrack.dispatch_dispatch',
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
                    dateRange2: []
                };
                this.requestData('search',true);
            },
            dispatchCase(type) {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('当前未选中行,请勾选要发布的行再进行操作。', '提示');
                }
                if (this.multipleSelection.length > 1) {
                    return EcoMessageBox.alert('此操作不能批量处理,请选择一条数据。', '提示');
                }
                var id = this.multipleSelection[0].id;
                if (type === '1') {
                    //发放
                    var url = '/regulatoryTrackingForm/index.html#/dispatchEdit/' + id + '/editCase';
                    EcoUtil.getSysvm().openDialog('', url, 1200, 600, '15vh');
                } else {
                    this.$refs.refLoading.open();
                    regulationtrackFinish(id).then(res => {
                        this.multipleSelection = [];
                        this.$message.success('操作成功!');
                        this.restSearContent();
                    }).catch(err => {
                        this.$refs.refLoading.close();
                    })
                }
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    //发放
                    if (obj && (obj.action === 'dispatch')) {
                        _self.multipleSelection = [];
                        _self.$message.success('发放成功!');
                        _self.restSearContent();
                    }else if(obj && (obj.action === 'editCase')){
                        _self.$message.success('修改成功!');
                        _self.requestData('search',false)
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'dispatchList');
            },
            editCase(row) {
                let _width = '1000';
                let _height = '500';
                let url = '/regulatoryTrackingForm/index.html#/editPage/' + row.id + '/viewCase/dispatchList';
                let dialogTitle = '查看';
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',false)
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false);
            },
            requestData(type,isFirstPage) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows
                };
                if (type === 'search') {
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
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                dispatchList(params).then(res => {
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
    .dispatchList {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .dispatchList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .dispatchList .searchInputLabel {
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
</style>