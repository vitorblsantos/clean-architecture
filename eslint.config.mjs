import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importXPlugin from 'eslint-plugin-import-x'
import promisePlugin from 'eslint-plugin-promise'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['.husky/**', '.vscode/**', 'dist/**', 'node_modules/**', '**/project.json', '**/webpack.config.js'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      'import-x': importXPlugin,
      promise: promisePlugin,
      prettier,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json',
        }),
      ],
    },
    rules: {
      ...promisePlugin.configs['flat/recommended'].rules,
      'import-x/no-unresolved': 'error',
      'import-x/named': 'error',
      'import-x/namespace': 'error',
      'import-x/default': 'error',
      'import-x/export': 'error',
      'import-x/no-named-as-default': 'warn',
      'import-x/no-named-as-default-member': 'warn',
      'import-x/no-duplicates': 'warn',
      indent: 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'no-extra-semi': 'off',
      semi: ['error', 'never'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          args: 'after-used',
        },
      ],
      'consistent-return': 'warn',
      'no-use-before-define': 'warn',
      'no-useless-constructor': 'off',
      'object-curly-spacing': ['error', 'always'],
    },
  },
  prettierRecommended,
  prettierConfig,
  {
    rules: {
      'prettier/prettier': ['error', { bracketSpacing: true, semi: false }],
    },
  },
  {
    files: ['**/*.config.js', '**/jest.preset.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
