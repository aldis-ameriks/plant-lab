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
        aspects: ['noHref', 'invalidHref', 'preferButton']
      }
    ],
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': ['error', { code: 120 }]
  },
  globals: {
    document: true
  }
};
