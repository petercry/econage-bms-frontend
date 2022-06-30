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
  name:'loginDisplay',
  components: {
     ecoLoading
  },
  data() {
    return {
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
          let ecoToken = this.$route.params.ecoToken;
          sessionStorage.setItem('ecoToken',ecoToken);
          // this.$router.replace({name:'index'});
          location.href="/portalIndex/#/serviceList";
      },
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
