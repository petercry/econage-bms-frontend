<template>
    <ecoContent top="0" bottom="0" class="container layout">
      <div style="position:absolute;top:12px;left:30px;">
        <ecoBreadList></ecoBreadList>
      </div>
      <ecoContent class="layout" top="40px" bottom="20px" style="width:200px;padding:0 30px;right:auto;" :style="{width:(leftWidth+60)+'px'}">
        <themeManage ref="themeManage" class="subject-card"></themeManage>
      </ecoContent>
      <ecoContent class="layout" top="40px" bottom="20px" style="left:260px;padding:0 30px;" :style="{left:(leftWidth+90)+'px'}">
        <mainSubject ref="mainSubject" class="subject-card"></mainSubject>
      </ecoContent>
    </ecoContent>
</template>
<script>
import ecoContent from '@/components/pageAb/ecoContent.vue'
import mainSubject from './components/mainSubject.vue'
import themeManage from './components/theme.vue'
import EcoUtil from '@/components/util/main.js'
import {mapMutations} from 'vuex'
import ecoBreadList from '@/modules/portal1/views/components/ecoBreadList.vue'
  export default{
      name:'groupManage',
      components:{
        ecoContent,
        themeManage,
        mainSubject,
        ecoBreadList
      },
      data() {
        return {
          leftWidth:450,
        }
      },
      created(){
      },
      mounted(){
        window.ecoFrameVm = this; //添加监听
        this.addMonitor(); //添加监听
      },
      methods: {
        addMonitor(){
          let callBackDialogFunc = function(obj){
              if(obj && (obj.action == 'themeUpdateCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.$refs.themeManage.getList()
              }
              if(obj && (obj.action == 'groupUpdateCallBack')){ //回调的唯一标识符
                window.ecoFrameVm.$refs.mainSubject.getList()
              }
          }
          EcoUtil.addCallBackDialogFunc(callBackDialogFunc);
        },
      }
  }
</script>
<style scoped>
.subject-card{
  height: 100%;
}
</style>
