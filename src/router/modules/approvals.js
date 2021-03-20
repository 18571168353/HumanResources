// 员工的路由规则

import Layout from '@/layout'
export default {
  // 路由规则
  path: '/approvals', // 路由地址
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批'
      }
    }
  ]
}