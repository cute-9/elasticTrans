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
      },
      {
        path: "/dataQueries",
        name: "dataQueries",
        component: () => import("@/views/data-queries"),
      },
      {
        path: "/dataParsing",
        name: "dataParsing",
        component: () => import("@/views/data-parsing"),
      },
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
