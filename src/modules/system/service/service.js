import axios from 'axios'
import {baseUrl} from '@/modules/bmsMmm/config/env'
import { Message } from 'element-ui';
import qs from 'qs';
//全局设置超时时间 120s
axios.defaults.timeout = 120000;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
        window.visitServerTime = new Date().getTime();
        // 在发送请求之前做些什么
        config.headers.Accept = 'application/json, text/plain';
        if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 && config.url.indexOf('/hr/dingding/open/setting')== -1 && config.url.indexOf('/public/setting/union') == -1)){
          config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken')||'';
        }else{

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
        err.message = '400-请求错误'
        break
      case 401:
        err.message = '401-未授权，请登录'
        break
      case 403:
        err.message = '403-拒绝访问'
        break
      case 404:
        err.message = `404-请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '408-请求超时'
        break
      case 500:
        err.message = '500-服务器内部错误'
        break
      case 501:
        err.message = '501-服务未实现'
        break
      case 502:
        err.message = '502-网关错误'
        break
      case 503:
        err.message = '503-服务不可用'
        break
      case 504:
        err.message =  '504-网关超时'
        break
      case 505:
        err.message = '505-HTTP版本不受支持'
        break
      default:
    }
    if(err.response && err.response.data){
        err.message = err.message + err.response.data
    }

     Message.error({
          showClose: true,
          message: err.response.data,
          type: 'error'
     })

     if (err.response.status==401){
        if (window.sysvm){
            window.sysvm.logout();
        }
     }
  }
  return Promise.reject(err);
})



/*登陆*/
export const loginAjax = function(data){
    return axios.post(baseUrl+'/login',qs.stringify({
        username:data.username,
        password:data.password,
        captchaCiphertext:data.captchaCiphertext,
        captchaInput:data.captchaInput,
        time:new Date().getTime()
    }),{traditional:true});
}

/*登出*/
export const loginOutAjax = function(data){
    return axios.post(baseUrl+'/logout',qs.stringify({
        time:new Date().getTime()
    }),{traditional:true});
}



export const dingdingLoginAjax = function(code,corpId,data){
  return axios.post(baseUrl+'/dingding-login',qs.stringify({
    code:code,
    corpId:corpId,
    loginMethod:data&&data.loginMethod||'',
    time:new Date().getTime()
}),{traditional:true});
}


//左侧菜单json
export const getMenuTreeViewAjax = function(){
    return axios.get(baseUrl+'/sys-menu/personal-list',{
        params: {
           time:new Date().getTime()
        }
    });
}


export const getMenuFacadeTreeViewAjax = function(){
  return axios.get(baseUrl+'/facade-menu/personal-list',{
      params: {
         time:new Date().getTime()
      }
  });
}


export const getSSOLinkAjax = function(paramKey,paramVal){
    return axios.post(baseUrl+'/standard/personal/app-oauth2-sso-url/fetch?'+paramKey+'='+paramVal,qs.stringify({},{arrayFormat:'repeat'}),{traditional:true});
}




//流程 待办流程取数
export const getTaskWFModuleAjax = function(data){
    let param = {
        folder: 0,
        group_id: data.groupId||-1,
        sub_group_id:data.subGroupId||-1,
        rows: data.rows,
        page: data.page,
        sort:data.sort,
        order:data.order,
        template_id: data.templateId||-1,
        initValue:data.initValue,
        cosignFlag:data.cosignFlag,
        time:new Date().getTime()
  }
  return axios.post(baseUrl+'/bpm/v95/psn-search/toassign',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


// get 获取我发起的流程列表
export const getWfSelfInitAjax = function(baseInfo){
    let param = {
        folder: baseInfo.folder,
        group_id: baseInfo.groupId,
        rows: baseInfo.rows,
        page: baseInfo.page,
        sort: baseInfo.sort,
        order: baseInfo.order,
        request_desc: baseInfo.searchMsg,
        template_id: baseInfo.templateId||-1,
        init_start_time:baseInfo.init_start_time,
        init_end_time:baseInfo.init_end_time,
        time: new Date().getTime(),
    }
    return axios.post(baseUrl+'/bpm/v95/psn-search/selfinit',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}


export const getUserSelfInfo = function(){
  return axios.get(baseUrl+'/org/user/self',{
      params: {
          time:new Date().getTime()
      }
  });
}

export const isSuperAdmin = function(){
  return axios.get(baseUrl+'/org/user/personal/is-super-admin',{
      params: {
          time:new Date().getTime()
      }
  });
}




//申请查看流程
export const getWFViewOperateId = function(wfId,formView,ccId){
  let _data = {};
  _data.ajaxTime = new Date().getTime();
  _data.wf_id = wfId;
  _data.cc_id = ccId;
  _data.form_view = formView;
  return axios.post(baseUrl+'/bpm/v95/process/form-view',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}

//申请办理流程
export const getWFOperateId = function(task_id){
  let _data = {};
  _data.task_id = task_id;
  _data.time = new Date().getTime();
  return axios.post(baseUrl+'/bpm/v95/process/process',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


// get 获取我经办的流程列表
export const getWFMyAllProcessAjax = function(baseInfo){
  let param = {
        folder: baseInfo.folder,
        group_id: baseInfo.groupId,
        sub_group_id:baseInfo.subGroupId||-1,
        rows: baseInfo.rows,
        page: baseInfo.page,
        sort: baseInfo.sort,
        order: baseInfo.order,
        request_desc: baseInfo.searchMsg,
        template_id: baseInfo.templateId||-1,
        init_start_time:baseInfo.init_start_time,
        init_end_time:baseInfo.init_end_time,
        op_start_time:baseInfo.op_start_time,
        op_end_time:baseInfo.op_end_time,
        initValue:baseInfo.initValue,
        time: new Date().getTime(),
  }

return axios.post(baseUrl+'/bpm/v95/psn-search/selfprocess',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}
//流程 抄送列表
export const getWFCCListAjax = function(data){
  let param = {
          folder: data.folder,
          group_id: data.groupId||-1,
          num_per_page: data.rows,
          page: data.page,
          request_desc: data.searchMsg,
          sortCol:data.sort,
          sortDir:data.order,
          cc_user:data.cc_user,
          cc_start_time:data.assign_start_time,
          cc_end_time:data.assign_end_time,
          time:new Date().getTime()
  }
  return axios.post(baseUrl+'/bpm/v95/psn-search/cc',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}



export const getRoleExistsUnionRef = function(role){
    return axios.get(baseUrl+'/org/user/personal/role/is-exists-anyone-or-admin',{
      params:{
            'role-def':role,
             time:new Date().getTime()
        },
        paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    })
}

//是否开启了分级管控
export const isFacadeBranchOrg = function(){
  return axios.get(baseUrl+'/bpm/v95/facade/branch-org',{
      params: {
         time:new Date().getTime()
      }
  });
}


/*获取全局配置*/
export const getPublicSettingUnion = function(){
  return axios.get(baseUrl+'/public/setting/union',{
      params:{
          time: new Date().getTime(),
      }
  })
}

export const goEESSO = function(eeTarget){
  return axios.get(baseUrl+'/hzbank/ee-sso',{
      params:{
          eeTarget:eeTarget,
          time: new Date().getTime(),
      }
  })
}


export const getControlPageList = function(){
  return axios.get(baseUrl+'/hzbank/app-link',{
      params:{
          time: new Date().getTime(),
      }
  })
}

//项目首页选择
export const projectHomeList = function(){
  return axios.get(baseUrl+'/extend/faw/pm/info-home-list',{
  });
}

//项目默认首页
export const projectDefaultHome = function(){
  return axios.get(baseUrl+'/extend/faw/pm/info-default-home',{
  });
}
//项目数据列表
export const projectList = function(params){
    return axios.get(baseUrl+'/extend/faw/pm/info-rows',{
        params
    });
}
//项目风险列表
export const projectRiskList = function(params){
    return axios.get(baseUrl+'/extend/faw/pm/home-risk-rows',{
        params
    });
}
//项目问题列表
export const projectProblemList = function(params){
    return axios.get(baseUrl+'/extend/faw/pm/home-problem-rows',{
        params
    });
}
//项目计划预览
export const projectMilesShow = function(params){
    return axios.get(baseUrl+'/extend/faw/pm/info-miles-show',{
        params
    });
}
//项目任务
export const projectWorkTaskList = function(params){
    return axios.get(baseUrl+'/extend/faw/pm/work-task-rows',{
        params:params,
        paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    });
}
//项目动态
export const projectProgressList = function(params){
  return axios.get(baseUrl+'/extend/faw/pm/progress-rows',{
      params
  });
}
//项目  显示通知列表
export const getTaskNoticeList = function(params){
  if(params.click == '-1'){
    delete params.click;
  }
  return axios.get(baseUrl+'/extend/faw/pm/notice-rows',{
      params
  });
}
//项目  通知已读
export const readNoticeInfo = function(id){
  return axios.get(baseUrl+'/extend/faw/pm/notice-click',{
    params:{
      id:id
    }
  });
}
//点击代办任务列
export const projectTaskDoUrl = function(id){
    return axios.get(baseUrl+'/extend/faw/pm/task-do',{
      params:{
        id:id
      }
    });
}
//流程模板统计
export const getWorkflowInitCount = function(num){
  return axios.get(baseUrl+'/bpm/v95/portal/workflow-init-count',{
        params:{
            num:num,
            time: new Date().getTime(),
        }
    }
  )
}

//
export const getWorkflowTaskStatusCount = function(num){
  return axios.get(baseUrl+'/bpm/v95/portal/task-status-count',{
        params:{
            time: new Date().getTime(),
        }
    }
  )
}


/*初始化启动流程*/
export const initWFAjax = function(map_id){
  let _data = {};
  _data.map_id = map_id;
  _data.ajaxTime = new Date().getTime();
  return axios.post(baseUrl+'/bpm/v95/process/workflow-init',qs.stringify(_data,{arrayFormat:'repeat'}),{traditional:true});
}


export const getAllCity = function(){
      let url = '/assets/json/citydata.json';
      return axios.get(url,{
          params:{
              time:new Date().getTime()
          }
      })
}


export const getWeatherByCityCode = function(code){
    return axios.get('http://wthrcdn.etouch.cn/weather_mini',{
        params:{
            citykey:code,
            time:new Date().getTime()
        }
    })
}



export const getNewsList = function(data){
    return axios.get(baseUrl+'/portal/pub-notice/port/pagination',{
        params:{
            rows:data.rows,
            page:data.page,
            type:data.type,
            time:new Date().getTime()
        }
    })
}
//获取验证码
export const captchaFetch = function(requestToken){
  return axios.get(baseUrl+'/public/helper/captcha/fetch',{
      params: {
        requestToken,
        time:new Date().getTime()
      }
  });
}

//南宁
//获取会议列表
export const getMeetingOrderAjax = function(data){
  return axios.get(baseUrl+'/oa/meeting/home-meeting-calendar-rows',
    // qs.stringify({homeMeeting: false})
    {
      params:{
        homeMeeting: true, //是否是首页
        today: data
      }
    }
  )
}

//点击修改查看状态
export const modMeetingStauts = function(id){
  return axios.post(baseUrl+'/oa/meeting/home-meeting-link-click',qs.stringify({
      id:id,
      time:new Date().getTime()
  }),{traditional:true});
}

//获取基础数据
export const getEnumSelectEnabled = function(id,action='select-enabled'){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/'+action,{
    params:{
      time:new Date().getTime()
    }
  })
}

