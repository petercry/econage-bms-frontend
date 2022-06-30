<template>
  <div>
    <!-- <el-input v-if="!show&&!imgShow"  v-model="name"> -->
      <el-upload
        v-if="!show&&!imgShow"
        ref="upload"
        slot="prepend"
        class="upload-demo"
        :accept="accpet"
        :action="options.url"
        :http-request="httpRequest"
        :limit="999"
        :show-file-list="false"
      >
        <el-button slot="trigger" size="small" >选取图片</el-button>
        <!-- <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">上传到服务器</el-button> -->
      </el-upload>
    <!-- </el-input> -->
    <ul v-if="showList&&!show&&!imgShow" class="el-upload-list el-upload-list--text">
      <li class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="item.id">
        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}
        <span style="font-size:12px;color:#aaa;">
          <span v-if="item.bodyId">({{plupload.formatSize(item.size)}})</span>
          <span v-else>({{item.percent}}%)</span>
        </span>
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check" v-if="item.bodyId"></i>
          <i style="color:red;" class="el-icon-error" v-if="item.isError"></i>
        </label>
        <i class="el-icon-close" @click="handleRemove(item,index)"></i>
        <a target="_blank" class="download-btn" v-if="item.bodyId" :href="formatUrlWithAuthToken(options.webFileSingleDownloadUrl+'/'+item.id)">
          <i class="el-icon-download"></i>
        </a>
        <a target="_blank" class="preview-btn" v-if="item.bodyId&&options.previewOfficeFile&&_isPreviewFile(item.fileType)" :href="formatUrlWithAuthToken(options.webFileSinglePreviewUrl+'/'+item.id)">
          <i class="el-icon-view"></i>
        </a>
      </li>
    </ul>
    <div id="upload" style="display:none;"></div>
    <div v-if="show">
      <div v-for="item in fileList" :key="item.id">
        <div>{{item.name}} 
          <span style="display:inline-block;padding:0 4px;cursor:pointer;color:#0084ff;" @click="download(formatUrlWithAuthToken(options.webFileSingleDownloadUrl+'/'+item.id))">下载</span>
          <span style="display:inline-block;padding:0 4px;cursor:pointer;color:#0084ff;" @click="preview(formatUrlWithAuthToken(options.webFileSingleDownloadUrl+'/'+item.id),item.name)">预览</span>
        </div>
      </div>
    </div>
    <div v-if="imgShow">
      <img v-for="item in fileList" :key="item.id" :src="options.baseUrl+'/file-manager/preview-safe?file-header-Id='+item.id+'&mt-token='+getMtToken()" :alt="item.name">
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import plupload from "plupload";
//全局设置超时时间 600s
axios.defaults.timeout = 600000;
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
// import {baseMainServerUrl} from '@/system/config/env'
let webFileUploadChunkUrlBase = "/file-manager/uploader/chunk/save",
  webFileMergeChunksUrlBase = "/file-manager/uploader/chunk/merge",
  webFileClearUploadingChunksUrlBase = "/file-manager/uploader/chunk/clear",
  webFileSingleDownloadUrlBase = "/file-manager/download",
  webFileSinglePreviewUrlBase = "/file-manager/preview",
  webFileListUrlBase = "/file-manager/info/modular",
  webFileSingleRemoveUrlBase = "/file-manager/info";
export default {
  name: "ecoFileUploadChunk",
  props: {
    modular: {
      type: String,
      default: ""
    },
    modularInnerId: {
      type: String,
      default: ""
    },
    limitPictureFile: {
      type: Boolean,
      default: false
    },
    showList:{
      type: Boolean,
      default: false
    },
    accpet:{
      type: String,
      default: ""
    },
    onSuccess: {
      type: Function,
      default: undefined,
      required: false
    },
    show: {
      type: Boolean,
      default: false
    },
    imgShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      name:'',
      plupload:plupload,
      tokenNameInStore: "eco-auth-token",
      fileList: [],
      options: {
        browse_button: "upload",
        runtimes: "html5,flash",
        chunk_size: "5mb",
        resize: false,
        rename: false,
        dragdrop: true,
        max_retries: 5,
        multiple_queues: true,
        multipart: false,
        max_file_size: "3gb",
        multi_selection: true,
        flash_swf_url: "/resource/component/plupload/core.2.2.1/Moxie.swf",
        //扩展配置信息
        formId: "",
        formInputName: "fileHeaderId",
        previewOfficeFile: false,
        // baseUrl: "http://192.168.0.59:80",
        baseUrl: "/api",
        triggerWindowResize: false,
        // limitPictureFile: false,

        url: "",
        webFileMergeChunksUrl: "",
        webFileClearUploadingChunksUrl: "",
        webFileSingleDownloadUrl: "",
        webFileSinglePreviewUrl: "",
        webFileSingleRemoveUrl: "",
        webFileListUrl: "",
        flash_swf_url: "",
        headers: {
          "eco-auth-token": ""
        }
      },
      uploader: null
    };
  },
  mounted() {
    this._initUploadCore();
    this.initFile();
  },
  created() {
    if(this.imgShow){
      this.getMtToken();
    }
    this.initBase();
  },
  computed: {},
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
      options["webFileMergeChunksUrl"] =
        baseUrl + webFileMergeChunksUrlBase + "/" + modular;
      options["webFileClearUploadingChunksUrl"] =
        baseUrl + webFileClearUploadingChunksUrlBase + "/" + modular;

      options["webFileSingleDownloadUrl"] =
        baseUrl + webFileSingleDownloadUrlBase;
      options["webFileSinglePreviewUrl"] =
        baseUrl + webFileSinglePreviewUrlBase;
      options["webFileSingleRemoveUrl"] = baseUrl + webFileSingleRemoveUrlBase;
      options["webFileListUrl"] = baseUrl + webFileListUrlBase + "/" + modular;
      options["flash_swf_url"] = baseUrl + options.flash_swf_url;

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
          that.name = serverFileInfo.name;
          if (that.fileList.length>1){
            that.handleRemove({id:that.fileList[0].id},0)
          }
          if (that.onSuccess){
            that.onSuccess(serverFileInfo)
          }
        });
      });
      uploader.init();
      this.uploader = uploader;
    },
    httpRequest(ajaxObj) {
      this.uploader.addFile(ajaxObj.file);
    },
    initFile() {
      var that = this;
      if(this.modularInnerId && this.modularInnerId !=''){
        axios.get(this.options.webFileListUrl+"?modularInnerId=" + this.modularInnerId,{
          time: new Date().getTime()
        },{ traditional: true}).then(res => {
          that.fileList = res.data;
          that.name = res.data[res.data.length-1].name;
        }).catch(e => {});
      }
    },
    _mergeChunkRequest(localFile, callBackFunc) {
      let webFileMergeChunksUrl  = this.options.webFileMergeChunksUrl ;
      if (this.modularInnerId) {
        webFileMergeChunksUrl = this.options.webFileMergeChunksUrl +
          "?modularInnerId=" + this.modularInnerId;
      }
      axios.post(webFileMergeChunksUrl,qs.stringify({
        fileId: localFile.id,
        targetFileName: localFile.name,
        time: new Date().getTime()
      }),{ traditional: true}).then(res => {
        if (callBackFunc) {
          callBackFunc(res.data,localFile.id);
        }
      }).catch(e => {});
    },
    //删除服务器文件
    _deleteFileDataServer(id,callBackFunc){
        axios.delete(this.options.webFileSingleRemoveUrl+'/'+id,{ traditional: true}).then(res => {
          if (callBackFunc) {
            callBackFunc();
          }
        }).catch(e => {});
    },
    _clearUploadingChunksInServer(localFileId){
      axios.post(this.options.webFileClearUploadingChunksUrl,qs.stringify({
        fileId: localFileId,
        time: new Date().getTime()
      }),{ traditional: true}).then(res => {}).catch(e => {});
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
    getMtToken(){
      var mtToken = sessionStorage.getItem("mtToken");
      if (!mtToken) {
        mtToken = localStorage.getItem("mtToken");
      }
      if (!mtToken) {
        axios.get("/api/file-manager/download-tmp-token",{
            params:{
                time:new Date().getTime()
            },
            headers:{
                'eco-auth-token':this.getAuthToken(),
            },
        }).then(res => {
          sessionStorage.setItem("mtToken",res.data);
        }).catch(e => {});
      }
      return mtToken;
    },
    formatUrlWithAuthToken(url) {
      if (!url) {
        return;
      }
      url +=
        (url.indexOf("?") > 0 ? "&" : "?") +
        this.tokenNameInStore +
        "=" +
        this.getAuthToken();
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
      var officeFileTypeStr = [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "txt",
        "pdf"
      ].join(",");
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
    // submitUpload(){
    //   this.$refs.upload.submit();
    // }
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
.el-upload-list__item .download-btn{
    display: none;
    position: absolute;
    top: 0px;
    right: 26px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}
.el-upload-list__item:hover .download-btn {
    display: inline-block;
}
.el-upload-list__item .preview-btn{
    display: none;
    position: absolute;
    top: 0px;
    right: 44px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}
.el-upload-list__item:hover .preview-btn {
    display: inline-block;
}
</style>
