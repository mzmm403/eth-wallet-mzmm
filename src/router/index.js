import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: "/register",
      name: "register",
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: "/mnemonic",
      name: "mnemonic",
      component: () => import('../views/MnemonicView.vue')
    },
    {
      path: "/check",
      name: "check",
      component: () => import('../views/CheckView.vue')
    },
    {
      path: "/wallet",
      name: "wallet",
      component: () => import('../views/WalletView.vue')
    }
  ]
})
// 使用导航首位拉控制访问(对于注册页面)
router.beforeEach((to,from,next) => {
  const protectedRoutes = 'register'
  if (protectedRoutes.includes(to.name) && from.name !== "home"){
    next({ name:'home' })
  }else{
    // 允许导航
    next()
  }
})


export default router
