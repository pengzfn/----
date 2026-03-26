import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages 项目页：仓库名须与路径一致，例如 https://pengzfn.github.io/typing-practice/
  base: '/typing-practice/',
  plugins: [react()],
});
