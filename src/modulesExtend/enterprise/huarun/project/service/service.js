import axios from 'axios'
import {baseUrl} from '../config/env'
import {EcoUtil} from '@/components/util/main.js'
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false ;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  EcoUtil.beforeAjaxDoAction();
  if(config.url && config.url.indexOf('/login') == -1){
      config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
  }
  return config;
}, function (error) {
// 对请求错误做些什么
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
    if(err.response && err.response.data){
      err.message = err.message +','+ err.response.data
    }
    if (err.response.status==401){
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      parent.window.sysvm.logout();
    } else if (err.response.status==500){
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
  return Promise.reject(err);
})


export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'admin',
      password:'123456',
      time:new Date().getTime()
  }),{traditional:true});
}


//获取基础数据
export const getEnumSelectEnabled = function(id){
    return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/select-enabled',{
        params:{
            time:new Date().getTime()
        }
    })
}


// 获取uid
export const getItemFetchId = function () {
    return axios.get(baseUrl + '/fetch-uid', {
      params: {
          time: new Date().getTime()
      },
      transformResponse: [function (data) {
          return data;
      }],
    })
}



//获取凭证列表
export const getEvidenceList = function(data){
  return axios.get(baseUrl+'/extend/crp/evidence-temp-rows',{
        params:{
              page:data.page,
              rows:data.rows,
              sort:data.sort,
              order:data.order,
              business:data.business,
              code:data.code,
              name:data.name,
              time:new Date().getTime()
        }
  })
}


//添加凭证
export const addEvidence = function (data) {
        let _saveData = {};
        for(let key in data){
            _saveData[key] = data[key];
        }
        _saveData.ajaxTime = new Date().getTime();
        return axios.post(baseUrl+'/extend/crp/evidence-temp',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}


// 删除
export const delEvidenceAjax = function(id){
    return axios.delete(baseUrl+'/extend/crp/evidence-temp-inValid',{
        params:{
          id:id,
          time:new Date().getTime()
        },
        paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    },{traditional:true})
}


export const getEvidenceSingle = function(id){
  return axios.get(baseUrl+'/extend/crp/evidence-temp-single',{
      params:{
          id:id,
          time:new Date().getTime()
      }
  })
}


//修改凭证
export const updateEvidence = function (data) {
      let _saveData = {};
      for(let key in data){
          _saveData[key] = data[key];
      }
      _saveData.ajaxTime = new Date().getTime();
      return axios.put(baseUrl+'/extend/crp/evidence-temp',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}



export const getRegionVO = function(region,area){
    return axios.get(baseUrl+'/extend/crp/region-vo',{
        params:{
            region:region,
            area:area,
            time:new Date().getTime()
        }
    })
}


export const getRegionList = function(data){
    return axios.get(baseUrl+'/extend/crp/region-rows',{
          params:{
              page:data.page,
              rows:data.rows,
              sort:data.sort,
              order:data.order,
              region:data.region,
              area:data.area,
              time:new Date().getTime()
          }
    })
}


export const addRegion = function (data) {
      let _saveData = {};
      for(let key in data){
          _saveData[key] = data[key];
      }
      _saveData.ajaxTime = new Date().getTime();
      return axios.post(baseUrl+'/extend/crp/region',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}


export const delRegion = function(id){
  return axios.delete(baseUrl+'/extend/crp/region',{
      params:{
        id:id,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
}



export const getRegionSingle = function(id){
    return axios.get(baseUrl+'/extend/crp/region-single',{
          params:{
              id:id,
              time:new Date().getTime()
          }
    })
}


export const updateRegion = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.put(baseUrl+'/extend/crp/region',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}




// 根据id获取文件列表
export const getFileListByModular = function(modular,modularInnerId){
  return axios.get(baseUrl + '/file-manager/info/modular/' + modular,{
      params:{
          modularInnerId:modularInnerId,
          time:new Date().getTime()
      }
  })
}

//获取项目节点模板
export const getModelNodeList = function(data){
  return axios.get(baseUrl+'/extend/crp/model-node-rows',{
        params:{
              page:data.page,
              rows:data.rows,
              sort:data.sort,
              order:data.order,
              business:data.business,
              name:data.name,
              time:new Date().getTime()
        }
  })
}

export const addModelNode = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl+'/extend/crp/model-node',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}



export const delModelNode = function(id){
  return axios.delete(baseUrl+'/extend/crp/model-node-inValid',{
      params:{
        id:id,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
}


export const getModelNodeSingle = function(id){
    return axios.get(baseUrl+'/extend/crp/model-node-single',{
        params:{
            id:id,
            time:new Date().getTime()
        }
    })
}


export const editModelNode = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.put(baseUrl+'/extend/crp/model-node',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}


export const getProList = function(data){
    return axios.get(baseUrl+'/extend/crp/info-rows',{
          params:{
                page:data.page,
                rows:data.rows,
                sort:data.sort,
                order:data.order,
                business:data.business,
                code:data.code,
                name:data.name,
                time:new Date().getTime()
          }
    })
}


export const addPro = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl+'/extend/crp/info',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}


export const delPro = function(id){
  return axios.delete(baseUrl+'/extend/crp/info-inValid',{
      params:{
        id:id,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
}


export const getProSingle = function(id){
    return axios.get(baseUrl+'/extend/crp/info-single',{
          params:{
              id:id,
              time:new Date().getTime()
          }
    })
}


export const updatePro = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.put(baseUrl+'/extend/crp/info',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}
//模板标准节点(列表)
export const getModelStandardRows = function (modelId){
  return axios.get(baseUrl+'/extend/crp/model-standard-rows',{
    params:{
      modelId:modelId,
      time:new Date().getTime()
    }
  })
}
//保存标准节点
export const saveModelStandard = function (form){
  return axios.put(baseUrl+'/extend/crp/model-standard',form,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}
//获取标准节点数据
export const getModelStandardData = function (id){
  return axios.get(baseUrl+'/extend/crp/model-standard-single',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}
//保存标准节点设计图
export const saveModelNode = function (data){
  return axios.post(baseUrl+'/extend/crp/model-node-show',data,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true});
}
//获取标准节点设计图
export const getModelNode = function (modelId){
  return axios.get(baseUrl+'/extend/crp/model-node-show',{
    params:{
      modelId:modelId,
      time:new Date().getTime()
    }
  })
}