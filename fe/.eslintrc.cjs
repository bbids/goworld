module.exports = {
  root: true,
  env: { browser: true, es2024: true },
  globals: {
    '__MUTATION__': 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react-refresh',
    '@stylistic/js'
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/no-trailing-spaces': 'error',
    '@stylistic/js/quotes': ['warn', 'single'],
    'react/prop-types': 'off'
  },
}
