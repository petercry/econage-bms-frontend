<template>
  <div class="handleImgVue designItem" v-show="isVisible">

      <ecoField :titleWidth="mItem.titleWidth?mItem.titleWidth:defaultTitleWidth" :bgColor="mItem.bgColor?mItem.bgColor:mForm?mForm.titleBgColor:null" 
                :titlePos="mItem.titlePos"  v-bind:class="{'iptReadonly':(!isEditable || isReadonly)}" class="handleField" :required="isRequired"
                :textAlign="mItem.titleAlign"
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

            <div slot="content" class="attachementContent"> 
                   
                    <div class="attachment" v-if="isEditable && !isReadonly" :id="'handleItem-'+mItem.viewId+'-'+mItem.itemId">
                         <span class="uploadBtn"  @click="goAttachementPage"><i class="icon iconfont icontupian"></i> 上传图片</span>
                    </div>

                   

                    <div class="image-div" v-show="fileLists.length > 0" >
                        
                        <div class="fileItem" 
                            v-for="(item,idx) in fileLists" 
                            :key="item.fileHeaderId" 
                            @mouseover="mouseOverFile(item,idx)"
                            @mouseout="mouseOutFile(item,idx)"
                            v-show="!item.operateFlag"
                            v-if="tempToken"
                        >
                            <el-image
                                    style="width: 80px;height:80px"
                                    :src="item.smallSrc"
                                    :preview-src-list="getBigSrcList(idx)"
                                    fit="cover"
                                    :zIndex=2910
                                    :ref="'img-'+item.fileHeaderId"
                                >
                                    <div slot="placeholder" class="image-slot">
                                        加载中<span class="dot">...</span>
                                    </div>
                            </el-image>

                            <div class="ecoImg-actions"  v-show="optionIdx == idx">
                                <span class="ecoImg-download">
                                    <i class="icon iconfont iconGroup-" @click="fileDownload(item,idx)"></i>
                                </span>
                                <span class="ecoImg-delete" v-if="isEditable">
                                    <i class="icon iconfont iconshanchudelete30" @click="fileDelete(item,idx)"></i>
                                </span>
                            </div>


                        </div>
                    </div>
            </div> 
     </ecoField>
      
  </div>
</template>
<script>

import ecoField from '../../components/ecoField'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'
import {baseUrl} from '../../../config/env'
import {getEETempToken}  from'../../../service/service.js'


export default{
  name:'handleImg',
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
            hiddenValue:'',
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            hasClick:false,
            iptType:'',
            fileLists:[],
            srcList:[],
            baseUrl:baseUrl,
            tempToken:null,
            optionIdx:-1,
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

       if((this.mValue.onclickEvents && this.mValue.onclickEvents.length > 0)){
            this.hasClick = true;
         
       }
       /*类型*/
       if(this.mValue && this.mValue.valType == 'NUMBER'){
           this.iptType = 'number';
       }
       this.value = this.mValue.value ;
       this.hiddenValue = this.mValue.hiddenValue;

       this.fileLists = this.mValue.attachments;
       this.getTempTokenFunc();

    
  },
  computed:{
    
  },
  methods: {

        getTempTokenFunc(){
            getEETempToken().then((res)=>{
                this.tempToken = res.data;
                (this.fileLists).forEach((element)=>{
                        element.showOptions = false;
                        element.smallSrc = this.baseUrl+'/file-manager/safe/image/thumbnail/traditional?lg=100&mt-token='+this.tempToken+'&file-header-Id='+element.fileHeaderId;
                        element.bigSrc = this.baseUrl+'/file-manager/safe/preview?mt-token='+this.tempToken+'&file-header-Id='+encodeURIComponent(element.fileHeaderId);
                })
            })
        },

        getBigSrcList(idx){

            let _srcList = [];
            for(let i = idx ;i< this.fileLists.length;i++){
                _srcList.push(this.fileLists[i].bigSrc);
            }
            for(let i= 0;i<idx;i++){
                 _srcList.push(this.fileLists[i].bigSrc);
            }
    
            return _srcList;
        },

        /* 调用全局的上传附件组件 向上冒泡*/
        goAttachementPage(){
            let _emit = {};
            _emit.action = 'onFileUploadAction'
            _emit.data = {};
            _emit.data.modular = this.mValue.model;
            _emit.data.modularInnerId = this.mValue.modelInnerId;
            
            _emit.data.uploadType = 'IMAGE';
            _emit.data.btnName = '上传图片';
            _emit.data.limitPictureFile = true;

            _emit.data.statusObj = {};
            _emit.data.statusObj.itemId = this.mItem.itemId;
            this.$emit('emitEvent',_emit); 
        },

        filePreview(item){
                let _emit = {};
                _emit.action = 'onFilePreviewAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = this.mValue.model;
                _emit.data.fileType = item.fileType;
                this.$emit('emitEvent',_emit);   
        },

        fileDownload(item){
                let _emit = {};
                _emit.action = 'onFileDownloadAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = this.mValue.model;
                this.$emit('emitEvent',_emit);   
        },

        fileDelete(item,idx){
            this.$set(this.fileLists[idx],'operateFlag',true);
        },

        fileRecovery(item,idx){
             this.$set(this.fileLists[idx],'operateFlag',false);
        },

        mouseOverFile(item,idx){
            this.optionIdx = idx;
            this.$set(this.fileLists[idx],'showOptions',true);
        },

        mouseOutFile(item,idx){
            this.optionIdx = -1;
            this.$set(this.fileLists[idx],'showOptions',false);
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
       onblurEvent(){
            /*数字类型的判断*/
            if(this.iptType == 'number'){
                if(this.value && this.value !=''){
                    if( !EcoUtil.isNumber(this.value)){
                        this.$refs.iptRef.blur();
                        EcoMessageBox.alert('请检查'+this.mItem.itemName+'格式是否正确');
                        return ;
                    }
                }
            }
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
        onChangeEvent(){ 
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
                this.fileLists = [];
                if(event.eventSource.val.attachments){
                        (event.eventSource.val.attachments).forEach((fillElement)=>{
                            fillElement.id = fillElement.fileHeaderId;
                           
                            fillElement.smallSrc = this.baseUrl+'/file-manager/safe/image/thumbnail/traditional?lg=100&mt-token='+this.tempToken+'&file-header-Id='+fillElement.fileHeaderId;
                            fillElement.bigSrc = this.baseUrl+'/file-manager/safe/preview?mt-token='+this.tempToken+'&file-header-Id='+encodeURIComponent(fillElement.fileHeaderId);

                            this.fileLists.push(fillElement);
                        })
                }
                
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
           if(obj.action == 'PAGE' || obj.action == 'APIPAGE'){ 
                if(outputParams.name !='out0'){
                     (obj.selItems).forEach((element,idx)=>{
                          this.value = element[outputParams.name];
                     })
                }
            }else if(obj.action == 'onFileUploadActionCallBack'){
                (obj.data.fileLists).forEach((element)=>{
                    element.showOptions = false;
                    element.fileSize = EcoUtil.getFileSize(element.size);
                    element.smallSrc = this.baseUrl+'/file-manager/safe/image/thumbnail/traditional?lg=100&mt-token='+this.tempToken+'&file-header-Id='+element.fileHeaderId;
                    element.bigSrc = this.baseUrl+'/file-manager/safe/preview?mt-token='+this.tempToken+'&file-header-Id='+encodeURIComponent(element.fileHeaderId);
                    this.fileLists.push(element);
                })
            }
            this.onChangeEvent();
            this.onblurEvent();
       },

       callRelWFEvent(selItems){
             this.fileLists = [];
             let _that = this;
             (selItems).forEach((element,idx)=>{
                    if(element.attachments && element.attachments.length > 0 ){
                            (element.attachments).forEach((fillElement)=>{
                                    fillElement.id = fillElement.fileHeaderId;


                                    _that.fileLists.push(fillElement);
                            })
                    }
              })
             
             this.onblurEvent();
             this.onChangeEvent();
        },

        /*提交的时候，获取*/
        getRefValue(){ 
             let _obj = null;
             if(this.isEditable){ //isEditable 提交
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

       /*检查 是否可以提交*/
       getRefCheck(){ 
            if( this.isEditable ){
                if(this.isRequired ){
                    let _fileHeaderIds = [];
                    (this.fileLists).forEach((element)=>{
                        if(element.operateFlag){ //被删除

                        }else{
                            _fileHeaderIds.push(element.fileHeaderId);
                        }
                    })
                    if(_fileHeaderIds.length == 0){
                        return { status:1,msg:this.mItem.itemName+' 必须上传图片',checkType:'IMG',checkId:'handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId:this.mItem.itemId} ;
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
                _emit.data.mirrorData.hiddenValue = this.hiddenValue;
                _emit.data.mirrorData.isRequired = this.isRequired;
                _emit.data.mirrorData.isVisible = this.isVisible;
                _emit.data.mirrorData.isReadonly = this.isReadonly;
                _emit.data.mirrorData.isEditable = this.isEditable;
                _emit.data.mirrorData.fileLists = EcoUtil.objDeepCopy(this.fileLists);

                this.$emit('emitEvent',_emit); 
            }
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
        /*镜像映射 结束*/
  },
  watch: {

  }
}
</script>
<style scoped>
.designItem .attachementContent{
    min-height: 40px;
}

.designItem .attachment i{
    font-size: 10px;
}
.designItem .attachment{
    margin-left:10px;
    line-height: 20px;
    padding-bottom:10px;
    padding-top:10px;
}

.designItem .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.designItem .image-div{
    margin-top:10px;
}

.designItem  .fileItem{
    padding: 0px 0;
    text-align: center;
    display: inline-block;
    width: 20%;
    box-sizing: border-box;
    vertical-align: top;
    position: relative;
}



.designItem .fileItem .download{
    margin-right:5px;
    cursor: pointer;
    color:#3891eb;
}

.designItem .fileItem .preview{
    margin-left:5px;
    cursor: pointer;
    color:#3891eb;
}

.designItem .fileItem .delete{
    margin-left:5px;
    cursor: pointer;
    color:#67c23a;
}

.designItem .fileItem .recovery{
    margin-left:5px;
    cursor: pointer;
    color:#e03a3a
}

.handleImgVue  .ecoImg-actions {
    position: absolute;
    left: 19px;
    bottom:15px;
    right:20px;
    height:25px;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 1;
    font-size: 20px;
    background-color: rgba(0,0,0,.4);
    transition: opacity .3s;
    width:80px;
    margin:auto;
}

.handleImgVue  .ecoImg-delete{
    position: absolute;
    color:#fff;
    right:5px;
    bottom:-8px;
    cursor: pointer;
}

.handleImgVue  .ecoImg-download{
    position: absolute;
    color:#fff;
    left:5px;
    bottom:-8px;
    cursor: pointer;
}







</style>
