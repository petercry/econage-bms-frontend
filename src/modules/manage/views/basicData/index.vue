<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="$t('common.loading')"></ecoLoading>
      <eco-content top="0" height="40px" style="overflow-y:hidden;">
        <el-tabs class="centerTab" v-model="activeName">
          <el-tab-pane label="枚举" name="enumPage"></el-tab-pane>
          <el-tab-pane label="流水号" name="commonSequence"></el-tab-pane>
        </el-tabs>
      </eco-content>
      <eco-content top="40px" bottom="0">
        <component :is="activeName"></component>
      </eco-content>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import ecoLoading from '@/components/loading/ecoLoading.vue'
import enumPage from './enum.vue'
import commonSequence from '../commonSequence/index.vue'
export default{
  name:'basicData',
  components:{
    ecoLoading,
    ecoContent,
    enumPage,
    commonSequence
  },
  data(){
    return {
      activeName:'enumPage',
    }
  },
  mounted(){
  },
  methods: {
      
  },
  watch: {

  }
}
</script>
<style>
.menuitem{
  position: relative;
}
.menuitem .point{
  position: absolute;
  left: -16px;
  color: #888;
}
.menuitem .icon {
  font-size:12px;
  margin-right: 4px;
}
.centerTab .el-tabs__nav{
  margin-left: 50%;
  right: 55px;
}
</style>
