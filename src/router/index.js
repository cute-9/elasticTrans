import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index"),
    redirect: "/home",
    children: [
      {
        path: "/databaseManagement",
        name: "databaseManagement",
        component: () => import("@/views/database-management"),
        meta: {
          activeMenu: "/databaseManagement",
        },
      },
      {
        path: "/dataQueries",
        name: "dataQueries",
        component: () => import("@/views/data-queries/data-queries"),
        meta: {
          activeMenu: "/dataQueries",
        },
      },
      {
        path: "/dataParsing",
        name: "dataParsing",
        component: () => import("@/views/data-parse/index"),
        meta: {
          activeMenu: "/dataParsing",
        },
      },
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home"),
        meta: {
          activeMenu: "/home",
        },
      },
      {
        path: "/videoQueries",
        name: "videoQueries",
        component: () => import("@/views/videoQueries/index"),
        meta: {
          activeMenu: "/videoQueries",
        },
      },
      {
        path: "/feature",
        name: "feature",
        component: () => import("@/views/feature"),
        meta: {
          activeMenu: "/feature",
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
// 取消重复路由报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  //如果用户访问登录页，直接放行
  // if (to.path === "/login") return next();
  // //从sessionStorage中获取到保存的token值
  // const tokenStr = window.sessionStorage.getItem("token");
  // //没有token，强制跳转到登录页面
  // if (!tokenStr) return next("/login");
  next(); //有token，直接放行
});
export default router;
