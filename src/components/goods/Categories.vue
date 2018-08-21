<template>
<div id="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="success" class="mb_10 mt_10" size="middle" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="catList"
      style="width: 100%"
      v-loading="loading">
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="cat_level">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDailog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteCat(scope.row.cat_id)"></el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级名称" prop="cat_pid">
            <el-cascader
              clearable
              :options="options"
              change-on-select
              :props="props"
              v-model="addForm.cat_pid">
              </el-cascader>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategories">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
// 树状网格组件
import ElTreeGrid from 'element-tree-grid'

export default {
  data () {
    return {
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        id: ''
      },
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      options: [],
      addDialogVisible: false,
      editDialogVisible: false,
      catList: [],
      pageSize: 10,
      current: 1,
      total: 0,
      rules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      loading: true
    }
  },
  methods: {
    // 获取商品列表
    async getList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        setTimeout(() => {
          this.catList = data.result
          this.total = data.total
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
    // 展示添加分类对话框
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories', {
        params: {
          type: 2
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加分类
    async addCategories () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        }
        const {cat_name: catName, cat_pid: catPid} = this.addForm
        const res = await this.axios.post('categories', {
          cat_name: catName,
          cat_level: catPid.length,
          cat_pid: catPid[catPid.length - 1] || 0
        })
        const {meta} = res.data
        if (meta.status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getList()
          this.$message.success('添加分类成功!')
        } else {
          this.$message.error('添加分类失败!')
        }
      })
    },
    // 删除分类
    async deleteCat (id) {
      try {
        await this.$confirm('您确定要删除该分类吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        const {meta: {status}} = res.data
        if (status === 200) {
          if (this.catList.length === 1) {
            this.current--
          }
          this.getList()
          this.$message.success('删除成功!')
        } else {
          this.$message.error('删除失败!')
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '删除已取消'
        })
      }
    },
    // 展示修改分类对话框
    showEditDailog (cat) {
      this.editDialogVisible = true
      this.editForm.id = cat.cat_id
      this.editForm.cat_name = cat.cat_name
    },
    // 修改分类
    async editCategories () {
      const res = await this.axios.put(`categories/${this.editForm.id}`, {
        cat_name: this.editForm.cat_name
      })
      const {meta} = res.data
      if (meta.status === 200) {
        this.editDialogVisible = false
        this.getList()
        this.$message.success('分类修改成功!')
      } else {
        this.$message.error('分类修改失败!')
      }
    }
  },
  // 钩子函数
  created () {
    this.getList()
  },
  // 树状网格组件
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  }
}
</script>

<style lang="less">
</style>
