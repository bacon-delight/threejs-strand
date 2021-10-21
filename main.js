// Imports
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

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
camera.position.set(0, 0, 4);
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
// const ambient = new THREE.AmbientLight(0xcccccc, 0.8);
// scene.add(ambient);
// const light = new THREE.DirectionalLight(0xffffff, 3);
// light.position.set(0, 1000, 5000);
// scene.add(light);

// Light Helpers
// const lightHelper = new THREE.DirectionalLightHelper(light);
// scene.add(lightHelper);

// -------------------------------------------------------------------------------------------------------------------------

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
	"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
);
gltfLoader.setDRACOLoader(dracoLoader);

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
		uColor1: {
			value: new THREE.Color(0x612574),
		},
		uColor2: {
			value: new THREE.Color(0x293583),
		},
		uColor3: {
			value: new THREE.Color(0x1954ec),
		},
		resolution: {
			type: "v4",
			value: new THREE.Vector4(),
		},
	},
	// wireframe: true,
	transparent: true,
	vertexShader: vertex,
	fragmentShader: fragment,
	depthTest: false,
	depthWrite: false,
	blending: THREE.AdditiveBlending,
});

gltfLoader.load("./shaders/dna.glb", (gtlf) => {
	const geometry = gtlf.scene.children[0].geometry;
	geometry.center();

	const numberOfParticles = geometry.attributes.position.array.length / 3;
	const random = new Float32Array(numberOfParticles);
	const randomColor = new Float32Array(numberOfParticles);
	for (let i = 0; i < numberOfParticles; i++) {
		random.set([Math.random()], i);
		randomColor.set([Math.random()], i);
	}
	geometry.setAttribute("random", new THREE.BufferAttribute(random, 1));
	geometry.setAttribute(
		"randomColor",
		new THREE.BufferAttribute(randomColor, 1)
	);

	const strand = new THREE.Points(geometry, material);
	scene.add(strand);
});

// -------------------------------------------------------------------------------------------------------------------------

// Post Processing - Bloompass
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1.5,
	0.9,
	0.85
);

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// -------------------------------------------------------------------------------------------------------------------------

// Game Loop
function animate() {
	// Animation
	requestAnimationFrame(animate);
	// renderer.render(scene, camera);
	composer.render();
}
animate();

// -------------------------------------------------------------------------------------------------------------------------
