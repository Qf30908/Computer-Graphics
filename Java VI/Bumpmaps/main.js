import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(     
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.z = 5;

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('stone_pathway_02_diff_4k.jpg');
const earthNormalMap = textureLoader.load('stone_pathway_02_disp_4k.png');

earthTexture.wrapS = THREE.RepeatWrapping;
earthTexture.wrapT = THREE.RepeatWrapping;
earthNormalMap.wrapS = THREE.RepeatWrapping;
earthNormalMap.wrapT = THREE.RepeatWrapping;

const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    // normalMap: earthNormalMap,
    displacementMap: earthNormalMap,
    displacementScale: 0.3,
    // normalScale: new THREE.Vector2(3.0, 3.0),
    roughness: 1.0,
    metalness: 0.1
});

const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
scene.add(earthMesh);

const ambientLight = new THREE.AmbientLight(0x202020, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight.position.set(5, 0, 5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

function animate() {
    requestAnimationFrame(animate);
    
    earthMesh.rotation.y += 0.005;
    controls.update();
    
    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);