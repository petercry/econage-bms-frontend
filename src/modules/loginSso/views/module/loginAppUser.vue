<template>
    <div>
      
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'
import {appUserLoginAjax} from'../../service/service'

export default {
  name:'loginCommon',
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
          appUserLoginAjax(this.authToken).then(res=>{
              this.$emit('checkSuccess',res.data,this.json);
            }).catch(e=>{
                this.$emit("checkError");
            })
          
      },
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
