<template>
<div class="projectList">
    <div class="projectCenter">
        <el-table :data="tableData" border style="width: 100%" height="100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column prop="platformName" label="所属平台" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="projectName" label="项目名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="commodityTarget" label="商品目标" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="address" label="车辆类型" align="center" :show-overflow-tooltip="true">
                <template slot-scope="socpe">
                    <span v-for="(item,index) in socpe.row.carModelItemNames" :key="index">{{item}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="动力类型" align="center" :show-overflow-tooltip="true">
                <template slot-scope="socpe">
                    <span v-for="(item,index) in socpe.row.powerTypeItemNames" :key="index">{{item}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="sopTime" label="预计SOP时间" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="eopTime" label="预计EOP时间" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
    </div>
    <div class="footer">
        <el-button size='mini' @click="cancel">取消</el-button>
        <el-button type="primary" size='mini' @click="createDoc">确定</el-button>
    </div>
</div>
</template>

<script>
import { getProjectList } from '../../api/report'
import { sysEnv } from '../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
export default {
    data() {
        return {
            tableData: [],
            multipleSelection: []
        }
    },
    created() {
        this.getProjectList()
    },
    methods: {
        getProjectList() {
            getProjectList().then(res => {
                console.log(res)
                this.tableData = res.rows
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        cancel() {
            EcoUtil.getSysvm().closeDialog()
        },
        createDoc() {
            if (this.multipleSelection.length != 1) {
                return this.$message.error('请选择1条记录')
            }
            console.log(this.multipleSelection)
            let doObj = {}
            doObj.action = 'projectName'
            doObj.data = {
                name: this.multipleSelection[0].projectName,
                id: this.multipleSelection[0].id
            }
            doObj.close = true
            EcoUtil.getSysvm().callBackDialogFunc(doObj)

        },
    }
}
</script>

<style lang="less" scoped>
.projectList {
    width: 100%;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;

    .projectCenter {
        width: 100%;
        height: calc(100% - 50px);
    }

    .footer {
        width: 100%;
        height: 50px;
        text-align: right;
        background-color: rgb(248, 249, 251);
        padding-top: 10px;
        box-sizing: border-box;
        padding-right: 50px;
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
    /deep/ .el-table th.is-center {
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
}
</style>
