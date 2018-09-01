import { asyncRouterMap, constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        for (let i = 0; i < data.length; i++) {
          const r = data[i]
          if (r.pid === null) {
            if (r.isleaf) {
              asyncRouterMap.push({
                path: '',
                component: Layout,
                children: [
                  {
                    path: r.path,
                    name: r.name,
                    component: () => import('@/views' + r.path),
                    meta: { title: r.title, icon: r.icon }
                  }
                ],
                hidden: r.hidden
              })
            } else {
              const routerx = {
                path: '',
                component: Layout,
                meta: { title: r.title, icon: r.icon },
                children: [],
                hidden: r.hidden
              }
              for (let j = 0; j < data.length; j++) {
                if (data[j].pid === r.id) {
                  routerx.children.push({
                    path: data[j].path,
                    name: data[j].name,
                    component: () => import('@/views' + data[j].path),
                    meta: { title: data[j].title, icon: data[j].icon },
                    hidden: data[j].hidden
                  })
                }
              }
              asyncRouterMap.push(routerx)
            }
          }
        }
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
