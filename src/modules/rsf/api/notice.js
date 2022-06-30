import request from '../utils/request'
import qs from 'qs';

// 获取我收到的列表
export const getReceiveList = function (data, info) {
  return request({
    url: '/pubinf/notice/list/receive',
    method: 'get',
    params: {
      title: data.title,
      senderId: data.sender,
      dateFrom: data.start_date,
      dateTo: data.end_date,
      page: info.page,
      rows: info.rows,
      sort: data.sort,
      order: data.order,
      type:data.type,
      readFilter:data.readFlag
    },
  })
}
// 获取通知详情
export const getNoticeDetail = function (id) {
  return request({
    url: '/pubinf/notice',
    method: 'get',
    params: {
      id
    },
  })
}

// 添加公告
export const addNotice = function (data) {
  return request({
    url: '/pubinf/notice',
    method: 'post',
    data: data
  })
}
// 更新公告
export const updateNotice = function (data) {
  return request({
    url: '/pubinf/notice',
    method: 'patch',
    data: data
  })
}

// 获取文件
export const getFileListByModularInnerId = function (modular, modularInnerId) {
  return request({
    url: '/file-manager/info/modular/' + modular,
    params: {
      modularInnerId: modularInnerId,
    }
  })
}
// 获取我发起的列表
export const getSendedList = function (data,info) {
  return request({
    url: '/pubinf/notice/list/send',
    method: 'get',
    params: {
      title: data.title,
      senderId: data.sender,
      dateFrom: data.start_date,
      dateTo: data.end_date,
      page: info.page,
      rows: info.rows,
      sort: data.sort,
      order: data.order,
      type:data.type
    },
  })
}

// 批量作废
export const deleteNotices= function (id) {
  return request({
    url: '/pubinf/notice/batch',
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
// 批量置顶
export const setNoticesTop= function (id) {
  return request({
    url: '/pubinf/notice/topflag/add',
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
// 取消置顶
export const cancelNoticesTop= function (id) {
  return request({
    url: '/pubinf/notice/topflag/cancel',
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
// 获取已作废列表
export const getInvalidList = function (data,info) {
  return request({
    url: '/pubinf/notice/recycle/list',
    method: 'get',
    params: {
      title: data.title,
      senderId: data.sender,
      dateFrom: data.start_date,
      dateTo: data.end_date,
      page: info.page,
      rows: info.rows,
      sort: data.sort,
      order: data.order,
      type:data.type
    },
  })
}
// 批量恢复
export const enableValidNotice= function (id) {
  return request({
    url: '/pubinf/notice/recycle/recovery-batch',
    method: 'post',
    data:id
  })
}

// 获取阅读树子节点列表
export const readRecordList = function (id,parentId) {
  return request({
    url: '/pubinf/notice/tree/read-record-list',
    method: 'get',
    params: {
      id:id,
      parentId:parentId
    },
  })
}
