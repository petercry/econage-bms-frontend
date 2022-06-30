<template>
    <div class="templatesCard">
        <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="项目卡片" name="card">
                <update-templates></update-templates>
            </el-tab-pane>
            <el-tab-pane label="里程碑" name="miles" :lazy="true">

                <miles></miles>

            </el-tab-pane>
            <!-- <el-tab-pane label="角色" name="role" :lazy="true">
                <role></role>
            </el-tab-pane> -->
            <el-tab-pane label="团队" name="group" :lazy="true">
                <group></group>
            </el-tab-pane>
            <!-- <el-tab-pane label="专业" name="major" :lazy="true">
                <major></major>
            </el-tab-pane> -->
            <el-tab-pane label="交付物" name="deliver" :lazy="true">
                <deliver-list></deliver-list>
            </el-tab-pane>
            <el-tab-pane label="权限" name="authority" :lazy="true">
                <authority-list></authority-list>
            </el-tab-pane>
            <el-tab-pane label="计划" name="plan" :lazy="true">

                <plan></plan>

            </el-tab-pane>
        </el-tabs>
        <el-button type="text" class="backBtn" size="small" @click="goBack">
            <i class="el-icon-back" style="margin-right:2px"></i> 返回
        </el-button>

    </div>
</template>

<script>
  import updateTemplates from './addOrUpdateTemplates.vue'
  import miles from '../miles/index.vue'
  import deliverList from '../deliver/list.vue'
  import authorityList from '../authority/list.vue'
  import major from '../major/index.vue'
  import group from '../group/index.vue'
  import role from '../role/index.vue'
  import plan from '../task/plan/index.vue'
  export default{
      name:'templatesCard',
      data(){
          return {
              modelId:0,
              activeName:"card"
          }
      },
      created(){
         window.isInCard = true;
         this.modelId = this.$route.params.modelId;
      },
      components:{
          updateTemplates,
          miles,
          deliverList,
          authorityList,
          major,
          group,
          role,
          plan
      },
      methods: {
          handleClick(tab, event) {
              this.$router.push({name:'templatesCard'});
          },
          goBack(){
               delete window.isInCard;
              this.$router.replace({name:'templates-list'});
          }
      },
      watch: {

      }
  }

</script>
<style>
.templatesCard{
    position: relative;
    height: 96%;
    margin: 0 24px;
    top: 2%;
    overflow-y: hidden;
    min-width: 1131px;
    border: 1px solid #ddd;
    color:#0f1419;
}
.templatesCard .el-tabs{
    height: 100%;
}
.templatesCard .el-tabs__content{
    height: calc(100% - 33px);
    padding: 0;
    background: #f5f5f5;
}
.templatesCard .el-tab-pane{
    height: 100%;
}
.templatesCard .backBtn{
    position: absolute;
    top: 0;
    right: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #0e152c !important;
    line-height: 40px;
    margin: 0;
    padding: 0;
}
</style>
