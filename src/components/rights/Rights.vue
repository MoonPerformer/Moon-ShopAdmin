<template>
  <div id="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      :data="rightsList"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="权限名称"
        prop="authName">
      </el-table-column>
      <el-table-column
        label="路径"
        prop="path">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const res = await this.axios.get('rights/list')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rightsList = data
      }
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>
<style lang="less">
</style>
