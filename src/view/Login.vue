<template>
  <div class="container">
    <div class="center">
      <!--            头像部分-->
      <div class="header">
        <img src="../assets/logo.png" alt />
      </div>
      <!--            登录部分-->
      <div class="bottom">
        <el-form :model="loginForm" :rules="rules" ref="ruleForm1" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码"
              prefix-icon="el-icon-lock"
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" @click="submitForm('ruleForm1') ">登录</el-button>
            <el-button type="info" @click="resetForm('ruleForm1')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import {request} from '../network/login'
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    // 点击重置表单内容方法
    resetForm(ruleForm) {
      console.log(this)
      this.$refs[ruleForm].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // alert('submit!');
          // 使用axios发出数据请求，使用数据解构获取data的值
          const { data: res } = await this.$http.post("login", this.loginForm)
          if (res.meta.status !== 200)
            return this.$message({
              message: "很遗憾,登录失败",
              type: "error"
            })
          // 将登录成功后的token保存到客户端的sessionStorage中
        //   console.log(res)
          window.sessionStorage.setItem("token", res.data.token)
          // 1.1项目中出现登录之外的其他API接口必须在登录之后才能访问
          // 1.2token只在当前网站打开有效，所以保存在sessionStorage中
          //通过编程式导航跳转到后台主页，路由地址是/home
          this.$message({
            message: "恭喜你，登录成功",
            type: "success"
          })
          this.$router.push("/home")
        } else {
          console.log("error submit!!")
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
}

.container {
  background: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .center {
    width: 500px;
    height: 300px;
    background: #fff;

    .header {
      width: 130px;
      height: 130px;
      padding: 10px;
      border-radius: 50%;
      border: 1px solid #f6f6f6;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      transform: translateY(-50%);
      margin: 10px auto;
      background: #ffffff;
    }
  }
}

.demo-ruleForm {
  padding: 0 15px;
}

.bottom {
  transform: translateY(-50px);
}

.button {
  display: flex;
  justify-content: flex-end;
}
</style>