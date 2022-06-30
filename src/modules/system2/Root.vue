<template>
<div class="rootVue" v-show="documentReady">
    <eAside></eAside>
    <eMain></eMain>
    <eFullScreen @setBtnDisplay="setBtnDisplay"></eFullScreen>
    <div class="ecoFullScreenBtn" @click="goFullScreenPage" v-show="fullScreenBtnDisplay" ><i class="icon iconfont icon-fanhui" title="返回门户"></i></div>
</div>
</template>

<script>
import eAside from "@/modules/system2/views/layout/eAside.vue"
import eMain from "@/modules/system2/views/layout/eMain.vue"
import eFullScreen from "@/modules/system2/views/layout/eFullScreen.vue"

import {mapState,mapMutations} from 'vuex'
export default {
  name: 'app',
  components:{
     eAside,
     eMain,
     eFullScreen
  },
   computed:{
       ...mapState([
            'documentReady',
       ])
   },

  data(){
    return {
        fullScreenBtnDisplay:false
    }
  },
  created(){
      
  },
  methods: {
      goFullScreenPage(){
            window.fullScreenVm.setFullScreenStatus(true);
      },
      setBtnDisplay(obj){
            this.fullScreenBtnDisplay = obj.display;
      }
  }
}
</script>
<style scoped>
.rootVue .ecoFullScreenBtn{
  position:fixed;
  bottom:50px;
  right:50px;
  z-index: 188;
  width: 50px;
  height: 50px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  background: #606266;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
  color: #fff;
  margin-left: 15px;
  cursor: pointer;
}

.rootVue .icon-fanhui{
  font-size: 24px;
}

</style>
