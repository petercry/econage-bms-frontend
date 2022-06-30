import router from './router/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import token from '@/common/token.js';
NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (token.getToken()) {
      next()
      NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
