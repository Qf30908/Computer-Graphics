import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create main objects for animation
const mainObjects = {
    ball: null,
    torus: null
};

// Create ball (sphere)
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
mainObjects.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
mainObjects.ball.position.set(-3, 0, 0);
mainObjects.ball.castShadow = true;
scene.add(mainObjects.ball);

// Create torus
const torusGeometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
const torusMaterial = new THREE.MeshLambertMaterial({ color: 0x45b7d1 });
mainObjects.torus = new THREE.Mesh(torusGeometry, torusMaterial);
mainObjects.torus.position.set(3, 0, 0);
mainObjects.torus.castShadow = true;
scene.add(mainObjects.torus);

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -3;
plane.receiveShadow = true;
scene.add(plane);

// Camera position
camera.position.set(0, 8, 15);
camera.lookAt(0, 0, 0);

// GSAP Timeline and Animations
let masterTimeline = gsap.timeline({ repeat: -1, yoyo: true, paused: true });

// Build master timeline
masterTimeline
    .to(mainObjects.ball.position, { duration: 2, x: 3, y: 3, ease: "bounce.out" })
    .to(mainObjects.torus.rotation, { duration: 2, x: Math.PI, z: Math.PI, ease: "power3.inOut" }, "-=1.5")
    .to(mainObjects.ball.scale, { duration: 1, x: 2, y: 2, z: 2, ease: "elastic.out(1, 0.3)" }, "-=1")
    .to(mainObjects.torus.position, { duration: 1.5, y: 2, ease: "power2.inOut" }, "-=1");

// Global animation functions
window.animateBasic = function() {
    gsap.to(mainObjects.ball.position, {
        duration: 2,
        x: Math.random() * 8 - 4,
        y: Math.random() * 4,
        z: Math.random() * 8 - 4,
        ease: "bounce.out"
    });
    
    gsap.to(mainObjects.ball.rotation, {
        duration: 2,
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
        ease: "power2.inOut"
    });
};

window.animateSequence = function() {
    const tl = gsap.timeline();
    
    tl.to(mainObjects.ball.scale, { duration: 0.5, x: 0.1, y: 0.1, z: 0.1, ease: "power2.in" })
      .to(mainObjects.ball.position, { duration: 0.3, y: 5, ease: "power2.out" })
      .to(mainObjects.ball.scale, { duration: 0.5, x: 2, y: 2, z: 2, ease: "elastic.out" })
      .to(mainObjects.ball.position, { duration: 1, y: 0, ease: "bounce.out" })
      .to(mainObjects.ball.scale, { duration: 0.5, x: 1, y: 1, z: 1, ease: "power2.inOut" });
};

window.animateStagger = function() {
    gsap.to([mainObjects.ball.position, mainObjects.torus.position], {
        duration: 1.5,
        y: 3,
        stagger: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
};

window.animatePhysics = function() {
    gsap.to(mainObjects.ball.position, {
        duration: 3,
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 4,
        z: (Math.random() - 0.5) * 8,
        ease: "power2.out"
    });
    
    gsap.to(mainObjects.ball.material, {
        duration: 2,
        opacity: 0.5,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut"
    });
};

window.animateMorphing = function() {
    const tl = gsap.timeline();
    
    tl.to(mainObjects.torus.scale, { duration: 1, x: 2, y: 0.5, z: 2, ease: "power2.inOut" })
      .to(mainObjects.torus.scale, { duration: 1, x: 0.5, y: 2, z: 0.5, ease: "power2.inOut" })
      .to(mainObjects.torus.scale, { duration: 1, x: 1, y: 1, z: 1, ease: "elastic.out" });
    
    gsap.to(mainObjects.torus.material.color, {
        duration: 3,
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut"
    });
};

window.resetAll = function() {
    gsap.to(mainObjects.ball.position, { duration: 1, x: -3, y: 0, z: 0 });
    gsap.to(mainObjects.ball.rotation, { duration: 1, x: 0, y: 0, z: 0 });
    gsap.to(mainObjects.ball.scale, { duration: 1, x: 1, y: 1, z: 1 });
    
    gsap.to(mainObjects.torus.position, { duration: 1, x: 3, y: 0, z: 0 });
    gsap.to(mainObjects.torus.rotation, { duration: 1, x: 0, y: 0, z: 0 });
    gsap.to(mainObjects.torus.scale, { duration: 1, x: 1, y: 1, z: 1 });
};

// Make master timeline globally accessible
window.masterTimeline = masterTimeline;

// Start master timeline
masterTimeline.play();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
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