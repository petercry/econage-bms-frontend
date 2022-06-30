<template>
  <div>
    <el-tabs class="serviceTab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="最多跑一次" name="serviceList"></el-tab-pane>
      <el-tab-pane label="应用系统" name="appList"></el-tab-pane>
      <el-tab-pane label="管理配置" name="manageConfig"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  export default{
      name:'mainTab',
      computed: {
      },
      data() {
        return {
          activeName:""
        }
      },
      created(){
      },
      mounted(){
        this.activeName = this.$route.name;
        this.setBreadRoot(this.$route.name)
      },
      methods: {
        ...mapMutations(['SET_BREAD']),
        handleClick(val){
          this.setBreadRoot(val.name)
          this.$router.push({
            name:val.name
          })
        },
        setBreadRoot(name){
          let label = '';
          if (name=='serviceList'){
            label='首页';
          }
          if (name=='appList'){
            label='应用系统';
          }
          if (name=='manageConfig'){
            label='管理配置';
          }
          this.SET_BREAD([{
            label:label,
            to:{
              name:name
            }
          }])
        }
      },
      watch:{
        '$route.name'(val){
          this.$nextTick(()=>{
            this.activeName = this.$route.name;
          })
        }
      }
  }
</script>
<style>
</style>
