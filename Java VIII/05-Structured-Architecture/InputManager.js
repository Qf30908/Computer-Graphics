import * as THREE from 'three';

export class InputManager {
    constructor(domElement) {
        this.dom = domElement;
        this.mouse = new THREE.Vector2();
        this.isPointerDown = false;
        this.lastPointerPosition = new THREE.Vector2();

        this.callbacks = {
            onClick: null,
            onPointerMove: null,
            onPointerDown: null,
            onPointerUp: null
        };

        this.#setupEventListeners();
    }

    #setupEventListeners() {
        this.dom.addEventListener('pointermove', (e) => this.#onMove(e));
        this.dom.addEventListener('pointerdown', (e) => this.#onDown(e));
        this.dom.addEventListener('pointerup', (e) => this.#onUp(e));
        this.dom.addEventListener('click', (e) => this.#onClick(e));
        
        this.dom.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    #updateMousePosition(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    #onMove(e) {
        this.#updateMousePosition(e);
        
        if (this.callbacks.onPointerMove) {
            this.callbacks.onPointerMove(this.mouse, this.isPointerDown);
        }
    }

    #onDown(e) {
        this.#updateMousePosition(e);
        this.isPointerDown = true;
        this.lastPointerPosition.copy(this.mouse);
        
        if (this.callbacks.onPointerDown) {
            this.callbacks.onPointerDown(this.mouse);
        }
    }

    #onUp(e) {
        this.#updateMousePosition(e);
        this.isPointerDown = false;
        
        if (this.callbacks.onPointerUp) {
            this.callbacks.onPointerUp(this.mouse);
        }
    }

    #onClick(e) {
        this.#updateMousePosition(e);
        
        if (this.callbacks.onClick) {
            this.callbacks.onClick(this.mouse);
        }
    }

    setCallback(eventType, callback) {
        if (this.callbacks.hasOwnProperty(eventType)) {
            this.callbacks[eventType] = callback;
        } else {
            console.warn(`Unknown callback type: ${eventType}`);
        }
    }

    getMousePosition() {
        return this.mouse.clone();
    }

    isPressed() {
        return this.isPointerDown;
    }
}