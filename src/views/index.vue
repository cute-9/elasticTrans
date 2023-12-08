<template>
  <div class="home">
    <!-- <el-container style="height: 100%"> -->
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        @select="handleSelect"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="home"> 首页</el-menu-item>
        <el-menu-item index="databaseManagement">数据库管理 </el-menu-item>
        <!-- <el-menu-item index="dataParsing">数据解析 </el-menu-item> -->
        <el-menu-item index="dataQueries">数据查询 </el-menu-item>
        <el-menu-item index="featuredApp">特色应用</el-menu-item>
      </el-menu></el-header
    >
    <el-container style="height: 100%" v-loading="loading">
      <el-aside
        width="210px"
        style="border-right: 1px solid #eeeeee"
        v-if="visible"
      >
        <el-menu
          class="el-menu-vertical-demo container"
          router
          :default-active="activePath"
          @open="handleOpen"
        >
          <el-submenu
            v-for="(item, index) in routeNum"
            :key="index + item"
            :index="item.redictRoute"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group title="">
              <el-menu-item
                v-for="(items, indexs) in item.meteTitle"
                :key="indexs + items"
                :index="items.metaRoute"
              >
                <i class="el-icon-s-unfold"></i>
                {{ items.title }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :class="[visible ? 'el-content-main' : 'el-content-mains']"
        ><router-view></router-view
      ></el-main>
    </el-container>
    <!-- </el-container> -->
  </div>
</template>

<script>
export default {
  name: "IndexView",
  data() {
    return {
      activeIndex: "home",
      visible: false,
      loading: false,
      // 路由
      routeNum: [
        {
          title: "索引管理",
          redictRoute: "databaseManagement",
          meteTitle: [
            {
              metaRoute: "databaseManagement",
              title: "索引管理",
            },
            {
              metaRoute: "dataParsing",
              title: "数据解析",
            },
          ],
        },
      ],
    };
  },
  computed: {
    activePath() {
      return this.routeNum[0].redictRoute;
    },
  },
  mounted() {
    // this.activeIndex = "home";
    this.$router.push("/home");
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      // const loading = this.$loading({
      //   text: "加载中...",
      //   spinner: "el-icon-loading",
      // });
      this.loading = true;
      this.visible = false;
      switch (key) {
        case "home":
          this.visible = false;
          setTimeout(() => {
            this.loading = false;
          }, 500);
          this.$router.push({
            path: key,
          });
          break;
        case "databaseManagement":
          setTimeout(() => {
            this.visible = true;
            this.loading = false;
          }, 500);
          this.routeNum = [
            {
              title: "数据库管理",
              redictRoute: "databaseManagement",
              meteTitle: [
                {
                  metaRoute: "databaseManagement",
                  title: "索引管理",
                },
                {
                  metaRoute: "dataParsing",
                  title: "数据解析",
                },
              ],
            },
          ];
          this.$router.push({
            path: key,
          });
          break;
        case "dataQueries":
          this.routeNum = [
            {
              title: "数据查询",
              redictRoute: "dataQueries",
              meteTitle: [
                {
                  metaRoute: "dataQueries",
                  title: "数据查询",
                },
                {
                  metaRoute: "videoQueries",
                  title: "文件查询",
                },
              ],
            },
          ];
          this.$router.push({
            path: key,
          });
          setTimeout(() => {
            this.visible = true;
            this.loading = false;
          }, 500);
          break;
        case "featuredApp":
          this.visible = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
          this.routeNum = [];
          break;
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  position: absolute;
  height: calc(100% - 60px);
  width: 100%;
  .el-header {
    padding: 0px !important;
  }
  .container {
    ::v-deep .el-menu {
      height: 100%;
      border: 0 !important; //垂直时，去除右侧白边
    }
  }
  .el-content-main {
    height: 100%;

    // background-color: red;
  }
  .el-content-mains {
    height: 100%;
    padding: 0px;
  }
}

::v-deep .el-menu {
  border: 0 !important; //垂直时，去除右侧白边
}
</style>
