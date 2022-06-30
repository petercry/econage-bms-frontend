<template>
    <div class="adapterPage" >

    </div>
</template>

<script>


import {EcoUtil} from '@/components/util/main.js'
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'adapter',
  components:{
   
  },
  computed:{
      
  },
  data(){
    return {
      
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
            if(window.sysSetting && window.sysSetting.webPlatform){ //web门户
                this.$router.replace({name:'webPlatform'});
            }else{
                this.$router.replace({name:'workPlatform'});
            }
      }
  },
  watch:{
   
  }
}
</script>


<style scoped>


</style>
