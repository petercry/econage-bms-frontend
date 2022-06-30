<template>
  <div class="ecoOrgSelectVue designItem" v-show="showflag">
      
        <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:defaultTitleWidth" :titlePos="mItem.titlePos" :required="isRequired">
                <div slot="label" >
                    <div class="labelTitle" >
                        <!-- <i v-if="isRequired" class="el-form-required-i">*</i> -->
                     
                        <span >{{mItem.itemName}}</span>
                          <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
                        </el-tooltip>
                    </div>
                </div>

                 <div slot="content"> 
                      <el-input 
                        :value="value" 
                        readonly 
                        @click.native="onClickEvent" 
                        v-bind:class="{'iptReadonly':(!isEditable || isReadonly),'pointerCalss':isEditable}">
                      </el-input>
                      <input type="hidden" v-model="hiddenValue" :id="'ecoOrg_'+mItem.itemId" actionGroup=true/>
                      <input type="hidden" v-model="value" :id="'ecoOrg_'+mItem.itemId+'_text'" actionGroup=true/>
                 </div>
        </ecoField>

  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'

export default{
  name:'ecoApprovalOrgSelect',
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
        mTask:{
            type:Object,
            default:function(){
                return {};
            }
        }
  },
  data(){
        return {
            value:'',
            hiddenValue:'',

            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            showflag:false,

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

       this.showflag = (this.mTask.actionGroupId == 0 || ( this.mTask.actionGroupId == this.mItem.actionGroup));
       this.hiddenValue = this.mValue.hiddenValue;
       this.value = this.mValue.value;   
   
       let that = this;
        setTimeout(function(){
            that.initApprovalDesc();
            that.initValue();
        },300)

       this.showflag = false;

      
       if(!this.showflag){
           let _emit = {};
           _emit.action = 'approvalRowShowFlag'
           _emit.data = {};
           this.$emit('emitEvent',_emit); 
       }
     
      
   
  },
  computed:{
      
  },
  methods: {
        initValue(){
            try{
                let _nValue = '';
                if(this.value && this.value !=''){
                        let _valueArray = (this.mValue.value).split(',');
                        if(_valueArray && _valueArray.length > 0){
                                for(let i = 0;i< _valueArray.length;i++){
                                    if(_nValue!=''){
                                        _nValue+=',';
                                    }
                                    if(_valueArray[i].indexOf(' ')>-1){
                                        _nValue+= _valueArray[i].split(' ')[0];           
                                    }else{
                                        _nValue+=_valueArray[i];
                                    }
                                }
                        } 
                    }
                    this.value = _nValue;
            }catch(e){
                    this.value = this.mValue.value; 
            }
        },

        initApprovalDesc(){
                /*传递事件给 approvalDesc 组件*/
                let _emit = {};
                _emit.action = 'approvalActGroupEvent';
                _emit.data = {};
                _emit.data.actionGroup = this.mItem.actionGroup;
                _emit.data.targetGroupItemName = 'approvalDescItem';
                _emit.data.targetGroupItemNamePre = '#';
                _emit.data.approvalOrgSelectDoShow = (this.isEditable && !this.isReadonly);
                _emit.data.value = this.value;
                _emit.data.hiddenValue = this.hiddenValue;
                _emit.data.actionGroupItemName = this.mItem.itemName;
                _emit.data.action = 'approvalOrgSelectDoShow';

            
                this.$emit('emitEvent',_emit);
        },

        onblurEvent(event){ //失去焦点事件
                (this.mValue.onblurEvents).forEach((eventKey)=>{
                        let _emit = {};
                        _emit.action = 'onEventKeyAction'
                        _emit.data = {};
                        _emit.data.itemId = this.mItem.itemId;
                        _emit.data.eventKey = eventKey;
                        this.$emit('emitEvent',_emit); 
                 })
         },

         onChangeEvent(event){ //chang事件
            (this.mValue.onchangeEvents).forEach((eventKey)=>{
                   let _emit = {};
                    _emit.action = 'onEventKeyAction'
                    _emit.data = {};
                    _emit.data.itemId = this.mItem.itemId;
                    _emit.data.eventKey = eventKey;
                    this.$emit('emitEvent',_emit); 
            });
         },
     
         onClickEvent(event){  //点击事件 向上抛出选人事件
                if(this.isEditable){
                    (this.mValue.onclickEvents).forEach((element)=>{
                            let emitObj = {};
                            emitObj.action = 'onEventKeyAction';
                            emitObj.data = {};
                            emitObj.data.itemId = this.mItem.itemId;

                            emitObj.data.initData = {};
                            emitObj.data.initData.initDataType = 'STR';
                            emitObj.data.initData.initDataStr = this.hiddenValue; 
                            emitObj.data.initData.actionGroup = true;
                            emitObj.data.initData.maxOrgPathLevel = 0;
                            emitObj.data.initData.selectType = 'USER-ROLE';
                            
                            
                            emitObj.data.isRole = true;
                            emitObj.data.eventKey = element;
                            this.$emit('emitEvent',emitObj);
                    });
                }
        },

        /*设置相关性*/
        setItemInteraction(event){
            
            if(event.eventType == 'SET_VISIBALE'){
                let _emit = {};
                _emit.action = 'approvalActGroupEvent';
                _emit.data = {};
                _emit.data.actionGroup = this.mItem.actionGroup;
                _emit.data.targetGroupItemName = 'approvalDescItem';
                _emit.data.targetGroupItemNamePre = '#';
                _emit.data.approvalOrgSelectDoShow = (event.eventSource.val == 0)?false:true
                _emit.data.action = 'approvalOrgInteractionSetVisibale';
                this.$emit('emitEvent',_emit); 
              
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
                 this.approvalSelectOrgCallBack();
            }
        },

       callEvent(callObj){
      
            if(callObj && callObj.action == "orgSelectPopupConfirm"){
                    this.orgSelectPopupConfim(callObj);//选人组件确定回写
                    this.onChangeEvent(); //触发改变事件
                    this.onblurEvent(); //触发失去焦点事件
            }else if(callObj && callObj.action == 'callApprovalSelectOrgAction'){

                     this.onClickEvent();
            }
        },

        callRelWFEvent(selItems){
             (selItems).forEach((element,idx)=>{
                    this.value = element.value;
                    this.hiddenValue = element.hiddenValue;
              })
             
             this.onblurEvent();
             this.onChangeEvent();
        },

        orgSelectPopupConfim(callBackObj){ //选人组件确定回写
                let _value = callBackObj.data.id;
                let _text = callBackObj.data.name;
                if(_value  && (this.mItem.actionGroup || this.mItem.actionGroup == 0)){
                     _value =  this.mItem.actionGroup + '|'+_value;
                }
                this.hiddenValue = _value;
                this.value = _text;

                this.approvalSelectOrgCallBack();
                
        },

        approvalSelectOrgCallBack(){
                /*传递事件给 approvalDesc 组件*/
                let _emit = {};
                _emit.action = 'approvalActGroupEvent';
                _emit.data = {};
                _emit.data.actionGroup = this.mItem.actionGroup;
                _emit.data.targetGroupItemName = 'approvalDescItem';
                _emit.data.targetGroupItemNamePre = '#';
                _emit.data.value = this.value;
                _emit.data.hiddenValue = this.hiddenValue;
                _emit.data.action = 'approvalSelectOrgCallBack';
                this.$emit('emitEvent',_emit); 
        },
        

        getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(this.isEditable){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.hiddenValue;
             }
            return _obj;
        },

       getRefCheck(){ //检查 是否可以提交
            if(this.isEditable ){
                if(this.isRequired ){
                    if(!this.hiddenValue || this.hiddenValue == ''){
                        return {status:1,msg:this.mItem.itemName+' 必须选择',checkId:'handleItem'+this.mItem.itemId,itemId:this.mItem.itemId} ;
                    }
                }
            }
           
            return {status:0}
        },

         doRefCheck(obj){
                try{
                    /*传递事件给 approvalDesc 组件*/
                    let _emit = {};
                    _emit.action = 'approvalActGroupEvent';
                    _emit.data = {};
                    _emit.data.actionGroup = this.mItem.actionGroup;
                    _emit.data.targetGroupItemName = 'approvalDescItem';
                    _emit.data.targetGroupItemNamePre = '#';
                    _emit.data.action = 'doRefCheck';
                    _emit.data.msgObj = obj;
                    this.$emit('emitEvent',_emit); 

                    this.onClickEvent();
                }catch(e){
                    console.log(e);
                }
        }


  },
  watch: {

  }
}
</script>
<style scoped>


</style>
