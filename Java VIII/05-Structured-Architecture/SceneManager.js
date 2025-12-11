import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.interactables = [];
        this.nonInteractables = [];

        this.#initializeRenderer();
        this.#initializeLighting();
        this.#initializeControls();
        this.#setupEventListeners();
    }

    #initializeRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x1a1a1a);
        document.body.appendChild(this.renderer.domElement);
    }

    #initializeLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    #initializeControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        
        this.camera.position.set(8, 6, 8);
        this.camera.lookAt(0, 0, 0);
    }

    #setupEventListeners() {
        window.addEventListener('resize', () => this.#onWindowResize());
    }

    #onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addObject(obj, interactable = false) {
        this.scene.add(obj);
        if (interactable) {
            this.interactables.push(obj);
        } else {
            this.nonInteractables.push(obj);
        }
    }

    removeObject(obj) {
        this.scene.remove(obj);
        
        const interactableIndex = this.interactables.indexOf(obj);
        if (interactableIndex > -1) {
            this.interactables.splice(interactableIndex, 1);
        }
        
        const nonInteractableIndex = this.nonInteractables.indexOf(obj);
        if (nonInteractableIndex > -1) {
            this.nonInteractables.splice(nonInteractableIndex, 1);
        }
    }

    update() {
        this.controls.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    getDomElement() {
        return this.renderer.domElement;
    }
}