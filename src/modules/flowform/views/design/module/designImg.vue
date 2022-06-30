<template>
<div class="designImg designItem" >
      
      <ecoField :titleWidth="itemObj.titleWidth" :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.nullable == 0" :textAlign="itemObj.titleAlign" 
        :verticalAlign="itemObj.verticalAlign" class="designField">
          <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
             <div class="labelTitle" >
                <i v-if="itemObj.nullable == 0 && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.titleName}}</span>
                <el-tooltip class="item" effect="dark" :content="itemObj.inst" placement="top" v-if="itemObj.inst && itemObj.inst !=''">
                            <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                </el-tooltip>
             </div>
         </div>
         <div slot="content"> 
            <span class="attachment"><i class="icon iconfont icontupian"></i> 上传图片</span>
         </div>           
     </ecoField>
</div>

</template>
<script>
import {defaultTitleWidth}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'


export default{
  name:'designImg',
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
            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst;

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

.designItem .attachment i{
    font-size: 10px;
}
.designItem .attachment{
    cursor: pointer;
    color: #606266;
}

</style>
