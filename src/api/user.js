import request from '@/utils/request'
// 封装登录接口
export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户资料的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户基本信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function getInfo(token) {}

export function logout() {}
