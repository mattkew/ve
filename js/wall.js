
import Perlin from './perlin-noise-sb.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js'; // import * as THREE from 'three';


//
import {EffectComposer } from "https://threejs.org/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "https://threejs.org/examples/jsm/postprocessing/BokehPass.js";
//



const Palette = {
    // Pink: 0xe64386,
    // Beige: 0xf6d7bd,
    // Teal: 0x035e79,
    Peach: 0xf19c98,
    Plum: 0x3c3951,
    White: 0xffffff
};

const Colors = {
    BackgroundColor: 0xeeeeee, // Palette.White,
    LightColor: Palette.White,
    TerrainColor: 0xffffff // 0x999999
};

var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
var cameraTarget = {x:0, y:0, z:0};
camera.position.y = 0 // 70;
camera.position.z = 0 // 4000 // 2500; // 1000
camera.rotation.x = 0 // -15 * Math.PI / 180;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor(Colors.BackgroundColor);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

// VR
import { VRButton } from './VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
//

/*
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );
*/

// var light = new THREE.DirectionalLight(Colors.LightColor, 1);
// light.position.set(camera.position.x, camera.position.y+4000, camera.position.z+500).normalize();
// scene.add(light);

//
const lcolor = 0xFFFFFF;
const lintensity = .5;
const light = new THREE.SpotLight(lcolor, lintensity);
light.position.set(0, 600, -0);
light.target.position.set(0, 0, -200);
scene.add(light);
scene.add(light.target);
const helper = new THREE.SpotLightHelper(light);
scene.add(helper);
//

const color = 0xFFFFFF;
const intensity = .45;
const ambientlight = new THREE.AmbientLight(color, intensity);
scene.add(ambientlight);

// Setup the terrain
var geometry = new THREE.PlaneBufferGeometry( 200, 200, 32, 32 ) // new THREE.PlaneBufferGeometry( 200, 200, 256, 256 ); // new THREE.PlaneBufferGeometry( 2000, 2000, 256, 256 );
// var material = new THREE.MeshLambertMaterial({color: Colors.TerrainColor});

var material = new THREE.MeshPhongMaterial( { 
    color: Colors.TerrainColor,
    //envMap: envMap, // optional environment map
    specular: 0xffffff,
    shininess: 100
} ) 


var terrain = new THREE.Mesh( geometry, material );
terrain.rotation.x = 0 // -Math.PI / 2;
terrain.position.z = -200
scene.add( terrain );

var perlin = new Perlin();
var peak = 100 // 10 // 60;
var smoothing = 0.05 // 1 // 300;
function refreshVertices() {
    var vertices = terrain.geometry.attributes.position.array;
    for (var i = 0; i <= vertices.length; i += 3) {
        vertices[i+2] = peak * perlin.noise(
            (terrain.position.x + vertices[i])/smoothing, 
            (terrain.position.z + vertices[i+1])/smoothing
        );
    }
    terrain.geometry.attributes.position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
}

var clock = new THREE.Clock();
var movementSpeed = 0.025 // 60;
function update() {
    var delta = clock.getDelta();
    terrain.position.z += movementSpeed * delta;
    //camera.position.z += movementSpeed * delta;
    refreshVertices();
}

/*
const animate = function () {
    renderer.setAnimationLoop( render )
};

const render = function() {
    time = (time + timeIncrement) % Math.PI
    generateCircle()
    renderer.render( scene, camera );
}
*/



///
const effectController = {

    focus: 200.0,
    aperture: 5, // 5
    maxblur: 0.01 // 0.01

};


const postprocessing = {};
function initPostprocessing() {
    const renderPass = new RenderPass( scene, camera );

    const bokehPass = new BokehPass( scene, camera, {
        focus: 1.0,
        aperture: 0.025,
        maxblur: 0.01,

        width: width,
        height: height
    } );

    const composer = new EffectComposer( renderer );

    composer.addPass( renderPass );
    composer.addPass( bokehPass );

    postprocessing.composer = composer;
    postprocessing.bokeh = bokehPass;

}
initPostprocessing()
postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;

///






function render() {
    renderer.setAnimationLoop(loop)
}

function loop() {
    //stats.begin();
    update();
    render();
    //stats.end();

//
postprocessing.composer.render( 0.1 )
//


    //renderer.render( scene, camera ); // requestAnimationFrame(loop);
}

render();


