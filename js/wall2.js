
import Perlin from './perlin-noise-sb.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js'; // import * as THREE from 'three';

const COLORS = {
    LIGHT_GRAY: 0x000000, // 0xEEEEEE,
    WHITE:  0xFFFFFF
}

let width = window.innerWidth;
let height = window.innerHeight;

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
camera.position.y = 0
camera.position.z = 0
camera.rotation.x = 0

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor(COLORS.LIGHT_GRAY);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

// VR
import { VRButton } from './VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

// Fog
{
    const near =100;
    const far = 300;
    const color = COLORS.LIGHT_GRAY // 'lightblue';
    scene.fog = new THREE.Fog(color, near, far);
    //scene.background = new THREE.Color(color);
}

// Spotlight
const lcolor = 0xFFFFFF;
const lintensity = .5;
const light = new THREE.SpotLight(lcolor, lintensity);
light.position.set(0, 600, -0);
light.target.position.set(0, 0, -200);
light.castShadow = true;
scene.add(light);
scene.add(light.target);
//const helper = new THREE.SpotLightHelper(light);
//scene.add(helper);

// Ambient Light
const color = 0xFFFFFF;
const intensity = 0 //.125 // .45;
const ambientlight = new THREE.AmbientLight(color, intensity);
scene.add(ambientlight);

let geometry = new THREE.PlaneBufferGeometry( 200, 200, 32, 32 )

let material = new THREE.MeshPhongMaterial( { 
    color: 0x4f4f63, // COLORS.WHITE,
    // envMap: envMap, // optional environment map
    specular: 0xffffff,
    shininess: 100,
    reflectivity: 1,
    // flatShading: true 
    receiveShadow: true,
    castShadow: true,
    // wireframe: true
} ) 

let wall = new THREE.Mesh( geometry, material );
wall.castShadow = true;
wall.receiveShadow == true
wall.rotation.x = 0
wall.rotatiyn.y = 100
wall.position.z = -200
scene.add( wall );

let zIncrement = -200 // replaced wall.position.z see further down below

let perlin = new Perlin();
let amp = 100
let smoothing = 0.05
function refreshVertices() {
    let vertices = wall.geometry.attributes.position.array;
    for (let i = 0; i <= vertices.length; i += 3) {
        vertices[i+2] = amp * perlin.noise(
            (wall.position.x + vertices[i]) / smoothing, 
            (zIncrement + vertices[i+1]) / smoothing
        );
    }
    wall.geometry.attributes.position.needsUpdate = true;
    // wall.geometry.normalizeNormals();
    wall.geometry.computeVertexNormals();
}

let clock = new THREE.Clock();
let movementSpeed = 0.025

function update() {
    let delta = clock.getDelta();
    zIncrement += movementSpeed * delta; // wall.position.z += movementSpeed * delta;
    refreshVertices();
    renderer.render( scene, camera );
}

renderer.setAnimationLoop(update)


