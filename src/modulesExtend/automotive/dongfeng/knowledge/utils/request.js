import axios from 'axios'
import { Message } from 'element-ui'
import {baseUrl} from '../config/env'
import {EcoUtil} from '@/components/util/main.js'
import token from '@/common/token.js';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 创建axios实例
const service = axios.create({
  baseURL: baseUrl, // api 的 base_url
  timeout: 5000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  config => {
    NProgress.start()
    if(EcoUtil.requestCheckByWhiteList(config.url) && token.getToken() && token.getToken() != "null"){
      config.headers['eco-auth-token'] = token.getToken();
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    NProgress.done()
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    
    if(( res.status && (res.status >= 100 && res.status != 301 && res.status != 400)) || (res.hasOwnProperty("success") && res.success == false)){
      Message({
        message: res.msg || res.msgDesc,
        type: 'warning',
        showClose: true,
        duration:2000,
        customClass:'design-from-el-message'
      });
      return Promise.reject('error')
    }
    NProgress.done()
    return response.data
  },
  err => {
    if (err && err.response) {
      NProgress.done()
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
  
      try{
          if( parent.window.sysvm){
              parent.window.sysvm.$message.error({
                  showClose: true,
                  message:  err.message,
                  type: 'error'
              })
          }else{
            Message({
              showClose: true,
              message:  err.message,
              type: 'error'
          });
          }
      }catch(e){
        Message({
          showClose: true,
          message:  err.message,
          type: 'error'
      });
    }
    return Promise.reject(err)
  }
})

export default service
