<template>
    <mzmm-login>Get Mnemonic</mzmm-login>
    <div class="container">
        <div class="article">
            <el-card>
                <template #header>
                    <div class="article-title">
                        <span>助记词Tips：</span>
                    </div>
                </template>
                <p class="context-title">🥇助记词是什么>></p>
                <p class="context">
                    ✳️ 是一种由一组随机单词组成的密钥序列，
                    用于恢复和备份加密钱包的私钥。这些单词通常由12、15、18或21个单词组成，
                    取自一个预定义的助记词词库，并且生成顺序遵循特定的算法。
                    助记词与私钥之间存在一对一的映射关系，通过数学算法生成。
                </p>
                <p class="context-title">🥈助记词的作用是什么>></p>
                <p class="context">
                    🎬︎ 助记词主要使用来帮助人们记忆复杂的私钥的
                </p>
                <p class="context">
                    🔁 恢复和备份：助记词允许用户在丢失设备或忘记私钥、密码时，能够恢复对钱包的访问。
                </p>
                <p class="context">
                    🦺 安全性：通过将私钥转换为易记忆的单词序列，助记词提高了私钥的安全性和易用性。
                </p>
                <p class="context">
                    🧑‍🤝‍🧑 多账户管理‌：助记词可以管理HD账户下所有的钱包地址，使得用户能够方便地管理多个数字资产账户。
                </p>
                <p class="context-title">🥉助记词的存储>></p>
                <p class="context">
                    ❗️ 如果助记词被盗用，那么也就意味着你的钱包将会变得岌岌可危，里面的余额可能会不复存在。
                </p>
                <p class="context">
                    💾 存储方式：物理存储/多点存放/使用强密码保护。
                </p>
            </el-card>
        </div>
        <div class="zhujici">
            <table v-for="(number,index) in 4" :key=number>
                <tr>
                    <td>{{number*3-2}} - {{ mnemonics[index*3] }}</td>
                    <td>{{number*3-1}} - {{ mnemonics[index*3+1] }}</td>
                    <td>{{number*3}} - {{ mnemonics[index*3+2] }}</td>
                </tr>
            </table>
            <div class="userget">
                <div>
                    <div class="gettips">
                        <p>可以直接复制存储：</p>
                    </div>
                    <template v-for="(value,index) in mnemonics" :key=index>
                        <span>-{{ value }}-</span>
                    </template>
                </div>
            </div>
            <div class="check">
                <el-button type="primary" size="large" @click="GetCheck">验证</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute,useRouter } from 'vue-router';
import { ref } from 'vue'
// 获取参数
const route = useRoute()
const oldmnemonic = route.query.oldmnemonic
const password = route.query.password
let mnemonicArr = route.query.mnemonic.split(" ")
const mnemonics = ref(mnemonicArr)

// 验证按钮
const router = useRouter()
const GetCheck = () => {
    router.push({path:"/check",query:{mnemonic:mnemonics.value,password,oldmnemonic}})
}
</script>
<style scoped>
.container{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.zhujici{
    margin-right: 80px;
}

.zhujici table td{
    width: 220px;
    font-size: 30px;
    border: 1px solid #a9aaab;
    border-radius: 10px;
    text-align: center;
    padding: 5px;
} 
.zhujici .userget{
    color:rgb(133, 134, 135);
    font-size: 30px;
    width: 700px;
    height: 300px;
    text-align: center;
    display: flex;
    align-items: center;
    background: palegreen;
    border-radius: 10px;
    margin-top: 120px;
    box-shadow: 0 0 80px #8b37c5;
}
.zhujici .userget .gettips{
    font-size: 18px;
    text-align: start;
    color:#a9aaab;
    position: relative;
    bottom: 90px;
    left: 20px;
}
.article{
    width: 900px;
    line-height:50px;
    position: relative;
    top: 40px;
    margin-left: 80px;
}
.article .article-title{
    font-size: 30px;
    font-weight: 600;
    color:#a9aaab;
}
.article .context{
    text-indent: 40px;
    font-size: 18px;
}
.article .context-title{
    font-size: 22px;
    font-weight: 600;
}
.check{
    width: 60px;
    position: relative;
    left: 620px;
    top: 80px
}
.check el-button{
    padding: 10px;
}
</style>
