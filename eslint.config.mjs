import eslint from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import github from 'eslint-plugin-github'

export default [
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  github.getFlatConfigs().recommended,
  {
    rules: {
      'importPlugin/no-unresolved': 'off'
    }
  },
  ...github.getFlatConfigs().typescript,
  {
    files: ['__tests__/**/*.test.ts'],
    plugins: {jest: jest},
    languageOptions: {
      globals: jest.environments.globals.globals
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  }
]
