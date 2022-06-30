<template>
<div class="designGridSelect designItem designGridItem">
             <el-select :value="itemObj.sysOptionsDefautl" placeholder="请选择" size="mini">
                            <el-option
                                v-for="item in kvMap"
                                :key="item.id"
                                :label="item.text"
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
            _item.sysOptionsDefautl = (this.item)?this.item.attrs.sysOptionsDefautl:null;
            _item.defaultVal = (this.item )?this.item.attrs.defaultVal:null;

            _item.sysOptions  = (this.item )?this.item.sysOptions:[];
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
