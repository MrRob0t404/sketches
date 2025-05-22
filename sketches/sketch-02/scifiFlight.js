import * as THREE from 'three';

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.set(0, 2, 5);

const renderer = new THREE.renderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);

const squareGeo = new THREE.PlaneGeometry();
const color = 0xff00ff;
const basicMat = new THREE.MeshBasicMaterial({
    color
});
const mesh = new THREE.Mesh(squareGeo, basicMat);
scene.add(mesh);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
