<template>
 <div class="yuSuan">
   <div class="item">
     <el-col>
         <el-tag class="inline" color="#1ab394"  effect="dark">项目总投资</el-tag>
    <span>信息化建设专项（政府投资类）</span>
     </el-col>
    <el-progress :percentage="100" style="width:80%" color="#1ab394" class="inline"></el-progress>
    <el-tag class="inline" color="#1ab394"  effect="dark">360.0万</el-tag>
   </div>
   <div class="item">
     <el-col>
            <el-tag class="inline" color="#f8ac59"  effect="dark">2016</el-tag>
    <span>当年预算安排 (按360万元立项，剩余260万在2017年及以后年度按排）</span>
     </el-col>
 <el-progress :percentage="27.8" style="width:80%" color="#f8ac59" class="inline"></el-progress>
    <el-tag class="inline" color="#f8ac59"  effect="dark">100.0万</el-tag>
   </div>
   <div class="item">
     <el-col>
        <el-tag class="inline" color="#f8ac59"  effect="dark">2017</el-tag>
    <span>当年预算安排</span>
     </el-col>
     <el-progress :percentage="72.2" style="width:80%" color="#f8ac59" class="inline"></el-progress>
    <el-tag class="inline" color="#f8ac59"  effect="dark">260.0万</el-tag>
   </div>
 </div>
</template>

<script>
export default {
 name: 'yuSuan',
 data () {
 return {
 }
 }
}
</script>

<style scoepd>
.yuSuan{
  padding: 30px;
  /* text-align: center; */
}
.inline{
  display: inline-block;
}
.item{
  margin-bottom: 40px;
}
</style>
