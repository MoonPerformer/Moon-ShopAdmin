<template>
    <div id="home">
        <el-container>
            <el-header>
                <div class="logo"></div>
                <div class="logout">
                    欢迎光临
                    <a href="javascript:;" @click="logout">退出</a>
                </div>
                <div class="title">电商后台管理系统</div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                        router
                        default-active="1-1"
                        unique-opened
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>用户管理</span>
                            </template>
                            <el-menu-item index="users">
                                <i class="el-icon-menu"></i>
                                <span slot="title">用户列表</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>权限管理</span>
                            </template>
                            <el-menu-item index="2-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">角色列表</span>
                            </el-menu-item>
                            <el-menu-item index="2-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">权限列表</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
  methods: {
    logout () {
      this.$confirm('您确定要退出本系统吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('shop_token')
        this.$router.push('login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '退出已取消'
        })
      })
    }
  }
}
</script>

<style lang='less'>

#home {
    height: 100%;
    width: 100%;
    .el-container {
        height: 100%;
        .el-header {
            background-color: #b3c1cd;
            .logo {
                float: left;
                height: 60px;
                width: 180px;
                background: url('../../assets/logo.png') no-repeat center;
                background-size: contain;
            }
            .title {
                height: 60px;
                overflow: hidden;
                line-height: 60px;
                font-size: 28px;
                color: #fff;
                text-align: center;
            }
            .logout {
                height: 60px;
                width: 180px;
                float: right;
                text-align: right;
                line-height: 60px;
                font-weight: 700;
                a {
                    color: rgba(202, 24, 24, 0.774);
                }
            }
        }
        .el-aside {
            height: 100%;
            background-color: #545c64;
            .el-menu {
                width: 200px;
            }
        }
    }
}
</style>
