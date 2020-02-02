<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            class="input-with-select"
            clearable
            @clear="searchorder"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchorder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格展示数据区域 -->
      <el-table :data="orderlist" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="600px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay==0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pay_status" label="是否发货">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==0">否</el-tag>
            <el-tag type="success" v-else>是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">{{scope.row.create_time | dateformat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改地址" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showaddress"></el-button>
            </el-tooltip>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showalogistics"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="closeaddress">
      <el-form :model="address" :rules="addressrules" ref="address" label-width="100px">
        <el-form-item label="选择区/县" prop="citydata">
          <el-input v-model="address.citydata"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="adrs">
          <el-input v-model="address.adrs"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流的对话框 -->
    <el-dialog title="物流信息" :visible.sync="logisticsVisible" width="50%" @close="closelogistics">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in kuaidimsg"
          :key="index"
          :icon="index == kuaidimsg.length-1? activity.icon:null"
          :color="activity.color"
        >{{activity.context}}<br/>{{activity.ftime}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Orders",
  data() {
    return {
      // 发送数据的请求体
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      orderlist: [],
      total: 0,
      //   控制修改地址对话框的显示与隐藏
      addressVisible: false,
      address: {
        citydata: "",
        adrs: ""
      },
      addressrules: {
        adrs: [{ required: true, message: "请输入地址", trigger: "blur" }],
        citydata: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      logisticsVisible: false,
      kuaidimsg: []
    }
  },
  created() {
    //
    this.getorders()
  },

  methods: {
    // 获取所有订单的方法
    async getorders() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo
      })
      // 弹出错误的提示消息
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderlist = res.data.goods
      //   console.log(res, this.queryinfo)
      this.total = res.data.total
    },
    // 分页函数
    handleSizeChange(newpagesize) {
      this.queryinfo.pagesize = newpagesize
      this.getorders()
    },
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getorders()
    },
    searchorder() {
      this.getorders()
    },
    showaddress() {
      this.addressVisible = true
    },
    closeaddress() {
      this.$refs.address.resetFields()
    },
    closelogistics() {},
    async showalogistics() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.color = "#0bbd87"
        item.icon = "el-icon-check"
      })
      this.kuaidimsg = res.data
      console.log(this.kuaidimsg)
      this.logisticsVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>