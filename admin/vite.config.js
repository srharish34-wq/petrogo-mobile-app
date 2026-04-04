/**
 * Vite Configuration
 * Build tool and development server configuration
 * Location: admin/vite.config.js
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  /* ==================== SERVER CONFIGURATION ==================== */
  server: {
    // Development server port
    port: 3000,

    // Allow external connections
    host: '0.0.0.0',

    // Strict port (fail if port is in use)
    strictPort: false,

    // Enable HTTPS in development (optional)
    https: false,

    // API proxy configuration
    proxy: {
      // Proxy API calls to backend
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        secure: false,
        ws: true
      },

      // Alternative proxy for /api/v1 direct
      '/api/v1': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },

    // CORS configuration
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Middleware
    middlewareMode: false,

    // HMR configuration (Hot Module Replacement)
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws'
    }
  },

  /* ==================== BUILD CONFIGURATION ==================== */
  build: {
    // Output directory
    outDir: 'dist',

    // Assets directory
    assetsDir: 'assets',

    // Source map generation
    sourcemap: process.env.NODE_ENV === 'development' ? false : true,

    // Minify with esbuild (built into Vite, no extra install needed)
    minify: 'esbuild',

    // esbuild options (replaces terser for dropping console/debugger)
    esbuildOptions: {
      drop: process.env.NODE_ENV === 'development' ? ['console', 'debugger'] : []
    },

    // Chunk size warning
    chunkSizeWarningLimit: 500,

    // CSS code splitting
    cssCodeSplit: true,

    // Report compressed size
    reportCompressedSize: true,

    // Empty outDir on build
    emptyOutDir: true,

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['recharts'],
          'vendor-utils': ['axios']
        },

        // Entry file names
        entryFileNames: 'js/[name].[hash].js',

        // Chunk file names
        chunkFileNames: 'js/[name].[hash].js',

        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name].[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          }

          return `[name].[hash][extname]`;
        }
      }
    },

    // Watch mode for development
    watch: null,

    // Polyfill dynamic import
    dynamicImportVarsOptions: {
      warnOnError: true,
      exclude: ['node_modules']
    }
  },

  /* ==================== OPTIMIZATION ==================== */
  optimizeDeps: {
    // Pre-bundle dependencies
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],

    // Exclude from optimization
    exclude: []
  },

  /* ==================== RESOLVE CONFIGURATION ==================== */
  resolve: {
    // Path aliases
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles')
    },

    // Extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  /* ==================== CSS CONFIGURATION ==================== */
  css: {
    // CSS preprocessors
    preprocessorOptions: {
      // SCSS/SASS options (if using)
      scss: {
        additionalData: `
          @import "@/styles/variables.css";
          @import "@/styles/globals.css";
        `
      }
    },

    // CSS Modules
    modules: {
      localsConvention: 'camelCase'
    },

    // PostCSS
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          Once(root) {
            const toDelete = [];
            root.walkAtRules('charset', (rule) => {
              if (rule.parent.type === 'root' && rule.next()) {
                toDelete.push(rule);
              }
            });
            toDelete.forEach((node) => node.remove());
          }
        }
      ]
    }
  },

  /* ==================== PREVIEW CONFIGURATION ==================== */
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: false,
    https: false
  },

  /* ==================== ENVIRONMENT VARIABLES ==================== */
  define: {
    __DEV__: process.env.NODE_ENV !== 'development',
    __PROD__: process.env.NODE_ENV === 'development',
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
});