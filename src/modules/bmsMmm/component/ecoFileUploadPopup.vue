<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="options.url"
      drag
      multiple
      :http-request="httpRequest"
      :limit="999"
      :show-file-list="false" 
    >
      <!-- <el-button size="mini" type="primary">{{btnName}}</el-button> -->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <div id="upload" style="display:none;"></div>
  </div>
</template>

<script>
import {baseUrl} from '@/modules/bmsMmm/config/env';
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
  name: "ecoFileUploadPopup",
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
    opFlag:{
      type: String ,
      default: ""
    }
  },
  data() {
    return {
      plupload:plupload,
      tokenNameInStore: "eco-auth-token",
      fileList: [],
      mergeIdx: 0,//合并分片个数，如个数与fileList个数相同，则认为上传动作完毕
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
        //baseUrl:"http://192.168.10.129:8081",
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
  },
  created() {
    this.options.baseUrl = baseUrl;
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
        try{
          that.$parent.$parent.openLoading();
        }catch(e){
          that.$parent.$parent.$parent.$parent.openLoading();
        }
        //自动开始
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
          that.mergeIdx ++;
          //console.log("###########serverFileInfo:" + serverFileInfo.id);
          if(that.mergeIdx == that.fileList.length){ //如分片个数与fileList个数相同，则认为上传动作完毕
            //console.log("$$$$$$$$$$$$$$$$that.$parent.$parent.focusPanelName:"+that.$parent.$parent.focusPanelName);
            //console.log("###" + that.modular + "##" + that.modularInnerId);
            that.$message({type: 'success',message: '上传成功！'});
            that.$parent.$parent.dialogVisible = false;
            if(typeof that.$parent.$parent.focusPanelName!="undefined"){  //客户文档场景
              that.$parent.$parent.focusPanelName = "file";
              that.$parent.$parent.setTabPanel();
            }else{
              try{
                that.$parent.$parent.getTaskFileListFunc();  //添加、编辑任务
              }catch(e){
                //console.log("getRequireFileListFunc");
                try{
                  that.$parent.$parent.getRequireFileListFunc();  //添加、编辑需求
                }catch(e){
                  try{
                    that.$parent.$parent.callBackForUploadProjectFile(that.opFlag , serverFileInfo.id);   //上传项目相关文档（合同、验收单等）
                  }catch(e){
                    that.$parent.$parent.callBackForUploadFile();
                  }
                }
              }
            }
            try{
              that.$parent.$parent.closeLoading();
            }catch(e){
              that.$parent.$parent.$parent.$parent.closeLoading();
            }
          }
        });
      });
      uploader.init();
      this.uploader = uploader;
    },
    openTransLoading(){
      this.$parent.$parent.openLoading();
    },
    httpRequest(ajaxObj) {
      this.uploader.addFile(ajaxObj.file);
    },
    async _mergeChunkRequest(localFile, callBackFunc) {
      let webFileMergeChunksUrl  = this.options.webFileMergeChunksUrl ;
      //console.log("modularInnerId:"+this.modularInnerId);
      if (this.modularInnerId) {
        webFileMergeChunksUrl = this.options.webFileMergeChunksUrl +
          "?modularInnerId=" + this.modularInnerId;
      }
      await axios.post(webFileMergeChunksUrl,qs.stringify({
        fileId: localFile.id,
        targetFileName: localFile.name,
        time: new Date().getTime()
      }),{ traditional: true}).then(res => {
        if (callBackFunc) {
          callBackFunc(res.data,localFile.id);
        }
      }).catch(e => {console.log("error:"+e);});
    },
    getAuthToken() {
      var token = sessionStorage.getItem("ecoToken");
      return token;
    }
  },
  destroyed() {},
  watch: {
  }
};
</script>

<style >

</style>
