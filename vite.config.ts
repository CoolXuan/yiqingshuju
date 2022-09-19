import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
       //网易代理
      '/prod-api':
       {
        target: "https://c.m.163.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/,'')
      }
    }
  }
})
