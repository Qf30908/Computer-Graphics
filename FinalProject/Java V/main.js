
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


const scene = new THREE.Scene();
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
//scene.add(cubeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 3);
scene.add(light);


const fbxLoader = new FBXLoader();

const object = await fbxLoader.loadAsync('X Bot.fbx');
object.scale.set(0.01, 0.01, 0.01);

scene.add(object);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    object.rotation.y += 0.01;
}

animate();

document.body.appendChild( renderer.domElement );
