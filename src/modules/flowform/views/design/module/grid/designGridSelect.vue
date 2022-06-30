<template>
<div class="designGridSelect designItem designGridItem">
            <el-select :value="itemObj.value" placeholder="请选择" size="mini">
                            <el-option
                                v-show="item.enableInCreate"
                                v-for="item in itemObj.KVMap"
                                :key="item.id"
                                :label="item.text?item.text:' '"
                                :value="item.id">
                            </el-option>
            </el-select>
</div>

</template>
<script>
export default{
  name:'designGridSelect',
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

</style>
