<template>
 <div class="fileInfo">
      <!-- 文档信息 -->
  <el-card class="box-card" shadow="never" v-for="item in dataList" :key="item.name">
  <div slot="header" class="clearfix">
    <span>{{item.name}}</span>
  </div>
  <div  class="text item">
      {{item.content}}
  </div>
</el-card>
 </div>
</template>

<script>
export default {
 name: 'fileInfo',
 data () {
 return {
   dataList:[ { name:'附件1',content:'【框架图】图片1.png'},{name:'附件2',content:'【项目方案】XX市数据资源平台2.0项目_建设方案_20201110-2.docx'}]
 }
 }
}
</script>

<style scoped>
.el-card{
  margin-bottom: 30px;
}
.el-card /deep/ .el-card__header{
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-weight: 600;
    height: 40px;
    line-height: 5px;
    font-size: 14px;
}
.el-card  /deep/ .el-card__body{
    color: #337ab7;
    cursor: pointer;
    font-size: 14px;
}
</style>
