import request from '@/utils/request'

export function getArticleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}

export function createArticle(data, typeids, tagnames) {
  return request({
    url: '/article/create',
    method: 'post',
    params: {
      typeids: typeids,
      tagnames: tagnames
    },
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function delArticle(id) {
  return request({
    url: '/article/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function delBatchArticle(idArr) {
  return request({
    url: '/article/delBatch',
    method: 'get',
    params: {
      idArr: idArr
    }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/fetch',
    method: 'get',
    params: {
      id: id
    }
  })
}
