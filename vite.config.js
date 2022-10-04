import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host: '0.0.0.0',
    port: '3000',
    // origin: "http://127.0.0.1:8080/",
    // proxy:{
    //   '^/api':{
    //     target: 'http://127.0.0.1:8080/',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // },
    cors:true,
  }
})
