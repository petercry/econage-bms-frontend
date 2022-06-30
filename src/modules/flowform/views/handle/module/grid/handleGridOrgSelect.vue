<template>
  <div class="handleGridOrgSelectVue designItem designGridItem" >
            <el-input 
                :value="getFilterValue(value)" 
                readonly 
                    v-bind:class="{'iptReadonly':(!isEditable|| isReadonly),'pointerClass':isEditable}"
                   :placeholder="(false && mItem.inst && mItem.inst !='')?mItem.inst:'请选择机构'"
                    @click.native="onClickEvent" 
                :id="'handleItem_'+mItem.viewId+'_'+mItem.itemId+'_'+rowIdx+'_'+formIdx"

                type="textarea" 
                :autosize="{ minRows:1,maxRows:4}" 
            >
                <i slot="suffix" class="icon iconfont iconrenyuan pointerClass"></i>
            </el-input>
            
            <input type="hidden" v-model="hiddenValue" :id="'ecoOrg_'+mItem.itemId+'_'+rowIdx+'_'+formIdx" actionGroup=true/>
            <input type="hidden" v-model="value" :id="'ecoOrg_'+mItem.itemId+'_'+rowIdx+'_'+formIdx+'_text'" actionGroup=true/>

             <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
           </el-tooltip>
        </div>
</template> 
<script>

import {EcoUtil} from '@/components/util/main.js'


export default{
  name:'handleGridOrgSelectVue',
  components:{
      
  },
  props:{
        mItem:{
            type:Object
        },
        mValue:{
            type:Object
        },
        valHeader:{
            type:Object
        },
        rowIdx:{
            type:Number
        },
        formIdx:{
            type:Number
        },
  },
  data(){
        return {
            value:'',
            hiddenValue:'',

            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台

            errTip:false,
            errMsg:'',
          
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

       this.hiddenValue = this.mValue.hiddenValue;
       this.value = this.mValue.value;   

   
  },
  computed:{
      
  },
  methods: {
        /*触发点击焦点事件*/
       onClickEvent(){     
           if(this.isEditable && (!this.isReadonly)){
                (this.valHeader.onclickEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;

                        _emit.data.initData = {};
                        _emit.data.initData.initDataType = 'STR';
                        _emit.data.initData.initDataStr = this.hiddenValue; 
                        _emit.data.initData.actionGroup = true;
                        _emit.data.initData.maxOrgPathLevel = 0;
                           
                        _emit.data.emitStatus = {}; //保留状态
                        _emit.data.emitStatus.itemId = this.mItem.itemId;
                        _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                        _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列
                        this.$emit('emitEvent',_emit); 
                })
            }
       },

       /*失去焦点事件*/ 
       onblurEvent(){
           if(this.isEditable && (!this.isReadonly)){
            (this.valHeader.onblurEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        _emit.data.emitStatus = {}; //保留状态
                        _emit.data.emitStatus.itemId = this.mItem.itemId;
                        _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                        _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列
                        this.$emit('emitEvent',_emit); 
             })
           }
        },

        /*chang事件*/
        onChangeEvent(){ 
            (this.valHeader.onchangeEvents).forEach((eventKey)=>{
                     let _emit = {};
                     _emit.action = 'onEventKeyAction'
                     _emit.data = {};
                     _emit.data.itemId = this.mItem.itemId;
                     _emit.data.eventKey = eventKey;

                     _emit.data.emitStatus = {}; //保留状态
                     _emit.data.emitStatus.itemId = this.mItem.itemId;
                     _emit.data.emitStatus.parentItemId = this.mItem.itemId;
                     _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                     _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列
                     this.$emit('emitEvent',_emit); 
            });

             this.onInteraction();
             this.emitMirrorEvent();
        },


         /*相关性*/
        onInteraction(){
            if(this.valHeader.hasInteraction){
                    let _emit = {};
                    _emit.action = 'onInteractionAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.emitStatus = {}; //保留状态
                    _emit.data.emitStatus.itemId = this.mItem.itemId;
                    _emit.data.emitStatus.parentItemId = this.mItem.itemId;
                    _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                    _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列
                    this.$emit('emitEvent',_emit);
            }
        },
        

        /*Override 获取某个item的值*/
        getItemInputParamsValue(){ 
            let _obj = {};
             _obj.value = this.value;
             _obj.hiddenValue = this.hiddenValue;
            return _obj;
        },


        /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId){ 
            this.value = value;
            this.hiddenValue = hiddenValue;
            if(this.mItem.itemId != fromItemId){ //如果触发元不是本组件，接着触发本组件的chang事件
                    this.onChangeEvent();
                    this.onblurEvent();
            }
       },



        /*设置相关性*/
        setItemInteraction(event){
            if(false && event.eventType == 'SET_VISIBALE'){
                 if(event.eventSource.val == 0){
                     this.isVisible = false;
                 }else{
                     this.isVisible = true;
                 }
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

        /*接受事件的回写*/
       callEvent(callObj){
            if(callObj && callObj.action == "orgSelectPopupConfirm"){
                    this.orgSelectPopupConfim(callObj);//选人组件确定回写
                    this.onChangeEvent(); //触发改变事件
                    this.onblurEvent(); //触发失去焦点事件
            }
        },

        orgSelectPopupConfim(callBackObj){ //选人组件确定回写
                let _value = callBackObj.data.id;
                let _text = callBackObj.data.name;
                 if((this.mItem.actionGroup || this.mItem.actionGroup == 0 ) && (_value && _value !='' )){
                     _value =  this.mItem.actionGroup + '|'+_value;
                }
                this.hiddenValue = _value;
                this.value = _text;
        },
       
        /*提交的时候，获取*/
        getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(true||this.isEditable ){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.hiddenValue;
             }
            return _obj;
        },

       getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    if(!this.hiddenValue || this.hiddenValue == ''){
                        return {status:1,msg:this.mItem.itemName+' 必须选择(数据方正第'+(this.rowIdx+1)+'行，第'+(this.formIdx+1)+'列)',checkType:'USERSLT',checkId:'handleItem_'+this.mItem.viewId+'_'+this.mItem.itemId+'_'+this.rowIdx+'_'+this.formIdx} ;
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
                  this.onClickEvent();
            }catch(e){
                console.log(e);
            }
        },

        getFilterValue(value){
            let _valueArray = [];
            let _valueName = [];
            if(value){
                _valueArray = value.split(",");
                for(let i = 0;i<_valueArray.length;i++){
                    _valueName.push(this.filterName(_valueArray[i]));
                }
            }
            return _valueName.join(",");
        },

        filterName(item){
            if(item && item.lastIndexOf('-')>-1){
                return item.substring(item.lastIndexOf('-')+1);
            }else{
                return item;
            }
        },

        /*chang事件*/
        emitMirrorEvent(){ 
                let _emit = {};
                _emit.action = 'onMirrorEmitAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;

                _emit.data.emitStatus = {}; //保留状态
                _emit.data.emitStatus.itemId = this.mItem.itemId;
                _emit.data.emitStatus.parentItemId = this.mItem.itemId;
                _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列

                _emit.data.mirrorData = {};
                _emit.data.mirrorData.value = this.value;
                _emit.data.mirrorData.hiddenValue = this.hiddenValue;
                _emit.data.mirrorData.isRequired = this.isRequired;
                _emit.data.mirrorData.isVisible = this.isVisible;
                _emit.data.mirrorData.isReadonly = this.isReadonly;
                _emit.data.mirrorData.isEditable = this.isEditable;
                // _emit.data.mirrorData.valueArray = EcoUtil.objDeepCopy(this.valueArray);
                this.$emit('emitEvent',_emit); 
        },

        callMirror(data){
            if(data.mirrorData){
                this.value = data.mirrorData.value;
                this.hiddenValue = data.mirrorData.hiddenValue;
                this.isRequired = data.mirrorData.isRequired;
                this.isVisible = data.mirrorData.isVisible;
                this.isReadonly = data.mirrorData.isReadonly;
                this.isEditable = data.mirrorData.isEditable;
                // this.valueArray = data.mirrorData.valueArray;
            }
        }
  },
  watch: {

  }
}
</script>
<style scoped>

</style>
