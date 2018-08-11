<template>
  <div id="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select" @keyup.enter.native="searchList">
      <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
    </el-input>
    <!-- 添加按钮 -->
    <el-button type="success" size="middle" plain>增加用户</el-button>
    <!-- 表格 -->
    <el-table
      :data="usersList"
      border
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check">分配角色</el-button>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="current"
      :page-sizes="[2,4,6,8]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      total: 0,
      query: '',
      current: 1,
      pageSize: 2,
      usersList: []
    }
  },
  methods: {
    getList () {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        },
        headers: {
          'Authorization': localStorage.getItem('shop_token')
        }
      }).then(res => {
        this.usersList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.getList()
    },
    searchList () {
      this.getList()
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="less">
// 表格
.el-table {
  margin-top: 15px;
  text-align: center;
  .cell {
    text-align: center;
  }
}
// 搜索框
.input-with-select {
  width: 300px;
  margin-top: 15px;
}
// 面包屑导航
.el-breadcrumb {
  background-color: #eee;
  height: 40px;
  line-height: 40px;
}
// 分页器
.el-pagination {
  background-color: #eee;
}
</style>
