<template>
<div class="designDate designItem" >
      <ecoField :titleWidth="itemObj.titleWidth" :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.required" :textAlign="itemObj.titleAlign" class="designField">

         <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
             <div class="labelTitle" >
                <i v-if="itemObj.nullable && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.display}}</span>
             </div>
        </div>

        <div slot="content"> 

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
     </ecoField>
    
</div>

</template>
<script>
import {defaultTitleWidth}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'


export default{
  name:'designDate',
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
            _item.dateType = this.mConfig?this.mConfig.attrs.dateType:(this.mItem.attrs? this.mItem.attrs.dateType:'yyyy-MM-dd');
            _item.defaultId = this.mConfig?this.mConfig.attrs.defaultId:(this.mItem.attrs? this.mItem.attrs.defaultId:'custom');
            
            if(_item.titleWidth){
                _item.titleWidth = Number(_item.titleWidth);
            }else{
                _item.titleWidth = defaultTitleWidth;
            }
          
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
