<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  name: "home",
  methods: {
    //实现退出功能，清空sessionStoragez中的token并重新指向login既可
    logout() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>
<style lang="less">
</style>