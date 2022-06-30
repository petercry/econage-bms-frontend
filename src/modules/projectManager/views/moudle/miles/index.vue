<template>
    <div class="milesSetting">
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
import { mapActions } from 'vuex'
export default {
  name:'milesSetting',
  components: {
     leftTree,
  },
  data() {
    return {
       
    }
  },
  created() {
      if(this.$route.params.infoId && this.$route.params.infoId > 0){
          this.setMilesRole(this.$route.params.infoId);
      }
  },
  activated(){

  },

  mounted(){

  },

  computed: {

  },

  methods: {
       ...mapActions([
          'setMilesRole',
      ]),
      callBack(name,data){
        if(name == "deleteMiles"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updateMiles" || name == "addMiles"){
          this.$refs['leftTree'].reloadNode(data);
        }
      }
  },
  watch:{
   
  },

};
</script>

<style scoped>
  .milesSetting{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .milesSetting .el-container{
    height: 100%;
  }

  .milesSetting .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .milesSetting .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
