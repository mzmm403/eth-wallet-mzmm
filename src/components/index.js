// 使用插件的方式去做组件的全局注册
import Eyes3D from "./MzmmEyes3D.vue";
import Login from "./MzmmLogin.vue";

export default{
    install(app,options){
        // 全局注册组件
        app.component("MzmmEye3D",Eyes3D)
        app.component("MzmmLogin",Login)
        // 全局数据挂载
        // app.config.globalProperties.xxx = xxx
        // app.config.globalProperties.fn = function(){}

        // 全局指令注册
        // 自己定义指令
        app.directive("v-focus",{
            //指令的逻辑
        })

        // 全局插件注册
    }
}