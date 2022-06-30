import request from '../utils/request'
import qs from 'qs';

//创建知识库
export const createKnowledgeLib = function (data) {
  return request({
    url: '/dongfeng/doc-base/base/single/create',
    method: 'post',
    data: data,
  })
}
// 编辑知识库
export const updateKnowledgeLib = function (data) {
  return request({
    url: '/dongfeng/doc-base/base/single/update',
    method: 'post',
    data: data,
  })
}

// // 删除知识库
// export const deleteKnowledgeLib = function (id) {
//   return request({
//     url: 'file-base/base',
//     method: 'delete',
//     params: {
//       id
//     }
//   })
// }
// 失效知识库
export const deleteKnowledgeLib = function (id) {
  return request({
    url: '/dongfeng/doc-base/base/single/invalid?id='+id,
    method: 'post',
  })
}
// 查询知识库列表
export const getKnowledgeLibCard = function (params) {
  return request({
    url: '/dongfeng/doc-base/base/list/select',
    method: 'get',
    params
  })
}
// 查询知识库详情
export const getKnowledgeLibDetail = function (id) {
  return request({
    url: '/dongfeng/doc-base/base/single/select',
    method: 'get',
    params: {
      id
    }
  })
}
// 新建文件夹
export const createFolder = function (data) {
  return request({
    url: '/dongfeng/doc-base/dir/single/create',
    method: 'post',
    data: data
  })
}
// 更新文件夹
export const updateFolder = function (data) {
  return request({
    url: '/dongfeng/doc-base/dir/single/update',
    method: 'POST',
    data: data
  })
}
// 获取文件夹详情
export const getFolderDetail = function (id) {
  return request({
    url: '/dongfeng/doc-base/dir/single/details',
    method: 'get',
    params: {
      id
    }
  })
}

// 查询文件夹树
export const getOriginTreeNodeInfo = function (baseId) {
  return request({
    url: '/dongfeng/doc-base/search/tree/dir',
    method: 'get',
    params: {
      baseId
    }
  })
}

// 递归查询文件列表（分页）
export const ReSelectFileList = function (baseId, parentId,info) {
  return request({
    url: '/dongfeng/doc-base/search/file/recursively',
    method: 'get',
    params: {
      baseId,
      parentId,
      ...info
    }
  })
}

// 查询直接列表（分页）
export const getKnowledgeLibList = function (baseId, parentId, info) {
  return request({
    url: '/dongfeng/doc-base/search/list/directly',
    method: 'get',
    params: {
      baseId,
      parentId,
      ...info
    }
  })
}

// 批量删除
export const deleteFolderOrFile = function (ids,baseId) {
  return request({
    url: '/dongfeng/doc-base/dir/list/delete?' + ids,
    method: 'post',
    data: {
      // ids,
      baseId
    },
    // paramsSerializer: params => {
    //   return qs.stringify(params, {
    //     indices: false
    //   })
    // }
  })
}

// // 排序
// export const sortFolderChild = function (id) {
//   return request({
//     url: '/file-base/entry/update-order',
//     method: 'patch',
//     params: {
//       ids: id
//     },
//     paramsSerializer: params => {
//       return qs.stringify(params, {
//         indices: false
//       })
//     }
//   })
// }

// 获取操作记录列表
export const getOperateRecord = function (entryId,info) {
  return request({
    url: '/dongfeng/doc-base/op-history/list/select',
    method: 'get',
    params:{
      entryId,
      ...info
    }
  })
}

// // 搜素名称
// export const getListDataByName = function (baseId,parentId,info,name) {
//   return request({
//     url: '/file-base/entry/list/recursive',
//     method: 'get',
//     params:{
//       baseId,
//       parentId,
//       page: info.page,
//       rows: info.rows,
//       name:name
//     }
//   })
// }

// 查询节点路径
export const getPath = function (id) {
  return request({
    url: '/dongfeng/doc-base/search/path',
    method: 'get',
    params:{
     id
    }
  })
}