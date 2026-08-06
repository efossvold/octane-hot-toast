import { createBaseConfig } from './vite.config.ts'

export default createBaseConfig({
  outDir: 'dist/headless',
  entry: 'src/headless/index.ts',
})
