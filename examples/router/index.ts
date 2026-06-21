import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/pro-form/basic',
      name: 'ProFormBasic',
      component: () => import('../views/pro-form/basic/index.vue'),
    },
    {
      path: '/dialog-form/basic',
      name: 'DialogFormBasic',
      component: () => import('../views/dialog-form/basic/index.vue'),
    },
    {
      path: '/pro-table/basic',
      name: 'ProTableBasic',
      component: () => import('../views/pro-table/basic/index.vue'),
    },
    {
      path: '/editable-pro-table/basic',
      name: 'EditableProTableBasic',
      component: () => import('../views/editable-pro-table/basic/index.vue'),
    },
    {
      path: '/',
      redirect: '/pro-form/basic',
    },
  ],
})
