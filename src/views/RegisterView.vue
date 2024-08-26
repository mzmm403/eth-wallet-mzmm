<template>
    <div class="container">
        <mzmm-login>Register</mzmm-login>
        <div class="homebox">
            <div class="eyes-postion">
                <div class="eyes">
                    <mzmm-eyes-3-d/>
                </div>
            </div>
            <div class="title">
                <h1>欢迎使用m-eth钱包!👋🏻</h1>
                <p>开始创建钱包</p>
            </div>
            <div class="input">
                <input class="passbox" type="password" placeholder="(密码最好为8-10位,且带上特殊符号)" v-model="passwd"/>
            </div>
            <div class="btnBox">
                <el-button type="primary" size="large" class="btn btn-log" @click="toHome"><span>返回首页</span></el-button>
                <el-button type="primary" size="large" class="btn btn-reg" @click="createWallet"><span>创建钱包</span></el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref } from "vue"
import * as bip39 from "bip39"
import MzmmLogin from '@/components/MzmmLogin.vue';

// 返回首页按钮路由跳转的逻辑
const router = useRouter()

const toHome = () => {
    router.push("/")
}

// 获取用户输入的密码
let passwd = ref("")
// 创建钱包按钮的逻辑
const createWallet = () => {
    // 对用户输入进行判断
    if(passwd.value === ""){
        ElMessage.error('Error：密码不能为空')
    }else{
        // 获取助记词
        const mnemonic = bip39.generateMnemonic()
        router.push({path:"/mnemonic",query:{mnemonic:mnemonic,password:passwd.value,oldmnemonic:mnemonic}})
    }
}
</script>
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
    padding: 20px;
}
.btn-log{
    position: relative;
    right: 65px;
    font-size: 20px;
    padding: 4%;
}
.btn-reg{
    position: relative;
    left: 65px;
    font-size: 20px;
    padding: 4%;
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
.input{
    padding-top: 70px;
}
.passbox{
    width: 340px;
    font-size: 20px;
    padding: 6px;
    border: none;
    border-bottom: 1px solid #535a61;
}
</style>