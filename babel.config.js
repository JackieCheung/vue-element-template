module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: ['lodash', ['import', {
    'libraryName': 'view-design',
    'libraryDirectory': 'src/components'
  }]]
}
