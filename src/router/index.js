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


export default router
