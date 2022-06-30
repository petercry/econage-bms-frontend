<template>
    <div class="designGridInputGrid designItem designGridItem" >
        <el-input :value="itemObj.defaultVal" readonly :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:''"></el-input> 
    </div>
</template>
<script>

export default{
  name:'designGridInputGrid',
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
