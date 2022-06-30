<template>
<div class="guideIndex">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <!-- <el-button type="primary" size="mini">修改</el-button>
        <el-button type="primary" size="mini">删除</el-button> -->
        <div class="left">
            <i></i>
            <span>业务指南制修订管理</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
            <el-button type="primary" size="mini" @click="initCase">启动</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row>
                <!-- <el-col>
                    <el-form-item label="卓越体系:">
                        <el-select v-model="form1.excellenceSystem" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in excellenceSystem" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
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
                    <el-form-item label="责任人:">
                        <tag-select ref='selectResponsibleUser' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'responsibleUser')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="制/修订:">
                        <el-select filterable v-model='form1.revisionType'>
                            <el-option :value='item.id' :label='item.text' v-for='(item) in revisionType' :key='item.id'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="当前审批人:">
                        <tag-select ref='selectRevisionApprove' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'revisionApprove')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="制修订状态:">
                        <!-- <el-input v-model="form1.revisionStatus" ></el-input> -->
                        <el-select filterable v-model='form1.revisionStatus'>
                            <el-option :value='key' :label='item' v-for='(item,key) in revisionStatus' :key='item'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="科室:">
                        <tag-select placeholder="选择机构" style="width:130px;vertical-align: top;" initDataStr="" ref='selectDffice' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'office')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col>
                    <el-form-item label="制定人:">
                        <tag-select ref='selectMaker' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'maker')}">
                        </tag-select>
                    </el-form-item>
                </el-col> -->
                <el-col>
                    <el-form-item label="年度:">
                        <el-input v-model="form1.year" ></el-input>
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
                <el-button type="primary" size="mini" @click="goSelect">查询</el-button>
                <el-button type="primary" size="mini" @click="goReset">重置</el-button>
            </el-row>
        </el-form>
    </div>
    <div class="content">
        <el-table :data="guideList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange" :show-overflow-tooltip="true">
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
                <!-- <template slot-scope='scope'>
                    <el-link type="primary" style="font-size:12px" @click.native="goDetali(scope.row)">{{scope.row.businessGuideName}}</el-link>
                </template> -->
            </el-table-column>
            <el-table-column prop="draftCompleteTime" label="初稿完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="countersignCompleteTime" label="会签完成时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="officeName" label="科室" align="center" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="makerName" label="制定人" align="center"></el-table-column> -->
            <el-table-column prop="responsibleUserName" label="责任人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionTypeName" label="制/修订" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionApproveName" label="制修订当前审批人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="revisionStatusName" label="制修订审批状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="操作" align="center" :show-overflow-tooltip="true">
                <template slot-scope='scope'>
                    <el-link type="primary" style="font-size:12px" @click.native="goDetali(scope.row)">查看流程</el-link>
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
import tagSelect from '@/components/orgPick/tagSelect.vue'
import { sysEnv } from '../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import { EcoUtil } from '@/components/util/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { getWFOperateId } from "../service/service.js";
import { guideReviseList, openReviseGuide, getRevisionType, getexcellenceSystem, getRevisionStatus, getExport, getWFViewOperateId } from "../api/guide.js";
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                excellenceSystem: '', //卓越体系
                businessGuideName: '', //设计指南
                dept: '', //部门，组织架构id
                responsibleUser: '', //责任人，科室中的具体负责人，用户id
                maker: '', //制定人
                draftTimeFrom: '', //初稿完成时间 范围
                draftTimeTo: '', //初稿完成时间 范围
                countersignTimeFrom: '', //会签完成时间， 精确到天
                countersignTimeTo: '', // 会签完成时间， 精确到天
                office: '', // 科室，组织架构id
                revisionType: '', // 制修订，基础数据id
                revisionStatus: '', //制修订审批状态
                year: '', // 年度
                revisionApprove: '' // 	制修订当前审批人
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
            // excellenceSystem: [],
            revisionType: [],
            revisionStatus: [],
            multipleSelection: [],
            searchShow: false
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getRevisionType()
        // this.getexcellenceSystem()
        this.getGuideReviseList()
        this.getRevisionStatus()
    },
    methods: {
        getGuideReviseList() {
            guideReviseList(this.info, this.form2).then(res => {
                // console.log(res)
                this.guideList = res.rows
                this.total = res.total
            })
        },
        // //卓越体系
        // getexcellenceSystem() {
        //     getexcellenceSystem().then(res => {
        //         // console.log(res)
        //         this.excellenceSystem = res
        //     })
        // },
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
        selectRoleUser(data, type) {
            //选择人
            if (!data.id && data.itemArray.length === 0) {
                //人员删除
                if (type === 'maker') {
                    this.form1.maker = '';
                } else if (type === 'responsibleUser') {
                    this.form1.responsibleUser = '';

                } else if (type === 'revisionApprove') {
                    this.form1.revisionApprove = '';
                }
            } else {
                if (type === 'maker') {
                    this.form1.maker = data.itemArray[0].linkId;
                } else if (type === 'responsibleUser') {
                    this.form1.responsibleUser = data.itemArray[0].linkId;
                } else if (type === 'revisionApprove') {
                    this.form1.revisionApprove = data.itemArray[0].linkId;
                }
            }
        },
        initCase() {
            let ids = '';
            if (this.multipleSelection.length !== 1) {
                this.$message.warning('请选择一条数据!');
                return;
            } else {
                ids = this.multipleSelection[0].id
            }
            // console.log(ids)
            openReviseGuide(ids).then(res => {
                // console.log(res)
                getWFOperateId(res.startTaskId).then(response => {
                    // console.log(response)
                    if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + res.startTaskId + "/" + operateId;
                            tabObj.desc = '启动流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
                            EcoUtil.getSysvm().doTab(tabObj);
                        }
                    } else {
                        EcoMessageBox.alert(response.data.msg);
                    }
                })
            })
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
            this.info.page = 1
            if (this.form2.year) {
                this.form2.year = [this.form2.year]
            }
            this.getGuideReviseList()
        },
        goReset() {
            this.$refs.selectRevisionApprove.initDataStrFunc();
            // this.$refs.selectMaker.initDataStrFunc();
            this.$refs.selectResponsibleUser.initDataStrFunc();
            this.$refs.selectDept.initDataStrFunc();
            this.$refs.selectDffice.initDataStrFunc();
            this.form1.excellenceSystem = ''
            this.form1.businessGuideName = ''
            this.form1.dept = ''
            this.form1.responsibleUser = ''
            this.form1.maker = ''
            this.form1.office = ''
            this.form1.revisionType = ''
            this.form1.revisionStatus = ''
            this.form1.year = ''
            this.form1.revisionApprove = ''
            this.draftTime = []
            this.countersignTime = []
            this.form2 = {}
            this.info.rows = 30;
            this.info.page = 1
            this.getGuideReviseList()
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
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        form2[value] = this.form1[value]
                    }
                }
            } else {
                form2 = ''
            }
            if (form2.year) {
                form2.year = [form2.year]
            }
            this.$refs.refLoading.open();
            getExport(form2).then(res => {
                // console.log(res)
                this.$refs.refLoading.close();
                let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                EcoFile.downloadFile(blob, "业务指南制修订.xls");
            }).catch(() => {
                this.$refs.refLoading.close();
            })
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
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getGuideReviseList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getGuideReviseList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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

/deep/ .el-customDiv {
    line-height: 28px;
    min-height: 28px;
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
        box-sizing: border-box;
        line-height: 50px;
        border-left: 1px solid rgb(221, 221, 221);
        border-right: 1px solid rgb(221, 221, 221);
        border-bottom: 1px solid rgb(221, 221, 221);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;

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
