<template>
  <div class="min-h-screen bg-white">
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 主内容区 -->
        <div class="flex-1 lg:max-w-3xl">
          <!-- 最新文章 -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">最新文章</h2>

            <!-- 加载状态 -->
            <Transition name="loading">
              <div v-if="loading" class="space-y-6">
                <div v-for="i in 3" :key="i" class="glass-effect p-6 animate-pulse">
                  <div class="flex gap-4">
                    <div class="w-32 h-24 bg-gray-300 rounded"></div>
                    <div class="flex-1">
                      <div class="h-6 bg-gray-300 rounded mb-3"></div>
                      <div class="h-4 bg-gray-300 rounded mb-2"></div>
                      <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- 文章列表 -->
            <TransitionGroup
              v-if="articles.length > 0"
              name="list"
              tag="div"
              class="space-y-6"
            >
              <article
                v-for="article in articles"
                :key="article.id"
                class="glass-effect p-6 cursor-pointer card-hover"
                @click="goToArticle(article.id)"
              >
                <div class="flex gap-4">
                  <div v-if="article.coverImage" class="w-32 h-24 flex-shrink-0">
                    <img
                      :src="article.coverImage"
                      :alt="article.title"
                      class="w-full h-full object-cover rounded"
                    >
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {{ article.title }}
                    </h3>
                    <p class="text-gray-600 line-clamp-2 mb-3">
                      {{ article.summary }}
                    </p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{{ formatDate(article.publishedAt) }}</span>
                        <span>{{ article.viewCount }} 阅读</span>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="tag in article.tags?.slice(0, 3)"
                          :key="tag.id"
                          class="px-2 py-1 text-xs rounded"
                          :style="{ backgroundColor: tag.color + '20', color: tag.color }"
                        >
                          {{ tag.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </TransitionGroup>

            <!-- 空状态 -->
            <div v-else-if="!loading && articles.length === 0" class="glass-effect p-12 text-center">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无文章</h3>
              <p class="text-gray-600">还没有发布任何文章，请稍后再来查看。</p>
            </div>


          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <!-- 热门标签 -->
          <div class="glass-effect p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TagIcon class="w-5 h-5 mr-2 text-blue-600" />
              热门标签
            </h3>
            <TransitionGroup
              v-if="popularTags.length > 0"
              name="list"
              tag="div"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="tag in popularTags"
                :key="tag.id"
                @click="goToTag(tag.id)"
                class="px-3 py-1 text-sm rounded-full cursor-pointer tag-hover"
                :style="{ backgroundColor: tag.color + '20', color: tag.color }"
              >
                {{ tag.name }}
              </span>
            </TransitionGroup>
            <div v-else class="text-gray-500">暂无标签</div>
          </div>

          <!-- 博客统计 -->
          <div class="glass-effect p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              博客统计
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-blue-600 mb-1">{{ stats.articleCount }}</div>
                <div class="text-xs text-gray-600">文章总数</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-green-600 mb-1">{{ stats.viewCount }}</div>
                <div class="text-xs text-gray-600">总访问量</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-purple-600 mb-1">{{ stats.tagCount }}</div>
                <div class="text-xs text-gray-600">标签数量</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
                <div class="text-2xl font-bold text-red-600 mb-1">{{ stats.categoryCount }}</div>
                <div class="text-xs text-gray-600">分类数量</div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <Transition name="fade">
            <div v-if="totalPages > 1" class="glass-effect p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">页面导航</h3>

            <!-- 分页信息 -->
            <div class="text-sm text-gray-600 mb-4">
              共 {{ totalElements }} 篇文章，第 {{ currentPage }} / {{ totalPages }} 页
            </div>

            <!-- 分页按钮 -->
            <div class="space-y-2">
              <!-- 上一页 -->
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="w-full px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>

              <!-- 页码按钮 -->
              <div class="grid grid-cols-4 gap-1">
                <template v-for="page in getPageNumbers()" :key="page">
                  <span v-if="page === '...'" class="px-2 py-1 text-xs text-center text-gray-500">
                    ...
                  </span>
                  <button
                    v-else
                    @click="changePage(page)"
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded',
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>

              <!-- 下一页 -->
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="w-full px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi, tagApi } from '../api'

// 图标组件
const TagIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
    <path d="M17.63,5.84C17.27,5.33 16.67,5 16,5L5,5.01C3.9,5.01 3,5.9 3,7V17C3,18.1 3.9,18.99 5,18.99L16,19C16.67,19 17.27,18.67 17.63,18.16L22,12L17.63,5.84Z" />
  </svg>`
}

const router = useRouter()

// 响应式数据
const articles = ref([])
const popularTags = ref([])
const stats = ref({
  articleCount: 0,
  viewCount: 0,
  tagCount: 0,
  categoryCount: 0
})
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const totalElements = ref(0)
const pageSize = 4

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



// 跳转到文章详情
const goToArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

// 跳转到标签页面
const goToTag = (tagId) => {
  router.push({ name: 'search', query: { tag: tagId } })
}

// 加载文章列表
const loadArticles = async (page = 1) => {
  try {
    loading.value = true
    const data = await articleApi.getList({ page: page - 1, size: pageSize })

    articles.value = data.content || []
    currentPage.value = page
    totalPages.value = data.totalPages || 0
    totalElements.value = data.totalElements || 0
  } catch (error) {
    console.error('加载文章失败:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

// 切换页面
const changePage = (page) => {
  if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
    loadArticles(page)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 生成页码数组
const getPageNumbers = () => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // 总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7，显示省略号
    if (current <= 4) {
      // 当前页在前面
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后面
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// 加载热门标签
const loadPopularTags = async () => {
  try {
    const data = await tagApi.getPopular()
    popularTags.value = data || []
  } catch (error) {
    console.error('加载热门标签失败:', error)
    popularTags.value = []
  }
}

// 加载博客统计
const loadStats = async () => {
  try {
    // 使用静态数据，因为后端可能没有统计API
    stats.value = {
      articleCount: 5,
      viewCount: 1250,
      tagCount: 8,
      categoryCount: 4
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    stats.value = {
      articleCount: 0,
      viewCount: 0,
      tagCount: 0,
      categoryCount: 0
    }
  }
}



// 组件挂载时加载数据
onMounted(async () => {
  try {
    await Promise.all([
      loadArticles(),
      loadPopularTags(),
      loadStats()
    ])
  } catch (error) {
    console.error('加载页面数据失败:', error)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>