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
    <el-button type="success" size="middle" plain @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table
      :data="usersList"
      border
      style="width: 100%"
      class="userTable">
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDailog(scope.row)"></el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
            <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignDailog(scope.row)">分配角色</el-button>
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
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="70px">
          <el-form-item label="用户名">
              <el-tag type="info">{{editForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form :model="assignForm" :rules="rules" ref="assignForm" label-width="70px">
          <el-form-item label="用户名">
              <el-tag type="info">{{assignForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-select v-model="assignForm.rid" placeholder="请选择角色">
              <el-option v-for="item in options" :label="item.roleName" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      options: [],
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
        ],
        mobile: [
          {pattern: /^1\d{10}$/, message: '请输入正确的手机号格式', trigger: 'blur'}
        ]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false,
      total: 0,
      query: '',
      current: 1,
      pageSize: 2,
      usersList: []
    }
  },
  methods: {
    async getList () {
      const res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.usersList = data.users
        this.total = data.total
      }
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    // 改变当前页
    handleCurrentChange (val) {
      this.current = val
      this.getList()
    },
    // 搜索功能
    searchList () {
      this.current = 1
      this.getList()
    },
    // 展示添加用户对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 展示修改用户对话框
    showEditDailog (user) {
      this.editDialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 展示分配角色对话框
    async showAssignDailog (role) {
      this.assignForm.id = role.id
      this.assignForm.username = role.username
      this.assignDialogVisible = true
      // 回显用户角色id
      const res2 = await this.axios.get(`users/${role.id}`)
      if (res2.data.meta.status === 200) {
        if (res2.data.data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = res2.data.data.rid
        }
      }
      // 获取角色列表
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 分配角色
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.getList()
        this.$message.success('分配角色成功!')
      } else {
        this.$message.error('分配角色失败!')
      }
    },
    // 添加用户
    addUser () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('users', this.addForm)
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.total++
            this.current = Math.ceil(this.total / this.pageSize)
            this.getList()
            this.$message.success('用户添加成功')
          } else {
            this.$message.error(meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 修改用户
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`users/${this.editForm.id}`, this.editForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getList()
            this.$message.success('用户修改成功')
          } else {
            this.$message.error('用户修改失败')
          }
        } else {
          return false
        }
      })
    },
    // 修改用户状态
    async changeState (user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('用户状态修改成功')
      } else {
        this.$message.error('用户状态修改失败')
      }
    },
    // 删除用户
    async deleteUser (user) {
      try {
        await this.$confirm('您确定要删除该用户吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`users/${user.id}`)
        const {meta: {status}} = res.data
        if (status === 200) {
          if (this.usersList.length === 1) {
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
    }
  },
  // 钩子函数
  created () {
    this.getList()
  }
}
</script>
<style lang="less">
// 表格
.userTable {
  .cell {
    text-align: center;
  }
}
// 搜索框
.input-with-select {
  width: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
}
// 分页器
.el-pagination {
  background-color: #eee;
}
</style>
