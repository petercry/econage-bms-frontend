<template>
    <div>
      <eco-content height="40px" top="0" style="overflow: hidden;">
        <el-tabs class="u-tab" v-model="activeName">
          <el-tab-pane label="树形示例" name="treeDemo"></el-tab-pane>
          <el-tab-pane label="通用示例" name="commonDemo"></el-tab-pane>
        </el-tabs>
      </eco-content>
      <eco-content top="40px" bottom="0">
        <component :is="activeName"></component>
        <!-- <component :is="'modPermission'"></component> -->
      </eco-content>
    </div>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import treeDemo from './treeDemo/index.vue'
import commonDemo from './commonDemo/index.vue'
export default{
  name:'demo',
  components:{
    ecoContent,
    treeDemo,
    commonDemo
  },
  data(){
    return {
      activeName:'treeDemo'
    }
  },
  mounted(){
    if (this.$route.path.indexOf('commondemo')>-1){
      this.activeName = 'commonDemo'
    }
  },
  methods: {
    handleClick(){

    },
  },
  watch: {
    'activeName'(val){
      this.$router.push({name:this.activeName.toLowerCase()})
    }
  }
}
</script>
<style>
.u-tab .el-tabs__nav-wrap{
  padding: 0 20px;
}
</style>
