<template>
    <div class="roleSetting">
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
  name:'roleSetting',
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
        if(name == "deleteRole"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updateRole" || name == "addRole"){
          this.$refs['leftTree'].reloadCurrentNode(data);
        }else if(name == "updateRoleType" || name == "addRoleType"){
          this.$refs['leftTree'].reloadNode(data);
        }
      }
  },
  watch:{
   
  },

};
</script>

<style scoped>
  .roleSetting{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .roleSetting .el-container{
    height: 100%;
  }

  .roleSetting .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .roleSetting .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
