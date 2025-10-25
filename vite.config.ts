import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    tanstackRouter(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return

          if (id.includes('@tanstack/react-router-devtools')) return 'react-router-devtools'
          if (id.includes('@tanstack/react-query-devtools')) return 'react-query-devtools'
          if (id.includes('@tanstack/react-router')) return 'react-router'
          if (id.includes('@tanstack/react-query')) return 'react-query'
          if (id.includes('react-dom') || id.includes('react')) return 'react'

          const m = id.replace(/\\/g, '/')
            .match(/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@[^/]+\/[^/]+|[^/]+)/)
          const pkg = (m?.[1] ?? 'vendor').replace('@', '').replace('/', '-')
          return pkg
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/media/[name]-[hash].[ext]',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: "http://www.byteverse.vip/oneapi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
