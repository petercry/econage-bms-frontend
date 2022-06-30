<template>
   <eco-content
    top="0px"
    bottom="0px"
    type="tool"
    style="background-color:#f5f5f5"
  >
 <div class="preReviewDetail">
      <eco-content
        top="0px"
        height="60px"
        type="tool"
        style="border-bottom:1px solid #ddd;box-sizing:border-box"
      >
        <el-row style="padding:12px 10px;background-color:#fff;">
          <el-col :span="24">
            <eco-tool-title
              style="line-height: 34px;margin-right:50px;fontWeight:700;"
              :title="'项目方案详情'"
            ></eco-tool-title>
            <el-button type="primary" @click="goBack" class="fr-right"><i class="el-icon-back" style="margin-right:8px"></i>返回列表</el-button>
          </el-col>
        </el-row>
      </eco-content>
        <eco-content
        bottom="0"
        top="60px"
        ref="content"
        class="ecoContentClass"
      >
    <el-tabs type="border-card">
    <el-tab-pane label="预审基本信息">
      <baseInfo></baseInfo>
    </el-tab-pane>
    <el-tab-pane label="预审文档信息">
      <fileInfo></fileInfo>
    </el-tab-pane>
    <el-tab-pane label="预审过程信息">
      <processInfo></processInfo>
    </el-tab-pane>
    <el-tab-pane label="预审评分信息">
       <scoreInfo></scoreInfo>
    </el-tab-pane>
    </el-tabs>
      </eco-content>
 </div>
   </eco-content>
</template>

<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import ecoToolTitle from '@/components/tool/ecoToolTitle.vue'
import { sysEnv } from '@/modulesExtend/extend/flowManage/config/env.js'
import { EcoUtil } from '@/components/util/main.js'
import { EcoMessageBox } from '@/components/messageBox/main.js'
import { mapActions, mapGetters, mapState } from 'vuex'
import { Loading } from 'element-ui';
import data   from '../data.json'
import baseInfo from './components/baseInfo.vue'
import fileInfo from './components/fileInfo.vue'
import processInfo from './components/processInfo.vue'
import scoreInfo from './components/scoreInfo.vue'
export default {
 name: 'preReviewDetail',
 components: {
    ecoContent,
    ecoLoading,
    ecoToolTitle,
    baseInfo,
    fileInfo,
    processInfo,
    scoreInfo
 },
 data () {
 return {
   id:'',
 }
 },
 created() {
   this.id=this.$route.params.id
 },
 methods:{
    goBack(){
       if(sysEnv!==1){
          this.$router.go(-1)
       }else{
          let tabObj = {};
          tabObj.desc = '项目预审列表'
          let goPage = "flowManage/index.html#/preViewList";
          tabObj.r_func = "{menuTarget:'IFRAME',tabKey:'preViewList',href_link:'" + goPage + "'}";
          tabObj.reload = true;
          tabObj.clearIframe = true;
          EcoUtil.getSysvm().doTab(tabObj);
          let that=this
          setTimeout(() => {
              window.parent.window.sysvm.removeTab('preReviewDetail' + that.id);
          }, 100);
       }
    }
 }
}
</script>

<style  scoped>
.preReviewDetail {
  position: relative;
  height: 96%;
  margin: 0 24px;
  top: 2%;
  overflow-y: hidden;
  min-width: 1131px;
  border: 1px solid #ddd;
  color: #0f1419;
}
.ecoContentClass{
  padding: 20px;
  overflow-y:hidden;
}
.el-tabs /deep/ .el-tabs__header{
  background-color: #fff ;
}
.el-tabs{
  /* height: calc(100% - 80px); */
  height: 100%;
}
.el-tabs /deep/ .el-tabs__content{
  height: 95%;
  overflow: auto;
}
</style>
