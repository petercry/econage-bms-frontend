import axios from 'axios'
import {baseUrl} from '@/modules/meeting/config/env'
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
      window.parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
      window.parent.window.sysvm.logout();
    } else if (err.response.status==500){
      window.parent.window.sysvm.$message.error({
        showClose: true,
        message: err.response.data,
        type: 'error'
      })
    }else{
      window.parent.window.sysvm.$message.error({
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
      password:'Zj123456!',
      time:new Date().getTime()
  }),{traditional:true});
}



// 获取uid
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

// 根据id获取文件列表
export const getFileListByModular = function(modular,modularInnerId){
  return axios.get(baseUrl + '/file-manager/info/modular/' + modular,{
      params:{
          modularInnerId:modularInnerId,
          time:new Date().getTime()
      }
  })
}




// 获取会议室列表
export const getRoomListAjax = function(data){
  return axios.get(baseUrl+'/oa/conference-room/pagination',{
    params:{
      createDateFrom:data.createDateFrom,
      createDateTo:data.createDateTo,
      name:data.name,
      page:data.page,
      rows:data.rows,
      order:data.order,
      sort:data.sort,
      // dropDeptFilter : true,
      time:new Date().getTime()
    }
  })
}

// 新增会议室
export const addMeetRoomAjax = function(data){
  return axios.post(baseUrl+'/oa/conference-room/add-single',{
      id:data.id,
      catId:data.catId,
      name:data.name,
      catId:data.catId,
      building:data.building,
      intention:data.intention,
      desc:data.desc,
      comments:data.comments,
      wfRelated:data.wfRelated,
      wfTemplateId:data.wfTemplateId,
      sequence:data.sequence,
      belongDepts:data.belongDepts,
      time:new Date().getTime()
  });
}



export const updateMeetRoomAjax = function(data){
  return axios.put(baseUrl+'/oa/conference-room/update-single',{
      id:data.id,
      catId:data.catId,
      name:data.name,
      building:data.building,
      intention:data.intention,
      desc:data.desc,
      comments:data.comments,
      wfRelated:data.wfRelated,
      wfTemplateId:data.wfTemplateId,
      sequence:data.sequence,
      belongDepts:data.belongDepts,
      time:new Date().getTime()
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true
  })
}

// 删除会议室
export const deleteMeetingRoomAjax = function(ids){
    return axios.delete(baseUrl+'/oa/conference-room/delete',{
      params:{
          'ids':ids,
          time:new Date().getTime()
        },
        paramsSerializer: function(params) {
          return qs.stringify(params, {arrayFormat: 'repeat'})
        },
    },{traditional:true})
}

// 查询单个会议室信息
export const getRoomSingleAjax = function(id){
  return axios.get(baseUrl+'/oa/conference-room/select-by-id',{
    params:{
      id:id,
      fillFullInfo:true,
      time:new Date().getTime()
    }
  })
}

// 获取图形化预约数据
export const getGanttInfoAjax = function(data){
    return axios.get(baseUrl+'/oa/conference/pagination',{
        params:{
          filterWfStatusAvailable:data.filterWfStatusAvailable,
          catId:data.catId,
          endDateFrom:data.endDateFrom,
          startDateTo:data.startDateTo,
          time:new Date().getTime()
        }
    })
}




// 获取资源列表
export const getCatList = function(data){
  return axios.get(baseUrl+'/oa/conference/catId-enum',{
      params:{
          time:new Date().getTime()
      }
  })
}

//获取通知类型
export const getNoticeFormEnum = function(data){
  return axios.get(baseUrl+'/oa/conference/noticeForm-enum',{
      params:{
          time:new Date().getTime()
      }
  })
}

//获取基础数据
export const getEnumSelectEnabled = function(id){
  return axios.get(baseUrl+'/basic/kv/group/'+id+'/detail/select-enabled',{
    params:{
        time:new Date().getTime()
    }
  })
}



// get 获取流程模板
export const getWFTemplatesAjax = function(groupId,subGroupId){
    let param = {
        time:new Date().getTime(),
        group_id:groupId,
        sub_group_id:subGroupId||-1,
    }
    return axios.post(baseUrl+'/bpm/v95/model/workflow/list',qs.stringify(param,{arrayFormat:'repeat'}),{traditional:true});
}




//获取会议列表
export const getMeetingOrderAjax = function(data){
    return axios.get(baseUrl+'/oa/conference/pagination',{
        params:{
            filterWfStatusAvailable:data.filterWfStatusAvailable,
            catId:data.catId,
            name:data.name,
            roomName:data.roomName,
            createDateFrom:data.createDateFrom,
            createDateTo:data.createDateTo,
            startDateFrom:data.startDateFrom,
            startDateTo:data.startDateTo,
            endDateFrom:data.endDateFrom,
            endDateTo:data.endDateTo,
            page:data.page,
            rows:data.rows,
            order:data.order,
            sort:data.sort,
            time:new Date().getTime()
        }
    })
}




export const getRoomAvaiableSelectListAjax = function(data){
  return axios.get(baseUrl+'/oa/conference-room/pagination',{
      params:{
          filterAvailable:data.filterAvailable,
          catId4Available:data.catId4Available,
          startTime4Available:data.startTime4Available,
          endTime4Available:data.endTime4Available,
          editId4Available:data.editId4Available,
          page:data.page,
          rows:data.rows,
          order:data.order,
          sort:data.sort,
          time:new Date().getTime()
      }
  })
}


export const addMeetingAjax = function(data,confereeExternals){
    return axios.post(baseUrl+'/oa/conference/add-single',{
          id:data.id,
          catId:data.catId,
          name:data.name,
          startTime:data.startTime,
          endTime:data.endTime,
          roomId:data.roomId,
          roomName:data.roomName,
          desc:data.desc,
          noticeOrNot:data.noticeOrNot,
          noticeWay:data.noticeWay,
          character:data.character,
          conferees:data.conferees,
          hostLinkId:data.hostLinkId,
          hostName:data.hostName,
          confereeExternals:confereeExternals,
          time:new Date().getTime()
    },{headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional:true})
}


// 获取图形化预约数据
export const getMeetingSingleAjax = function(data){
    return axios.get(baseUrl+'/oa/conference/select-by-id',{
        params:{
            id:data.id,
            fillFullInfo:data.fillFullInfo,
            time:new Date().getTime()
        }
    })
}

export const updateMeetingAjax = function(data,confereeExternals){
  return axios.put(baseUrl+'/oa/conference/update-single',{
        id:data.id,
        catId:data.catId,
        name:data.name,
        startTime:data.startTime,
        endTime:data.endTime,
        roomId:data.roomId,
        roomName:data.roomName,
        desc:data.desc,
        noticeOrNot:data.noticeOrNot,
        noticeWay:data.noticeWay,
        character:data.character,
        conferees:data.conferees,
        hostLinkId:data.hostLinkId,
        hostName:data.hostName,
        confereeExternals:confereeExternals,
        time:new Date().getTime()
  },{headers: {'Content-Type': 'application/json;charset=UTF-8'},traditional:true})
}

// 删除会议室
export const deleteMeetingAjax = function(ids){
  return axios.delete(baseUrl+'/oa/conference/delete',{
    params:{
          'ids':ids,
          time:new Date().getTime()
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
  },{traditional:true})
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


export const getMemberTextShow = function(_initDataList){
    return axios.post(baseUrl+'/org/tree-select/member-text-show',_initDataList,{
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        traditional:true
    })
}
