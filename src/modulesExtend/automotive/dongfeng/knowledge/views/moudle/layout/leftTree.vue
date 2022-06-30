<template>
<div class="kn-leftTree">
    <el-tree class="treeList" :props="defaultProps" node-key="id" :highlight-current="true" :check-on-click-node="true" lazy :load="loadNode" :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked" ref="tree" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ data }">
            <p>
                <img v-if="data.fileType" style="vertical-align: middle;" :src="data.fileType&&typeImgList[data.fileType.replace(/([\s\S]+)\.[\s\S]*/g,'$1')]" />
                <img v-else style="vertical-align: middle;" :src="folderGifUrl" />
                <span>{{ data.stdName || data.name }}</span>
            </p>
        </span>
    </el-tree>
</div>
</template>

<script>
import { getOriginTreeNodeInfo, getKnowledgeLibList, getKnowledgeLibDetail } from '../../../api/knowledge.js'
import { mapActions, mapState, mapMutations } from 'vuex'
import { sysEnv } from '../../../config/env.js'
import { EcoFile } from '@/components/file/main.js'
import { EcoUtil } from '@/components/util/main.js'
export default {
    name: 'kn-leftTree',
    components: {

    },
    data() {
        return {
            treeList: [],
            caseId: -1,
            defaultExpanded: [],
            defaultChecked: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf'
                // label(data, node) {
                //   return data.name;
                // },
            },
            folderGifUrl: require('@/modules/knowledge/assets/img/folder.gif'),
            id: '',
            type: '',
            info: {
                page: 1,
                rows: 10,
                total: 0,
                sort: 'createDate',
                order: 'desc'
            },
            node: null,
            resolve: null,
            rootResolve: null,
            rootNode: null,
        }
    },
    created() {
        this.id = this.$route.params.id
        this.type = this.$route.params.type
    },
    mounted() {
        this.SET_FILETREENODE(this.$refs.tree);
        this.SET_ACTIVEID(this.id)
        // this.getOriginTreeNode()
    },

    computed: {
        ...mapState(['typeImgList', 'fileMainTableNode', 'fileTreeNode', 'activeId'])
    },

    methods: {
        ...mapMutations(['SET_FILETREENODE', 'SET_ACTIVEID']),
        ...mapActions([

        ]),
        loadNode(node, resolve) {
            this.node = node;
            this.resolve = resolve;
            getKnowledgeLibDetail(this.id).then(res => {
                // console.log(res)
                if (node.level === 0) {
                    //   let treeList = []
                    //   let obj = res
                    //   treeList.push(obj)
                    this.rootNode = node //保留根节点
                    this.rootResolve = resolve //保留根节点方法
                    this.rootNode.childNodes = []
                    this.defaultExpanded.push(res.id)
                    this.defaultChecked.push(res.id)
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(res.id);
                    })
                    return resolve([res]);
                }
                // if (node.level === 1) {
                //   return resolve(res.children)
                // }
                if (node.level >= 1) {
                    // console.log(node)
                    getKnowledgeLibList(this.id, node.data.id).then(res => {
                        // console.log(res)
                        let data = res.rows.map(item => {
                            if (item.type == 'FILE') {
                                item.leaf = true
                            }
                            return item
                        })
                        return resolve(data)
                    })
                }
            })

        },
        // //自定义节点渲染
        // renderContent: function (h, { node, data, store }) {
        //   console.log(node,data)
        //      return (
        //     <span>
        //       <img src={this.folderGifUrl} style="vertical-align:bottom;vertical-align:text-bottom;" />
        //     </span>
        //   )
        // },
        //刷新根节点
        reloadRootNode() {
            this.loadNode(this.rootNode, this.rootResolve)
        },
        handleNodeClick(data) {
            // console.log(data)
            if (data.type) {
                if (data.type == "DIR") {
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(data.id);
                    })
                    this.SET_ACTIVEID(data.id)
                    this.fileMainTableNode.getData(this.id, data.id, this.info)
                } else {
                    if (sysEnv !== 1) {
                        this.$router.push({ name: 'fileCard', params: { id: data.id, type: this.type } })
                    } else {
                        //  打开tab
                        let tabObj = {};
                        tabObj.desc = data.name;
                        let goPage = "knowledge/index.html#/fileCard" + '/' + data.id + '/' + this.type;
                        tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'fileCard',href_link:'" + goPage + "'}";
                        tabObj.reload = true;
                        tabObj.clearIframe = true;
                        EcoUtil.getSysvm().doTab(tabObj);
                    }
                }
            } else {
                this.SET_ACTIVEID(data.id)
                this.fileMainTableNode.getData(this.id, this.id, this.info)
            }
        },
        // deleteTreeList(array = []) {
        //   for (let i = 0; i < array.length; i++) {
        //     let node = this.$refs['tree'].getNode(array[i]);
        //     if (node) {
        //       this.$refs['tree'].remove(node);
        //     }
        //   }
        // },
        // 获取顶层节点信息
        // getOriginTreeNode() {
        //   getOriginTreeNodeInfo(this.id).then(res => {
        //     let treeList = []
        //     let obj = res
        //     this.$set(obj, 'children', res.children)
        //     treeList.push(obj)
        //     this.defaultExpanded.push(obj.id)
        //     this.defaultChecked.push(obj.id)
        //     this.$nextTick(() => {
        //       this.$refs.tree.setCurrentKey(obj.id);
        //     })
        //     this.treeList = treeList
        //   })
        // },
        // 展开文件夹
        expandedFolder(id) {
            // this.node.childNodes = [];
            // this.loadNode(this.node, this.resolve);//再次执行懒加载的方法
            let node = this.$refs['tree'].getNode(id)
            // console.log(node)
            node.expand();
            this.handleNodeClick(node.data);
        },
        // 操作菜单反馈
        expandedFolderAction(entryId, editName) {
            if (entryId == this.id) {
                this.reloadRootNode()
            } else {
                // console.log(this.node)
                if (editName) {
                    let node = this.$refs['tree'].getNode(entryId)
                    node.data.name = editName;
                    // console.log(node.data)
                    node.expand();
                    this.handleNodeClick(node.data);
                } else {
                    this.node.childNodes = [];
                    this.loadNode(this.node, this.resolve); //再次执行懒加载的方法
                    let node = this.$refs['tree'].getNode(entryId)
                    node.expand();
                    this.handleNodeClick(node.data);
                }
            }
        },
    },
    watch: {

    },

};
</script>

<style scoped>
.kn-leftTree {
    font-size: 12px;
}

.treeList .el-tree-node__content {
    padding: 5px 0;
}

.treeList .custom-tree-node {
    line-height: 26px;
    width: 100%;
}

.treeList .custom-tree-node .type-name {
    color: #595959;
    font-size: 12px;
}
</style>
