<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import useWalletStore from "@/stores/wallet"
import { hdkey } from 'ethereumjs-wallet'
import * as bip39 from "bip39"
import { Lock,Notebook } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const toRegister = () => {
    router.push('/register')
}

const walletStore = useWalletStore()
let isnullFlag = ref(walletStore.isLocalNull)

let Flag = ref(false)
let password = ref()
let passwd = ref()
const isLoggedIn = ref(false);


const intoWallet = async (password,passwd) => {
    let isnull = walletStore.isLocalNull
    if(isnull){
        // 不为空登录，首先看助记词正不正确
        // 如果正确就跳转到用户界面(带上助记词跳转即可)
        const loading = ElLoading.service({
            lock: true,
            text: '正在登录,请稍后...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        let oldmnemonic = password
        const seed = await bip39.mnemonicToSeed(oldmnemonic)
        const hdWallet = hdkey.fromMasterSeed(seed)
        const keyPair = hdWallet.derivePath("m/44'/60'/0'/0/0")
        const wallet = keyPair.getWallet()
        const address = wallet.getAddressString()
        const keystore = await wallet.toV3(passwd)
       
        let walletObj = JSON.parse(walletStore.getWalletUser())
        let checkaddress = walletObj[0].address
        let checkkeysotre = walletObj[0].keyStore


        if(address === checkaddress){
            if(checkkeysotre.address === keystore.address){
                isLoggedIn.value = true;
                loading.close()
                ElMessage({
                    message: '登陆成功',
                    type: 'success',
                })
            
                router.push({path:"/wallet",query:{password:passwd,oldmnemonic}})
            }else{
                loading.close()
                ElMessage.error('密码错误')
            }
        }else{
            loading.close()
            ElMessage.error('助记词错误')
        }

    }else{
        loading.close()
        // 为空提醒注册
        ElMessage.error('还没有账号，请注册')
    }
    Flag.value =false
}

router.beforeEach((to, from, next) => {
    if (to.name === 'wallet') {
        if (isLoggedIn.value) {
            next(); 
        } else {
            ElMessage.error('请先登录');
            next({ name: 'home' });
        }
    } else {
        next(); 
    }
});


</script>
<template>
    <div class="container">
        <mzmm-login>Home</mzmm-login>
        <div class="homebox">
            <div class="eyes-postion">
                <div class="eyes">
                    <mzmm-eyes-3-d/>
                </div>
            </div>
            <div class="title">
                <h1>欢迎使用m-eth钱包！</h1>
                <p>即将去进入去中心化网络</p>
            </div>
            <div class="btnBox">
                <el-button type="primary" size="large" class="btn btn-log" @click="Flag = true"><span>导入钱包</span></el-button>
                <el-dialog v-model="Flag" title="转账" width="35%" center>
                    <div class="zhuangzhan">
                        <el-input class="t-input" v-model="password" placeholder="请输入助记词" :prefix-icon="Notebook"/>
                        <el-input class="t-input" v-model="passwd" placeholder="请输入密码" :prefix-icon="Lock" style="margin-top: 10px;"/>
                    </div>
                    <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="intoWallet(password,passwd)" type="primary">导入</el-button>
                        <el-button @click="Flag = false">取消</el-button>
                    </span>
                    </template>
                </el-dialog>
                <el-button type="primary" size="large" class="btn btn-reg" @click="toRegister" :disabled="isnullFlag"><span>创建钱包</span></el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.homebox{
    width: 700px;
    position: relative;
    left: 50%;
    top: 60px;
    transform: translate(-50%);
    text-align: center;
}
.eyes-postion{
    display: flex;
    justify-content: center;
}
.eyes{
    width: 500px;
    height: 280px;
}
.btnBox{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
}
.btn-log{
    position: relative;
    right: 65px;
    font-size: 20px;
    padding: 5%;
}
.btn-reg{
    position: relative;
    left: 65px;
    font-size: 20px;
    padding: 5%;
}
.btn span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
}

.btn span:after {
    content: '🚀';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
}
.btn:hover span {
    padding-right: 25px;
}

.btn:hover span:after {
    opacity: 1;
    right: 0;
    letter-spacing: -10px;
}

.title{
    text-align: center;
}
.title h1{
    color: #535a61;
}
.title p{
    font-size: 20px;
    padding: 10px;
}
</style>