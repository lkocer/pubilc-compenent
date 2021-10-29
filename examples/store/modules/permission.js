import { constantRouterMap } from '@/router'
const uuid = () => {
  return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
      var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    routeRefresh: null,
    tableRefresh: null
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ROUTERS_REFRESH: (state, routers) => {
      state.routeRefresh = uuid()
    },
    SET_TABLE_REFRESH: (state, routers) => {
      state.tableRefresh = uuid()
    }
  }
}

export default permission
