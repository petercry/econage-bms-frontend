<template>
<div class="guideIndex">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>业务指南制修订归档</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type="primary" size="mini" @click="openKnow">存档</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row>
                <el-col>
                    <el-form-item label="归档状态:">
                        <!-- <el-input v-model="form.name" ></el-input> -->
                        <el-select v-model="form1.archiveStatus" placeholder="请选择">
                            <el-option :value='key' :label='item' v-for='(item,key) in archiveStatus' :key='item'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="业务指南名称:">
                        <el-input v-model="form1.businessGuideName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="部门:">
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="年度:">
                        <el-input v-model="form1.year" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="制修订审批状态:">
                        <!-- <el-input v-model="form1.revisionStatus" ></el-input> -->
                        <el-select filterable v-model='form1.revisionStatus'>
                            <el-option :value='key' :label='item' v-for='(item,key) in revisionStatus' :key='item'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="责任人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="科室:">
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="width:320px">
                    <el-form-item label="初稿完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="draftTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="会签完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="countersignTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                    <el-button type="primary" size="mini" @click="goReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="content">
        <el-table :data="guideList" border style="width:100%;font-size:12px" height="100%" ref="approvalRevise" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center" fixed="left" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="year" label="年度" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stdSubCategoryName" label="业务指南名称" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link type="primary" style="font-size:12px" @click.native="goDetali(scope.row)">{{scope.row.businessGuideName}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="draftCompleteTime" label="初稿完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="countersignCompleteTime" label="会签完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deptName" label="部门" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="officeName" label="科室" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="responsibleUserName" label="责任人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionTypeName" label="制/修订" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionStatusName" label="制修订审批状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="archiveStatusName" label="归档状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <!-- <el-link type="primary">替代版次</el-link> -->
                    <el-link type="primary" style="font-size:12px" @click.native='historyList(scope.row.wfId)'>流程历史</el-link>
                    <el-link type="primary" style="font-size:12px" @click.native='viewFileCase(scope.row)'>文档</el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="footer">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import { sysEnv } from '../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { guideArchiveList, guideReviseList, getexcellenceSystem, getPlanType, getRevisionStatus, getExport, getWFViewOperateId, getArchiveStatus, stdRevisionArchiveFile, checkFile } from "../api/guide.js";
import ecoLoading from '@/components/loading/ecoLoading.vue'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                businessGuideName: '', //设计指南
                dept: '', //部门，组织架构id
                responsibleUser: '', //责任人，科室中的具体负责人，用户id
                planStatus: '', //计划审批状态,枚举
                draftTimeFrom: '', //初稿完成时间 范围
                draftTimeTo: '', //初稿完成时间 范围
                countersignTimeFrom: '', //会签完成时间， 精确到天
                countersignTimeTo: '', // 会签完成时间， 精确到天
                office: '', // 科室，组织架构id
                revisionStatus: '', //制修订审批状态
                year: '', // 年度
                archiveStatus: '', //归档状态

            },
            guideList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            canclick: true,
            total: 10,
            searchShow: false,
            draftTime: [],
            countersignTime: [],
            revisionStatus: [],
            multipleSelection: [],
            archiveStatus: []
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getRevisionStatus()
        this.guideArchiveList()
        this.getArchiveStatus()
    },
    mounted() {
        this.callAction()
    },
    methods: {
        callAction() {
            let _this = this;
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action === 'selectKnowLib')) {
                    _this.doitKnowCase(obj.data);
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc, 'preparationRevision');
        },
        guideArchiveList() {
            guideArchiveList(this.info, this.form2).then(res => {
                // console.log(res)
                this.guideList = res.rows
                this.total = res.total
                this.$nextTick(() => {
                    this.$refs.approvalRevise.doLayout()
                })
            })
        },
        //制修订审批状态
        getRevisionStatus() {
            getRevisionStatus().then(res => {
                // console.log(res)
                this.revisionStatus = res
            })
        },
        //归档状态
        getArchiveStatus() {
            getArchiveStatus().then(res => {
                // console.log(res)
                this.archiveStatus = res
            })
        },
        selectRoleUser(data, type) {
            //选择人
            if (!data.id && data.itemArray.length === 0) {
                //人员删除
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = '';
                }
            } else {
                if (type === 'responsibleUser') {
                    this.form1.responsibleUser = data.itemArray[0].linkId;
                }
            }
        },
        selectRoleDept(data, type) {
            //责任部门
            if (!data.id && data.itemArray.length === 0) {
                if (type === 'dept') {
                    this.form1.dept = '';
                } else if (type === 'office') {
                    this.form1.office = '';
                }
            } else {
                if (type === 'dept') {
                    this.form1.dept = data.orgId;
                } else if (type === 'office') {
                    this.form1.office = data.orgId;
                }
            }
        },
        goSelect() {
            if (this.draftTime) {
                this.form1.draftTimeFrom = this.draftTime[0]
                this.form1.draftTimeTo = this.draftTime[1]
            } else {
                this.form1.draftTimeFrom = ''
                this.form1.draftTimeTo = ''
            }
            if (this.countersignTime) {
                this.form1.countersignTimeFrom = this.countersignTime[0]
                this.form1.countersignTimeTo = this.countersignTime[1]
            } else {
                this.form1.countersignTimeFrom = ''
                this.form1.countersignTimeTo = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        this.form2[value] = this.form1[value]
                    }
                }
            } else {
                this.form2 = {}
            }
            this.info.page = 1;
            if (this.form2.year) {
                this.form2.year = [this.form2.year]
            }
            this.guideArchiveList()
        },
        goReset() {
            this.$refs.selectResponsibleUser.initDataStrFunc();
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();
            this.form1.businessGuideName = ''
            this.form1.dept = ''
            this.form1.responsibleUser = ''
            this.form1.planStatus = ''
            this.form1.office = ''
            this.form1.revisionStatus = ''
            this.form1.archiveStatus = ''
            this.form1.year = ''
            this.draftTime = []
            this.countersignTime = []
            this.form2 = {}
            this.info.page = 1;
            this.info.rows = 30;
            this.guideArchiveList()
        },
        goDetali(item) {
            // console.log(item)
            if (item.revisionWfId) {
                let data = {
                    wf_id: item.revisionWfId,
                    form_view: '',
                    cc_id: '',
                    form_view: 1
                }
                getWFViewOperateId(data).then(res => {
                    // console.log(res)
                    if (res.status == 0) {
                        let operateId = res.operate_id;
                        // EcoUtil.getSysvm().showFlowHis(operateId);
                        let url = "/flowform/index.html#/wfViewDetail/" + item.wfId + "/" + operateId + "?noCloseBtn=true";
                        // EcoUtil.openMaxDialog('流程查看', url);
                        EcoUtil.getSysvm().openDialog('业务指南制修订详情', url, 900, 750, '8vh');
                    } else {
                        EcoMessageBox.alert(res.msg);
                    }
                })
            } else {
                this.$message('该数据未走流程');
            }
        },
        exportCase() {},
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.guideArchiveList()

        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.guideArchiveList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        openKnow() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('请至少选择一条数据!');
                return;
            }
            let bool = this.multipleSelection.some(item => {
                return item.archiveStatus === 'DONE'
            });
            if (bool) {
                this.$message.warning('勾选中有归档完成的数据,请取消勾选!');
                return;
            }
            let url = "/serviceGuide/index.html#/knowLedgeIndex";
            EcoUtil.getSysvm().openDialog('知识库', url, '900', '600', "15vh");
        },
        doitKnowCase(data) {
            //归档
            let params = {
                parentId: data.parentId,
                id: []
            }
            this.multipleSelection.forEach(item => {
                params.id.push(item.id);
            })
            stdRevisionArchiveFile(params).then(res => {
                console.log(res);
                this.$message.success('归档成功!');

            })
        },
        historyList(_wfId) {
            // console.log(_wfId)
            if (this.canclick) {
                this.$refs.refLoading.open();
                this.canclick = false;
                let data = {
                    wf_id: _wfId,
                    form_view: '',
                    cc_id: '',
                    form_view: 1
                }
                getWFViewOperateId(data).then((response) => {
                    if (response.status == 0) {
                        let operateId = response.operate_id;
                        EcoUtil.getSysvm().showFlowHis(operateId);
                    } else {
                        EcoMessageBox.alert(response.msg);
                    }
                    this.$refs.refLoading.close();
                    this.canclick = true;
                })
            }
        },
        viewFileCase(item) {
            // console.log(item)
            checkFile(item.id).then(res => {
                // console.log(res,res.id,res.name)
                // let url = "/serviceGuide/index.html#/fileView/" + id + '/approvalRevise';
                // EcoUtil.getSysvm().openDialog('附件查看', url, '400', '300', "15vh");
                let url = this.$router.resolve({
                    name: 'fileContent',
                    params: {
                        fileHeaderId: res.id,
                        fileName: res.name
                    }
                })
                window.open(url.href, '_blank')
            })
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-table__row:nth-of-type(even) {
    background: #f5f7fa;
}

/deep/ .el-col {
    width: 250px;
}

/deep/ .el-table th {
    font-weight: 600;
    background: #f5f7fa;
}

/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
    background-color: #f5f7fa;
}

/deep/ .el-table--border,
/deep/ .el-table--group {
    border-color: #f5f7fa;
}

/deep/ .el-table--border {
    border: 1px solid #ebeef5;
}

/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    color: #4f334f;
    font-size: 12px;
}

/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #ebeef5;
}

/deep/ .el-table--border td,
/deep/ .el-table--border th {
    border-right: 1px solid #ebeef5;
}

/deep/ .el-input {
    width: 130px;
    height: 28px;
}

/deep/ .el-date-editor {
    width: 210px;
}

/deep/ .el-range-editor--mini.el-input__inner {
    width: 200px;
}

/deep/ .el-customDiv {
    line-height: 28px;
    min-height: 28px;
}

.guideIndex {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .header {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        line-height: 50px;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;

            i {
                width: 5px;
                height: 16px;
                line-height: 16px;
                background: #409eff;
                margin-right: 5px;
            }
        }
    }

    .header-input {
        width: 100%;
        height: 150px;
        padding-left: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);

        /deep/ .el-form-item__label {
            font-size: 12px;
        }
    }

    .content {
        width: 100%;
        height: 100%;
        // flex: 1;
        overflow: hidden;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
        padding-bottom: 70px;
        box-sizing: border-box;
    }

    .footer {
        width: 100%;
        height: 50px;
        position: fixed;
        bottom: 0;
        text-align: right;
        background-color: rgb(248, 249, 251);
        padding-top: 10px;
        box-sizing: border-box;
        padding-right: 50px;

        /deep/ .el-pagination__jump .el-input--mini {
            width: 50px;
        }
    }
}
</style>
