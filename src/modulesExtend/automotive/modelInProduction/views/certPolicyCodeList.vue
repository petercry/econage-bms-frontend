<template>
    <eco-content top='0px' bottom='0px' type='tool'>
        <div class='certPolicyCodeList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>具体车型应对状态</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class="searchRow">
                    <el-col :span='24' style='margin-top:7px;'>
                        <span class='searchInputLabel'>检验项目:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
                            v-model='searchContent.testProject' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&emsp;车型号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
                            v-model='searchContent.carModel' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>项目代号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search')"
                            v-model='searchContent.projectCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>车型名称:</span>
                        <el-select filterable v-model='searchContent.modelName' style='width:100px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in modelNameList'
                                :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>适用车型:</span>
                        <el-select filterable v-model='searchContent.modeltype' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in applicableModels'
                                :key='item.id'></el-option>
                        </el-select>
                        <span class='searchInputLabel'>动力类型:</span>
                        <el-select filterable v-model='searchContent.powertype' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in powerType' :key='item.id'>
                            </el-option>
                        </el-select>
                        <el-button @click='requestData("search")' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='finishListTable' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'
                    class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column label='检验项目' prop='testProject'></el-table-column>
                    <el-table-column label='车型号' prop='carModel'></el-table-column>
                    <el-table-column label='项目代号' prop='projectCode'></el-table-column>
                    <el-table-column label='车型名称' prop='modelName'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.modelName,'modelName')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='适用车型' prop='modelList'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.modelList,'modelList')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='能源类别' prop='powerList'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.powerList,'powerList')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='检验依据' align='center'>
                        <el-table-column align='center' label='当前依据' prop='testAccording'></el-table-column>
                        <el-table-column align='center' label='最新依据' prop='newestbasis'></el-table-column>
                    </el-table-column>
                    <el-table-column label='认证整改情况' align='center'>
                        <el-table-column align='center' label='公告批次' prop='announcementBatch'></el-table-column>
                        <el-table-column align='center' width='150px' label='3C证书编号(版本号)' prop='cccCertCode'>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="baseInfo.page" :page-sizes="[30,50,100]" :page-size="baseInfo.rows"
                            layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total"
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
    import { certPolicyCodeList } from '../service/service.js'
    export default {
        name: 'certPolicyCodeList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
        },
        computed: {
            ...mapState(['applicableModels', 'powerType','modelNameList']),
            contentTop() {
                return this.isShowSearch ? '150px' : '59px';
            },
            id() {
                return decodeURIComponent(this.$route.params.id);
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
                    testProject:'',
                    carModel:'',
                    projectCode:'',
                    modelName:'',
                    modeltype: '',
                    powertype: ''
                },
                tableData: [],
                multipleSelection: [],
            }
        },
        created() {
            _self = this;
        },
        mounted() {
            this.requestData();
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            restSearContent() {
                this.searchContent = {
                    testProject:'',
                    carModel:'',
                    projectCode:'',
                    modelName:'',
                    modeltype: '',
                    powertype: ''
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
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    regulationCode: this.id
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
                certPolicyCodeList(params).then(res => {
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
    .certPolicyCodeList {
        color: #0f1419;
        /* min-width: 1200px; */
        position: relative;
        height: 94%;
        /* margin: 0 24px; */
        /* top: 2%; */
        overflow-y: auto;
        color: #0f1419;
    }

    .certPolicyCodeList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .certPolicyCodeList .searchInputLabel {
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
    .searchRow{
        padding:8px 10px 10px 10px;
        background:#fff
    }
    .searchRow .el-col+.el-col{
        margin-top:7px;
    }
</style>