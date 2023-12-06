<template>
  <div class="add-content" v-loading="Loading">
    <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
      <el-form-item label="新增类型">
        <el-select v-model="form.value" placeholder="请选择新增类型">
          <el-option label="新增文件地址" value="1">新增文件地址</el-option>
          <el-option label="上传文件" value="2">上传文件</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件名" v-show="form.value == '1'" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入文件名，例如：/path"
        ></el-input>
      </el-form-item>
      <el-form-item label="文件夹" v-show="form.value == '2'" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入文件名,例如/path"
        ></el-input>
      </el-form-item>
      <el-form-item label="文件地址" v-show="form.value == '2'" prop="path">
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
  data() {
    return {
      form: {
        value: "1",
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
  methods: {
    onSubmit() {
      let url = this.form.value == 1 ? createHdfsDirectory : uploadFilesToHdfs;
      let params =
        this.form.value == 1
          ? {
              path: this.form.path,
            }
          : {
              path: this.form.path,
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
