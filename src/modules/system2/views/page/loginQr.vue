<template>
    <div>
      <ecoLoading ref='ecoLoadingRef' :text="'登陆中'"></ecoLoading>
    </div>
</template>
<script>

import ecoLoading from '@/components/loading/ecoLoading.vue'
// import { Toast } from 'vant'
// import { Dialog } from 'vant';

export default {
  name:'loginQr',
  components: {
     ecoLoading
  },
  data() {
    return {
        code:'',
    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
   this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
        this.$refs.ecoLoadingRef.open();
      },
      
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
