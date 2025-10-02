import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(     
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.z = 10;

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cubeMesh = new THREE.Mesh(geometry, material);

const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true });
const spherecubeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
spherecubeMesh.position.x = 4;

cubeMesh.translateX(-3);
spherecubeMesh.translateX(3);
spherecubeMesh.translateY(3);


scene.add(cubeMesh);
scene.add(spherecubeMesh);

const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.y = 3;
scene.add(torusMesh);

const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.y = -3;
scene.add(coneMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 3);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cubeDirection = 1; 

function animate() {
    requestAnimationFrame(animate);

    cubeMesh.position.x += 0.05 * cubeDirection;
    if (cubeMesh.position.x > 5) cubeDirection = -1;
    if (cubeMesh.position.x < -5) cubeDirection = 1;

    cubeMesh.rotation.y += 0.01;
    spherecubeMesh.rotation.y += 0.01;
    torusMesh.rotation.x += 0.01;
    coneMesh.rotation.z += 0.01;
    renderer.render(scene, camera);
}

animate();