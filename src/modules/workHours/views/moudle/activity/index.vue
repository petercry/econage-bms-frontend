<template>
    <div class="activity">
        <el-container>
            <el-container class="fixHeight">
              <el-aside width="250px"><leftTree ref="leftTree"></leftTree></el-aside>
              <el-main><router-view @callBack="callBack"></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import leftTree from './leftTree.vue'
export default {
  name:'activity',
  components: {
     leftTree,
  },
  data() {
    return {
       
    }
  },
  created() {
      
  },
  activated(){

  },

  mounted(){
      
  },

  computed: {
    
  },

  methods: {
      callBack(name,data){
        if(name == "deleteActivity"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updateActivity" || name == "addActivity"){
          this.$refs['leftTree'].reloadCurrentNode(data);
        }
      }
  },
  watch:{
   
  },

};
</script>

<style scoped>
  .activity{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .activity .el-container{
    height: 100%;
  }

  .activity .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .activity .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
