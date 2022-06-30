<template>
    <eco-content top='0px' bottom='0px' style='background-color:#F5F5F5;'>
        <div class='checkList'>
            <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
            <eco-content top='0px' height='60px' type='tool' style='overflow:hidden'>
                <el-row style='padding: 14px;background:#fff;border: 1px solid #ddd;border-top-width:0px;'>
                    <el-col :span='5' style='height:30px;line-height: 30px;'>
                        <strong>法规清单</strong>
                    </el-col>
                    <el-col :span='19' style='text-align: right;'>
                        <el-button type='primary' size='small' @click='changeSearchShow'>高级查询</el-button>
                        <el-button type='primary' size='small' @click='initCase' v-show='initRole.PAGE_CC_TASK_LIST.permission.INIT_TASK_LIST'>生成清单</el-button>
                        <el-button type='primary' size='small' @click='editCase({},"editCase")' v-show='initRole.PAGE_CC_TASK_LIST.permission.HANDLE'>批量办理</el-button>
                        <el-button type='primary' size='small' @click='commitCase' v-show='initRole.PAGE_CC_TASK_LIST.permission.PUBLISH'>提交</el-button>
                        <el-button type='primary' size='small' @click='exportCase' v-show='initRole.PAGE_CC_TASK_LIST.permission.EXPORT'>导出</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content v-show='isShowSearch' top='59px' height='90px' type='tool'
                style='border:1px solid #ddd;overflow: hidden;'>
                <el-row class='searchRow'>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>状态:</span>
                        <el-select filterable v-model='searchContent.status' clearable>
                            <el-option v-for='(item,key) in statusList' :value='key' :label='item' :key='key'>
                            </el-option>
                        </el-select>
                        <span class='searchInputLabel'>标准法规号:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)"
                            v-model='searchContent.regulationCode' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                        <span class='searchInputLabel'>标准法规名称:</span>
                        <el-input clearable  @keyup.enter.native="requestData('search',true,true)"
                            v-model='searchContent.regulationName' placeholder='请输入'>
                            <i class='el-icon-search el-input__icon' slot='suffix'></i>
                        </el-input>
                    </el-col>
                    <el-col :span='24'>
                        <span class='searchInputLabel'>计划开始日期:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            v-model="searchContent.dateRange1" value-format='yyyy-MM-dd'
                            type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>计划完成日期:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            v-model="searchContent.dateRange2" value-format='yyyy-MM-dd'
                            type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <span class='searchInputLabel'>实际完成日期:</span>
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            v-model="searchContent.dateRange3" value-format='yyyy-MM-dd'
                            type="daterange" placeholder="选择日期">
                        </el-date-picker>
                        <el-button @click='requestData("search",true,true)' type='primary' style='margin-left:5px;'>查询</el-button>
                        <el-button @click='restSearContent'>重置</el-button>
                    </el-col>
                </el-row>
            </eco-content>
            <eco-content :top='contentTop' bottom='42px' style='padding:10px 15px;border:1px solid #ddd;'>
                <el-table ref='checkListTable' @selection-change="handleSelectionChange" highlight-current-row stripe
                    :data='tableData' header-row-class-name='tableHeader' border tooltip-effect='dark' height='100%'
                    class='standardizationTable' row-key='id'>
                    <el-table-column type="selection" width="55" reserve-selection>
                    </el-table-column>
                    <el-table-column type='index' label='序号'>
                        <template slot-scope='scope'>
                            {{scope.$index+(baseInfo.page-1)*baseInfo.rows+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop='status' label='状态'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.status,'status')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulatoryCompliance' label='符合性'>
                        <template slot-scope='scope'>
                            <span>{{restData(scope.row.regulatoryCompliance,'regulatoryCompliance')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='planStartDate' label='计划开始日期'></el-table-column>
                    <el-table-column prop='planCompleteDate' label='计划完成日期'></el-table-column>
                    <el-table-column prop='actualCompleteDate' label='实际完成日期'></el-table-column>
                    <el-table-column prop='regulationCode' label='标准法规号'>
                        <template slot-scope='scope'>
                            <span class="cursorP" @click.stop='editCase(scope.row,"viewCase")'>{{scope.row.regulationCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop='regulationName' label='标准法规名称'></el-table-column>
                    <el-table-column prop='articleCode' label='条文号'></el-table-column>
                    <el-table-column prop='updateUserName' label='更新人员'></el-table-column>
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
    import ecoContent from "@/components/pageAb/ecoContent.vue";
    import ecoLoading from "@/components/loading/ecoLoading.vue";
    import ecoToolTitle from "@/components/tool/ecoToolTitle.vue";
    import { EcoUtil } from "@/components/util/main.js";
    import { EcoMessageBox } from "@/components/messageBox/main.js";
    import { mapState } from 'vuex'
    import tagSelect from "@/components/orgPick/tagSelect.vue";
    import { carcheckCommit, carcheckList, carcheckInit,checklistExportCase } from '../../service/service.js'
    import {sysEnv} from '../../config/env.js'
    export default {
        name: 'checkList',
        data() {
            return {
                baseInfo: {
                    page: 1,
                    rows: 30,
                    total: 0
                },
                tableData: [],
                multipleSelection: [],
                isShowSearch: false,
                searchContent: {
                    status: '',
                    regulationName: '',
                    regulationCode: '',
                    dateRange1: [],
                    dateRange2: [],
                    dateRange3: []
                }
            }
        },
        components: {
            ecoContent,
            ecoLoading,
            ecoToolTitle,
            tagSelect
        },
        computed: {
            ...mapState(['statusList','initRole']),
            contentTop() {
                return this.isShowSearch ? '150px' : '59px';
            },
        },
        created() {
            _self = this;
            this.callAction();
        },
        mounted() {
            this.requestData('',false,false);
        },
        methods: {
            editCase(row,type) {
                if (!(row.id) && this.multipleSelection.length === 0) {
                    this.$message.warning('请至少选择一条数据!');
                    return
                }
                let _width = '1000';
                let _height = '600';
                let url;
                let dialogTitle;
                let data;
                if(row.id){
                    data = row.id;
                }else{   
                    var arr = this.multipleSelection.map((item)=>{
                        return item.id;
                    })
                    data = JSON.stringify(arr);
                }
                if(sysEnv==0){
                    if (type === "editCase" || type === 'viewCase') {
                        this.$router.push({name:'editCheck',params:{id:data,caseType:type}});
                    }else {
                        this.$router.push({name:'editCheck',params:{id:0,caseType:type}});
                    }
                }else{
                    if (type === "editCase") {
                        url = '/project/index.html#/editCheck/' + data + '/editCase';
                        dialogTitle = '办理';
                    } else if (type === 'viewCase') {
                        url = '/project/index.html#/editCheck/' + data + '/viewCase';
                        dialogTitle = '查看';
                        _height = '450';
                    } else {
                        url = '/project/index.html#/editCheck/' + 0 + '/addCase';
                        dialogTitle = '新增';
                    }
                    EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');      
                   
                }   
            },
            callAction() {
                let callBackDialogFunc = function (obj) {
                    //生成清单
                    _self.$refs.refLoading.open();
                    if (obj && (obj.action === 'initCase')) {
                        carcheckInit({
                            projectId: _self.$route.params.proId,
                            planStartDate: obj.data.planStartDate,
                            planCompleteDate: obj.data.planCompleteDate
                        }).then(res => {
                            _self.restSearContent();
                        }).catch(err => {
                            _self.$refs.refLoading.close();
                        })
                    }else if(obj && (obj.action === 'editCase')){
                        _self.restSearContent();
                    }
                }
                EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'checkList');
            },
            initCase() {
                if(sysEnv===0){
                    this.$router.push({name:'editCheck',params:{id:0,caseType:'initCase'}})
                }else{
                    var url = '/project/index.html#/editCheck/' + 0 + "/initCase";
                    EcoUtil.getSysvm().openDialog('生成', url, 500, 350, '15vh');
                }
            },
            restSearContent() {
                this.searchContent = {
                    status: '',
                    regulationName: '',
                    regulationCode: '',
                    dateRange1: [],
                    dateRange2: [],
                    dateRange3: []
                };
                this.requestData('',true,true);
            },
            commitCase() {
                if (this.multipleSelection.length === 0 || this.multipleSelection.length > 1) {
                    this.$message.warning('请选择一条数据进行提交!');
                    return;
                }
                this.$refs.refLoading.open();
                let id = this.multipleSelection[0].projectId;
                carcheckCommit(id).then(res => {
                    this.$refs.checkListTable.clearSelection(); //清除选项
                    this.$message.success('提交成功!');
                    this.restSearContent();
                }).catch(err => {
                    this.$refs.refLoading.close();
                })
            },
            handleCurrentChange(val) {
                this.baseInfo.page = val;
                this.requestData('search',false,false);
            },
            handleSizeChange(val) {
                this.baseInfo.rows = val;
                this.requestData('search',true,true)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            requestData(type,isFirstPage,isClearSel) {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    rows: this.baseInfo.rows,
                    projectId: this.$route.params.proId
                };
                if (type === 'search') {
                    for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.planStartDateFrom = this.searchContent[key][0];
                                params.planStartDateTo = this.searchContent[key][1];
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.planCompleteDateFrom = this.searchContent[key][0];
                                params.planCompleteDateTo = this.searchContent[key][1];
                            } else if (key == 'dateRange3' && this.searchContent[key].length == 2) {
                                params.actualCompleteDateFrom = this.searchContent[key][0];
                                params.actualCompleteDateTo = this.searchContent[key][1];
                            } else {
                                params[key] = this.searchContent[key];
                            }
                        }
                    }
                }
                if(isFirstPage){
                    this.baseInfo.page = 1;
                }
                if(isClearSel){
                    this.$refs.checkListTable.clearSelection(); //清除选项
                }
                params.page = this.baseInfo.page;
                carcheckList(params).then(res => {
                    this.baseInfo.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.$refs.refLoading.close();
                }).catch(err => {
                    this.baseInfo.total = 0;
                    this.tableData = [];
                    this.$refs.refLoading.close();
                })
            },
            changeSearchShow() {
                this.isShowSearch = !this.isShowSearch;
            },
            exportCase() {
                this.$refs.refLoading.open();
                let params = {
                    sort: ['modDate'],
                    order: ['desc'],
                    projectId: this.$route.params.proId
                };
                  for (var key in this.searchContent) {
                        if (this.searchContent[key]) {
                            if (key == 'dateRange1' && this.searchContent[key].length == 2) {
                                params.planStartDateFrom = this.searchContent[key][0];
                                params.planStartDateTo = this.searchContent[key][1];
                            } else if (key == 'dateRange2' && this.searchContent[key].length == 2) {
                                params.planCompleteDateFrom = this.searchContent[key][0];
                                params.planCompleteDateTo = this.searchContent[key][1];
                            } else if (key == 'dateRange3' && this.searchContent[key].length == 2) {
                                params.actualCompleteDateFrom = this.searchContent[key][0];
                                params.actualCompleteDateTo = this.searchContent[key][1];
                            } else {
                                params[key] = this.searchContent[key];
                            }
                        }
                    }
                    checklistExportCase(params).then(res => {
                        if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
                                navigator.msSaveBlob(new Blob([res.data],'点检清单.xlsx'));
                                this.$refs.refLoading.close();
                        }else{
                            let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                            let url = window.URL.createObjectURL(blob);
                            let a = document.createElement("a");
                            a.href = url;
                            a.download = '点检清单.xlsx';
                            this.$refs.refLoading.close();
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }
                       
                    }).catch(err => {
                        this.$refs.refLoading.close();
                    })
            },
        }
    }

</script>
<style scoped>
    .checkList .searchInputLabel {
        font-size: 14px;
        margin: 0 5px 0px 5px;
    }

    .checkList .searchRow {
        padding: 15px 10px 16px 10px;
        background: #fff
    }

    .checkList .searchRow .el-col {
        display: flex;
        align-items: center;
    }

    .checkList .searchRow .el-col+.el-col {
        margin-top: 7px;
    }
    .checkList .searchRow .el-input,
    .checkList .searchRow .el-select{
        width: 150px;
    }
    .checkList .searchRow .el-date-editor{
        width: 230px;
    }
</style>