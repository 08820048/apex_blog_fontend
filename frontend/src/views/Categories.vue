<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章分类</h1>
        <p class="text-xl text-gray-600 dark:text-white/80">按分类浏览所有文章</p>
      </div>

      <!-- 分类网格 -->
      <Transition name="loading">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="glass-effect rounded-2xl p-6 animate-pulse">
            <div class="h-6 bg-gray-300 rounded mb-3"></div>
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </Transition>

      <TransitionGroup
        v-if="!loading && categories.length > 0"
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="glass-effect rounded-2xl p-6 card-hover cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FolderIcon class="w-6 h-6 text-white" />
            </div>
          </div>

          <p v-if="category.description" class="text-gray-600 mb-4 line-clamp-2">
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ formatDate(category.createdAt) }}
            </span>
            <div class="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
              <span class="text-sm mr-1">查看更多</span>
              <ArrowRightIcon class="w-4 h-4" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <Transition name="fade">
        <div v-if="!loading && categories.length === 0" class="glass-effect rounded-2xl p-12 text-center">
        <div class="text-gray-400 mb-4">
          <FolderIcon class="w-16 h-16 mx-auto" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无分类</h3>
        <p class="text-gray-600">还没有创建任何分类，请稍后再来查看。</p>
      </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryApi } from '../api'

// 图标组件
const FolderIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>' }
const ArrowRightIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' }

const router = useRouter()

// 响应式数据
const categories = ref([])
const loading = ref(false)

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

// 跳转到分类页面
const goToCategory = (categoryId) => {
  router.push({ name: 'search', query: { category: categoryId } })
}

// 加载分类列表
const loadCategories = async () => {
  try {
    loading.value = true
    const data = await categoryApi.getList()
    categories.value = data || []
  } catch (error) {
    console.error('加载分类失败:', error)
    categories.value = []
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(loadCategories)
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