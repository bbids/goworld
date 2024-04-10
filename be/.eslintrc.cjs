module.exports = {
  root: true,
  env: { node: true, es2024: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.mjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    '@stylistic/js'
  ],
  rules: {
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/no-trailing-spaces': 'error',
    '@stylistic/js/quotes': ['warn', 'single']
  },
};
