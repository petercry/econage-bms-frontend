<template>
<div class="designGridCheckbox designItem designGridItem">
        <el-checkbox-group  :value="itemObj.value">
                  <el-checkbox v-show="item.enableInCreate" size="mini" :label="item.id" v-for="item in itemObj.KVMap" :key="item.id">{{item.text}}</el-checkbox>
        </el-checkbox-group>
</div>

</template>
<script>


export default{
  name:'designCheckbox',
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
.designGridCheckbox{
      padding-left:5px;
}
</style>
