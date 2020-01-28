import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../view/Login";
import home from "../components/home"
import Welcome from "../components/Welcome"
import users from "../components/user/users"
import roles from "../components/power/roles/roles"
import Rights from "../components/power/right/Rights"
import Cate from "../components/goods/Cate"
import Params from "../components/goods/Params"
 const goods = ()=>import("../components/goods/goods")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path:'/home',
    name:'home',
    component:home,
    redirect:'/Welcome',
    children:[
      {path:'/Welcome',component:Welcome},
      {path:'/users',component:users},
      {path:'/roles',component:roles},
      {path:'/rights',component:Rights},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:goods},
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  // to将要访问的页面
  if(to.path ==='/login') return next()
  // 获取本地的token
  const token = window.sessionStorage.getItem('token')
  // 如果未登录则返回登录页
  if(!token) return next('/login')
  next()
})

export default router
