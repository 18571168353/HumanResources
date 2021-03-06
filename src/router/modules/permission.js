// 员工的路由规则

import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission', // 路由地址
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      name: 'permissions',
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
