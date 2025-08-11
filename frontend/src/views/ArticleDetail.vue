<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- 加载状态 -->
      <div v-if="loading" class="glass-effect rounded-2xl p-8 animate-pulse">
        <div class="h-8 bg-gray-300 rounded mb-4"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
        <div class="h-64 bg-gray-300 rounded"></div>
      </div>

      <!-- 文章内容 -->
      <article v-if="!loading && article" class="glass-effect rounded-2xl overflow-hidden card-hover">
        <!-- 文章头部 -->
        <header class="p-8 border-b border-gray-200">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ article.title }}
          </h1>
          
          <!-- 文章元信息 -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div class="flex items-center">
              <UserIcon class="w-4 h-4 mr-1" />
              {{ article.author?.nickname || article.author?.username }}
            </div>
            <div class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-1" />
              {{ formatDate(article.publishedAt) }}
            </div>
            <div class="flex items-center">
              <EyeIcon class="w-4 h-4 mr-1" />
              {{ article.viewCount }} 阅读
            </div>

          </div>

          <!-- 标签 -->
          <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in article.tags"
              :key="tag.id"
              class="px-3 py-1 text-sm rounded-full"
              :style="{ backgroundColor: tag.color + '20', color: tag.color }"
            >
              # {{ tag.name }}
            </span>
          </div>

          <!-- 封面图片 -->
          <div v-if="article.coverImage" class="mb-6">
            <img 
              :src="article.coverImage" 
              :alt="article.title"
              class="w-full h-64 md:h-80 object-cover rounded-xl"
            >
          </div>
        </header>

        <!-- 文章正文 -->
        <div class="p-8">
          <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
        </div>

        <!-- 文章底部信息 -->
        <footer class="p-8 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-500 text-center">
            最后更新：{{ formatDate(article.updatedAt) }}
          </div>
        </footer>
      </article>

      <!-- 文章不存在 -->
      <div v-if="!loading && !article" class="glass-effect rounded-2xl p-12 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">文章不存在</h3>
        <p class="text-gray-600 mb-6">您访问的文章可能已被删除或不存在。</p>
        <RouterLink 
          to="/"
          class="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        >
          返回首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '../api'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import anchor from 'markdown-it-anchor'

// 图标组件
const UserIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' }
const CalendarIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>' }
const EyeIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>' }


const route = useRoute()

// 响应式数据
const article = ref(null)
const loading = ref(false)

// 初始化 markdown 渲染器
const md = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  linkify: true,     // 自动转换链接
  typographer: true, // 启用智能引号和其他排版替换
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>'
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

// 使用插件
md.use(anchor, {
  permalink: anchor.permalink.headerLink(),
  permalinkBefore: true,
  permalinkSymbol: '#'
})

// 渲染内容
const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  const rendered = md.render(article.value.content)
  console.log('Markdown rendered:', rendered.substring(0, 200) + '...')
  return rendered
})

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

// 加载文章详情
const loadArticle = async () => {
  try {
    loading.value = true
    article.value = null
    const data = await articleApi.getDetail(route.params.id)
    article.value = data
  } catch (error) {
    console.error('加载文章失败:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}



// 监听路由参数变化，立即执行一次
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadArticle()
  }
}, { immediate: true })
</script>

<style scoped>
.prose {
  color: #374151;
  max-width: none;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.prose h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.prose h3 {
  font-size: 1.5rem;
  line-height: 2rem;
}

.prose p {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose blockquote {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 4px solid #e5e7eb;
  font-style: italic;
  color: #6b7280;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose strong {
  color: #111827;
  font-weight: 600;
}

.prose ul,
.prose ol {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  padding-left: 1.625rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

/* 行内代码样式 */
.prose code:not(.hljs) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 代码块样式 */
.prose pre.hljs {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.prose pre.hljs code {
  background-color: transparent;
  color: inherit;
  padding: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.prose img {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  max-width: 100%;
  height: auto;
}

/* 表格样式 */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.prose th,
.prose td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.prose th {
  background-color: #f9fafb;
  font-weight: 600;
}

/* 链接样式 */
.prose a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.prose a:hover {
  border-bottom-color: #3b82f6;
}

/* 标题样式改进 */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.prose h1 {
  font-size: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
}

.prose h3 {
  font-size: 1.25rem;
}

/* 分隔线样式 */
.prose hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}

/* 标题锚点链接样式 */
.prose .header-anchor {
  color: #9ca3af;
  text-decoration: none;
  margin-left: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.prose h1:hover .header-anchor,
.prose h2:hover .header-anchor,
.prose h3:hover .header-anchor,
.prose h4:hover .header-anchor,
.prose h5:hover .header-anchor,
.prose h6:hover .header-anchor {
  opacity: 1;
}

.prose .header-anchor:hover {
  color: #3b82f6;
}
</style>
