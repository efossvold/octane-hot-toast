import registerCodeCoverageTasks from '@cypress/code-coverage/task'
import { octane } from '@octanejs/vite-plugin'
import { defineConfig } from 'cypress'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  video: false,

  component: {
    devServer: {
      framework: 'cypress-ct-octane-js' as any,
      bundler: 'vite',
      viteConfig: {
        plugins: [
          octane(),
          istanbul({
            include: 'src/*',
            exclude: ['node_modules', 'test/'],
            extension: ['.ts', '.tsx'],
            requireEnv: false,
          }),
        ],
      },
    },
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config)
      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    },
  },
})
