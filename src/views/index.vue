<template>
  <div>
    <el-container>
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
          <el-menu-item index="dataParsing">数据解析 </el-menu-item>
          <el-menu-item index="dataQueries">数据查询 </el-menu-item>
        </el-menu></el-header
      >
      <el-container>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          router
          v-if="activeIndex != 'home'"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据库管理</span>
            </template>
            <el-menu-item-group title="">
              <el-menu-item index="databaseManagement">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "IndexView",
  data() {
    return { activeIndex: "home" };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
  },
};
</script>

<style>
.el-header {
  padding: 0px !important;
}
</style>
