import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base 用相对路径：同一份产物可以直接扔到 onlynor.github.io/easy-resume/，
// 也可以塞进 VPS 上任意子路径的 Nginx / Docker 里，不用重新构建。
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // typst 的 wasm 很大，关掉体积告警免得刷屏
    chunkSizeWarningLimit: 4096,
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    exclude: ['@myriaddreamin/typst-ts-web-compiler', '@myriaddreamin/typst-ts-renderer'],
  },
  server: { fs: { allow: ['..'] } },
});
