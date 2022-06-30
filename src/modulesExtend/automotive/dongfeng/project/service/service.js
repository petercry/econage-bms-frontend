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
//获取权限
export const projectPermission = function(projectId){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/permission/select',{
      params:{
          projectId,
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


//获取项目列表
export const getProList = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/list',{
      params:{
          page:data.page,
          rows:data.rows,
          sort:data.sort,
          order:data.order,
          time:new Date().getTime()
      }
  })
}


export const addProBaseInfo = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl + '/dongfeng/thinktank/project',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//编辑
export const updateProBaseInfo = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.patch(baseUrl + '/dongfeng/thinktank/project',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}

// 删除
export const deleteProBaseInfo = function(ids){
    return axios.delete(baseUrl+'/dongfeng/thinktank/project/list',{
      params:{
          'ids':ids,
          time:new Date().getTime()
        },
        paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    },{traditional:true})
}


//获取项目详情
export const getProBaseInfo = function(id){
    return axios.get(baseUrl+'/dongfeng/thinktank/project',{
        params:{
            id:id,
            time:new Date().getTime()
        }
    })
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


//添加项目人员
export const addProMember = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl + '/dongfeng/thinktank/project/member',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}




//获取项目成员列表
export const getProMemberList = function(data){
    return axios.get(baseUrl+'/dongfeng/thinktank/project/member/list',{
        params:{
            projectId:data.projectId,
            page:data.page,
            rows:data.rows,
            sort:data.sort,
            order:data.order,
            // deptId:data.deptId,
            // professionDesignerId:data.professionDesignerId,
            // professionLeaderId:data.professionLeaderId,
            // deptContactUserId:data.deptContactUserId,
            deptName:data.deptName,
            professionDesignerName:data.professionDesignerName,
            professionLeaderName:data.professionLeaderName,
            deptContactUserName:data.deptContactUserName,
            time:new Date().getTime()
        }
    })
}

//获取项目成员列表
export const getProMemberHistoryList = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/member/history/list',{
      params:{
          projectId:data.projectId,
          page:data.page,
          rows:data.rows,
          sort:data.sort,
          order:data.order,
          time:new Date().getTime()
      }
  })
}


export const deleteProMember = function(ids,projectId){
  return axios.delete(baseUrl+'/dongfeng/thinktank/project/member/list',{
    params:{
          'projectId':projectId,
          'ids':ids,
          time:new Date().getTime()
      },
      paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
}



//获取成员详情
export const getProMemberSingle = function(id){
    return axios.get(baseUrl+'/dongfeng/thinktank/project/member',{
        params:{
            id:id,
            time:new Date().getTime()
        }
    })
}


//添加项目人员
export const updateProMember = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.patch(baseUrl + '/dongfeng/thinktank/project/member',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//添加节点
export const addProNode = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl + '/dongfeng/thinktank/project/panel/node',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//查询节点计划信息
export const getProNodePlanList = function(projectId){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/panel/common',{
      params:{
          projectId:projectId,
          time:new Date().getTime()
      }
  })
}

//获取节点详情
export const getProNodeSingle = function(id){
    return axios.get(baseUrl+'/dongfeng/thinktank/project/panel/node',{
        params:{
            id:id,
            time:new Date().getTime()
        }
    })
}

//编辑节点
export const editProNode = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.patch(baseUrl + '/dongfeng/thinktank/project/panel/node',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}

//删除节点
export const deleteProNode = function(id){
    return axios.delete(baseUrl+'/dongfeng/thinktank/project/panel/common',{
      params:{
          id:id,
          time:new Date().getTime()
        },
        paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    },{traditional:true})
}


//添加计划
export const addProPlan = function (data) {
    let _saveData = {};
    for(let key in data){
        _saveData[key] = data[key];
    }
    _saveData.ajaxTime = new Date().getTime();
    return axios.post(baseUrl + '/dongfeng/thinktank/project/panel/plan',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//获取计划详情
export const getProPlanSingle = function(id){
    return axios.get(baseUrl+'/dongfeng/thinktank/project/panel/plan',{
        params:{
            id:id,
            time:new Date().getTime()
        }
    })
}

//编辑计划
export const editProPlan = function (data) {
  let _saveData = {};
  for(let key in data){
      _saveData[key] = data[key];
  }
  _saveData.ajaxTime = new Date().getTime();
  return axios.patch(baseUrl + '/dongfeng/thinktank/project/panel/plan',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//删除计划
export const deleteProPlan = function(id){
    return axios.delete(baseUrl+'/dongfeng/thinktank/project/panel/common',{
      params:{
          id:id,
          time:new Date().getTime()
        },
        paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    },{traditional:true})
}


//计划反馈
export const processProPlan = function (data) {

    let _saveData = {};
    _saveData.id = data.id;
    _saveData.status = data.status;
    _saveData.processContent = data.processContent;
    _saveData.ajaxTime = new Date().getTime();

    return axios.post(baseUrl + '/dongfeng/thinktank/project/panel/plan/process',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}


//获取状态
export const getStatusAjax = function(){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/meta/kv-map/design-check-status',{
      params:{
          time:new Date().getTime()
      }
  })
}

//获取点检任务清单
export const getTaskListAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/list/checklist',{
      params:{
          time:new Date().getTime(),
          ...data
      }
  })
}

//获取生成任务清单
export const getGenerateTaskListAjax = function(id){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/init',qs.stringify({
    projectId:id,
    time:new Date().getTime(),
  }),{traditional:true});
}

//下发
export const getIssueAjax = function(phase,projectId,groupIds){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/flow/approval',qs.stringify({
    phase:phase,
    projectId:projectId,
    groupIds:groupIds,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

//退回
export const getBackAjax = function(phase,projectId,ids,opinion){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/flow/disapproval',qs.stringify({
    phase:phase,
    projectId:projectId,
    ids:ids,
    opinion:opinion,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

//查询任务详情
export const getDesignDetailAjax = function(taskId){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/task',{
    params:{
        id:taskId,
        time:new Date().getTime(),
    }
  })
}

// 更新任务
export const updateTaskInfo = function (id,data) {
  let _saveData = {};
  _saveData.id = id,
  _saveData.importantType = data.importantType,
  _saveData.deptId = data.deptId,
  _saveData.officeId = data.officeId,
  _saveData.profession = data.profession,
  _saveData.contactUserId = data.contactUserId,
  _saveData.designerUserId = data.designerUserId,
  _saveData.ajaxTime = new Date().getTime();
  return axios.patch(baseUrl + '/dongfeng/thinktank/project/designcheck/task',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}

// 批量作废
export const deleteTask = function(ids,projectId){
  return axios.delete(baseUrl+'/dongfeng/thinktank/project/designcheck/task/discard-batch?projectId='+projectId,
  {
    data:ids
  },
  {
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional: true
  })
}


//查询任务处理详情
export const getHandleDetailAjax = function(taskId){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/task-full',{
    params:{
        id:taskId,
        time:new Date().getTime(),
    }
  })
}

//修改专业信息变动
export const getchangeFunAjax = function(projectId,id){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/profession-member',{
    params:{
        projectId: projectId,
        profession: id,
        time:new Date().getTime(),
    }
  })
}

//获取联络员清单
export const getLiaisonListAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/list/contact-confirm',{
      params:{
          time:new Date().getTime(),
          ...data
      }
  })
}

//获取分组列表
export const getGroupingListAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/group/list',{
      params:{
          time:new Date().getTime(),
          ...data
      }
  })
}

//查询分组条目列表
export const getGroupingInfoAjax = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/group/item/list',{
      params:{
          time:new Date().getTime(),
          ...data
      }
  })
}

//反馈
export const saveFeedbackAjax = function(id,data){
  let _saveData = {};
  _saveData.taskId = id,
  _saveData.schemeType = data.schemeType,
  _saveData.regulatoryCompliance = data.regulatoryCompliance,
  _saveData.description = data.description,
  _saveData.ajaxTime = new Date().getTime();
  return axios.post(baseUrl + '/dongfeng/thinktank/project/designcheck/feedback',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}

//已办
export const getDoneAjax = function(Ids){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/group/item/read-mark',qs.stringify({
    ids:Ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}


// 导出清单列表excel
export const getTaskListExportAjax = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/designcheck/list/checklist/download-excel',{
    params: {
      time:new Date().getTime(),
      ...data
    },
    responseType: 'blob',
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

// 导出分组excel
export const getDesignExportAjax = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/designcheck/group/download-excel',{
    params: {
      time:new Date().getTime(),
      ...data
    },
    responseType: 'blob',
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

// 导出分组项excel
export const getGroupedExportAjax = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/designcheck/group/item/download-excel',{
    params: {
      time:new Date().getTime(),
      ...data
    },
    responseType: 'blob',
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

// 设计师重新提交
export const reSubmitAjax = function(proId,Ids){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/group/reset',qs.stringify({
    projectId:proId,
    ids: Ids,
    time:new Date().getTime(),
  }, {arrayFormat: 'repeat'}),{traditional:true});
}

// 批量反馈
// export const batchProcessingAjax = function(Ids,data,fileHeaderIds){
//   return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/feedback/batch',qs.stringify({
//     schemeType:data.schemeType,
//     regulatoryCompliance: data.regulatoryCompliance,
//     description: data.description,
//     taskIds:Ids,
//     fileHeaderIds: fileHeaderIds,
//     time:new Date().getTime(),
//   }, {arrayFormat: 'repeat'}),{traditional:true});
// }
export const batchProcessingAjax = function (Ids,data,fileHeaderIds) {
  let _saveData = {};
  _saveData.schemeType = data.schemeType,
  _saveData.regulatoryCompliance = data.regulatoryCompliance,
  _saveData.description = data.description,
  _saveData.taskIds = Ids,
  _saveData.fileHeaderIds = fileHeaderIds,
  _saveData.ajaxTime = new Date().getTime();
  return axios.post(baseUrl + '/dongfeng/thinktank/project/designcheck/feedback/batch',_saveData,{headers: {'Content-Type':'application/json;charset=UTF-8'},traditional: true})
}



//实车点检提交
export const carcheckCommit= function(projectId){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/carcheck/commit?projectId='+projectId,{
    time:new Date().getTime()
  },{traditional:true});
}
//实车点检列表
export const carcheckList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/carcheck/list/checklist', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//实车点检生成
export const carcheckInit = function(data){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/carcheck/init',qs.stringify({
    ...data,
    time:new Date().getTime(),
  }),{traditional:true});
}
//批量办理 详情子表
export const carcheckFeedbackList = function (ids) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/carcheck/feedback/list', {
    params: {
      time: new Date().getTime(),
      ids
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//批量办理保存
export const  carcheckBatch = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/project/carcheck/feedback/batch?time=' + new Date().getTime(), JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      traditional: true
    })
}
//实车点检 查看详情
export const carcheckTaskDetails = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/carcheck/task', {
    params: {
      time: new Date().getTime(),
      id
    }
  })
}
//查询法规专业负责人审核列表
export const carcheckApprovalList = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/carcheck/list/approval-list', {
    params: {
      time: new Date().getTime(),
      ...data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
//实车 同意
export const carcheckDriveApproval = function(ids){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/carcheck/drive/approval',qs.stringify({
    ids,
    time:new Date().getTime(),
  },{arrayFormat: 'repeat'}),{traditional:true});
}
//实车 退回
export const carcheckDriveDisapproval = function(ids){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/carcheck/drive/disapproval',qs.stringify(
    {
      ids,
      time:new Date().getTime(),
    },{arrayFormat: 'repeat'})
,{traditional:true});
}
// 实车-点检清单导出
export const checklistExportCase  = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/carcheck/list/checklist/download-excel',{
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
// 实车-导出法规专业负责人导出
export const approvalListExportCase  = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/carcheck/list/approval-list/download-excel',{
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
//根据用户id获取用户信息
export const getUserInfoByOrgId = function (id) {
  return axios.get(baseUrl + '/org/user/' + id, {
    params: {
      time: new Date().getTime()
    }
  })
}
//项目人员导入
export const projectMemberUpload = function (data) {
  return axios.post(baseUrl + '/dongfeng/thinktank/project/member/list/upload-excel',data,
    {
      headers: {  'Content-Type': 'multipart/form-data' },
      traditional: true
    })
}

//同步
export const projectSyncCase = function(id){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/sync',qs.stringify({
    time:new Date().getTime(),
  }),{traditional:true});
}

// 分组信息
//实车点检 查看详情
export const getGroupingInfo = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/designcheck/group', {
    params: {
      time: new Date().getTime(),
      id:id
    }
  })
}
//点检任务清单刷新
export const  projectRefreshMembers= function(id){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/refresh-members?projectId='+id,qs.stringify({
    time:new Date().getTime(),
  }),{traditional:true});
}
//批量更新设计师
export const projectDesignerUpdate= function(data){ 
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/designer/update',qs.stringify({
    time:new Date().getTime(),
    ...data
  },{arrayFormat: 'repeat'}),{traditional:true});
}
//项目历史记录
export const projectHistory = function (data) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/history', {
    params: {
      time: new Date().getTime(),
      ...data
    }
  })
}
//查询法规树
export const designcheckTree = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/tree/regulation',{
      params:{
          ...data,
          time:new Date().getTime()
      }
  })
}
// 任务清单导出
export const  designcheckTaskListExport = function(data){
  return axios.get(baseUrl+'/dongfeng/thinktank/project/designcheck/list/checklist/download-excel',{
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
//流程历史
export const designcheckApproveHistoryList = function (id) {
  return axios.get(baseUrl + '/dongfeng/thinktank/project/designcheck/approve/history-list?id='+id, {
    params: {
      time: new Date().getTime()
    }
  })
}

//任务清单查询删除
export const designcheckDeleteByCondition = function(data){
  return axios.post(baseUrl+'/dongfeng/thinktank/project/designcheck/task/delete-by-condition',qs.stringify({
      ...data,
      time:new Date().getTime()
  }),{traditional:true});
}
