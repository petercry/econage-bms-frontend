import axios from 'axios'
import {baseUrl} from '@/modules/bmsTalentPool/config/env'
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
    username:'13588195486',
    password:'Econage123',
    time:new Date().getTime()
  }),{traditional:true});
}
//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return axios.get(baseUrl+'/org/user/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
// 获取级联基础数据
export const getTreeKvListByParentId= function(parentId,action){
  return axios.get(baseUrl+'/basic/tree-kv/group/'+'create-enabled',{
      params:{
          parentId:parentId,
          time:new Date().getTime()
      }
  })
}
export const getCascaderNode= function(parentId){
  return axios.get(baseUrl+'/basic/tree-kv/group/select-enabled',{
      params:{
          parentId:parentId,
          time:new Date().getTime()
      }
  })
}
export const getBaseDataInfo= function(id){
  return axios.get(baseUrl+'/basic/tree-kv/single',{
      params:{
          id:id,
          time:new Date().getTime()
      }
  })
}

// 获取当前用户信息
export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
    params:{
      time:new Date().getTime()
    }
  })
}
// 获取文件列表
export const getFileListByModularInnerId = function(modular,modularInnerId){
  return axios.get(baseUrl + '/file-manager/info/modular/' + modular,{
      params:{
          modularInnerId:modularInnerId,
          time:new Date().getTime()
      }
  })
}
//删除文档
export const deleteFileDataServer = function(id){
  return axios.delete(baseUrl + '/file-manager/info/'+id,{ traditional: true})
}

// 获取基础数据
export const getEnumSelectEnabled = function(id,action = 'select-enabled'){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/'+action,{
    params:{
      time:new Date().getTime()
    }
  })
}
//获取uid
export const getItemFetchId = function(){
  return axios.get(baseUrl+'/fetch-uid',{
    params:{
      time:new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }],
  })
}
//基础数据查询---单个（类型）
export const getKVSingleInfo = function(id){
  return axios.get(baseUrl+'/extend/faw/pm-common/kv-single',{
    params:{
      id
    },
  })
}
//基础数据更新（类型）
export const updateKVSingle = function(data){
  return axios.put(baseUrl+'/extend/faw/pm-common/kv',{
    data:data
  })
}

// 获取人才库列表
export const getTalentList = function(data,pageInfo){
  return axios.get(baseUrl+'/bms/talent-pool/info/list',{
    params:{
      folderId:pageInfo.folderId,
      sort:pageInfo.sort,//字符串，可以是数组，排序列名称
      order:pageInfo.order,//字符串，可以是数组，排序列顺序或者逆序
      page:pageInfo.page,//整数，分页查询第几页
      rows:pageInfo.rows,
      gender:data.gender,
      name:data.name,
      city:data.city,
      province:data.province,
      resumeSource:data.resumeSource,
      experience:data.experience,
      currentState:data.currentState,
      resumeJob:data.resumeJob,
      marriage:data.marriage,
      phone:data.phone,
      resumeJobMatch:data.resumeJobMatch,
      roundDateFrom:data.roundDateFrom,
      roundDateTo:data.roundDateTo,
      followNextDateFrom:data.followNextDateFrom,
      followNextDateTo:data.followNextDateTo,
      hrStatus:data.hrStatus,
      bpStatus:data.bpStatus,
      label:data.labels,
      time:new Date().getTime()
    }
  })
}
// 添加人才信息
export const addTalent= function(data){
  return axios.post(baseUrl+'/bms/talent-pool/info',data,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

// 查询单条人才信息
export const getSingleTalentInfo = function(id){
  return axios.get(baseUrl+'/bms/talent-pool/info/single',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}
// 更新人才信息
export const updateTalent= function(data){
  return axios.put(baseUrl+'/bms/talent-pool/info',data,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

// 更新人才folderId
export const changeTalentFolder = function(taId,changeFolder){
  return axios.patch(baseUrl+'/bms/talent-pool/info/'+taId+"/folder/"+changeFolder,{
    params:{
      time:new Date().getTime()
    }
  })
}

// 删除人才信息
export const deleteTalent = function(id){
  return axios.delete(baseUrl+'/bms/talent-pool/info',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

// 获取跟进动态列表
export const getFollowList = function(infoId){
  return axios.get(baseUrl+'/bms/talent-pool/follow/list-by-info',{
    params:{
      infoId:infoId,
      time:new Date().getTime()
    }
  })
}

// 添加跟进信息
export const addFollow= function(data){
  return axios.post(baseUrl+'/bms/talent-pool/follow',data,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
// 获取单条跟进信息
export const getSingleFollow = function(id){
  return axios.get(baseUrl+'/bms/talent-pool/follow',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}
// 更新跟进信息
export const updateFollow= function(data){
  return axios.put(baseUrl+'/bms/talent-pool/follow',data,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}


// 删除跟进信息
export const deleteFollow = function(id){
  return axios.delete(baseUrl+'/bms/talent-pool/follow',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

// 更新属性类别
export const updateFollowResult= function(data){
  return axios.patch(baseUrl+'/bms/talent-pool/info/follow-update',data,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}

// 获取跟进类型
export const getFollowType= function(id){
  return axios.get(baseUrl+'/bms/talent-pool/follow/type-enum',{
    params:{
      time:new Date().getTime()
    }
  })
}

// 人才信息去重
export const getDuplicate= function(msg){
  return axios.get(baseUrl+'/bms/talent-pool/info/query-by-name-phone',{
    params:{
      name:msg.name,
      phone:msg.phone,
      time:new Date().getTime()
    }
  })
}
// 添加标签
export const getAddTag= function(msg){
  return axios.post(baseUrl+'/bms/talent-pool/info/label',{
    text:msg,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
