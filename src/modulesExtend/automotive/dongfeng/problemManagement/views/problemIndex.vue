<template>
<div class="problemIndex">
    <ecoLoading ref='refLoading' text='加载中...'></ecoLoading>
    <div class="header">
        <div class="left">
            <i></i>
            <span>问题管理</span>
        </div>
        <div class="right">
            <el-button type="primary" size="mini" @click="searchShow=(!searchShow)">高级查询</el-button>
            <el-button type="primary" size="mini" @click="initCase">新增</el-button>
            <el-button type='primary' size='mini' @click="getDelete">删除</el-button>
            <el-button type='primary' size='mini' @click="exportCase">导出</el-button>
        </div>
    </div>
    <div class="header-input" v-show="searchShow">
        <el-form ref="form" :model="form" style="font-size:12px">
            <el-row>
                <el-col>
                    <el-form-item label="问题分类:">
                        <el-select v-model="form1.questionCategory" placeholder="请选择">
                            <el-option :label="item.text" :value="item.id" v-for="item in problemTypeList" :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标题:">
                        <el-input v-model="form1.problemTitle" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="提出部门:">
                        <tag-select placeholder="选择机构" style="min-width:130px;max-width:300px;vertical-align: top;" initDataStr="" ref='proposeDepartment' :initOptions="{selectNum:1,selectType:'Dept'}" @callBack="(data)=>{selectRoleDept(data,'proposeDepartment')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="提出人:">
                        <tag-select ref='proposer' initDataStr="" placeholder="选择人员" style="width:130px;vertical-align: top;" :initOptions="{selectNum:1,selectType:'User'}" @callBack="(data)=>{selectRoleUser(data,'proposer')}">
                        </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="标准法规号:">
                        <el-input v-model="form1.standardRegulationNo" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="标准法规名称:">
                        <el-input v-model="form1.standardRegulationName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="width:320px">
                    <el-form-item label="提出时间:">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="proposalTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
        <el-table :data="problemList" border style="width:100%;font-size:12px" height="100%" ref="outsideTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column prop="" label="序号" width="50" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index +1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="questionCategoryName" label="问题分类" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="problemTitle" label="标题" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="problemDescription" label="问题描述" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="proposeDepartmentName" label="提出部门" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="proposerName" label="提出人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="proposalTime" label="提出时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="statuName" label="状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="standardRegulationNo" label="标准法规号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="standardRegulationName" label="标准法规名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="respondentName" label="答复人" align="center" :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="replyDepartmentName;" label="答复部门" align="center" :show-overflow-tooltip="true"></el-table-column> -->
            <el-table-column prop="replyTime" label="答复时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="replyResult" label="答复结果" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="操作" align="center" :show-overflow-tooltip="true">
                <template slot-scope='scope'>
                    <el-link type="primary" @click.native="goDetali(scope.row)">处理</el-link>
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
import { EcoFile } from '@/components/file/main.js'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import { EcoUtil } from '@/components/util/main.js'
import { problemList, getExport, getWFViewOperateId, openProblem, getProblemType, deleteProblem } from "../api/problem.js";
import { getWFOperateId } from "../service/service.js";
import tagSelect from '@/components/orgPick/tagSelect.vue'
export default {
    data() {
        return {
            form: {},
            form2: {},
            form1: {
                questionCategory: '', //问题分类
                problemTitle: '', //问题标题
                proposeDepartment: '', //提出部门
                proposer: '', //提出人
                standardRegulationNo: '', //标准法规号
                standardRegulationName: '', //标准法规名称
                proposalTimeStart: '',
                proposalTimeEnd: ''
            },
            problemList: [],
            info: {
                page: 1,
                rows: 30,
                sort: 'createDate',
                order: 'desc',
            },
            total: 10,
            proposalTime: [],
            multipleSelection: [],
            problemTypeList: [],
            searchShow: true
        }
    },
    components: {
        tagSelect,
        ecoLoading
    },
    created() {
        this.getProblemList()
        this.getProblemType()
    },
    methods: {
        getProblemList() {
            problemList(this.info, this.form2).then(res => {
                // console.log(res)
                this.problemList = res.rows
                this.total = res.total
            })
        },
        getProblemType() {
            getProblemType().then(res => {
                this.problemTypeList = res
            })
        },
        initCase() {
            openProblem().then(res => {
                // console.log(res)
                getWFOperateId(res.startTaskId).then(response => {
                    // console.log(response)
                    if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + res.startTaskId + "/" + operateId;
                            tabObj.desc = '新建流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + res.startTaskId + "',href_link:'" + goPage + "',fullScreen:true}";
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
                if (type === 'proposer') {
                    this.form1.proposer = '';
                }
            } else {
                if (type === 'proposer') {
                    this.form1.proposer = data.itemArray[0].linkId;
                }
            }
        },
        selectRoleDept(data, type) {
            //责任部门
            if (!data.id && data.itemArray.length === 0) {
                if (type === 'proposeDepartment') {
                    this.form1.proposeDepartment = '';
                }
            } else {
                if (type === 'proposeDepartment') {
                    this.form1.proposeDepartment = data.orgId;
                }
            }
        },
        goSelect() {
            if (this.proposalTime) {
                this.form1.proposalTimeStart = this.proposalTime[0]
                this.form1.proposalTimeEnd = this.proposalTime[1]
            } else {
                this.form1.proposalTimeStart = ''
                this.form1.proposalTimeEnd = ''
            }
            if (this.form1) {
                for (const value in this.form1) {
                    if (this.form1[value]) {
                        this.form2[value] = this.form1[value]
                    }
                }
            } else {
                this.form2 = ''
            }
            this.getProblemList()
        },
        goReset() {
            this.$refs.proposer.initDataStrFunc();
            this.$refs.proposeDepartment.initDataStrFunc();
            this.form1.questionCategory = ''
            this.form1.problemTitle = ''
            this.form1.proposeDepartment = ''
            this.form1.proposer = ''
            this.form1.standardRegulationNo = ''
            this.form1.standardRegulationName = ''
            this.proposalTime = []
            this.form2 = {}
            this.getProblemList()
        },
        getDelete() {
            let ids = this.multipleSelection.map(item => {
                return item.id
            })
            if (!ids) {
                this.$message({ type: 'warning', message: '请选择要删除的文件！' });
            } else {
                this.$confirm('是否删除记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProblem(ids).then(res => {
                        this.$message({ type: 'success', message: '删除成功！' });
                        this.getProblemList()
                    })
                })
            }
        },
        //导出 
        exportCase() {
            let form2 = {}
            if (this.proposalTime) {
                this.form1.proposalTimeStart = this.proposalTime[0]
                this.form1.proposalTimeEnd = this.proposalTime[1]
            } else {
                this.form1.proposalTimeStart = ''
                this.form1.proposalTimeEnd = ''
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
                EcoFile.downloadFile(blob, "问题管理.xls");
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
            if (item.isHandle) {
                getWFOperateId(item.taskId).then(response => {
                    // console.log(response)
                    if (response.data.status == 0) {
                        let operateId = response.data.operate_id;
                        if (sysEnv == 1) {
                            let tabObj = {};
                            let goPage = "flowform/index.html#/wfDetail/" + item.taskId + "/" + operateId;
                            tabObj.desc = '新建流程';
                            tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'wfDetail" + item.taskId + "',href_link:'" + goPage + "',fullScreen:true}";
                            EcoUtil.getSysvm().doTab(tabObj);
                        }
                    } else {
                        EcoMessageBox.alert(response.data.msg);
                    }
                })
            } else {
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
            }
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getProblemList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getProblemList()
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
    border-radius: 4px;
    border: 1px solid #DCDFE6;
}

/deep/ .el-customDiv .placeholder {
    position: relative !important;
    color: #ccc;
}

/deep/ .el-range-editor--mini.el-input__inner {
    width: 200px;
}

.problemIndex {
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
