import axios from 'axios'
import storage from 'store'
import { notification } from 'ant-design-vue'
const ACCESS_TOKEN = 'xiahui-token'

const baseURL = process.env.VUE_APP_API_BASE_URL
const productionURL = process.env.VUE_APP_BASE_API + process.env.VUE_APP_API_BASE_URL
// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? productionURL : baseURL, // api base_url
  timeout: 10000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403 || error.response.status === 401) {
      if (error.response.status === 403) {
        notification.error({
          message: 'Forbidden',
          description: data.message
        })
      }
      if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
        notification.error({
          key: 'tokenExpired',
          message: '错误',
          description: '登录信息已过期，请重试'
        })
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } else {
      if (error.response.status < 200 || error.response.status > 300) {
        notification.error({
          message: 'error',
          description: data.message
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ACCESS_TOKEN] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// 拦截带上语言参数
request.interceptors.request.use(config => {
  const lang = storage.get('lang')
  config.headers['lang'] = lang
  // if (config.method === 'post') {
  //   config.data = {
  //     ...config.data,
  //     lang: lang
  //   }
  // }
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      lang: lang
    }
  }
  return config
}, err)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, err)

export {
  request
}