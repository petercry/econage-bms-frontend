<template>
  <eco-content top="2px" bottom="0px" class="design">
    <el-tabs v-model="activeName" type="card" @tab-click="changeProTab">
      <el-tab-pane label="点检任务清单" name="taskList"></el-tab-pane>
      <el-tab-pane label="联络人确认" name="liaison" v-if='initRole.PAGE_DC_CONTACT.permission.VISIBLE'></el-tab-pane>
      <el-tab-pane label="设计师办理" name="designList" v-if='initRole.PAGE_DC_DESIGNER.permission.VISIBLE'></el-tab-pane>
      <el-tab-pane label="部门专业负责人审核" name="departmentHead" v-if='initRole.PAGE_DC_DEPT_PROFESSION_LEADER.permission.VISIBLE'></el-tab-pane>
      <!-- <el-tab-pane label="部门联络人审核" name="DepartmentContact"></el-tab-pane> -->
      <el-tab-pane label="法规项目联络人审核" name="RegulatoryContact" v-if='initRole.PAGE_DC_REGULATION_PROJECT_CONTACT.permission.VISIBLE'></el-tab-pane>
      <el-tab-pane label="法规专业负责人审核" name="RegulatoryHead" v-if='initRole.PAGE_DC_REGULATION_PROFESSION_LEADER.permission.VISIBLE'></el-tab-pane>
    </el-tabs>

    <div class="content">
      <transition name="router-fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </eco-content>
</template>
<script>
import ecoContent from "@/components/pageAb/ecoContent.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    ecoContent,
  },
  computed:{
     ...mapState(['initRole'])
  },
  data() {
    return {
      notDefaultPage:'',
      activeName: "taskList",
    };
  },
  created() {
     this.notDefaultPage = this.$route.query.notDefaultPage;
     if(this.notDefaultPage){   
       if(this.notDefaultPage==="liaison" || this.notDefaultPage==="designList" || this.notDefaultPage==="departmentHead" || this.notDefaultPage==="DepartmentContact" || this.notDefaultPage==="RegulatoryContact" || this.notDefaultPage==="RegulatoryHead"){
          //防止别的模块的query赋值
          this.activeName = this.notDefaultPage;
          this.changeProTab();
       }
     }
  },
  mounted() {},
  methods: {
    changeProTab() {
      this.$router.push({ name: this.activeName });
    },
  },
};
</script>

<style scoped>
.design {
  padding: 20px 20px 0 20px;
}
.design .content {
  position: absolute;
  left: 0;
  right: 0;
  top: 61px;
  bottom: 0px;
  background-color: #fff;
  z-index: 100;
  overflow-y: auto;
}
</style>
