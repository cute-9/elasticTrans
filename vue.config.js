/*
 * @desc:
 * @Author: Huang Qian
 * @Date: 2023-10-20 08:34:17
 */
const { defineConfig } = require("@vue/cli-service");
module.exports = {
  ...defineConfig({
    transpileDependencies: true,
  }),
  lintOnSave: false,
  publicPath: "./",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://jsonplaceholder.typicode.com/", // 后端接口
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "";
      return args;
    });
  },
};
