<!-- 数据库管理 -->
<template>
  <div>
    <el-table :data="tableData" height="700px" border style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column prop="date" label="索引名称"> </el-table-column>
      <el-table-column prop="name" label="数据类型"> </el-table-column>
      <el-table-column prop="address" label="字段名"> </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      indexMethod: 1,
      total: 0,
      currentPage: 0,
      pageSize: 20,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped></style>
