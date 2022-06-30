<template>
<div>
    <eMain></eMain>
</div>
</template>

<script>

import {getRoleExistsUnionRef,isFacadeBranchOrg} from './service/service.js'
import {mapState,mapMutations} from 'vuex'

import eMain from "./views/layout/eMain.vue"

export default {
  name: 'app',
  components:{
     eMain
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
                if(window.sysSetting && window.sysSetting.sysAdminRoleId){
                    let _idsArray = window.sysSetting.sysAdminRoleId.split(",");
                    getRoleExistsUnionRef(_idsArray).then((response)=>{
                          let ecoSettingObj = this.ecoSettingObj;
                          ecoSettingObj['sysAdmin'] = null;
                          ecoSettingObj['sysAdmin'] = response.data;
                          this.SET_ECO_SETTING_OBJ(ecoSettingObj);
                    })
                }
      },

      //是否设置了分级管控
      isFacadeBranchOrg(){
              isFacadeBranchOrg().then((response)=>{
                  let ecoSettingObj = this.ecoSettingObj;
                      ecoSettingObj['branchDeptEnabled'] = response.data.branchDeptEnabled;
                      ecoSettingObj['branchDepartments'] = response.data.departments;
                      ecoSettingObj['branchNearestDeptId'] = response.data.nearestDeptId;
                      this.SET_ECO_SETTING_OBJ(ecoSettingObj);
              })
      }
  }
}
</script>


<style scoped>

</style>
