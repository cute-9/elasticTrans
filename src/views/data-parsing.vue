<!-- 数据解析 -->
<template>
  <div>
    <p style="text-align: center">数据解析</p>
    <div class="form-contain">
      <el-form
        ref="form"
        :model="formInline"
        :rules="formRules"
        label-width="180px"
      >
        <el-form-item label="文件地址" prop="csvPath">
          <el-input
            v-model="formInline.csvPath"
            placeholder="请输入文件地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="索引名" prop="indexName">
          <el-select v-model="formInline.indexName" placeholder="请选择索引名">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否自定义标题" prop="isCustomTitle">
          <el-radio-group v-model="formInline.isCustomTitle">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="csv文件首行是否有标题" prop="isHasTitle">
          <el-radio-group v-model="formInline.isHasTitle">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否开启标题汉字转拼音" prop="isTitleHasCh">
          <el-radio-group v-model="formInline.isTitleHasCh">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分隔符" prop="splitWord">
          <el-input
            v-model="formInline.splitWord"
            placeholder="请输入分隔符"
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义文件头内容" prop="title">
          <el-input
            v-model="formInline.title"
            placeholder="请输入文件地址"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="onSubmit">解析</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-upload
      class="upload-demo"
      drag
      :http-request="httpRequest"
      :on-change="handleChange"
      show-file-list
      multiple
      name="el-upload_mapinput"
      action=""
      ref="uploadFile"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload> -->
  </div>
</template>

<script>
import { RecycleBinExam } from "@/api/dataParse";
export default {
  data() {
    return {
      formInline: {},
      formRules: {
        csvPath: [
          { required: true, message: "请输入文件地址", trigger: "blur" },
        ],
        indexName: [
          {
            required: true,
            message: "请选择索引",
            trigger: "blur",
          },
        ],
        isCustomTitle: [
          {
            required: true,
            message: "请选择是否自定义标题",
            trigger: "blur",
          },
        ],
        isHasTitle: [
          {
            required: true,
            message: "请选择csv文件首行是否有标题",
            trigger: "blur",
          },
        ],
        isTitleHasCh: [
          {
            required: true,
            message: "请选择是否开启标题汉字转拼音",
            trigger: "blur",
          },
        ],
        splitWord: [
          { required: true, message: "请输入分隔符", trigger: "blur" },
        ],
        title: [
          {
            required: true,
            message: "请输入自定义文件头内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // RecycleBinExam({
    //   userId: "12122hhhhsoopwwd222",
    //   title: "99882",
    //   body: "1231",
    // }).then((res) => {
    //   console.log(res);
    // });
    // this.$axios({
    //   method: "post",
    //   url: "/user/12345",
    //   data: {
    //     firstName: "Fred",
    //     lastName: "Flintstone",
    //   },
    // });
    // document.getElementsByName("el-upload_mapinput")[0].webkitdirectory = true;
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          csvDeepFoldToEs(JSON.stringify(this.formInline)).then((res) => {
            console.log(res);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // httpRequest(param) {
    //   // console.log(this.url);
    // },
    // handleFileUploadProgress() {},
    // handleFileSuccess() {},
    // handleFileError() {},
    // handleChange() {
    //   console.log(document.getElementsByClassName("el-upload__input")[0].value);
    //   this.url = document.getElementsByClassName("el-upload__input")[0].value;
    // },
    // beforeAvatarUpload(file) {
    //   console.log(file.path, "file.path");
    // },
  },
};
</script>

<style scoped>
.form-contain {
  width: 50%;
  margin: 0 auto;
}
</style>
