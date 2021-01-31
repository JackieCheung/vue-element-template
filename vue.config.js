'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = process.env.VUE_APP_TITLE || 'Vue Element Template' // page title

// const timestamp = +new Date()

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false, // Whether to automatically open the browser when the project starts OR Set by npm command parameter --open
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    before: require('./mock/mock-server.js')
  },
  // css: {
  //   extract: { // 重构打包编译后的css文件名称【模块名称.时间戳.css】
  //     filename: `static/css/[name].${timestamp}.css`,
  //     chunkFilename: `static/css/[name].${timestamp}.css`
  //   }
  // },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '_v': resolve('src/views'),
        '_c': resolve('src/components')
      }
    }
    // , output: { // 重构打包编译后的js文件名称【模块名称.时间戳.js】
    //   filename: `static/js/[name].${timestamp}.js`,
    //   chunkFilename: `static/js/[name].${timestamp}.js`
    // }
  },
  chainWebpack (config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set loader for .cur
    config.module
      .rule('url-loader')
      .test(/\.(cur)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .end()

    /**
     * preserveWhitespace Deprecated since vue@2.6
     * Recommend whitespace: 'condense', it is the default config in new vue-cli https://github.com/vuejs/vue-cli/pull/3853
     * Detail: https://github.com/vuejs/vue/issues/9208#issuecomment-450012518
     */
    // // set preserveWhitespace
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap(options => {
    //     options.compilerOptions.preserveWhitespace = true
    //     return options
    //   })
    //   .end()

    // // use vue-cli default source-map
    // config
    //   // https://webpack.js.org/configuration/devtool/#development
    //   .when(process.env.NODE_ENV === 'development',
    //     // config => config.devtool('cheap-source-map')
    //     config => config.devtool('eval-source-map')
    //   )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization
            .splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )

    if (process.env.NODE_ENV === 'production') {
      // Visualize size of webpack output files with an interactive zoomable treemap.
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin).tap(() => [{
        analyzerMode: 'static'
      }])

      // Create smaller Lodash builds by replacing feature sets of modules with noop, identity, or simpler alternatives.
      const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
      config.plugin('lodashModuleReplacement').use(new LodashModuleReplacementPlugin())

      // // 开启 gzip 压缩
      // const CompressionPlugin = require('compression-webpack-plugin')
      // config.plugin('compressionPlugin')
      //   .use(new CompressionPlugin({
      //     algorithm: 'gzip',
      //     test: /\.(js|css|json|txt|html|ico|svg|bmp|woff|woff2|ttf)(\?.*)?$/i, // 所有匹配该正则的资源都会被处理，图片（png、gif、jpg、jpeg）不进行压缩，默认值是全部资源
      //     threshold: 1024 * 10, // 只有大小大于该值的资源会被处理，单位是 bytes，默认值是 0
      //     deleteOriginalAssets: false, // 是否删除原始资源，默认值是 false，若设置为 true，则 Nginx 的 gzip_static 静态压缩不会生效，需要 Nginx 配置在线压缩
      //     minRatio: 0.8 // 只有压缩率（压缩大小 ÷ 原始大小）小于该值的资源才会被处理，默认值是 0.8
      //   }))
    }
  }
}
