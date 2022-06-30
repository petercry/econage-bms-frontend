<template>
<div class="designGridDate designItem designGridItem" >
                    <el-time-picker
                            v-if="itemObj.dateType == 'HH:mm'"
                            :value="itemObj.defaultVal"
                            :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择时间'"
                            :format="itemObj.dateType"
                            :value-format="itemObj.dateType"
                            readonly
                            style="width:100%;max-width:220px;"
                        >
                    </el-time-picker>

                    <el-date-picker
                            v-else
                            :value="itemObj.defaultVal"
                            :type="getDateType"
                            :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择日期'"
                            :format="itemObj.dateType"
                            :value-format="itemObj.dateType"
                            style="width:100%;max-width:220px;"
                            readonly
                        >
                    </el-date-picker>
    
</div>

</template>
<script>

import {mapState,mapMutations} from 'vuex'
export default{
  name:'designGridDate',
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
            _item.inst = (this.item)?this.item.attrs.inst:null;
            _item.defaultVal = (this.item)?this.item.attrs.defaultVal:null;
            _item.dateType = (this.item)?this.item.attrs.dateType:'yyyy-MM-dd';


            return _item;
        },

        getDateType(){
            if(this.itemObj.dateType == 'yyyy-MM-dd'){
                    return 'date';
            }else if(this.itemObj.dateType == 'yyyy-MM-dd HH:mm'){
                    return 'datetime';
            }else if(this.itemObj.dateType == 'yyyy-MM-dd HH'){
                    return 'datetime';
            }else if(this.itemObj.dateType == 'yyyy-MM'){
                   return 'month';
            }else if(this.itemObj.dateType == 'HH:mm'){
                   return 'time';
            }else{
                   return 'date'
            }
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
