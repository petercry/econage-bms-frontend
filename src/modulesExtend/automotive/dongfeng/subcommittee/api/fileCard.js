import request from '../utils/request'
import qs from 'qs';

//新增-标准制修订
export const newAddCommon = function (baseId,data) {
  return request({
    url: '/dongfeng/doc-base/file/single/create?baseId='+ baseId,
    method: 'post',
    data,
  })
}
//更新-标准制修订
export const editCommon = function (baseId,data) {
  return request({
    url: '/dongfeng/doc-base/file/single/update?baseId='+ baseId,
    method: 'post',
    data,
  })
}
//查询-标准制修订
export const selectCommon = function (id) {
  return request({
    url: '/dongfeng/doc-base/file/single/details',
    method: 'get',
    params:{
        id
    }
  })
}
//查询-标准分类
export const getStdCategory = function (parentId) {
  return request({
    url: '/basic/tree-kv/group/select-enabled',
    method: 'get',
    params:{
      parentId
    }
  })
}
//查询-部门/科室
export const getDept = function () {
  return request({
    url: '/org/dept/single?deptId=1429355376020172803',
    method: 'get',
  })
}
//查询-科室
export const getOffice = function () {
  return request({
    url: '/org/dept/single?deptId=1429355562368905218',
    method: 'get',
 
  })
}
//查询-专业领域
export const getSupplementaryCode = function () {
  return request({
    url: 'basic/tree-kv/group/select-enabled?parentId=ZYLY',
    method: 'get',
 
  })
}

//查询-分标委列表
export const getSubcommittee = function (params) {
  return request({
    url: '/dongfeng/sub-std-committee/list/select',
    method: 'get',
    params
  })
}
//新增-分标委添加
export const subcommitteeAdd = function (data) {
  return request({
    url: '/dongfeng/sub-std-committee/single/create',
    method: 'post',
    data
  })
}
//更新-分标委更新
export const subcommitteeEdit = function (data) {
  return request({
    url: '/dongfeng/sub-std-committee/single/update',
    method: 'post',
    data
  })
}
//查询-分标委详情
export const subcommitteeDetail = function (id) {
  return request({
    url: '/dongfeng/sub-std-committee/single/select',
    method: 'get',
    params:{
      id
    }
  })
}
//批量失效-分标委删除
export const subcommitteeDelete = function (ids) {
  return request({
    url: '/dongfeng/sub-std-committee/list/invalid?'+ids,
    method: 'post',
  })
}

