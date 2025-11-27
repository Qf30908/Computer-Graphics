import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls, hero;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 0.1;

// === Day-Night Cycle ===
let time = 0; // 0..1
const daySpeed = 0.001; // controls speed of day-night
const lampLights = []; // store streetlamp lights

// === Scene ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // day sky

// === Camera ===
camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
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

// === Ground ===
const groundTexture = new THREE.TextureLoader().load('/assets/ground_texture.jpg');
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
    if(c.isMesh && c.material.emissive){
        c.material.emissiveIntensity = dayFactor * 0.3; // scaled by day-night factor
    }
    });

    const box = new THREE.Box3().setFromObject(hero);

    // Scale & position
    hero.scale.set(2, 2, 2);
    hero.position.set(6.45, 2, 6);
    hero.rotation.set(
        THREE.MathUtils.degToRad(-0.5),
        THREE.MathUtils.degToRad(-0.5),
        THREE.MathUtils.degToRad(0.8)
    );

    // Adjust Y to ground
    const minY = box.min.y;
    hero.position.y = -minY * hero.scale.y - 0.5;

    scene.add(hero);

    // Optional base under bust
    // Load texture
    const baseTexture = new THREE.TextureLoader().load('/assets/base_texture.jpg'); // vendos path të duhur
    baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
    baseTexture.repeat.set(2, 2); // përsëritje e teksturës në sipërfaqe

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 9),
        new THREE.MeshStandardMaterial({ 
          map: baseTexture,      // tekstura kryesore
          roughness: 0.8,        // sa mat duket sipërfaqja
          metalness: 0.2         // pak metalik për efekt realistik
        })
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

// === Buildings at corners ===
function createBuilding(x, z, width = 2, height = 5, depth = 2, color = 0x8888ff){
    const buildingTexture = new THREE.TextureLoader().load('/assets/buildingtexture.jpg'); // vendos path të duhur
    buildingTexture.wrapS = buildingTexture.wrapT = THREE.RepeatWrapping;
    // buildingTexture.repeat.set(2, 2); // përsëritje e teksturës në sipërfaqe
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ 
        map: buildingTexture,      // tekstura kryesore
        roughness: 0.8,        // sa mat duket sipërfaqja
        metalness: 0.2         // pak metalik për efekt realistik
     });
    const building = new THREE.Mesh(geometry, material);
    building.castShadow = true;
    building.receiveShadow = true;
    building.position.set(x, height/2, z);
    scene.add(building);
}

// Place buildings
createBuilding(14, 14);
createBuilding(-14, 14);
createBuilding(-14, -14);
createBuilding(14, -14);

// === Street Lamp ===
function createStreetLamp(x, z){
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

    const light = new THREE.PointLight(0xffee88, 1.2, 10);
    light.position.set(0, 1.5, 0);
    light.castShadow = true;
    lampHead.add(light);

    scene.add(pole);
    lampLights.push(light);
}

// === FPS Controls ===
controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', ()=> controls.lock());
controls.enabled = true;

// === Keyboard movement ===
document.addEventListener('keydown', e => {
    if(e.code==='KeyW') moveForward=true;
    if(e.code==='KeyS') moveBackward=true;
    if(e.code==='KeyD') moveLeft=true;
    if(e.code==='KeyA') moveRight=true;
});
document.addEventListener('keyup', e => {
    if(e.code==='KeyW') moveForward=false;
    if(e.code==='KeyS') moveBackward=false;
    if(e.code==='KeyD') moveLeft=false;
    if(e.code==='KeyA') moveRight=false;
});

// === Info Panel ===
const infoPanel = document.getElementById('infoPanel');
if(infoPanel) infoPanel.style.display = 'none';
renderer.domElement.addEventListener('click', ()=>{
    if(!hero || !infoPanel) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0,0);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(hero,true);
    if(intersects.length>0) infoPanel.style.display = infoPanel.style.display==='none'?'block':'none';
});


function createWallSegment(x1, z1, x2, z2) {
    const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    const wallHeight = 1.8;

    const wallTexture = new THREE.TextureLoader().load('/assets/buildingtexture.jpg');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(length / 2, wallHeight / 1);

    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture,
        roughness: 0.9,
        metalness: 0.1
    });

    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(length, wallHeight, 1),
        wallMaterial
    );

    wall.position.set((x1 + x2) / 2, wallHeight / 2, (z1 + z2) / 2);
    wall.rotation.y = Math.atan2(z2 - z1, x2 - x1);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
}


createWallSegment(-15, 15, 15, 15);  // Front
createWallSegment(-15, -15, 15, -15); // Back
createWallSegment(-15, -15, -15, 15); // Left
createWallSegment(15, -15, 15, 15);  


function createBench(x, z, rotationY = 0) {
    // Seat
    const seatGeo = new THREE.BoxGeometry(2, 0.2, 0.6);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(x, 0.6, z);

    // Backrest
    const backGeo = new THREE.BoxGeometry(2, 0.8, 0.1);
    const backMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const back = new THREE.Mesh(backGeo, backMat);
    back.position.set(x, 1, z - 0.25);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const leg1 = new THREE.Mesh(legGeo, legMat);
    const leg2 = leg1.clone();
    leg1.position.set(x - 0.9, 0.3, z + 0.25);
    leg2.position.set(x + 0.9, 0.3, z + 0.25);

    // Group bench parts
    const bench = new THREE.Group();
    bench.add(seat, back, leg1, leg2);
    bench.rotation.y = rotationY;
    scene.add(bench);
}


createBench(0, -14, 0); 
createBench(-7, -14, 0);
createBench(7, -14, 0);       // back wall

createBench(0, -14, Math.PI/2); // left wall
createBench(7, -14, Math.PI/2); // left wall
createBench(-7, -14, Math.PI/2); // left wall

createBench(0, -14, -Math.PI/2); // right wall
createBench(7, -14, -Math.PI/2); // right wall
createBench(-7, -14, -Math.PI/2); // right wall

// === Park Bridge Geometry & Material ===
const parkBridgeGeometry = new THREE.BoxGeometry(12, 0.1, 2);
const parkBridgeTexture = new THREE.TextureLoader().load('/assets/park_texture.jpg');
parkBridgeTexture.wrapS = parkBridgeTexture.wrapT = THREE.RepeatWrapping;
parkBridgeTexture.repeat.set(2, 1);
const parkBridgeMaterial = new THREE.MeshStandardMaterial({ map: parkBridgeTexture });

// Behind Bust
const parkBridgeBack = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeBack.position.set(0 , 0.1 , -5);
scene.add(parkBridgeBack);
// === Front Entrance Bridge Split ===
const bridgeLength = 5; // shorter segments
const bridgeWidth = 2;

// Left segment
const frontBridgeLeft = new THREE.Mesh(
    new THREE.BoxGeometry(bridgeLength, 0.1, bridgeWidth),
    parkBridgeMaterial
);
frontBridgeLeft.position.set(-3.5, 0.1, 5); // shift left
scene.add(frontBridgeLeft);

// Right segment
const frontBridgeRight = new THREE.Mesh(
    new THREE.BoxGeometry(bridgeLength, 0.1, bridgeWidth),
    parkBridgeMaterial
);
frontBridgeRight.position.set(3.5, 0.1, 5); // shift right
scene.add(frontBridgeRight);


// Left of Bust
const parkBridgeLeft = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeLeft.rotation.y = Math.PI / 2; // rotate 90° to align along X-axis
parkBridgeLeft.position.set(-5, 0.1, 0);
scene.add(parkBridgeLeft);

// Right of Bust
const parkBridgeRight = new THREE.Mesh(parkBridgeGeometry, parkBridgeMaterial);
parkBridgeRight.rotation.y = Math.PI / 2; // rotate 90° to align along X-axis
parkBridgeRight.position.set(5, 0.1, 0);
scene.add(parkBridgeRight);




// === Animate Loop ===
function animate(){
    requestAnimationFrame(animate);

    // ---- Day-Night Cycle ----
    time += daySpeed;
    if(time > 1) time = 0;

    const dayFactor = Math.sin(time * Math.PI * 2) * 0.5 + 0.5;

    // Background color transition
    scene.background = new THREE.Color().lerpColors(
        new THREE.Color(0x87ceeb), // day
        new THREE.Color(0x0a0a2a), // night
        1 - dayFactor
    );

    // ---- Day-Night Cycle ----
const sunThreshold = 0.3; // below this, it's night

// Adjust sun light
sun.intensity = 0.2 + 0.8 * dayFactor;   // overall intensity
sun.visible = dayFactor > sunThreshold;  // hide sun at night
sun.castShadow = dayFactor > sunThreshold; // disable sun shadows at night

// Lamps active at night
lampLights.forEach(l => {
    if(dayFactor > 0.7){ // day
        l.intensity = 0;
        l.visible = false; // hide lamp light at day
    } else if(dayFactor < 0.3){ // night
        l.intensity = 1.2;
        l.visible = true;  // show lamp light at night
        l.castShadow = true; // ensure lamps cast shadows
    }
});


    // ---- Movement ----
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; direction.normalize();
    right.crossVectors(camera.up, direction).normalize();

    if(moveForward) camera.position.addScaledVector(direction, speed);
    if(moveBackward) camera.position.addScaledVector(direction, -speed);
    if(moveLeft) camera.position.addScaledVector(right, -speed);
    if(moveRight) camera.position.addScaledVector(right, speed);

    if(camera.position.y < 1.7) camera.position.y = 1.7;

    renderer.render(scene, camera);
}
animate();

// === Window Resize ===
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
