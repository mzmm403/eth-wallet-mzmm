import { defineStore } from 'pinia'

const useWalletStore = defineStore("walletInfo",()=>{
  const saveWalletUser = (key) => {
      // 本地存储钱包账户对象
      localStorage.setItem("user_wallet",JSON.stringify(key))
  }

  const getWalletUser = () => {
    let cacheWalletUser = localStorage.getItem("user_wallet")
    return cacheWalletUser
  }

  const isLocalNull = () => {
    let cacheWalletUser = localStorage.getItem("user_wallet")
    if(cacheWalletUser === null){
      return false
    }else{
      return true
    }
  }

  return {
    saveWalletUser,
    getWalletUser,
    isLocalNull
  }
})

export default useWalletStore