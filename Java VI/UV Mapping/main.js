import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('dice_unwrap.png'); 

const geometry = new THREE.BoxGeometry(1, 1, 1);

const uvs = [
    // 0, 0.33, 
    // 0.25, 0.33, 
    // 0.25, 0.66,
    // 0.0, 0.66, 
    
   
    0.75, 0.33,
    1, 0.33,
    0.75, 0.66,
    1, 0.66,

    0.50, 0.33,
    0.75, 0.33,
    0.50, 0.66,
    0.75, 0.66,

    // 0.25, 0.33, 0.5, 0.33, 
    // 0.25, 0.66, 0.5, 0.66,

    0.0, 0.33, 0.25, 0.33, 
    0.0, 0.66, 0.25, 0.66,

    0.25, 0, 0.5, 0, 0.5, 
    0.33, 0.25, 0.33, 0.5,

    0.66, 0.75, 0.66, 0.75, 
    1.0, 0.5, 1.0, 0,

    0.33, 0.25, 0.33, 
    0.25, 0.66, 0, 0.66,
];

// Apply custom UV mapping
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

// Create a material with the texture map
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


// Render loop to display the scene
function animate() {
    requestAnimationFrame(animate);
   

    renderer.render(scene, camera);
}
animate();