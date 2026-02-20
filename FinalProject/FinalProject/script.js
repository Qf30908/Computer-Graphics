import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import TWEEN from '@tweenjs/tween.js';

// === Global variables ===
let scene, camera, renderer, controls, hero;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 0.1;

// === Raycasting ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// === Door system ===
let door, doorPivot;
let doorOpen = false;
let doorTriggerArea;

// Day-Night
let time = 0;
const daySpeed = 0.001;
const lampLights = [];
const lampHeads = [];
let lampsEnabled = true;
let sunEnabled = true;
let autoTime = true;

// Toggleables
let fogEnabled = true;
let birdsEnabled = true;
let waterEnabled = true;
let audioEnabled = true;

// Birds array for GLTF models
const birds = [];
const birdSpeed = 0.02;

// Texture loader instance
const textureLoader = new THREE.TextureLoader();

// === Scene ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

// === Camera ===
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 5);

// === Renderer ===
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === Lighting ===
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 50;
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20;
sun.shadow.camera.bottom = -20;
scene.add(sun);

// Rim light for bust
const rimLight = new THREE.SpotLight(0xffffff, 0.5);
rimLight.position.set(6, 5, 6);
rimLight.angle = Math.PI / 6;
rimLight.penumbra = 0.5;
rimLight.castShadow = true;
scene.add(rimLight);

// === Ground ===
const groundTexture = textureLoader.load('/assets/ground_texture.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(5, 5);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ map: groundTexture })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === Load Bust ===
const loader = new GLTFLoader();
loader.load('/assets/bust_of_scanderbeg_parco_del_dono_parma.glb', (gltf) => {
    hero = gltf.scene;
    hero.traverse(c => {
        if (c.isMesh) {
            c.userData.isBust = true;   // 🔑 THIS enables click detection
            if (c.material.emissive) c.material.emissiveIntensity = 0.3;
        }
    });
    const box = new THREE.Box3().setFromObject(hero);
    hero.scale.set(2, 2, 2);
    hero.position.set(6.45, 2, 6);
    hero.rotation.set(
        THREE.MathUtils.degToRad(-0.5),
        THREE.MathUtils.degToRad(-0.5),
        THREE.MathUtils.degToRad(0.8)
    );
    const minY = box.min.y;
    hero.position.y = -minY * hero.scale.y - 0.5;
    scene.add(hero);

    // Base under bust
    const baseTexture = textureLoader.load('/assets/base_texture.jpg');
    baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
    baseTexture.repeat.set(2, 2);

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 9),
        new THREE.MeshStandardMaterial({ map: baseTexture, roughness: 0.8, metalness: 0.2 })
    );
    base.position.set(0, 0, -0.5);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    // Street lamps
    createStreetLamp(3, 3);
    createStreetLamp(-3, 3);
    createStreetLamp(3, -3);
    createStreetLamp(-3, -3);
});

// === Buildings ===
function createBuilding(x, z, width = 2, height = 5, depth = 2) {
    const buildingTexture = textureLoader.load('/assets/buildingtexture.jpg');
    buildingTexture.wrapS = buildingTexture.wrapT = THREE.RepeatWrapping;
    const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ map: buildingTexture, roughness: 0.8, metalness: 0.2 })
    );
    building.castShadow = true;
    building.receiveShadow = true;
    building.position.set(x, height / 2, z);
    scene.add(building);
}
createBuilding(14, 14);
createBuilding(-14, 14);
createBuilding(-14, -14);
createBuilding(14, -14);

// === Load Iron Eagle on 10m pole ===
loader.load('/assets/albanian_eagle_flag/albanianeagle.gltf', (gltf) => {
    const eagle = gltf.scene;
    
    // Create a group for pole and eagle
    const eagleGroup = new THREE.Group();
    
    // Create the 10-meter pole
    const poleGeometry = new THREE.CylinderGeometry(0.15, 0.25, 10, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888, 
        metalness: 0.8, 
        roughness: 0.3 
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 5; // Center of pole (half of 10)
    pole.castShadow = true;
    pole.receiveShadow = true;
    eagleGroup.add(pole);
    
    // Add the eagle on top
    eagle.scale.set(0.4, 0.4, 0.1);
    eagle.position.y = 10; // Place exactly on top of the 10m pole
    eagle.position.x = 0;
    eagle.position.z = 0;
    eagle.rotation.y = Math.PI; // Face forward
    eagle.castShadow = true;
    eagle.receiveShadow = true;
    eagleGroup.add(eagle);
    
    // Position the whole thing where you want it (adjust these coordinates)
    eagleGroup.position.set(10, 0, -12);
    eagleGroup.rotation.y = Math.PI/1.2; 
    
    scene.add(eagleGroup);
    console.log('✅ Eagle on 10m pole added at', eagleGroup.position);
}, undefined, (error) => {
    console.error('Failed to load eagle:', error);
});

// === Load Chicago Building ===
const buildingLoader = new GLTFLoader();

// Load texture once
const buildingTexture = textureLoader.load('/assets/chicago_buildings/textures/Material.001_diffuse.png');
buildingTexture.flipY = false;
buildingTexture.colorSpace = THREE.SRGBColorSpace;

function placeBuilding(x, z, rotation) {
    buildingLoader.load('/assets/chicago_buildings/scene.gltf', (gltf) => {
        const building = gltf.scene;
        
        building.traverse((node) => {
            if (node.isMesh) {
                node.material = new THREE.MeshStandardMaterial({ 
                    map: buildingTexture,
                    roughness: 0.6,
                    metalness: 0.05
                });
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        building.scale.set(0.2, 0.2, 0.2);
        building.position.set(x, 1, z);
        building.rotation.y = rotation; 
        scene.add(building);
    });
}

// Place building on the RIGHT side at (19, 0, 0) facing left
placeBuilding(19, 0, -Math.PI/2);
placeBuilding(-19, 0, Math.PI/2);
placeBuilding(0, -19, 0); 


// === Add Asphalt Roads around the square ===
const asphaltTexture = textureLoader.load('/assets/asphalt_texture.jpg');
asphaltTexture.wrapS = THREE.RepeatWrapping;
asphaltTexture.wrapT = THREE.RepeatWrapping;
asphaltTexture.repeat.set(4, 4);

const asphaltMaterial = new THREE.MeshStandardMaterial({ 
    map: asphaltTexture,
    roughness: 0.8,
    metalness: 0.1
});

const roadWidth = 4;
const squareSize = 30;
const roadY = 0.01;

// Create roads around square
const positions = [
    [15 + roadWidth/2, 0, roadWidth, squareSize + roadWidth*2], // East
    [-15 - roadWidth/2, 0, roadWidth, squareSize + roadWidth*2], // West
    [0, 15 + roadWidth/2, squareSize + roadWidth*2, roadWidth], // North
    [0, -15 - roadWidth/2, squareSize + roadWidth*2, roadWidth] // South
];

positions.forEach(([x, z, w, h]) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(w, h), asphaltMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, roadY, z);
    scene.add(road);
});

// Corners
const corners = [
    [15 + roadWidth/2, 15 + roadWidth/2],
    [15 + roadWidth/2, -15 - roadWidth/2],
    [-15 - roadWidth/2, 15 + roadWidth/2],
    [-15 - roadWidth/2, -15 - roadWidth/2]
];

corners.forEach(([x, z]) => {
    const corner = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, roadWidth), asphaltMaterial);
    corner.rotation.x = -Math.PI / 2;
    corner.position.set(x, roadY, z);
    scene.add(corner);
});

console.log('✅ Square surrounded by asphalt roads');



function createDoor() {
    const doorX = 0;
    const doorZ = 15;
    const doorWidth = 3;
    const doorHeight = 3.5;
    const doorThickness = 0.2;
    
    console.log('=== CREATING DOOR - SUPER SIMPLE ===');
    
    // 1. Create door WITHOUT ANY PIVOT - JUST A SIMPLE MESH
    const doorTexture = textureLoader.load('/assets/door_texture.jpg');
    doorTexture.wrapS = THREE.RepeatWrapping;
    doorTexture.wrapT = THREE.RepeatWrapping;
    doorTexture.repeat.set(1, 1);
    
    const doorMaterial = new THREE.MeshStandardMaterial({ 
        map: doorTexture,
        roughness: 0.7,
        metalness: 0.1
    });
    
    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
    
    // Create the door
    door = new THREE.Mesh(doorGeometry, doorMaterial);
    
    // Position it
    door.position.set(doorX, doorHeight/2, doorZ);
    door.rotation.y = 0; // Start closed
    
    door.castShadow = true;
    door.receiveShadow = true;
    door.userData.isDoor = true;
    
    // Add door knob
    const doorKnobGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const doorKnobMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const doorKnob = new THREE.Mesh(doorKnobGeometry, doorKnobMaterial);
    doorKnob.position.set(doorWidth/2 - 0.1, 0, doorThickness/2 + 0.05);
    door.add(doorKnob);
    
    // Add to scene
    scene.add(door);
    
    console.log('Simple door created at:', door.position);
    
    // Don't create trigger area for now - let's just get rotation working
    doorTriggerArea = null;
    
    return door;
}
// Create the door
createDoor();

// === Street Lamp ===
function createStreetLamp(x, z) {
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3, 16),
        new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.3 })
    );
    pole.position.set(x, 1.5, z);
    pole.castShadow = true;

    const lampHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ emissive: 0xffffaa, emissiveIntensity: 0.6, color: 0xffffff })
    );
    lampHead.position.y = 1.5;
    pole.add(lampHead);
    lampHeads.push(lampHead);

    const light = new THREE.PointLight(0xffee88, 0, 10);
    light.position.set(0, 1.5, 0);
    light.castShadow = true;
    lampHead.add(light);

    scene.add(pole);
    lampLights.push(light);
}

// === FPS Controls ===
controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => {
    if (document.pointerLockElement !== document.body) {
        controls.lock();
    }
});
controls.enabled = true;

// === Keyboard ===
document.addEventListener('keydown', e => {
    if (e.code === 'KeyW') moveForward = true;
    if (e.code === 'KeyS') moveBackward = true;
    if (e.code === 'KeyD') moveLeft = true;
    if (e.code === 'KeyA') moveRight = true;
    if (e.code === 'KeyL') {
        lampsEnabled = !lampsEnabled;
        console.log('Lamps enabled:', lampsEnabled);
    }
    if (e.code === 'KeyP') {
        sunEnabled = !sunEnabled;
        console.log('Sun enabled:', sunEnabled);
    }
});
document.addEventListener('keyup', e => {
    if (e.code === 'KeyW') moveForward = false;
    if (e.code === 'KeyS') moveBackward = false;
    if (e.code === 'KeyD') moveLeft = false;
    if (e.code === 'KeyA') moveRight = false;
});

// === Info Panel ===
const infoPanel = document.getElementById('infoPanel');
infoPanel.style.position = 'absolute';
infoPanel.style.bottom = '10px';
infoPanel.style.left = '10px';
infoPanel.style.background = 'rgba(0,0,0,0.6)';
infoPanel.style.color = 'white';
infoPanel.style.padding = '8px';
infoPanel.style.fontFamily = 'Arial';
infoPanel.style.display = 'none';

// === Wall & Bench ===
function createWallSegment(x1, z1, x2, z2) {
    const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    const wallHeight = 1.8;
    const wallTexture = textureLoader.load('/assets/buildingtexture.jpg');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(length / 2, wallHeight / 1);
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(length, wallHeight, 1),
        new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.9, metalness: 0.1 })
    );
    wall.position.set((x1 + x2) / 2, wallHeight / 2, (z1 + z2) / 2);
    wall.rotation.y = Math.atan2(z2 - z1, x2 - x1);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
}

// Create walls with gap for door (door is 2.5 units wide, so gap from -1.25 to 1.25)
createWallSegment(-15, 15, -1.5, 15);
createWallSegment(1.5, 15, 15, 15);
createWallSegment(-15, -15, 15, -15);
createWallSegment(-15, -15, -15, 15);
createWallSegment(15, -15, 15, 15);

function createBench(x, z, rotationY = 0) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.6), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    seat.position.set(x, 0.6, z);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
    back.position.set(x, 1, z - 0.25);
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
    const leg2 = leg1.clone();
    leg1.position.set(x - 0.9, 0.3, z + 0.25);
    leg2.position.set(x + 0.9, 0.3, z + 0.25);
    const bench = new THREE.Group();
    bench.add(seat, back, leg1, leg2);
    bench.rotation.y = rotationY;
    scene.add(bench);
}
createBench(0, -14, 0);
createBench(-7, -14, 0);
createBench(7, -14, 0);
createBench(0, -14, Math.PI / 2);
createBench(7, -14, Math.PI / 2);
createBench(-7, -14, Math.PI / 2);
createBench(0, -14, -Math.PI / 2);
createBench(7, -14, -Math.PI / 2);
createBench(-7, -14, -Math.PI / 2);

// === Park Bridges ===
const parkBridgeGeometry = new THREE.BoxGeometry(12, 0.1, 2);
const parkBridgeTexture = textureLoader.load('/assets/park_texture.jpg');
parkBridgeTexture.wrapS = parkBridgeTexture.wrapT = THREE.RepeatWrapping;
parkBridgeTexture.repeat.set(2, 1);
const parkBridgeMaterial = new THREE.MeshStandardMaterial({ map: parkBridgeTexture });
const parkBridgeBack = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeBack.position.set(0, 0.1, -5);
scene.add(parkBridgeBack);
const frontBridgeLeft = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 2), parkBridgeMaterial);
frontBridgeLeft.position.set(-3.5, 0.1, 5);
scene.add(frontBridgeLeft);
const frontBridgeRight = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 2), parkBridgeMaterial);
frontBridgeRight.position.set(3.5, 0.1, 5);
scene.add(frontBridgeRight);
const parkBridgeLeft = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeLeft.rotation.y = Math.PI / 2;
parkBridgeLeft.position.set(-5, 0.1, 0);
scene.add(parkBridgeLeft);
const parkBridgeRight = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeRight.rotation.y = Math.PI / 2;
parkBridgeRight.position.set(5, 0.1, 0);
scene.add(parkBridgeRight);

// === Water under bridge ===

const waterTexture = textureLoader.load('/assets/water_texture.jpg');
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(4, 4);
const water = new THREE.Mesh(new THREE.PlaneGeometry(38, 5), new THREE.MeshStandardMaterial({ map: waterTexture, transparent: true, opacity: 0.7 }));
water.rotation.x = -Math.PI / 2;
water.position.set(0, 0.05, 21.5);
scene.add(water);

const water2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshStandardMaterial({ map: waterTexture, transparent: true, opacity: 0.7 }));
water2.rotation.y=-Math.PI/2.5;
water2.rotation.x=-Math.PI/2;
water2.rotation.z;
water2.position.set(20.5, 4.8, 21.5);
scene.add(water2);


// wall
const waterwallGeometry=new THREE.BoxGeometry(38, 2, 1)
const waterwallTexture = textureLoader.load('/assets/buildingtexture.jpg');
waterwallTexture.wrapS = waterwallTexture.wrapT = THREE.RepeatWrapping;
waterwallTexture.repeat.set(9, 1);
const waterwallMaterial= new THREE.MeshStandardMaterial({ map: waterwallTexture });
const waterwall=new THREE.Mesh(waterwallGeometry, waterwallMaterial);
waterwall.position.set(0, 1, 24.5);
scene.add(waterwall)



// === Load Bird GLTF Models ===
function loadBirds() {
    const birdLoader = new GLTFLoader();
    
    // Load multiple birds with random positions
    for (let i = 0; i < 5; i++) {
        birdLoader.load('/assets/bird.gltf', (gltf) => {
            const bird = gltf.scene;
            
            // Scale the bird appropriately
            bird.scale.set(0.5, 0.5, 0.5);
            
            // Random starting position within the park area
            bird.position.set(
                Math.random() * 20 - 10,  // x: -10 to 10
                Math.random() * 4 + 8,     // y: 2 to 5
                Math.random() * 20 - 10    // z: -10 to 10
            );
            
            // Random initial rotation
            bird.rotation.y = Math.random() * Math.PI * 2;
            
            // Store individual bird data for animation
            bird.userData = {
                speed: 0.02 + Math.random() * 0.02,
                direction: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    0,
                    (Math.random() - 0.5) * 2
                ).normalize(),
                wingAngle: 0,
                flightPathOffset: Math.random() * Math.PI * 2,
                originalY: bird.position.y
            };
            
            // Enable shadows for all meshes in the bird
            bird.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            scene.add(bird);
            birds.push(bird);
            
            console.log(`Bird ${i + 1} loaded successfully`);
        }, undefined, (error) => {
            console.error('Error loading bird GLTF:', error);
        });
    }
}

// Load the birds
loadBirds();

// === Controls Panel ===
const controlPanel = document.createElement('div');
controlPanel.style.position = 'absolute';
controlPanel.style.top = '10px';
controlPanel.style.right = '10px';
controlPanel.style.backgroundColor = 'rgba(0,0,0,0.6)';
controlPanel.style.color = '#fff';
controlPanel.style.padding = '10px';
controlPanel.style.fontFamily = 'Arial';
controlPanel.style.borderRadius = '5px';
controlPanel.style.zIndex = '1000';
controlPanel.innerHTML = `
<b>Controls:</b><br>
W/A/S/D: Move<br>
L: Toggle Lamps<br>
P: Toggle Sun<br>
Time: <input type="range" id="timeSlider" min="0" max="1" step="0.001" value="0"><br>
<br>
<b>Extras:</b><br>
<input type="checkbox" id="fogToggle" checked> Fog<br>
<input type="checkbox" id="birdsToggle" checked> Birds<br>
<input type="checkbox" id="waterToggle" checked> Water<br>
<input type="checkbox" id="audioToggle" checked> Ambient Audio<br>
`;
document.body.appendChild(controlPanel);

// Extra toggles
document.getElementById('fogToggle').addEventListener('change', e => fogEnabled = e.target.checked);
document.getElementById('birdsToggle').addEventListener('change', e => {
    birdsEnabled = e.target.checked;
    if (!birdsEnabled) {
        birds.forEach(bird => {
            bird.visible = false;
        });
    } else {
        birds.forEach(bird => {
            bird.visible = true;
        });
    }
});
document.getElementById('waterToggle').addEventListener('change', e => waterEnabled = e.target.checked);

// Audio toggle
const audioToggle = document.getElementById('audioToggle');
audioToggle.addEventListener('change', e => {
    audioEnabled = e.target.checked;
    if (sound) {
        if (audioEnabled) {
            sound.play();
        } else {
            sound.pause();
        }
    }
});

// Time slider
const timeSlider = document.getElementById('timeSlider');
timeSlider.addEventListener('input', e => {
    if (!autoTime) time = parseFloat(e.target.value);
});

// Time mode
const timeModeButton = document.createElement('button');
timeModeButton.style.position = 'absolute';
timeModeButton.style.top = '240px';
timeModeButton.style.right = '10px';
timeModeButton.style.padding = '5px';
timeModeButton.style.zIndex = '1000';
timeModeButton.innerText = 'Time Mode: Auto';
document.body.appendChild(timeModeButton);
timeModeButton.addEventListener('click', () => {
    autoTime = !autoTime;
    timeModeButton.innerText = autoTime ? 'Time Mode: Auto' : 'Time Mode: Manual';
});

// === Audio ===
let sound;
const listener = new THREE.AudioListener();
camera.add(listener);
sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/assets/park_ambient.mp3', buffer => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.2);
    if (audioEnabled) {
        sound.play();
    }
}, undefined, (error) => {
    console.error('Error loading audio:', error);
});

// === Animate ===
let bob = 0;
function animate() {
    requestAnimationFrame(animate);

    // Day-Night
    if (autoTime) { 
        time += daySpeed; 
        if (time > 1) time = 0; 
        timeSlider.value = time; 
    }
    const dayFactor = Math.sin(time * Math.PI * 2) * 0.5 + 0.5;
    const isDay = dayFactor > 0.5;
    const isNight = dayFactor <= 0.5;

    // Background & fog
    scene.background.lerpColors(new THREE.Color(0x87ceeb), new THREE.Color(0x0a0a2a), 1 - dayFactor);
    scene.fog.color.lerpColors(new THREE.Color(0x87ceeb), new THREE.Color(0x0a0a2a), 1 - dayFactor);
    scene.fog.near = fogEnabled ? 10 : 1000;
    scene.fog.far = fogEnabled ? 50 : 1000;

    // Sun - only visible during day and when enabled
    if (sunEnabled) {
        sun.intensity = Math.max(0, 0.2 + 0.8 * dayFactor - 0.5);
        sun.visible = isDay;
        sun.castShadow = isDay;
        sun.color.lerpColors(new THREE.Color(0xffdcbf), new THREE.Color(0xffffff), dayFactor);
    } else {
        sun.intensity = 0;
        sun.visible = false;
    }

    // Lamps - only visible at night and when enabled
    lampLights.forEach((l, index) => {
        if (lampsEnabled) {
            // Lamps are only on at night
            if (isNight) {
                l.intensity = 1.2;
                l.visible = true;
                if (lampHeads[index]) {
                    lampHeads[index].material.emissiveIntensity = 0.6;
                }
            } else {
                l.intensity = 0;
                l.visible = false;
                if (lampHeads[index]) {
                    lampHeads[index].material.emissiveIntensity = 0.1;
                }
            }
        } else {
            // Lamps disabled
            l.intensity = 0;
            l.visible = false;
            if (lampHeads[index]) {
                lampHeads[index].material.emissiveIntensity = 0;
            }
        }
    });

    // Birds animation with GLTF models
    if (birdsEnabled) {
        birds.forEach(bird => {
            if (bird && bird.position) {
                const data = bird.userData;
                
                // Move bird in its direction
                bird.position.x += data.direction.x * data.speed;
                bird.position.z += data.direction.z * data.speed;
                
                // Add slight up and down motion (floating)
                bird.position.y = data.originalY + Math.sin(time * 5 + data.flightPathOffset) * 0.3;
                
                // Rotate bird to face direction of movement
                if (data.direction.length() > 0) {
                    const angle = Math.atan2(data.direction.x, data.direction.z);
                    bird.rotation.y = angle;
                }
                
                // Add wing flapping animation if the bird has bones or we want to rotate parts
                // For simple animation, we'll just bob the bird slightly
                bird.rotation.x = Math.sin(time * 10 + data.flightPathOffset) * 0.1;
                bird.rotation.z = Math.cos(time * 8 + data.flightPathOffset) * 0.05;
                
                // Boundary checking - reverse direction if hitting boundaries
                if (bird.position.x > 15 || bird.position.x < -15) {
                    data.direction.x *= -1;
                    data.originalY = bird.position.y; // Update reference height
                }
                if (bird.position.z > 15 || bird.position.z < -15) {
                    data.direction.z *= -1;
                    data.originalY = bird.position.y; // Update reference height
                }
                
                // Occasionally change direction randomly
                if (Math.random() < 0.005) {
                    data.direction.set(
                        (Math.random() - 0.5) * 2,
                        0,
                        (Math.random() - 0.5) * 2
                    ).normalize();
                }
            }
        });
    }

    // Water
    if (water && water.material) {
        water.material.visible = waterEnabled;
        water2.material.visible=waterEnabled;
        if (waterEnabled && water.material.map) {
            water.material.map.offset.x += 0.005;
        }
    }

    // Camera movement
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; 
    direction.normalize();
    right.crossVectors(camera.up, direction).normalize();

    if (moveForward) camera.position.addScaledVector(direction, speed);
    if (moveBackward) camera.position.addScaledVector(direction, -speed);
    if (moveLeft) camera.position.addScaledVector(right, -speed);
    if (moveRight) camera.position.addScaledVector(right, speed);

    // Camera bob
    if (moveForward || moveBackward || moveLeft || moveRight) {
        bob += 0.1;
        camera.position.y = 1.7 + Math.sin(bob) * 0.02;
    } else {
        camera.position.y = 1.7;
    }

    
    renderer.render(scene, camera);
}

// Start animation
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
    // Check if we're trying to lock controls first
    if (document.pointerLockElement !== document.body) {
        return;
    }
    
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
        // Check if we clicked the door or door knob
        if (hit.object.userData && hit.object.userData.isDoor) {
            console.log('Clicked door directly');
            toggleDoor();
            return;
        }
        
        // Check if we clicked the door knob (which is a child of the door)
        if (hit.object.parent && hit.object.parent.userData && hit.object.parent.userData.isDoor) {
            console.log('Clicked door knob');
            toggleDoor();
            return;
        }

        if (hit.object.userData && hit.object.userData.isBust) {
            toggleBustInfo();
            return;
        }
    }

    // Clicked elsewhere → hide panel
    infoPanel.style.display = 'none';
});

function toggleBustInfo() {
    infoPanel.style.display = infoPanel.style.display === 'block' ? 'none' : 'block';
}

function toggleDoor() {
    
    doorOpen = !doorOpen;
    
    if (doorOpen) {
        
        door.rotation.y = Math.PI / 2;
        door.position.x=-1.2;
        
        
     
            
           
        
    } else {
        console.log('CLOSING DOOR - Setting rotation to 0');
        door.rotation.y = 0;
        door.position.x+=1.2
        console.log('Door rotation set to:', door.rotation.y);
    }
}