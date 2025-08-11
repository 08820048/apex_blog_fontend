import { ref, watch, onMounted } from 'vue'

// 主题状态
const isDark = ref(false)

// 主题切换函数
export function useTheme() {
  // 初始化主题
  const initTheme = () => {
    // 从localStorage获取保存的主题设置
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的设置，使用系统偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    const html = document.documentElement
    const body = document.body

    if (isDark.value) {
      html.classList.add('dark')
      body.classList.add('dark')
    } else {
      html.classList.remove('dark')
      body.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 监听主题变化
  watch(isDark, (newValue) => {
    applyTheme()
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  })

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e) => {
    // 只有在用户没有手动设置主题时才跟随系统
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
    }
  }

  onMounted(() => {
    initTheme()
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  })

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
