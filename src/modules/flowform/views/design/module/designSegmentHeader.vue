<template>
<div class="designSegmentHeader designItem" >
      <ecoField :titleWidth="0" class="designField" :titlePos="itemObj.titlePos" :textAlign="itemObj.titleAlign">
        
        <div slot="content"  style="line-height:22px;padding-left:10px;padding-right:10px;"
             v-bind:style="{color:itemObj.ftColor,backgroundColor:itemObj.bgColor,size:itemObj.fontSize,textAlign:itemObj.titleAlign }"> 
          
           <div v-html="itemObj.inst"  v-bind:style="{color:itemObj.ftColor}" style="padding-top:10px;padding-bottom:10px;"></div>

         </div>           
     </ecoField>

    
   
</div>

</template>
<script>
import {defaultTitleWidth}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'


export default{
  name:'designSegmentHeader',
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
        mConfig:{
            type:Object,
        },
         mForm:{
            type:Object
        },

        mFormConfig:{
            type:Object,
        },
  },
  data(){
        return {
            value:'',
           
        }
  },
  computed:{
        itemObj(){
            let _item = {};
            _item.itemId = this.mItem.itemId;
            _item.titleName = this.mConfig?this.mConfig.titleName:this.mItem.titleName;//标题名称
            if(_item.titleName){
                 _item.titleName = _item.titleName.replace(/\n/g,"<br/>");
            }
            _item.titleWidth = this.mConfig?this.mConfig.titleWidth:this.mItem.titleWidth;//标题宽度
            _item.titlePos = 'n';
            _item.ftColor = this.mConfig?this.mConfig.ftColor:this.mItem.ftColor; //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.bgColor:this.mItem.bgColor;
            
            if(_item.ftColor == null || _item.ftColor == ""){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }

            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst;
            if(false && _item.inst){
                 _item.inst = _item.inst.replace(/\n/g,"<br/>");
            }
            _item.fontSize = this.mConfig?this.mConfig.fontSize:this.mItem.fontSize; //字体大小
            /*对齐方式*/
            _item.titleAlign = this.mConfig?this.mConfig.titleAlign:this.mItem.titleAlign;
            if(_item.titleWidth){
                _item.titleWidth = Number(_item.titleWidth);
            }else{
                _item.titleWidth = defaultTitleWidth;
            }
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
