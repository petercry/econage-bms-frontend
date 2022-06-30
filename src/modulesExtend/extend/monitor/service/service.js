import axios from 'axios'
import {baseUrl} from '../../monitor/config/env'
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
      try {
      parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      parent.window.sysvm.logout();
      } catch (error) { }
      document.documentElement.className = 'hideVis';
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
      username:'18806723365',
      password:'1234abcd',
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
//获取SQL执行效率分析报表
export const getSQLtableListAjax= function(data){
  return axios.get(baseUrl+'/maintain/db/paged',{
    params:{
      page:data.page, //当前页码
      rows:data.rows, //每页显示数量
      sort:'executeCount', //排序字段
      order: 'desc', //排序规则
      timeUnit: data.timeUnit, //时间规则
      ifSlow: data.ifSlow, //是否仅显示慢SQL
      sql: data.sql, //sql语句
      mapper: data.mapper, //调用方法
      startDate: data.date[0], // 开始日期
      endDate: data.date[1], //结束日期
    }
  })
}
//获取外部接口效率分析报表
export const getEfficiencytableListAjax= function(data){
  return axios.get(baseUrl+'/maintain/web-service/statistic/paged',{
    params:{
      page:data.page, //当前页码
      rows:data.rows, //每页显示数量
      sort:'executeCount', //排序字段
      order: 'desc', //排序规则
      timeUnit: data.timeUnit, //时间规则
      ifSlow: data.ifSlow, //是否仅显示慢SQL
      url: data.url, //接口url
      method: data.method, //调用方法
      startDate: data.date[0], // 开始日期
      endDate: data.date[1], //结束日期
    }
  })
}
//外部接口请求分析报表
export const getJournalListAjax= function(data){
  return axios.get(baseUrl+'/maintain/web-service/detail/paged',{
    params:{
      page:data.page, //当前页码
      rows:data.rows, //每页显示数量
      sort:'createDate', //排序字段
      order: 'desc', //排序规则
      timeUnit: data.timeUnit, //时间规则
      startDate: data.date[0], // 开始日期
      endDate: data.date[1], //结束日期
      appId: data.appId, //请求人
      ifError: data.ifError, //仅显示有错误信息的记录
      url: data.url, //接口url
      method: data.method, //调用方法
      requestBody: data.requestBody, //请求体内容
      responseBody: data.responseBody, //应答体内容
      errorMsg: data.errorMsg, // 错误信息
    }
  })
}
// 重置缓存
export const resetCacheAjax = function(){
  return axios.post(baseUrl+'/basic/cache-reset')
}

// 获取时间类型选项
export const getTimeDateAjax = function(){
  return axios.get(baseUrl+'/maintain/cons/time-unit')
}
