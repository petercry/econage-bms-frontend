<template>
 <div class="scoreInfo">
      <!-- 评分信息 -->
      <div class="top">
           <p class="one">专家评分</p>
           <p>总分：.0</p>
           <p>评审意见：</p>
           <p>评审建议：</p>
           <p>建议建设内容：</p>
      </div>
      <eco-content bottom="20px" style="height:200px">
      <div class="bottom">
        <el-row>
             <el-col :span="12">
            <p class="one">管理评价</p>
        </el-col>
        <el-col :span="12">
             <p class="one">职能评价</p>
        </el-col>
        </el-row>
      </div>
      </eco-content >
 </div>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
export default {
 name: 'scoreInfo',
components: {
    ecoContent,
  },
 data () {
 return {
 }
 }
}
</script>

<style  scoped>
.scoreInfo{
  padding: 10px;
}
 p {
  color: #676a6c;
  line-height: 28px;
}
 .one{
  font-size: 24px;
}
.bottom{
  padding-left: 24px;
  height: 200px;
  width: 100%;
}
</style>
