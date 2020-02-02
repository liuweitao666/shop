<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px;height:500px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts"
import _ from 'lodash'
export default {
  name: "Reports",
  data() {
    return {
      options: {
        legend: {
          data: ["华东", "华南", "华北", "西部", "其他"]
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        xAxis: [
          {
            data: [
              "2017-12-27",
              "2017-12-28",
              "2017-12-29",
              "2017-12-30",
              "2017-12-31",
              "2018-1-1"
            ]
          }
        ],
        series: [
          {
            name: "华东",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [2999, 3111, 4100, 3565, 3528, 6000]
          },
          {
            name: "华南",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [5090, 2500, 3400, 6000, 6400, 7800]
          },
          {
            name: "华北",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [6888, 4000, 8010, 12321, 13928, 12984]
          },
          {
            name: "西部",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [9991, 4130, 7777, 12903, 13098, 14028]
          },
          {
            name: "其他",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: [15212, 5800, 10241, 14821, 15982, 14091]
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"))
    // 指定图表的配置项和数据
    // 发送网络请求
    const { data: res } = await this.$http.get("reports/type/1")
    console.log(res)
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    // 合并数据
    const result = _.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>