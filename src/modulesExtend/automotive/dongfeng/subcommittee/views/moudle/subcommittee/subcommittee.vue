<template>
<div class="subcommittee">
    <div class="header">
        <el-button type="primary" @click="goAdd">新增</el-button>
        <el-button type="danger" @click="goDelete">删除</el-button>
        <!-- <el-button type="primary">修改</el-button> -->
    </div>
    <div class="second">
        分标委名称：<el-input v-model="name" placeholder="请输入内容" suffix-icon='el-icon-search'></el-input>
        负责人：<el-input v-model="UserName" placeholder="请输入内容" suffix-icon='el-icon-search'></el-input>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
    </div>
    <div class="content">
        <el-table :data="subcommitteeList" border style="width: 100%" ref="subcommittee">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="order" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="分标委名称" align="center"></el-table-column>
            <el-table-column prop="responsibleUserName" label="负责人" align="center"></el-table-column>
            <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="scope">
                    <el-link @click="goEdit(scope.row)" type="primary">修改人员</el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="footer">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="info.page" :page-sizes="[10, 20, 30, 40]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
</div>
</template>

<script>
import { getSubcommittee, subcommitteeDelete } from '../../../api/fileCard.js'
import EcoUtil from '@/components/util/main.js'
import { sysEnv } from '../../../config/env.js'
export default {
    data() {
        return {
            subcommitteeList: [],
            total: 0,
            name: '',
            UserName: '',
            info: {
                rows: 10,
                order: 'asc',
                page: 1,
                sort: 'order'
            }
        }
    },
    created() {
        this.getSubcommittee();
        this.addMonitor()
    },
    methods: {
        addMonitor() {
            let this_ = this
            let callBackDialogFunc = function (obj) {
                if (obj && (obj.action == 'addSubcommittee' || obj.action == 'editSubcommittee')) {
                    this_.getSubcommittee()
                }
            }
            EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
        },
        getSubcommittee() {
            getSubcommittee(this.info).then(res => {
                this.subcommitteeList = res.rows
                console.log(res)
                this.total = res.total
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.info.rows = val
            this.getSubcommittee()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.info.page = val
            this.getSubcommittee()
        },
        goAdd() {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'subcommitteeAdd' })
            } else {
                let url = '/subcommittee/index.html#/subcommitteeAdd';
                EcoUtil.getSysvm().openDialog('新增分标委', url, 800, 800, '12vh');
            }
        },
        goEdit(data) {
            if (sysEnv !== 1) {
                this.$router.push({ name: 'subcommitteeEdit', params: { id: data.id } })
            } else {
                let url = '/subcommittee/index.html#/subcommitteeEdit/' + data.id;
                EcoUtil.getSysvm().openDialog('新增分标委', url, 800, 800, '12vh');
            }
        },
        goDelete() {
            let subcommittee = ''
            this.$refs.subcommittee.selection.map(item => {
                subcommittee += 'ids=' + item.id + '&'
            })
            subcommitteeDelete(subcommittee).then(res => {
                this.getSubcommittee()
            })
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-table__header th {
    background: #f5f5f5;
}

/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
    background-color: #ebeef5;
}

/deep/ .el-table--border,
/deep/ .el-table--group {
    border-color: #ebeef5;
}

/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    color: #4f334f;
    font-size: 14px;
}

/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #ebeef5;
}

/deep/ .el-table--border td,
/deep/ .el-table--border th {
    border-right: 1px solid #ebeef5;
}

.subcommittee {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    padding: 0 10px;
    box-sizing: border-box;

    .header {
        height: 50px;
        width: 100%;
        line-height: 50px;
    }

    .second {
        width: 100%;
        height: 80px;
        background: #fafafa;
        line-height: 80px;
        padding-left: 20px;
        box-sizing: border-box;

        /deep/ .el-input {
            width: 200px;
        }
    }

    .footer {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: right;
        padding-right: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        background: #fafafa;
        position:fixed;
        bottom: 0;
        padding-right: 50px;
    }
}
</style>
