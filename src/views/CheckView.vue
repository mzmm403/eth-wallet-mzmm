<template> 
    <mzmm-login>Check Mnemonic</mzmm-login>
    <div class="description">
        <p>📝Tips：来验证一下你保存的助记词是否正确</p>
    </div>
    <div class="container">
        <div class="showdata">
            <table v-for="(number,index) in 4" :key=number>
                <tr>
                    <td v-cloak>{{number*3-2}}.{{ mnemonicArr[index*3] }}</td>
                    <td v-cloak>{{number*3-1}}.{{ mnemonicArr[index*3+1] }}</td>
                    <td v-cloak>{{number*3}}.{{ mnemonicArr[index*3+2] }}</td>
                </tr>
            </table>
        </div>
    </div>
    <div class="check" >
        <template v-for="(num,index) in randomNumArrRef" :key="index">
            <span class="order" v-cloak>{{ num+1 }}</span><input type="text"/>
        </template>
    </div>
    <div class="btn">
        <el-button class="check-btn" type="primary" @click="CheckInput">检查输入</el-button>
        <el-button class="back" type="primary"  @click="tobcak">返回上页</el-button>
    </div>
</template>
<script setup>
import { ref, onUpdated } from "vue"
import{ useRoute,useRouter } from "vue-router"
import useWalletStore from "@/stores/wallet"
import * as bip39 from "bip39"
import { hdkey } from 'ethereumjs-wallet'

const route = useRoute()
const oldmnemonic = route.query.oldmnemonic
const password = route.query.password
const router = useRouter()
const mnemonicArr = ref(route.query.mnemonic)
const walletStore = useWalletStore()

// 获去随机数函数
const GetRandomNum = () => {
    let randomNumArr = []
    let j = 4
    for(let i=0;i < j;i++){
        let randomNum = Math.floor(Math.random() * 12)
        if (randomNumArr.includes(randomNum)){
            j++
            continue
        }else{
            randomNumArr.push(randomNum) 
        }
    }
    
    return randomNumArr
}

let randomNumArr = GetRandomNum()
let randomNumArrRef = ref(randomNumArr.toSorted((a, b) => a - b))
// 获取四个随机数,并清空对应输入框的内容
const ChangeArr = () => {
    let checkArr = []
    for(let i=0;i < 4;i++){
        let num = randomNumArr[i]
        checkArr.push(mnemonicArr.value[num])
        mnemonicArr.value.splice(num,1,"")
    }
    return checkArr
}

let checkArr = ChangeArr()
let checkObj = {}
// 获取检查对象
for (let i=0;i<4;i++){
    let num = randomNumArr[i]
    let str = checkArr[i]
    checkObj[num] = str
}

onUpdated(()=>{
    ChangeArr()
})



//-happy--spirit--notice--much--tomorrow--become--close--apple--same--pave--settle--hollow-
// 检查填写是否正确
// 获取输入框序号
const CheckInput = async() => {
    let inputIndexDom = document.querySelectorAll(".order")
    let inputDom = document.querySelectorAll("input")
    let strArr = []
    let checkstrArr = []
    for(let i=0;i<4;i++){
        let inputIndex = parseInt(inputIndexDom[i].innerText) - 1
        let str = inputDom[i].value
        let checkstr = checkObj[inputIndex]
        strArr.push(str)
        checkstrArr.push(checkstr)
        // 更改样式
        if (str == checkstr){
            inputDom[i].outerHTML += "<span>✔️</span>"
        }else{
            inputDom[i].outerHTML += "<span>❌</span>"
        }
    }
    let flag = strArr.every((value,index) => value === checkstrArr[index])
    if(strArr.length == checkstrArr.length && flag){
        // 处理输入正确的逻辑
        const createloading = ElLoading.service({
            lock: true,
            text: '正在创建新用户,请稍后...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        
        // 根据助记词生成种子
        const seed = await bip39.mnemonicToSeed(oldmnemonic)
        // 更具种子创建一个hdWallet钱包
        const hdWallet = hdkey.fromMasterSeed(seed)
        // 这里的地址默认是以太坊主链
        const keyPair = hdWallet.derivePath("m/44'/60'/0'/0/0")
        // 生成钱包
        const wallet = keyPair.getWallet()
        // 获取账户地址
        const address = wallet.getAddressString()
        // 根据钱包生成keystore
        const keyStore = await wallet.toV3(password)

        let dataObjArr = [{
            address,
            keyStore
        }]
        walletStore.saveWalletUser(dataObjArr)

        createloading.close()

        ElMessage({
            message: '验证成功，输入正确',
            type: 'success',
        })
        router.push({path:"/wallet",query:{password,oldmnemonic}})
    }else{
        // 处理输入错误的逻辑
        ElMessage.error('验证失败，请重新输入')
    }
}

// 回到上页按钮逻辑
const tobcak = () => {
    router.back()
}

</script>
<style scoped>
.showdata table td{
    width: 220px;
    font-size: 30px;
    border: 1px solid #a9aaab;
    border-radius: 10px;
    text-align: center;
    padding: 5px;
} 
.container{
    width: 800px;
    position: relative;
    left:50%;
    transform: translate(-50%);
    padding-top: 100px;
}
.check{
    padding-top: 100px;
    display: flex;
    justify-content: center;
    position: relative;
    right: 60px;
}
.check .order{
    font-size: 25px;
    margin-right: 10px;
    margin-left: 50px;
}
.check input{
    font-size: 20px;
    padding: 5px;
}
.btn{
    display: flex;
    padding-top: 50px;
    justify-content: center;
}
.btn .check-btn{
    position: relative;
    right: 240px;
    font-size: 20px;
    padding: 25px;
}

.btn .back{
    position: relative;
    left: 140px;
    font-size: 20px;
    padding: 25px;
}
.description{
    display: flex;
    justify-content: center;
    margin-top:30px;
    font-size: 30px;
    position: relative;
    right: 25px;
    color:#a9aaab;
}
</style>