<template>
  <div class="handleAttachementVue designItem" v-show="isVisible">

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
                         <span class="uploadBtn" @click="goAttachementPage"><i class="icon iconfont iconfujian"></i> 上传附件</span>
                    </div>

                    <div class="downloadAll"  v-if="!isEditable && fileLists.length > 0">
                         <span class="uploadBtn" @click="fileDownloadAll"><i class="icon iconfont iconfujian"></i>&nbsp;全部下载</span>
                    </div>

                    <div class="fileItem" v-for="(item,idx) in fileLists" :key="item.fileHeaderId">
                        <div >
                                <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                <span style="cursor:pointer;">{{item.fileName}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                <span class="download" @click="fileDownload(item)">下载</span>
                                
                                <i v-if="publicSettingUnion && publicSettingUnion.functionPoints && publicSettingUnion.functionPoints.previewServerEnabled">|<span class="preview" @click="filePreview(item)">预览</span></i>
                                <i v-if="publicSettingUnion && publicSettingUnion.functionPoints && publicSettingUnion.functionPoints.webOfficeEnabled">|<span class="signature" @click="fileEdit(item)">在线编辑</span></i>
                                <i v-if="publicSettingUnion && publicSettingUnion.functionPoints && publicSettingUnion.functionPoints.browserSignEnabled && mTask.fileSign == 1 && (item.fileType == 'pdf' || item.fileType == 'doc' || item.fileType == 'docx' || item.fileType == 'xls' || item.fileType == 'xlsx' )">|<span class="signature" @click="fileSignature(item,idx)">盖章</span></i>
                                <i v-if="publicSettingUnion && publicSettingUnion.functionPoints && publicSettingUnion.functionPoints.fileManagerReplaceEnabled && isEditable">|<span class="signature" @click="fileReplace(item)">更新</span></i>

                                <span class="delete" v-show="isEditable && !item.operateFlag" @click="fileDelete(item,idx)">[ 点击删除 ]</span>
                                <span class="recovery" v-show="isEditable && item.operateFlag" @click="fileRecovery(item,idx)">[ 点击恢复 ]</span>
                        </div>
                        <div v-show="false">
                            (&nbsp;<span class="userName">{{item.createUser}}</span>&nbsp;
                                    <span class="userName">{{item.createDate}}</span>
                                )
                        </div>
                    </div>


                    <div class="fileTemplateDiv" v-if="isEditable && (attchTemplate && attchTemplate.vlist  && attchTemplate.vlist.length> 0)">
                        <span class="title">附件模版</span>
                        <div class="fileItem" v-for="(item,idx) in attchTemplate.vlist" :key="item.fileHeaderId">
                                <div>
                                    <span class="imgType"><img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/>&nbsp;</span>
                                    <span style="cursor:pointer;">{{item.fileName}}&nbsp;</span><span>(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                    <span class="download" @click="fileDownloadTemplate(item)">下载</span>|<span class="preview" @click="filePreviewTemplate(item)">预览</span>
                                </div>
                        </div>
                    </div>

            </div> 
     </ecoField>
      
  </div>
</template>
<script>

import {convert2Pdf} from'../../../service/service'
import ecoField from '../../components/ecoField'
import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import {defaultTitleWidth,defaultFTColor}  from'../../../config/setting.js'
import { mapState,mapMutations } from 'vuex';
import {Loading} from 'element-ui';

export default{
  name:'handleAttachement',
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
        mTask:{
            type:Object
        },
        formWf:{
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
            attchTemplate:{},
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
    
       this.attchTemplate = (this.mItem.attchTemplate?this.mItem.attchTemplate:{});
       this.emitSFWAttBtnVisibleAction(this.isVisible);
       this.emitSFWAttEditListAction();
    
    
  },
  computed:{
     ...mapState(['typeImgList','publicSettingUnion'])
  },
  methods: {
        //如果是收发文组件的上传附件，向上冒泡，组件显示还是隐藏
        initEmit(){

        },

        /* 调用全局的上传附件组件 向上冒泡*/
        goAttachementPage(){
            let _emit = {};
            _emit.action = 'onFileUploadAction'
            _emit.data = {};
            _emit.data.modular = this.mValue.model;
            _emit.data.modularInnerId = this.mValue.modelInnerId;
            _emit.data.attchSuffix = this.mItem.attchSuffix;
            _emit.data.statusObj = {};
            _emit.data.statusObj.itemId = this.mItem.itemId;
         
            this.$emit('emitEvent',_emit); 

           
        },

        filePreview(item){
             
                let _emit = {};
                _emit.action = 'onFilePreviewAction'
                _emit.data = {};
                _emit.data.defFielId = this.mValue.defFielId?this.mValue.defFielId:"";
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = (item.model&&item.model !='')?item.model: this.mValue.model;
                _emit.data.fileType = item.fileType;
                _emit.data.fileName = item.fileName;
            
                this.$emit('emitEvent',_emit);   
        },

         filePreviewTemplate(item){
          
                let _emit = {};
                _emit.action = 'onFilePreviewAction'
                _emit.data = {};
                _emit.data.defFielId = this.mValue.defFielId?this.mValue.defFielId:"";
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = (item.model&&item.model !='')?item.model: this.attchTemplate.model;
                _emit.data.fileType = item.fileType;
                _emit.data.fileName = item.fileName;
                this.$emit('emitEvent',_emit);   
        },

        fileEdit(item){
             if(!this.isEditable) return;
                let _emit = {};
                _emit.action = 'onFileEditAction'
                _emit.data = item;
                _emit.data.modelInnerId = this.mValue.modelInnerId;
                _emit.data.defFielId = this.mValue.defFielId?this.mValue.defFielId:"";
                this.$emit('emitEvent',_emit);  
        },
        
        fileDownload(item){
                let _emit = {};
                _emit.action = 'onFileDownloadAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.fileName = item.fileName;
                _emit.data.model = (item.model && item.model !='')?item.model: this.mValue.model;
                this.$emit('emitEvent',_emit);   
        },
        fileSignature(item,idx){
                if(item.fileType == 'pdf'){
                    let _emit = {};
                    _emit.action = 'onFileSignatureAction'
                    _emit.data = {};
                    _emit.data.fileHeaderId = item.fileHeaderId;
                    _emit.data.fileName = item.fileName;
                    _emit.data.modelInnerId = this.mValue.modelInnerId;
                    _emit.data.model = (item.model && item.model !='')?item.model: this.mValue.model;
                    this.$emit('emitEvent',_emit);   
                }else{
                    this.loadingInstance = Loading.service({ fullscreen: true,text:'正在转化文件,请稍等...'});
                    convert2Pdf(this.formWf.wfId,item.fileHeaderId).then((response)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.loadingInstance.close();
                        });
                        let _fileItem = response.data;
                        _fileItem.id = _fileItem.fileHeaderId;
                        this.$set(this.fileLists,idx,_fileItem);
                        this.fileSignature(_fileItem,idx);
                    }).catch((e)=>{
                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                            this.loadingInstance.close();
                        });
                    })
                }              
        },
        fileDownloadTemplate(item){
                let _emit = {};
                _emit.action = 'onFileDownloadAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.fileName = item.fileName;
                _emit.data.model = (item.model && item.model !='')?item.model: this.attchTemplate.model;
                this.$emit('emitEvent',_emit);   
        },

        fileDelete(item,idx){
            this.$set(this.fileLists[idx],'operateFlag',true);
        },

        fileRecovery(item,idx){
             this.$set(this.fileLists[idx],'operateFlag',false);
        },

        
        fileDownloadAll(item){
                let _fileHeaderIdsArr = [];
                (this.fileLists).forEach((item)=>{
                    _fileHeaderIdsArr.push(item.fileHeaderId);
                })

                let _emit = {};
                _emit.action = 'onFileDownloadAllAction'
                _emit.data = {};
                _emit.data.itemId = this.mItem.itemId;
                _emit.data.fileIds = _fileHeaderIdsArr.join(",");
                _emit.data.expectedName = this.mItem.itemName;
                _emit.data.model = (item.model && item.model !='')?item.model: this.mValue.model;
                this.$emit('emitEvent',_emit);   
        },


         /* 调用全局的上传附件组件更新 向上冒泡*/
        fileReplace(item){
       
           
            let _emit = {};
            _emit.action = 'onFileUploadAction';
            _emit.data = {};
            _emit.data.modular = this.mValue.model;
            _emit.data.modularInnerId = this.mValue.modelInnerId;
            _emit.data.attchSuffix = this.mItem.attchSuffix;
            _emit.data.replaceFileHeaderId = item.fileHeaderId;

            _emit.data.statusObj = {};
            _emit.data.statusObj.itemId = this.mItem.itemId;
            this.$emit('emitEvent',_emit); 
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
                this.emitSFWAttBtnVisibleAction(event.eventSource.val);
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

                if(event.eventSource.val.attachments){
                    if(event.eventSource.val.attachments.length > 0 && event.eventSource.val.attachments[0].model == 'WF_PRINTWRITE_ADD'){

                    }else{
                         this.fileLists = [];
                    }
                    (event.eventSource.val.attachments).forEach((fillElement)=>{
                        fillElement.id = fillElement.fileHeaderId;
                        this.fileLists.push(fillElement);
                    })
                }else{
                     this.fileLists = [];
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

        emitSFWAttBtnVisibleAction(visiable){ //设置上传组件是否可见性
             if(this.mValue.defFielId == 'sfw-attachment'){
                    let _emit = {};
                    _emit.action = 'onSFWAttBtnVisibleAction'
                    _emit.data = {};
                    _emit.data.visiable = visiable;
                    this.$emit('emitEvent',_emit); 
             }
        },

        emitSFWAttEditListAction(){ //设置上传组件是否可见性
             if(this.mValue.defFielId == 'sfw-attachment'){

                    let _emit = {};
                    _emit.action = 'onSFWAttEditListAction'
                    _emit.data = {};
                    _emit.data.modelInnerId = this.mValue.modelInnerId;
                    _emit.data.isEditable = this.isEditable;
                    _emit.data.fileLists = this.fileLists;
                    this.$emit('emitEvent',_emit); 
             }
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
                if(obj.data.replaceFileHeaderId){
                    
                    for(let i = 0;i<this.fileLists.length;i++){
                        if(this.fileLists[i].fileHeaderId == obj.data.replaceFileHeaderId){
                            (obj.data.fileLists).forEach((element)=>{
                                element.fileSize = EcoUtil.getFileSize(element.size);
                                this.$set(this.fileLists,i, element)                               
                            })
                            break;
                        }
                    }

                }else{
                    (obj.data.fileLists).forEach((element)=>{
                        element.fileSize = EcoUtil.getFileSize(element.size);
                        this.fileLists.push(element);
                    })
                }
                this.emitSFWAttEditListAction();
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
          
            if(this.isEditable ){
                if(this.isRequired ){
                    
                    let _fileHeaderIds = [];
                    (this.fileLists).forEach((element)=>{
                        if(element.operateFlag){ //被删除

                        }else{
                            _fileHeaderIds.push(element.fileHeaderId);
                        }
                    })
                   
                    if(_fileHeaderIds.length == 0){
                        return { status:1,msg:this.mItem.itemName+' 必须上传附件',checkType:'ATTACHEMENT',checkId:'handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId:this.mItem.itemId} ;
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
                   document.getElementById('handleItem-'+this.mItem.viewId+'-'+this.mItem.itemId,itemId).scrollIntoView(true);
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
    line-height:20px;
    padding-top:10px;
    padding-bottom:10px;
}

.designItem .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.designItem .downloadAll{
    margin-left:10px;
    line-height: 25px;
    padding-top:5px;
}

.designItem .downloadAll .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.designItem  .fileItem{
    color: #606266;
    margin-left:10px;
    line-height: 20px;
    margin-bottom:5px;
    margin-top:5px;
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
    margin-right:5px;
}
.designItem .fileItem .signature{
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

.designItem .fileItem .imgType{
    width:16px;
    height:16px;
}

.designItem .fileTemplateDiv{
    line-height: 25px;
    background-color: #fafafa;
    margin-top:10px;
}

.designItem .fileTemplateDiv .title{
     color: #606266;
     margin-left:10px;
     line-height: 20px;
}


</style>
