<template>
<div class="knowLedgeDetais" v-loading='loading'>
    <div class="treeBox">
        <el-aside width="200px" style="height: 100%">
            <div class="treeContent">
                <el-tree :data='treeData' :props="defaultProps" node-key="id" ref="knowLedgeTree" size="mini" :show-checkbox="showCheck" :check-strictly="true" :expand-on-click-node="expandClick">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="custom-tree-node-dept">
                            <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" @click.stop="toggleSelect(data)" v-show="(!ucIsSelected(data.id))"></i>
                            <i class="icon iconfont iconxuanzhong menuIcon treeIcon" @click.stop="toggleSelect(data)" v-show="(ucIsSelected(data.id))"></i>
                            <img style='transform: translateY(2px);margin-left:5px;' src="../assets//img/folder.png">
                            <span class="treeLabel" @click.stop='requestData(true,data.id)'>{{node.label}}</span>
                        </span>
                    </div>
                </el-tree>
            </div>
        </el-aside>
        <el-main style="padding:0px 10px 0 20px;position: absolute;top:0px;bottom:0px;left:200px;right:0px">
            <eco-content bottom="0px" top='0px' type="tool">
                <el-table ref="fileTable" :data="knowledgeList" border height='100%' :header-cell-style="{color:'#000',fontWeight:700}" :cell-style="{padding:'4px 0'}">
                    <el-table-column label="类型" width="80">
                        <template slot-scope="scope">
                            <div>
                                <img style="vertical-align: middle;" :src="scope.row.fileType&&typeImgList[scope.row.fileType.replace(/([\s\S]+)\.[\s\S]*/g,'$1')]" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createUserName" width="140" label="创建人">
                    </el-table-column>
                    <el-table-column prop="createDate" width="180" label="创建时间">
                    </el-table-column>
                </el-table>
            </eco-content>
            <eco-content bottom="0px" type="tool" style="padding:5px 0px">
                <el-row>
                    <el-col :span="24" style="text-align:right">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="baseInfo.page" :page-sizes="[5,30,50,100]" :page-size="baseInfo.rows" layout="total, sizes, prev, pager, next, jumper" :total="baseInfo.total" style="margin-right:20px">
                        </el-pagination>
                    </el-col>
                </el-row>
            </eco-content>

        </el-main>
    </div>
    <div class="btn">
        <el-button type="primary" @click="submitCase" size='small'>确 定</el-button>
        <el-button @click='$router.go(-1)' size='small'>返回上一级</el-button>
    </div>

</div>
</template>

<script>
import { EcoUtil } from '@/components/util/main.js'
import { docBaseTree, docBaseFileRecursively } from '../service/service.js'
import { mapState } from 'vuex'
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
    name: "knowLedgeDetais",
    data() {
        return {
            baseInfo: {
                page: 1,
                rows: 5,
                total: 0
            },
            knowledgeList: [],
            loading: false,
            expandClick: false,
            showCheck: false,
            treeData: [],
            defaultProps: {
                label: 'name',
                isLeaf(data, node) {
                    return !data.children;
                },
            },
            treeSelect: [],
            rootResolve: null,
            rootNode: null,
            selectId: {
                baseId: '',
                parentId: ''
            }
        }
    },
    components: {
        ecoContent
    },
    created() {
        this.initTree();
        this.requestData();
    },
    computed: {
        ...mapState(['typeImgList']),
        id() {
            return this.$route.params.id
        },
        category() {
            return this.$route.params.category
        }
    },
    methods: {
        handleSizeChange(val) {
            this.baseInfo.rows = val;
            this.requestData(true)
        },
        handleCurrentChange(val) {
            this.baseInfo.page = val;
            this.requestData(false);
        },
        requestData(isFirstP, parentId) {
            this.loading = true;
            let params = {
                sort: ['createDate'],
                order: ['desc'],
                rows: this.baseInfo.rows,
                baseId: this.id,
                parentId: parentId || this.id
            };
            if (isFirstP) {
                this.baseInfo.page = 1;
            }
            params.page = this.baseInfo.page;
            docBaseFileRecursively(params).then(res => {
                this.knowledgeList = res.data.rows;
                this.baseInfo.total = res.data.total;
                this.loading = false;
            }).catch(err => {
                this.knowledgeList = [];
                this.baseInfo.total = 0;
            })

        },
        initTree() {
            this.selectId.baseId = this.id;
            docBaseTree({ baseId: this.id, category: this.category }).then(res => {
                res.data.odLeave = 1;
                this.treeData = [res.data];
            })
        },
        submitCase() {
            if (this.treeSelect.length == 0) {
                this.$message.warning('请选择一条数据!')
                return;
            }
            let doObj = {};
            doObj.action = "selectKnowLib";
            doObj.close = true;
            doObj.data = this.selectId;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
        },
        // onClose() {
        //     EcoUtil.getSysvm().closeDialog();
        // },
        ucIsSelected(value) {
            return this.treeSelect.indexOf(value) >= 0;
        },
        toggleSelect(data) {
            let tempItem = EcoUtil.objDeepCopy(data);
            let idx = this.treeSelect.indexOf(tempItem.id);
            if (idx == -1) {
                this.treeSelect = [];
                this.treeSelect.push(tempItem.id);
                if (tempItem.odLeave === 1) {
                    this.selectId.parentId = this.selectId.baseId;
                } else {
                    this.selectId.parentId = tempItem.id;
                }

            } else {
                this.treeSelect.splice(idx, 1);
                this.selectId.parentId = '';
            }
        },
    }

}
</script>

<style scoped>
.knowLedgeDetais {
    position: absolute;
    z-index: 3;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow-y: hidden;
    color: #0f1419;
    background-color: #fff;
}

.knowLedgeDetais .treeBox {
    position: absolute;
    top: 0px;
    bottom: 40px;
    right: 0px;
    left: 0px;
    ;
    overflow-y: auto;
}

.knowLedgeDetais .btn {
    position: absolute;
    bottom: 5px;
    width: 100%;
    text-align: right;
}

.knowLedgeDetais .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
}

.knowLedgeDetais .treeContent {
    width: max-content;
    min-width: 200px;
    margin: auto;
}

.knowLedgeDetais .treeIcon {
    margin-right: 0px;
}

.knowLedgeDetais .menuIcon {
    font-size: 14px;
}

.knowLedgeDetais .iconxuanzhong {
    color: #1ba5fa;
}

.knowLedgeDetais .treeLabel {
    cursor: pointer;
}
</style>
