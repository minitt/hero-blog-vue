import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function createUser(data, pass) {
  return request({
    url: '/user/create',
    method: 'post',
    params: {
      password: pass
    },
    data
  })
}

export function updateUser(data, pass) {
  return request({
    url: '/user/update',
    method: 'post',
    params: {
      password: pass
    },
    data
  })
}

export function delUser(id) {
  return request({
    url: '/user/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function delBatchUser(idArr) {
  return request({
    url: '/user/delBatch',
    method: 'get',
    params: {
      idArr: idArr
    }
  })
}
