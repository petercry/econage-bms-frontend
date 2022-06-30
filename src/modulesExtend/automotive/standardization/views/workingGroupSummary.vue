<template>
    <eco-content top='0px' bottom='0px' type='tool' style='background-color:F5F5F5;'>
        <div class='workingGroupSummary'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow: hidden;'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;'>
                    <el-col :span='5' style='height:30px;line-height:30px;'>
                        <!-- <eco-tool-title title='工作组的汇总'></eco-tool-title> -->
                        <strong>工作组的汇总</strong>
                    </el-col>
                    <el-col :span='19' style="text-align:right;margin-top:2px;">
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='addCase' v-show='btnRoleObj["ext_dongfeng_participate_work_group_standard_participate_work_group_standard_insert"]'>新增</el-button>
                        <el-button type='danger' size='small' @click='deleteCase' v-show='btnRoleObj["ext_dongfeng_participate_work_group_standard_participate_work_group_standard_disable"]'>删除</el-button>
                        <el-button type='primary' size='small' @click='exportCase' v-show='btnRoleObj["ext_dongfeng_participate_work_group_standard_participate_work_group_standard_export"]'>导出</el-button>
                        <el-button type='primary' size='small' @click='importCase' v-show='btnRoleObj["ext_dongfeng_participate_work_group_standard_participate_work_group_standard_import"]'>导入</el-button>
                        <el-upload v-show='false' ref='workingGroupSummaryUpload' :auto-upload='true' :http-request="uploadFile"
                            action="" :before-upload='beforeUpload' :show-file-list='false' accept='.xls,.xlsx'>
                        </el-upload>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isSearchShow' top='59px' height='90px' type='tool' style='border:1px solid #ddd;overflow: hidden;'>
                <el-row style="padding:12px 10px;background:#fff">
                    <el-col :span='24' style='margin-bottom:10px;'>
                        <span class='searchInputLabel' style='margin-left:33px'>工作组联系人:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.workGroupContact'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel' style='margin-left:12px;'>TC号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.tcNum' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>SC号:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.scNum' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>&ensp;类别:</span>
                        <el-select filterable v-model='searchContent.type' style='width:150px;' clearable>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in GbTypeList' :key='item.id'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>参加的工作组名称:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.workGroupName'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>Email:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.workGroupEmail'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>工作组的联系方式:</span>
                        <el-input clearable @keyup.enter.native="requestData('search')" style='width:150px' v-model='searchContent.workGroupPhone'
                            placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <el-button type='primary' style='margin-left:5px;' @click="requestData('search')">查询</el-button>
                        <el-button @click='restSearchContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table border @selection-change="handleSelectionChange" stripe :data='tableData' header-row-class-name='tableHeader'  tooltip-effect='dark'
                    height='100%' class='standardizationTable'>
                    <el-table-column type='selection' width='50' align='center'></el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label='类别' prop='typeName'></el-table-column>
                    <el-table-column label='TC号' prop='tcNum' min-width='140'></el-table-column>
                    <el-table-column label='SC号' prop='scNum' min-width='140'></el-table-column>
                    <el-table-column label='参加的工作组名称' width='160' min-width='140' show-overflow-tooltip prop='workGroupName'></el-table-column>
                    <el-table-column label='工作组联系人' width='160' min-width='140' show-overflow-tooltip prop='workGroupContact'></el-table-column>
                    <el-table-column label='工作组的联系方式' width='160' min-width='140' show-overflow-tooltip prop='workGroupPhone'></el-table-column>
                    <el-table-column label='Email' prop='workGroupEmail' width='180' show-overflow-tooltip></el-table-column>
                    <el-table-column label='操作' fixed='right' width='100'>
                        <template slot-scope='scope'>
                            <el-button type='text' @click='editCase(scope.row)' v-if='btnRoleObj["ext_dongfeng_participate_work_group_standard_participate_work_group_standard_update"]'>修改</el-button>
                            <el-button type='text' @click='viewCase(scope.row)'>查看</el-button>
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
        <table id='exportTable'>
            <tbody id='tableBody'></tbody>
        </table>
    </eco-content>
</template>
<script>
    var _self;
    import ecoContent from '@/components/pageAb/ecoContent.vue'
    import ecoLoading from '@/components/loading/ecoLoading.vue'
    import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
    import { EcoUtil } from '@/components/util/main.js'
    import { EcoMessageBox } from '@/components/messageBox/main.js'
    import { workGroupList, workGroupDeleteSingle,getRoleBtnSetting,participateWorkGroupStandardUpload} from '../service/service.js'
    import { mapState } from 'vuex'
    export default {
        name: 'workingGroupSummary',
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle
        },
        data() {
            return {
                btnRoleObj:{},
                isSearchShow: false,
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                searchContent: {
                    tcNum: '',//高级搜索条件，TC号
                    scNum: '',//高级搜索条件，SC号
                    workGroupName: '',//高级搜索条件，工作组全称
                    workGroupContact: '',//高级搜索条件，工作组联系人
                    workGroupEmail: '', //高级搜索条件，Email
                    workGroupPhone: '',
                    type: ''
                },
                tableData: [],
                multipleSelection: [],
                timer: null
            }
        },
        computed: {
            ...mapState(['GbTypeList']),
            contentTop() {
                return this.isSearchShow ? '150px' : '59px';
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
        methods: {
            beforeUpload(file) {
                var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                const extension = testmsg === "xls";
                const extension2 = testmsg === "xlsx";
                if (!extension && !extension2) {
                this.$message({
                    message: "导入文件只能是.xls,.xlsx格式!",
                    type: "warning"
                });
                }
                return extension || extension2;
            },
            uploadFile(params) {
                this.$refs.refLoading.open();
                var fileObj = params.file;
                var form = new FormData();
                form.append('file',fileObj);//file
                form.append('time', new Date().getTime());
                participateWorkGroupStandardUpload(form).then(res => {
                    this.$message.success('导入成功');
                    this.restSearchContent();
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.$message.error('导入失败');
                    this.$refs.refLoading.close();
                })
            },
            importCase(){
                let doit = function () {
                   _self.$refs.workingGroupSummaryUpload.$refs['upload-inner'].handleClick();//打开自定义选取文件弹窗
                }
                EcoMessageBox.confirm('导入操作会覆盖原先数据,请确定是否要执行?', '提示', { type: 'warning', lockScroll: false }, doit)
            },
            initRole() {
                const btn_array = ['ext_dongfeng_participate_work_group_standard_participate_work_group_standard_insert',
                    'ext_dongfeng_participate_work_group_standard_participate_work_group_standard_update',
                    'ext_dongfeng_participate_work_group_standard_participate_work_group_standard_disable',
                    'ext_dongfeng_participate_work_group_standard_participate_work_group_standard_export',
                    'ext_dongfeng_participate_work_group_standard_participate_work_group_standard_import',
                ];
                getRoleBtnSetting(btn_array).then((res) => {
                    if (res.data) {
                        this.btnRoleObj = res.data.authenticationMap;
                    }
                })
            },
            changeSearchShow() {
                this.isSearchShow = !this.isSearchShow;
            },
            exportCase() {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                };
                for (var key in this.searchContent) {
                    if (this.searchContent[key]) {
                        params[key] = this.searchContent[key];
                    }
                }
                workGroupList(params).then(res => {
                    let i = 0;
                    let tableBody = document.getElementById('tableBody');
                    let htmlStr = `
                    <tr>
                        <td>序号</td>
                        <td>类别</td>
                        <td>TC号</td>
                        <td>SC号</td>
                        <td>参加的工作组名称</td>
                        <td>工作组联系人</td>
                        <td>工作组的联系方式</td>
                        <td>Email</td>
                        <td>参加人姓名</td>、
                        <td>单位</td>
                        <td>部门</td>
                        <td>职务/职称</td>
                        <td>邮箱</td>
                        <td>座机</td>
                        <td>手机</td>
                        <td>备注</td>
                    </tr>
                        `;
                    res.data.rows.forEach((item, index) => {
                        if(item.staffList && item.staffList.length!=0){
                            item.staffList.forEach((item2,index2)=>{
                                i+=1;
                                htmlStr+=`
                                <tr>
                                    <td>${i}</td>
                                    <td>${item.typeName}</td>
                                    <td>${item.tcNum}</td>
                                    <td>${item.scNum}</td>
                                    <td>${item.workGroupName}</td>
                                    <td>${item.workGroupContact}</td>
                                    <td>${item.workGroupPhone}</td>
                                    <td>${item.workGroupEmail}</td>
                                    <td>${item2.employee||''}</td>
                                    <td>${item2.unit||''}</td>
                                    <td>${item2.dept||''}</td>
                                    <td>${item2.position||''}</td>
                                    <td>${item2.email||''}</td>
                                    <td>${item2.telephone||''}</td>
                                    <td>${item2.mobilePhone||''}</td>
                                    <td>${item2.notes||''}</td>
                                </tr>
                                `
                            })
                        }else{
                            i+=1;
                            htmlStr += `
                            <tr>
                               <td>${i}</td>
                               <td>${item.typeName}</td>
                               <td>${item.tcNum}</td>
                               <td>${item.scNum}</td>
                               <td>${item.workGroupName}</td>
                               <td>${item.workGroupContact}</td>
                               <td>${item.workGroupPhone}</td>
                               <td>${item.workGroupEmail}</td>
                            </tr>
                            `
                        }
                    })
                    tableBody.innerHTML = htmlStr;
                    this.$refs.refLoading.close();
                    this.$nextTick(function () {
                        $("#exportTable").table2excel({
                            // exclude: '', //过滤打印类名
                            filename: "工作组的汇总.xls", //文件名称
                            name: "Excel Document Name.xls",
                            exclude_img: true,
                            exclude_links: true,
                            exclude_inputs: true
                        });
                    })
                })
            },
            deleteCase() {
                if (this.multipleSelection.length === 0) {
                    return EcoMessageBox.alert('请先选择要删除的数据', '提示');
                }
                let doit = function () {
                    _self.$refs.refLoading.open();
                    _self.multipleSelection.forEach(item => {
                        workGroupDeleteSingle(item.id).then(res => {
                            if (_self.timer !== null) {
                                clearTimeout(_self.timer);
                                _self.timer = null;
                            }
                            _self.timer = setTimeout(function () {
                                _self.multipleSelection = [];
                                _self.requestData('search');
                                _self.$message.success('删除成功!');
                            }, 350)

                        })
                    })
                }
                EcoMessageBox.confirm('您确定要删除数据?', '提示', { type: 'warning', lockScroll: false }, doit)

            },
            restSearchContent() {
                this.searchContent = {
                    tcNum: '',//高级搜索条件，TC号
                    scNum: '',//高级搜索条件，SC号
                    workGroupName: '',//高级搜索条件，工作组全称
                    workGroupContact: '',//高级搜索条件，工作组联系人
                    workGroupEmail: '', //高级搜索条件，Email
                    workGroupPhone: '',
                    type: ''
                };
                this.requestData("search");
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    if (obj && (obj.action === 'addWorkingGroup')) {
                        //新增刷新
                        _self.$message.success('新增成功！');
                        _self.restSearchContent();
                    } else if (obj.action === 'editWorkingGroup') {
                        //编辑刷新
                        _self.$message.success('编辑成功！');
                        _self.requestData();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'workingGroupSummary');

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            viewCase(row) {
                let _width = '1100';
                let _height = '400';
                let url = '/standardization/index.html#/editWorkingGroup/' + row.id + '/viewCase';
                EcoUtil.getSysvm().openDialog('查看', url, _width, _height, '15vh');
            },
            addCase() {
                let _width = '1100';
                let _height = '600';
                let url = '/standardization/index.html#/editWorkingGroup/' + 0 + '/addCase';
                EcoUtil.getSysvm().openDialog('新增', url, _width, _height, '15vh');
            },
            editCase(row) {
                let _width = '1100';
                let _height = '600';
                let url = '/standardization/index.html#/editWorkingGroup/' + row.id + '/editCase';
                EcoUtil.getSysvm().openDialog('编辑', url, _width, _height, '15vh');
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
                            params[key] = this.searchContent[key];
                        }
                    }
                }
                params.page = this.baseInfo.page;
                workGroupList(params).then(res => {
                    this.$refs.refLoading.close();
                    this.tableData = res.data.rows;
                    this.baseInfo.total = res.data.total;
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
    .workingGroupSummary {
        position: relative;
        height: 96%;
        margin: 0 24px;
        top: 2%;
        overflow-y: auto;
        min-width: 1000px;
        color: #0f1419;
    }

    .workingGroupSummary .plainBtn:first-of-type {
        margin-left: 20px;
    }

    .workingGroupSummary .searchInputLabel {
        font-size: 14px;
        margin-left: 5px;
    }

    .workingGroupSummary .standardizationTable /deep/ .el-table__row.el-table__row--striped td {
        background: #f5f7fa !important;
    }

    .standardizationTable /deep/ .tableHeader th {
        background: #f5f7fa;
        color: #000;
        /* border-bottom-width: 0px; */
        height:50px;
    }

    /* .standardizationTable /deep/ .el-table__row td {
        border-bottom-width: 0px;
    } */
</style>
