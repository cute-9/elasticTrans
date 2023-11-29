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
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          v-if="this.activeName == 'first'"
        >
          <el-form-item label="数据类型：">
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
            <el-input v-model="formInline.keyWord" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('search')"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <el-form
          :model="formInlines"
          label-width="180px"
          v-if="this.activeName == 'second'"
        >
          <el-form-item label="数据类型" style="margin-bottom: 10px">
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
            <!-- <el-select v-model="formInlines.values" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="onSubmit('hight')" size="small"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
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
      formInline: {
        keyWord: "",
        indexName: "",
      },
      formInlines: {
        indexName: "",
      },
      activeName: "second",
      options: [],
      optionsFirst: [],
      optionsSeconed: [],
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
    };
  },
  created() {
    listAllIndices().then((res) => {
      const { responseCode, data } = res;
      if (responseCode == 200) {
        // data.forEach((item) => {
        //   this.optionsSeconed.push({
        //     value: item,
        //     label: item,
        //   });
        // });
        this.optionsFirst = data;
        this.optionsSeconed = data;
      }
    });
  },
  methods: {
    onSubmit(type) {
      this.tableType = type;
      let equalsCondition = {};
      let rangeCondition = {};
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
      // console.log(equalsCondition);
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
      // console.log(equalsCondition, JSON.stringify(data), "data");
      // url({ ...data, pageNum: 0, pageSize: 20 }).then((res) => {
      //   console.log(res);
      //   const { responseCode, responseMsg, data } = res;
      //   if (responseCode == 200) {
      //     this.$message.success(responseMsg);
      //   } else {
      //     this.$message.error(responseMsg);
      //   }
      // });
    },
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
    deleteData(id) {
      // console.log(id, "id");
      this.tableData = this.tableData.filter((obj) => obj.id != id);
    },
    numMap(name) {
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
      if (obj[name] > 2) {
        matchNum.forEach((item) => {
          item.disabled = true;
        });
      } else if (obj[name] == 2) {
        let indexs = tableData.find((currentValue) => {
          return (currentValue.name = name);
        });
        matchNum.forEach((item) => {
          if (item.value == indexs?.value[0]) {
            item.disabled = true;
          }
        });
      }
      return matchNum;
    },
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
    tableHeaderStyle({ row, column, rowIndex }) {
      if (rowIndex === 0) {
        return `padding:0px`;
      }
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    cellClick(row) {
      console.log(row, "event");
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
