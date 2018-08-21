<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
/* 面包屑导航 */
.el-breadcrumb {
  background-color: #eee;
  height: 40px;
  line-height: 40px;
}
.mb_10 {
  margin-bottom: 10px;
}
.mt_10 {
  margin-top: 10px;
}
.mr_10 {
  margin-right: 10px;
}
</style>
