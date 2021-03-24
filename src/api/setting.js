import request from '@/utils/request'
/* 获取角色列表信息 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 查询企业的基本信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
// 根据ID删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
