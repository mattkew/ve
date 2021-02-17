import Perlin from './perlin-noise-sb.js';
import * as THREE from "../node_modules/three/build/three.module.js"
//import "../node_modules/simplex-noise/simplex-noise.js"

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
// Controllers here


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
const intensity = 0 // .0125 // .45;
const ambientlight = new THREE.AmbientLight(color, intensity);
scene.add(ambientlight);

let geometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 )

let material = new THREE.MeshPhongMaterial( { 
    color: 0x4f4f63, // COLORS.WHITE,
    // envMap: envMap, // optional environment map
    specular: 0xffffff,
    shininess: 100,
    reflectivity: 1,
    // flatShading: true, 
    receiveShadow: true,
    castShadow: true,
    // wireframe: true
} ) 

let wall = new THREE.Mesh( geometry, material );
wall.castShadow = true;
wall.receiveShadow = true
wall.rotation.x = 90 
wall.position.y = 0 // 150
wall.lookAt(0, 0, 0)
wall.position.z = -10
scene.add( wall );

let zIncrement = -200 // replaced wall.position.z see further down below

let perlin = new Perlin();
let amp = 10
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


//////////////





let fft = undefined
// attach a click listener to a play button
document.querySelector('button').addEventListener('click', async () => {
    //let Tone = await import('../node_modules/tone/build/Tone.js');
    await Tone.start()
    const player = new Tone.Player("./resources/audio/vr-f-fall.mp3").toDestination();
    player.loop = true;
    player.autostart = true;

    
    const bands = 128
    fft = new Tone.FFT(bands)
    fft.smoothing = 0.999999 // 0.999999
    // fft.sampleTime = 512
    player.chain(fft, Tone.Master)
    console.log([...Array.from(Array(bands).keys())].map(index => fft.getFrequencyOfIndex(index)));

    // console.log("--->" + fft.getValue())

    // your page is ready to play sounds

    /*
    (32) [0, 689.0625, 1378.125, 2067.1875, 2756.25, 3445.3125, 4134.375, 4823.4375, 5512.5, 6201.5625, 6890.625, 7579.6875, 8268.75, 8957.8125, 9646.875, 10335.9375, 11025, 11714.0625, 12403.125, 13092.1875, 13781.25, 14470.3125, 15159.375, 15848.4375, 16537.5, 17226.5625, 17915.625, 18604.6875, 19293.75, 19982.8125, 20671.875, 21360.9375]
    */
})






///////////////

const pGeometry = new THREE.BufferGeometry();
const vertices = [];

const textureLoader = new THREE.TextureLoader();

const sprite1 = textureLoader.load( './resources/images/flare-2.png' );

for ( let i = 0; i < 1000; i ++ ) {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * -10 + 5;
    vertices.push( x, y, z );
}

pGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

//const pColor = 0xFFFFFF;
//const sprite = sprite1;
const size = 1;

const pMaterial = new THREE.PointsMaterial( { size: size, map: sprite1, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
material.color.setHSL( 0, 0, 100 );

const particles = new THREE.Points( pGeometry, pMaterial );

particles.rotation.x = Math.random() * 6;
particles.rotation.y = Math.random() * 6;
particles.rotation.z = Math.random() * 6;

scene.add(particles)


let pAmp = 100
let pSmoothing = 2
let x = 0
let y = 0
let z = 0

let rx = 0
let ry = 0
let rz = 0


function pRefreshVertices() {
    let vertices = particles.geometry.attributes.position.array;
    for (let i = 0; i <= vertices.length; i += 3) {
        x = i
        y = i+1
        z = i+2

        // rx = pAmp * perlin.noise(
        //     (particles.position.y + vertices[y]) / pSmoothing, 
        //     (zIncrement + vertices[z]) / pSmoothing
        // );

        // ry = pAmp * perlin.noise(
        //     (particles.position.z + vertices[z]) / pSmoothing, 
        //     (zIncrement + vertices[x]) / pSmoothing
        // );

        rz = pAmp * perlin.noise(
            (particles.position.x + vertices[x]) / pSmoothing, 
            (zIncrement + vertices[y]) / pSmoothing
        );

        //vertices[x] = rx
        //vertices[y] = ry
        vertices[z] = rz
    }
    particles.geometry.attributes.position.needsUpdate = true;
    // wall.geometry.normalizeNormals();
    particles.geometry.computeVertexNormals();
}







function update() {
    let delta = clock.getDelta();

    ///
    //band0DB = (fft !== undefined ? fft.getValue()[0] : 0) * 0.06
    //if(fft !== undefined) console.log("--->" + fft.getValue())

    // for ( let i = 0; i < scene.children.length; i ++ ) {
    //     const object = scene.children[ i ];
    //     if ( object instanceof THREE.Points ) {
    //         // object.rotation.y += (movementSpeed * delta * 0.5) * ( i < 4 ? i + 1 : - ( i + 1 ) );
    //         //let val =
    //         // object.position.x +=  0.125 * perlin.noise(
    //         //     object.position.x / 0.0125,
    //         //     clock.getElapsedTime() // d + object.position.z / 0.0125
    //         // ) // band0DB

    //         // object.position.y +=  0.125 * perlin.noise(
    //         //     object.position.x / 0.0125,
    //         //     clock.getElapsedTime() // d + object.position.z / 0.0125
    //         // ) // band0DB

    //         val = 0.125 * perlin.noise(
    //             object.position.z / 0.0125,
    //             Math.random() * 100 // d + object.position.z / 0.0125
    //         ) // band0DB

    //         console.log(i + "-> " + val)

    //         object.position.z += val
    //     }
    // }

    /*
    vertices[i+2] = amp * perlin.noise(
        (wall.position.x + vertices[i]) / smoothing, 
        (zIncrement + vertices[i+1]) / smoothing
    );
    */


    ////

    
    // wall.position.z += movementSpeed * delta;
    zIncrement += movementSpeed * delta 
    // zIncrement = movementSpeed * delta + av; // wall.position.z += movementSpeed * delta;
    refreshVertices();

    pRefreshVertices()

    renderer.render( scene, camera );
}

renderer.setAnimationLoop(update)


