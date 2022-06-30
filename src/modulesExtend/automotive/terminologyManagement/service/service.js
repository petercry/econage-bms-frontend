import axios from 'axios'
import {baseUrl} from '../../terminologyManagement/config/env'
import {EcoUtil} from '@/components/util/main.js'
import { Message } from 'element-ui'
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
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      if(parent.window.sysvm){
        parent.window.sysvm.logout();
      }
    } else if (err.response.status==500){
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      Message.error({
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

//获取树形示例 枚举字段
export const getTreeEnumMap = function(){
  return axios.get(baseUrl+'/demo/tree/enum-map',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取树形示例 列表 按父节点查找
export const getTreeList = function(id){
  return axios.get(baseUrl+'/demo/tree/'+id+'/sub',{
    params:{
      time:new Date().getTime()
    }
  })
}

//获取树形示例 文件
export const getTreeFileList = function(id){
  return axios.get(baseUrl+'/web/file-manager/info/modular/treeDemo',{
    params:{
      modularInnerId:id,
      time:new Date().getTime()
    }
  })
}
//树形示例-添加
export const treeAddAjax = function(data){
  return axios.post(baseUrl+'/demo/tree',{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//树形示例-编辑
export const treeEditAjax = function(data,id){
  return axios.put(baseUrl+'/demo/tree/'+id,{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-列表
export const getTableList = function(data){
  return axios.get(baseUrl+'/demo/common/pagination',{
    params:{
      sort:data.sort,//字符串，可以是数组，排序列名称
      order:data.order,//字符串，可以是数组，排序列顺序或者逆序
      page:data.page,//整数，分页查询第几页
      rows:data.rows,//整数，分页行数
      time:new Date().getTime()
    }
  })
}
//通用示例-详情
export const getTableItem = function(id){
  return axios.get(baseUrl+'/demo/common/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//通用示例-添加
export const tableAddAjax = function(data){
  return axios.post(baseUrl+'/demo/common',{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    demoItems:data.demoItems,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-修改
export const tableEditAjax = function(id,data){
  return axios.put(baseUrl+'/demo/common/'+id,{
    date:data.date,
    dateTime:data.dateTime,
    deptId:data.deptId,
    enumData:data.enumData,
    fileHeaderId:data.fileHeaderId,
    i18nKey:data.i18nKey,
    number:data.number,
    parentId:data.parentId,
    str:data.str,
    userId:data.userId,
    userOrgId:data.userOrgId,
    demoItems:data.demoItems,
    time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}
//通用示例-删除
export const tableDeleteAjax= function(id){
  return axios.delete(baseUrl+'/demo/common/'+id,{traditional:true})
}

//获取基础数据
export const getEnumSelectEnabled = function(id,action=''){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/'+action,{
    params:{
      time:new Date().getTime()
    }
  })
}
export const  termManageAdd= function(data){
  return axios.get(baseUrl+'/dongfeng/term-manage/init-term-manage-wf',{
    time:new Date().getTime(),
    ...data
  },{
    headers: {'Content-Type':'application/json;charset=UTF-8'},
    // traditional:true
  })
}
//术语管理列表
export const termGetList=function(data){
  return axios.get(baseUrl+'/dongfeng/term-manage/pagination',{
    params:{
      time:new Date().getTime(),
      ...data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//术语管理 查看某个
export const termSelectById=function(id){
  return axios.get(baseUrl+'/dongfeng/term-manage/select-by-id',{
    params:{
      time:new Date().getTime(),
      id
    }
  })
}
//作废
export const termInvalid=function(id){
  return axios.get(baseUrl+'/dongfeng/term-manage/disable-term-manage-wf',{
    params:{
      time:new Date().getTime(),
      id
    }
  })
}
export const termUpdate=function(id){
  return axios.get(baseUrl+'/dongfeng/term-manage/update-term-manage-wf',{
    params:{
      time:new Date().getTime(),
      id
    }
  })
}
export const getWFOperateId = function(task_id){
  let _data = {};
  _data.task_id = task_id;
  _data.time = new Date().getTime();
  return axios.post(baseUrl+'/bpm/v95/process/process',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}
//获取权限按钮配置项
export const getRoleBtnSetting = function(refs){
  return axios.get(baseUrl+'/org/user/personal/role/is-exists-one-by-one',{
    params:{
        'ref':refs,
        time:new Date().getTime()
      },

      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  })
}
// 术语导出
export const termDownloadExcel = function(data){
  return axios.get(baseUrl+'/dongfeng/term-manage/download/excel',{
      params:{
            ...data,
            time: new Date().getTime(),
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
      responseType:'blob',
    }
  )
} 
//专业领域树
export const domainCategoryTree = function(){
  return axios.get(baseUrl + '/dongfeng/term-manage/tree/domain-category-tree', {
    params: {
      time: new Date().getTime(),
    }
  })
}

