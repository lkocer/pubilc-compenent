const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  warehouse: state => state.user.warehouse,
  dictAll: state => state.user.dictAll,
  dictWarehouse: state => state.user.dictWarehouse,
  addRouters: state => state.permission.addRouters,
  getRouters: state => state.permission.routers,
  routeRefresh: state => state.permission.routeRefresh,
  tableRefresh: state => state.permission.tableRefresh,
  multiTab: state => state.app.multiTab,
  buttons: state => state.user.buttons,
  userId: state => state.user.userId,
  pluginsConfig: state => state.pluginConfig.plugins,
  pluginsList: state => state.pluginConfig.pluginsList,
  pluginId: state => state.pluginConfig.pluginId,
  sysColList: state => state.pluginConfig.sysColList,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  cachedViewsTag: state => state.tagsView.cachedViewsTag
}

export default getters