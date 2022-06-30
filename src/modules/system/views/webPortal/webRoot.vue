<template>
<div class="rootVue webRootVue" >
      <webHeader></webHeader>
      <router-view></router-view>
      <eFullScreen @setBtnDisplay="setBtnDisplay"></eFullScreen>
</div>
</template>

<script>

import {getRoleExistsUnionRef,isFacadeBranchOrg} from '../../service/service.js'
import webHeader from "./webHeader.vue"
import eFullScreen from "../layout/eFullScreen.vue"
import {EcoUtil} from '@/components/util/main.js'
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'app',
  components:{
     webHeader,
     eFullScreen
  },

   computed:{
       ...mapState([
            'documentReady',
            'ecoSettingObj'
       ])
   },

  data(){
    return {
        fullScreenBtnDisplay:false
    }
  },
  created(){
       this.getRoleExistsUnionRefFunc();
       this.isFacadeBranchOrg();
  },
  methods: {
      ...mapMutations([
            'SET_ECO_SETTING_OBJ',
      ]),

      goFullScreenPage(){
            window.fullScreenVm.setFullScreenStatus(true);
      },
      setBtnDisplay(obj){
            this.fullScreenBtnDisplay = obj.display;
      },

       //是否是某个用户组
      getRoleExistsUnionRefFunc(){
                if(window.sysSetting.sysAdminRoleId){
                    let _idsArray = window.sysSetting.sysAdminRoleId.split(",");
                    getRoleExistsUnionRef(_idsArray).then((response)=>{
                          let ecoSettingObj = this.ecoSettingObj;
                          ecoSettingObj['sysAdmin'] = null;
                          ecoSettingObj['sysAdmin'] = response.data;
                          ecoSettingObj['webPlatform'] = true; /*web平台*/
                          this.SET_ECO_SETTING_OBJ(ecoSettingObj);
                    })
                }
      },

      //是否设置了分级管控
      isFacadeBranchOrg(){
            if (window.sysSetting.disableBpm){//有些项目没有/bpm的接口
                  return;
            }
            isFacadeBranchOrg().then((response)=>{
                        let ecoSettingObj = this.ecoSettingObj;
                        ecoSettingObj['branchDeptEnabled'] = response.data.branchDeptEnabled;
                        ecoSettingObj['branchDepartments'] = response.data.departments;
                        ecoSettingObj['branchNearestDeptId'] = response.data.nearestDeptId;
                        ecoSettingObj['webPlatform'] = true;      /*web平台*/
                        this.SET_ECO_SETTING_OBJ(ecoSettingObj);
            })
      }
  }
}
</script>


<style scoped>


</style>
