<template>
  <!-- 知识库详情 -->
  <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    class="wfToDoVue"
    style="background-color:#f5f5f5"
  >
    <div class="knowLibDetail">
      <ecoLoading
        ref='ecoLoadingRef'
        text='加载中...'
      ></ecoLoading>
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;"
      >
        <knHeader :name="libObj.name"   @callBack="callBack"></knHeader>
      </eco-content>
      <eco-content
        bottom="0"
        top="61px"
        ref="content"
        style="padding:10px 15px;"
      >
        <el-container style="height:100%">
          <el-aside
            width="200px"
            style="backgroundColor:#fafafa"
          >
            <knLeftTree ref="leftTree" ></knLeftTree>
          </el-aside>
          <el-main style="padding:0px 10px 0 20px">
            <knMainTable
              @callBack="callBack"
              ref="fileMainTable"
            ></knMainTable>
          </el-main>
        </el-container>
      </eco-content>
    </div>

  </eco-content>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '../../../config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { getKnowledgeLibDetail } from '../../../api/knowledge.js'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { Loading } from 'element-ui';
import knHeader from '../layout/header.vue'
import knLeftTree from '../layout/leftTree.vue'
import knMainTable from '../layout/mainTable.vue'
export default {
  name: 'knowLibDetail',
  components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    knHeader,
    knLeftTree,
    knMainTable
  },
  data() {
    return {
      id: '',
      libObj: {}
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  activated() {

  },

  mounted() {
    window.ecoFrameVm = this; //添加监听
    this.addMonitor(); //添加监听
    this.getKnowledgeLibDetail();
    this.SET_FILEMAINTABLENODE(this.$refs.fileMainTable)
  },

  computed: {
    ...mapState(['fileTableNode', 'fileTreeNode', 'activeId']),
    ...mapGetters([

    ]),

  },
  methods: {
    ...mapMutations(['SET_FILETABLENODE', 'SET_FILEMAINTABLENODE']),
    ...mapActions([
    ]),
    // 添加监听
    addMonitor() {
      let callBackDialogFunc = function (obj) {
        if (obj && (obj.action == 'createFolderCallBack')||(obj.action == 'addNewFileCallBack')) {
          // 触发树节点更新
            window.ecoFrameVm.$refs['leftTree'].expandedFolderAction(window.ecoFrameVm.activeId);
        }
        if (obj&&obj.action=='FileSortCallBack') {
            window.ecoFrameVm.$refs['leftTree'].expandedFolderAction(window.ecoFrameVm.activeId);
        }
      }
      EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
    },
    getKnowledgeLibDetail() {
      getKnowledgeLibDetail(this.id).then(res => {
        this.libObj = res
      })
    },

    callBack(name, data) {
      if (name == "folderDelete") {
        // this.$refs['leftTree'].expandedFolderAction(data);
      } else if (name == "expandedFolder") {
        this.$refs['leftTree'].expandedFolder(data);
      }
    },
  },
  watch: {

  },

};
</script>

<style >
.knowLibDetail {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.knowLibDetail .plainBtn {
  border-color: #003b90;
  color: #003b90;
  font-size: 14px;
}
.knowLibDetail .toolBtn {
  margin: 0 10px;
  float: right;
}

.knowLibDetail .el-card /deep/ .el-card__body {
  height: 100px;
}
.knowLibDetail .el-card {
  border: 1px solid #ddd;
}
.knowLibDetail .el-card /deep/ .el-card__header {
  border-bottom: 1px solid #ddd;
}
.knowLibDetail .searchItem {
  color: #f56c6c;
}
.card-edit:hover {
  color: #409eff;
}
.card-delete:hover {
  color: #f56c6c;
}
.el-popover {
  min-width: 30px;
}
.knowLibDetail .plainBtn {
  border-color: red;
  color: red;
  font-size: 14px;
  margin-right: 10px;
}
</style>
