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

const circleY = 5
const circleZ = -10

const radius = 2.5
const disturbanceAmp = radius // * .8 // 2
const increment = 1
const numOfCirclePoints = 250 // 500
const curvePoints = 10000
const material = new THREE.LineBasicMaterial( { color : 0xaaaaaa } );

const timeIncrement = Math.PI / 180
let time = 0
let curve

const signedRandom = (amp) => (Math.random() * amp) - (amp / 2)

const circle = () => [...new Array(numOfCirclePoints)].map( (_, i) => { 
    let v = i * increment + time
    let disturbance = radius + signedRandom(disturbanceAmp * (i / numOfCirclePoints))
    return new THREE.Vector3(
        Math.sin(v) * disturbance, 
        (Math.cos(v) * disturbance) + circleY, 
        (Math.sin(v * 0.35) * disturbance * 0.25) + circleZ
    )
})

let renderedThrottle = 20
let renderCount = 0

const generateCircle = () => {

    // renderCount++
    // if (renderCount < renderedThrottle) return 
    // renderCount = renderCount % renderedThrottle

    scene.remove( curve )

    let circlePoints = circle()
    curve = new THREE.CatmullRomCurve3( circlePoints );
    let points = curve.getPoints( curvePoints ); // let points = curve.getPoints( numOfCirclePoints * curvePoints );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    curve = new THREE.Line( geometry, material );

    scene.add( curve );
}

const animate = function () {
    renderer.setAnimationLoop( render )
};

const render = function() {
    time = (time + timeIncrement) % Math.PI
    generateCircle()
    renderer.render( scene, camera );
}

animate();





