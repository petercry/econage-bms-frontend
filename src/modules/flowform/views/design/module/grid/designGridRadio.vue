<template>
<div class="designGridRadio designItem designGridItem">
         <el-radio-group :value="itemObj.value" size="mini" >
                <el-radio   size="mini" :label="item.id" v-for="item in itemObj.KVMap" :key="item.id" v-show="item.enableInCreate">{{item.text}}</el-radio>
         </el-radio-group>
</div>
</template>
<script>


export default{
  name:'designGridRadio',
  components:{
      
  },
  props:{ 
        itemObj:{
            type:Object
        }
  },
  data(){
        return {
            
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
.designGridRadio{
    padding-left:5px;
}

</style>
