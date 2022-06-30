<template>
        <div class="ecoFileUploadBtn">
          <div :class="`upload ${styleType}`" v-show="isEdit">
            <el-upload
              ref="my-upload"
              class="upload-demo"
              :action="options.url"
              :multiple="multiple"
              :disabled="isRead"
              :on-change="fileChange"
              :before-upload="beforeFileUpload"
              :http-request="httpRequest"
              :on-success="fileOnSuccess"
              :limit="999"
              style="display:inline-block;"
              :show-file-list="false"
              :accept='accept'
              :file-list='fileList'
            >
              <slot name='uploadBtn'></slot>
           </el-upload>
          </div>
          <ul class="el-upload-list el-upload-list--text" v-if="showList">
            <li class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="item.id" :class='{"mT0":(index==0 && !isEdit)}'>
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
              <i class="el-icon-close" @click="handleRemove(item,index)" v-if='isEdit'></i>
              <a target="_blank" class="download-btn" v-if="item.bodyId" :href="formatUrlWithAuthToken(options.webFileSingleDownloadUrl+'/'+item.id)">
                <i class="el-icon-download"></i>
              </a>
              <a class="preview-btn" @click.prev.stop='preView(item)' v-if="item.bodyId&&options.previewOfficeFile&&_isPreviewFile(item.fileType)" href="javascript:;">
                <i class="el-icon-view"></i>
              </a>
            </li>
            <div v-if='!isEdit && fileList.length==0' class='emptTitle'>暂无附件</div>
          </ul>
            <div id="upload" style="display:none;"></div>
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
        name: "ecoFileUploadBtn",
        props: {
          isEdit:{
            type:Boolean,
            default:false
          },
          accept:{
            type:String,
            default:''
          },
          styleType:{
            type:String,
            default:'tool'
          },
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
          isRead: {
            type: Boolean,
            default: false
          },
          show: {
            type: Boolean,
            default: false
          },
          showList: {
            type: Boolean,
            default: false
          },
          multiple:{
            type: Boolean,
            default: true
          }
        },
        data() {
          return {
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
              previewOfficeFile: true,
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
            uploader: null,
          };
        },
        mounted() {
          this._initUploadCore();
          this.initFile();
        },
        created() {
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
              }).catch(e => {});
            }
          },
          _mergeChunkRequest(localFile, callBackFunc) {
               var that = this;
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
                that.fileOnSuccess(res.data)
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
            this.$emit('fileChange',{},that.fileList);
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
          download(url){
            window.open(url)
          },
          preview(url,fileName){ 
            var _url = window.location.origin + encodeURIComponent(url);
            var checkNick = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
            var _fileName = fileName;
            _fileName = _fileName.replace(checkNick,'');
            _fileName = encodeURIComponent(_fileName);
            let filePreviewUrl = "http://idocv.econage.xyz:6600";
            var fileDocView = filePreviewUrl+"/view/url?url="+_url+"&name="+_fileName+"&idocv_auth=econage";
            window.open(fileDocView)
          },
          preView(item){
            this.$emit('preView',item);
          },
          beforeFileUpload(file){
             let bool;
             this.$emit('beforeFileUpload',file,(data)=>{
                  bool = data;
             })
             return bool;
          },
          fileOnSuccess(response){
              if(!this.showList){
                  this.$refs['my-upload'].clearFiles();
              }
              this.$emit('fileOnSuccess',response);
          },
          fileChange(file, fileList){
             this.$emit('fileChange',file,fileList);
          },
      
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
      .ecoFileUploadBtn .btn{
          background: #FFF;
          border-color: #409EFF;
          color: #409EFF;
          margin-left: 15px;
          padding: 9px 20px;
      }
      .upload.tool {
        position:relative;
        color: #409EFF;
        border: 1px dashed #409EFF;
        text-align: center;
        border-radius: 2px;
    }
    .mT0.el-upload-list__item.is-success{
      margin-top:0px;
    }
    .emptTitle{
      color:#606266;
      font-size:14px;
    }
      </style>
      