import axios from 'axios'
import {baseUrl} from '../config/env'
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
      Message({
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
      // username:'10056',
      // password:'123456',
      time:new Date().getTime()
  }),{traditional:true});
}
//获取基础数据
export const getEnumSelectEnabled = function(id,action=''){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/'+action,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return axios.get(baseUrl+'/org/user/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function(orgIdArray){
  return axios.post(baseUrl+'/org/tree-select/member-text-show',orgIdArray,{
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
      traditional:true
    })
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
//在产车型统计列表
export const  productioncarVehicleList= function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vehicleStatistic/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//公告车型列表
// export const  vehicleAnnounceCarList= function (data) {
//   return axios.get(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar/list', {
//     params: {
//       time: new Date().getTime(),
//       ...data
//     },
//     paramsSerializer: function (params) {
//       return qs.stringify(params, { arrayFormat: 'repeat' })
//     }
//   })
// }
export const vehicleAnnounceCarList = function (data,pageType) {
  let url;
  if(pageType==='organizationList'){
    //编制列表
    url = '/dongfeng/productioncar/announcement-model/list/select/planning'
  }else if(pageType==='approveList'){
    //审批列表
    url = '/dongfeng/productioncar/announcement-model/list/select/approving'
  }else if(pageType==='finishList'){
    //完成列表
    url = '/dongfeng/productioncar/announcement-model/list/select/finish'
  }
  return axios.get(baseUrl + url, {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}


//通过id删除
export const  productioncarVehicleDel= function (id) {
  return axios.delete(baseUrl + '/dongfeng/productioncar/vehicleStatistic', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}

//公告车型通过id删除
export const vehicleAnnounceCarDel = function (id) {
  return axios.delete(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}

//新增统计表
export const productioncarVehicleAdd  = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/vehicleStatistic?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//新增车型公告
export const  vehicleAnnounceCarAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//获取详情
export const productioncarVehicleDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vehicleStatistic', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//车型公告查看详情
export const vehicleAnnounceCarDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}

//更新
export const  productioncarVehicleUpload = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/vehicleStatistic', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//车型详情界面 基本信息  修改
export const  vehicleAnnounceCarUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar', {
    ...data,
    time: new Date().getTime()
  },{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}
//导出
export const  productioncarVehicleExport = function(data){
  return axios.get(baseUrl+'/dongfeng/productioncar/vehicleStatistic/dfvs/excel-export',{
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
//导入
export const productioncarVehicleImport = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/vehicleStatistic/dfvs/import-excel',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}
//公告车型编制导出
export const  vehicleAnnounceCarDfvaExport= function(data){
  // /dongfeng/productioncar/vehicleAnnounceCar/dfva/excel-export
  return axios.get(baseUrl+'/dongfeng/productioncar/announcement-model/download/excel',{
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
//公告车型编制导入
export const vehicleAnnounceCarDfvaImport = function (data) {
  // /dongfeng/productioncar/vehicleAnnounceCar/dfva/import-excel
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/upload/excel',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}
//车型认证导出
export const pvACarRDfvpExport = function(data,fromPage){
  // /dongfeng/productioncar/pvACarR/dfvp/excel-export
  let url;
  if(fromPage==='finishList'){
     url = '/dongfeng/productioncar/model-coc-regulate/temp/download/excel';
  }else{
     url = '/dongfeng/productioncar/model-coc-regulate/download/excel';
  }
  return axios.get(baseUrl+url,{
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
//车型认证导入
export const pvACarRImport = function (data,fromPage) {
  // /dongfeng/productioncar/pvACarR/dfvp/import-excel
  let url;
  if(fromPage==='finishList'){
     url = '/dongfeng/productioncar/model-coc-regulate/temp/upload/excel';
  }else{
     url = '/dongfeng/productioncar/model-coc-regulate/upload/excel'
  }
  return axios.post(baseUrl + url,data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}

//车型认证符合性列表
export const  pvACarRList= function (data,fromPage,isEdit) {
  // /dongfeng/productioncar/pvACarR/list
  let url;
  if(fromPage==='finishList' && isEdit){
    url = '/dongfeng/productioncar/model-coc-regulate/temp/list/select';
  }else{
    url = '/dongfeng/productioncar/model-coc-regulate/list/select';
  }
  return axios.get(baseUrl + url, {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//车型认证删除
export const  pvACarRDelte= function (id) {
  return axios.delete(baseUrl + '/dongfeng/productioncar/pvACarR', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//车型认证批量删除
export const  modelCocRegulateDelete= function(ids,fromPage){
  let url;
  if(fromPage==='finishList'){
    url= '/dongfeng/productioncar/model-coc-regulate/temp/batch/delete';
  }else{
    url = '/dongfeng/productioncar/model-coc-regulate/batch/delete';
  }
  return axios.post(baseUrl+url,qs.stringify({
    ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

//发布
export const  pvACarRUpdateStatus = function (id) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/pvACarR/updateStatus?id='+id, {
    time: new Date().getTime()
  },{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}
//车型认证符合详情
export const pvACarRQueryOne = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/pvACarR/queryOne', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//车型符合性管控 更新
export const  pvACarRUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/pvACarR', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//初始化
export const  pvACarRInit = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/pvACarR', {
    params: {
      id,
      time: new Date().getTime()
    }
  })
}
//历史记录
export const historyList = function(data){
  return axios.get(baseUrl+'/dongfeng/productioncar/pvACarR/history/list',{
    params:{
        ...data,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
  })
}

//整改应对管理列表
export const  productioncarVcmList= function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vcm', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//整改应对删除
export const  productioncarVcmDel= function (id) {
  return axios.delete(baseUrl + '/dongfeng/productioncar/vcm', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//整改应对新增
export const  productioncarVcmAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/vcm?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//整改应对管理 枚举
export const productioncarVcmenum= function(){
  return axios.get(baseUrl+'/dongfeng/productioncar/vcm/type-enum',{
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
//整改详情
export const productioncarVcmDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vcm/queryOne', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//整改更新
export const  productioncarVcmUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/vcm', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//点检状态字典表
export const spotStandrTypeEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/spotStandr/type-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}
//点检列表
export const productioncarSpotStandrList= function (data) {
  // /dongfeng/productioncar/spotStandr
  return axios.get(baseUrl + '/dongfeng/productioncar/check/checklist/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//点检列表删除
export const productioncarSpotStandrDel = function (id) {
  return axios.delete(baseUrl + '/dongfeng/productioncar/spotStandr', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//任务生成列表
export const spotInRegulationList = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/spotInRegulation', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//生成页面 字典表
export const spotInRegulationTypeEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/spotInRegulation/type-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}
//生成
export const spotInRegulationAdded = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/spotInRegulation/added', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}


//查询完成列表
export const structurebaseFinishList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/structurebase/search/finish-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//获取自定义列表
export const regulationtrackStatusSet = function () {
  return axios.get(baseUrl + '/dongfeng/thinktank/structurebase/trivial/status-set', {
    params: {
      time: new Date().getTime()
    }
  })
}

//保存生成列表
export const spotInRegulationSave  = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/spotInRegulation?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//车型应对状态查询列表
export const certPolicyCodeList = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vcm/certPolicyCode', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//法规查询车型匹配
export const queryregulationCodesList = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/vehicleAnnounceCar/queryregulationCodes', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//法规查询车型匹配导出
export const vehicleAnnounceCarExcelExport2 = function(data){
  return axios.get(baseUrl+'/dongfeng/productioncar/vehicleAnnounceCar/excelExport2',{
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
//车型查询法规匹配情况列表
export const vehicleAnnounceCarQueryids = function (data) {
  // /dongfeng/productioncar/vehicleAnnounceCar/queryids
  return axios.get(baseUrl + '/dongfeng/productioncar/relevance/search/model-match-regulation', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//车型查询法规匹配导出
export const vehicleAnnounceCarExcelExport1 = function(data){
  return axios.get(baseUrl+'/dongfeng/productioncar/vehicleAnnounceCar/excelExport1',{
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
// 点检状态
export const spotCheckStatusEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/responseResultInterface/status-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}

//点检车型信息列表
export const responseResultInterfaceList = function (data) {
  // /dongfeng/productioncar/responseResultInterface
  return axios.get(baseUrl + '/dongfeng/productioncar/check/task/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//是否应对
export const respondEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/responseResultInterface/result-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}
//点检-车型信息查询详情
export const responseResultInterfaceQueryOne = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/responseResultInterface/queryOne', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//点检-车型更新
export const  responseResultInterfaceUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/responseResultInterface/updateOne', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//点检清单-字典表
export const  dfHandlingInterfaceEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/status-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}
// 点检清单列表
export const dfHandlingInterfaceList = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//点检清单 查看详情
export const dfHandlingInterfaceQueryOne = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/queryOne', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//点检清单 更新
export const dfHandlingInterfaceUpdate  = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/dfHandlingInterface', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//page1修改 部门联动
// export const selectMibyname = function () {
//   return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/selectMibyname', {
//     params: {
//       time: new Date().getTime()
//     }
//   })
// }
//点检清单 下发
export const dfHandlingInterfaceIssue = function (ids) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/issue', {
    params: {
      time: new Date().getTime(),
      ids
    },paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//设计师点检-批量办理
export const dfHandlingInterfaceIds = function (ids) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/ids', {
    params: {
      time: new Date().getTime(),
      ids
    },paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//设计师点检-批量办理前校验
export const dfHandlingInterfaceDesignerDetails = function (standardRegulationNo) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/designerDetails', {
    params: {
      time: new Date().getTime(),
      standardRegulationNo
    },paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//审批状态
export const  resultEnum = function () {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/result-enum', {
    params: {
      time: new Date().getTime()
    }
  })
}
//设计师点检-提交之前校验
export const dfHandlingInterfaceSelectbyupdate = function (ids) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/selectbyupdate', {
    params: {
      time: new Date().getTime(),
      ids
    },paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//设计师点检-提交修改
export const  dfHandlingInterfaceUpdatey = function (data) {
  return axios.patch(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/updatey?time='+new Date().getTime(), 
  JSON.stringify(data), 
  {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
  })
}
//设计师点检-退回
export const  dfHandlingInterfaceUpdatedesignerStatus= function (ids) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/updaten', {
    params: {
      time: new Date().getTime(),
      ids
    },paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//下三审核列表
export const  dfHandlingInterfacetoExamine= function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/toExamine', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//同意 退回列表
export const dfHandlingInterfaceDetails = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/details', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//同意 退回列表详情
export const  individualetails= function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/individualetails', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//应到实到
export const dfHandlingInterfaceAllcount = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/allcount', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 同意前校验
export const dfHandlingInterfaceIdentical= function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/identical', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//退回
export const dfHandlingInterfaceUpdatestatusy = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/updatestatusy', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//同意

export const dfHandlingInterfaceUpdatestatusn = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/dfHandlingInterface/updatestatusn', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//获取级联基础数据
export const getTreeSelectEnabled = function (id) {
  return axios.get(baseUrl + '/basic/tree-kv/group/select-enabled?parentId=' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//在产点检清导出
export const dfHandlingInterfaceExport = function(data){
  // /dongfeng/productioncar/dfHandlingInterface/excel-export
  return axios.get(baseUrl+'/dongfeng/productioncar/check/task/download/excel',{
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
//公告车型编制提交
export const announcementModelSubmit = function (id,assigneeId) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/submit?id='+id+'&assigneeId='+assigneeId, {
    time: new Date().getTime()
  },{
      traditional: true
    })
}
//公告车型编制保存并提交
export const announcementModelSaveSubmit = function (data,assigneeId) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/save-submit?time=' + new Date().getTime()+'&assigneeId='+assigneeId, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//公告车型审批页面同意
export const  announcementModelApproveAgree = function (id,content) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/approve/agree?id=' + id+'&content='+encodeURI(content), {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//公告车型审批页面退回
export const announcementModelApproveDisagree = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/approve/disagree?id='+data.id+'&content='+encodeURI(data.content), {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//公告车型完成页面 申请删除
export const announcementModelApplyDelete = function (id) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/apply-delete?id='+id, {
    time: new Date().getTime()
  },{
      traditional: true
  })
}
//公告车型完成页面 申请修改
export const announcementModelApplyModify = function (data) {
  return axios.post(baseUrl + '/dongfeng/productioncar/announcement-model/single/apply-modify?time='+new Date().getTime(),JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}
//车型认证文件历史
export const historyImportList = function(data){
  return axios.get(baseUrl+'/dongfeng/productioncar/model-coc-regulate/history/import-list',{
    params:{
        ...data,
        time:new Date().getTime()
    },     
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}
//法规跟踪表 查询完成列表
export const finishList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/finish-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//点检清单 新增
export const productioncarChecklistAdd = function(regulationId){
  return axios.post(baseUrl+'/dongfeng/productioncar/check/checklist/single/create?regulationId='+regulationId,qs.stringify({
    time:new Date().getTime(),
  }),{traditional:true});
}

//点检批量删除
export const productioncarChecklistDelete= function(ids){
  return axios.post(baseUrl+'/dongfeng/productioncar/check/checklist/batch/delete',qs.stringify({
    ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

//车型信息应对
export const productioncarCheckDoProcess = function(ids){
  return axios.post(baseUrl+'/dongfeng/productioncar/check/task/do-process',qs.stringify({
    ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}
//车型信息不应对
export const productioncarCheckNotProcess = function(ids){
  return axios.post(baseUrl+'/dongfeng/productioncar/check/task/not-process',qs.stringify({
    ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

//车型信息查询版本列表
export const productioncarVersionList = function(id){
  return axios.get(baseUrl+'/dongfeng/productioncar/check/checklist/version/select?id='+id,{
    params:{
        time:new Date().getTime()
    }
  })
}
//车型信息历史列表
export const productioncarTaskArchiveList = function (data) {
  return axios.get(baseUrl + '/dongfeng/productioncar/check/task/archive/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//刷新车型信息
export const productioncarRefreshAll = function(masterId){
  return axios.post(baseUrl+'/dongfeng/productioncar/check/task/refresh-all?masterId='+masterId,qs.stringify({
    time:new Date().getTime(),
  }),{traditional:true});
}
//公告车型管理-临时数据初始化
export const productioncarTempInit = function (id) {
  return axios.get(baseUrl + '/dongfeng/productioncar/announcement-model/temp/init', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
