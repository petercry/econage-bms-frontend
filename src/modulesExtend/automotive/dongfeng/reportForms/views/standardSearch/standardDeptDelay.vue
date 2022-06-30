<template>
<div class="standardDeptDelay">
    <div class="header">
        <i></i>
        <span>标准制修订部门延迟率</span>
    </div>
    <div style="width:600px;height:600px;margin:20px auto;">
        <el-table :data="delayList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="deptName" label="部门" width="180" align="center"></el-table-column>
            <el-table-column prop="calculteResult" label="延后数" align="center"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { getStandDeptDelay } from '../../api/report'
export default {
    data() {
        return {
            delayList: []
        }
    },
    mounted() {
        this.getStandDeptDelay()
    },
    methods: {
        getStandDeptDelay() {
            getStandDeptDelay('2021').then(res => {
                console.log(res)
                this.delayList = res
            })
        }
    }
}
</script>

<style lang="less" scoped>
.standardDeptDelay {
    width: 100%;
    height: 100vh;
    // padding-left: 20px;
    // padding-right: 20px;
    box-sizing: border-box;

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
        // justify-content: space-between;
        align-items: center;

        i {
            width: 5px;
            height: 16px;
            line-height: 16px;
            background: #409eff;
            margin-right: 5px;
        }

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

}
</style>
