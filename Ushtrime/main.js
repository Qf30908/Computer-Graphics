import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshToonMaterial({ color: 0x00ff00});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const coneGeometry = new THREE.ConeGeometry(3, 7, 32);
const coneMaterial = new THREE.MeshToonMaterial({ color: 0xff0000});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(10,0,0);
scene.add(cone);

const cylinderGeometry=new THREE.CylinderGeometry(2,2,6,32);
const cylinderMaterial=new THREE.MeshToonMaterial({color:0xffffff});
const cylinder=new THREE.Mesh(cylinderGeometry,cylinderMaterial);
cylinder.position.set(-10,0,0);
scene.add(cylinder);

camera.position.z = 15;

const light=new THREE.AmbientLight(0x00ff00);
scene.add(light);

const dirlight= new THREE.DirectionalLight(0xff0000,1);
dirlight.position.set(0,0,10);
scene.add(dirlight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
//document.getElementById('ketu zevendesohet id e krijuar ne index').appendChild(renderer.domElement); - kjo eshte per nje pjes te caktuar te shfaqet 3d modeli

renderer.render(scene, camera);
