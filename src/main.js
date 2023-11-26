/*
 * @desc:
 * @Author: Huang Qian
 * @Date: 2023-11-24 17:34:36
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import qs from "qs";
import http from "@/utils/request";
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$http = http;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
