import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useTheme } from './composables/useTheme'

const app = createApp(App)

// ?????????
try {
  const { initTheme } = useTheme()
  initTheme()
} catch (error) {
  console.error('???????????:', error)
}

// ????????
app.config.errorHandler = (err, _vm, info) => {
  console.error('Vue??????:', err, info)
}

// ???¦Ä?????Promise??????
window.addEventListener('unhandledrejection', event => {
  console.error('¦Ä?????Promise????:', event.reason)
  event.preventDefault()
})

app.use(router)
app.mount('#app')
