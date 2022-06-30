<template>
    <div class="groupSetting">
        <el-container>
            <el-container class="fixHeight">
              <el-aside width="250px"><leftTree ref="leftTree" :editable="editable"></leftTree></el-aside>
              <el-main><router-view @callBack="callBack" :editable="editable"></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import leftTree from './leftTree.vue'
import { mapActions } from 'vuex'
export default {
  name:'groupSetting',
  components: {
     leftTree,
  },
  data() {
    return {
       editable:window.editable,
    }
  },
  created() {
      if(this.$route.params.infoId && this.$route.params.infoId > 0){
          this.setGroupRole(this.$route.params.infoId);
      }

      window.groupSettingVM = this;
  },
  activated(){

  },

  mounted(){
     this.callAction();
  },

  computed: {

  },

  methods: {
       callAction(){
        window.tabClickFunc = function(){
            window.groupSettingVM.setRoleList();
        }
      },
       ...mapActions([
          'setGroupRole','setRoleList',
      ]),

      callBack(name,data){
        if(name == "deleteGroup"){
          this.$refs['leftTree'].deleteTreeList(data);
        }else if(name == "updateGroup" || name == "addGroup"){
          this.$refs['leftTree'].reloadCurrentNode(data);
        }else if(name == "updateGroupType" || name == "addGroupType"){
          this.$refs['leftTree'].reloadNode(data);
        }
      }
  },
  watch:{

  },

};
</script>

<style scoped>
  .groupSetting{
     position: relative;
    height: 96%;
    margin: 0 20px;
    top: 2%;
    overflow-y: hidden;
  }
  .groupSetting .el-container{
    height: 100%;
  }

  .groupSetting .el-aside{
    background: #fff;
       overflow: hidden;
    margin-right: 20px;
  }
  .groupSetting .el-container .el-main{
    padding: 0;
    background: #fff;
    overflow: hidden;

  }
</style>
