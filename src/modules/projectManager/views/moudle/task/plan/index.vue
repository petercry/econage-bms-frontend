<template>
    <div class="planIndex">
        <el-container>
            <el-container class="fixHeight">
              <el-aside width="420px"><leftTree ref="leftTree"></leftTree></el-aside>
              <el-main><router-view @callBack="callBack"></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import leftTree from './leftTree.vue'
import { mapActions } from 'vuex'
export default {
  name:'planIndex',
  components: {
     leftTree,
  },
  data() {
    return {

    }
  },
  created() {
      if(this.$route.params.infoId && this.$route.params.infoId > 0){

      }
  },
  activated(){

  },

  mounted(){

  },

  computed: {

  },

  methods: {
      callBack(name,data){
        if(name == "deletePlan"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updatePlan" || name == "addPlan"){
          this.$refs['leftTree'].reloadNode(data);
        }
      }
  },
  watch:{

  },

};
</script>

<style scoped>
  .planIndex{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .planIndex .el-container{
    height: 100%;
  }

  .planIndex .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .planIndex .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
