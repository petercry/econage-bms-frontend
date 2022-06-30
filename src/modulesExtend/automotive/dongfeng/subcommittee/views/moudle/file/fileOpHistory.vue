<template>
  <div class="fileOpHistory">
    <!-- 操作历史 -->
    <el-table   style="width: 100%"  border :header-cell-style="{background:'#f5f7fa',
     color:'#000',fontWeight:700}" :data='listData'>
        <el-table-column label="类别" width="120" prop="type" >

        </el-table-column>
        <el-table-column label="用户" prop="userName">

        </el-table-column>
        <el-table-column label="时间" width="180" prop="createDate">
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
      listData:[],
      info:{
        page:1,
        rows:10
      },
      id:''
    }
  },
  created() {
    this.id=this.$route.params.id
  },
  mounted() {
    this.getListFunc()
  },
  methods: {
    getListFunc(){
      getOperateRecord(this.id).then(res=>{
        this.listData=res
      })
    }
  },
}
</script>

<style scoped>
.fileOpHistory{
  padding: 20px;
}
.el-table /deep/ th.gutter {
  display: table-cell !important;
}

.el-table /deep/ colgroup.gutter {
  display: table-cell !important;
}
</style>
