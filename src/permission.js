// 权限拦截 导航守卫 路由守卫
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 定义一个白名单
// 前置路由
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 如果有token
  if (store.getters.token) {
    // 如果访问的是登录页
    if (to.path === '/login') {
      // 直接跳到主页
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      // 否则直接放行
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果访问的是白名单里面的内容 直接放行
      next()
    } else {
      // 如果不是,跳到登录页
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置路由
router.afterEach(() => {
  NProgress.done()
})
