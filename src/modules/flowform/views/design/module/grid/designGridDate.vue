<template>
<div class="designGridDate designItem designGridItem" >
       
                   <el-time-picker
                        v-if="itemObj.subTypeId == 27 "
                        :value="itemObj.defaultVal"
                        :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择时间'"
                        :format="itemObj.dateFormaterStr"
                        :value-format="itemObj.dateFormaterStr"
                        readonly
                        style="width:100%"
                        >
                    </el-time-picker>

                    <el-date-picker
                        v-else
                        :value="itemObj.defaultVal"
                        :type="itemObj.dateType"
                        :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择日期'"
                        :format="itemObj.dateFormaterStr"
                        :value-format="itemObj.dateFormaterStr"
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
