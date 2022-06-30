<template>
    <div>
     
    </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {getPublicSetting,getUrlByCasTarget,getAuthTokenByCas} from'../../service/service'
export default {
  name:'loginCheckCas',
  components: {
     
  },
  data() {
    return {
      
        // toast:null
      artifactParameter:"",
      code:"",
      json:{},
    }
  },
  created() {
  },
  activated(){

  },

  mounted(){
    this.json = EcoUtil.url2json(window.location.href);
    this.init();
  },

  computed: {
    
  },

  methods: {
      init(){
          getPublicSetting().then((response) => {
            if(response.data.hasOwnProperty('cas')){
                let data = response.data.cas;
                if(data.enabled){
                  this.artifactParameter = data.artifactParameter;
                  this.code = this.json[this.artifactParameter];
                  if(this.code){
                      if(this.code.lastIndexOf("#/") > -1){
                          this.code = this.code.substring(0,this.code.lastIndexOf("#/"))
                      }
                      this.getAuthTokenByCas();
                  }else{
                      this.code = this.json['target'];
                      if(this.code){
                          getUrlByCasTarget(this.code).then((response1) => {
                              window.location.href = response1.data;
                          });
                      }else{
                          window.location.href = data.runtimeLoginUrl;
                      }
                  }
                  
                  
                }else{
                   this.$emit('checkError');
                }
               
            }else{
               this.$emit('checkError');
            }
          }).catch((error) => {
               this.$emit('checkError');
          });
         
      },
      getAuthTokenByCas(){
         //this.$router.push({name:'home'});
          getAuthTokenByCas(this.artifactParameter,this.code).then((res) => {
            this.$emit("checkSuccess",res.data,this.json);
          }).catch((error) => {
            this.$emit('checkError');
          });
      },
     
  },
  watch:{
   
  },

};
</script>

<style scoped>

</style>
