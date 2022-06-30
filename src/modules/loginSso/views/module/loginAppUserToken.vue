<template>
    <div>
      
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'

export default {
  name:'loginAppUserToken',
  components: {
     
  },
  data() {
    return {
      json:{},
      authToken:""
    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
    this.json = EcoUtil.url2json(window.location.href);
    this.authToken = this.json["code"];
     
    this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
            if(this.authToken){
              this.$emit('checkSuccess',this.authToken,this.json);
            }else{
              this.$emit("checkError");
            }
      },
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
