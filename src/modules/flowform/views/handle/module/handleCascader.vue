<template>
  <div class="handleSelectVue designItem" v-show="isVisible">

      <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:defaultTitleWidth" :bgColor="mItem.bgColor?mItem.bgColor:mForm?mForm.titleBgColor:null" 
            :titlePos="mItem.titlePos" :required="isRequired" :textAlign="mItem.titleAlign"
            :verticalAlign="mItem.verticalAlign?mItem.verticalAlign:'top'"
        >
            <div slot="label"  v-bind:style="{textAlign:mItem.titleAlign}">
                    <div class="labelTitle" >
                        <i v-if="isRequired && mItem.titleAlign != 'left'" class="el-form-required-i labelTitleRequestI">*</i>
                        <span v-bind:style="{color:mItem.ftColor?mItem.ftColor:mForm?mForm.titleTextColor:null}">{{mItem.itemName}}</span>
                        <el-tooltip class="item" effect="dark" :content="mItem.inst" placement="top" v-if="mItem.inst && mItem.inst !=''">
                             <i class="icon iconfont icontishi1 tooltipIcon" ></i>
                        </el-tooltip>

                         <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
                        </el-tooltip>
                    </div>
            </div>
          
            <div slot="content" :id="'handleItem-'+mItem.viewId+'-'+mItem.itemId"> 

                <el-select v-model="csIdObj[String(level)]"  v-for="level of csLevelNum" :key="'select'+level" clearable placeholder="请选择" @change="onChangeEvent(level,true)" :disabled="(!isEditable || isReadonly)" size="mini" v-show="csArrayObj[String(level)]" :style="{maxWidth:(Math.floor((100/csLevelNum)))+'%'}">
                        <el-option
                            v-show="item.enableInCreate && isEditable" 
                            v-for="(item,idx) in csArrayObj[String(level)]"
                            :key="'op'+idx"
                            :label="item.i18nText||item.text"
                            :value="item.id"
                            size="mini"
                        >
                        </el-option>
                </el-select>
          
            </div>
      </ecoField>
  </div>

</template>
<script>

import {getTreeKvListByParentId} from'../../../service/service'
import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'


export default{
  name:'handleCascader',
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
        },
        operateId:{
            type:String
        }
  },
  data(){
        return {
            value:null,
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            errTip:false,
            errMsg:'',
            
            csArrayObj:{},
            csIdObj:{},
            csLevelNum:1,
            csDataMap:{},
            dsId:null,
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
        if(this.mItem){
              this.csLevelNum = this.mItem.csLevelNum ;
        }
        if(this.mValue){
            this.dsId = this.mValue.kvName;
        }


        this.value = this.mValue.value ;
        this.hiddenValue = this.mValue.hiddenValue;
        this.initComponent(this.mValue.hiddenValue);

      
        
  },
  computed:{
     
  },
  methods: {
        /*初始化*/
        initComponent(valueStr){
            for(let i = 1;i<=this.csLevelNum;i++){
                  this.$set(this.csIdObj,String(i),null); //设置对应层级的val
            }
            let _data = EcoUtil.objDeepCopy(this.mValue.KVMap);
            this.$set(this.csArrayObj,String(1),_data); 

            let _value = valueStr ;
            if(_value){
                    let _valArray = _value.split(",");
                    for(let i =(_valArray.length+1); i<=this.csLevelNum;i++){
                          this.$set(this.csArrayObj,String(i),[]); 
                    }
                    (_valArray).forEach((val,idx)=>{
                        this.$set(this.csIdObj,String(idx+1),val); //设置对应层级的val
                        if((idx+1) <= (_valArray.length) && ((idx+1)!=this.csLevelNum) ){
                            this.getCascaderNodeFunc(idx+1);
                        }
                    })
            }else{
                 this.$set(this.csIdObj,String(1),null);
                 for(let i = 2;i<=this.csLevelNum;i++){
                     this.$set(this.csArrayObj,String(i),[]); 
                 }
            }
        },
     
        /*触发点击焦点事件*/
        onClickEvent(){
            if(this.isEditable && (!this.isReadonly)){
                (this.mValue.onclickEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        this.$emit('emitEvent',_emit); 
                })
             }
       },

       /*失去焦点事件*/ 
       onblurEvent(event){ 
             if(this.isEditable && (!this.isReadonly)){
                (this.mValue.onblurEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        this.$emit('emitEvent',_emit); 
                 })
             }
        },

        /*chang事件*/
        onChangeEvent(level,flag){
            (this.mValue.onchangeEvents).forEach((eventKey)=>{
                   let _emit = {};
                    _emit.action = 'onEventKeyAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.eventKey = eventKey;
                    this.$emit('emitEvent',_emit); 
            });

            if(flag){
                this.setCascaderEnv(level);
            }
            this.onInteraction();
            this.emitMirrorEvent();
        },

        /*相关性*/
        onInteraction(){
            if(this.mValue.hasInteraction){
                    let _emit = {};
                    _emit.action = 'onInteractionAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    this.$emit('emitEvent',_emit);
            }
        },

        setCascaderEnv(level){
            //第idx个select 发生变化
            if(level < this.csLevelNum){
                    for(let i = level+1;i<=this.csLevelNum;i++){
                        // delete this.csArrayObj[String(i)];
                        
                        this.$set(this.csArrayObj,String(i),[]);
                        this.$set(this.csIdObj,String(i),null);
                    }

                    let _val = this.csIdObj[String(level)];
                    if(this.csDataMap[String(_val)] && this.csDataMap[String(_val)].length > 0){
                        this.$set(this.csArrayObj,String(level+1),this.csDataMap[String(_val)]);
                    }else{
                        //ajax 调用方法
                        this.getCascaderNodeFunc(level);
                    }
                   
            }   
        },

        getCascaderNodeFunc(level){
              let _data = {};
              _data.parent_id = this.csIdObj[String(level)];
              _data.level_id = level+1;
              _data.ds_id = this.dsId;
              _data.operate_id = this.$route.params.operateId || this.operateId;

              getTreeKvListByParentId(this.csIdObj[String(level)],'select-enabled').then((response)=>{
                    let _list = response.data;
                    (_list).forEach((item)=>{
                        if(item.idString){

                        }else{
                             item.idString = String(item.id);
                        }
                    })

                    this.$set(this.csArrayObj,String(level+1),_list);
                    this.$set(this.csDataMap,this.csIdObj[String(level)],_list);
              })
        },

        /*Override 获取某个item的值*/
        getItemInputParamsValue(){ 
            let _obj = {};
            _obj.value = this.getCsIdObjValue();
            return _obj;
        },

        /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId){ //Override 设置item的值
            this.initComponent(value);
            if(this.mItem.itemId != fromItemId){ //如果触发元不是本组件，接着触发本组件的chang事件
                this.onChangeEvent();
                this.onblurEvent();
            }
       },


        /*设置相关性*/
        setItemInteraction(event){
            if(event.eventType == 'SET_VISIBALE'){
                 if(event.eventSource.val == 0){
                     this.isVisible = false;
                 }else{
                     this.isVisible = true;
                 }
                 this.emitItemVisibleAction(event.eventSource.val);
            }else if(event.eventType == 'SET_NULLABLE'){
                if(event.eventSource.val == 0){
                    this.isRequired = true;
                }else{
                    this.isRequired = false;
                }
            } else if(event.eventType == 'SET_READONLY'){
                if(event.eventSource.val == 1){
                    this.isReadonly = true;
                }else{
                    this.isReadonly = false;
                }
           }else if(event.eventType == 'SET_VAL'){
                this.initComponent(event.eventSource.val.value);
                this.onChangeEvent(); //触发改变事件
                this.onblurEvent(); //触发失去焦点事件
            }
        },

         emitItemVisibleAction(visiable){
             let _emit = {};
             _emit.action = 'onItemVisibleAction'
             _emit.data = {};
             _emit.data.itemId = this.mItem.itemId;
             _emit.data.visiable = visiable;
             this.$emit('emitEvent',_emit); 
        },

        /*接受事件的回写*/
        callEvent(obj,outputParams){ 
            if(obj.action == 'PAGE' ){ 
                let _value = ";"
                (obj.selItems).forEach((element,idx)=>{
                     _value= element[outputParams.name];
                })
                this.initComponent(_value);
            }else if(obj.action == 'APIPAGE'){
                let _value = "";
                (obj.selItems).forEach((element,idx)=>{
                    if(this.mValue.KVMap){
                        for(let i = 0;i<this.mValue.KVMap.length;i++){
                                if(this.mValue.KVMap[i].desc == element[outputParams.name]){
                                    _value = String(this.mValue.KVMap[i].id);

                                    this.initComponent(_value);
                                    break;
                                }
                        }
                    }
                })
                
            }

            this.onblurEvent();
            this.onChangeEvent();
        },


        callRelWFEvent(selItems){
             let _value  = "";
             (selItems).forEach((element,idx)=>{
                   _value = element.value;
              })

              this.initComponent(_value);

              this.onblurEvent();
              this.onChangeEvent();
        },

        /*提交的时候，获取*/
        getRefValue(){ 
             let _obj = null;
             if(this.isEditable){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.getCsIdObjValue();
             }
            return _obj;
        },

        /*检查 是否可以提交*/
         getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    let _value = this.getCsIdObjValue();
                    if(!_value || _value == ''){
                        return {status:1,msg:this.mItem.itemName+' 必须选择',checkType:'SLT_CASCADE',checkId:'handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId:this.mItem.itemId} ;
                    }
                }
            }
            return {status:0}
        },


        doRefCheck(obj){
            try{
                   this.errTip = true;
                   this.errMsg = obj.msg;
                   let that = this;
                   setTimeout(function(){
                        that.errTip = false;
                   },2000);
                   document.getElementById('handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId).scrollIntoView(true);
            }catch(e){
                console.log(e);
            }
       },

       getCsIdObjValue(){
           let _valArray = [];
           for(let i = 1;i<=this.csLevelNum;i++){
                if(this.csIdObj[String(i)]){
                    _valArray.push(this.csIdObj[String(i)]);
                }
           }
           return _valArray.join(",")
       },

       /*镜像映射*/
        emitMirrorEvent(){ 
            if(this.mValue.itemIdToViewList && this.mValue.itemIdToViewList.length > 0){
                let _emitViewItemMap = [];
                for(let i = 0;i<this.mValue.itemIdToViewList.length;i++){
                    if(this.mItem.viewId != this.mValue.itemIdToViewList[i]){
                        _emitViewItemMap[String(this.mValue.itemIdToViewList[i])] = 1;
                    }
                }
                let _emit = {};
                _emit.action = 'onMirrorEmitAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;
                _emit.data.mirrorViewItem = _emitViewItemMap;
                
                _emit.data.mirrorData = {};
                _emit.data.mirrorData.value = this.value;
                _emit.data.mirrorData.isRequired = this.isRequired;
                _emit.data.mirrorData.isVisible = this.isVisible;
                _emit.data.mirrorData.isReadonly = this.isReadonly;
                _emit.data.mirrorData.isEditable = this.isEditable;

                _emit.data.mirrorData.csArrayObj = EcoUtil.objDeepCopy(this.csArrayObj);
                _emit.data.mirrorData.csIdObj = EcoUtil.objDeepCopy(this.csIdObj);
                _emit.data.mirrorData.csLevelNum = this.csLevelNum;
                _emit.data.mirrorData.csDataMap = EcoUtil.objDeepCopy(this.csDataMap);
     
          
        
                this.$emit('emitEvent',_emit); 
            }
        },

        callMirror(data){
            if(data.mirrorData){
                this.value = data.mirrorData.value;
                this.isRequired = data.mirrorData.isRequired;
                this.isVisible = data.mirrorData.isVisible;
                this.isReadonly = data.mirrorData.isReadonly;
                this.isEditable = data.mirrorData.isEditable;

                this.csArrayObj = data.mirrorData.csArrayObj;
                this.csIdObj = data.mirrorData.csIdObj;
                this.csLevelNum = data.mirrorData.csLevelNum;
                this.csDataMap = data.mirrorData.csDataMap;
            }
        }
        /*镜像映射 结束*/
       
       
  },
  watch: {

  }
}
</script>
<style scoped>



.ecoSelectVue .el-input__inner{
  border: 1px solid #dcdfe6 ;
}


</style>
