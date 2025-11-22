import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      clientPort: 3000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 10000,
        proxyTimeout: 10000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            // Only log in development
            if (process.env.NODE_ENV !== 'production') {
              console.error('Proxy error:', err.message);
              console.error('Request URL:', req.url);
            }
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({
                success: false,
                message: 'Backend server connection error. Please ensure the backend is running on http://localhost:5000'
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Only log in development
            if (process.env.NODE_ENV !== 'production') {
              console.log('Proxying request:', req.method, req.url);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Only log in development
            if (process.env.NODE_ENV !== 'production') {
              console.log('Proxy response:', proxyRes.statusCode, req.method, req.url);
            }
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for security and smaller bundle size
    emptyOutDir: true,
    minify: 'esbuild', // Use esbuild (built-in, faster than terser, no extra dependency needed)
    cssCodeSplit: true, // Split CSS for better caching
    // Increase chunk size warning limit (in KB)
    chunkSizeWarningLimit: 1500,
    // Production optimizations
    reportCompressedSize: true, // Report compressed size
    target: 'es2015', // Target modern browsers for smaller bundles
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            // React ecosystem (largest, most stable)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router') || id.includes('react-router-dom')) {
              return 'router-vendor';
            }

            // UI/Animation libraries
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('react-icons')) {
              return 'icons-vendor';
            }

            // Utility libraries
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            if (id.includes('react-hot-toast') || id.includes('react-toastify')) {
              return 'toast-vendor';
            }

            // Charts and visualization
            if (id.includes('chart') || id.includes('recharts') || id.includes('d3')) {
              return 'charts-vendor';
            }

            // Form libraries
            if (id.includes('formik') || id.includes('yup') || id.includes('react-hook-form')) {
              return 'forms-vendor';
            }

            // Date/Time libraries
            if (id.includes('date-fns') || id.includes('moment') || id.includes('dayjs')) {
              return 'datetime-vendor';
            }

            // State management
            if (id.includes('redux') || id.includes('zustand') || id.includes('jotai')) {
              return 'state-vendor';
            }

            // Helmet/SEO
            if (id.includes('helmet')) {
              return 'seo-vendor';
            }

            // Admin/Dashboard specific libraries
            if (id.includes('/pages/admin') || id.includes('AdminDashboard')) {
              return 'page-admin';
            }

            // Other vendor libraries (catch-all for remaining dependencies)
            return 'vendor';
          }

          // Split pages into separate chunks for lazy loading
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('/')[0].replace('.jsx', '').replace('.js', '');
            if (pageName && pageName !== 'index') {
              return `page-${pageName}`;
            }
          }

          // Split components by feature
          if (id.includes('/components/')) {
            if (id.includes('/components/admin')) {
              return 'components-admin';
            }
            if (id.includes('/components/student')) {
              return 'components-student';
            }
            if (id.includes('/components/customer')) {
              return 'components-customer';
            }
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: ['@google/generative-ai'] // Exclude large packages that aren't used on every page
  }
});
