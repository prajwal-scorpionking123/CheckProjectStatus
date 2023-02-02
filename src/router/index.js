import ProjectStatus from '../views/projectstatus.vue'

import { createRouter, createWebHashHistory } from 'vue-router'


export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'ProjectStatus',
      component: ProjectStatus
    }
  ],
})