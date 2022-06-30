<template>
 <div class="heTong">
      <el-table
      :data="tableData"
      :header-cell-style="{color:'#676A6C',fontSize:'14px',fontWeight:'bold'}"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="合同编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="合同金额(万元)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="支付完成比例">
      </el-table-column>
      <el-table-column
        prop="address"
        label="供应商名称">
      </el-table-column>
      <el-table-column
        prop="address"
        label="下载合同">
      </el-table-column>
    </el-table>
 </div>
</template>

<script>
export default {
 name: 'heTong',
 data () {
 return {
   tableData:[]
 }
 }
}
</script>

<style >

</style>
