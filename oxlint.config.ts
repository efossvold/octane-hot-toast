import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'react',
    'react-perf',
    'oxc',
    'import',
    'promise',
    'vitest',
  ],
  categories: {
    correctness: 'error',
    nursery: 'warn',
    pedantic: 'off',
    perf: 'warn',
    restriction: 'off',
    // style: 'warn',
    suspicious: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
    reportUnusedDisableDirectives: 'allow',
  },
  settings: {
    react: {
      formComponents: [],
      linkComponents: [],
      componentWrapperFunctions: [],
    },
    vitest: {
      typecheck: true,
    },
  },
  env: {
    builtin: true,
    browser: true,
    node: true,
    es2024: true,
    vitest: true,
  },
  globals: {
    Bun: 'readonly',
  },
  rules: {
    /**
     * Base javascript
     */
    'arrow-body-style': 'warn',
    curly: 'warn',
    'capitalized-comments': 'off',
    'no-non-null-assertion': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
    'no-var': 'error',
    'prefer-destructuring': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-spread': 'warn',
    'prefer-template': 'warn',

    // Typescript/require-await is superior
    'require-await': 'off',

    'promise/prefer-await-to-then': 'off',
    'promise/prefer-await-to-callbacks': 'off',

    /**
     * Base typescript
     */
    'typescript/await-thenable': 'error',
    'typescript/consistent-type-exports': 'error',
    'typescript/consistent-type-imports': 'error',
    'typescript/no-empty-object-type': 'warn',
    'typescript/no-unnecessary-condition': 'error',
    'typescript/prefer-nullish-coalescing': 'error',
    'typescript/prefer-optional-chain': 'error',
    'typescript/require-await': 'error',
    'typescript/no-unsafe-type-assertion': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',

    /**
     * Import
     */
    'import/consistent-type-specifier-style': ['error'],
    'import/exports-last': 'off',
    'import/first': 'error',
    'import/group-exports': 'off',
    'import/no-cycle': ['warn', { ignoreExternal: true }],
    'import/no-named-export': 'off',
    'import/no-namespace': 'off',
    'import/no-nodejs-modules': 'off',
    'import/no-unassigned-import': ['warn', { allow: ['**/*.css'] }],
    'import/prefer-default-export': 'off',

    /**
     * Disable style-rules
     */
    'id-length': 'off',
    'init-declarations': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    'no-magic-numbers': 'off',
    'no-ternary': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off',

    // Conflicts with oxlint
    'unicorn/number-literal-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-ternary': 'off',

    'vitest/require-hook': 'off',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/consistent-return': 'warn',
        '@typescript-eslint/strict-void-return': 'off',
        'import/no-nodejs-modules': 'error',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/prefer-tag-over-role': 'off',
        'react/jsx-handler-names': 'off',
        'react/jsx-max-depth': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/react-compiler': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/function-component-definition': 'off',

        // Disable - checked by react-compilter
        'react-perf/jsx-no-new-function-as-prop': 'off',
        'react-perf/jsx-no-new-object-as-prop': 'off',
      },
    },
    {
      files: ['**/*.test.ts?'],
      rules: {
        'prefer-importing-vitest-globals': 'off',
        'vitest/no-hooks': 'off',
        // 'vitest/prefer-expect-assertions': 'off',
        'vitest/require-mock-type-parameters': 'off',
        'vitest/no-focused-tests': 'error',
        'jest/no-focused-tests': 'error',
      },
    },
  ],

  ignorePatterns: [
    '.vscode',
    'bindings',
    'build',
    'cypress/coverage',
    'cypress/reports',
    'dist',
    'eslint.config.mjs',
    'node_modules',
  ],
})
