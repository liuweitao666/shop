<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- crad头部区域 -->
      <el-row>
        <el-col :span="10" class="elsearch">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            class="input-with-select"
            clearable
            @clear="clearlist"
          >
            <el-button slot="append" icon="el-icon-search" @click="seachlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="Addpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品数据表格展示区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time | dateformat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="small">编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="small"
              @click="removebyId(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 保存商品的数据
      goodslist: [],
      // 全部数据
      total: 0,
      // 请求数据的请求体
      queryinfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5
      }
    }
  },
  created() {
    this.getgoodslist()
  },
  methods: {
    // 获取商品的方法
    async getgoodslist() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error("获取商品失败")
      // 处理时间戳
      // res.data.goods.forEach(item => {
      //     item.add_time=this.copetime(item.add_time)
      // });

      // 把请求到的数据赋值给私有属性
      this.goodslist = res.data.goods
      this.total = res.data.total
      console.log(this.total)
    },
    // 处理时间戳的方法
    copetime(time) {
      let date = new Date(time * 1000)
      let Year = date.getFullYear()
      let mouth = date.getMonth() + 1
      let Day = date.getDate()
      let Hour = date.getHours()
      let Minutes = date.getMinutes()
      let Second = date.getSeconds()
      // 补零
      mouth = this.supplement(mouth)
      Day = this.supplement(Day)
      Hour = this.supplement(Hour)
      Minutes = this.supplement(Minutes)
      Second = this.supplement(Second)

      return `${Year}-${mouth}-${Day} ${Hour}:${Minutes}:${Second}`
    },
    // 补0的方法
    supplement(val) {
      console.log(val)
      return (val = val > 10 ? val : "0" + val)
    },
    handleSizeChange(newpagesize) {
      this.queryinfo.pagesize = newpagesize
      this.getgoodslist()
    },
    handleCurrentChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getgoodslist()
    },
    // 搜索数据的方法
    seachlist() {
      this.getgoodslist()
    },
    clearlist() {
      this.getgoodslist()
    },
    // 删除商品的方法
    async removebyId(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirmresult !== "confirm") {
        return this.$message("已取消删除")
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !==200) return this.$$message.error('删除失败')
      this.$message.success(res.meta.msg)
      this.getgoodslist()
    },
    Addpage(){
        this.$router.push('/goods/addpage')
    }
  }
}
</script>
<style lang="scss">
.elsearch {
  margin-right: 15px;
}
</style>