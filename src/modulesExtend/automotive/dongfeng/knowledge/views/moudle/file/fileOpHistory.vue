<template>
<div class="fileOpHistory">
    <!-- 操作历史 -->
    <el-table style="width: 100%" border :header-cell-style="{background:'#f5f7fa',
     color:'#000',fontWeight:700}" :data='listData'>
        <el-table-column label="类别" prop="typeName"></el-table-column>
        <el-table-column label="用户" prop="createUserName">
        </el-table-column>
        <el-table-column label="时间" prop="createDate">
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import { getOperateRecord } from '../../../api/knowledge.js'
export default {
    name: 'fileOpHistory',
    data() {
        return {
            listData: [],
            info: {
                page: 1,
                rows: 10,
                sort: 'createDate',
                order: 'desc'
            },
            id: ''
        }
    },
    created() {
        this.id = this.$route.params.id
        this.getListFunc()
    },
    mounted() {},
    methods: {
        getListFunc() {
            // console.log(this.id, "111")
            getOperateRecord(this.id, this.info).then(res => {
                // console.log(res)
                this.listData = res.rows
            })
        }
    },
}
</script>

<style scoped>
.fileOpHistory {
    padding: 20px;
}

.el-table /deep/ th.gutter {
    display: table-cell !important;
}

.el-table /deep/ colgroup.gutter {
    display: table-cell !important;
}
</style>
