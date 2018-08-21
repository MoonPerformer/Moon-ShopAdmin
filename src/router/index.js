import Vue from 'vue'
import Router from 'vue-router'
// 异步组件
// import Login from '@/components/login/Login'
// import Home from '@/components/home/Home'
// import Users from '@/components/users/Users'
// import Roles from '@/components/rights/Roles'
// import Rights from '@/components/rights/Rights'
// import Categories from '@/components/goods/Categories'
// import Goods from '@/components/goods/Goods'
// import GoodsAdd from '@/components/goods/Add'
const Login = () => import(/* webpackChunkName:'login' */ '@/components/login/Login')
const Home = () => import(/* webpackChunkName:'home' */ '@/components/home/Home')
const Users = () => import(/* webpackChunkName:'users' */ '@/components/users/Users')
const Roles = () => import(/* webpackChunkName:'roles' */ '@/components/rights/Roles')
const Rights = () => import(/* webpackChunkName:'rights' */ '@/components/rights/Rights')
const Categories = () => import(/* webpackChunkName:'categories' */ '@/components/goods/Categories')
const Goods = () => import(/* webpackChunkName:'goods' */ '@/components/goods/Goods')
const GoodsAdd = () => import(/* webpackChunkName:'goods' */ '@/components/goods/Add')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('shop_token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
