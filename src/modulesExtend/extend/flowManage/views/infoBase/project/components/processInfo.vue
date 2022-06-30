<template>
 <div class="processInfo">
    <!-- 过程信息 -->
    <el-steps direction="vertical" :active="1">
      <el-step title="项目预审" description="2018-10-30 09:38:33 -- 2019-03-04 03:52:26"></el-step>
      <el-step title="分类推送"></el-step>
    <el-step title="建设方案评审" description="2018-11-14 02:54:46 -- 2018-11-19 09:12:42"></el-step>
    </el-steps>
 </div>
</template>

<script>
export default {
 name: 'processInfo',
 data () {
 return {
   dataList:[
      {
         time:'2020-11-03 15:45:16',
         data1:'项目方案申报',
         data2:'流程节点处理人：申报账号',
         data3:'节点处理意见：未填写'
      },{
        time:'2020-12-04 09:42:08',
        data1:'申报材料审核',
        data2:'流程节点处理人：数据局工作人员',
        data3:'节点处理意见：未填写'
      }
   ]
 }
 }
}
</script>

<style scoped>
.processInfo{
  height:100%;
}
.content{
  height: 100px;
}
.left{
    text-align: right;
    width: 110px;
    position: relative;
    padding-top: 30px;
    padding-right: 8px;
    font-size: 14px;
    color: #676A6C;
}
.right{
    border-left: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    padding-left: 10px;
    width: 70%;
    height: 100%;
}
.right p {
  line-height: 26px;
  font-size: 14px;
  color: #676A6C;
}
.date{
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    width: 30px;
    height: 30px;
    text-align: center;
    border-top: 1px solid #e7eaec;
    border-bottom: 1px solid #e7eaec;
    border-left: 1px solid #e7eaec;
    background: #f8f8f8;
    font-weight: 700;
    box-sizing: border-box;
}
</style>
