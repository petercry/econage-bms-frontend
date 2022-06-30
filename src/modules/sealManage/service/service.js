import axios from 'axios'
import {baseUrl,sysEnv} from '@/modules/sealManage/config/env'
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
    }
  }
  return Promise.reject(err);
})



export const loginAjax = function(){
  return axios.post(baseUrl+'/login',qs.stringify({
      username:'15869061873',
      password:'1234abcd',
      time:new Date().getTime()
  }),{traditional:true});
}

//获取uid
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
//获取部门机构 选择列表 按父节点查找
export const getOrgDeptSelectList = function(id,data){
  return axios.get(baseUrl+'/org/tree-select/'+id+'/sub',{
    params:{
      selectScope:(data&&data.selectScope)||['DEPT','USER'],
      deptScopeType:(data&&data.deptScopeType)||'BUSINESS',
      time:new Date().getTime()
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    },
  })
}

//人员信息 获取某部门人员列表
export const getUserListInDept= function(deptId){
  return axios.get(baseUrl+'/org/user/config/list-in-dept',{
    params:{
      deptId:deptId,
      time:new Date().getTime()
    }
  })
}

export const getOrgsByOrgIds = function(orgIdArray){
  return axios.get(baseUrl+'/org/tree-select',{
        params:{
            orgIds:orgIdArray.join(','),
            time:new Date().getTime()
        }
    })
}

//签章类别------查询单个签章类别
export const getSealGroupSingle = function(id){
  return axios.get(baseUrl+'/seal/group/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//签章类别列表------查询所有签章类别
export const getSealGroupAll = function(orgId){
  return axios.get(baseUrl+'/seal/group/list',{
    params:{
      orgId:orgId,
      sort:'order',
      order:'asc',
      time:new Date().getTime()
    },
    // data:qs.stringify({ orgId:orgId, time:new Date().getTime() },{arrayFormat:'repeat'}),
    traditional:true,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
}
//签章类别列表------获取未绑定印章的签章类别
export const getSealGroupUnrelated = function(orgId){
  return axios.get(baseUrl+'/seal/group/list/unrelated',{
    params:{
      orgId:orgId,
      time:new Date().getTime()
    },
    // data:qs.stringify({ orgId:orgId, time:new Date().getTime() },{arrayFormat:'repeat'}),
    traditional:true,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
}

//签章类别------添加签章类别
export const addSealGroup= function(data){
  return axios.post(baseUrl+'/seal/group',{
    id:data.id,   
    orgId:data.orgId,   
    name:data.name, 
    order:data.order, 
    valid:data.valid, 
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//签章类别------更新签章类别
export const updateSealGroup= function(data){
  return axios.put(baseUrl+'/seal/group/update',{
    id:data.id,   
    orgId:data.orgId,   
    name:data.name, 
    order:data.order, 
    valid:data.valid, 
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//签章类别------拖拽排序签章类别
export const dndSealGroup= function(id,data){
  return axios.patch(baseUrl+'/seal/group/dnd',qs.stringify({
    sourceId: id,
    targetId: data.targetId,//字符串，目标菜单ID
    point: data.point,//字符串，对应的操作（append：作为放入目标节点子节点；top：与目标节点同级，并前置；bottom：与目标节点同级，并后置）
  },{arrayFormat:'repeat'}),{traditional:true})
}
//签章类别------失效
export const invalidSealGroup= function(id){
  return axios.patch(baseUrl+'/seal/group/invalid',qs.stringify({
    id: id,
  },{arrayFormat:'repeat'}),{traditional:true})
}
// //签章类别------删除签章类别
// export const delSeal = function(id){
//   return axios.delete(baseUrl+'/portal1/title',{
//     params:{
//       id:id,
//       time:new Date().getTime()
//     }
//   })
// }


//签章------查询单个签章
export const getSealSingle = function(id){
  return axios.get(baseUrl+'/seal/detail/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//签章列表------查询所有签章
export const getSealAll = function(orgId){
  return axios.get(baseUrl+'/seal/detail/list',{
    params:{
      orgId:orgId,
      time:new Date().getTime()
    },
    // data:qs.stringify({ orgId:orgId, time:new Date().getTime() },{arrayFormat:'repeat'}),
    traditional:true,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
}

//签章------添加签章
export const addSeal= function(data){
  return axios.post(baseUrl+'/seal/detail',{
    id:data.id,   
    orgId:data.orgId,   
    sealCode:data.sealCode, 
    groupId:data.groupId, 
    manageUser:data.manageUser, 
  },{
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//签章------更新签章
export const updateSeal= function(data){
  return axios.put(baseUrl+'/seal/detail/update',{
    id:data.id,   
    orgId:data.orgId,   
    sealCode:data.sealCode, 
    groupId:data.groupId, 
    manageUser:data.manageUser, 
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//签章------失效
export const invalidSeal= function(id){
  return axios.patch(baseUrl+'/seal/detail/invalid',qs.stringify({
    id: id,
  },{arrayFormat:'repeat'}),{traditional:true})
}



//签章(金格插件)------查询单个签章
export const getSealKgSingle = function(id){
  return axios.get(baseUrl+'/seal/kg/detail/'+id,{
    params:{
      time:new Date().getTime()
    }
  })
}

//签章列表(金格插件)------查询所有签章
export const getSealKgAll = function(orgId){
  return axios.get(baseUrl+'/seal/kg/detail/list',{
    params:{
      orgIds:orgId,
      // sort:'order',
      // order:'asc',
      time:new Date().getTime()
    },
    // data:qs.stringify({ orgId:orgId, time:new Date().getTime() },{arrayFormat:'repeat'}),
    traditional:true,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
}

//签章(金格插件)------添加签章
export const addSealKg= function(data){
  return axios.post(baseUrl+'/seal/kg/detail',{
    id:data.id,   
    orgId:data.orgId,   
    name:data.name, 
    keySn:data.keySn, 
    // sealCode:data.sealCode, 
    // groupId:data.groupId, 
    // manageUser:data.manageUser, 
  },{
  },{
    headers: {'Content-Type': 'application/json;;charset=UTF-8'},
    traditional:true})
}
//签章(金格插件)------更新签章
export const updateSealKg= function(data){
  return axios.put(baseUrl+'/seal/kg/detail/update',{
    id:data.id,   
    orgId:data.orgId,   
    name:data.name, 
    keySn:data.keySn, 
    // sealCode:data.sealCode, 
    // groupId:data.groupId, 
    // manageUser:data.manageUser, 
  },{
    headers: {'Content-Type': 'application/json;charset=UTF-8'},
    traditional:true})
}
//签章(金格插件)------失效
export const invalidSealKg= function(id){
  return axios.patch(baseUrl+'/seal/kg/detail/invalid',qs.stringify({
    id: id,
  },{arrayFormat:'repeat'}),{traditional:true})
}