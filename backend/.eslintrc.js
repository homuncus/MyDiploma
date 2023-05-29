module.exports = {
  env: {
    node: true,
    es6: true,
  },
  plugins: [
  ],
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    use: true,
    document: true,
    $: true,
    __: true,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 0,
    'comma-dangle': 0,
    'class-methods-use-this': 0,
    'no-await-in-loop': 0,
    'no-cond-assign': 0,
    strict: 0,
    // 'no-restricted-syntax': 0,
    'max-len': ['error', { code: 150 }],
    // 'no-throw-literal': 0,
    // 'no-console': 0,
    // 'no-underscore-dangle': ['error', { allow: ['foo_', '_bar'] }],
    // 'padded-blocks': ['error', 'never'],
    // 'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    // 'prefer-arrow-callback': 0,
    'func-names': 0,
    // semi: 0,
    camelcase: 'off',
    // 'object-curly-newline': 0,
  },

};
