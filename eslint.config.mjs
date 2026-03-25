import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx']
const allExtensions = [...typeScriptExtensions, '.js', '.jsx', '.mjs', '.cjs']

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
      import: importPlugin,
      promise: promisePlugin,
      prettier,
    },
    settings: {
      'import/extensions': allExtensions,
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/parsers': {
        '@typescript-eslint/parser': typeScriptExtensions,
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: { extensions: allExtensions },
      },
    },
    rules: {
      ...promisePlugin.configs['flat/recommended'].rules,
      'import/no-unresolved': ['error', { ignore: ['^firebase-admin/'] }],
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',
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
