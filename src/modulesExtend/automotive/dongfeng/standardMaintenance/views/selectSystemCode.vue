<template>
<div class="selectSystemCode" v-loading='loading'>
    <div class="treeBox">
        <div class="treeContent">
            <!-- @node-click="handleNodeClick"  -->
            <!-- @check="checkChange" -->
            <!-- highlight-current -->
            <el-tree :props="defaultProps" node-key="id" :load="loadNode" lazy ref="systemCodeTree" size="mini" :show-checkbox="showCheck" :check-strictly="true" :expand-on-click-node="expandClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="custom-tree-node-dept" @click="toggleSelect(data)">
                        <i class="icon iconfont iconmeixuanzhong  menuIcon treeIcon" v-if='!data.isMore' v-show="(!ucIsSelected(data.id))"></i>
                        <i class="icon iconfont iconxuanzhong menuIcon treeIcon" v-if='!data.isMore' v-show="(ucIsSelected(data.id))"></i>
                        <span class="label">{{node.label}}</span>
                    </span>
                </div>
            </el-tree>
        </div>
    </div>
    <div class="btn">
        <el-button type="primary" @click="submitCase" size='small'>确 定</el-button>
        <el-button @click="onClose" size='small'>取 消</el-button>
    </div>
</div>
</template>

<script>
import { technicalStandardTree, systreemanageCreateCode } from '../service/service.js'
import { EcoUtil } from '@/components/util/main.js'
export default {
    data() {
        return {
            loading: false,
            expandClick: false,
            showCheck: false,
            treeData: [],
            defaultProps: {
                label(data, node) {
                    return data.name || data.text;
                },
                isLeaf(data, node) {
                    return !data.isMore;
                    // return valid;
                },
            },
            treeSelect: [],
            rootResolve: null,
            rootNode: null,
        }
    },
    methods: {
        submitCase() {
            if (this.treeSelect.length == 0) {
                this.$message.warning('请选择一条数据!')
                return;
            }
            this.loading = true;
            systreemanageCreateCode(this.treeSelect[0]).then(res => {
                this.loading = false;
                let doObj = {};
                doObj.action = "selectSystemCode";
                doObj.close = true;
                doObj.data = {
                    code: res.data
                };
                EcoUtil.getSysvm().callBackDialogFunc(doObj);
            })

        },
        onClose() {
            EcoUtil.getSysvm().closeDialog();
        },
        ucIsSelected(value) {
            return this.treeSelect.indexOf(value) >= 0;
        },
        toggleSelect(data) {
            if (data.isMore) {
                return;
            }
            let tempItem = EcoUtil.objDeepCopy(data);
            let idx = this.treeSelect.indexOf(tempItem.id);
            if (idx == -1) {
                //勾选
                // let _checkKeys = EcoUtil.objDeepCopy(this.$refs.systemCodeTree.getCheckedKeys());
                // this.$refs.systemCodeTree.setCheckedKeys([]);
                this.treeSelect = [];
                this.treeSelect.push(tempItem.id);
                // this.$refs.systemCodeTree.setChecked(tempItem.id,true);
            } else {
                this.treeSelect.splice(idx, 1);
                // this.$refs.systemCodeTree.setChecked(tempItem.id,false);
            }
            console.log(this.treeSelect);
        },
        // checkChange(data,data2){
        //     console.log(data,data2,'checkChange')
        // },
        loadNode(node, resolve) {
            this.rootNode = node; //保留根节点
            this.rootResolve = resolve; //保留根节点方法
            this.rootNode.childNodes = [];
            if (node.level == 0) {
                technicalStandardTree(-1).then((response) => {
                    this.treeData = response.data.rows.map(x => {
                        return {
                            ...x,
                            isMore: x.subTotal > 0 ? true : false
                        }
                    });
                    resolve(this.treeData);
                })
            } else {
                technicalStandardTree(node.data.id).then((response) => {
                    let dataList = response.data.rows.map(x => {
                        return {
                            ...x,
                            isMore: x.subTotal > 0 ? true : false
                        }
                    });
                    setTimeout(() => {
                        resolve(dataList);
                    }, 200);
                })
            }
        },
        reloadNode() {
            //刷新树
            this.loadNode(this.rootNode, this.rootResolve)
        },
        // handleNodeClick(data) {  
        //     console.log(data,'handleNodeClick');
        // },
    }
}
</script>

<style scoped>
.selectSystemCode {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

.selectSystemCode .treeBox {
    position: absolute;
    top: 0px;
    bottom: 40px;
    right: 0px;
    left: 0px;
    ;
    overflow-y: auto;
}

.selectSystemCode .btn {
    position: absolute;
    bottom: 5px;
    width: 100%;
    text-align: right;
}

.selectSystemCode .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
}

.selectSystemCode .treeContent {
    width: max-content;
    min-width: 200px;
    margin: auto;
}

.selectSystemCode .treeIcon {
    margin-right: 0px;
}

.selectSystemCode .menuIcon {
    font-size: 14px;
}

.selectSystemCode .iconxuanzhong {
    color: #1ba5fa;
}
</style>
