import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { contain } from 'three/src/extras/TextureUtils.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
)
camera.position.set(0, 0, 3);

// const camera = new THREE.OrthographicCamera(
//     window.innerWidth / -200,
//     window.innerWidth / 200,
//     window.innerHeight / 200,
//     window.innerHeight / -200,
//     0.1,
//     1000
// );
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const boxGeometry = new THREE.SphereGeometry(1, 32, 32);
const boxMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00
    });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(-2, 0, -2);

scene.add(boxMesh);

const box1Material = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff
    });
const box1Mesh = new THREE.Mesh(boxGeometry, box1Material);
box1Mesh.position.set(2, 0, 0);
scene.add(box1Mesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const pointLight = new THREE.PointLight(0xff0000, 5, 100);
pointLight.position.set(-1, -1, 1);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight);
scene.add(pointLightHelper);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(0, 5, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.2;
spotLight.decay = 2;
spotLight.distance = 200;
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLight);
scene.add(spotLightHelper);

const container = document.getElementById('scene1');
const renderer = new THREE.WebGLRenderer();
container.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();