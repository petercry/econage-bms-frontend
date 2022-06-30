<template>
  <div>
    <!-- <el-upload
      class="upload-demo"
      :action="options.url"
      :drag="btnFlag?false:true"
      multiple
      :http-request="httpRequest"
      :limit="999"
      :show-file-list="false"
      :before-upload="beforeUpload"
    >
      <el-button size="mini" type="primary" v-if="btnFlag">上传附件</el-button>
      <div v-else>
         <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </div>
    </el-upload> -->
      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
    <ul class="el-upload-list el-upload-list--text">
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
        <!-- <i class="el-icon-close" @click="handleRemove(item,index)"></i> -->

        <i  class="download-btn" v-if="item.bodyId" @click="fileDownload(item)" >
            <i class="el-icon-download"></i>
        </i>

        <i target="_blank" class="preview-btn" @click="filePreview(item)">
          <i class="el-icon-view"></i>
        </i>

      </li>
    </ul>
    <div id="upload" style="display:none;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import plupload from 'plupload';
import {EcoFile} from '@/components/file/main.js'
//全局设置超时时间 600s
axios.defaults.timeout = 600000;
//定义文件前缀过滤策略
plupload.addFileFilter('file_prefix_filter', function (filePrefixs, file, cb) {
  if (!filePrefixs || filePrefixs.length == 0) {
    cb(true);
    return;
  }

  let fileName = file.name;

  let foundFile = false;
  filePrefixs.forEach(element => {
    if (fileName.indexOf(element) == 0 && !foundFile) {
      foundFile = true;
    }
  });

  if (foundFile) {
    cb(true);
  } else {
    this.trigger('Error', {
      code: plupload.FILE_PREFIX_ERROR,
      message: plupload.translate('File prefix error.'),
      file: file
    });
    cb(false);
  }
});
// import {baseMainServerUrl} from '@/system/config/env'
let webFileUploadChunkUrlBase = '/file-manager/uploader/chunk/save',
  webFileMergeChunksUrlBase = '/file-manager/uploader/chunk/merge',
  webFileClearUploadingChunksUrlBase = '/file-manager/uploader/chunk/clear',
  webFileSingleDownloadUrlBase = '/file-manager/download',
  webFileSinglePreviewUrlBase = '/file-manager/preview',
  webFileListUrlBase = '/file-manager/info/modular',
  webFileSingleRemoveUrlBase = '/file-manager/info';
export default {
  name: 'ecoFileUploadChunk',
  props: {
    modular: {
      type: String,
      default: ''
    },
    modularInnerId: {
      type: String,
      default: ''
    },
    limitPictureFile: {
      type: Boolean,
      default: false
    },

    btnFlag: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      plupload: plupload,
      tokenNameInStore: 'eco-auth-token',
      fileList: [],
      options: {
        browse_button: 'upload',
        runtimes: 'html5,flash',
        chunk_size: '5mb',
        resize: false,
        rename: false,
        dragdrop: true,
        max_retries: 5,
        multiple_queues: true,
        multipart: false,
        max_file_size: '3gb',
        multi_selection: true,
        flash_swf_url: '/resource/component/plupload/core.2.2.1/Moxie.swf',
        //扩展配置信息
        formId: '',
        formInputName: 'fileHeaderId',
        previewOfficeFile: false,
        // baseUrl: "http://192.168.0.59:80",
        baseUrl: '/api',
        triggerWindowResize: false,
        // limitPictureFile: false,

        url: '',
        webFileMergeChunksUrl: '',
        webFileClearUploadingChunksUrl: '',
        webFileSingleDownloadUrl: '',
        webFileSinglePreviewUrl: '',
        webFileSingleRemoveUrl: '',
        webFileListUrl: '',
        headers: {
          'eco-auth-token': ''
        }
      },
      uploader: null,
      attchSuffixMap: {}
    };
  },
  mounted() {
    this._initUploadCore();
    this.initFile();
  },
  created() {
     let _fileType = EcoFile.getUploadFileType();
      (_fileType).forEach((item)=>{
            this.attchSuffixMap[item] = 1;
      })
     this.initBase();
  },
  computed: {},
  methods: {

    fileDownload(item) {
          EcoFile.openFileHeaderByDownload(item.id,item.name);
    },

    filePreview(item) {
          EcoFile.openFileHeaderByView(item.id,item.name);
    },

    initBase() {
      let options = this.options || {};
      if (!this.modular) {
        alert('no modular!');
        return;
      }
      let baseUrl = '',
        modular = this.modular;
      if (window.sysSetting && window.sysSetting.baseUrl) {
          baseUrl = window.sysSetting.baseUrl;
      } else if (window.parent.sysSetting && window.parent.sysSetting.baseUrl) {
          baseUrl = window.parent.sysSetting.baseUrl;
      } else {
          baseUrl = options.baseUrl;
      }

      options['url'] = baseUrl + webFileUploadChunkUrlBase + '/' + modular;
      options['webFileMergeChunksUrl'] =
        baseUrl + webFileMergeChunksUrlBase + '/' + modular;
      options['webFileClearUploadingChunksUrl'] =
        baseUrl + webFileClearUploadingChunksUrlBase + '/' + modular;

      options['webFileSingleDownloadUrl'] =
        baseUrl + webFileSingleDownloadUrlBase;
      options['webFileSinglePreviewUrl'] =
        baseUrl + webFileSinglePreviewUrlBase;
      options['webFileSingleRemoveUrl'] = baseUrl + webFileSingleRemoveUrlBase;
      options['webFileListUrl'] = baseUrl + webFileListUrlBase + '/' + modular;
      options['flash_swf_url'] = baseUrl + options.flash_swf_url;

      if (this.limitPictureFile) {
        if (!options['filters']) {
          options['filters'] = {};
        }
        if (!options['filters'].mime_types) {
          options['filters'].mime_types = [];
        }
        let imageTypeStr = ['jpg', 'jpeg', 'gif', 'png'].join(',');
        options['filters'].mime_types.push({
          title: 'Image files',
          extensions: imageTypeStr
        });
      }
    },
    _initUploadCore() {
      let that = this;
      this.options.headers[this.tokenNameInStore] = this.getAuthToken();
      let uploader = new plupload.Uploader(this.options);
      uploader.bind('Error', function (up, err) {
        let file = err.file,
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
            message += ' (' + err.details + ')';
          }
          if (err.code == plupload.FILE_SIZE_ERROR) {
            alert(that._('Error: File too large:') + ' ' + file.name);
          }
          if (err.code == plupload.FILE_EXTENSION_ERROR) {
            alert(that._('Error: Invalid file extension:') + ' ' + file.name);
          }
          if (err.code == plupload.FILE_PREFIX_ERROR) {
            alert(message);
          }
        }
        if (err.code === plupload.INIT_ERROR) {
          alert(err.message);
        }
      });
      uploader.bind('BeforeChunkUpload', function (
        uploader,
        file,
        postParam,
        currentBlob,
        Offset
      ) {
        //分块传输，添加文件隔离标示
        postParam['fileId'] = file.id;
      });
      uploader.bind('FilesAdded', function (up, files) {
        that.fileList.push(files[0]);
        // //自动开始
        setTimeout(function () {
          up.start();
        }, 1);
      });
      uploader.bind('UploadProgress', function (up, file) {
          that.fileList = that.fileList.map(item => {
            if (item.id == file.id) {
              return file;
            }
            return item;
          });
      });
      //单个文件上传完毕，回填服务器文件信息
      uploader.bind('FileUploaded', function (up, plFile, res) {
        that._mergeChunkRequest(plFile, function (serverFileInfo, fileId) {
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

      beforeUpload(file) {
         let extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
         if (this.attchSuffixMap && this.attchSuffixMap != null) {
             if (this.attchSuffixMap[extension]) {
                 return true;
             } else {
                   this.$message({
                        message: '类型文件 ' + extension + ' 不能上传',
                        type: 'warning',
                        showClose: true,
                        duration: 2000,
                        customClass: 'design-from-el-message'
                    });
             }
         }
         return false;
    },

    httpRequest(ajaxObj) {
      this.uploader.addFile(ajaxObj.file);
    },
    initFile() {
      let that = this;
      if (this.modularInnerId && this.modularInnerId != '') {
        axios.get(this.options.webFileListUrl + '?modularInnerId=' + this.modularInnerId,{
          time: new Date().getTime()
        },{ traditional: true}).then(res => {
          that.fileList = res.data;
        }).catch(e => {});
      }
    },
    _mergeChunkRequest(localFile, callBackFunc) {
      let webFileMergeChunksUrl = this.options.webFileMergeChunksUrl;
      if (this.modularInnerId) {
        webFileMergeChunksUrl = this.options.webFileMergeChunksUrl +
          '?modularInnerId=' + this.modularInnerId;
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
    _deleteFileDataServer(id,callBackFunc) {
        axios.delete(this.options.webFileSingleRemoveUrl + '/' + id,{ traditional: true}).then(res => {
          if (callBackFunc) {
            callBackFunc();
          }
        }).catch(e => {});
    },
    _clearUploadingChunksInServer(localFileId) {
      axios.post(this.options.webFileClearUploadingChunksUrl,qs.stringify({
        fileId: localFileId,
        time: new Date().getTime()
      }),{ traditional: true}).then(res => {}).catch(e => {});
    },
    handleRemove(item,index) {
      let that = this;
      if (item.id.indexOf('o_') < 0) {//上传成功的数据
        that._deleteFileDataServer(item.id,()=>{
          that.fileList.splice(index,1)
        })
      } else {
        that.uploader.stop();
        that.uploader.removeFile(item);
        that.fileList.splice(index,1);
        that.uploader.start();
        that._clearUploadingChunksInServer(item.id)
      }
    },
    getAddFileHeaderIds() {
        let fileHeaderIds = this.fileList.filter(item=>{
            return item.id.indexOf('o_') < 0
        }).map(item=>{
            return item.id
        });
        return fileHeaderIds;
    },
    getAuthToken() {
      let token = sessionStorage.getItem('ecoToken');
      if (!token) {
        token = sessionStorage.getItem('ecoToken');
      }
      return token;
    },
    formatUrlWithAuthToken(url) {
      if (!url) {
        return;
      }
      url +=
        (url.indexOf('?') > 0 ? '&' : '?') +
        this.tokenNameInStore +
        '=' +
        this.getAuthToken();
      return url;
    },
    _isImage(fileType) {
      let imageTypeStr = ['jpg', 'jpeg', 'gif', 'png'].join(',');
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
      let officeFileTypeStr = [
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'pdf'
      ].join(',');
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
    }
  },

  destroyed() {},
  watch: {
    modularInnerId() {
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
