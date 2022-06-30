<template>
<div class="designCheckbox designItem">
      <ecoField :titleWidth="itemObj.titleWidth"  :bgColor="itemObj.bgColor" :titlePos="itemObj.titlePos" :required="itemObj.required" :textAlign="itemObj.titleAlign" class="designField">
            <div slot="label" v-bind:style="{textAlign:itemObj.titleAlign}">
                <div class="labelTitle" >
                    <i v-if="itemObj.required && itemObj.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                    <span v-bind:style="{color:itemObj.ftColor}">{{itemObj.display}}</span>
                    <el-tooltip class="item" effect="dark" :content="itemObj.inst" placement="top" v-if="itemObj.inst && itemObj.inst !=''">
                        <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                    </el-tooltip>
                </div>
            </div>

            <div slot="content"> 
                    <el-checkbox-group :value="sysOptionsDefautlArr">
                            <el-checkbox   style="margin-top:2px;margin-bottom:2px;"  
                                size="mini" :label="item.id" v-for="item in sysOptions" :key="item.id">
                                {{item.text}}
                            </el-checkbox>
                    </el-checkbox-group>
            </div>

     </ecoField>
</div>

</template>
<script>

import {getBasicKvGroupList} from'../../../service/service'
import {defaultTitleWidth,}  from'../../../config/setting.js'
import ecoField from '../../components/ecoField'
import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'designCheckbox',
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
            sysKeyValueOptionsArr:[],
            sysOptions:[],
            sysOptionsDefautlArr:[],
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
            _item.sysOptionsDefautl = this.mConfig?this.mConfig.attrs.sysOptionsDefautl:(this.mItem.attrs? this.mItem.attrs.sysOptionsDefautl:null);
            if(_item.titleWidth){
                _item.titleWidth = Number(_item.titleWidth);
            }else{
                _item.titleWidth = defaultTitleWidth;
            }
            
            let _sysKeyValueOptionsValue = this.mConfig?this.mConfig.attrs.sysKeyValueOptionsValue:(this.mItem.attrs? this.mItem.attrs.sysKeyValueOptionsValue:null);
            if(_sysKeyValueOptionsValue){
                this.sysKeyValueOptionsArr = _sysKeyValueOptionsValue.split(",");
            }else{
                this.sysKeyValueOptionsArr = [];   
            }

              
            let _sysOptionsDefaultValue = this.mConfig?this.mConfig.attrs.sysOptionsDefautl:(this.mItem.attrs? this.mItem.attrs.sysOptionsDefautl:null);
            if(_sysOptionsDefaultValue){
                this.sysOptionsDefautlArr = _sysOptionsDefaultValue.split(",");
            }else{
                this.sysOptionsDefautlArr = [];   
            }

            
          

            _item.optionGrid = this.mConfig?Number(this.mConfig.attrs.optionGrid):(this.mItem.attrs? Number(this.mItem.attrs.optionGrid):0);
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
        getSysKeyValueOptions(val){ //系统基础数据改变
            this.sysOptions = [];
            if(val && val.length == 2){
                getBasicKvGroupList(val[1]).then((response)=>{
                        this.sysOptions = response.data;
                       
                })
            }
       },
  },
  watch: {
      'sysKeyValueOptionsArr'(newvalue,oldvalue){ //监听设置 里面发生的变化
            if(newvalue && newvalue.length > 0 && oldvalue && oldvalue.length > 0 ){
                if(newvalue[newvalue.length-1] == oldvalue[oldvalue.length-1]){

                }else{  
                      this.getSysKeyValueOptions(newvalue);
                }
            }else{
                  this.getSysKeyValueOptions(newvalue);
            }
      }, 
    
  }
}
</script>
<style scoped>
.designCheckbox{
    
}

</style>
