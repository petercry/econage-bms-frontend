<template>
    <div>
      
    </div>
</template>
<script>
import {EcoUtil} from '@/components/util/main.js'
import {requestTest} from'@/modules/loginSso/service/service'

export default {
  name:'loginE9',
  components: {
     
  },
  data() {
    return {
      authToken:""
    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
    this.json = EcoUtil.url2json(window.location.href);
    this.authToken = this.json["auth-token"];
     if(this.authToken.lastIndexOf("#/") > -1){
        this.authToken = this.authToken.substring(0,this.authToken.lastIndexOf("#/"))
     }
    this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
          console.log(this.authToken)
          sessionStorage.setItem('ecoToken',this.authToken);
          requestTest().then(res=>{
              if (res.data=='success'){
                this.$emit("checkSuccess",this.authToken);
              }else{
                this.$emit("checkError");
              }
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
