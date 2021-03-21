// 员工的路由规则

import Layout from '@/layout'
export default {
  // 路由规则
  path: '/attendances', // 路由地址
  name: 'attendances',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }
    }
  ]
}
