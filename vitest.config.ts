import { octane } from '@octanejs/vite-plugin'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [octane()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './test/setup.ts',
    exclude: [...configDefaults.exclude, '**/e2e/**'], // Example: Exclude e2e tests
    coverage: {
      provider: 'v8', // Use Vite's default coverage provider
      reporter: ['text', 'json', 'html'],
    },
  },
})
