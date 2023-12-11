<template>
  <div id="line" style="height: 100%; min-width: 280px"></div>
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
      var chartDom = document.getElementById("line");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        legend: {
          left: "center",
          textStyle: {
            //图例文字的样式
            color: "#eee",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}",
        },
        xAxis: {
          type: "category",
          data: ["一月", "二月", "三月", "四月", "五月", "六月"],
          axisLine: {
            lineStyle: {
              color: "#eee", //x轴的颜色
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#eee", //x轴的颜色
            },
          },
        },
        series: [
          {
            data: [82, 75, 68, 64, 55, 49],
            type: "line",
            name: "实时性能曲线",
            itemStyle: {
              normal: {
                color: "#009DFF", //折线点的颜色
                lineStyle: {
                  color: "#009DFF", //折线的颜色
                },
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

<style lang="scss" scoped></style>
