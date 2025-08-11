import { ref, watch, nextTick } from 'vue'

// 主题状态 - 全局单例
const isDark = ref(false)
let isInitialized = false
let isToggling = false

// 应用主题到DOM
const applyTheme = (dark) => {
  try {
    const html = document.documentElement

    if (dark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  } catch (error) {
    console.error('应用主题时出错:', error)
  }
}

// 初始化主题
const initTheme = () => {
  if (isInitialized) return

  try {
    // 从localStorage获取保存的主题设置
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的设置，使用系统偏好
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isDark.value = mediaQuery.matches
    }

    // 立即应用主题
    applyTheme(isDark.value)

    isInitialized = true
  } catch (error) {
    console.error('初始化主题时出错:', error)
    // 出错时使用默认亮色主题
    isDark.value = false
    applyTheme(false)
  }
}

// 切换主题
const toggleTheme = async () => {
  if (isToggling) return // 防止重复点击

  try {
    isToggling = true
    isDark.value = !isDark.value

    // 等待DOM更新
    await nextTick()

    // 保存到localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

  } catch (error) {
    console.error('切换主题时出错:', error)
    // 出错时恢复之前的状态
    isDark.value = !isDark.value
  } finally {
    // 延迟重置标志，防止快速点击
    setTimeout(() => {
      isToggling = false
    }, 100)
  }
}

// 监听主题变化并应用
watch(isDark, (newValue) => {
  try {
    applyTheme(newValue)
  } catch (error) {
    console.error('监听主题变化时出错:', error)
  }
}, { immediate: false })

// 主题切换函数
export function useTheme() {
  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
