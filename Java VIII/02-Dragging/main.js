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
scene.add(directionalLight);

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let selectedObject = null;
let offset = new THREE.Vector3();
let intersection = new THREE.Vector3();

const draggableObjects = [];
const allObjects = [];

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, 0, 0);
cube.castShadow = true;
cube.userData.draggable = true;
scene.add(cube);
draggableObjects.push(cube);
allObjects.push(cube);

const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 0, 0);
sphere.castShadow = true;
sphere.userData.draggable = true;
scene.add(sphere);
draggableObjects.push(sphere);
allObjects.push(sphere);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(-1, 0, 3);
cylinder.castShadow = true;
cylinder.userData.draggable = false;
scene.add(cylinder);
allObjects.push(cylinder);

const coneGeometry = new THREE.ConeGeometry(0.7, 1.5, 32);
const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(1, 0, -3);
cone.castShadow = true;
cone.userData.draggable = false;
scene.add(cone);
allObjects.push(cone);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;
scene.add(floor);

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allObjects);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        
        if (intersected.userData.draggable) {
            controls.enabled = false;
            selectedObject = intersected;
            
            raycaster.ray.intersectPlane(plane, intersection);
            offset.copy(intersection).sub(selectedObject.position);
            
            isDragging = true;
            selectedObject.material.emissive.setHex(0x333333);
        }
    }
}

function onMouseMove(event) {
    if (isDragging && selectedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersection);
        
        const newPosition = intersection.sub(offset);
        
        newPosition.x = Math.max(-8, Math.min(8, newPosition.x));
        newPosition.z = Math.max(-8, Math.min(8, newPosition.z));
        
        selectedObject.position.copy(newPosition);
    }
}

function onMouseUp() {
    if (isDragging) {
        controls.enabled = true;
        isDragging = false;
        
        if (selectedObject) {
            selectedObject.material.emissive.setHex(0x000000);
            selectedObject = null;
        }
    }
}

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

animate();