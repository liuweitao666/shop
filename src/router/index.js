import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../view/Login";
import home from "../components/home"

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
    component:home
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
