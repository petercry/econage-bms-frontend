<template>
  <div class="noticesReader">
    <el-tree
      class="treeList"
      :data="treeList"
      :props="defaultProps"
      node-key="id"
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
import { readRecordList } from '@/modules/rsf/api/notice.js'
export default {
  name: 'noticesReader',
  data() {
    return {
      id: '',
      parentId: '',
      folderGifUrl: require('@/modules/rsf/assets/img/folder.gif'),
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: function (data, node) {
          if (data.nodeType == 'DEPT') {
            return false;
          }
          return true;
        }
      },
      defaultExpanded: [],
      defaultChecked: [],
      treeList: []
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        readRecordList(this.id, this.parentId).then(res => {
          this.defaultExpanded.push(res[0].id)
          return resolve(res);
        })
      }
      if (node.level >= 1) {
        readRecordList(this.id, node.data.id).then(res => {

          return resolve(res);
        })
      }
    },
    //  渲染树
    renderContent: function (h, { node, data, store }) {
      if (data.nodeType == 'DEPT') {
        return (
          <span>
            <img src={this.folderGifUrl} style="vertical-align:bottom;vertical-align:text-bottom;" />
            <span style="font-size:12px;">{node.label}(共发{data.deptReceiverCount}人,已读{data.deptReadCount}人)</span>
          </span>
        )
      }
      if (data.nodeType == 'USER') {
        return (
          <span>
            <i class="el-icon-check" style="color:#06d6a0;fontSize:18px;fontWeight:700;verticalAlign:middle;margin-right:4px;" v-show={data.readFlag}></i>
            <i class="el-icon-close" style="color:red;fontSize:18px;fontWeight:700;verticalAlign:middle;margin-right:4px;" v-show={!data.readFlag}></i>
            <span style="font-size:12px;verticalAlign:middle;margin-right:4px;" v-show={data.readFlag}>{node.label}(已阅读,时间:{data.readTime})</span>
            <span style="font-size:12px;verticalAlign:middle;margin-right:4px;" v-show={!data.readFlag}>{node.label}(未阅读)</span>
          </span>
        )
      }
    },
    handleNodeClick() {

    }
  },
}
</script>

<style scoped >
.noticesReader {
  padding: 20px;
}
</style>
