import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getMoveRoute } from '@/api/user'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export let asyncRoutes = [
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    meta: {
      roles: ['超级管理员', '一般用户']
    },
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function getAsyncRoutes() {
  return new Promise((resolve, reject) => {
    getMoveRoute().then(response => {
      const { data } = response
      asyncRoutes = filterAsyncRoutes(data) // 全部的路由数据
      // console.log(asyncRoutes)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export function getRouter(permission) {
  if (permission.children && permission.children.length > 0) { // 一级菜单Layout
    return {
      path: permission.path,
      component: permission.path,
      children: [{
        path: '',
        component: (resolve) => require([`@/views/${permission.component}`], resolve),
        meta: {
          title: permission.meta.title,
          icon: permission.meta.icon
        }
      }]
    }
  } else { // 子菜单
    return {
      path: permission.path,
      component: (resolve) => require([`@/views/${permission.component}`], resolve),
      meta: {
        title: permission.meta.title,
        icon: permission.meta.icon
      }
    }
  }
}

export function initRoute(permission) { // 封装路由
  if (permission.children && permission.children.length > 0) { // 如果存在子节点
    const route = {
      path: permission.path,
      component: Layout,
      meta: {
        title: permission.meta.title,
        icon: permission.meta.icon
      },
      children: []
    }
    permission.children.forEach(child => { // 递归封装子节点
      route.children.push(initRoute(child, child.level))
    })
    return route
  } else { // 不存在子节点直接返回
    return getRouter(permission)
  }
}

export function filterAsyncRoutes(routes) {
  const accessedRoutes = []
  routes.forEach(permission => {
    console.log(permission)
    const routeNode = initRoute(permission)
    accessedRoutes.push(routeNode) // push一个个封装好的路由数据
  })
  return accessedRoutes // 返回全部的路由数据
}

export default router
