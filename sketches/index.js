import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.035);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

function getRandomSpherePoint({ radius = 5 }) {
  const minRadius = radius - 0.6;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const edges = new THREE.EdgesGeometry(geo);
function getBox() {
  const box = new THREE.LineSegments(edges, mat);
  return box;
}

const boxGroup = new THREE.Group();
boxGroup.userData.update = (timestamp) => {
  boxGroup.rotation.y = timestamp * 0.0001;
  boxGroup.rotation.x = timestamp * 0.0001;
};
scene.add(boxGroup);

const numBoxes = 1000;
const radius = 24;
for (let i = 0; i < numBoxes; i++) {
  const box = getBox();
  const { x, y, z } = getRandomSpherePoint({ radius });
  box.position.set(x, y, z);
  box.rotation.set(x, y, z);
  boxGroup.add(box);
}

const hemiLight = new THREE.HemisphereLight(0x000000, 0x000000, 1);
scene.add(hemiLight);

function animate(timestamp = 0) {
  boxGroup.userData.update(timestamp);
  boxGroup.rotation.y += 0.001;

  composer.render(scene, camera);
  controls.update();
}

animate();
