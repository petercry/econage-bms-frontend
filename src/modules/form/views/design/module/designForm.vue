<template>
  <div class="designForm designField" >
        <div class="formTitle">{{itemObj.fullName}}</div>
  </div>
</template>
<script>


import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'designForm',
  components:{
      
  },
  props:{
        mItem:{
            type:Object
        },
        mConfig:{
            type:Object,
        } 
  },
  data(){
        return {
            settingConfing:{},
        }
  },
  computed:{
        itemObj(){
            let _item = {};
            _item.shortName = this.mConfig?this.mConfig.shortName:null;//标题名称
            _item.fullName = this.mConfig?this.mConfig.fullName:null;//标题名称
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

.designForm{
    background-color: #ffff;  
    cursor:pointer;
}

.designForm .formTitle{
    padding:20px 0px;
    text-align: center;
    font-size: 16px;
    border-bottom:1px solid #e7e7e7
}


</style>
