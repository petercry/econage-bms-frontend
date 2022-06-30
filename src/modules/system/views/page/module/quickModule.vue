<template>
<el-card  :body-style="{ padding: '0 20px'}" style="" shadow='never'>
  <div style="position:relative;">
    
    <div class="homeTitle border">
        快捷入口
        <span class="more cpointer" @click="goMore()">({{toDoParams.total}})</span>
    </div>

    <div style="padding:20px 0;height:200px;">
      <div v-if="toDoParams.total==0"  class="noContent">暂无流程数据</div>
    </div>

  </div>
</el-card>
</template>

<script>


export default {
  components: {},
  data() {
    return {
        toDoList:[],
        toDoParams:{
            folder:'0',                      //-1 全部 0 进行中 1 已完成/被拒绝 2 已取消
            page:1,
            rows:4,
            total:0,
            sort:'assign_date',
            order:'desc',
            groupTemp:'-1',
            groupId: '-1',
            subGroupId:'-1',
            templdateId: '-1',
        }
    };
  },

  computed: {
      
  },
  created() {
   
  },
  mounted() {
     
  },
  methods: {
        
    
  },
  watch:{
       
  }
};
</script>

<style scoped>

.noContent{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 30px;
  line-height: 30px;
}
</style>
