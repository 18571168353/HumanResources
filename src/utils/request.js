import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token
    if (store.getters.token) {
      // 只有在有token的情况下才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('login')
        return Promise.reject(new Error('token超时了'))
      }
      // 在header里注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message, data } = response.data
    // 根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      Message.error(message) // 提示错误信息
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // error 信息 里面 response的对象
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message)
    } // 提示错误信息
    return Promise.reject(error)
  }
)
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timestamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service
