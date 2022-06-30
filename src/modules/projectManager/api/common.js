import request from '../utils/request'
import qs from 'qs'
//登录
export const login = (username, password) =>{
    return request({
        url: '/login',
        method: 'post',
        data: qs.stringify({
            username:username,
            password:password,
            time:new Date().getTime()
        })
    })
}
//查询基础数据
export const getEnumSelectEnabled = function(id,action = 'select-enabled'){
    return request({
        url: '/basic/kv/group/'+id+'/detail/'+action,
        method: 'get'
    })
}
//获取uid
export const getItemFetchId = function(){
    return request({
      url: '/fetch-uid',
      method: 'get',
      params:{
        time:new Date().getTime()
      },
      transformResponse: [function (data) {
        return data;
      }],
    })
}
//获取角色列表
export const getRoleList = function(){
  return request({
      url: '/extend/faw/pm-base/role-rows',
      method: 'get',
  })
}
//新增团队 角色列表
export const getRoleListGroup = function(){
    return request({
        url: '/extend/faw/pm/role-rows',
        method: 'get',
    })
  }
//基础数据查询---单个（类型）
export const getKVSingleInfo = function(id){
  return request({
      url: '/extend/faw/pm-common/kv-single',
      method: 'get',
      params:{
        id
      }
  })
}
//基础数据更新（类型）
export const updateKVSingle = function(data){
  return request({
      url: '/extend/faw/pm-common/kv',
      method: 'put',
      data:data
  })
}
//获取文件列表

export const getFileListByModular = function(modular,modularInnerId){
  return request({
      url: '/file-manager/info/modular/'+modular,
      method: 'get',
      params:{
        modularInnerId
      }
  })
}

//批量删除文件
export const batchDeleteFiles = function(ids){
  return request({
      url: '/file-manager/delete-batch',
      method: 'delete',
      params:{
        fileHeaderId:ids
      },
      paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })
}
// 获取当前用户信息
export const getUserSelfInfo = function(){
  return request({
    url: '/org/user/self',
    method: 'get',
    params: {
      time:new Date().getTime()
    }
  })
}
//根据用户id获取用户信息
export const getUserInfoByOrgId = function(id){
  return request({
      url: '/org/user/'+id,
      method: 'get',
  })
}
//启动项目编号流程
export const startBHWorkFlow = function(infoId){
  return request({
      url: '/extend/faw/pm/initwf-info-code',
      method: 'get',
      params:{
        infoId:infoId
      }
  })
}
//申请办理流程
export const getWFOperateId = function(task_id){
  return request({
    url: '/bpm/v95/process/process',
    method: 'post',
    data: qs.stringify({
          task_id:task_id,
          time:new Date().getTime()
        })
    })
}
//获取项目权限
export const getPMRole = function(infoId){
  return request({
    url: '/extend/faw/pm/all-model-role',
    method: 'get',
    params:{
      infoId:infoId
    }
  })
}
//获取模块内的权限控制
export const getPMModelRole = function(infoId,modelType){
  return request({
    url: '/extend/faw/pm/model-role',
    method: 'get',
    params:{
      infoId:infoId,
      modelType:modelType
    }
  })
}
// 获取所属领域
export const getBelongField = function(infoId){
  return request({
    url: '/extend/faw/pm/problem-and-risk-field',
    method: 'get',
    params:{
      infoId:infoId
    }
  })
}
//项目模板下载
export const downloadProjectTemplate = function(url){
  return request({
      url: url,
      method: 'get',
      responseType: 'blob'
  })
}
//查询当前人员所属部门专业列表
export const getActivityList = function(params){
  return request({
      url: '/extend/faw/mh/activity-rows',
      method: 'get',
      params:{
          currUserDept:true
      }
  })
}
//根据角色获取员工
export const getUserListByRole = function(infoId,roleId){
  return request({
      url: '/extend/faw/pm/group-user-rows',
      method: 'get',
      params:{
        infoId,
        roleId
      }
  })
}
//获取流程类别
export const getWFGroupsAjax = function(){
  return request({
      url: '/bpm/v95/model/workflow/group',
      method: 'get',
      params:{
        set_token_flag: "N",
        time: new Date().getTime()
      }
  })
}
//获取流程模版
export const getWFTemplatesAjax = function(groupId,subGroupId){
  return request({
    url: '/bpm/v95/model/workflow/list',
    method: 'post',
    data: qs.stringify({
      time:new Date().getTime(),
      group_id:groupId,
      sub_group_id:subGroupId||-1,
    })
  })

}

//流程 待办流程取数
export const getTaskWFModuleAjax = function(data){
  let param = {
    folder: 0,
    group_id: data.groupId||-1,
    sub_group_id:data.subGroupId||-1,
    rows: data.rows,
    page: data.page,
    request_desc: data.searchMsg,
    sort:data.sort,
    order:data.order,
    template_id: data.templateId||-1,
    init_start_time:data.init_start_time,
    init_end_time:data.init_end_time,
    assign_start_time:data.assign_start_time,
    assign_end_time:data.assign_end_time,
    init_user:data.initValue,
    time:new Date().getTime()
 }
  return request({
    url: '/bpm/v95/psn-search/toassign',
    method: 'post',
    data: qs.stringify(param,{arrayFormat:'repeat'})
  })
}

//获取流程模版
export const getWfTaskListByProject = function(params){
  return request({
    url: '/extend/ext/wf-toassign',
    method: 'post',
    params
  })

}
//获取项目数据-----导入模板列表
export const getPmTemplist = function(url){
  return request({
    url: url,
    method: 'get'
  })

}
