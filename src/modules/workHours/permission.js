import router from './router/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import token from '@/common/token.js';
import {sysEnv} from './config/env'
NProgress.configure({ showSpinner: false })// NProgress configuration

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (token.getToken()) {
      if(Object.keys(store.getters.userInfo).length !== 0){
        next()
        NProgress.done()
      }else{
        //如果没有用户信息，先获取
        store.dispatch('setUserInfo').then(res => {
          next()
        })
      }

  } else {
    if(sysEnv == 1){
      window.location = "/login";
    }

  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
