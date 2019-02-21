module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react', 'prettier'],
  rules: {
    'react/jsx-filename-extension': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 100, 'trailingComma': 'es5' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': ['error', { code: 100 }],
    'react/destructuring-assignment': ['warn', 'always', { 'ignoreClassFields': true }],
    'no-use-before-define': ['error', { 'functions': false, 'classes': false }],
  },
  globals: {
    document: true,
    window: true,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'paths': ['src'],
      },
    },
  },
};
