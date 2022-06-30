<template>
  <div class="handleSegmentHeaderVue designItem" v-show="isVisible">

      <ecoField :titleWidth="0" :bgColor="mItem.bgColor?mItem.bgColor:mForm?mForm.titleBgColor:null" titlePos="n" class="handleField">
            
            <div slot="content" 
             style="line-height:22px;padding-left:10px;padding-right:10px;"
             v-bind:style="{color:mItem.ftColor,backgroundColor:mItem.bgColor,size:mItem.fontSize,textAlign:mItem.titleAlign }"> 
            
                 <div v-html="value" v-bind:style="{color:mItem.ftColor?mItem.ftColor:mForm?mForm.titleTextColor:null}" style="padding-top:10px;padding-bottom:10px;"></div>
            </div> 
     </ecoField>

    
      
  </div>
</template>
<script>

import ecoField from '../../components/ecoField'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'

export default{
  name:'handleSegmentHeader',
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

        mForm:{
            type:Object
        }
  },
  data(){
        return {
            value:'',
            hiddenValue:'',

            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            hasClick:false,
            iptType:'',
      
        }
  },
  created(){
       
  },
  mounted(){
       if(this.mItem && this.mItem.nullable == 0){
           this.isRequired = true;
       }
       if(this.mItem && this.mItem.visiable == 0){
           this.isVisible = false;
       }
       if(this.mItem && this.mItem.isReadonly == 1 ){
           this.isReadonly = true;
       }
       if(this.mItem && this.mItem.editable == 0){
           this.isEditable = false;
       }

    //    if(this.mValue.itemName){
    //         this.value = this.mValue.itemName.replace(/\n/g,"<br/>") ;
    //    }

       if(this.mItem && this.mItem.inst){
         //   this.value = this.mItem.inst.replace(/\n/g,"<br/>") ;
            this.value = this.mItem.inst;
       }

     
      
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
