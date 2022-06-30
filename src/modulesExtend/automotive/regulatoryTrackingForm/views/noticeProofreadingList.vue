<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:#F5F5F5;'>
        <div class='noticeProofreadingList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <!-- <eco-tool-title title='法规跟踪表编制'></eco-tool-title> -->
                        <strong>法规动态通知书校对</strong>
                    </el-col>
                    <el-col :span='19' style='text-align:right;margin-top:2px;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <!-- <el-button type='primary' size='small' >导出</el-button> -->
                        <el-button type='primary' size='small' @click='openOption(true)' v-show='btnRoleObj["regulation-notification.proofreading_agree"]'>同意</el-button>
                        <el-button type='primary' size='small' @click='openOption(false)' v-show='btnRoleObj["regulation-notification.proofreading_reject"]'>驳回</el-button>
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
                        <span class='searchInputLabel'>办理状态:</span>
                        <el-select filterable v-model='searchContent.approveStatus' style='width:120px;' clearable>
                            <el-option value='PENDING' label='待办'></el-option>
                            <el-option value='DONE' label='已办'></el-option>
                        </el-select>
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
                    <el-table-column prop='notificationCode' label='通知单编号'></el-table-column>
                    <el-table-column prop='code' label='法规编号'></el-table-column>
                    <el-table-column prop='name' label='法规名称'></el-table-column>
                    <el-table-column show-overflow-tooltip width='160' label='法规状态' prop='status' align='center'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'standardStatus')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='预计实施时间' align='center'>
                        <el-table-column show-overflow-tooltip label='新认证车型' prop='implDateNew' align='center'></el-table-column>
                        <el-table-column show-overflow-tooltip label='已认证车型' prop='implDateOld' align='center'></el-table-column>
                    </el-table-column>
                    <el-table-column label='发起人' prop='proofreadingAssigneeName'></el-table-column>
                    <el-table-column label='到达时间' prop='proofreadAssignTime' width='140'></el-table-column>
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
    import { getRoleBtnSetting,regulationNotificationProofreading,regulationtrackFlowProofread } from '../service/service.js'
    export default {
        name: 'noticeProofreadingList',
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
                btnRoleObj:{},
                timer:null,
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
                    name:'',
                    approveStatus:'PENDING'
                },
                tableData: [],
            }
        },
        created() {
            _self = this;
            this.initRole();
            this.callAction();
        },
        mounted() {
            this.requestData('',false);
        },
        methods: {
            initRole() {
                const btn_array = [
                  'regulation-notification.proofreading_agree',
                  'regulation-notification.proofreading_reject'
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj=res.data.authenticationMap;
                    }
                })
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'apprope')) {
                       _self.approveCase(obj.data.content,true);
                    }else if(obj && (obj.action === 'withdraw')){
                        _self.approveCase(obj.data.content,false);
                    }else if(obj && (obj.action === 'onlyApprope')){
                        //单个同意
                        _self.$message.success('同意成功!');
                        _self.restSearContent();
                    }else if(obj && (obj.action === 'onlyWithdraw')){
                        _self.$message.success('驳回成功!');
                        _self.requestData('search',true);
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'noticeProofreadingList');
            },
            approveCase(content,type){
                this.$refs.refLoading.open();
                let params ={
                    id:'',
                    accept:type,
                    opinion:content
                }
                this.multipleSelection.forEach(item=>{
                    params.id = item.id;
                    regulationtrackFlowProofread(params).then(res=>{
                        if(this.timer){
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        this.timer = setTimeout(function(){
                            if(type){
                                _self.$message.success('同意成功!');
                                _self.restSearContent();
                            }else{
                                _self.$message.success('驳回成功!');
                                _self.requestData('search',true);
                            }
                        },450)
                
                    })
                })
                

            },
            openOption(type){
                let title = type?"同意":"驳回"
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert(`当前未选中行,请勾选要${title}的行再进行操作。`, '提示');
                }
                var url = '/regulatoryTrackingForm/index.html#/withdrawPage/' + type;
                EcoUtil.getSysvm().openDialog(title, url, 700, 200, '15vh');
            },
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
                    url += "?fromPage=proofreading";
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
                    name:'',
                    approveStatus:'PENDING'
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
                regulationNotificationProofreading(params).then(res => {
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
    .noticeProofreadingList {
        color: #0f1419;
        min-width: 1000px;
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        color: #0f1419;
    }

    .noticeProofreadingList .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .noticeProofreadingList .searchInputLabel {
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
