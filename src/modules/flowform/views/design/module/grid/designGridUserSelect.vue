<template>
<div class="designGridUserSelect designItem designGridItem" >
        <el-input :value="itemObj.defaultVal" readonly  :placeholder="(false &&itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择人员'" 
          type="textarea" 
          :autosize="{minRows:1,maxRows:4}" 
        >
          <i slot="suffix" class="icon iconfont iconrenyuan"></i>
        </el-input>
</div>

</template>
<script>


export default{
  name:'designGridUserSelect',
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
