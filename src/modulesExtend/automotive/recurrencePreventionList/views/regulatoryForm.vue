<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='finishList'>
            <ecoLoading ref='regulatoryFormLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='24' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='57px' height='160px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                    <el-col>
                        <span class='searchInputLabel'>&emsp;&emsp;状态:</span>
                        <el-select filterable v-model='searchContent.status' style='width:100px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.statusMap' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&ensp;操作类型:</span>
                        <el-select filterable v-model='searchContent.actionType' style='width:100px;' clearable>
                            <el-option :value='key' :label='item' v-for='(item,key) in statusSet.actionTypeMap' :key='key'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&emsp;分类:</span>
                        <el-select filterable v-model='searchContent.category' style='width:100px;' clearable>
                            <el-option v-show='item.enableInCreate' :value='item.id' :label='item.text' v-for='(item,index) in typeList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;子类:</span>
                        <el-select filterable v-model='searchContent.subCategory' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in subClassListGroup' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>&emsp;&emsp;性质:</span>
                        <el-select filterable v-model='searchContent.nature' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in natureList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用整车/零部件:</span>
                        <el-select filterable v-model='searchContent.applicableType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in vehicleList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>认证管理分类:</span>
                        <el-select filterable v-model='searchContent.certificationType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in authenticationList' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.carModel' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in applicableModels' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>法规状态:</span>
                        <el-select filterable v-model='searchContent.standardStatus' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in standardState' :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>&emsp;&emsp;&emsp;&ensp;动力类型:</span>
                        <el-select filterable v-model='searchContent.powerType' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item,index) in powerType' :key='item.id'></el-option>
                        </el-select>
                       <span class='searchInputLabel'>&emsp;&emsp;法规编号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>法规名称:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')" v-model='searchContent.regulationName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span='24' style='margin-top:7px;'> 
                        <span class='searchInputLabel'>&emsp;&emsp;&ensp;NT:</span>
                        <el-date-picker style='width:250px' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchContent.dateRange1"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>TT:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='width:250px' v-model="searchContent.dateRange2"
                            value-format='yyyy-MM-dd' type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='finishListTable' @selection-change="handleSelectionChange"  highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
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
                    <el-table-column label='法规状态' prop='standardStatus' align='center' fixed='right'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.standardStatus,'standardStatus')}}</span>
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
        <div class='btn'>
            <el-button size="medium" @click="onCancel">取消</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
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
    import { finishList} from '../service/service.js'
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
                return this.isShowSearch ? '217px' : '57px';
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
                multipleSelection:[]
            }
        },
        created() {
            _self = this;
        },
        mounted() {
            this.requestData();
        },
        methods: {
            onCancel(){
                 EcoUtil.getSysvm().closeDialog();
            },
            onSubmit(){
                if(this.multipleSelection.length===0 || this.multipleSelection.length>1){
                    this.$message.warning('请选择一条法规编号数据!');
                    return;
                }
                let doObj = {};
                doObj.action = 'selectStandardNumber';
                doObj.data = this.multipleSelection[0];
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
                this.requestData('search');
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
                this.$refs.regulatoryFormLoading.open();
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
                finishList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    // console.log(res);
                    this.tableData = res.data.rows;
                    this.$refs.regulatoryFormLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.regulatoryFormLoading.close();
                })
            }
        }
    }
</script>
<style scoped>
    .finishList {
        color: #0f1419;
        position: relative;
        height: 94%;
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
    .btn{
        position:absolute;
        bottom:0px;
        text-align:center;
        left:50%;
        transform: translateX(-50%);
    }
</style>