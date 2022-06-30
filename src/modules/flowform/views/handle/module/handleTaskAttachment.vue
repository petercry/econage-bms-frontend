<template>
  <div class="handleAttachementVue designItem" style="border-bottom:0px;" v-show="!isHandleOpenDialog">
             <div  class="attachementContent"> 

                    <div class="attachment" @click="goAttachementPage" v-if="isEditable && !mSFW" >
                         <span class="uploadBtn"><i class="icon iconfont iconfujian"></i> 上传附件</span>
                    </div>

                    <div class="fileItem" v-for="(item,idx) in fileLists" :key="item.fileHeaderId">
                        <div >
                                <span class="imgType"> <img style="vertical-align: middle;" :src="typeImgList[item.fileType]?typeImgList[item.fileType]:typeImgList['blank']"/></span>
                                <span>{{item.fileName}}&nbsp;(&nbsp;{{item.fileSize}}&nbsp;)</span>
                                <span class="download" @click="fileDownload(item)">下载</span>|<span class="preview" @click="filePreview(item)">预览</span>
                                <span class="delete" v-show="isEditable && !item.operateFlag" @click="fileDelete(item,idx)">[ 点击删除 ]</span>
                                <span class="recovery" v-show="isEditable && item.operateFlag" @click="fileRecovery(item,idx)">[ 点击恢复 ]</span>
                        </div>

                        <div v-show="false">
                            (&nbsp;<span class="userName">{{item.createUser}}</span>&nbsp;
                                    <span class="userName">{{item.createDate}}</span>
                                )
                        </div>
                    </div>
            
            </div>
  </div>
</template>
<script>

import {EcoUtil} from '@/components/util/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
import { mapState,mapMutations } from 'vuex';

export default{
  name:'handleTaskAttachement',
  components:{
      
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
        mForm:{
            type:Object
        },
        mSFW:{
            type:Boolean,
        }
  },
  data(){
        return {
            model:'TASK_ATTACHMENT',
            modelInnerId:'',
            value:'',
            hiddenValue:'',
            isRequired:false,
            isVisible:true, //是否可见
            isReadonly:false, //是否只读
            isEditable:true, //是否需要上传后台
            fileLists:[],
            errTip:false,
            errMsg:'',

        }
  },
  created(){
       
  },
  mounted(){
          this.model = 'TASK_ATTACHMENT';
          this.modelInnerId = this.mTask.id + '#'+this.mTask.currRound+'#'+this.mTask.apprOrder;
    
  },
  computed:{
    ...mapState(['typeImgList']),
    
    isHandleOpenDialog:function(){
        if(window.flowformSetting && window.flowformSetting.wfDetailHandleType && window.flowformSetting.wfDetailHandleType == 'openDialog'){
            return true;
        }else{
            return false;
        }
    }
  },
  methods: {
        /* 调用全局的上传附件组件 向上冒泡*/
        goAttachementPage(){
            let _emit = {};
            _emit.action = 'onFileUploadAction'
            _emit.data = {};
            _emit.data.modular = this.model;
            _emit.data.modularInnerId = this.modelInnerId;
            _emit.data.statusObj = {};
            _emit.data.statusObj.itemId = this.mItem.itemId;
            this.$emit('emitEvent',_emit); 
        },

        filePreview(item){
                let _emit = {};
                _emit.action = 'onFilePreviewAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = this.model;
                _emit.data.fileType = item.fileType;
                this.$emit('emitEvent',_emit);   
        },

        fileDownload(item){
                let _emit = {};
                _emit.action = 'onFileDownloadAction'
                _emit.data = {};
                _emit.data.fileHeaderId = item.fileHeaderId;
                _emit.data.model = this.model;
                this.$emit('emitEvent',_emit);   
        },

        fileDelete(item,idx){
            this.$set(this.fileLists[idx],'operateFlag',true);
        },

        fileRecovery(item,idx){
             this.$set(this.fileLists[idx],'operateFlag',false);
        },
      

        /*接受事件的回写*/
       callEvent(obj,outputParams){ 
            if(obj.action == 'onFileUploadActionCallBack'){
                (obj.data.fileLists).forEach((element)=>{
                    element.fileSize = EcoUtil.getFileSize(element.size);
                    this.fileLists.push(element);
                })
            }else if(obj.action == 'initTaskAttachment'){
                  this.fileLists = EcoUtil.objDeepCopy(obj.fileLists);
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
                        return { status:1,msg:this.mItem.itemName+' 必须上传附件',checkType:'ATTACHEMENT',checkId:'handleItem'+this.mItem.itemId,itemId:this.mItem.itemId} ;
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
                   document.getElementById('handleItem'+this.mItem.itemId).scrollIntoView(true);
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
.designItem .attachementContent{
    min-height: 40px;
}

.designItem .attachment i{
    font-size: 10px;
}
.designItem .attachment{
    margin-left:0px;
    line-height: 20px;
    padding-top:10px;
}

.designItem .attachment .uploadBtn{
    cursor: pointer;
    color:#409eff;
}

.designItem  .fileItem{
    color: #606266;
    margin-left:20px;
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
    margin-top:-2px;
    width:16px;
    height:16px;
}

</style>
