import http from '../utils/http'

// 文章相关 API
export const articleApi = {
  // 获取文章列表
  getList(params = {}) {
    return http.get('/articles', params)
  },

  // 获取文章详情
  getDetail(id) {
    return http.get(`/articles/${id}`)
  },

  // 搜索文章
  search(keyword, params = {}) {
    return http.get('/articles/search', { keyword, ...params })
  },

  // 根据分类获取文章
  getByCategory(categoryId, params = {}) {
    return http.get(`/articles/category/${categoryId}`, params)
  },

  // 根据标签获取文章
  getByTag(tagId, params = {}) {
    return http.get(`/articles/tag/${tagId}`, params)
  },

  // 获取置顶文章
  getTop() {
    return http.get('/articles/top')
  }
}

// 分类相关 API
export const categoryApi = {
  // 获取分类列表
  getList() {
    return http.get('/categories')
  },

  // 获取分类详情
  getDetail(id) {
    return http.get(`/categories/${id}`)
  }
}

// 标签相关 API
export const tagApi = {
  // 获取标签列表
  getList() {
    return http.get('/tags')
  },

  // 获取热门标签
  getPopular() {
    return http.get('/tags/popular')
  }
}

// 作品集相关 API
export const portfolioApi = {
  // 获取所有作品集
  getList() {
    return http.get('/portfolios')
  },

  // 获取精选作品集
  getFeatured() {
    return http.get('/portfolios/featured')
  }
}

// 友链相关 API
export const friendLinkApi = {
  // 获取友链列表
  getList() {
    return http.get('/friend-links')
  }
}

// 邮箱订阅相关 API
export const emailSubscriberApi = {
  // 订阅邮箱
  subscribe(email) {
    return http.post('/email-subscribers/subscribe', { email })
  },

  // 取消订阅（通过token）
  unsubscribeByToken(token) {
    return http.get('/email-subscribers/unsubscribe', { token })
  },

  // 取消订阅（通过邮箱）
  unsubscribeByEmail(email) {
    return http.delete('/email-subscribers/unsubscribe', { email })
  },

  // 检查订阅状态
  checkStatus(email) {
    return http.get('/email-subscribers/check', { email })
  },

  // 获取订阅者数量
  getCount() {
    return http.get('/email-subscribers/count')
  }
}

// RSS订阅相关 API
export const rssApi = {
  // RSS订阅源
  getFeed() {
    return http.get('/rss/feed.xml')
  },

  // Atom订阅源
  getAtom() {
    return http.get('/rss/atom.xml')
  },

  // 分类RSS订阅源
  getCategoryFeed(categoryId) {
    return http.get(`/rss/category/${categoryId}/feed.xml`)
  }
}

// 注意：搜索文章已经包含在 articleApi.search 中，这里移除重复的 searchApi

// 注意：根据接口文档，前台博客系统不提供用户注册和登录功能，所有内容均为只读访问

// 注意：根据接口文档，没有统计相关的API，已移除 statsApi
