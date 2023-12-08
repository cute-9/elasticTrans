<!-- 数据库管理 -->
<template>
  <div class="content" v-loading="loading">
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
      <el-table-column prop="indexName" label="索引名称"> </el-table-column>
      <el-table-column prop="keyNum" label="数据统计"> </el-table-column>
      <el-table-column prop="" label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="btnClick('view', scope.row)"
            >查看结构</el-button
          >
          <el-button
            type="warning"
            size="mini"
            @click="btnClick('clear', scope.row)"
            >清空索引</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="btnClick('delete', scope.row)"
            >删除</el-button
          ></template
        >
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
    >
      <el-form
        v-if="dialogTitle == '新增'"
        ref="form"
        :model="form"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item label="索引名" prop="indexName">
          <el-input
            v-model="form.indexName"
            placeholder="请输入索引名"
          ></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="onSubmit" size="mini"
            >提交</el-button
          >
          <el-button @click="cancel" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-else
        :data="dialogData"
        border
        height="400px"
        v-loading="dialogLoading"
      >
        <el-table-column prop="indexName" label="字段名称"> </el-table-column>
        <el-table-column prop="indexType" label="字段类型"> </el-table-column>
      </el-table>
    </el-dialog>
    <!-- <el-pagination
      style="margin-top: 10px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination> -->
  </div>
</template>

<script>
import { docStatic, deleteInfo, truncate, createInfo } from "@/api/dataManage";
import { listMapping } from "@/api/dataQueries";
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      indexMethod: 1,
      total: 0,
      currentPage: 0,
      pageSize: 20,
      dialogVisible: false,
      dialogData: [],
      dialogTitle: "",
      dialogLoading: false,
      form: {},
      formRules: {
        indexName: [
          {
            required: true,
            message: "请输入索引名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    getInfo() {
      this.dialogLoading = true;
      docStatic()
        .then((res) => {
          this.loading = false;
          const { data, responseCode, responseMsg } = res;
          if (responseCode == 200) {
            let tableData = [];
            for (let key in data) {
              tableData.push({
                indexName: key,
                keyNum: data[key],
              });
              this.tableData = tableData;
            }
          } else {
            this.$message.error(responseMsg);
          }
        })
        .catch(() => {
          this.$message.error("网络错误，请稍后重试！");
          this.loading = false;
        });
    },
    btnClick(type, row) {
      switch (type) {
        case "view":
          this.dialogVisible = true;
          this.dialogTitle = "查看结构";
          listMapping({ indexName: row.indexName }).then((res) => {
            this.dialogLoading = false;
            const { responseCode, responseMsg, data } = res;
            this.dialogData = [];
            if (responseCode == 200) {
              var target;
              const deep = (obj, keys) => {
                if (obj instanceof Object) {
                  for (let key in obj) {
                    if (key != keys) {
                      deep(obj[key], keys);
                    } else {
                      target = obj[key];
                    }
                  }
                }
                return target;
              };
              let obj = deep(data, "properties");
              for (let key in obj) {
                this.dialogData.push({
                  indexName: key,
                  indexType: obj[key].type,
                });
              }
            }
          });
          break;
        case "clear":
          this.$confirm("此操作将永久清空该索引, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              truncate({ indexName: row.indexName }).then((res) => {
                const { responseCode, responseMsg } = res;
                if (responseCode == 200) {
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
                message: "已取消清空",
              });
            });
          break;
        case "delete":
          this.$confirm("此操作将永久删除该索引, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              deleteInfo({ indexName: row.indexName }).then((res) => {
                const { responseCode, responseMsg } = res;
                if (responseCode == 200) {
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
          break;
        case "add":
          this.dialogVisible = true;
          this.dialogTitle = "新增";
          break;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createInfo({
            indexName: this.form.indexName,
          }).then((res) => {
            const { responseCode, responseMsg } = res;
            if (responseCode == 200) {
              this.$message.success(responseMsg);
              this.getInfo();
              this.dialogVisible = false;
            } else {
              this.$message.error(responseMsg);
            }
          });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  width: 100%;
  .table {
    margin-top: 10px;
    height: calc(100% - 50px);
    width: 100%;
  }
}
</style>
