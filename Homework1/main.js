import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Example: black
const camera = new THREE.PerspectiveCamera(     
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.z = 10;

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial(
    {
        color:0xff0000
    }
);

const cubeMesh = new THREE.Mesh(geometry, material);
scene.add(cubeMesh);



const buildingGeometry = new THREE.BoxGeometry(5, 5, 5);
const buildingMaterial = new THREE.MeshStandardMaterial(
    {
        color:0x0000ff
    }
);


const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
scene.add(buildingMesh);
buildingMesh.translateX(-6);
buildingMesh.rotation.y -= 0.1;




const building2Geometry = new THREE.BoxGeometry(5, 5, 5);
const building2Material = new THREE.MeshStandardMaterial(
    {
        color:0x0000ff
    }
);

const building2Mesh = new THREE.Mesh(building2Geometry, building2Material);
scene.add(building2Mesh);
building2Mesh.translateX(6);
building2Mesh.rotation.y += 0.1;


const roadGeometry = new THREE.BoxGeometry(7.5, 0.12, 15);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); 
const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
roadMesh.position.y = -2.5; 
scene.add(roadMesh);



const parkLeftGeometry = new THREE.BoxGeometry(5, 0.1, 15); 
const parkLeftMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); 
const parkLeftMesh = new THREE.Mesh(parkLeftGeometry, parkLeftMaterial);
parkLeftMesh.position.x = -6; 
parkLeftMesh.position.y = -2.5;
parkLeftMesh.position.z = 2;
scene.add(parkLeftMesh);

const parkRightGeometry = new THREE.BoxGeometry(5, 0.1, 15);
const parkRightMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); 
const parkRightMesh = new THREE.Mesh(parkRightGeometry, parkRightMaterial);
parkRightMesh.position.x = 6; 
parkRightMesh.position.y = -2.5;
parkRightMesh.position.z = 2;
scene.add(parkRightMesh);

const rightRoofGeometry = new THREE.BoxGeometry(6.5, 0.3, 6);
const rightRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); 
const rightRoofMesh = new THREE.Mesh(rightRoofGeometry, rightRoofMaterial);
rightRoofMesh.position.x = 5.5; 
rightRoofMesh.position.y = 2.6;
rightRoofMesh.position.z = 0.8;
scene.add(rightRoofMesh);

const leftRoofGeometry = new THREE.BoxGeometry(6.5, 0.3, 6);
const leftRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); 
const leftRoofMesh = new THREE.Mesh(leftRoofGeometry, leftRoofMaterial);
leftRoofMesh.position.x = -5.5; 
leftRoofMesh.position.y = 2.6;
leftRoofMesh.position.z = 0.8;
scene.add(leftRoofMesh);


const crosswalkGeometry = new THREE.BoxGeometry(0.6, 0.15, 5);
const crosswalkMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); 

const crosswalkMesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
crosswalkMesh.position.x = -2.5; 
crosswalkMesh.position.y = -2.5;
crosswalkMesh.position.z = 0.8;
scene.add(crosswalkMesh);

const crosswalk2Mesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
crosswalk2Mesh.position.x = -1.2; 
crosswalk2Mesh.position.y = -2.5;
crosswalk2Mesh.position.z = 0.8;
scene.add(crosswalk2Mesh);

const crosswalk3Mesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
crosswalk3Mesh.position.x = 0.1; 
crosswalk3Mesh.position.y = -2.5;
crosswalk3Mesh.position.z = 0.8;
scene.add(crosswalk3Mesh);

const crosswalk4Mesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
crosswalk4Mesh.position.x = 1.4; 
crosswalk4Mesh.position.y = -2.5;
crosswalk4Mesh.position.z = 0.8;
scene.add(crosswalk4Mesh);

const crosswalk5Mesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
crosswalk5Mesh.position.x = 2.7; 
crosswalk5Mesh.position.y = -2.5;
crosswalk5Mesh.position.z = 0.8;
scene.add(crosswalk5Mesh);


const doorGeometry = new THREE.BoxGeometry(0.1, 5, 2);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); 

const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
doorMesh.position.x = -3.5; 
doorMesh.position.y = -2;
doorMesh.position.z = 0.2;
scene.add(doorMesh);


const door1Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
door1Mesh.position.x = 3.5; 
door1Mesh.position.y = -2;
door1Mesh.position.z = 0.2;
door1Mesh.rotation.x = Math.PI;
scene.add(door1Mesh);

const windowGeometry = new THREE.BoxGeometry(3, 3, 5.8);
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6 });

const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
windowMesh.position.x = -5.8;
scene.add(windowMesh);

const window1Mesh = new THREE.Mesh(windowGeometry, windowMaterial);
window1Mesh.position.x = 5.8;
scene.add(window1Mesh);

const treeGeometry = new THREE.CylinderGeometry(0, 1, 3, 10);
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });

const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
treeMesh.position.set(-4.8, -0.5, 6); 
treeMesh.scale.set(0.8, 0.8, 0.8); 
scene.add(treeMesh);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);



const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 3);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cubeMesh.rotation.x += 0.01;
}

animate();

document.body.appendChild( renderer.domElement );