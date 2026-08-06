import { defineConfig, mergeConfig } from 'vite'

import { createBaseConfig } from './vite.config.ts'

export default mergeConfig(
  createBaseConfig({
    outDir: 'dist/lib',
    entry: 'src/index.ts',
  }),
  defineConfig({
    build: {
      rollupOptions: {
        output: {
          banner: () => '"use client";',
        },
      },
    },
  }),
)
