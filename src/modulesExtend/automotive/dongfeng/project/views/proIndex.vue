<template>
    <eco-content top="2px" bottom="0px" class="proIndex">

        <el-tabs v-model="activeTab" @tab-click="changeProTab" >
            <el-tab-pane label="基本信息" name="proBaseInfo"></el-tab-pane>
            <el-tab-pane label="项目成员" name="proMember"></el-tab-pane>
            <el-tab-pane label="项目节点及计划" name="proPlanGantt"></el-tab-pane>
            <el-tab-pane label="设计法规点检" v-if='initRole.PAGE_DESIGN_CHECK.permission.VISIBLE' name="taskList"></el-tab-pane>
            <el-tab-pane label="实车法规点检" v-if='initRole.PAGE_CAR_CHECK.permission.VISIBLE' name="checkList"></el-tab-pane>
        </el-tabs>

        <div class="content"  >
            <transition name="router-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>

    </eco-content>
</template>
<script>

import ecoContent from '@/components/pageAb/ecoContent.vue'
import { mapState,mapActions } from 'vuex';

export default {
      components:{
          ecoContent,
      },
      data(){
          return{
              notDefaultPage:'',
              activeTab:'proBaseInfo'
          }
      },
      created(){
            this.notDefaultPage =this.$route.query.notDefaultPage;
            this.initProjectBaseData();
            this.setRole(this.$route.params.proId).then(()=>{
                if(this.notDefaultPage){
                    //待办中心跳转
                    var val = this.notDefaultPage.split('-')[0];
                    if(val == 'realVehicle'){
                        val = 'checkList'; 
                    }
                    this.activeTab = val;
                    this.changeProTab();
                }
            })
      },
      mounted(){

      },
      computed:{
        ...mapState(['baseData','typeImgList','initRole'])
      },
      methods: {
         ...mapActions([
            'initProjectBaseData',
            'setRole'
        ]),
        changeProTab(){
              if(this.notDefaultPage){
                this.$router.push({name:this.activeTab,query:{notDefaultPage:this.notDefaultPage.split('-')[1]}});
              }else{
                this.$router.push({name:this.activeTab});
              }
        }
      }
  }

</script>

<style scoped>
.proIndex{
    padding:0px 20px 20px 20px;
    background-color:#fff;
}



.proIndex .content{
     position:absolute;
     left: 0;
     right: 0;
     top: 41px;
     bottom:0px;
     background-color: #fff;
     z-index: 100;
     overflow-y: auto;
  }


</style>
