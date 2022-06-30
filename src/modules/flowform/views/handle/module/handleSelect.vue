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
          
            <div slot="content"> 
                <el-select v-model="value" filterable clearable placeholder="请选择" @change="onChangeEvent" :disabled="(!isEditable || isReadonly)" size="mini" :id="'handleItem-'+mItem.viewId+'-'+mItem.itemId" 
                    v-bind:style="{width:mItem.itemWidth==0?'auto':(mItem.itemWidth>100?100:mItem.itemWidth)+'%'}" >
                            <el-option
                                v-show="item.enableInCreate || (!isEditable && showItemMap[String(item.id)] )"
                                v-for="item in mValue.KVMap"
                                :key="item.id"
                                :label="item.text"
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

import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'


export default{
  name:'ecoSelect',
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
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台

            errTip:false,
            errMsg:'',
            showItemMap:{}
        }
  },
  created(){
       
  },
  mounted(){
        this.value = this.mValue.value ;

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

        if(this.value && this.value!=''){
             this.showItemMap[String(this.value)] = 1;
        }

  
  },
  computed:{
     
  },
  methods: {
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
        onChangeEvent(event){
            (this.mValue.onchangeEvents).forEach((eventKey)=>{
                   let _emit = {};
                    _emit.action = 'onEventKeyAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.eventKey = eventKey;
                    this.$emit('emitEvent',_emit); 
            });

           
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

    

        /*Override 获取某个item的值*/
        getItemInputParamsValue(){ 
            let _obj = {};
             _obj.value = this.value
            return _obj;
        },

        /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId){ //Override 设置item的值
            this.value = value;
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
                this.value = event.eventSource.val.value;
                this.hiddenValue = event.eventSource.val.hiddenValue;

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
                (obj.selItems).forEach((element,idx)=>{
                    this.value = element[outputParams.name];
                })
            }else if(obj.action == 'APIPAGE'){
                (obj.selItems).forEach((element,idx)=>{
                    if(this.mValue.KVMap){
                            for(let i = 0;i<this.mValue.KVMap.length;i++){
                                if(this.mValue.KVMap[i].text == element[outputParams.name]){
                                    this.value = String(this.mValue.KVMap[i].id);
                                    break;
                                }else if(String(this.mValue.KVMap[i].id) == element[outputParams.name]){
                                    this.value = String(this.mValue.KVMap[i].id);
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
             (selItems).forEach((element,idx)=>{
                    this.value = element.value;
                    this.hiddenValue = element.hiddenValue;
              })
             
             this.onblurEvent();
             this.onChangeEvent();
        },

        /*提交的时候，获取*/
        getRefValue(){ 
             let _obj = null;
             if(this.isEditable){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.value;
             }
            return _obj;
        },

        /*检查 是否可以提交*/
         getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    if(!this.value || this.value == ''){
                        return {status:1,msg:this.mItem.itemName+' 必须选择',checkType:'SLT',checkId:'handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId:this.mItem.itemId} ;
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
