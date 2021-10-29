import storage from 'store'
import { setToken, removeToken, setLang } from '@/utils/auth'
import { login, getInfo, logout } from '@/api/login'
import { getSelectedWarehouse, saveSelectedWarehouse } from '@/api/wmssystem/userWarehouse'
import { getDictArrayAll, getDictArrayWarehouse } from '@/api/dict'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    userId: '',
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    buttons: [], // 按钮权限
    info: {},
    warehouse: {},
    dictAll: {},
    dictWarehouse: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_WAREHOUSE: (state, warehouse) => {
      state.warehouse = warehouse.data
    },
    SET_DICT: (state, dictAll) => {
      state.dictAll = dictAll
    },
    SET_DICTWAREHOUSE: (state, dictAll) => {
      state.dictWarehouse = dictAll
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result, 12 * 60 * 60 * 1000)
          // 标记弹窗选择仓库
          storage.set('xiahui_warehouse_select', true)
          setToken(result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response
          // console.log('获取用户信息：', JSON.stringify(result))
          if (result.roleIds) {
            commit('SET_ROLES', result.roleIds && result.roleIds.length !== 0 ? result.roleIds : ['-1'])
            commit('SET_BUTTONS', result.buttons)
            commit('SET_USERID', result.id)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          // console.log(result)
          commit('SET_NAME', { name: result.userName, welcome: welcome() })
          commit('SET_AVATAR', result.avatar || '/avatar2.jpg')
          dispatch('Getwarehouse', result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户仓库信息
    Getwarehouse ({ commit }, user) {
      return new Promise((resolve, reject) => {
        getSelectedWarehouse({
          userId: user.id
        }).then(response => {
          const result = response
          commit('SET_WAREHOUSE', result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
     // 保存用户仓库信息
     Setwarehouse ({ commit }, user) {
      return new Promise((resolve, reject) => {
        saveSelectedWarehouse(user).then(response => {
          const result = response
          commit('SET_WAREHOUSE', result)
          // 选择仓库后关闭弹窗
          storage.remove('xiahui_warehouse_select')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 保存字典
    GetdictMuster ({ commit }, user) {
      return new Promise((resolve, reject) => {
        Promise.all([
          // 系统级字典
          new Promise((resolve, reject) => {
            getDictArrayAll().then(response => {
              const result = response
              commit('SET_DICT', result)
              resolve(response)
            }).catch(error => {
              resolve(error)
            })
          }),
          // 仓库级字典
          new Promise((resolve, reject) => {
            getDictArrayWarehouse().then(response => {
              const result = response
              commit('SET_DICTWAREHOUSE', result)
              resolve(response)
            }).catch(error => {
              resolve(error)
            })
          })
        ]).then(res => {
          resolve(res)
        }).catch(error => {
          resolve(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', {})
          storage.remove(ACCESS_TOKEN)
          removeToken(ACCESS_TOKEN)
        })
      })
    },
    clearLogInfo () {
      return new Promise((resolve, reject) => {
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }
  }
}

export default user
