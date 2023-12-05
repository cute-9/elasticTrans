/*
 * @desc:
 * @Author: Huang Qian
 * @Date: 2023-11-24 17:49:12
 */
// 请求封装
import axios from "axios";
import { Message } from "element-ui";
let popup = true;
let timer;
// 请求
const http = axios.create({
  // baseURL: "http://jsonplaceholder.typicode.com/",
  // http://localhost:8080/
  baseURL: "http://192.168.0.114:8080/",
  //baseURL: "http://192.168.0.119:3001/",
  headers: { "X-Requested-With": "XMLHttpRequest" },
  timeout: 99000,
});
// 请求拦截
http.interceptors.request.use(
  (config) => {
    config.headers.Authorization =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    config.headers.ssId =
      localStorage.getItem("ssId") || sessionStorage.getItem("ssId");
    config.headers.deviceUnique =
      localStorage.getItem("deviceUnique") ||
      sessionStorage.getItem("deviceUnique");
    return config;
  },
  (err) => {
    return err;
  }
);
// 响应拦截
http.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      if (
        localStorage.getItem("storage") === "localStorage" ||
        localStorage.getItem("ssId") ||
        localStorage.getItem("token") ||
        localStorage.getItem("Authorization")
      ) {
        localStorage.setItem("ssId", response.headers.ssid);
        localStorage.setItem("token", response.headers.authorization);
        localStorage.setItem("Authorization", response.headers.authorization);
      } else {
        sessionStorage.setItem("ssId", response.headers.ssid);
        sessionStorage.setItem("token", response.headers.authorization);
        sessionStorage.setItem("Authorization", response.headers.authorization);
      }
    }
    if (response.status === 200) {
      if (
        response.data.rCode === 64 ||
        response.data.rCode === 65 ||
        response.data.rCode === 67
      ) {
        if (window.loading) {
          window.loading.close();
        }
        if (popup) {
          Message.confirm("登录已过期，请重新登录2！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning",
          })
            .then(() => {
              if (timer) {
                clearTimeout(timer);
              }
              const hash = window.top.location.hash;
              if (hash) {
                const len = window.top.location.href.indexOf(hash);
              }
            })
            .catch(() => {
              clearTimeout(timer);
              popup = false;
              setTimeout(function () {
                popup = true;
              }, 10000);
            });
        }
        // eslint-disable-next-line no-undef
        return Promise.reject(response.data);
      } else {
        // eslint-disable-next-line no-undef
        return Promise.resolve(response.data);
      }
    } else {
      // eslint-disable-next-line no-undef
      return Promise.reject(response);
    }
  },
  (error) => {
    if (window.loading) {
      window.loading.close();
    }
    if (error && error.response) {
      if (error.response.status) {
        switch (error.response.status) {
          case 400:
            error.message = "错误请求";
            break;
          case 401:
            error.message = "未授权，请重新登录";
            break;
          case 403:
            error.message = "登录过期，请重新登录";
            break;
          case 404:
            error.message = "网络请求不存在";
            break;
          case 405:
            error.message = "请求方法错误";
            break;
          case 408:
            error.message = "请求超时";
            break;
          case 500:
            error.message = "服务器端出错";
            break;
          case 501:
            error.message = "网络未实现";
            break;
          case 502:
            error.message = "网络错误";
            break;
          case 503:
            error.message = "服务不可用";
            break;
          case 504:
            error.message = "网络超时";
            break;
          case 505:
            error.message = "http版本不支持该请求";
            break;
          default:
            error.message = `连接错误`;
        }
      } else {
        error.message = "无法请求,请联系管理员";
      }
    }
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);
// 返出
export default http;
