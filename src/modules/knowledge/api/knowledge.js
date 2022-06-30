import request from '../utils/request'
import qs from 'qs';

//创建知识库
export const createKnowledgeLib = function (data) {
  return request({
    url: '/file-base/base',
    method: 'post',
    data: data,
  })
}
// 编辑知识库
export const updateKnowledgeLib = function (data) {
  return request({
    url: '/file-base/base',
    method: 'patch',
    data: data,
  })
}

// 删除知识库
export const deleteKnowledgeLib = function (id) {
  return request({
    url: 'file-base/base',
    method: 'delete',
    params: {
      id
    }
  })
}


// 查询知识库列表

export const getKnowledgeLibCard = function () {
  return request({
    url: '/file-base/base/list',
    method: 'get',
  })
}

// 查询知识库详情
export const getKnowledgeLibDetail = function (id) {
  return request({
    url: '/file-base/base',
    method: 'get',
    params: {
      id
    }
  })
}
// 查询树形顶层结点信息
export const getOriginTreeNodeInfo = function (baseId) {
  return request({
    url: '/file-base/entry/folder/tree/top-struct',
    method: 'get',
    params: {
      baseId
    }
  })
}
// 展开节点
export const expandTreeNode = function (baseId, parentId) {
  return request({
    url: '/file-base/entry/folder/tree/expend-by-parent',
    method: 'get',
    params: {
      baseId,
      parentId
    }
  })
}
// 新建文件夹
export const createFolder = function (data) {
  return request({
    url: '/file-base/entry/folder',
    method: 'post',
    data: data
  })
}
// 获取文件夹详情
export const getFolderDetail = function (id) {
  return request({
    url: '/file-base/entry/folder',
    method: 'get',
    params: {
      id
    }
  })
}

// 更新文件夹
export const updateFolder = function (data) {
  return request({
    url: '/file-base/entry/folder',
    method: 'patch',
    data: data
  })
}

// 上传文档
export const uploadFile = function (data) {
  return request({
    url: '/file-base/entry/file',
    method: 'post',
    data: data
  })
}

// 查询知识库信息(列表展示)
export const getKnowledgeLibList = function (baseId, parentId, info) {
  return request({
    url: '/file-base/entry/list',
    method: 'get',
    params: {
      baseId,
      parentId,
      page: info.page,
      rows: info.rows
    }
  })
}
// 获取文件详情信息
export const getFileDetail = function (id) {
  return request({
    url: '/file-base/entry/file',
    method: 'get',
    params: {
      id
    }
  })
}

// 更新文件
export const updateFile = function (data) {
  return request({
    url: '/file-base/entry/file',
    method: 'patch',
    data: data
  })
}

// 添加下载记录
export const addDownloadRecord = function (data) {
  return request({
    url: '/file-base/opr-his/record/download/' + data,
    method: 'post',
  })
}

// 添加阅读记录
export const addReadRecord = function (data) {
  return request({
    url: '/file-base/opr-his/record/read/' + data,
    method: 'post',
  })
}

// 批量删除
export const deleteFolderOrFile = function (id) {
  return request({
    url: '/file-base/entry/delete-batch',
    method: 'delete',
    params: {
      ids: id
    },
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

// 排序
export const sortFolderChild = function (id) {
  return request({
    url: '/file-base/entry/update-order',
    method: 'patch',
    params: {
      ids: id
    },
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

// 获取操作记录列表
export const getOperateRecord = function (id) {
  return request({
    url: '/file-base/opr-his/list'+'/'+id,
    method: 'get',
  })
}

// 搜素名称
export const getListDataByName = function (baseId,parentId,info,name) {
  return request({
    url: '/file-base/entry/list/recursive',
    method: 'get',
    params:{
      baseId,
      parentId,
      page: info.page,
      rows: info.rows,
      name:name
    }
  })
}
