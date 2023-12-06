<!-- 数据库管理 -->
<template>
  <div v-loading="loading" class="content">
    <el-button type="primary" size="mini" @click="btnClick('add')">
      <i class="el-icon-circle-plus-outline"></i>
      新增</el-button
    >
    <el-table :data="tableData" border class="table">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column prop="date" label="任务名称"> </el-table-column>
      <el-table-column prop="name" label="任务类型"> </el-table-column>
      <el-table-column prop="address" label="状态"> </el-table-column>
      <el-table-column prop="address" label="开始时间"> </el-table-column>
      <el-table-column prop="address" label="结束时间"> </el-table-column>
      <el-table-column prop="address" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="btnClick('stop', scope.row)"
            >停止</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="btnClick('delete', scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
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
    <el-dialog
      v-if="dialogVisible"
      title="新增"
      width="800px"
      :visible.sync="dialogVisible"
    >
      <formEdit @handleClose="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import formEdit from "./formEdit.vue";
import { getAll, rerunInfo } from "@/api/dataParse";
export default {
  components: {
    formEdit,
  },
  data() {
    return {
      tableData: [ ],
      indexMethod: 1,
      loading: true,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      dialogVisible: false,
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    btnClick(type, row) {
      switch (type) {
        case "add":
          this.dialogVisible = true;
          break;
      }
    },
    getInfo() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      getAll(params)
        .then((res) => {
          this.loading = false;
          const { data, responseCode } = res;
          if (responseCode == 200) {
            this.tableData = data.List;
            this.total = data.totalNum;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("网络错误!");
        });
    },
    handleClose() {
      this.dialogVisible = false;
      this.getInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.table {
  width: 100%;
  height: calc(100% - 100px);
  margin-top: 10px;
}
</style>
