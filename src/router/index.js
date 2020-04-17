import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Permissons from '../components/permissions/Permissions.vue'
import Roles from '../components/permissions/Roles.vue'
import GoodsCategory from '../components/goods/GoodsCategory.vue'
import GoodsCategoryParams from '../components/goods/GoodsCategoryParams.vue'
import Goods from '../components/goods/Goods.vue'
import GoodsAdd from '../components/goods/GoodsAdd.vue'
import Orders from '../components/order/Orders.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'index',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/permissions',
        name: 'Permissions',
        component: Permissons
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/goods_category',
        name: 'GoodsCategory',
        component: GoodsCategory
      },
      {
        path: '/goods_params',
        name: 'GoodsCategoryParams',
        component: GoodsCategoryParams
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods
      },
      {
        path: '/goods/add',
        name: 'GoodsAdd',
        component: GoodsAdd
      },
      {
        path: '/orders',
        name: 'Orders',
        component: Orders
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 为一个函数，表示放行 next() 放行， next(/login) 强制跳转
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
