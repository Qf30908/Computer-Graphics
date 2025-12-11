import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { InteractionManager } from './InteractionManager.js';

const sceneMgr = new SceneManager();
const inputMgr = new InputManager(sceneMgr.getDomElement());
const interactionMgr = new InteractionManager(sceneMgr, inputMgr);

function createTestObjects() {
    const objects = [
        { geometry: new THREE.BoxGeometry(), color: 0x00ff00, position: [-3, 0.5, 0], name: 'Green Cube' },
        { geometry: new THREE.SphereGeometry(0.7), color: 0x0066ff, position: [0, 0.7, 0], name: 'Blue Sphere' },
        { geometry: new THREE.CylinderGeometry(0.5, 0.5, 1.5), color: 0xff6600, position: [3, 0.75, 0], name: 'Orange Cylinder' },
        { geometry: new THREE.ConeGeometry(0.6, 1.2), color: 0xff00ff, position: [-1.5, 0.6, -3], name: 'Magenta Cone' },
        { geometry: new THREE.OctahedronGeometry(0.8), color: 0x00ffff, position: [1.5, 0.8, -3], name: 'Cyan Octahedron' }
    ];

    objects.forEach(objData => {
        const material = new THREE.MeshLambertMaterial({ color: objData.color });
        const mesh = new THREE.Mesh(objData.geometry, material);
        
        mesh.position.set(...objData.position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.name = objData.name;
        mesh.userData.originalColor = objData.color;
        
        sceneMgr.addObject(mesh, true);
    });
}

function createEnvironment() {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    sceneMgr.addObject(floor, false);

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    gridHelper.position.y = 0.01;
    sceneMgr.addObject(gridHelper, false);
}

function setupKeyboardControls() {
    window.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'Digit1':
            case 'KeyS':
                interactionMgr.setInteractionMode('select');
                break;
            case 'Digit2':
            case 'KeyM':
                interactionMgr.setInteractionMode('move');
                break;
            case 'Digit3':
            case 'KeyD':
                interactionMgr.setInteractionMode('delete');
                break;
            case 'Escape':
                interactionMgr.clearSelection();
                break;
        }
    });

    console.log('Keyboard controls:');
    console.log('1 or S - Select mode');
    console.log('2 or M - Move mode');
    console.log('3 or D - Delete mode');
    console.log('Escape - Clear selection');
}

function addModeDisplay() {
    const modeDisplay = document.createElement('div');
    modeDisplay.id = 'mode-display';
    modeDisplay.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 20px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        background: rgba(0,0,0,0.8);
        padding: 10px 15px;
        border-radius: 5px;
        border: 2px solid #00ff00;
    `;
    document.body.appendChild(modeDisplay);

    function updateModeDisplay() {
        const mode = interactionMgr.getCurrentMode();
        const selected = interactionMgr.getSelectedObject();
        
        let modeText = `Mode: ${mode.toUpperCase()}`;
        if (selected) {
            modeText += `<br>Selected: ${selected.userData.name || 'Object'}`;
        }
        
        modeDisplay.innerHTML = modeText;
        
        const modeColors = {
            select: '#00ff00',
            move: '#ffaa00',
            delete: '#ff0000'
        };
        modeDisplay.style.borderColor = modeColors[mode] || '#00ff00';
    }

    setInterval(updateModeDisplay, 100);
}

createTestObjects();
createEnvironment();
setupKeyboardControls();
addModeDisplay();

function animate() {
    requestAnimationFrame(animate);
    
    sceneMgr.update();
    sceneMgr.render();
}

animate();

console.log('Structured Architecture Example loaded successfully!');
console.log('Architecture components:');
console.log('- SceneManager: Handles 3D scene, lighting, and rendering');
console.log('- InputManager: Captures and processes user input events');  
console.log('- InteractionManager: Manages object selection and interaction modes');
console.log('');
console.log('Interaction Pipeline: Input → Raycast → Selection → Action');