<template>
  <div class="add-content" v-loading="Loading">
    <el-form ref="form" :model="form" label-width="130px" :rules="formRules">
      <el-form-item label="新增类型">
        <el-select v-model="form.value" placeholder="请选择新增类型" disabled>
          <el-option label="新增目录" value="directory">新增目录</el-option>
          <el-option label="上传文件" value="add">上传文件/文件夹</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目录地址" v-show="addType == 'directory'">
        <el-input
          v-model="form.pathLocal"
          placeholder="请输入目录名称，例如：path"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="目录名称"
        v-show="addType == 'directory'"
        prop="path"
      >
        <el-input
          v-model="form.path"
          placeholder="请输入目录名称，例如：path"
        ></el-input>
      </el-form-item>
      <el-form-item label="当前目录地址" v-show="addType == 'add'">
        <el-input
          v-model="form.pathLocal"
          placeholder="请输入文件名,例如path"
          disabled
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="目录名称" v-show="addType == 'add'" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入目录名称,例如path"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="本地文件路径" v-show="addType == 'add'" prop="path">
        <el-input
          v-model="form.localFolderPath"
          placeholder="请输入文件地址"
        ></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadFilesToHdfs, createHdfsDirectory } from "@/api/fileQueries";
export default {
  props: {
    docPath: {
      type: String,
      default: "/",
    },
    addType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        value: "",
        pathLocal: "/",
        path: "",
        localFolderPath: "",
      },
      formRules: {
        path: [
          {
            required: true,
            message: "请输入文件夹名",
            trigger: "blur",
          },
        ],
        localFolderPath: [
          {
            required: true,
            message: "请输入文件地址",
            trigger: "blur",
          },
        ],
      },
      Loading: false,
    };
  },
  mounted() {
    this.form.value = this.addType;
    this.form.pathLocal = this.docPath ? this.docPath + "/" : "/";
  },
  watch: {
    "form.path": {
      handler(newValue) {
        this.form.pathLocal = `${
          this.docPath ? this.docPath + "/" : "/"
        }${newValue}`;
      },
      deep: true,
    },
  },
  methods: {
    onSubmit() {
      let url =
        this.form.value == "directory"
          ? createHdfsDirectory
          : uploadFilesToHdfs;
      let params =
        this.form.value == "directory"
          ? {
              path: this.form.pathLocal,
            }
          : {
              path: this.docPath,
              localFolderPath: encodeURIComponent(this.form.localFolderPath),
            };
      this.Loading = true;
      url(params).then((res) => {
        const { responseCode, responseMsg } = res;
        this.Loading = false;
        if (responseCode == 200) {
          this.$message.success(responseMsg);
          this.$emit("handleClose");
        } else {
          this.$message.error(responseMsg);
        }
      });
    },
    cancel() {
      this.$emit("handleClose");
    },
  },
};
</script>

<style lang="less" scoped>
.add-content {
  height: 300px;
}
</style>
