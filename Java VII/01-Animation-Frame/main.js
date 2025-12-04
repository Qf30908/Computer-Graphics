import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create animated objects
const objects = [];

// Spinning cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, 0, 0);
cube.castShadow = true;
scene.add(cube);
objects.push({ mesh: cube, type: 'cube' });

// Bouncing sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
sphere.castShadow = true;
scene.add(sphere);
objects.push({ mesh: sphere, type: 'sphere' });

// Oscillating torus
const torusGeometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
const torusMaterial = new THREE.MeshLambertMaterial({ color: 0x45b7d1 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(3, 0, 0);
torus.castShadow = true;
scene.add(torus);
objects.push({ mesh: torus, type: 'torus' });

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

// Camera position
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

// Animation variables
let frameCount = 0;
const animationSpeed = 0.02;

// Animation loop using requestAnimationFrame
function animate() {
    requestAnimationFrame(animate);
    
    frameCount++;
    
    // Animate each object based on frame count
    objects.forEach(obj => {
        switch(obj.type) {
            case 'cube':
                // Continuous rotation on all axes
                obj.mesh.rotation.x += animationSpeed;
                obj.mesh.rotation.y += animationSpeed * 1.5;
                obj.mesh.rotation.z += animationSpeed * 0.5;
                break;
                
            case 'sphere':
                // Bouncing motion using sine wave
                obj.mesh.position.y = Math.abs(Math.sin(frameCount * animationSpeed * 2)) * 2;
                obj.mesh.rotation.y += animationSpeed * 2;
                break;
                
            case 'torus':
                // Oscillating position and rotation
                obj.mesh.position.z = Math.sin(frameCount * animationSpeed) * 2;
                obj.mesh.rotation.x += animationSpeed;
                obj.mesh.rotation.y += animationSpeed * 0.7;
                
                // Change color over time
                const hue = (frameCount * 0.5) % 360;
                obj.mesh.material.color.setHSL(hue / 360, 0.7, 0.5);
                break;
        }
    });
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();