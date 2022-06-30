<template>
<div class="standardDeptFinish">
    <div class="header">
        <i></i>
        <span>标准制修订部门完成率</span>
    </div>
    <div style="width:600px;height:600px;margin:20px auto;">
        <el-descriptions :column="2" border>
            <el-descriptions-item label="部门" :contentStyle="{'background': '#f5f7fa','color':'#000'}">完成率</el-descriptions-item>
            <el-descriptions-item label="部门" :contentStyle="{'background': '#f5f7fa','color':'#000'}">完成率</el-descriptions-item>
            <el-descriptions-item :label="item.deptName" :labelStyle="{'background':(item.calculteResult>='70%'?'#92d050':'')}" :contentStyle="{'color':(item.calculteResult>='70%'?'#3333ff':'')}" v-for="item in finshList" :key="item.deptName">
                {{item.calculteResult}}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</div>
</template>

<script>
import { getStandDeptFinish } from '../../api/report'
export default {
    data() {
        return {
            finshList: []
        }
    },
    mounted() {
        this.getStandDeptFinish()
    },
    methods: {
        getStandDeptFinish() {
            getStandDeptFinish('2021').then(res => {
                console.log(res)
                this.finshList = res
            })
        }
    }
}
</script>

<style lang="less" scoped>
.standardDeptFinish {
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

    /deep/ .el-descriptions-item__label {
        background-color: #f5f7fa;
        color: #000;
    }

    .my-content {
        background: #FDE2E2;
    }

    .my-label {
        background: #92d050;
    }
}
</style>
