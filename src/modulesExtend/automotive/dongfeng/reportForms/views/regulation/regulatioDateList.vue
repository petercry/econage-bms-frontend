<template>
<div class="regulationDetail">
    <el-table :data="list" border style="width: 100%">
        <el-table-column prop="regulationCode" label="法规编号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="regulationName" label="法规名称" align="center" :show-overflow-tooltip="true">
            <template slot-scope='scope'>
                <el-link type="primary" @click.native="goDetali(scope.row)">{{scope.row.regulationName}}</el-link>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import { getDateList } from '../../api/report'
import { sysEnv } from '../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
export default {
    props: {
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        fun: {
            type: String
        },
        type: {
            type: String
        },
        conditionId: {
            type: String
        },
    },
    data() {
        return {
            list: []
        }
    },
    created() {
        console.log(this.$props)
        this.getRegulationList()
    },
    methods: {
        getRegulationList() {
            getDateList(this.startDate, this.endDate, this.fun, this.type, this.conditionId).then(res => {
                // console.log(res)
                this.list = res
            })
        },
        // goDetali(item) {
        //     // console.log(item)
        //     if (sysEnv === 0) {
        //         this.$router.push({ name: 'regulationDetail', params: { id: item.id } })
        //     } else {
        //         let url = '/reportForms/index.html#/regulationDetail/' + item.id
        //         EcoUtil.getSysvm().openDialog('', url, '900', '600', "15vh");
        //     }
        // },
        goDetali(item) {
            let _width = '1000';
            let _height = '500';
            let url = '/regulatoryTrackingForm/index.html#/editPage/' + item.id + '/' + 'viewCase' + '/finishList';
            let dialogTitle = '查看';
            EcoUtil.getSysvm().openDialog(dialogTitle, url, _width, _height, '15vh');
        },
    }
}
</script>

<style lang="less" scoped>
.regulationDetail {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

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
