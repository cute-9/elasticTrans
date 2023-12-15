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
        target: "http://localhost:8080/", // 后端接口
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
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      builderOptions: {
        appId: "com.example.app",
        productName: "project", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2023", //版权信息
        directories: {
          output: "./dist", //输出文件路径
        },
        linux: {
          icon: "./public/favicon.ico", // 注意linux下图片的尺寸最好是256*256
          target: "deb", // 这个字段也可以是数组格式，具体可以参考electron-builder官网
        },
      },
    },
  },
};
