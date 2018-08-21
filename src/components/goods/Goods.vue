<template>
<div id="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="success" class="mb_10 mt_10" size="middle" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table
      :data="goodsList"
      style="width: 100%"
      v-loading="loading">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name">
      </el-table-column>
      <el-table-column label="商品价格" prop="goods_price">
      </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight">
      </el-table-column>
      <el-table-column label="商品时间">
        <template slot-scope="scope">
           {{scope.row.add_time | timeFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
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
      :page-sizes="[10,20,30,40]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      current: 1,
      query: '',
      pageSize: 10,
      total: 0,
      loading: true
    }
  },
  methods: {
    // 获取商品列表数据
    async getList () {
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        setTimeout(() => {
          this.total = data.total
          this.goodsList = data.goods
          this.loading = false
        }, 500)
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    // 改变当前页
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getList()
    },
    // 改变下标
    indexMethod (index) {
      return this.pageSize * (this.current - 1) + index + 1
    }
  },
  // 钩子函数
  created () {
    this.getList()
  }
}
</script>

<style lang="less">
</style>
