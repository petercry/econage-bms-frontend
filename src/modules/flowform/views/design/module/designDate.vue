<template>
<div class="designDate designItem" >
      <ecoField :titleWidth="itemObj.titleWidth" :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.nullable == 0" :textAlign="itemObj.titleAlign"
        :verticalAlign="itemObj.verticalAlign" class="designField">

         <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
             <div class="labelTitle" >
                <i v-if="itemObj.nullable == 0 && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.titleName}}</span>
             </div>
        </div>

        <div slot="content"> 
                     <el-time-picker
                        v-if="itemObj.subTypeId == 27 "
                        :value="itemObj.defaultVal"
                        :placeholder="(itemObj.inst && itemObj.inst !='')?itemObj.inst:'请选择时间'"
                        :format="itemObj.dateFormaterStr"
                        :value-format="itemObj.dateFormaterStr"
                        readonly
                        style="width:100%;max-width:220px;"
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
            _item.itemId = this.mItem.itemId;
            _item.titleName = this.mConfig?this.mConfig.titleName:this.mItem.titleName;//标题名称
            _item.titleWidth = this.mConfig?this.mConfig.titleWidth:this.mItem.titleWidth;//标题宽度
            _item.titlePos =  this.mConfig?(this.mConfig.titlePos?'n':'l'):this.mItem.titlePos;//显示表头

            _item.nullable =  this.mConfig?(this.mConfig.nullable?0:1):this.mItem.nullable;//必填
            _item.ftColor = this.mConfig?this.mConfig.ftColor:this.mItem.ftColor; //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.bgColor:this.mItem.bgColor;
            
            if(_item.ftColor == null || _item.ftColor == ""){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }
            if(_item.bgColor == null || _item.bgColor == ""){
                _item.bgColor = this.mFormConfig?this.mFormConfig.titleBgColor:this.mForm?this.mForm.titleBgColor:null;
            }
            
            _item.subTypeId = this.mConfig?this.mConfig.subTypeId:this.mItem.subTypeId;
            _item.defaultVal = this.mConfig?this.mConfig.defaultVal:this.mItem.defaultVal;
            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst; //操作提示
            


            if(_item.subTypeId == 14){
                _item.dateType = 'date';
                _item.dateFormaterStr = 'yyyy-MM-dd';
            }else if(_item.subTypeId == 19 ){
                _item.dateType = 'datetime';
                _item.dateFormaterStr = 'yyyy-MM-dd HH';
            }else if(_item.subTypeId == 15){
                 _item.dateType = 'datetime';
                 _item.dateFormaterStr = 'yyyy-MM-dd HH:mm';
            }else if(_item.subTypeId == 26){
                _item.dateType = 'month';
                 _item.dateFormaterStr = 'yyyy-MM';
            }else if(_item.subTypeId == 27){
                _item.dateType = 'time';
                _item.dateFormaterStr = 'HH:mm'
            }else{
                _item.dateType = 'date'
                _item.dateFormaterStr = 'yyyy-MM-dd';
            }

            /*对齐方式*/
            _item.titleAlign = this.mConfig?this.mConfig.titleAlign:this.mItem.titleAlign;
            _item.verticalAlign = this.mConfig?this.mConfig.verticalAlign:this.mItem.verticalAlign;

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
.designDate .labelTitleRequestI{
    margin-left:4.42px;
}
</style>
