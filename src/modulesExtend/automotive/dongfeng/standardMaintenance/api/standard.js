import request from '../utils/request'
import {baseUrl} from '../config/env'
import axios from 'axios'
import { Form } from 'element-ui'
import qs from 'qs'
//新增-外来标准
export const newAddOutside = function (data,parentId) {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/single/create',
    method: 'post',
    data,
    params:{
      parentId
    }
  })
}
//更新-外来标准
export const editOutside = function (baseId,data) {
  return request({
    url: '/dongfeng/doc-base/file/single/update?baseId='+ baseId,
    method: 'post',
    data,
  })
}
//批量删除-外来标准
export const deleteOutside = function (ids) {
  return request({
    url:'/dongfeng/stdlifecycle/external-std/list/delete',
    method: 'post',
    params:{
      ids
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
  }
  })
}
//查询-外来标准
export const outSideDetails = function (id) {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/single/select',
    method: 'get',
    params:{
        id
    }
  })
}
//查询-外来标准列表
export const selectOutsideList = function (info,from) {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/list/select',
    method: 'get',
    params:{
      ...info,
      ...from
    }
  })
}
//解析Excel
export const outsideExcel = function (excel) {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/excel/parse',
    method: 'POST',
    headers:{
      'Content-Type': 'multipart/form-data'
    },
    data:{
      excel
    }
  })
}
// 导入
export const orgExcelImport = function(){
  return baseUrl+'/dongfeng/stdlifecycle/external-std/excel/parse'
}
// 导入
export const orgExcelImport1 = function(){
  return baseUrl+'/dongfeng/stdlifecycle/external-std/upload/files'
}

//批量上传文件
export const uploadMul = function (excel,fileList,parentId) {
  let param = new window.FormData();
  param.append("time",new Date().getTime());
  param.append("excel",excel,excel.name);
  for(let i = 0;i < fileList.length;i++){
      param.append('files',fileList[i].raw,fileList[i].raw.name);
  }
  // console.log(param,"11")
  return request({
    url: '/dongfeng/stdlifecycle/external-std/upload/files',
    method: 'post',
    headers:{
      'Content-Type':'multipart/form-data'
    },
    traditional:true,
    data:param,
    params:{
      parentId
    }
  })
    // let param = new window.FormData();
    // param.append("time",new Date().getTime());
    // param.append("excel",excel,excel.name);
    // for(let i = 0;i < fileList.length;i++){
    //     param.append('files',fileList[i].raw,fileList[i].raw.name);
    // }
    // let config = {
    //     headers:{'Content-Type':'multipart/form-data'},
    //     traditional:true
    // };  //添加请求头
    // let url = baseUrl+'/dongfeng/stdlifecycle/external-std/upload/files';
    // return axios.post(url,param,config);
}
//导出Excel
export const downloadExcel = function () {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/excel/download',
    method: 'post',
    responseType: 'blob',
  })
}
//导出标准模板
export const downloadTemplate = function () {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/excel/template',
    method: 'get',
    responseType: 'blob',
  })
}

//导出匹配结果
export const downloadResult = function (infoList,fileList) {
  return request({
    url: '/dongfeng/stdlifecycle/external-std/excel/compare-result',
    method: 'post',
    responseType: 'blob',
    data:{
      infoList,
      fileList
    }
  })
}

// 获取uid
export const getItemFetchId = function () {
  return request({
    url: '/fetch-uid',
    method: 'get',
    params: {
      time: new Date().getTime()
    },
    transformResponse: [function (data) {
      return data;
    }]
  })
}
//获取有效性
export const getYouXX= function () {
  return request({
    url: '/basic/kv/group/YouXX/detail',
    method: 'get'
  })
}
//获取标准大类
export const getstdCategory= function () {
  return request({
    url: '/basic/tree-kv/group/select-enabled?parentId=WLBZFL',
    method: 'get'
  })
}
//获取标准小类
export const getstdSubCategory= function (parentId) {
  return request({
    url: '/basic/tree-kv/group/create-enabled',
    method: 'get',
    params:{
      parentId
    }
  })
}

//获取制/修订
export const getRevisionType = function () {
  return request({
    url: '/basic/kv/group/1371283282024140801/detail',
    method: 'GET',
  })
}
//制修订审批状态
export const getRevisionStatus = function () {
  return request({
    url: '/df/business/guide/revision/status-enum',
    method: 'GET',
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