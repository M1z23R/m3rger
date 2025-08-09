// vite.config.ts (in project root)
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@ffmpeg/ffmpeg',
      '@ffmpeg/util',
      '@ffmpeg/core-mt'
    ]
  },
  worker: {
    format: 'es'
  }
});
