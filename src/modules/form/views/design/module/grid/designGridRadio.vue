<template>
<div class="designGridRadio designItem designGridItem">

                <el-radio-group :value="itemObj.sysOptionsDefautl" size="mini" style="width:100%">
                        <el-radio  style="margin-top:2px;margin-bottom:2px;" 
                            size="mini" :label="item.id" v-for="item in kvMap" :key="item.id">
                             {{item.text}}
                        </el-radio>
                </el-radio-group>
</div>

</template>
<script>
export default{
  name:'designGridRadio',
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
