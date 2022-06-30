<template>
<div class="designSelect designItem">
      <ecoField :titleWidth="itemObj.titleWidth"  :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.nullable == 0" :textAlign="itemObj.titleAlign" class="designField">
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

                    <el-select :value="itemObj.value" placeholder="请选择" size="mini" :style="{maxWidth:Math.floor((100/itemObj.csLevelNum))+'%'}">
                            <el-option
                                v-show="item.valid !='N'"
                                v-for="(item,idx) in itemObj.KVMap"
                                :key="'op'+idx"
                                :label="item.name?item.name:(item.desc?item.desc:' ')"
                                :value="item.idString?item.idString:item.id">
                            </el-option>
                    </el-select>

                    <el-select :value="selectValue" placeholder="请选择" size="mini" v-for="index of (itemObj.csLevelNum-1)" :key="'select'+index"  :style="{maxWidth:Math.floor((100/itemObj.csLevelNum))+'%'}"> 
                             <el-option
                                :key="'1'"
                                :label="'请选择'"
                                :value="'1'">
                            </el-option>
                    </el-select>
            </div>

     </ecoField>
</div>

</template>
<script>
import {defaultTitleWidth}  from'@/flowform/config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'designSelect',
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
            selectValue:null
        }
  },
  computed:{
        itemObj(){
          
            let _item = {};
            _item.titleName = this.mConfig?this.mConfig.titleName:this.mItem.titleName;//标题名称
            _item.titleWidth = this.mConfig?this.mConfig.titleWidth:this.mItem.titleWidth;//标题宽度
            _item.titlePos =  this.mConfig?(this.mConfig.titlePos?'n':'l'):this.mItem.titlePos;//显示表头
            _item.nullable =  this.mConfig?(this.mConfig.nullable?0:1):this.mItem.nullable;//必填
            _item.ftColor = this.mConfig?this.mConfig.ftColor:this.mItem.ftColor; //字体颜色
            _item.bgColor = this.mConfig?this.mConfig.bgColor:this.mItem.bgColor;
            
            if(_item.ftColor == null){
                 _item.ftColor = this.mFormConfig?this.mFormConfig.titleTextColor:this.mForm?this.mForm.titleTextColor:null;
            }
            if(_item.bgColor == null){
                _item.bgColor = this.mFormConfig?this.mFormConfig.titleBgColor:this.mForm?this.mForm.titleBgColor:null;
            }
            
            _item.inst = this.mConfig?this.mConfig.inst:this.mItem.inst;
            _item.csLevelNum = this.mConfig?this.mConfig.csLevelNum:(this.mItem.csLevelNum?this.mItem.csLevelNum:1);
            
            /*对齐方式*/
            _item.titleAlign = this.mConfig?this.mConfig.titleAlign:this.mItem.titleAlign;
            if(_item.titleAlign =='l'){
                _item.titleAlign = 'left';
            }else if(_item.titleAlign=='c'){
                 _item.titleAlign = 'center';
            }else if( _item.titleAlign=='r'){
                 _item.titleAlign = 'right';
            }else{
                 _item.titleAlign = 'center';
            }

            _item.KVMap = this.mItem.KVMap;
            if(_item.titleWidth){
                _item.titleWidth = Number(_item.titleWidth);
            }else{
                _item.titleWidth = defaultTitleWidth;
            }
            

            if(this.mConfig){
                _item.KVMap = this.mConfig.csNodeOptions;
                _item.value = this.mConfig.defaultVal;
            }else{
                 _item.value = this.mItem.defaultVal;
            }

       
            return _item;
        },
      
  },
  created(){
     
    
  },
  mounted(){
     
  },
  methods: {

        reload(){
          
        }
  },
  watch: {
 
  }
}
</script>
<style scoped>
.designSelect{
    
}

</style>
