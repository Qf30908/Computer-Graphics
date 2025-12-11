import * as THREE from 'three';

export class InteractionManager {
    constructor(sceneMgr, inputMgr) {
        this.sceneMgr = sceneMgr;
        this.inputMgr = inputMgr;

        this.raycaster = new THREE.Raycaster();
        this.selected = null;
        this.previouslySelected = [];

        this.interactionModes = {
            SELECT: 'select',
            MOVE: 'move',
            DELETE: 'delete'
        };

        this.currentMode = this.interactionModes.SELECT;

        this.#setupInputCallbacks();
    }

    #setupInputCallbacks() {
        this.inputMgr.setCallback('onClick', (mouse) => this.#handleClick(mouse));
        this.inputMgr.setCallback('onPointerMove', (mouse, isPressed) => this.#handleMove(mouse, isPressed));
    }

    #handleClick(mouse) {
        this.raycaster.setFromCamera(mouse, this.sceneMgr.camera);
        const hits = this.raycaster.intersectObjects(this.sceneMgr.interactables);

        if (hits.length > 0) {
            const hitObject = hits[0].object;
            
            switch (this.currentMode) {
                case this.interactionModes.SELECT:
                    this.#selectObject(hitObject);
                    break;
                case this.interactionModes.DELETE:
                    this.#deleteObject(hitObject);
                    break;
                case this.interactionModes.MOVE:
                    this.#startMoveObject(hitObject);
                    break;
            }
        } else {
            this.#deselectAll();
        }
    }

    #handleMove(mouse, isPressed) {
        if (this.currentMode === this.interactionModes.MOVE && this.selected && isPressed) {
            this.#moveSelectedObject(mouse);
        }
    }

    #selectObject(obj) {
        this.#deselectAll();
        
        this.selected = obj;
        this.previouslySelected.push(obj);
        
        obj.userData.originalColor = obj.userData.originalColor || obj.material.color.getHex();
        obj.material.color.setHex(0xff0000);
        
        obj.scale.setScalar(1.1);
        
        console.log('Selected object:', obj.userData.name || 'Unnamed object');
    }

    #deselectAll() {
        if (this.selected) {
            this.selected.material.color.setHex(this.selected.userData.originalColor || 0xffffff);
            this.selected.scale.setScalar(1.0);
            this.selected = null;
        }
    }

    #deleteObject(obj) {
        console.log('Deleting object:', obj.userData.name || 'Unnamed object');
        
        this.sceneMgr.removeObject(obj);
        
        if (this.selected === obj) {
            this.selected = null;
        }
        
        const index = this.previouslySelected.indexOf(obj);
        if (index > -1) {
            this.previouslySelected.splice(index, 1);
        }
    }

    #startMoveObject(obj) {
        this.#selectObject(obj);
        console.log('Started moving object:', obj.userData.name || 'Unnamed object');
    }

    #moveSelectedObject(mouse) {
        if (!this.selected) return;

        this.raycaster.setFromCamera(mouse, this.sceneMgr.camera);
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        
        if (this.raycaster.ray.intersectPlane(plane, intersection)) {
            this.selected.position.x = intersection.x;
            this.selected.position.z = intersection.z;
        }
    }

    setInteractionMode(mode) {
        if (Object.values(this.interactionModes).includes(mode)) {
            this.currentMode = mode;
            this.#deselectAll();
            console.log(`Interaction mode changed to: ${mode}`);
        } else {
            console.warn(`Invalid interaction mode: ${mode}`);
        }
    }

    getCurrentMode() {
        return this.currentMode;
    }

    getSelectedObject() {
        return this.selected;
    }

    getPreviouslySelected() {
        return [...this.previouslySelected];
    }

    clearSelection() {
        this.#deselectAll();
        this.previouslySelected = [];
    }
}