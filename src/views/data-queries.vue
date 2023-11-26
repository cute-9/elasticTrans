<!-- 数据查询 -->
<template>
  <div style="text-align: center">
    <!-- <p>数据查询</p> -->
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="全文搜索" name="first"></el-tab-pane>
        <el-tab-pane label="高级搜索" name="second"></el-tab-pane>
      </el-tabs>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        v-if="this.activeName == 'first'"
      >
        <el-form-item label="数据类型：">
          <el-cascader
            v-model="value"
            :options="options"
            :props="{ lazy: true, lazyLoad: this.lazyLoad }"
            @change="handleChange"
          ></el-cascader> </el-form-item
        ><el-form-item label="">
          <el-input v-model="formInline.user" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        v-if="this.activeName == 'second'"
      >
        <el-form-item label="数据类型：">
          <el-cascader
            v-model="value"
            :options="options"
            :props="{ lazy: true, lazyLoad: this.lazyLoad }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.user" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      activeName: "first",
      value: [],
      key: 0,
      options: [
        {
          value: "zhinan",
          label: "指南",
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      console.log(this.value, "submit!");
    },
    handleChange() {},
    lazyLoad(node, resolve) {
      console.log(node, resolve);
      const { level } = node;
      let id = 0;
      setTimeout(() => {
        const nodes = Array.from({ length: level + 1 }).map((item) => ({
          value: ++id,
          label: `选项${id}`,
          leaf: level >= 2,
        }));
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        resolve(nodes);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
