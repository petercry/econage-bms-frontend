<template>
<div class="designGridTextarea designItem designGridItem" >
    <el-input :value="itemObj.defaultVal" type="textarea" :autosize="{ minRows:1, maxRows:10}" readonly :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:''"></el-input> 
</div>

</template>
<script>

export default{
  name:'designGridTextarea',
  components:{
     
  },
  props:{
       itemObj:{
            type:Object
        }
  },
  data(){
        return {
            value:'',
           
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

</style>
