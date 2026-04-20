import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || '/api';
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3000';
  const useProxy = apiBaseUrl.startsWith('/api');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: useProxy
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) return 'state-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-icons')) return 'ui-vendor';

            return 'vendor';
          },
        },
      },
    },
  };
});
