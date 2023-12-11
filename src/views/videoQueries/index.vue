<!-- 数据库管理 -->
<template>
  <div v-loading="Loading" class="content">
    <el-button type="primary" size="mini" v-if="visible" @click="backClick">
      <i class="el-icon-refresh-right"></i>
      返回</el-button
    ><el-button type="primary" size="mini" @click="addClick('directory')">
      <i class="el-icon-circle-plus-outline"></i>
      新增目录</el-button
    >
    <el-button type="primary" size="mini" @click="addClick('add')">
      <i class="el-icon-circle-plus-outline"></i>
      上传文件</el-button
    >

    <el-table :data="tableData" height="700" border class="table">
      >
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column prop="docName" label="文件名" width="200">
      </el-table-column
      ><el-table-column prop="downLoadPath" label="路径"> </el-table-column>
      <el-table-column prop="name" label="路径类型" width="100" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.isFile ? "文件" : "文件夹" }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isFile"
            type="success"
            size="mini"
            @click="btnClick(scope.row, 'view')"
            >查看</el-button
          >
          <el-button
            v-if="!scope.row.isFile"
            type="warning"
            size="mini"
            @click="btnClick(scope.row, 'show')"
            >展开</el-button
          >
          <el-button
            :disabled="!scope.row.isFile"
            type="primary"
            size="mini"
            @click="btnClick(scope.row, 'down')"
            >下载</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="btnClick(scope.row, 'delete')"
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
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog v-if="dialogVisible" title="新增" :visible.sync="dialogVisible">
      <formEdit
        @handleClose="handleClose"
        :docPath="docPath"
        :addType="addType"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getHdfsCatalog, deleteHdfsPath } from "@/api/fileQueries";
import formEdit from "./formEdit.vue";
export default {
  components: {
    formEdit,
  },
  data() {
    return {
      tableData: [],
      indexMethod: 1,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      visible: false,
      backName: "",
      Loading: true,
      fileUrl: "",
      docPath: "",
      dialogVisible: false,
      // 新增类型
      addType: "",
    };
  },
  created() {
    this.getInfo();
    console.log(this.$axios);
  },
  methods: {
    getInfo(data) {
      this.Loading = true;
      let params = {
        path: data ? data : "",
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      getHdfsCatalog(params)
        .then((res) => {
          const { data, responseCode } = res;
          this.Loading = false;
          if (responseCode == 200) {
            data.pageList.forEach((item) => {
              if (!item.isFile) {
                item["hasChildren"] = true;
              }
            });
            this.tableData = data.pageList;
            this.total = data.totalNum;
          }
        })
        .catch(() => {
          this.Loading = false;
          this.$message.error("网络错误，请稍后重试！");
        });
    },
    handleClose() {
      this.dialogVisible = false;
      this.getInfo(this.docPath);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInfo(this.docPath);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInfo(this.docPath);
    },
    load(tree, treeNode, resolve) {
      console.log(tree, "tree");
      let tableData = [];
      getHdfsCatalog({
        path: tree.docPath,
      }).then((res) => {
        const { data, responseCode } = res;
        this.Loading = false;
        if (responseCode == 200) {
          data.pageList.forEach((item) => {
            if (!item.isFile) {
              item["hasChildren"] = true;
            }
          });
          tableData = data.pageList;
          resolve(tableData);
        }
      });
    },
    btnClick(row, type) {
      console.log(row);
      if (type == "delete") {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteHdfsPath({ path: row.docPath }).then((res) => {
              const { responseCode, responseMsg } = res;
              if (responseCode == 200) {
                this.$message.success(responseMsg);
                this.getInfo(this.docPath);
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
      } else if (row.isFile) {
        var iTop = (screen.height - 622) / 2; //获得窗口的垂直位置;
        var iLeft = (screen.width - 1000) / 2; //获得窗口的水平位置;
        console.log(iLeft, "ileft");
        switch (type) {
          case "view":
            window.open(
              `${window.serverconfig.ip}hdfs/getHdfsFilePlay?path=${row.docPath}`,
              "_blank",
              `height=622, width=1000 top=${iTop},left=${iLeft},toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no `
            );
            break;
          // 下载
          case "down":
            window.open(row.downLoadPath, "_blank");
            break;
        }
      } else {
        // 返回按钮
        this.visible = true;
        this.docPath = row.docPath;
        this.getInfo(row.docPath);
      }
    },
    backClick() {
      this.visible = false;
      this.pageSize = 20;
      this.currentPage = 1;
      this.docPath = "";
      this.getInfo();
    },
    addClick(type) {
      this.addType = type;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  .table {
    width: 100%;
    // height: calc(100% - 100px);
    margin-top: 10px;
  }
}
</style>
