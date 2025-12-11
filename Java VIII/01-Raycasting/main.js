import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const cubes = [];
//
const spheres = [];
const originalColors = [];
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

for (let i = 0; i < 15; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(geometry, material);

    const sgeometry =new THREE.SphereGeometry( 0.5, 16, 16 );
    const smaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh( sgeometry, material );
    
    
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;
    
    // 
    sphere.position.x=(Math.random() - 0.5) * 10;
    sphere.position.y=(Math.random() - 0.5) * 10;
    sphere.position.z=(Math.random() - 0.5) * 10;
    

    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    cube.rotation.z = Math.random() * Math.PI;
    
    //
    sphere.rotation.x = Math.random() * Math.PI;
    sphere.rotation.y = Math.random() * Math.PI;
    sphere.rotation.z = Math.random() * Math.PI;

    cube.castShadow = true;
    cube.receiveShadow = true;

    //
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    scene.add(cube);
    cubes.push(cube);
    originalColors.push(material.color.getHex());

    scene.add(sphere);
    spheres.push(sphere);
    originalColors.push(smaterial.color.getHex());
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(cubes);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        intersected.material.color.setHex(randomColor);
        
        intersected.scale.setScalar(1.2);
        setTimeout(() => {
            intersected.scale.setScalar(1.0);
        }, 150);
    }
}

window.addEventListener('click', onMouseClick);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    
    cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });

    spheres.forEach((sphere, index) => {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();