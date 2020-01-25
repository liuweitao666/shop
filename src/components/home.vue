<template>
  <el-container class="home-container">
    <el-header class="header">
      <div>
        <img src="../assets/head.jpg" alt class="img" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <!--侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px' ">
          <div class="tragge-button" @click="togglebutton">
              |||
          </div>
          <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#373d44" text-color="#fff" active-text-color="#409eff"
                 unique-opened :collapse-transition = "false" :collapse='isCollapse' router>
           <!-- 导航菜单 -->
          <el-submenu :index="item.id +''" v-for="item in MenuList" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->   
            <el-menu-item :index ="'/'+children.path" v-for="children in item.children" :key="children.id">
             <!-- 二级菜单 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data(){
      return{
          //左侧菜单数据
          MenuList:[],
          //左侧字体图标

          //是否折叠侧边栏
          isCollapse: false
      }
  },
  created(){
      this.getmenuslist()
  },
  methods: {
    //实现退出功能，清空sessionStoragez中的token并重新指向login既可
    logout() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    async getmenuslist(){
       const {data:res} =await this.$http.get('menus')
       this.MenuList = res.data
    //    console.log(this.MenuList)
    },
    togglebutton(){
        this.isCollapse = ! this.isCollapse
    } 
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header div {
  display: flex;
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #ffffff;
}
.header .img {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  padding: 5px 5px;
}
.el-header {
  background-color: #373d41;
  color: #333;
  line-height: 60px;
  padding-left: 0 !important;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #373d44;
  color: #333;
  .el-menu{
      border-right: none
  }
  .tragge-button{
      width: 100%;
      line-height: 24px;
      text-align: center;
      color: #ffffff;
      background: #4a5064;
      letter-spacing: 0.2em;
      cursor: pointer;
  }
}
.el-main {
  background-color: #eaedea;
  color: #333;
}
</style>