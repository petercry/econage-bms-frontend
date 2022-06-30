<template>
  <div class="handleGridSelectVue designItem designGridItem">
                <el-select v-model="value" filterable clearable placeholder="请选择" @change="onChangeEvent" :disabled="(!isEditable || isReadonly)" size="mini">
                        <el-option
                            v-show="item.enableInCreate || (!isEditable && showItemMap[String(item.id)] )"
                            v-for="item in wfKvMap[valHeader.kvName]"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                            size="mini"
                        >
                        </el-option>
                </el-select>
                
                <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                                <span></span>
                </el-tooltip>
  </div>
</template>
<script>

import {mapState,mapMutations} from 'vuex'
import {EcoUtil} from '@/components/util/main.js'

export default{
  name:'handleGridSelect',
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
        this.value = this.mValue.value;

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
        ...mapState([
            'wfKvMap',
        ]),
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
             _obj.value = this.value
            return _obj;
        },


        /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId,action){ //Override 设置item的值
            if(action && action == 'API'){
                 if(this.wfKvMap[this.valHeader.kvName]){
                        for(let i = 0;i<this.wfKvMap[this.valHeader.kvName].length;i++){
                            if(this.wfKvMap[this.valHeader.kvName][i].text == value){
                                this.value = String(this.wfKvMap[this.valHeader.kvName][i].id);
                                break;
                            }else if(String(this.wfKvMap[this.valHeader.kvName][i].id) == value){
                                this.value = String(this.wfKvMap[this.valHeader.kvName][i].id);
                                break;
                            }
                        }
                 }
            }else{
                this.value = value;
            }
            
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
        callEvent(obj,outputParams){ 
            
             if(obj.action == 'PAGE' || obj.action == 'APIPAGE'){ 
                (obj.selItems).forEach((element,idx)=>{
                    this.value = element[outputParams.name];
                })
            }
            

            this.onblurEvent();
            this.onChangeEvent();
        },

        /*提交的时候，获取*/
        getRefValue(){ 
             let _obj = null;
             if(true||this.isEditable){ //isEditable 提交
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
                        return {status:1,msg:this.mItem.itemName+'必须选择(数据方正第'+(this.rowIdx+1)+'行，第'+(this.formIdx+1)+'列)',checkType:'SLT',checkId:'handleItem_'+this.mItem.viewId+'_'+this.mItem.itemId+'_'+this.rowIdx+'_'+this.formIdx} ;
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
            }catch(e){
                console.log(e);
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
                _emit.data.mirrorData.isRequired = this.isRequired;
                _emit.data.mirrorData.isVisible = this.isVisible;
                _emit.data.mirrorData.isReadonly = this.isReadonly;
                _emit.data.mirrorData.isEditable = this.isEditable;

                this.$emit('emitEvent',_emit); 
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
