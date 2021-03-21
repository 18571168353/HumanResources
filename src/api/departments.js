import request from '@/utils/request'

// 获取组织架构的列表数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
