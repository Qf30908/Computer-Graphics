# 🌳 Interactive 3D Park Scene (Three.js)

An interactive **3D park environment** built with **Three.js**, featuring FPS controls, day–night cycle, animated birds, ambient audio, dynamic lighting, and multiple interactive objects such as doors and historical statues.

This project demonstrates real-time 3D graphics, user interaction, and environmental effects using modern web technologies.

---

## 🚀 Features

### 🌞 Day & Night Cycle

* Automatic or manual time control
* Smooth sky color transition
* Sun intensity adapts to time of day
* Street lamps automatically turn on at night

### 🎮 First-Person Controls

* **W / A / S / D** movement
* Mouse look using **Pointer Lock**
* Optional **drone camera height control**

### 🏛️ Interactive Objects

* **Clickable door** that opens and closes
* **Clickable bust statue** that shows an information panel
* Fence visibility toggle
* Dynamic environment objects

### 🐦 Animated Birds

* GLTF bird models
* Smooth flying motion
* Randomized movement paths
* Toggle on/off in control panel

### 🌊 Water & Environment

* Animated water under bridges
* Bridges, benches, walls, and roads
* Fog with real-time toggle
* Realistic shadows

### 🔊 Ambient Audio

* Background park ambience
* Toggle audio on/off

---

## 🧰 Technologies Used

* **Three.js**
* **GLTFLoader**
* **PointerLockControls**
* **JavaScript (ES Modules)**
* **HTML & CSS**

---

## 📁 Project Structure

```
/assets
 ├── bust_of_scanderbeg.glb
 ├── bird.gltf
 ├── classical_fence.gltf
 ├── park_caffe/
 ├── chicago_buildings/
 ├── textures/
 ├── park_ambient.mp3
 └── *.jpg / *.png

/script.js
/index.html
/README.md
```

---

## 🎛️ Controls

### Movement

| Key   | Action        |
| ----- | ------------- |
| W     | Move Forward  |
| S     | Move Backward |
| A     | Move Left     |
| D     | Move Right    |
| Mouse | Look Around   |

### Interaction

| Action     | Result                 |
| ---------- | ---------------------- |
| Click Door | Open / Close           |
| Click Bust | Show / Hide Info Panel |

### Toggles

| Key | Action              |
| --- | ------------------- |
| L   | Toggle Street Lamps |
| P   | Toggle Sun Light    |

---

## 🧩 UI Control Panel

* Fog On / Off
* Birds On / Off
* Water On / Off
* Ambient Audio On / Off
* Fence Visibility
* Time Slider (Manual Mode)
* Camera Height (Drone View)
* Auto / Manual Time Mode

---

## 🕒 Time System

* **Auto Mode:** Continuous day–night cycle
* **Manual Mode:** Controlled via slider
* Lamps activate only at night
* Sun visible only during daytime

---

## 🔊 Audio System

* Ambient park sound
* Uses `THREE.AudioListener`
* Audio loops continuously
* Controlled via checkbox

---

## ⚙️ Installation & Run

### 1️⃣ Install Dependencies

```bash
npm install three 

### 2️⃣ Run with a Local Server

You **must** use a local server for GLTF & audio files:

```bash
npm start
```

---

## 📌 Notes

* Pointer Lock activates on mouse click
* Optimized for desktop browsers

---

## 📸 Screenshots
![Screenshot](screenshots/Screenshot%20(67).png)
![Screenshot](screenshots/Screenshot%20(68).png)
![Screenshot](screenshots/Screenshot%20(69).png)
![Screenshot](screenshots/Screenshot%20(70).png)
![Screenshot](screenshots/Screenshot%20(71).png)


---

## 🧑‍💻 Author

**Qemal Fejzullai (130908)**

---

## 📜 License

This project is for **educational and non-commercial use**.
