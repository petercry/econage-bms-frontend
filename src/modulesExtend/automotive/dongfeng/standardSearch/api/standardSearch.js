import request from '../utils/request'
import { baseUrl } from '../config/env'
import qs from 'qs'

// 查询目录树
export const searchTree = function () {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/catalog/tree',
    method: 'GET',
  })
}
// 查询标准文件列表
export const searchList = function (info, params, parentId) {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/catalog/list',
    method: 'GET',
    params: {
      ...info,
      ...params,
      parentId
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 全文检索
export const searchAllText = function (info, params,parentId) {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/full-text',
    method: 'GET',
    params: {
      ...info,
      ...params,
      parentId
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//导出excel-export
export const getExport = function (params) {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/catalog/list/download-excel',
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
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

//获取标准分类
export const getEnumSelectEnabled = function () {
  return request({
    url: '/basic/kv/group/esProgramClass/detail',
    method: 'get',
  })
}

//查询-标准制修订
export const selectCommon = function (id) {
  return request({
    url: '/dongfeng/doc-base/file/single/details',
    method: 'get',
    params: {
      id
    }
  })
}

// 获取操作记录列表
export const getOperateRecord = function (entryId, info) {
  return request({
    url: '/dongfeng/doc-base/op-history/list/select',
    method: 'get',
    params: {
      entryId,
      ...info
    }
  })
}

//新增标准卡片评论
export const addComment = function (masterId, content) {
  return request({
    url: '/dongfeng/doc-base/remark/single/create',
    method: 'POST',
    data: {
      masterId,
      content
    }
  })
}

//新增标准卡片评论
export const deleteComment = function (id) {
  return request({
    url: '/dongfeng/doc-base/remark/single/delete',
    method: 'POST',
    params: {
      id
    }
  })
}
//查询标准卡片评论列表
export const commentList = function (info, masterId) {
  return request({
    url: '/dongfeng/doc-base/remark/list/select',
    method: 'GET',
    params: {
      ...info,
      masterId,
    }
  })
}

// 查询标准文件列表
export const getDraw = function (info, params, parentId) {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/catalog/list',
    method: 'GET',
    params: {
      ...info,
      ...params,
      parentId
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

//查询-标准分类
export const getStdCategory = function (parentId) {
  return request({
    url: '/basic/tree-kv/group/select-enabled',
    method: 'get',
    params: {
      parentId
    }
  })
}

//获取规划来源
export const getSource = function () {
  return request({
    url: 'basic/kv/group/esProgramSource/detail',
    method: 'GET',
  })
}

//标准引用图纸查询
export const getStarchDraw = function (info,params) {
  return request({
    url: '/dongfeng/stdlifecycle/std-search/draw-refer-list',
    method: 'GET',
    params:{
      ...info,
      ...params
    }
  })
}

//获取有效性
export const getYouXX= function () {
  return request({
    url: '/basic/kv/group/YouXX/detail',
    method: 'GET'
  })
}


// 查询目录树
export const searchGuideTree = function () {
  return request({
    url: '/df/business/guide/manage/catalog/tree',
    method: 'GET',
  })
}