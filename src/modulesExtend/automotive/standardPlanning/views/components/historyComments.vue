<template>
  <div class="historyComments" >
    <!-- <liuchentu></liuchentu> -->
    <eco-content top='0px' bottom='50vh' type='tool' style='background: #f5f5f5;overflow:hidden;'>
        <iframe  :name="id" :id="id"  v-bind:src="flowSrc" frameborder="0" style="width:100%;height:100%;" />
    </eco-content>
    <eco-content top='50vh' bottom='0px' type='tool' style='background: #f5f5f5;overflow:hidden;overflow-y: auto;padding:10px 20px'>
      <el-table :data="tableData" highlight-current-row stripe tooltip-effect='dark' header-row-class-name='tableHeader' style="width: 100%" class="table">
        <el-table-column prop="phaseIdName" label="节点" width="180">
        </el-table-column>
        <el-table-column prop="approveUserName" label="审批人员" width="180">
        </el-table-column>
        <el-table-column prop="time" label="审批时间">
        </el-table-column>
        <el-table-column prop="opinion" label="意见内容">
        </el-table-column>
      </el-table>
    </eco-content>
  </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {
  getHistoryList
} from "../../service/service.js";
import liuchentu from "../../views/index.vue"
export default {
  components: {
    liuchentu,
    ecoContent
  },
  data() {
    return {
      flowSrc:'',
      tableData:[],
      id:'',
      title: '帅气'
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.flowSrc = '/modelflowView/index.html#/index/programFlowGraph/'+this.id;
    this.getList()
  },
  methods: {
    getList() {
      getHistoryList(this.id).then((res) => {
        this.tableData = res.data.rows
      })
    },
  },
};
</script>
<style scoped>
.historyComments {

}

.table {
    /* margin: 7vh 0 0;
    overflow-y: auto;
    bottom: 0;
    height: 53vh; */
}
</style>
