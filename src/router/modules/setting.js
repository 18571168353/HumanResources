// 员工的路由规则

import Layout from '@/layout'
export default {
  // 路由规则
  path: '/setting', // 路由地址
  name: 'settings',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/setting'),
      name: 'setting',
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
