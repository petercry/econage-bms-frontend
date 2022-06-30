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
    // username:'qqq222',
    // password:'123456',
    username: '10013',
    password: '123456Zm',
    time: new Date().getTime()
  }), { traditional: true });
}

//获取树形示例 枚举字段
export const getTreeEnumMap = function () {
  return axios.get(baseUrl + '/demo/tree/enum-map', {
    params: {
      time: new Date().getTime()
    }
  })
}

//获取树形示例 列表 按父节点查找
export const getTreeList = function (id) {
  return axios.get(baseUrl + '/demo/tree/' + id + '/sub', {
    params: {
      time: new Date().getTime()
    }
  })
}

//获取树形示例 文件
export const getTreeFileList = function (id) {
  return axios.get(baseUrl + '/web/file-manager/info/modular/treeDemo', {
    params: {
      modularInnerId: id,
      time: new Date().getTime()
    }
  })
}
//树形示例-添加
export const treeAddAjax = function (data) {
  return axios.post(baseUrl + '/demo/tree', {
    date: data.date,
    dateTime: data.dateTime,
    deptId: data.deptId,
    enumData: data.enumData,
    fileHeaderId: data.fileHeaderId,
    i18nKey: data.i18nKey,
    number: data.number,
    parentId: data.parentId,
    str: data.str,
    userId: data.userId,
    userOrgId: data.userOrgId,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//树形示例-编辑
export const treeEditAjax = function (data, id) {
  return axios.put(baseUrl + '/demo/tree/' + id, {
    date: data.date,
    dateTime: data.dateTime,
    deptId: data.deptId,
    enumData: data.enumData,
    fileHeaderId: data.fileHeaderId,
    i18nKey: data.i18nKey,
    number: data.number,
    parentId: data.parentId,
    str: data.str,
    userId: data.userId,
    userOrgId: data.userOrgId,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//通用示例-列表
export const getTableList = function (data) {
  return axios.get(baseUrl + '/demo/common/pagination', {
    params: {
      sort: data.sort,//字符串，可以是数组，排序列名称
      order: data.order,//字符串，可以是数组，排序列顺序或者逆序
      page: data.page,//整数，分页查询第几页
      rows: data.rows,//整数，分页行数
      time: new Date().getTime()
    }
  })
}
//通用示例-详情
export const getTableItem = function (id) {
  return axios.get(baseUrl + '/demo/common/' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}

//通用示例-添加
export const tableAddAjax = function (data) {
  return axios.post(baseUrl + '/demo/common', {
    date: data.date,
    dateTime: data.dateTime,
    deptId: data.deptId,
    enumData: data.enumData,
    fileHeaderId: data.fileHeaderId,
    i18nKey: data.i18nKey,
    number: data.number,
    parentId: data.parentId,
    str: data.str,
    userId: data.userId,
    userOrgId: data.userOrgId,
    demoItems: data.demoItems,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//通用示例-修改
export const tableEditAjax = function (id, data) {
  return axios.put(baseUrl + '/demo/common/' + id, {
    date: data.date,
    dateTime: data.dateTime,
    deptId: data.deptId,
    enumData: data.enumData,
    fileHeaderId: data.fileHeaderId,
    i18nKey: data.i18nKey,
    number: data.number,
    parentId: data.parentId,
    str: data.str,
    userId: data.userId,
    userOrgId: data.userOrgId,
    demoItems: data.demoItems,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//通用示例-删除
export const tableDeleteAjax = function (id) {
  return axios.delete(baseUrl + '/demo/common/' + id, { traditional: true })
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
//查询管理列表
export const regulationtrackList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/manage-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//查询审批列表
export const approvalList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/approval-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//查询发放列表
export const dispatchList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/dispatch-list', {
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
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/trivial/status-set', {
    params: {
      time: new Date().getTime()
    }
  })
}
//查询完成列表
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
//通知单
export const  notificationList = function (data) {
  return axios.get(baseUrl + '/dongfeng/commonbiz/notification/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 通知单查询详情
export const  notificationDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/commonbiz/notification?id='+id, {
    params: {
      time: new Date().getTime(),
    }
  })
}
// 新建单个
export const regulationtrackAdd = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//提交
export const regulationtrackCommit = function (id,assigneeId) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/single/commit?id='+id+'&assigneeId='+assigneeId, {
    time: new Date().getTime()
  },{
      traditional: true
    })
}
//审批通过 发布
export const regulationtrackApprove = function (id,content) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/single/approve?id=' + id+'&content='+encodeURI(content), {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//退回
export const regulationtrackWithdraw = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/single/withdraw?id='+data.id+'&content='+encodeURI(data.content), {
    time: new Date().getTime()
  }, {
      traditional: true
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
//查看详情
export const regulationtrackSelectSingle = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//通过id删除
export const regulationtrackDelete = function (id) {
  return axios.delete(baseUrl + '/dongfeng/thinktank/regulationtrack', {
    params: {
      time: new Date().getTime(),
      id
    }
  },{
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
  })
}
//更新单个
export const regulationtrackUpdate = function (data) {
  return axios.patch(baseUrl + '/dongfeng/thinktank/regulationtrack', {
    ...data,
    time: new Date().getTime()
  }, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//申请修改
export const applyModify = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/apply-modify?time='+new Date().getTime(),JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
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
//发放
export const regulationtrackDispatch = function (id) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/single/dispatch?id='+id, {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//发放2
export const  notification = function (data) {
  return axios.post(baseUrl + '/dongfeng/commonbiz/notification?time='+new Date().getTime(),JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}

//不发放
export const regulationtrackFinish = function (id) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/single/finish?id='+id, {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//申请删除
export const applyDiscard = function (id) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/apply-discard?id='+id, {
    time: new Date().getTime()
  }, {
      traditional: true
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
// 法规跟踪表Excel导出
export const  regulationtrackExport=function(data){
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/download/excel', {
    params: {
      ...data,
      time: new Date().getTime(),
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    responseType:'blob',
  })
}
// 法规跟踪表查询页分类树
export const finishCategoryTree = function(validStatus){
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/finish-category-tree?validStatus='+validStatus, {
    params: {
      time: new Date().getTime(),
    }
  })
}
//历史版本版本
export const regulationtrackArchiveList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/archive/list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//法规跟踪表 历史版本版本详情
export const regulationtrackArchiveDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/archive/single?id='+id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//法规跟踪表 审批记录 
// export const regulationtrackApprovalList = function (id) {
//   return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/search/approval/list?id='+id, {
//     params: {
//       time: new Date().getTime()
//     }
//   })
// }
export const regulationtrackApprovalList = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulationtrack/flow/approve/history-list?id='+id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//保存并提交
export const regulationtrackSaveCommit = function (data,assigneeId) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulationtrack/save-commit?time=' + new Date().getTime()+'&assigneeId='+assigneeId, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}

//通知单编制界面
export const  regulationNotificationlist = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-notification/list/select/planning', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//通知单编制 更新
export const regulationNotificationUpdate = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-notification/single/update?time='+new Date().getTime(),JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
  })
}
// 通知单查询详情
export const  regulationNotificationDetails = function (id,fromPage) {
  let data={
    id
  };
  let phase = {
    proofreading:"PROOFREADING",
    approve: "APPROVING"
  }
  if(fromPage==='proofreading' || fromPage==='approve'){
    data.phase = phase[fromPage]
  }
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-notification/single/details', {
    params: {
      time: new Date().getTime(),
      ...data
    }
  })
}

//通知单编制不发放
export const regulationNotificationFlowFinish = function (id) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-notification/flow/single/plan/finish?id='+id, {
    time: new Date().getTime()
  }, {
      traditional: true
    })
}
//通知单编制发放
export const regulationNotificationFlowCommit = function (data) {
  return axios.post(baseUrl + `/dongfeng/thinktank/regulation-notification/flow/single/plan/commit?id=${data.id}&proofreadingAssignee=${data.proofreadingAssignee}&approvingAssignee=${data.approvingAssignee}`, {
    time: new Date().getTime()
  },{
      traditional: true
  })
}
//通知单审核页面
export const  regulationNotificationApproving = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-notification/list/select/approving', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//通知单审核提交或者退回
export const regulationtrackFlowApprove = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-notification/flow/single/approve?id='+data.id+'&accept='+data.accept+'&opinion='+encodeURI(data.opinion), {
    time: new Date().getTime()
  },{
      traditional: true
    })
}
//通知单校对list
export const regulationNotificationProofreading  = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-notification/list/select/proofreading', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//通知单校对提交或者退回
export const regulationtrackFlowProofread = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-notification/flow/single/proofread?id='+data.id+'&accept='+data.accept+'&opinion='+encodeURI(data.opinion), {
    time: new Date().getTime()
  },{
      traditional: true
    })
}
//通知单编制保存并提交
export const regulationNotificationUpdateCommit = function (data,proofreadingAssignee,approvingAssignee) {
  return axios.post(baseUrl + '/dongfeng/thinktank/regulation-notification/flow/single/update-commit?time=' + new Date().getTime()+'&proofreadingAssignee='+proofreadingAssignee+'&approvingAssignee='+approvingAssignee, JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//通知单完成
export const regulationNotificationComplete = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/regulation-notification/list/select/complete', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}


