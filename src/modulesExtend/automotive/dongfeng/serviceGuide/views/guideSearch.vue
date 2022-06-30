<template>
<div class="guideIndex">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>业务指南查询与管理</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <!-- <el-button type='primary' size='mini' v-for='(item) in operationType' @click="initCase(item.id,item.text)" :key='item.id'>{{item.text}}</el-button> -->
            <el-button type='primary' size='mini' @click="editGudie">修改</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row>
                <el-col>
                    <el-form-item label="业务指南名称:">
                        <el-input v-model="form1.businessGuideName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="部门:">
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='selectDept' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'dept')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="责任人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                    </el-form-item>
                </el-col>

                <el-col>
                    <el-form-item label="制/修订:">
                        <!-- <el-input v-model="form1.revisionType" ></el-input> -->
                        <el-select filterable v-model='form1.revisionType'>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in revisionType' :key='item.id'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="计划类型:">
                        <el-select v-model="form1.planType" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in planType" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="计划审批状态:">
                        <el-select v-model="form1.planStatus" placeholder="请选择">
                            <el-option :label="item" :value="key" v-for="(item,key) in planStatus" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="科室:">
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="年度:">
                        <el-input v-model="form1.year"></el-input>
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
                <el-col style="width:320px">
                    <el-form-item label="初稿完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="draftTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="width:320px">
                    <el-form-item label="会签完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="countersignTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="审批完成时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="approveCompleteTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
        <el-table :data="guideList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column prop="" label="序号" width="50" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="year" label="年度" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deptName" label="部门" align="center" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="excellenceSystemName" label="卓越体系" align="center"></el-table-column> -->
            <el-table-column prop="businessGuideName" label="业务指南名称" align="center" :show-overflow-tooltip="true">
                <template slot-scope='scope'>
                    <el-link type="primary" style="font-size:12px;" @click.native="goDetali(scope.row)">{{scope.row.businessGuideName}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="draftCompleteTime" label="初稿完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="countersignCompleteTime" label="会签完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="officeName" label="科室" align="center" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="makerName" label="制定人" align="center"></el-table-column> -->
            <el-table-column prop="responsibleUserName" label="责任人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionTypeName" label="制/修订" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionApproveName" label="制修订当前审批人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionStatusName" label="制修订审批状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="planApproveName" label="计划当前审批人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="planStatusName" label="计划审批状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="planTypeName" label="计划类型" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="approveCompleteTime" label="审批完成日期" align="center" :show-overflow-tooltip="true"></el-table-column>
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
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import { guidePlanList, openGuide, getOperationType, getRevisionType, getexcellenceSystem, getPlanType, getRevisionStatus, getExport, getWFViewOperateId, getPlanStatus } from "../api/guide.js";
import { getWFOperateId } from "../service/service.js";
import tagSelect from '@/components/orgPick/tagSelect.vue'
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
                planType: '', //计划类型
                draftTimeFrom: '', //初稿完成时间 范围
                draftTimeTo: '', //初稿完成时间 范围
                countersignTimeFrom: '', //会签完成时间， 精确到天
                countersignTimeTo: '', // 会签完成时间， 精确到天
                office: '', // 科室，组织架构id
                revisionType: '', // 制修订，基础数据id
                revisionStatus: '', //制修订审批状态
                year: '', // 年度
                approveCompleteTimeFrom: '', //审批完成日期
                approveCompleteTimeto: '', //审批完成日期
            },
            guideList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 10,
            draftTime: [],
            countersignTime: [],
            approveCompleteTime: [],
            operationType: [],
            revisionType: [],
            planType: [],
            revisionStatus: [],
            multipleSelection: [],
            searchShow: false,
            planStatus: []
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getGuidePlanList()
        this.getOperationType()
        this.getRevisionType()
        this.getPlanType()
        this.getRevisionStatus()
        this.getPlanStatus()
    },
    methods: {
        getGuidePlanList() {
            guidePlanList(this.info, this.form2).then(res => {
                // console.log(res)
                this.guideList = res.rows
                this.total = res.total
            })
        },
        //操作类型
        getOperationType() {
            getOperationType().then(res => {
                // console.log(res)
                this.operationType = res
            })
        },
        //制/修订
        getRevisionType() {
            getRevisionType().then(res => {
                // console.log(res)
                this.revisionType = res
            })
        },
        //制修订审批状态
        getRevisionStatus() {
            getRevisionStatus().then(res => {
                // console.log(res)
                this.revisionStatus = res
            })
        },
        //制修订审批状态
        getPlanStatus() {
            getPlanStatus().then(res => {
                // console.log(res)
                this.planStatus = res
            })
        },
        //计划类型
        getPlanType() {
            getPlanType().then(res => {
                // console.log(res)
                this.planType = res
            })
        },
        initCase(id, text) {
            if (text !== "新增" && this.multipleSelection.length !== 1) {
                this.$message.warning('请选择一条数据!');
                return;
            }
            let ids = '';
            if (text !== "新增") {
                // ids.push(this.multipleSelection[0].id);
                ids = this.multipleSelection[0].id
            }
            console.log(id, ids)
            openGuide(id, ids).then(res => {
                // console.log(res.data)
                getWFOperateId(res.data.startTaskId).then(response => {
                    console.log(response)
                    if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + res.data.startTaskId + "/" + operateId;
                            tabObj.desc = '新建流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.data.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                            EcoUtil.getSysvm().doTab(tabObj);
                        }
                    } else {
                        EcoMessageBox.alert(response.data.msg);
                    }
                })
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
            if (this.approveCompleteTime) {
                this.form1.approveCompleteTimeFrom = this.approveCompleteTime[0]
                this.form1.approveCompleteTimeTo = this.approveCompleteTime[1]
            } else {
                this.form1.approveCompleteTimeFrom = ''
                this.form1.approveCompleteTimeTo = ''
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
            this.info.page = 1
            this.getGuidePlanList()
        },
        goReset() {
            this.$refs.selectResponsibleUser.initDataStrFunc();
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();
            this.form1.businessGuideName = ''
            this.form1.dept = ''
            this.form1.responsibleUser = ''
            this.form1.planStatus = ''
            this.form1.planType = ''
            this.form1.office = ''
            this.form1.revisionType = ''
            this.form1.revisionStatus = ''
            this.form1.year = ''
            this.draftTime = []
            this.countersignTime = []
            this.approveCompleteTime = []
            this.form2 = {}
            this.info.page = 1
            this.info.rows = 30
            this.getGuidePlanList()
        },
        //导出 
        exportCase() {
            let form2 = {}
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
            if (this.approveCompleteTime) {
                this.form1.approveCompleteTimeFrom = this.approveCompleteTime[0]
                this.form1.approveCompleteTimeTo = this.approveCompleteTime[1]
            } else {
                this.form1.approveCompleteTimeFrom = ''
                this.form1.approveCompleteTimeTo = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        form2[value] = this.form1[value]
                    }
                }
            } else {
                form2 = ''
            }
            this.$refs.refLoading.open();
            getExport(form2).then(res => {
                // console.log(res)
                this.$refs.refLoading.close();
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "业务指南计划.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
        },
        goDetali(item) {
            // console.log(item)
            let data = {
                wf_id: item.wfId,
                form_view: '',
                cc_id: '',
                form_view: 1
            }
            getWFViewOperateId(data).then(res => {
                console.log(res)
                if (res.status == 0) {
                    let operateId = res.operate_id;
                    // EcoUtil.getSysvm().showFlowHis(operateId);
                    let url = "/flowform/index.html#/wfViewDetail/" + item.wfId + "/" + operateId + "?noCloseBtn=true";
                    // EcoUtil.openMaxDialog('流程查看', url);
                    EcoUtil.getSysvm().openDialog('业务指南计划详情', url, 900, 750, '8vh');
                } else {
                    EcoMessageBox.alert(res.msg);
                }
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getGuidePlanList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getGuidePlanList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        editGudie() {
            if (this.multipleSelection.length !== 1) {
                this.$message.warning('请选择一条数据!');
                return;
            }
            // console.log(this.multipleSelection[0].id)
            if (sysEnv !== 1) {
                this.$router.push({ name: 'editGudie', params: { id: this.multipleSelection[0].id } })
            } else {
                let url = '/serviceGuide/index.html#/editGudie/' + this.multipleSelection[0].id;
                EcoUtil.getSysvm().openDialog('业务指南修改', url, 800, 700, '12vh');
            }
        }

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

/deep/ .el-customDiv {
    line-height: 28px;
    min-height: 28px;
}

/deep/ .el-range-editor--mini.el-input__inner {
    width: 200px;
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
        height: 200px;
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
