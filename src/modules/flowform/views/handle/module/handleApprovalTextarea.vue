<template>
      <div class="ecoApprovalTextareaVue ecoZJVue" v-show="showflag">
         
          <el-input v-model="value" type="textarea" 
                    :autosize="{ minRows: 3}"  
                    :placeholder="'请输入'+mItem.itemName+'意见'"
                    :readonly="isReadonly"
                    style="border:1px solid #dcdfe6;"
         ></el-input>

         <div class="quickSuggest" v-if="mApproveKv.length > 0">
               <el-dropdown trigger="click" placement="top-start">
                    <span class="el-dropdown-link pointerClass">
                        快捷意见
                    </span>
                 
                    <el-dropdown-menu slot="dropdown"  v-bind:class="{quickSuggestDrop:mApproveKv.length > 8 }">
                        <el-dropdown-item v-for="(item,idx) in mApproveKv" :key="idx" @click.native="clickApprove(item)">{{item.text}}</el-dropdown-item>
                    </el-dropdown-menu>
               
                </el-dropdown>
        </div>

      </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import ecoField from '../../components/ecoField'
export default{
  name:'ecoApprovalTextarea',
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
        },
        mApproveKv:{
            type:Array,
            default:function(){
                return [];
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
            fileLists:[],

           
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

        if(this.mValue && this.mValue.actionGroupIds.length > 0){
            for(let i = 0;i<this.mValue.actionGroupIds.length;i++){
                if(this.mTask.actionGroupId == this.mValue.actionGroupIds[i]){
                     this.showflag = true;
                     break;
                }
            }
        }

       
    // this.showflag = (this.mTask.actionGroupId == this.mItem.actionGroup);
       if(!this.showflag){
           let _emit = {};
           _emit.action = 'approvalRowShowFlag'
           _emit.data = {};
           this.$emit('emitEvent',_emit); 
       }

       if(this.showflag){
            this.initTaskAttachment();
       }
   
  },
  computed:{
     
  },
  methods: {
      initTaskAttachment(){
                    /*传递事件给 approvalDesc 组件*/
                    let _emit = {};
                    _emit.action = 'callEventAction';
                    _emit.refName = 'mappr_attachments';

                    _emit.data = {};
                    _emit.data.action = 'initTaskAttachment';
                    _emit.data.fileLists = this.mValue.attachments?this.mValue.attachments:[];
                    this.$emit('emitEvent',_emit); 
       },
      onClickEvent(){
            /*触发点击焦点事件*/
            (this.mValue.onclickEvents).forEach((eventKey)=>{
                 let _emit = {};
                 _emit.action = 'onEventKeyAction'
                 _emit.data = {};
                 _emit.data.itemId = this.mItem.itemId;
                 _emit.data.eventKey = eventKey;
                 this.$emit('emitEvent',_emit); 
            })
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
         
  
       getItemInputParamsValue(){  //Override 获取某个item的值
            let _obj = {};
             _obj.value = this.value
            return _obj;
       },

       setItemOutputParamsValue(value,hiddenValue,fromItemId){ //Override 设置item的值
            this.value = value;
            if(this.mItem.itemId != fromItemId){ //如果触发元不是本组件，接着触发本组件的chang事件
                this.onChangeEvent();
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

      callEvent(obj,outputParams){ //接受事件的回写
            if(obj.action == 'PAGE' || obj.action == 'APIPAGE'){ 
                if(outputParams.name !='output'){
                     (obj.data.selItems).forEach((element,idx)=>{
                          this.value = element[outputParams.name];
                     })
                }else{
                      if(obj.data.selItems){
                            let _value = '';
                            (obj.data.selItems).forEach((element,idx)=>{
                                    if(_value!=''){
                                        _value+=';';
                                    }
                                    _value += element.requestDesc;
                            })
                            this.value = _value;
                    }
                }
            }else if(obj.action == 'approvalSuggestChange'){
                if(this.value == null || this.value == '' || obj.allDesc.indexOf('#'+this.value+'#')>-1){
                        this.value = obj.desc;
                }
            }else if(obj.action == 'onFileUploadActionCallBack'){
                (obj.data.fileLists).forEach((element)=>{
                    element.fileSize = EcoUtil.getFileSize(element.size);
                    this.fileLists.push(element);
                })
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
       


        getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(this.isEditable ){ //isEditable 提交
                 _obj  = {};
                 _obj.value = this.value;
             }
            return _obj;
        },

        getRefCheck(){ //检查 是否可以提交
            return {status:0}
        },

        clickApprove(item){
            this.value = (this.value && this.value!=''?(this.value+'  '):'')+item.text;
        }
     
  },
  watch: {

  }
}
</script>
<style>
 .quickSuggestDrop{
    max-height:230px;
    overflow:auto;
}
</style>

<style scoped>
.ecoTextLabel{
    font-size:14px;
    padding:10px 15px 0px 17px;
    line-height:20px;
}


.flowFormVue .ecoApprovalTextareaVue .el-textarea__inner{
    padding-left:15px !important;
}


.ecoApprovalTextareaVue .attachementContent{
    min-height: 40px;
}

.ecoApprovalTextareaVue .attachment i{
    font-size: 10px;
}
.ecoApprovalTextareaVue .attachment{
    margin-left:0px;
    line-height: 20px;
    padding-top:10px;
    padding-bottom:10px;
}

.ecoApprovalTextareaVue .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.ecoApprovalTextareaVue  .fileItem{
    color: #606266;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
}

.ecoApprovalTextareaVue .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.ecoApprovalTextareaVue .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.ecoApprovalTextareaVue .fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.ecoApprovalTextareaVue .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}
.ecoApprovalTextareaVue .quickSuggest{
    margin-top:10px;
}
</style>
