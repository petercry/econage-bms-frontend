import axios from 'axios'
import {baseUrl} from '../../demo/config/env'
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

/*获取全局配置*/
export const getPublicSettingUnion = function(){
  return axios.get(baseUrl+'/public/setting/union',{
      params:{
          time: new Date().getTime(),
      }
  })
}

export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'10011',
      password:'123456',
      time:new Date().getTime()
  }),{traditional:true});
}

//获取卓越体系树形
export const getExcellenceTree = function(id){
  return axios.get(baseUrl+'/dongfeng/systreemanage/excellentSystem/tree-rows',{
    params:{
      parentId:id,
      time:new Date().getTime()
    }
  })
}

//获取单个详情
export const getExcellenceTable = function(id){
  return axios.get(baseUrl+'dongfeng/systreemanage/excellentSystem/single/select',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

export const delExcellenceTable = function(id){
  return axios.get(baseUrl+'dongfeng/systreemanage/excellentSystem-tree-invalid',{
    params:{
      id:id,
      time:new Date().getTime()
    }
  })
}

// 卓越体系新增
export const addExcellenceTable = function(data){
  return axios.post(baseUrl+'/dongfeng/systreemanage/excellentSystem/single/insert',data,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

// 卓越体系编辑
export const updataExcellenceTable = function(data){
  return axios.post(baseUrl+'/dongfeng/systreemanage/excellentSystem/single/update',data,{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//标准信息发布
//类型数据
export const getTypeData = function(id){
  return axios.get(baseUrl+'/dongfeng/standard-message/type-enum',{
  })
}

//状态数据
export const getStatusData = function(id){
  return axios.get(baseUrl+'/dongfeng/standard-message/status-enum',{
  })
}

//列表数据
export const getStandardList = function(data){
  return axios.get(baseUrl+'/dongfeng/standard-message/query-stand-book',{
    params:{
      ...data,
      time:new Date().getTime()
    }
  })
}

//动态发布
export const sendProcess = function(data){
  return axios.post(baseUrl+'/dongfeng/standard-message/submit-single',{
    ...data,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//获取id
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
//保存草稿
export const draftProcess = function(data){
  return axios.post(baseUrl+'/dongfeng/standard-message/add-single',{
    ...data,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//查询草稿箱列表
export const getDraftList = function(){
  return axios.get(baseUrl+'/dongfeng/standard-message/query-draft',{
    params:{
      time:new Date().getTime()
    },
  })
}

//删除草稿
export const draftDelete = function(id){
  return axios.delete(baseUrl+'/dongfeng/standard-message/delete-batch?id=' + id,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//标注信息审核
export const getExamineList = function(data){
  return axios.get(baseUrl+'/dongfeng/standard-message/query-wait-review',{
    params:{
      ...data,
      time:new Date().getTime()
    },
  })
}

//标准信息审核通过/不通过
export const getExamineIsok = function(data){
  return axios.put(baseUrl+'/dongfeng/standard-message/review?id=' + data.id + '&reviewFlag=' + data.reviewFlag,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//标准信息详情
export const getExamineView = function(id){
  return axios.get(baseUrl+'/dongfeng/standard-message/query-detail',{
    params:{
      id:id,
      time:new Date().getTime()
    },
  })
}

//留言审核
export const getExamineLeavMsg = function(data){
  return axios.get(baseUrl+'/dongfeng/standard-message/leavemessage/query-wait-review',{
    params:{
      ...data,
      time:new Date().getTime()
    },
  })
}

//留言通过/不通过
export const getLeavMsgIsok = function(data){
  return axios.put(baseUrl+'/dongfeng/standard-message/leavemessage/review?id=' + data.id + '&reviewFlag=' + data.reviewFlag,{
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//留言发布
export const sendLeavMsg = function(data){
  return axios.post(baseUrl+'/dongfeng/standard-message/leavemessage/add-single',{
    ...data,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

//留言状态
export const leavStatus = function(){
  return axios.get(baseUrl+'/dongfeng/standard-message/leavemessage/status-enum',{
    params:{
      time:new Date().getTime()
    },
  })
}

//状态分类
export const getGroupList = function(){
  return axios.get(baseUrl+'/basic/kv/group/XXFBLB/detail',{
    params:{
      time:new Date().getTime()
    },
  })
}



