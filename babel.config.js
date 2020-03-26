module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    // equals to '@vue/babel-preset-jsx' refer to babel preset shorthand
    // detail: https://babeljs.io/docs/en/presets#preset-shorthand
    '@vue/jsx'
  ],
  plugins: ['lodash', ['import', {
    'libraryName': 'view-design',
    'libraryDirectory': 'src/components'
  }]]
}
