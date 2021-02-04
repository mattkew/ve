import * as THREE from 'https://unpkg.com/three/build/three.module.js'; // import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// VR
import { VRButton } from './VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

const circleY = 2
const circleZ = -1.5

const radius = 2.5
const modAmp = .0005 // radius // * .8 // 2
const increment = Math.PI / 4.0
const numOfCirclePts = 500 // 250 // 500
const curvePts = 10000
const material = new THREE.LineBasicMaterial( { color : 0x555555 } );
let curve

const modRate = Math.PI / 180
let modInc = 0
// NEED TO % INC EVENLY OR MAKE MOD TABLE FOR SPEED

const modulate1 = (v, amp) => Math.sin(v) * amp
const modulate2 = (v, amp) => Math.cos(v) * amp

const baseCircle = [...new Array(numOfCirclePts)].map( (_, i) => { 
    let v = i * increment
    return new THREE.Vector3(
        Math.sin(v), 
        Math.cos(v)+ circleY, 
        circleZ
    )
})

const circle = () => baseCircle.map( (vec3, i) => { 
    let v = (i * 3.73) + modInc
    let disturbance1 = modulate1(v, modAmp * (i / numOfCirclePts)) * i
    let disturbance2 = modulate2(v, modAmp * (i / numOfCirclePts)) * i
    return new THREE.Vector3(
        vec3.x + disturbance1, 
        vec3.y + disturbance2, // + circleY, 
        vec3.z + disturbance1 // + circleZ
    )
})

const generateCircle = () => {

    scene.remove( curve )

    // modInc += modRate

    let circlePoints = circle()
    curve = new THREE.CatmullRomCurve3( circlePoints );
    let points = curve.getPoints( curvePts ); // let points = curve.getPoints( numOfCirclePoints * curvePoints );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    curve = new THREE.Line( geometry, material );

    scene.add( curve );
}

const animate = function () {
    renderer.setAnimationLoop( render )
};

const render = function() {
    modInc = (modInc + modRate) % (Math.PI * 2.0)
    generateCircle()
    renderer.render( scene, camera );
}

animate();





