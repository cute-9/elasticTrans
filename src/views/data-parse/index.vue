<!-- 数据库管理 -->
<template>
  <div v-loading="loading" class="content">
    <el-button type="primary" size="mini" @click="btnClick('add')">
      <i class="el-icon-circle-plus-outline"></i>
      新增</el-button
    >
    <div class="table">
      <el-table :data="tableData" border height="100%">
        <el-table-column
          type="index"
          width="50"
          label="序号"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称"> </el-table-column>
        <el-table-column prop="taskType" label="任务类型"> </el-table-column>
        <el-table-column prop="taskStateName" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.stateType">{{
              scope.row.taskStateName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="finishTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column prop="" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.taskState == 0"
              type="primary"
              size="mini"
              @click="btnClick('stop', scope.row)"
              >重新运行</el-button
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
    </div>

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
import { getAll, rerunInfo, deleteInfo } from "@/api/dataParse";
export default {
  components: {
    formEdit,
  },
  data() {
    return {
      tableData: [],
      indexMethod: 1,
      loading: true,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      dialogVisible: false,
    };
  },
  created() {
    // 初始化数据
    this.getInfo();
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInfo();
    },
    // 按钮点击
    btnClick(type, row) {
      switch (type) {
        case "add":
          this.dialogVisible = true;
          break;
        case "stop":
          this.runInfo(row.id);
          break;
        case "delete":
          this.deleteInfo(row.id);
          break;
      }
    },
    // 重新运行
    runInfo(id) {
      this.$confirm("此操作将重新运行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          rerunInfo({ id: id }).then((res) => {
            const { responseCode, responseMsg } = res;
            if (responseCode == 200) {
              this.loading = false;
              this.$message.success(responseMsg);
              this.getInfo();
            } else {
              this.$message.error(responseMsg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重新运行",
          });
        });
    },
    // 删除
    deleteInfo(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          deleteInfo({ id: id }).then((res) => {
            const { responseCode, responseMsg } = res;
            if (responseCode == 200) {
              this.loading = false;
              this.$message.success(responseMsg);
              this.getInfo();
            } else {
              this.$message.error(responseMsg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取信息
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
            this.total = data.total;
            data.list.forEach((item) => {
              item.startTime = this.getTime(item.startTime);
              item.finishTime = item.finishTime
                ? this.getTime(item.finishTime)
                : "——";
              switch (item.taskState) {
                case 0:
                  item["stateType"] = "warning";
                  break;
                case 1:
                  item["stateType"] = "success";
                  break;
                case 2:
                  item["stateType"] = "danger";
                  break;
              }
            });
            this.tableData = data.list;
          }
        })
        .catch((err) => {
          console.log(err, "rr");
          this.loading = false;
          this.$message.error("网络错误,请稍后重试!");
        });
    },
    // 新增弹窗关闭
    handleClose() {
      this.dialogVisible = false;
      this.getInfo();
    },
    // 时间戳转换成时间
    getTime(times) {
      let time = new Date(times);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
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
