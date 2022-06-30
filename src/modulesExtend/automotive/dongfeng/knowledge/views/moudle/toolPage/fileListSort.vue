<template>
<div class="listSort">
    <!-- 排序 -->
    <el-table :data="listData" :header-cell-style="{color:'#000',fontWeight:700,backgroundColor:'#eef1f6'}" height="400px" row-key="id">
        <el-table-column label="类别" width="100">
            <template slot-scope="scope">
                <div>
                    <img style="vertical-align: middle;" :src="scope.row.fileTypeImage&&typeImgList[scope.row.fileTypeImage.replace(/([\s\S]+)\.[\s\S]*/g,'$1')]" />
                </div>
            </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
        </el-table-column>
    </el-table>
    <el-row style="marginTop:40px;position: relative;bottom:20px">
        <el-col align="right">
            <el-button @click="saveSort">确定</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
// import { mapActions, mapGetters, mapState } from 'vuex'
// import Sortable from "sortablejs";
// import EcoUtil from '@/components/util/main.js'
export default {
    name: 'listSort',
    components: {
        Sortable
    },
    data() {
        return {
            listData: [],
            id: '',
            parentId: '',
            info: {
                page: 1,
                rows: 0
            }

        }
    },
    computed: {
        // ...mapState(['typeImgList'])
    },
    created() {
        // this.id = this.$route.params.id
        // this.parentId = this.$route.params.activeid == "-1" ? "" : this.$route.params.activeid
    },
    mounted() {
        // this.getListData()
        // this.rowDrop()
    },
    methods: {
        // rowDrop() {
        //     const tbody = document.querySelector('.el-table__body-wrapper tbody')
        //     let self = this
        //     Sortable.create(tbody, {
        //         onEnd({ newIndex, oldIndex }) {
        //             const targetRow = self.listData.splice(oldIndex, 1)[0]
        //             self.listData.splice(newIndex, 0, targetRow)
        //         }
        //     })
        // },
        // getListData() {
        //     getKnowledgeLibList(this.id, this.parentId, this.info).then(res => {
        //         this.listData = res.rows;
        //     })
        // },
        // saveSort() {

        //     let ids = this.listData.map((item) => {
        //         return item.id
        //     })
        //     sortFolderChild(ids).then(res => {
        //         this.$message({
        //             duration: 300,
        //             type: 'success',
        //             message: '排序成功',
        //             onClose: () => {
        //                 let doObj = {}
        //                 doObj.action = 'FileSortCallBack';
        //                 doObj.data = {};
        //                 doObj.close = true;
        //                 EcoUtil.getSysvm().callBackDialogFunc(doObj);
        //             }
        //         });

        //     })
        // }
    },
}
</script>

<style scoped>
.listSort {
    padding: 20px;
}

.listSort /deep/ .gutter {
    background-color: #eef1f6;
}
</style>
