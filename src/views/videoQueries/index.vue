<!-- 数据库管理 -->
<template>
  <div v-loading="Loading">
    <el-button type="primary" size="mini" v-if="visible" @click="backClick">
      <i class="el-icon-refresh-right"></i>
      返回</el-button
    >
    <el-button type="primary" size="mini" @click="backClick">
      <i class="el-icon-circle-plus-outline"></i>
      新增</el-button
    >

    <el-table :data="tableData" height="700px" border class="table">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column prop="docName" label="文件名"> </el-table-column
      ><el-table-column prop="downLoadPath" label="文件地址"> </el-table-column>
      <el-table-column
        prop="name"
        label="是否是文件"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.isFile ? "是" : "否" }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="btnClick(scope.row, 'view')"
            >查看</el-button
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
  </div>
</template>

<script>
import { getHdfsCatalog, getHdfsFilePlay } from "@/api/fileQueries";
import { Loading } from "element-ui";
export default {
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
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo(data) {
      this.Loading = true;
      let params = {
        path: data ? data : "",
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      getHdfsCatalog(params).then((res) => {
        const { data, responseCode } = res;
        this.Loading = false;
        if (responseCode == 200) {
          this.tableData = data.pageList;
          this.total = data.totalNum;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInfo(this.docPath);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInfo(this.docPath);
    },
    btnClick(row, type) {
      console.log(row);
      this.docPath = row.docPath;
      if (row.isFile) {
        switch (type) {
          case "view":
            window.open(
              `http://192.168.0.114:8080/hdfs/getHdfsFilePlay?path=${row.docPath}`,
              "_blank"
            );
            break;
          case "down":
            window.open(row.downLoadPath, "_blank");
            break;
        }
      } else {
        this.visible = true;
        this.getInfo(row.docPath);
      }
    },
    backClick() {
      this.visible = false;
      this.pageSize = 20;
      this.currentPage = 1;
      this.getInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  margin-top: 10px;
}
</style>
