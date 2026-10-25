import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 is written with Sass @import and legacy global functions,
        // which current Dart Sass reports as deprecated. We silence only:
        // - warnings raised inside node_modules (quietDeps), and
        // - the @import deprecation, because Bootstrap 5's documented theming
        //   approach requires @import so our variable overrides apply.
        // Deprecations in our own SCSS still surface.
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
})
