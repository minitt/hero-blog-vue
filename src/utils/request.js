import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    // alert(JSON.parse('{code:123}'))
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    const res = error.response
    const data = res.data
    let errorMsg
    switch (res.status) {
      case 400:
        errorMsg = '错误请求'
        break
      case 401:
        if (data.code === 40101) {
          errorMsg = data.data.msg
        } else {
          errorMsg = '未授权'
        }
        break
      case 403:
        if (data.code === 40301 || data.code === 40302) {
          errorMsg = data.data.msg
          if (data.coe === 40302) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            })
          }
        } else {
          errorMsg = '服务器拒绝请求'
        }
        break
      case 404:
        errorMsg = '未找到'
        break
      case 500:
        errorMsg = '服务器内部错误'
        break
      default:
        errorMsg = '错误'
        break
    }
    Message({
      message: errorMsg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
