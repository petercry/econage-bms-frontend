<template>
  <div class="handleGridAttachmentVue designItem designGridItem" >

            <div class="attachment"  v-if="isEditable && !isReadonly" :id="'handleItem_'+mItem.viewId+'_'+mItem.itemId+'_'+rowIdx+'_'+formIdx">
                <span class="uploadBtn" @click="goAttachementPage"><i class="icon iconfont iconfujian"></i> 上传附件</span>
            </div>

            <div class="fileItem" v-for="(item,idx) in fileLists" :key="item.fileHeaderId">
                    <div>
                            <!-- <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span> -->
                            <span @click="fileEdit(item)" style="cursor:pointer;">{{item.fileName}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                            <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>

                            <span class="delete" v-show="isEditable && !item.operateFlag" @click="fileDelete(item,idx)">删除</span>
                            <span class="recovery" v-show="isEditable && item.operateFlag" @click="fileRecovery(item,idx)">恢复</span>
                    </div>
            </div>

           <el-tooltip class="item" effect="dark" :content="errMsg" placement="left" :value='errTip' >
                    <span></span>
           </el-tooltip>
        </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {mapState } from 'vuex';

export default{
  name:'handleGridAttachment',
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
            fileLists:[],
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
       this.fileLists = this.mValue.attachments?this.mValue.attachments:[];

  },
  computed:{
     ...mapState(['typeImgList'])
  },
  methods: {

        /* 调用全局的上传附件组件 向上冒泡*/
        goAttachementPage(){
                let _emit = {};
                _emit.action = 'onFileUploadAction'
                _emit.data = {};

                _emit.data.itemId = this.mItem.itemId;
                _emit.data.modular = this.valHeader.model;
                _emit.data.modularInnerId = this.valHeader.modelInnerId;

                _emit.data.emitStatus = {}; //保留状态
                _emit.data.emitStatus.itemId = this.mItem.itemId;
                _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列
                this.$emit('emitEvent',_emit); 
        },


         fileDownload(item){
                let _emit = {};
                _emit.action = 'onFileDownloadAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = (item.model && item.model !='')?item.model: this.mValue.model;

                _emit.data.emitStatus = {}; //保留状态
                _emit.data.emitStatus.itemId = this.mItem.itemId;
                _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列

                this.$emit('emitEvent',_emit);   
        },

        filePreview(item){
                let _emit = {};
                _emit.action = 'onFilePreviewAction'
                _emit.data = {};
                
                _emit.data.itemId = this.mItem.itemId;
                _emit.data.defFielId = this.mValue.defFielId?this.mValue.defFielId:"";
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.fileName = item.fileName;
                _emit.data.model = (item.model&&item.model !='')?item.model: this.mValue.model;
                _emit.data.fileType = item.fileType;
                _emit.data.emitStatus = {}; //保留状态
                _emit.data.emitStatus.itemId = this.mItem.itemId;
                _emit.data.emitStatus.gridRowIndex = this.rowIdx;//触发的grid的行
                _emit.data.emitStatus.gridColIndex = this.formIdx;//触发的grid的列

                this.$emit('emitEvent',_emit);   
        },


        fileDelete(item,idx){
            this.$set(this.fileLists[idx],'operateFlag',true);
        },

        fileRecovery(item,idx){
             this.$set(this.fileLists[idx],'operateFlag',false);
        },




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
             _obj.value = this.value;
             _obj.hiddenValue = this.hiddenValue;
             _obj.attachments = this.fileLists;
            return _obj;
        },


        /*Override 设置item的值*/
        setItemOutputParamsValue(value,hiddenValue,fromItemId,attachments){ 
            this.value = value;
            this.hiddenValue = hiddenValue;
            this.fileLists = attachments;
            
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
           if(callObj.action == 'onFileUploadActionCallBack'){
                (callObj.data.fileLists).forEach((element)=>{
                    element.fileSize = EcoUtil.getFileSize(element.size);
                    this.fileLists.push(element);
                })
            }

            this.onChangeEvent();
            this.onblurEvent();
        },

       
        /*提交的时候，获取*/
        getRefValue(){  //提交的时候，获取
             let _obj = null;
             if(true || this.isEditable){ //isEditable 提交
                 _obj  = {};
                 let _fileHeaderIds = [];
                 (this.fileLists).forEach((element)=>{
                     if(element.operateFlag){ //被删除

                     }else{
                         _fileHeaderIds.push(element.fileHeaderId);
                     }
                 })
                 _obj.value = _fileHeaderIds.join(",");
             }
             return _obj;
        },

       getRefCheck(){ //检查 是否可以提交
            if(this.isEditable){
                if(this.isRequired){
                    let _fileHeaderIds = [];
                    (this.fileLists).forEach((element)=>{
                        if(element.operateFlag){ //被删除

                        }else{
                            _fileHeaderIds.push(element.fileHeaderId);
                        }
                    })

                    if(_fileHeaderIds.length == 0){
                        return {status:1,msg:this.mItem.itemName+' 必须上传附件(数据方正第'+(this.rowIdx+1)+'行，第'+(this.formIdx+1)+'列)',checkType:'ATTACHEMENT',checkId:'handleItem_'+this.mItem.viewId+'_'+this.mItem.itemId+'_'+this.rowIdx+'_'+this.formIdx} ;
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
                _emit.data.mirrorData.fileLists = EcoUtil.objDeepCopy(this.fileLists);

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
                this.fileLists = data.mirrorData.fileLists;
            }
        }
  },
  watch: {

  }
}
</script>
<style scoped>

.handleGridAttachmentVue .attachment i{
    font-size: 10px;
}

.handleGridAttachmentVue .attachment{
    margin-left:10px;
    line-height:20px;
    padding-top:5px;
    padding-bottom:5px;
}

.handleGridAttachmentVue .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}


.handleGridAttachmentVue  .fileItem{
    color: #606266;
    margin-left:10px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
}



.handleGridAttachmentVue .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.handleGridAttachmentVue .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.handleGridAttachmentVue .fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.handleGridAttachmentVue .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.handleGridAttachmentVue .fileItem .imgType{
    width:16px;
    height:16px;
}

</style>
