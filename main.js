// Imports
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

// -------------------------------------------------------------------------------------------------------------------------

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.01,
	100
);
camera.position.set(0, 0, 3);
camera.lookAt(new THREE.Vector3());

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x111111);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Resize
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
});

// Time
let time = 0;

// -------------------------------------------------------------------------------------------------------------------------

// Lights
const ambient = new THREE.AmbientLight(0xcccccc, 0.8);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0, 1000, 5000);
scene.add(light);

// Light Helpers
// const lightHelper = new THREE.DirectionalLightHelper(light);
// scene.add(lightHelper);

// -------------------------------------------------------------------------------------------------------------------------

const material = new THREE.ShaderMaterial({
	extensions: {
		derivatives: "#extension GL_OES_standard_derivatives : enable",
	},
	side: THREE.DoubleSide,
	uniforms: {
		time: {
			type: "f",
			value: 0,
		},
		resolution: {
			type: "v4",
			value: new THREE.Vector4(),
		},
		// uvRate1: {
		// 	value: new THREE.Vector2(1, 1),
		// },
	},
	// wireframe: true,
	// transparent: true,
	vertexShader: vertex,
	fragmentShader: fragment,
});
const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
const sphere = new THREE.Points(geometry, material);
scene.add(sphere);

// -------------------------------------------------------------------------------------------------------------------------

// Game Loop
function animate() {
	// Animation
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

// -------------------------------------------------------------------------------------------------------------------------
