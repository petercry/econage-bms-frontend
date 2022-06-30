<template>
    <div>
      <eco-content height="40px" top="0" style="overflow: hidden;">
        <el-tabs class="u-tab" v-model="activeName">
          <el-tab-pane label="基础信息" name="baseInfo"></el-tab-pane>
          <!-- <el-tab-pane label="菜单配置" name="menuConfig"></el-tab-pane> -->
          <!-- <el-tab-pane label="模块权限" name="modPermission"></el-tab-pane> -->
          <!-- <el-tab-pane label="角色" name="role"></el-tab-pane> -->
          <el-tab-pane label="成员" name="member"></el-tab-pane>
        </el-tabs>
        <!-- <el-button size="small" style="position: absolute;top: 3px;right: 10px;" @click.native="back">返回</el-button> -->
      </eco-content>
      <eco-content top="40px" bottom="0">
        <component :is="activeName"></component>
        <!-- <component :is="'modPermission'"></component> -->
      </eco-content>
    </div>
</template>
<script>
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoContent from '@/components/pageAb/ecoContent.vue'

import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import baseInfo from './components/baseInfo.vue'
// import menuConfig from './components/menuConfig.vue'
// import modPermission from './components/modPermission.vue'
// import role from './components/role.vue'
import member from './components/member.vue'
export default{
  name:'userGroup',
  components:{
    ecoLoading,
    ecoContent,
    baseInfo,
    // menuConfig,
    // modPermission,
    // role,
    member,
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
