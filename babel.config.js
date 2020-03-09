module.exports = {
  presets: [
    '@vue/app',
    '@vue/babel-preset-jsx'
  ],
  'env': {
    'development': {
      'plugins': ['require-context-hook']
    }
  }
}
