<template>
    <div class="logopostion">
        <div class="logo">
            <p class="logotitle" @click="backHome">👛MzmmWallet</p>
            <p class="event"><slot></slot></p>
            <p>
                <span class="auth">🐒mzmm</span>
                <img src="/img/logo.png"/>
            </p>
        </div>
    </div>
</template>
<script setup>
    import {useRouter} from 'vue-router'
    const router = useRouter()
    // 点击钱包的p标签可以返回首页
    const backHome = function(e){
        router.push("/")
    }
</script>
<style scoped>
.logopostion{
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo{
    width:950px;
    display: flex;
    justify-content: space-between
}
.logo .auth{
    font-size: 24px;
    font-weight: 400;
    position: relative;
    bottom:12px;
    right: 10px;
}
.logo .logotitle{
    font-size: 38px;
    font-weight: 500;
    position: relative;
    top: 2px;
    cursor: pointer;
}
.logo img{
    width: 45px;
    position: relative;
    top: 6px;
}
.event{
    font-size: 38px;
    font-weight: 500;
    position: relative;
    top: 10px;
}
</style>