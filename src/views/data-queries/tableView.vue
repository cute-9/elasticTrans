<template>
  <div class="content">
    <el-table :data="tableData" height="100%" border class="table">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in thead"
        :key="index + item"
        :prop="item"
        :label="item"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { listMapping, search, highSearch } from "@/api/dataQueries";
export default {
  props: {
    tableType: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    indexName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      thead: [],
      tableData: [],
      total: 0,
      currentPage: 0,
      pageSize: 5,
      indexMethod: 1,
    };
  },
  created() {
    this.getThead();
    this.getInfo();
  },
  methods: {
    getThead() {
      listMapping({
        indexName: this.indexName,
      }).then((res) => {
        const { data, responseCode } = res;
        this.options = [];
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
            this.thead.push(key);
          }
        }
      });
    },
    getInfo() {
      let url = this.tableType == "hight" ? highSearch : search;
      const loading = this.$loading({
        text: "加载中...",
        spinner: "el-icon-loading",
      });
      url({
        ...this.formData,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      })
        .then((res) => {
          // console.log(res);
          const { responseCode, responseMsg, data } = res;
          if (responseCode == 200) {
            this.tableData = data.pageList;
            this.total = data.totalNum;
            loading.close();
            // console.log(this.tableData)
            this.$message.success(responseMsg);
          } else {
            this.$message.error(responseMsg);
          }
        })
        .catch((err) => {
          loading.close();
          console.log(err);
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getInfo();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 80vh;
  .table {
    height: calc(100% - 200px);
  }
}
</style>
