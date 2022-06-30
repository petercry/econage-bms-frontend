<template>
    <div>
      <eco-content height="40px" top="0" style="overflow: hidden;">
        <el-tabs class="u-tab" v-model="activeName">
          <el-tab-pane label="基础信息" name="baseInfo"></el-tab-pane>
          <el-tab-pane label="账号配置" name="accountConfig"></el-tab-pane>
          <!-- <el-tab-pane label="个人模块权限" name="modPermission"></el-tab-pane> -->
          <el-tab-pane label="个人角色" name="role"></el-tab-pane>
        </el-tabs>
        <el-button size="small" style="position: absolute;top: 3px;right: 10px;" @click.native="back">返回</el-button>
      </eco-content>
      <eco-content top="40px" bottom="0">
        <component :is="activeName"></component>
      </eco-content>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import baseInfo from './components/baseInfo.vue'
import role from './components/role.vue'
import accountConfig from './components/accountConfig.vue'
export default{
  name:'userEdit',
  components:{
    ecoLoading,
    ecoContent,
    baseInfo,
    // modPermission,
    role,
    accountConfig,
  },
  data(){
    return {
      activeName:'baseInfo'
    }
  },
  mounted(){
  },
  methods: {
    handleClick(){

    },
    back(){
        this.$router.go(-1);
    }
  },
  watch: {

  }
}
</script>
<style>
.u-tab .el-tabs__nav-wrap{
  padding: 0 20px;
}
</style>
