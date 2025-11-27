import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(     
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.z = 5;

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');

const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
scene.add(earthMesh);

const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011);

function animate() {
    requestAnimationFrame(animate);
    
    earthMesh.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);
