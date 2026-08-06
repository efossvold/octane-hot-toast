import type { Plugin } from 'vite'

import { minify } from 'esbuild-minify-templates' // Import the raw minifier
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json' with { type: 'json' }

export const viteMinifyTemplatesPlugin = (): Plugin => ({
  name: 'vite-plugin-minify-templates',
  enforce: 'post', // Run after compilation but before final bundling
  apply: 'build', // Only run during production builds
  transform(code, id) {
    if (/\.(js|ts|jsx|tsx)$/.test(id)) {
      const minified = minify(code)
      return {
        code: minified.toString(),
        map: null,
      }
    }
    return undefined
  },
})

interface ConfigOpts {
  entry: string
  outDir: string
}

export const createBaseConfig = (opts: ConfigOpts) =>
  defineConfig({
    plugins: [
      viteMinifyTemplatesPlugin(),
      dts({
        tsconfigPath: './tsconfig.build.json',
        bundleTypes: false,
        insertTypesEntry: true,
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
        entryRoot: 'src',
        outDirs: opts.outDir,
      }),
    ],
    esbuild: {
      target: 'es2022',
      jsx: 'transform',
      jsxFactory: 'Octane.createElement',
      jsxFragment: 'Octane.Fragment',
      jsxInject: `import * as Octane from 'octane';`,
    },
    build: {
      emptyOutDir: false,
      lib: {
        name: 'octane-hot-toast',
        formats: ['es', 'cjs'],
        entry: resolve(import.meta.dirname, opts.entry),
        fileName: format => `[name].${format === 'es' ? 'js' : 'cjs'}`,
      },
      minify: 'terser',
      sourcemap: true,
      rollupOptions: {
        output: {
          dir: opts.outDir,
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
        },
        external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
      },
    },
  })
