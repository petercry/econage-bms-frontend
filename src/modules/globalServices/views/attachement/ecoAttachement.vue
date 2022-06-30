<template>
  <div class="ecoAttachement">
        <el-upload
            v-show="!show"
            class="upload-demo"
            :action="options.url"
            multiple
            :http-request="httpRequest"
            :limit="999"
            :show-file-list="false"
            :accept="getAccept"
            :before-upload="beforeUpload"
        >
            <el-button size="mini" type="primary">{{btnName}}</el-button>
            <span class="note">可上传文件类型：{{attchSuffixList.join('  ')}}</span>
        </el-upload>
     
        <ul v-if="!show" class="el-upload-list el-upload-list--text">
            <li class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="item.id">
                <a class="el-upload-list__item-name">
                    <i class="el-icon-document"></i>
                    <span>{{item.name}}</span>
                   
                </a>

                <label class="el-upload-info">
                     <span style="font-size:12px;color:#aaa;">
                        <span v-if="item.bodyId">({{plupload.formatSize(item.size)}})</span>
                        <span v-else>({{item.percent}}%)</span>
                    </span>
                </label>

                <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check" v-if="item.bodyId"></i>
                    <i style="color:red;" class="el-icon-error" v-if="item.isError"></i>
                </label>

                <i class="el-icon-close" @click="handleRemove(item,index)"></i>
                
            </li>
        </ul>
        <div id="upload" style="display:none;"></div>

        <div class="ecoAttachementBtn">
            <el-button round @click="cancelFunc">取消</el-button>
            <el-button type="primary" round @click="submitFunc">确定</el-button>
        </div>

  </div>
</template>

<script>
import {getFileListByModularInnerId,mergeFileChunkRequest,deleteFileDataServer,clearFileUploadingChunksInServer,updateFileHeaderModularInnerIdAjax} from '../../service/service.js'
import {Loading} from 'element-ui';
import {EcoUtil} from '@/components/util/main.js'
import {sysEnv} from '../../config/env'
import plupload from "plupload";
import {EcoFile} from '@/components/file/main.js'
import {EcoMessageBox} from '@/components/messageBox/main.js'
//定义文件前缀过滤策略
plupload.addFileFilter("file_prefix_filter", function(filePrefixs, file, cb) {
    if (!filePrefixs || filePrefixs.length == 0) {
        cb(true);
        return;
    }

    var fileName = file.name;
    var foundFile = false;
    $.each(filePrefixs, function(idx, filePrefix) {
        if (fileName.indexOf(filePrefix) == 0 && !foundFile) {
        foundFile = true;
        }
    });

    if (foundFile) {
        cb(true);
    } else {
        this.trigger("Error", {
        code: plupload.FILE_PREFIX_ERROR,
        message: plupload.translate("File prefix error."),
        file: file
        });
        cb(false);
    }
});

let webFileUploadChunkUrlBase = "/file-manager/uploader/chunk/save";

export default {
  name: "ecoAttachment",

  props: {
 
  },
  data() {
    return {
        modular:null,
        modularInnerId:null,
        proxyModualInnerId:null, //代理的modularInner 如果非空，在确认的时候，会把modularInnerId 更新到后台
        replaceFileHeaderId:null,

        limitPictureFile:false,
        show:false,
        btnName:'上传附件',
        attachObj:{},
        plupload:plupload,
        tokenNameInStore: "eco-auth-token",
        fileList: [],
        options: {
                browse_button: "upload",
                runtimes: "html5,flash",
                chunk_size: "2mb",
                resize: false,
                rename: false,
                dragdrop: true,
                max_retries: 5,
                multiple_queues: true,
                multipart: false,
                max_file_size: "3gb",
                multi_selection: true,
                //扩展配置信息
                formId: "",
                formInputName: "fileHeaderId",
                previewOfficeFile: false,
                baseUrl: "/api",
                triggerWindowResize: false,
                // limitPictureFile: false,
                url: "",
                webFileListUrl: "",
                headers: {
                    "eco-auth-token": ""
                }
        },
        uploader: null,
        attchSuffix:null,
        attchSuffixList:[],
        attchSuffixMap:{},
        
    };
  },
  mounted() {
        this._initUploadCore();
        this.initFile();
  },
  created() {
        let key  = this.$route.params.key;
        if(sysEnv == 1){
            this.attachObj= EcoUtil.objDeepCopy(EcoUtil.getSysvm().getTempStore(key));
            EcoUtil.getSysvm().deleteTempStore(key);
        }
      
        this.modular =  this.attachObj.modular?this.attachObj.modular:'DEFAULT_MODULAR';
        this.proxyModualInnerId = this.attachObj.modularInnerId?this.attachObj.modularInnerId:null;
        this.limitPictureFile = this.attachObj.limitPictureFile?this.attachObj.limitPictureFile:false;
        this.btnName =  this.attachObj.btnName?this.attachObj.btnName:((this.limitPictureFile)?'上传图片':'上传附件');

        this.replaceFileHeaderId = this.attachObj.replaceFileHeaderId?this.attachObj.replaceFileHeaderId:null;
        this.attchSuffix = this.attachObj.attchSuffix?this.attachObj.attchSuffix:null;
        if(this.attchSuffix && this.attchSuffix!=null){
            try{
                let _arr =  this.attchSuffix.split(",");
                (_arr).forEach((item)=>{
                    this.attchSuffixMap[item] = 1;
                })
                this.attchSuffixList = _arr;
            }catch(e){}
        }else{
            let _fileType =  EcoFile.getUploadFileType();
            (_fileType).forEach((item)=>{
                 this.attchSuffixMap[item] = 1;
            })
            this.attchSuffixList =  _fileType;
        }

        this.initBase();
  },
  computed: {
      getAccept(){
          if(this.limitPictureFile){
              return 'image/png,image/jpeg,image/bmp,image/tif';
          }else{
              return '*.*';
          }
      }
  },
  methods: {
    initBase() {
        let options = this.options || {};
        if (!this.modular) {
                alert("no modular!");
                return;
        }
        var baseUrl = options.baseUrl,
            modular = this.modular;

        options["url"] = baseUrl + webFileUploadChunkUrlBase + "/" + modular;
        if (this.limitPictureFile) {
            if (!options["filters"]) {
                options["filters"] = {};
            }
            if (!options["filters"].mime_types) {
                options["filters"].mime_types = [];
            }
            var imageTypeStr = ["jpg", "jpeg", "gif", "png"].join(",");
            options["filters"].mime_types.push({
            title: "Image files",
            extensions: imageTypeStr
            });
        }
    },

    _initUploadCore() {
        var that = this;
        this.options.headers[this.tokenNameInStore] = this.getAuthToken();
        var uploader = new plupload.Uploader(this.options);
        uploader.bind("Error", function(up, err) {
            var file = err.file,
            message;
            that.fileList = that.fileList.map(item => {
            if (item.id == file.id) {
                item.isError = true
            }
            return item;
            });
            if (file) {
            message = err.message;
            if (err.details) {
                message += " (" + err.details + ")";
            }
            if (err.code == plupload.FILE_SIZE_ERROR) {
                alert(that._("Error: File too large:") + " " + file.name);
            }
            if (err.code == plupload.FILE_EXTENSION_ERROR) {
                alert(that._("Error: Invalid file extension:") + " " + file.name);
            }
            if (err.code == plupload.FILE_PREFIX_ERROR) {
                alert(message);
            }
            }
            if (err.code === plupload.INIT_ERROR) {
            alert(err.message);
            }
        });
        uploader.bind("BeforeChunkUpload", function(
            uploader,
            file,
            postParam,
            currentBlob,
            Offset
        ) {
            //分块传输，添加文件隔离标示
            postParam["fileId"] = file.id;
        });
        uploader.bind("FilesAdded", function(up, files) {
            that.fileList.push(files[0]);
            // //自动开始
            setTimeout(function() {
            up.start();
            }, 1);
        });
        uploader.bind("UploadProgress", function(up, file) {
            that.fileList = that.fileList.map(item => {
                if (item.id == file.id) {
                return file;
                }
                return item;
            });
        });
        //单个文件上传完毕，回填服务器文件信息
        uploader.bind("FileUploaded", function(up, plFile, res) {
            that._mergeChunkRequest(plFile, function(serverFileInfo, fileId) {
            that.fileList = that.fileList.map(item => {
                if (item.id == fileId) {
                return serverFileInfo;
                }
                return item;
            });
            });
        });
        uploader.init();
        this.uploader = uploader;
    },

    beforeUpload(file){
         let extension = file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
         if(this.attchSuffixMap && this.attchSuffixMap!=null){
             if(this.attchSuffixMap[extension]){
                 return true;
             }else{
                   this.$message({
                        message: '类型文件 '+extension+' 不能上传',
                        type: 'warning',
                        showClose: true,
                        duration:2000,
                        customClass:'design-from-el-message'
                    }); 
             }
         }
         return false;
    },

    httpRequest(ajaxObj) {
      this.uploader.addFile(ajaxObj.file);
    },

    initFile() {
        var that = this;  
        if(this.modularInnerId && this.modularInnerId !=''){
            getFileListByModularInnerId(this.modular,this.modularInnerId).then((res)=>{
                    this.fileList = res.data;
            })
        }
    },

    //合并服务器文件
    _mergeChunkRequest(localFile, callBackFunc) {
        mergeFileChunkRequest(this.modular,this.replaceFileHeaderId?this.proxyModualInnerId:this.proxyModualInnerId,localFile.id,localFile.name,this.replaceFileHeaderId).then((res)=>{
            if (callBackFunc) {
                callBackFunc(res.data,localFile.id);
            }
        })
    },

    //删除服务器文件
    _deleteFileDataServer(id,callBackFunc){
        deleteFileDataServer(id).then((res)=>{
            if (callBackFunc) {
                 callBackFunc();
            }
        });
    },


    _clearUploadingChunksInServer(localFileId){
        clearFileUploadingChunksInServer(this.modular,localFileId).then((res)=>{

        })
    },


    handleRemove(item,index) {
        let that = this;
        if (item.id.indexOf('o_')<0){//上传成功的数据
            that._deleteFileDataServer(item.id,()=>{
                that.fileList.splice(index,1)
            })
        }else{
            that.uploader.stop();
            that.uploader.removeFile(item);
            that.fileList.splice(index,1);
            that.uploader.start();
            that._clearUploadingChunksInServer(item.id)
        }
    },

    getAddFileHeaderIds(){
            let fileHeaderIds = this.fileList.filter(item=>{
                return item.id.indexOf('o_')<0
            }).map(item=>{
                return item.id
            });
            return fileHeaderIds;
    },

    getAuthToken() {
        var token = sessionStorage.getItem("ecoToken");
        if (!token) {
            token = localStorage.getItem("ecoToken");
        }
        return token;
    },

    formatUrlWithAuthToken(url) {
        if (!url) {
            return;
        }
        url +=(url.indexOf("?") > 0 ? "&" : "?") +this.tokenNameInStore +"=" + this.getAuthToken();
        return url;
    },

    _isImage(fileType) {
        var imageTypeStr = ["jpg", "jpeg", "gif", "png"].join(",");
        if (fileType) {
            fileType = fileType.toLowerCase();
            if (imageTypeStr.indexOf(fileType) >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
                return false;
        }
    },

    _isPreviewFile(fileType) {
      var officeFileTypeStr = [ "doc", "docx","xls", "xlsx", "ppt", "pptx", "txt", "pdf"].join(",");
      if (fileType) {
            fileType = fileType.toLowerCase();
            if (officeFileTypeStr.indexOf(fileType) >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
         }
    },

    _(str) {
        return plupload.translate(str) || str;
    },
    
 


    cancelFunc(){
         EcoUtil.getSysvm().closeDialog();
    },

    submitFunc(){
            
            for(let i = 0;i<this.fileList.length;i++){
                if(this.fileList[i].percent  && this.fileList[i].percen != 100){
                    EcoMessageBox.alert('附件：'+this.fileList[i].name +' 还在上传中','提示');
                    return;
                }
            }
          
        

            let fileHeaderIds = this.getAddFileHeaderIds();
            if( (this.replaceFileHeaderId  == null) &&  fileHeaderIds && fileHeaderIds.length > 0 && this.proxyModualInnerId && this.proxyModualInnerId!=''){
                let loadingInstance = Loading.service({ fullscreen: true,text:"正在上传数据...."});
                updateFileHeaderModularInnerIdAjax(this.proxyModualInnerId,fileHeaderIds).then((res)=>{
                    this.$nextTick(() => { 
                        loadingInstance.close();
                    })
                    this.submitFuncCallback();
                }).catch((e)=>{
                    this.$nextTick(() => { 
                        loadingInstance.close();
                    })
                })
            }else{
                    this.submitFuncCallback();
            }
     },

     submitFuncCallback(){
         
            let _fileList = [];
            this.fileList.forEach((element)=>{
                let _oneFile = EcoUtil.objDeepCopy(element);
                _oneFile.fileHeaderId = _oneFile.id;
                _oneFile.fileName = _oneFile.name;
                _oneFile.fileSize = EcoUtil.getFileSize(_oneFile.size);
                _fileList.push(_oneFile);
            })

            let doObj = {}
            doObj.action = 'onFileUploadActionCallBack';
            doObj.data = {};
            doObj.data.fileLists = _fileList;
            doObj.data.statusObj = this.attachObj.statusObj;
            doObj.data.replaceFileHeaderId = this.replaceFileHeaderId;
            doObj.close = true;
            EcoUtil.getSysvm().callBackDialogFunc(doObj);
     }

     

  },

  destroyed() {},
  watch: {
    modularInnerId(v, ov) {
      this.initFile();
    }
  }
};
</script>

<style scoped>
.ecoAttachement{
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin:0px 0px;
}

.ecoAttachement .el-upload-list__item .download-btn{
    display: none;
    position: absolute;
    top: 0px;
    right: 26px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}

.ecoAttachement .el-upload-list__item:hover .download-btn {
    display: inline-block;
}

.ecoAttachement .el-upload-list__item .preview-btn{
    display: none;
    position: absolute;
    top: 0px;
    right: 44px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}
.ecoAttachement .el-upload-list__item:hover .preview-btn {
    display: inline-block;
}

.ecoAttachement .ecoAttachementBtn{
    position: absolute;
    bottom:0px;
    height:50px;
    left:0;
    right:0;
    text-align: right;
    vertical-align: middle;
    line-height: 50px;
    margin-right:10px;
}

.ecoAttachement .note{
    font-size: 12px;
    color:#666;
}

.ecoAttachement .el-upload-info{
    position: absolute;
    right: 30px;
    top: 0;
    line-height: inherit;
}

.ecoAttachement .el-upload-list__item-name{
    margin-right:80px;
}

.ecoAttachement .el-upload-list__item .el-icon-close{
    top:12px;
}
</style>
