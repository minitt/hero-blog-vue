import request from '@/utils/request'

export function getMetaList(params) {
  return request({
    url: '/meta/list',
    method: 'get',
    params
  })
}

export function createMeta(data, pass) {
  return request({
    url: '/meta/create',
    method: 'post',
    params: {
      password: pass
    },
    data
  })
}

export function updateMeta(data, pass) {
  return request({
    url: '/meta/update',
    method: 'post',
    params: {
      password: pass
    },
    data
  })
}

export function delMeta(id) {
  return request({
    url: '/meta/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function delBatchMeta(idArr) {
  return request({
    url: '/meta/delBatch',
    method: 'get',
    params: {
      idArr: idArr
    }
  })
}

export function searchMeta(name) {
  return request({
    url: '/meta/search',
    method: 'get',
    params: {
      name: name
    }
  })
}
