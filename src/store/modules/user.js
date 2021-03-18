import { getToken, setToken, removeToken } from '@/utils/auth'
import login from '@/api/user'
// 放置状态
const state = {
  token: getToken() // 设置token 初始化vuex的时候就从缓存中读取
}
// 修改状态
const mutations = {
  setToken(seate, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null // 将vuex中数据置空
    removeToken() // 同步给缓存
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数,调用action时,传递过来的参数
  async login(context, data) {
    const result = await login(data) // 得到的是一个promise relust就是结果
    if (result.data.success) {
      // 如果登录接口调用成功,就证明登录信息成功
      // 修改state必须通过mutation
      context.commit('setToken', result.data.data)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
