<template>
<div class="designRadio designItem">
      <ecoField :titleWidth="itemObj.titleWidth" :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.nullable == 0" :textAlign="itemObj.titleAlign"
        :verticalAlign="itemObj.verticalAlign" class="designField" >
            <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
                  <div class="labelTitle" >
                        <i v-if="itemObj.nullable == 0 && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                        <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.titleName}}</span>
                        
                        <el-tooltip class="item" effect="dark" :content="itemObj.inst" placement="top" v-if="itemObj.inst && itemObj.inst !=''">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>
                 </div>
            </div>
            <div slot="content" style="line-height: normal;margin: 8px 0px">
                    <el-radio-group :value="itemObj.value" size="mini" v-bind:style="{width:(itemObj.nullable == 0 && itemObj.titlePos=='n')?'98%':'100%'}">
                        <el-radio v-bind:style="itemObj.checkStyleObject" style="margin-top:2px;margin-bottom:2px;"  v-show="item.enableInCreate" size="mini" :label="item.id" v-for="item in itemObj.KVMap" :key="item.id">{{item.text}}</el-radio>
                    </el-radio-group>
            </div>
     </ecoField>
</div>

</template>
<script>

import {defaultTitleWidth}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'

export default{
  name:'designRadio',
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
            
            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst;
            
            /*对齐方式*/
            _item.titleAlign = this.mConfig?this.mConfig.titleAlign:this.mItem.titleAlign;
           

             _item.verticalAlign = this.mConfig?this.mConfig.verticalAlign:this.mItem.verticalAlign;

            _item.KVMap = this.mItem.KVMap;
            
            if(_item.titleWidth){
                _item.titleWidth = Number(_item.titleWidth);
            }else{
                _item.titleWidth = defaultTitleWidth;
            }
            
            if(this.mConfig){
                    _item.KVMap = this.mConfig.sysOptions;
                    _item.value = this.mConfig.sysOptionsDefautl;
            }else{
                _item.value = this.mItem.defaultId;
            }

            _item.optionGrid = this.mConfig?this.mConfig.optionGrid:this.mItem.optionGrid;//列数
            if(_item.optionGrid!=0){
                let _widthStyle = Math.floor( 100 / _item.optionGrid );
                 _item.checkStyleObject = {};
                _item.checkStyleObject.width = _widthStyle+'%'
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
.designRadio{
   
}



.designRadio .radioSpan{
    margin-right: 30px;
    line-height: 20px;
    margin-right: 20px;
}

.designRadio .radioSpan .inputRadio{
    width:14px;
    height:14px;
}

.designRadio  .desc{
    padding-left: 10px;
}

.designRadio .formitm-1{padding-left:100px;}
.designRadio .lab{float:left;width:90px;margin-right:-90px;text-align:right;font-weight:bold;}
.designRadio .ipt{margin-left:100px;line-height:32px;}
.designRadio .ipt *{vertical-align:middle;}



</style>
