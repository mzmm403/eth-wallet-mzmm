<script setup>
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// 导入three
import * as THREE from "three"
import { onMounted } from 'vue'

// 创建场景
const scene = new THREE.Scene()

// 设置背景颜色为白色
// scene.background = new THREE.Color(0x00FFFFFF)

// 添加环境光源，提供均匀光照
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白色光，强度为1
scene.add(ambientLight);

// 创建相机
const camera = new THREE.PerspectiveCamera(
    45, // 视角,同样的距离视角越大看到的越多
    1,  // 相机的宽高比，这里会在稍后动态设置
    0.1, // 近平面 相机最近能看到什么
    1000 // 远平面 相机最远能看到什么
)
camera.position.z = -40
camera.lookAt(0,0,0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0xffffff), 0); // 0 表示完全透明
// 定义 controls 变量
let controls;

const animate = async function(){
    if (controls) controls.update();
    requestAnimationFrame(animate)
    // 渲染
    renderer.render(scene, camera)
}

let model

onMounted(() => {
    const container = document.querySelector('#three-container');
    if (container) {
        const { clientWidth, clientHeight } = container;

        // 设置渲染器大小为容器的宽高
        renderer.setSize(clientWidth, clientHeight);

        // 设置相机的宽高比
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();

        // 将渲染器的画布添加到容器中
        container.appendChild(renderer.domElement);

        // // 实例化轨道控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false
        controls.enableZoom = false
        // 开始动画循环
        animate();
    }

    // 实例化加载器并加载模型
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        "./model/walleteyes.glb",
        function (gltf) {
            model = gltf.scene;
            model.scale.set(500, 500, 500);
            scene.add(model);

            // 计算模型的包围盒
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            const size = new THREE.Vector3();
            box.getSize(size);

            const directionalLight = new THREE.DirectionalLight(0xd9d8d9, 1);
            directionalLight.position.set(center.x, center.y + size.y, center.z);
            directionalLight.target.position.set(center.x, center.y, center.z);

            scene.add(directionalLight);
            scene.add(directionalLight.target);
        }
    );
});

window.addEventListener('mousemove', function(e) {
    // 定义窗口尺寸的临界值和缓冲区
    const criticalX = window.innerWidth * 0.5;
    const criticalY = window.innerHeight * 0.335;
    const buffer = 20; // 缓冲区大小，可以调整

    let deltaX = 0;
    let deltaY = 0;

    // X轴方向的旋转逻辑
    if (e.pageX > criticalX + buffer) {
        deltaX = (e.pageX - criticalX) / 1000;
    } else if (e.pageX < criticalX - buffer) {
        deltaX = -(criticalX - e.pageX) / 1000;
    }

    // Y轴方向的旋转逻辑
    if (e.pageY > criticalY + buffer) {
        deltaY = -(e.pageY - criticalY) / 2000;
    } else if (e.pageY < criticalY - buffer) {
        deltaY = (criticalY - e.pageY) / 2000;
    }

    // 平滑地更新模型的旋转
    model.rotation.y += (deltaX - model.rotation.y) * 0.1;
    model.rotation.x += (deltaY - model.rotation.x) * 0.1;
});



window.addEventListener("resize", () => {
    const container = document.querySelector('#three-container');
    if (container) {
        const { clientWidth, clientHeight } = container;

        // 重置渲染器大小
        renderer.setSize(clientWidth, clientHeight);

        // 重置相机的宽高比
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }
});


</script>

<template>
  <div id="three-container" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>
#three-container {
    width: 100%;
    height: 100vh; /* 高度可以设置为视口高度，或根据需求调整 */
    overflow: hidden;
    position: relative;
}
</style>
