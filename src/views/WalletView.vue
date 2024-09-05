<template>
    <mzmm-login></mzmm-login>
    <div class="weizhi">
        <div class="main">
            <div class="head">
                <div class="network">
                    <el-tree-select v-model="networkvalue" :data="networkdata" :render-after-expand="false" show-checkbox placeholder="选择网络"/>
                </div>
                <div class="address">
                    <div class="img-address">
                        <p class="userimg"><img src="/img/user.png" /></p>
                        <el-tree-select v-model="addressvalue" :data="addressRef" :render-after-expand="false" show-checkbox placeholder="选择账户"/>
                    </div>
                    <p class="address-text">{{ addressvalue }}</p>
                </div>
                <div>
                    <el-dropdown  placement="bottom-start">
                        <el-button :icon="More"></el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                <el-dropdown-item @click="AddNewUser" class="footer">添加新用户</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="body">
                <div class="yue">
                    <p class="eth" v-cloak>{{ BalanceRef }}</p>
                    <p class="usd" v-cloak>$0.00 USD</p>
                </div>
                <div class="action">
                    <el-tooltip content="转账"  placement="bottom">    
                        <el-button class="btn" type="primary" :icon="Promotion" size="large" circle @click="transferFlag = true"></el-button>
                    </el-tooltip>
                    <el-dialog v-model="transferFlag" title="转账" width="35%" center>
                        <div class="zhuangzhan">
                            <el-input class="t-input" v-model="dst_money" placeholder="请输入转账额度" :prefix-icon="Money"/>
                            <el-input class="t-input" v-model="Dst_address" placeholder="请输入转账地址" :prefix-icon="Position"/>
                            <el-input class="t-input" v-model="PriKey" placeholder="请输入私钥" :prefix-icon="Lock"/>
                        </div>
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="transferMoney(addressvalue,Dst_address,dst_money,PriKey,transferNetwork)" type="primary">转账</el-button>
                            <el-button @click="transferFlag = false">取消</el-button>
                        </span>
                        </template>
                    </el-dialog>
                    <el-tooltip content="导出私钥"  placement="bottom">
                        <el-button class="btn" @click="centerDialogVisible = true" type="primary" size="large" :icon="Key" circle></el-button>
                    </el-tooltip>
                    <el-dialog v-model="centerDialogVisible" title="请妥善保存好私钥" width="30%" center>
                        <span>{{ privateKey }}</span>
                        <el-input class="t-input" v-model="getpasswd" placeholder="请输入密码" :prefix-icon="Lock"/>
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="GetPrivateKey(getpasswd)" type="primary">导出</el-button>
                            <el-button @click="copyPrivateKey" type="primary">复制</el-button>
                            <el-button @click="centerDialogVisible = false">取消</el-button>
                        </span>
                        </template>
                    </el-dialog>
                    <el-tooltip content="私钥导入账户"  placement="bottom">
                        <el-button class="btn" @click="importFlag = true" type="primary" size="large" :icon="CirclePlus" circle></el-button>
                    </el-tooltip>
                    <el-dialog v-model="importFlag" title="通过私钥导入账户" width="30%" center>
                        <el-input class="t-input" v-model="importprivateKey" placeholder="请输入私钥" :prefix-icon="Key"/>
                        <el-input class="t-input" v-model="importpasswd" placeholder="请输入密码" :prefix-icon="Lock"/>
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="importAccount(importprivateKey,importpasswd)" type="primary">导入</el-button>
                            <el-button @click="importFlag = false">取消</el-button>
                        </span>
                        </template>
                    </el-dialog>
                </div>
                <div class="page">
                    <el-tabs v-model="activeName" type="card" class="tabs" stretch="true">
                        <el-tab-pane class="list" label="当前转账结果" name="second">
                            <div v-if="!TxID" style="margin-top: 20px;color: #757676;">当前没有转账结果</div>
                            <div class="showres" v-if="TxID">
                                <p>交易ID📇</p>
                                <p class="resvalue">{{ TxID }}</p>
                                <p>交易地址🔗</p>
                                <el-link class="resvalue" :href="urladdress">{{ urladdress }}</el-link>
                                <p>交易金额💸</p>
                                <p class="resvalue">{{ dst_money }}</p>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane class="money" label="功能" name="first">
                            <div class="getmoney"><a href="https://portfolio.metamask.io/buy/region">获取代币➕️</a></div>
                            <div class="refresh"><a @click="refreshPage">刷新列表🔄</a></div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>        
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref,watch } from 'vue'
import { Promotion,More,Sort,Key,Lock,Position,Money,CirclePlus } from '@element-plus/icons-vue'
import useWalletStore from '@/stores/wallet'
import ethwallet from "ethereumjs-wallet"
import * as bip39 from "bip39"
import { hdkey } from 'ethereumjs-wallet'
import Web3 from 'web3'
import Tx from 'ethereumjs-tx'

const route = useRoute()
const walletStore = useWalletStore()
const password = route.query.password
const oldmnemonic = route.query.oldmnemonic
const addressRef = ref("")
const src_addressRef = ref("")
const transferNetwork = ref("wss://mainnet.infura.io/ws/v3/85089d1c31974f81a22a20f43401d021")
// 网络选择的数据
const networkvalue = ref('wss://mainnet.infura.io/ws/v3/85089d1c31974f81a22a20f43401d021')
const networkdata = ref([
    {
        value: 'wss://mainnet.infura.io/ws/v3/85089d1c31974f81a22a20f43401d021',
        label: "Mainnet"
    },
    {
        value: 'wss://sepolia.infura.io/ws/v3/85089d1c31974f81a22a20f43401d021',
        label: "Sepolia",
    }
])


// 关于page标签页的操作
const activeName = ref('first')
// 获取本地存储的钱包对象(存了地址和keystore)
let walletObj = JSON.parse(walletStore.getWalletUser())

// 账户地址数据
let userAddress = []

for(let i=0;i<walletObj.length;i++){
    let j = i + 1
    const address = walletObj[i].address
    let addressObj = {
        id: i,
        value: address,
        label:"账户"+ j
    }
    userAddress.push(addressObj)
}
const addressvalue = ref(walletObj[0].address)
addressRef.value = userAddress

// 外来添加账户(私钥)
let importFlag = ref(false)
let importprivateKey = ref()
let importpasswd = ref()
const importAccount = async(importprivateKey,importpasswd) => {
    const importloading = ElLoading.service({
        lock: true,
        text: '正在导入,请稍后...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let ImPrivateKey = Buffer(importprivateKey,"hex")
    let wallet = ethwallet.fromPrivateKey(ImPrivateKey)
    let Imaddress = wallet.getAddressString()
    let keyStore = await wallet.toV3(importpasswd)
    let ImaddressObj = {
        address: Imaddress,
        keyStore: keyStore
    } 

    walletObj.push(ImaddressObj)
    walletStore.saveWalletUser(walletObj)
    location.reload();
    importloading.close(false)
    ElMessage({
        message: '导入成功',
        type: 'success',
    })

    importFlag.value = false 
}

// 根据选择的网络和账户渲染余额
// 根据网络生成对应网络的web3对象
let web3 = new Web3(Web3.givenProvider || networkvalue.value)
const createWeb3 = (network) => {
    web3 = new Web3(Web3.givenProvider || network)
}


// 根据当前的用户地址获取当前网络的余额
let BalanceRef = ref("") 
// 初始值
web3.eth.getBalance(addressvalue.value).then(res=>{
    // 这里的res是wei为单位的
    let balance = Web3.utils.fromWei(res,"ether")
    const match = networkvalue.value.match(/\/\/([^\.]+)/)
    const matchres = match ? match[1] : "" 
    BalanceRef.value = balance  + matchres + "eth"
    
})
// 响应式更新的值
const GetBalance = async(address) => {
    let res = await web3.eth.getBalance(address)
    let balance = Web3.utils.fromWei(res,"ether")
    const match = networkvalue.value.match(/\/\/([^\.]+)/)
    const matchres = match ? match[1] : "" 
    BalanceRef.value = balance  + matchres + "eth"
}

// 检查网络是否连通
const isLink = () => {
    let pDom = document.querySelector(".eth")
    if(pDom.innerText == ""){
        ElMessage.error('连接失败，请切换网络，检查网络连接')
    }else{
        ElMessage({
            message: '当前网络连接成功',
            type: 'success',
        })
    }
}


// 导出私钥
const privateKey = ref()
let changeKeyStoreindex = ref(0)
let centerDialogVisible = ref(false)
let getpasswd = ref()
let GetPrivateKey = async(getpasswd) => {
    const createloading = ElLoading.service({
        lock: true,
        text: '正在生成私钥,请稍后...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let index = changeKeyStoreindex.value
    let walletIndex = walletObj[index]
    const keystore = walletIndex.keyStore
    const wallet = await ethwallet.fromV3(keystore,getpasswd)
    // 获取私钥导出
    privateKey.value = "0x" + wallet.getPrivateKey().toString("hex")
    createloading.close()
}
// 私钥复制逻辑
const copyPrivateKey = async () => {
    await navigator.clipboard.writeText(privateKey.value)
    ElMessage({
        message: '私钥已复制到剪贴板',
        type: 'success',
    })
    centerDialogVisible.value = false
}


// 转账逻辑
// 获取密码和转账地址
let dst_money = ref()
let Dst_address = ref()
let PriKey = ref()
let urladdress = ref()
let TxID = ref()
let transferFlag = ref(false)
const transferMoney = async(src_address,dst_address,money,priKey,network) => {
    // 构建转账的参数
    // 创建新的web3对象和页面的网络地址同步
    web3 = new Web3(Web3.givenProvider || network)
    // 1. 构建随机的整数
    let nonce_mid = await web3.eth.getTransactionCount(src_address)
    let nonce = web3.utils.toHex(nonce_mid)
    // 2.获取转账的gas费
    let gasPrice_mid = await web3.eth.getGasPrice()
    let gasPrice = web3.utils.toHex(gasPrice_mid)
    // 3. 要转账的金额
    let value_mid = web3.utils.toWei(money,"ether")
    let value = web3.utils.toHex(value_mid)
    // 构建转账参数
    const rawTx = {
        from: src_address,
        to: dst_address,
        nonce,
        gasPrice,
        value,
        // data这个参数就是如果使用其他代币情况下(v1版不考虑)
        data: "0x"
    }
    // 2. 生成 serializedTx
    // 转化私钥
    let pKey = Buffer.from(priKey.slice(2),"hex")
    const gas = await web3.eth.estimateGas(rawTx)
    rawTx.gas = gas
    const tx = new Tx(rawTx)
    tx.sign(pKey)
    const transferloading = ElLoading.service({
        lock: true,
        text: '正在转账，请稍后...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    //生成serializedTx
    const serializedTx = "0x" + tx.serialize().toString("hex")
    // 开始转账
    const trans = web3.eth.sendSignedTransaction(serializedTx)
    transferloading.close()
    trans.on("transactionHash",(txid) => {
        ElMessage({
            message: '交易成功，请到区块链浏览器查看',
            type: 'success',
        })
        let txID = txid
        let txaddress = "https://sepolia.etherscan.io/tx/"+txid
        TxID.value = txID
        urladdress.value = txaddress
    })
    trans.on('error',(err)=>{
        ElMessage.error('错误：',err)
    })
    transferFlag.value = false
}

// 刷新当前页面
const refreshPage = async() => {
    location.reload();
}

    // 添加新用户
const AddNewUser = async() => {
    const addloading = ElLoading.service({
        lock: true,
        text: '正在添加新用户,请稍后...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let userId
    if (walletObj.length === 0){
        userId = 0
    }else{
        userId = walletObj.length-1+1
    }
    console.log(userId)
    // 根据助记词生成种子
    const seed = await bip39.mnemonicToSeed(oldmnemonic)
    // 更具种子创建一个hdWallet钱包
    const hdWallet = hdkey.fromMasterSeed(seed)
    // 这里的地址默认是以太坊主链
    const keyPair = hdWallet.derivePath("m/44'/60'/0'/0/"+userId)
    // 生成钱包
    const wallet = keyPair.getWallet()
    // 获取账户地址
    const address = wallet.getAddressString()
    // 根据钱包生成keystore
    const keyStore = await wallet.toV3(password)

    let dataObj = {
        address,
        keyStore
    }
    
    walletObj.push(dataObj)
    walletStore.saveWalletUser(walletObj)
    location.reload();
    addloading.close(false)
    ElMessage({
        message: '添加成功',
        type: 'success',
    })
}

// 监听逻辑
// 监听网络变化和账户的变化的时候页面需要的变化
watch([networkvalue,addressvalue],async([newNetwork,newAddress],[oldNetwork,oldAddress]) => {
    await createWeb3(newNetwork)
    await GetBalance(newAddress)
    setTimeout(()=>{
        isLink()
    },1500)
    src_addressRef.value = newAddress
    transferNetwork.value = newNetwork

    for(let a=0;a<userAddress.length;a++){
        if(userAddress[a].value === newAddress){
            changeKeyStoreindex.value = userAddress[a].id
        }
    }
})

// 生命周期
onMounted(()=>{
    setTimeout(()=>{
        isLink()
    },1500)
})

</script>
<style scoped>
.weizhi{
    display: flex;
    justify-content: center;
}
.main{
    width: 1100px;
    height: 850px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px #757676;
}
.head{
    height: 40px;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 0 0 20px #757676;
    display: flex;
    justify-content: space-between;
    padding: 20px;
}
.head .network{
    width: 100px;
}
.head .address{
    width: 120px;
}
.head .address .address-text{
    position: relative;
    right: 130px;
}
.head .address .img-address{
    display: flex; 
}
.body{
    padding: 40px 10px 10px 10px;
    height: 720px;
}
.body .yue{
   text-align: center;
   line-height: 40px;
}
.body .yue .eth{
    font-size: 35px;
}
.body .yue .usd{
    color:#7b7d7d;
}
.body .action{
    text-align: center;
    margin-top: 65px;
}

.body .action .btn{
    margin: 5px 10px;
}
.body .page{
    /* text-align: center; */
    margin-top: 60px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
}
.userimg{
    text-align: center;
    position: relative;
    right: 20px;
}
.userimg img{
    width: 30px;
}
.tabs .money .getmoney{
    margin-top: 30px;
    margin-bottom: 30px;
}

.money .getmoney a{
    color: rgb(82, 77, 77);
    text-decoration: none;
    padding: 15px 400px ;
    border-radius: 18px;
}

.money .getmoney a:hover{
    color:aliceblue;
    background:#409eff;
    cursor: pointer;
}

.tabs .money .refresh{
    margin-top: 30px;
    margin-bottom: 30px;
}

.money .refresh a{
    text-decoration: none;
    color: rgb(82, 77, 77);
    padding: 15px 400px;
    border-radius: 18px;
}

.money .refresh a:hover{
    color:aliceblue;
    background:#409eff;
    cursor: pointer;
}
.zhuangzhan{
    text-align: center;
}
.zhuangzhan .t-input{
    width: 80%;
    margin: 10px;
}
.showres p{
    font-size: 25px;
    font-weight: 300;
    color: #524d4d;
}

.showres .resvalue{
    color:#409eff;
    font-size: 18px;
    font-weight: 150;
}
</style>
