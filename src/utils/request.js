import { Message } from 'element-ui'
import axios from 'axios'
import store from '@/store'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token
    if (store.getters.token) {
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
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error)
  }
)
export default service
