<!-- 数据解析 -->
<template>
  <div>
    <!-- <p style="text-align: center">数据解析</p> -->
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
            <el-option
              v-for="(item, index) in selectData"
              :key="item + index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分隔符" prop="splitWord">
          <el-input
            v-model="formInline.splitWord"
            placeholder="请输入分隔符"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否自定义标头" prop="isCustomTitle">
          <el-radio-group v-model="formInline.isCustomTitle">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <el-table
            :data="titleData"
            style="min-width: 400px"
            height="150px"
            class="contain-table"
            border
            :header-cell-style="tableHeaderStyle"
            v-show="formInline.isCustomTitle"
          >
            <el-table-column align="center" label="标头" prop="name">
            </el-table-column>
            <el-table-column
              v-for="(item, index) in titles"
              :key="item + index"
              :prop="item"
              width="120px"
              ><template slot="header">
                <el-input
                  validate-event
                  v-model="titleForm[item]"
                  size="mini"
                  placeholder="输入标头"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="csv文件首行是否有标头" prop="isHasTitle">
          <el-radio-group v-model="formInline.isHasTitle">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否开启标题汉字转拼音" prop="isTitleHasCh">
          <el-radio-group v-model="formInline.isTitleHasCh">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="解析模式" prop="trans">
          <el-select v-model="formInline.trans" placeholder="请选择解析模式">
            <el-option label="解析所有文件" value="1"></el-option>
            <el-option label="解析单层文件" value="2"></el-option>
            <el-option label="解析单个文件" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="onSubmit" size="medium"
            >解析</el-button
          >
          <el-button size="medium" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-upload
      class="upload-demo"
      drag
      :http-request="httpRequest"
      :on-change="handlerChange"
      show-file-list
      multiple
      :file-list="fileList"
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
import {
  csvTransBulk,
  csvFoldToEs,
  csvDeepFoldToEs,
  listAllIndices,
  csvLine,
} from "@/api/dataParse";
import { uploadFilesToHdfs } from "@/api/fileQueries";

export default {
  data() {
    return {
      formInline: {
        isCustomTitle: false,
        title: [],
        isHasTitle: true,
        isTitleHasCh: true,
      },
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
        trans: [
          {
            required: true,
            message: "请选择解析模式",
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
      titles: [],
      titleData: [{}],
      selectData: [],
      titleForm: {},
      fileList: [],
    };
  },
  created() {
    listAllIndices().then((res) => {
      const { responseCode, data } = res;
      if (responseCode == 200) {
        this.selectData = data;
      }
    });
  },
  mounted() {
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
  watch: {
    "formInline.isCustomTitle": {
      handler: function (newValue) {
        console.log(newValue, "newValue");
        if (newValue) {
          this.titleData = [{}];
          this.titles = [];
          if (this.formInline.csvPath && this.formInline.splitWord) {
            csvLine({
              filePath: this.formInline.csvPath,
              splitWord: this.formInline.splitWord,
            }).then((res) => {
              const { data, responseCode, responseMsg } = res;
              if (responseCode == 200) {
                this.$message.success(responseMsg);
                for (let i = 0; i < data.length; i++) {
                  this.titles.push("names" + i);
                }
                for (let i = 0; i < data.length; i++) {
                  let name = this.titles[i];
                  this.titleData[0][name] = data[i];
                }
                this.titleData[0].name = "数据预览";
              } else {
                this.$message.error(responseMsg);
              }
            });
          } else {
            this.formInline.isCustomTitle = false;
            this.$message.warning("请输入文件地址或分隔符！");
          }
        }
      },
      // deep: true,
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.formInline));
          for (let key in this.titleForm) {
            form.title.push(this.titleForm[key]);
          }
          let url = "";
          switch (form.trans) {
            case "1":
              url = csvDeepFoldToEs;
              break;
            case "2":
              url = csvFoldToEs;
              break;
            case "3":
              url = csvTransBulk;
              break;
          }
          delete form.trans;
          // const loading = this.$loading({
          //   text: "加载中...",
          //   spinner: "el-icon-loading",
          // });
          url(form).then((res) => {
            const { responseCode, responseMsg } = res;
            if (responseCode == 200) {
              // loading.close();
              this.$emit("handleClose");
              this.$message.success(responseMsg);
            } else {
              this.$message.error(responseMsg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    tableHeaderStyle({ row, column, rowIndex }) {
      if (rowIndex === 0) {
        return `padding:0px`;
      }
    },
    cancel() {
      this.$emit("handleClose");
    },
    httpRequest(file) {
      console.log(file, "file");
      uploadFilesToHdfs({ path: "/image", file: file.file }).then((res) => {
        console.log(res);
      });
    },
    handlerChange(file, fileList) {
      this.fileList = fileList;
    },
  },
};
</script>

<style lang="less" scoped>
.form-contain {
  width: 100%;
  margin: 0 auto;
  ::v-deep .el-table .el-table__cell {
    padding: 20px 0;
  }
}
</style>
