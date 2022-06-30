<template>
<div class="designGridCheckbox designItem designGridItem">

                <el-checkbox-group :value="itemObj.sysOptionsDefautlArr">
                            <el-checkbox   style="margin-top:2px;margin-bottom:2px;"  
                                size="mini" :label="item.id" v-for="item in kvMap" :key="item.id">
                                {{item.text}}
                            </el-checkbox>
                </el-checkbox-group>
</div>

</template>
<script>
export default{
  name:'designGridCheckbox',
  components:{
      
  },
  props:{ 
        item:{
            type:Object
        },
        kvMap:{
            type:Array,
            default:function(){
                return [];
            }
        }
  },
  data(){
        return {
            
        }
  },
  computed:{
       itemObj(){
            let _item = {};
            _item.sysOptionsDefautlArr = (this.item && this.item.sysOptionsDefautlArr)?this.item.sysOptionsDefautlArr:[];
            return _item;
        },
      
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
