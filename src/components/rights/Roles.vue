<template>
  <div id="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="success" class="mb_10 mt_10" size="middle" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      :data="rolesList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">
            该角色没有权限
          </el-row>
          <!-- 一级权限 -->
          <el-row v-for="level1 in scope.row.children" :key="level1.id" class="mb_10 level1">
            <el-col :span="4">
              <el-tag closable @close="deleteRights(level1.id, scope.row)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="level2 in level1.children" :key="level2.id" class="mb_10">
                <el-col :span="4">
                  <el-tag closable type="success" @close="deleteRights(level2.id, scope.row)">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <span v-for="level3 in level2.children" :key="level3.id" class="level3 mr_10">
                    <el-tag closable type="warning" @close="deleteRights(level3.id, scope.row)">{{level3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="权限"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDailog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteRoles(scope.row)"></el-button>
          <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignDailog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-tree
        :data="assignTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignTree: [],
      assignRoleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false,
      rules: {
        roleName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    // 删除角色
    async deleteRoles (role) {
      const res = await this.axios.delete(`roles/${role.id}`)
      const {meta} = res.data
      if (meta.status === 200) {
        this.getRolesList()
        this.$message.success('角色删除成功!')
      } else {
        this.$message.error('角色删除失败!')
      }
    },
    // 展示添加角色对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('roles', this.addForm)
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getRolesList()
            this.$message.success('角色添加成功!')
          } else {
            this.$message.error('角色添加失败!')
          }
        } else {
          return false
        }
      })
    },
    // 展示修改角色对话框
    showEditDailog (role) {
      this.editDialogVisible = true
      this.editForm = role
    },
    // 修改角色
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getRolesList()
            this.$message.success('角色修改成功!')
          } else {
            this.$message.error('角色修改失败!')
          }
        } else {
          return false
        }
      })
    },
    // 展示分配权限对话框
    async showAssignDailog (role) {
      this.assignDialogVisible = true
      this.assignRoleId = role.id
      const res = await this.axios.get('rights/tree')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.assignTree = data
        const checkedKeys = []
        role.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkedKeys.push(level3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    // 修改角色权限
    async assignRights () {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let checkedHalfKeys = this.$refs.tree.getHalfCheckedKeys()
      let checkedId = [...checkedKeys, ...checkedHalfKeys].join()
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: checkedId
      })
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.getRolesList()
        this.$message.success('角色权限修改成功!')
      } else {
        this.$message.error('角色权限修改失败!')
      }
    },
    // 删除角色权限
    async deleteRights (id, role) {
      const res = await this.axios.delete(`roles/${role.id}/rights/${id}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        role.children = data
        this.$message.success('角色权限删除成功!')
      } else {
        this.$message.error('角色权限删除失败!')
      }
    }
  },
  // 钩子函数
  created () {
    this.getRolesList()
  }
}
</script>
<style lang="less">
// 角色列表展开
.level3 {
  > .el-tag {
    margin-bottom: 5px;
  }
}
.level1 {
  border-bottom: 1px dotted #ccc;
}
</style>
