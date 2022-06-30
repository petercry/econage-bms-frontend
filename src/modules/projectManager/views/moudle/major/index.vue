<template>
    <div class="majorSetting">
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
  name:'majorSetting',
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
        if(name == "deleteMajor"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updateMajor" || name == "addMajor"){
          this.$refs['leftTree'].reloadCurrentNode(data);
        }else if(name == "updateMajorType" || name == "addMajorType"){
          this.$refs['leftTree'].reloadNode(data);
        }
      }
  },
  watch:{
   
  },

};
</script>

<style scoped>
  .majorSetting{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .majorSetting .el-container{
    height: 100%;
  }

  .majorSetting .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .majorSetting .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
