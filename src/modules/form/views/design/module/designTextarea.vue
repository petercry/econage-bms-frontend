<template>
<div class="designTextarea designItem" >
      <ecoField :titleWidth="itemObj.titleWidth" :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.required" :textAlign="itemObj.titleAlign"  class="designField"> 
         <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
             <div class="labelTitle" >
                <i v-if="itemObj.required && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.display}}</span>
             </div>
        </div>
        <div slot="content"> 
            <el-input :value="itemObj.defaultVal" type="textarea" :autosize="{ minRows:3, maxRows:15}" readonly :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:''"></el-input> 
         </div>           
     </ecoField>
</div>

</template>
<script>
import {defaultTitleWidth}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'


export default{
  name:'designTextarea',
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

            _item.display = this.mConfig?this.mConfig.display:this.mItem.display;//标题名称
            _item.titleWidth = this.mConfig?this.mConfig.style.titleWidth:(this.mItem.style?this.mItem.style.titleWidth:defaultTitleWidth);//标题宽度
            _item.titlePos = this.mConfig?(String(this.mConfig.attrs.titlePos)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.titlePos)== 'true'?true:false):false);//隐藏标题
            _item.required = this.mConfig?(String(this.mConfig.attrs.required)=='true'?true:false):(this.mItem.attrs?(String(this.mItem.attrs.required) == 'true'?true:false):false);//必填
            _item.ftColor = this.mConfig?this.mConfig.style.ftColor:(this.mItem.style? this.mItem.style.ftColor:null); //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.style.bgColor:(this.mItem.style? this.mItem.style.bgColor:null); //背景颜色
            _item.titleAlign = this.mConfig?this.mConfig.style.titleAlign:(this.mItem.style? this.mItem.style.titleAlign:'left'); //对齐方式
       
            if(_item.ftColor == null){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.style.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }
            if(_item.bgColor == null){
                _item.bgColor = this.mFormConfig?this.mFormConfig.style.titleBgColor:this.mForm?this.mForm.titleBgColor:null;
            }

            _item.inst = this.mConfig?this.mConfig.attrs.inst:(this.mItem.attrs? this.mItem.attrs.inst:null);
            _item.defaultVal = this.mConfig?this.mConfig.attrs.defaultVal:(this.mItem.attrs? this.mItem.attrs.defaultVal:null);
       
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
