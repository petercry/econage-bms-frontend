<template>
  <div class="kn-leftTree">
    <el-tree
      class="treeList"
      :data="treeList"
      :props="defaultProps"
      node-key="entryId"
      :highlight-current="true"
      :check-on-click-node="true"
      lazy
      :load="loadNode"
      :default-expanded-keys="defaultExpanded"
      :default-checked-keys="defaultChecked"
      ref="tree"
      @node-click="handleNodeClick"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>
<script>
import { getOriginTreeNodeInfo, expandTreeNode } from '../../../api/knowledge.js'
import { mapActions, mapState, mapMutations } from 'vuex'
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
        label: 'name'
        // label(data, node) {
        //   return data.name;
        // },
      },
      folderGifUrl: require('@/modules/knowledge/assets/img/folder.gif'),
      id: '',
      info: {
        page: 1,
        rows: 10
      },
      node: null,
      resolve: null
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.SET_FILETREENODE(this.$refs.tree);
    this.SET_ACTIVEID('-1')
    // this.getOriginTreeNode()
  },

  computed: {
    ...mapState([
      'activeId',
      'fileTableNode',
      'fileMainTableNode'
    ]),
  },

  methods: {
    ...mapMutations(['SET_FILETREENODE', 'SET_ACTIVEID']),
    ...mapActions([

    ]),
    loadNode(node, resolve) {
      this.node = node;
      this.resolve = resolve;
      getOriginTreeNodeInfo(this.id).then(res => {
        if (node.level === 0) {
          let treeList = []
          let obj = res.root
          treeList.push(obj)
          this.defaultExpanded.push(obj.entryId)
          this.defaultChecked.push(obj.entryId)
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(obj.entryId);
          })
          return resolve(treeList);
        }
        if (node.level === 1) {
          return resolve(res.children)
        }
        if (node.level > 1) {
          expandTreeNode(this.id, node.data.entryId).then(res => {
            setTimeout(() => {
              resolve(res);
            }, 100);
          })
        }
      })

    },
    //自定义节点渲染
    renderContent: function (h, { node, data, store }) {
         return (
        <span>
          <img src={this.folderGifUrl} style="vertical-align:bottom;vertical-align:text-bottom;" />
          <span style="font-size:12px;">{node.label}</span>
        </span>
      )
    },
    handleNodeClick(node) {
      this.$nextTick(()=>{
          this.$refs.tree.setCurrentKey(node.entryId);
      })
      this.SET_ACTIVEID(node.entryId)
      this.fileMainTableNode.getData(this.id, node.entryId, this.info)
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
    //     let obj = res.root
    //     this.$set(obj, 'children', res.children)
    //     treeList.push(obj)
    //     this.defaultExpanded.push(obj.entryId)
    //     this.defaultChecked.push(obj.entryId)
    //     this.$nextTick(() => {
    //       this.$refs.tree.setCurrentKey(obj.entryId);
    //     })
    //     this.treeList = treeList
    //   })
    // },
    // 展开文件夹
    expandedFolder(entryId) {
      // this.node.childNodes = [];
      // this.loadNode(this.node, this.resolve);//再次执行懒加载的方法
      let node = this.$refs['tree'].getNode(entryId)
      node.expand();
      this.handleNodeClick(node.data);
    },
    // 操作菜单反馈
    expandedFolderAction(entryId) {
      this.node.childNodes = [];
      this.loadNode(this.node, this.resolve);//再次执行懒加载的方法
      let node = this.$refs['tree'].getNode(entryId)
      node.expand();
      this.handleNodeClick(node.data);
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
