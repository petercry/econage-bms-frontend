<template>
<div class="sysInitVue" >

</div>
</template>

<script>


import {EcoUtil} from '@/components/util/main.js'
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'app',
  components:{
   
  },

   computed:{
       ...mapState([
          'documentReady',
          'tempObj'
       ])
   },

  data(){
    return {
        fullScreenBtnDisplay:false,
        theme:'default'
    }
  },
  created(){
      this.init();
  },
  methods: {
     ...mapMutations([
          'SET_TEMP_OBJ',
      ]),

      init(){
           let _action = localStorage.getItem('ecoSysLoginAction');
           localStorage.removeItem('ecoSysLoginAction');
           if(_action == 'sso'){
                let _targetURL = localStorage.getItem('ecoSSOTargetURL');
                let _requestSource = localStorage.getItem('ecoSSORequestSource');
                let _asideHidden = localStorage.getItem('ecoSSOAsideHidden');

                localStorage.removeItem('ecoSSOTargetURL');
                localStorage.removeItem('ecoSSORequestSource');
                localStorage.removeItem('ecoSSOAsideHidden');

                this.setTempStore('TARGETURL',_targetURL);
                this.setTempStore('REQUESTSOURCE',_requestSource);
                this.setTempStore('SYSINITACTION','sso');
                this.setTempStore('ASIDEHIDDEN',_asideHidden);

                this.goPlatform();
          }else{
                this.goPlatform();
          }
      },

      goPlatform(){
            if(window.sysSetting && window.sysSetting.webPlatform){ //web门户
                this.$router.replace({name:'webPlatform'});
            }else{
                this.$router.replace({name:'workPlatform'});
            }
      },

       setTempStore(key,value){
            let tempStore = this.tempObj;
            tempStore[key] = null;
            tempStore[key] = value;
            this.SET_TEMP_OBJ(tempStore);
      },
  },
  watch:{
   
  }
}
</script>


<style scoped>


</style>
