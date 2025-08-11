<template>
  <footer class="border-t border-gray-200 bg-gray-50 mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>© {{ currentYear }} ApexBlog. All rights reserved.</p>
        <div class="flex items-center space-x-4 mt-2 md:mt-0">
          <a href="#" class="hover:text-gray-900 transition-colors">关于</a>
          <a href="#" class="hover:text-gray-900 transition-colors">联系</a>
          <a href="#" class="hover:text-gray-900 transition-colors">RSS</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
