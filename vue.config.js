const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
        .set('@',resolve('./examples'))
    // config.module
    //   .rule('js')
    //   .test(/\.js$/)
    //   .include
    //     .add(__dirname + 'packages')
    //     .end()
    //   .use('babel')
    //     .loader('babel-loader')
    //     .end()
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production';
      config["performance"] = {
        hints: false
      }
    }
  },
  css: {
    extract: false,
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  }
}