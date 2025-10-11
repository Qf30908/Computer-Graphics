import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(     
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.z = 5;

const geometry = new THREE.SphereGeometry(2, 42, 42);
const material = new THREE.MeshStandardMaterial(
    {
        color:0xff0000
    }
);

const lambertMaterial = new THREE.MeshLambertMaterial( 
    { 
        color: 0x00ff00 
    } 
);

const lambertCubeMesh = new THREE.Mesh(geometry, lambertMaterial);
lambertCubeMesh.position.x = +3;
scene.add(lambertCubeMesh);

const phongMaterial = new THREE.MeshPhongMaterial( 
    { 
        color: 0x0000ff,
        shininess: 100,
        specular: 0x00ff00
    }
);

const phongCubeMesh = new THREE.Mesh(geometry, phongMaterial);
phongCubeMesh.position.x = -3;
scene.add(phongCubeMesh);

const cubeMesh = new THREE.Mesh(geometry, material);
scene.add(cubeMesh);

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
    lambertCubeMesh.rotation.x += 0.01;
    phongCubeMesh.rotation.x += 0.01;
}

animate();

document.body.appendChild( renderer.domElement );