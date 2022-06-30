<template>
    <div class="child">
        {{this.baId}}

       <div class="d"></div>
    </div>
</template>
<script>

import {mapMutations} from 'vuex'
export default{
  name:'i18nList',
  
  components:{

  
  },
  data(){
    return {
      baId:''
    }
  },
  mounted(){
    console.log("1");
    this.baId = this.$route.query.ba_id;
    console.log("baId:" + this.baId);
  },
  methods: {
    getBaInfo(baId){
      this.baId = baId;
      console.log("getBaInfo baId:" + baId);
    } 
  },
  watch: {

  }
}
</script>
<style scpoe>

.child{

}
.child .d{
  
}
</style>
