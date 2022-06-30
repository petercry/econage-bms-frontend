import axios from 'axios'
import { baseUrl } from '../config/env'
import { EcoUtil } from '@/components/util/main.js'
import { Message } from 'element-ui'
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
axios.defaults.withCredentials = false;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  EcoUtil.beforeAjaxDoAction();
  if (config.url && config.url.indexOf('/login') == -1) {
    config.headers['eco-auth-token'] = sessionStorage.getItem('ecoToken');
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
    if (err.response && err.response.data) {
      err.message = err.message + ',' + err.response.data
    }
    if (err.response.status == 401) {
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      if (parent.window.sysvm) {
        parent.window.sysvm.logout();
      }
    } else if (err.response.status == 500) {
      Message({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    } else {
      Message({
        showClose: true,
        message: err.message,
        type: 'error'
      })
    }
  }
  return Promise.reject(err);
})

export const loginAjax = function () {
  return axios.post(baseUrl + '/login', qs.stringify({
    username: '10013',
    password: '123456Zm',
    time: new Date().getTime()
  }), { traditional: true });
}

//获取基础数据
export const getEnumSelectEnabled = function (id, action = '') {
  return axios.get(baseUrl + '/basic/kv/group/' + id + '/detail/' + action, {
    params: {
      time: new Date().getTime()
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


//根据用户id获取用户信息
export const getUserInfoByOrgId = function (id) {
  return axios.get(baseUrl + '/org/user/' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//根据orgId 回显部门名称
export const getOrgsMemberByIds = function (orgIdArray) {
  return axios.post(baseUrl + '/org/tree-select/member-text-show', orgIdArray, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
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
//获取审批流所有节点
export const planPublishStateFlow = function () {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/enum/state-flow', {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取审批流程状态
export const planPublishPhaseStatus = function () {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/enum/phase-status', {
    params: {
      time: new Date().getTime()
    }
  })
}
//标准计划发布列表
export const planPublishMainList = function (data) {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/main/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//启动计划
export const innovationDeptCreate = function () {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/tech-innovation-dept-create/init', {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//批量删除
export const planPublishMainDelete = function(ids){
  return axios.delete(baseUrl+'/dongfeng/std/plan-publish/main/delete-batch',{
      params:{
        ids,
        time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
}
//导出
export const  mainExcelExport = function(data){
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/main/excel-export', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    responseType:'blob',
  })
}
//Excel导入
export const  mainExcelImport = function (data) {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/main/excel-import',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}
//下发 审批通过
export const stateFlowPass = function (state) {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/state-flow/pass?state='+state, {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
// 基本信息新增
export const planPublishMainAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/main/add-single?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//基本信息查询信息
export const planPublishMainDeatils = function (id) {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/main/select-single' , {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//基本信息修改
export const planPublishMainUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/std/plan-publish/main/update-single', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//分标委列表
export const  subStdCommitteeList= function (data) {
  return axios.get(baseUrl + '/dongfeng/sub-std-committee/list/select', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//分标委新增
export const  subStdCommitteeAdd= function (data) {
  return axios.post(baseUrl + '/dongfeng/sub-std-committee/single/create?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//分标委详情
export const subStdCommitteeDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/sub-std-committee/single/select' , {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//分标委更新
export const subStdCommitteeUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/sub-std-committee/single/update?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//分标委删除
// '/dongfeng/sub-std-committee/list/invalid?time=' + new Date().getTime()+"&ids="+ids
export const subStdCommitteeDel = function (ids) {
  return axios.post(baseUrl + '/dongfeng/sub-std-committee/list/invalid',{},
  {
    params:{
      ids,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    traditional: true
  })
}
//获取审批流程历史意见列表
export const approveHistoryList = function (programId) {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/main/approve-history?programId=' + programId, {
    params: {
      time: new Date().getTime()
    }
  })
}
//获取当前用户可以访问审批节点列表
export const  stateFlowCurrentUserStateList = function () {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/state-flow/current-user-state-list', {
    params: {
      time: new Date().getTime()
    }
  })
}
//维护科室联络员列表
export const officeRoleList  = function () {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/dept-liaison-proof/office-role-list', {
    params: {
      time: new Date().getTime()
    }
  })
}
//添加单个科室联络员
export const officeRoleAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/dept-liaison-proof/add-office-role?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//修改单个科室联络员
export const officeRoleEdit = function (data) {
  return axios.patch(baseUrl + '/dongfeng/std/plan-publish/dept-liaison-proof/update-office-role?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//批量删除科室联络人
export const deptLiaisonProofDel = function(ids){
  return axios.delete(baseUrl+'/dongfeng/std/plan-publish/dept-liaison-proof/delete-office-role?time='+new Date().getTime(),{
    params:{
      ids
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  },{traditional:true})
}
//查询当前节点拥有的数据行数
export const  stateFlowCurrentCount = function (state) {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/state-flow/current-count?state='+state, {
    params: {
      time: new Date().getTime()
    }
  })
}
//查询当前节点需要到达的数据总行数
export const  stateFlowTotalCount = function (state) {
  return axios.get(baseUrl + '/dongfeng/std/plan-publish/state-flow/total-count?state='+state, {
    params: {
      time: new Date().getTime()
    }
  })
}
//退回
export const planPublishWithdraw = function (data) {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/state-flow/send-back',{},
  {
    params:{
      ...data,
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    traditional: true
  })
}
//发布
export const techInnovationDeptCreatePublish = function () {
  return axios.post(baseUrl + '/dongfeng/std/plan-publish/tech-innovation-dept-create/publish', {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}

//问题清单列表
export const problemList=function(data){
  return axios.get(baseUrl+'/dongfeng/standard-quality-problem-list/pagination',{
    params:{
      time:new Date().getTime(),
      sort: 'modDate',
      order: 'desc',
      page:1,
      rows: 9999,
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}


// 获取技术标准体系树
export const technicalStandardTree = function(id){
  return axios.get(baseUrl+'/dongfeng/systreemanage/standardSystem/tree-rows',{
    params:{
      parentId:id,
      time:new Date().getTime()
    }
  })
}
//标准体系树生成编号
export const systreemanageCreateCode = function(id){
  return axios.get(baseUrl+'/dongfeng/systreemanage/support/standard/create-code',{
    params:{
      id,
      time:new Date().getTime()
    }
  })
}

// 查询知识库列表
export const getKnowledgeLibCard = function (params) {
  return axios.get(baseUrl + '/dongfeng/doc-base/base/list/select', {
    params: {
      time: new Date().getTime(),
      ...params
    }
  })
}
// 查询知识库文件夹树
export const  docBaseTree= function (data) {
  return axios.get(baseUrl + '/dongfeng/doc-base/search/tree/dir', {
    params: {
      ...data,
      time: new Date().getTime()
    }
  })
}
//查对应文件夹 的文件
export const docBaseFileRecursively  = function (data) {
  return axios.get(baseUrl + '/dongfeng/doc-base/search/file/recursively', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//批量归档
export const stdRevisionArchiveFile = function(data){
  return axios.post(baseUrl+'/dongfeng/std/revision/main/archive-file',
    {},
    {
      params: {
        time: new Date().getTime(),
        ...data
      },
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
  ,{traditional:true});
}