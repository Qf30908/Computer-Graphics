import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';

const LAYERS = {
    INTERACTABLE: 1,
    DECORATIVE: 2,
    DEFAULT: 0
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

camera.layers.enable(LAYERS.INTERACTABLE);
camera.layers.enable(LAYERS.DECORATIVE);
camera.layers.enable(LAYERS.DEFAULT);

const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
raycaster.layers.set(LAYERS.INTERACTABLE);
const mouse = new THREE.Vector2();

const interactableObjects = [];
const decorativeObjects = [];

for (let i = 0; i < 6; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color: 0x0066ff });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.x = (i - 2.5) * 2;
    cube.position.y = 1;
    cube.position.z = -2;
    
    cube.layers.set(LAYERS.INTERACTABLE);
    cube.castShadow = true;
    cube.userData.clickCount = 0;
    
    scene.add(cube);
    interactableObjects.push(cube);
}

for (let i = 0; i < 8; i++) {
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    const sphere = new THREE.Mesh(geometry, material);
    
    sphere.position.x = (Math.random() - 0.5) * 12;
    sphere.position.y = Math.random() * 4 + 0.5;
    sphere.position.z = Math.random() * 8 - 4;
    
    sphere.layers.set(LAYERS.INTERACTABLE);
    sphere.castShadow = true;
    sphere.userData.rotationSpeed = Math.random() * 0.02 + 0.01;  
    sphere.userData.clickCount = 0;

    
    scene.add(sphere);
    interactableObjects.push(sphere);
    // decorativeObjects.push(sphere);
}

for (let i = 0; i < 10; i++) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, Math.random() * 3 + 1, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0x994444 });
    const cylinder = new THREE.Mesh(geometry, material);
    
    cylinder.position.x = (Math.random() - 0.5) * 16;
    cylinder.position.y = cylinder.geometry.parameters.height / 2;
    cylinder.position.z = (Math.random() - 0.5) * 10;
    
    cylinder.layers.set(LAYERS.INTERACTABLE);
    cylinder.castShadow = true;
    cylinder.userData.clickCount = 0;

    
    scene.add(cylinder);
    interactableObjects.push(cylinder);
    // decorativeObjects.push(cylinder);
}

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
floor.layers.set(LAYERS.DEFAULT);
scene.add(floor);

const layerSettings = {
    showInteractable: true,
    showDecorative: true,
    interactableOnly: false,
    decorativeOnly: false
};

const gui = new GUI();
const layerFolder = gui.addFolder('Layer Visibility');

layerFolder.add(layerSettings, 'showInteractable').name('Interactable Objects').onChange((value) => {
    if (value) {
        camera.layers.enable(LAYERS.INTERACTABLE);
    } else {
        camera.layers.disable(LAYERS.INTERACTABLE);
    }
});

layerFolder.add(layerSettings, 'showDecorative').name('Decorative Objects').onChange((value) => {
    if (value) {
        camera.layers.enable(LAYERS.DECORATIVE);
    } else {
        camera.layers.disable(LAYERS.DECORATIVE);
    }
});

layerFolder.add(layerSettings, 'interactableOnly').name('Interactable Only').onChange((value) => {
    if (value) {
        camera.layers.disableAll();
        camera.layers.enable(LAYERS.INTERACTABLE);
        camera.layers.enable(LAYERS.DEFAULT);
        layerSettings.decorativeOnly = false;
        gui.updateDisplay();
    }
});

layerFolder.add(layerSettings, 'decorativeOnly').name('Decorative Only').onChange((value) => {
    if (value) {
        camera.layers.disableAll();
        camera.layers.enable(LAYERS.DECORATIVE);
        camera.layers.enable(LAYERS.DEFAULT);
        layerSettings.interactableOnly = false;
        gui.updateDisplay();
    }
});

const resetButton = { reset: () => {
    camera.layers.enableAll();
    layerSettings.showInteractable = true;
    layerSettings.showDecorative = true;
    layerSettings.interactableOnly = false;
    layerSettings.decorativeOnly = false;
    gui.updateDisplay();
}};

layerFolder.add(resetButton, 'reset').name('Show All Layers');

layerFolder.open();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactableObjects);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        intersected.userData.clickCount++;
        
        const hue = (intersected.userData.clickCount * 60) % 360;
        intersected.material.color.setHSL(hue / 360, 0.8, 0.6);
        
        intersected.scale.setScalar(1.3);
        setTimeout(() => {
            intersected.scale.setScalar(1.0);
        }, 200);
        
        console.log(`Clicked interactable object! Click count: ${intersected.userData.clickCount}`);
    }
}

window.addEventListener('click', onMouseClick);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.set(8, 6, 8);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    
    interactableObjects.forEach(cube => {
        cube.rotation.y += 0.01;
    });
    
    decorativeObjects.forEach(obj => {
        if (obj.geometry.type === 'SphereGeometry') {
            obj.rotation.x += obj.userData.rotationSpeed;
            obj.rotation.y += obj.userData.rotationSpeed * 0.7;
            obj.position.y += Math.sin(Date.now() * 0.002 + obj.position.x) * 0.01;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();