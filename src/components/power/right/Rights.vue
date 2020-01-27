<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据显示表格 -->
    <el-table :data="rightslist" style="width: 100%" stripe border>
      <!-- <el-table-column prop="create_time" label="日期" ></el-table-column> -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-button 
          :type="scope.row.level==0?'primary':(scope.row.level==1?'success':'warning')"
            plain size="mini">
            {{scope.row.level==0?'一级':(scope.row.level==1?'二级':'三级')}}
            </el-button>
        </template>

        <!-- <el-button type="success" plain>成功按钮</el-button> -->
        <!-- <el-button type="info" plain>信息按钮</el-button> -->
        <!-- <el-button type="warning" plain>警告按钮</el-button> -->
        <!-- <el-button type="danger" plain>危险按钮</el-button> -->
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "Rights",
  data() {
    return {
      rightslist: []
    }
  },
  created() {
    this.getRightslist()
  },
  methods: {
    async getRightslist() {
      const { data: res } = await this.$http.get("rights/list")
      this.rightslist = res.data
      console.log(this.rightslist)
    }
  }
}
</script>   
<style lang="scss" scoped>
</style>