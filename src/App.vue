<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import './assets/css/css.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
