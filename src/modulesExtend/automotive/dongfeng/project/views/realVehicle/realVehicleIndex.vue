<template>
    <eco-content top="2px" bottom="0px" class="realVehicleIndex">
      <el-tabs v-model="activeName" type="card" @tab-click="changeProTab">
        <el-tab-pane label="点检清单" name="checkList" v-if='initRole.PAGE_CC_TASK_LIST.permission.VISIBLE'></el-tab-pane>
        <el-tab-pane label="法规专业负责人审核" name="personAudit" v-if='initRole.PAGE_CC_REGULATION_PROFESSION_LEADER.permission.VISIBLE'></el-tab-pane>
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
  import {mapState} from 'vuex'
  export default {
    name:'realVehicleIndex',
    data() {
      return {
        notDefaultPage:'',
        activeName: "checkList",
      };
    },
    components: {
      ecoContent,
    },
    computed:{
      ...mapState(['initRole'])
    },
    mounted() {
        this.notDefaultPage = this.$route.query.notDefaultPage;
        if(this.notDefaultPage && this.notDefaultPage==="personAudit"){
          this.activeName = this.notDefaultPage;
          this.changeProTab();
        }
    },
    methods: {
      changeProTab() {
        this.$router.push({ name: this.activeName });
      },
    },
  };
  </script>
  
  <style scoped>
  .realVehicleIndex {
    padding: 20px 20px 0 20px;
  }
  .realVehicleIndex .content {
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
  