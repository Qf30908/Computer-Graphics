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

// Clock for time-based animation
const clock = new THREE.Clock();

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffaa00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
scene.add(sun);

// Create two planets with different orbital speeds
const planetData = [
    { radius: 0.3, distance: 3, speed: 2, color: 0xff4444 },
    { radius: 0.4, distance: 5, speed: 1.2, color: 0x44ff44 }
];

const planets = [];
planetData.forEach((data, index) => {
    const geometry = new THREE.SphereGeometry(data.radius, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    scene.add(planet);
    
    // Create orbit line
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.02, data.distance + 0.02, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x666666, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.3 
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -Math.PI / 2;
    scene.add(orbit);
    
    planets.push({
        mesh: planet,
        distance: data.distance,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2
    });
});

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -3;
plane.receiveShadow = true;
scene.add(plane);

// Camera position
camera.position.set(0, 8, 12);
camera.lookAt(0, 0, 0);

// Animation variables
let animationSpeed = 1;
let totalTime = 0;
 

window.resetAnimation = function() {
    clock.start();
    totalTime = 0;
    planets.forEach(planet => {
        planet.angle = Math.random() * Math.PI * 2;
    });
};

// Animation loop with time-based animation
function animate() {
    requestAnimationFrame(animate);
    
    // Get delta time in seconds
    const deltaTime = clock.getDelta();
    totalTime += deltaTime;
    
    // Apply animation speed multiplier
    const adjustedDeltaTime = deltaTime * animationSpeed;
    
    // Animate sun rotation
    sun.rotation.y += adjustedDeltaTime * 0.5;
    
    // Animate planets orbiting around sun
    planets.forEach(planet => {
        planet.angle += adjustedDeltaTime * planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += adjustedDeltaTime * 2;
    });
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}



// Start animation
animate();