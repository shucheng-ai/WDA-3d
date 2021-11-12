let localConfig;

try {
  localConfig = require('./local.config');
} catch (e) {
  localConfig = null;
}

let argvs = JSON.parse(process.env.npm_config_argv).original;
//下面的步骤就是获取命令行参数。
let app = argvs.slice(2)[0] ? argvs.slice(2)[0].substring(2) : 'v1'; // v1 老版本 v2 新版本;
console.log('app: ', app);

const defaultapi =
  app === 'v1' ? 'http://127.0.0.1:45500/' : 'http://127.0.0.1:8000/';
const api = localConfig ? localConfig.api : defaultapi;
console.log(api);

const publicPath = process.env.NODE_ENV === 'production' ? '/static-3d' : '/';

module.exports = {
  publicPath: publicPath,
  outputDir: '../dist/',
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    compress: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: api,
      },
    },
  },
};
