<template>
  <div class="handelForm" >
        <div class="formTitle">{{formWf?formWf.formName:''}}</div>
  </div>
</template>
<script>


import {mapState,mapMutations} from 'vuex'


export default{
  name:'handleForm',
  components:{
      
  },
  props:{
        formWf:{
            type:Object
        },
     
  },
  data(){
        return {
            settingConfing:{},
        }
  },
  computed:{
        
  },
  created(){
       
  },
  mounted(){
     
     
  },
  methods: {
     
  },
  watch: {
 
  }
}
</script>
<style scoped>

.handelForm{
    background-color: #ffff;  
}

.handelForm .formTitle{
    padding:20px 0px;
    text-align: center;
    font-size: 16px;
    border-bottom:1px solid #e7e7e7
}


</style>
