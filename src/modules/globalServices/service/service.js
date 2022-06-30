import axios from 'axios'
import {baseUrl} from '../config/env'
import {EcoUtil} from '@/components/util/main.js'
import qs from 'qs';


//全局设置超时时间 120s
axios.defaults.timeout = 120000;
axios.interceptors.request.use(function (config) {
    EcoUtil.beforeAjaxDoAction();
    if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 )){
        config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
    }
     return config;
}, function (error) {
    return Promise.reject(error);
});

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    return response;
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
  }
  return Promise.reject(err);
})


/*获取文件列表*/
export const getFileListByModularInnerId = function(modular,modularInnerId){
    return axios.get(baseUrl + '/file-manager/info/modular/' + modular,{
        params:{
            modularInnerId:modularInnerId,
            time:new Date().getTime()
        }
    })
}

export const mergeFileChunkRequest = function(modular,modularInnerId,fileId,targetFileName,replaceFileHeaderId){
    let _data = {};
    _data.modularInnerId = modularInnerId;
    _data.fileId = fileId;
    _data.targetFileName = targetFileName;
    _data.replaceFileHeaderId = replaceFileHeaderId;
    _data.ajaxTime = new Date().getTime();
    return axios.post(baseUrl+'/file-manager/uploader/chunk/merge/'+modular,qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


export const deleteFileDataServer = function(id){
    let _data = {};
    _data.ajaxTime = new Date().getTime();
    return axios.delete(baseUrl+'/file-manager/info/'+id,qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


export const clearFileUploadingChunksInServer = function(modular,fileId){
  let _data = {};
  _data.fileId = fileId;
  _data.ajaxTime = new Date().getTime();
  return axios.post(baseUrl+'/file-manager/uploader/chunk/clear/'+modular,qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}

export const updateFileHeaderModularInnerIdAjax = function(modularInnerId,fileHeaderIds){
      let _data = {};    
      _data.modularInnerId = modularInnerId;
      _data.fileHeaderId = fileHeaderIds ;
      _data.ajaxTime = new Date().getTime();
      return axios.post(baseUrl+'/file-manager/info/modular/relink',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});

  }

