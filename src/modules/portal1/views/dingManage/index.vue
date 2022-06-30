<template>
    <ecoContent top="0" bottom="0" class="layout container" style="padding:40px 30px 20px;">
      <div style="position:absolute;top:12px;left:30px;">
        <ecoBreadList></ecoBreadList>
      </div>
      <el-card class="subject-card" style="position:relative">
        <div slot="header" class="clearfix">
          <span>钉钉同步</span>
        </div>
        <ecoContent class="themeList" top="58px" bottom="0" style="padding:12px 24px;">
         <div v-if="isDingOpen">
           <el-button type="primary" @click.native="openDingSync">
              开启钉钉同步
              <i class="el-icon-check el-icon--right"></i>
            </el-button>
         </div>
         <div v-else style="color:#999;">钉钉人员同步未开启</div>
        </ecoContent>
      </el-card>
    </ecoContent>
</template>
<script>
import {getDingSync,configDingSync} from '@/modules/portal1/service/service.js'
import ecoContent from '@/components/pageAb/ecoContent.vue'
import {mapMutations} from 'vuex'
import EcoUtil from '@/components/util/main.js'
import ecoBreadList from '@/modules/portal1/views/components/ecoBreadList.vue'
  export default{
      name:'dingManage',
      components:{
        ecoContent,
        ecoBreadList
      },
      data() {
        return {
         isDingOpen:false
        }
      },
      created(){
      },
      mounted() {
       this.getDingSync();
      },
      methods: {
        getDingSync(){
          getDingSync().then(res=>{
            if (res.data){
              this.isDingOpen = res.data.enabled;
            }
          }).catch(e=>{})
        },
        openDingSync(){
          configDingSync().then(res=>{
          }).catch(e=>{})
        }
      }
  }
</script>
<style scoped>
.subject-card{
  height: 100%;
}
</style>
