<!-- 数据查询 -->
<template>
  <div>
    <!-- <p>数据查询</p> -->
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="全文搜索" name="first"></el-tab-pane>
        <el-tab-pane label="高级搜索" name="second"></el-tab-pane>
      </el-tabs>
      <div class="form-contain">
        <!-- 全文搜索 -->
        <el-form
          :inline="true"
          :model="formInline"
          ref="form1"
          :rules="formInlinesRules"
          class="demo-form-inline"
          v-show="this.activeName == 'first'"
        >
          <el-form-item label="数据类型" prop="indexName">
            <el-select
              v-model="formInline.indexName"
              placeholder="请选择索引名"
            >
              <el-option
                v-for="(item, index) in optionsFirst"
                :key="item + index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select> </el-form-item
          ><el-form-item label="">
            <el-input
              v-model="formInline.keyWord"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('search')"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 高技搜索 -->
        <el-form
          :model="formInlines"
          label-width="80px"
          ref="form2"
          :rules="formInlinesRules2"
          v-show="this.activeName == 'second'"
        >
          <el-form-item
            label="数据类型"
            prop="indexName"
            style="margin-bottom: 20px"
          >
            <el-select
              v-model="formInlines.indexName"
              @change="change"
              placeholder="请选择索引名"
            >
              <el-option
                v-for="(item, index) in optionsSeconed"
                :key="item + index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-table
              :data="tableData"
              style="min-width: 400px"
              height="550px"
              :header-cell-style="tableHeaderStyle"
              class="contain-table"
              @cell-click="cellClick"
              :cell-class-name="tableCellClassName"
              border
            >
              <el-table-column label="字段名" prop="name">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.name"
                    placeholder="请选择"
                    v-if="scope.row.show"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button v-else type="primary" size="mini" @click="addData"
                    >新增</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="value" label="匹配机制">
                <template slot-scope="scope">
                  <el-cascader
                    v-if="scope.row.show"
                    v-model="scope.row.value"
                    :options="numMap(scope.row.name)"
                    @change="handleChange"
                  ></el-cascader>
                </template>
              </el-table-column>
              <el-table-column prop="keyWord" label="关键字">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.show"
                    v-model="scope.row.keyWord"
                    placeholder="请输入关键字"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.show"
                    type="danger"
                    size="mini"
                    @click="deleteData(scope.row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="onSubmit('hight')" size="small"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格弹窗 -->
      <el-dialog
        v-if="dialogVisible"
        title="查看"
        :visible.sync="dialogVisible"
        width="100%"
      >
        <tableView
          v-if="dialogVisible"
          :indexName="indexName"
          :formData="formData"
          :tableUrl="tableUrl"
          :tableType="tableType"
        ></tableView>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listAllIndices } from "@/api/dataParse";
import { listMapping, search, highSearch } from "@/api/dataQueries";
import tableView from "./tableView.vue";
export default {
  components: { tableView },
  data() {
    return {
      //全文搜索表单
      formInline: {
        keyWord: "",
        indexName: "",
      },
      //高级搜索表单
      formInlines: {
        indexName: "",
      },
      // 表单验证
      formInlinesRules: {
        indexName: [
          { required: true, message: "请选择索引名", trigger: "change" },
        ],
      },
      formInlinesRules2: {
        indexName: [
          { required: true, message: "请选择索引名", trigger: "change" },
        ],
      },
      //tabs切换
      activeName: "first",
      options: [],
      optionsFirst: [],
      optionsSeconed: [],
      //表格数据
      tableData: [
        {
          id: "1",
          name: "",
          value: "",
          show: true,
          keyWord: "",
        },
        {
          id: "2",
          show: false,
          name: "",
          value: "",
          keyWord: "",
        },
      ],
      // 匹配机制数据源
      matchOptions: [
        {
          value: "关键词查询",
          label: "关键词查询",
          disabled: false,
          children: [
            {
              value: "模糊查询",
              label: "模糊查询",
            },
            {
              value: "精确查询",
              label: "精确查询",
            },
          ],
        },
        {
          value: "范围查询",
          label: "范围查询",
          disabled: false,
          children: [
            {
              value: ">=",
              label: ">=",
            },
            {
              value: "<=",
              label: "<=",
            },
          ],
        },
      ],
      // 弹窗传值
      indexName: "",
      dialogVisible: false,
      formData: {},
      tableUrl: "",
      tableType: "",
      // 匹配机制
      hightIndex: 0,
      hightName: "",
    };
  },
  created() {
    listAllIndices().then((res) => {
      const { responseCode, data } = res;
      if (responseCode == 200) {
        this.optionsFirst = data;
        this.optionsSeconed = data;
      }
    });
  },
  methods: {
    onSubmit(type) {
      this.$refs[type == "hight" ? "form2" : "form1"].validate((valid) => {
        if (valid) {
          this.tableType = type;
          let equalsCondition = {};
          let rangeCondition = {};
          // 高级搜索的数据处理
          if (type == "hight") {
            let tableData = JSON.parse(JSON.stringify(this.tableData));
            tableData.pop();
            tableData.forEach((item) => {
              if (item?.value[0] == "关键词查询") {
                if (item.value[1] == "模糊查询") {
                  equalsCondition[item.name] = `*${item.keyWord}*`;
                } else {
                  equalsCondition[item.name] = item.keyWord;
                }
              } else {
                if (item.value[1] == ">=") {
                  rangeCondition[item.name] = `[${item.keyWord},)`;
                } else {
                  rangeCondition[item.name] = `(,${item.keyWord}]`;
                }
              }
            });
          }
          // 判断是全文搜索还是高级搜索
          let data =
            type == "hight"
              ? {
                  indexName: this.formInlines.indexName,
                  equalsCondition,
                  rangeCondition,
                }
              : this.formInline;
          this.formData = data;
          this.indexName = data.indexName;
          this.dialogVisible = true;
        }
      });
    },
    // 表格新增数据
    addData() {
      let length = this.tableData.length - 1;
      let id = Number(
        Math.random().toString().substr(3, length) + Date.now()
      ).toString(36);
      this.tableData.splice(length, 0, {
        id: id,
        show: true,
        name: "",
        value: "",
        keyWord: "",
      });
    },
    // 表格删除数据
    deleteData(id) {
      // console.log(id, "id");
      this.tableData = this.tableData.filter((obj) => obj.id != id);
    },
    // 匹配机制数据处理
    numMap(name) {
      // console.log(name, "name");
      let matchNum = JSON.parse(JSON.stringify(this.matchOptions));
      let tableData = JSON.parse(JSON.stringify(this.tableData));
      let nameNum = tableData.map((item) => {
        return item.name;
      });
      // 统计字段名出现的次数
      let obj = {};
      for (let i = 0; i < nameNum.length; i++) {
        if (nameNum[i]) {
          obj[nameNum[i]] = obj[nameNum[i]] + 1 || 1;
        }
      }
      // 字段名出现超过两次就禁用
      for (let key in obj) {
        if (obj[key] > 2) {
          matchNum.forEach((item) => {
            item.disabled = true;
          });
        } else if (obj[key] == 2) {
          if (key == this.hightName) {
            let indexs = tableData.find((currentValue) => {
              return currentValue.name == this.hightName;
            });
            // 判断是第次出现的第一条数据
            if (indexs.id != this.hightIndex) {
              matchNum.forEach((item) => {
                if (item.value == indexs?.value[0]) {
                  item.disabled = true;
                }
              });
            }
            // 第一次数据
            else {
              matchNum.forEach((item) => {
                // 如果开始就选了，那就不禁用已选的数据
                if (item.value == indexs?.value[0]) {
                  item.disabled = false;
                } else {
                  // 如果开始，没选，第二次选了，需要禁用第二次的选项
                  tableData.forEach((i) => {
                    if (i.name == indexs.name && i.id != indexs.id) {
                      if (item.value == i?.value[0]) {
                        item.disabled = true;
                      }
                    }
                  });
                }
              });
            }
          }
        }
      }
      return matchNum;
    },
    // 数据类型选完后对字段名的一个处理
    change() {
      listMapping({
        indexName: this.formInlines.indexName,
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
            this.options.push({
              value: key,
              label: key,
            });
          }
        }
      });
    },
    // 头部样式修改
    tableHeaderStyle({ row, column, rowIndex }) {
      if (rowIndex === 0) {
        return `padding:0px`;
      }
    },
    // 给数据赋值索引
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    // 当前点击行
    cellClick(row) {
      // console.log(row, "event");
      this.hightIndex = row.id;
      this.hightName = row.name;
    },
    handleChange() {},
    // lazyLoad(node, resolve) {
    //   console.log(node.data.value, resolve);
    //   const { level } = node;
    //   listMapping({
    //     indexName: node.data.value,
    //   }).then((res) => {
    //     const { data, responseCode } = res;
    //     if (responseCode == 200) {
    //       var target;
    //       const deep = (obj, keys) => {
    //         if (obj instanceof Object) {
    //           for (let key in obj) {
    //             if (key != keys) {
    //               deep(obj[key], keys);
    //             } else {
    //               target = obj[key];
    //             }
    //           }
    //         }
    //         return target;
    //       };
    //       let obj = deep(data, "properties");
    //       const nodes = [];
    //       for (let n in obj) {
    //         nodes.push({
    //           value: n,
    //           label: n,
    //           leaf: level >= 1,
    //         });
    //       }
    //       setTimeout(() => {
    //         resolve(nodes);
    //       }, 500);
    //     }
    //   });
    // },
  },
};
</script>

<style lang="less" scoped>
.form-contain {
  width: 50%;
  min-width: 800px;
  margin: 0 auto;
  ::v-deep .el-table .el-table__cell {
    padding: 20px 0;
    border-right: 1px solid #fff !important;
  }
  ::v-deep.el-table--border ::v-deep .el-table__cell {
    border-right: 1px solid #fff !important;
  }
}
::v-deep .el-dialog {
  height: 100% !important;
  margin: 0px !important;
}
::v-deep .el-dialog__body {
  // height: 80%;
}
</style>
