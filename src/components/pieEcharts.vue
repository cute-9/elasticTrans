<template>
  <div id="pie" style="height: 300px; width: 600px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [
          { value: 11, name: "性能良好" },
          { value: 2, name: "临近预警" },
          { value: 2, name: "亟待检修" },
        ];
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      var chartDom = document.getElementById("pie");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "装备状态预览",
          subtext: "",
          left: "center",
          textStyle: {
            //图例文字的样式
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          textStyle: {
            //图例文字的样式
            color: "#e0e0e0",
          },
        },
        series: [
          {
            name: "装备状态预览",
            type: "pie",
            radius: ["50%", "70%"],
            data: this.data,
            // 颜色
            itemStyle: {
              normal: {
                color: function (colors) {
                  var colorList = ["#009DFF ", "#22E4FF", "#3BFFD0 "];
                  return colorList[colors.dataIndex];
                },
              },
            },
            // w文字显示
            label: {
              show: true,
              formatter: "{c}", // b代表名称，c代表对应值，d代表百分比
              textStyle: {
                //图例文字的样式
                color: "#fff",
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped></style>
