const pluginConfig = {
  state: {
    pluginId: 1,
    plugins: [],
    pluginsList: [],
    sysColList: {}
  },

  mutations: {
    SET_PLUGINSID: (state, plugin) => {
      state.pluginId = plugin
    },
    SET_PLUGINSCONFIG: (state, plugin) => {
      state.plugins = plugin
    },
    SET_PLUGINSLISTRES: (state, plugin) => {
      state.pluginsList = plugin
      state.plugins = []
    },
    SET_PLUGINSLIST: (state, plugin) => {
      // state.pluginsList.push(plugin.data)
      state.pluginsList.splice(plugin.newIndex, 0, plugin.data)
      // let JSONat = JSON.stringify(state.pluginsList, (key, value) => {
      //   if (key === 'render') {
      //     // eslint-disable-next-line quotes
      //     // eslint-disable-next-line no-eval
      //     return eval('(function(){return ' + value + ' })()')
      //   }
      //   return value
      // })
      // state.pluginsList = JSON.parse(JSONat, (key, value) => {
      //   if (key === 'render') {
      //     // eslint-disable-next-line quotes
      //     // eslint-disable-next-line no-eval
      //     return eval('(function(){return ' + value + ' })()')
      //   }
      //   return value
      // })
    },
    SET_SYSCOLLIST: (state, data) => {
      if (!state.sysColList[data.key]) {
        state.sysColList[data.key] = data.data
      }
    }
  }
}

export default pluginConfig
