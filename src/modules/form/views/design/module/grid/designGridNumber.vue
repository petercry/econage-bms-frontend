<template>
    <div class="designGridNumber designItem designGridItem" >
        <el-input :value="itemObj.defaultVal" readonly :placeholder="itemObj.inst"></el-input> 
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default{
  name:'designGridNumber',
  components:{
     
  },
  props:{
        item:{
            type:Object
        }
  },
  data(){
        return {
            value:'',
           
        }
  },
  computed:{
         itemObj(){
            let _item = {};
            _item.inst = ( this.item )?this.item.attrs.inst:null;
            _item.defaultVal = (this.item  )?this.item.attrs.defaultVal:null;
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
