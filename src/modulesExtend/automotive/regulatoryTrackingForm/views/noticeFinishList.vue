<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='noticeFinishList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='法规跟踪表编制'></eco-tool-title> -->
                        <strong>法规动态通知书查询</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='60px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:15px 10px 16px 10px;background:#fff">
                    <el-col>
                        <span class='searchInputLabel'>通知单编号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true)" v-model='searchContent.notificationCode'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>编号:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true)" v-model='searchContent.code'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>名称:</span>
                        <el-input clearable style='width:150px' @keyup.enter.native="requestData('search',true)" v-model='searchContent.name'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button @click='requestData("search",true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='noticeListTable' @selection-change="handleSelectionChange"  @current-change="handleRowClickChange" highlight-current-row stripe :data='tableData' header-row-class-name='tableHeader'
                    border tooltip-effect='dark' height='100%' class='standardizationTable'>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='notificationCode' label='通知单编号' min-width='120'></el-table-column>
                    <el-table-column prop='code' label='法规编号' width='120'></el-table-column>
                    <el-table-column prop='name' label='法规名称'></el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='法规状态' prop='status' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'standardStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='预计实施时间' align='center'>
                        <el-table-column show-overflow-tooltip label='新认证车型'  min-width='160' prop='implDateNew' align='center'></el-table-column>
                        <el-table-column show-overflow-tooltip label='已认证车型'  min-width='160' prop='implDateOld' align='center'></el-table-column>
                    </el-table-column>
                    <el-table-column label='解读材料版本' prop='explainVersion'></el-table-column>
                    <el-table-column label='发起人' prop='createUserName'></el-table-column>
                    <el-table-column label='发布时间' prop='approveCompleteTime' width='140'></el-table-column>
                    <el-table-column label='操作' fixed='right' align='center' width='100'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click.stop='editCase(scope.row,"viewCase")'>查看</el-button>
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
    import { regulationNotificationComplete } from '../service/service.js'
    export default {
        name: 'noticeFinishList',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        computed: {
            contentTop() {
                return this.isShowSearch ? '120px' : '59px';
            }
        },
        data() {
            return {
                multipleSelection:[],
                isShowSearch: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent: {
                    notificationCode:'',
                    code:'',
                    name:''
                },
                tableData: [],
            }
        },
        created() {
            _self = this;
        },
        mounted() {
            this.requestData('',false);
            if(this.$route.query.targetURL){
                this.editCase({id:this.$route.query.targetURL},'viewCase');
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            editCase(row, type) {
                let _width = '1000';
                let _height = '500';
                let url = '/regulatoryTrackingForm/index.html#/dispatchEdit/' + row.id + '/' + type;
                let dialogTitle = '查看';
                if (type === 'viewCase') {
                    dialogTitle = '查看';
                    url += "?fromPage=finish";
                } else if (type === 'editCase') {
                    dialogTitle = '修改'
                }
                EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            restSearContent() {
                this.searchContent = {
                    notificationCode:'',
                    code:'',
                    name:''
                };
                this.requestData('search',true);
            },
            handleRowClickChange(newRow) {
                this.currentRow = newRow;
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
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                params.page = this.baseInfo.page;
                regulationNotificationComplete(params).then(res => {
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
    .noticeFinishList {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .noticeFinishList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .noticeFinishList .searchInputLabel {
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
</style>
