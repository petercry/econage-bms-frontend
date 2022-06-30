<template>
  <div v-show="isVisible">
     <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:30" >
         <div slot="label">{{mItem.itemName}} <i v-if="isRequired" class="el-form-required-i">*</i></div>
         <div slot="content"> 
                
         </div>           
     </ecoField>
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'

export default{
  name:'ecoBlank',
  components:{
      ecoField
  },
  props:{
        mItem:{
            type:Object
        },
        mValue:{
            type:Object
        },
  },
  data(){
        return {
            value:'',
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
        }
  },
  created(){
       
  },
  mounted(){
       
  },
  computed:{

  },
  methods: {
       
  },
  watch: {

  }
}
</script>
<style scoped>

</style>
