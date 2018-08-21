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
                        :default-active="$route.path.slice(1).split('-')[0]"
                        unique-opened
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <!-- 一级菜单 -->
                        <el-submenu
                        v-for="level1 in menuList"
                        :index="level1.path"
                        :key="level1.id">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{level1.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item v-for="level2 in level1.children" :key="level2.id" :index="level2.path">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{level2.authName}}</span>
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
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出功能
    async logout () {
      try {
        await this.$confirm('您确定要退出本系统吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('shop_token')
        this.$router.push('login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '退出已取消'
        })
      }
    },
    // 获取左侧菜单列表
    async getMenus () {
      const res = await this.axios.get('menus')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenus()
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
                background-size: 100% 100%;
            }
            .title {
                height: 60px;
                overflow: hidden;
                line-height: 60px;
                font-weight: 700;
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
