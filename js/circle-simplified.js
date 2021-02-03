import * as THREE from 'https://unpkg.com/three/build/three.module.js'; // import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// VR
import { VRButton } from './VRButton.js';
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

const timeFactor = Math.PI / 180
const radius = 2.5
const disturbanceAmp = radius // * .8 // 2
const increment = 1
const numOfCirclePoints = 500
const curvePoints = 10000
const material = new THREE.LineBasicMaterial( { color : 0xffffff } );

let time = 0
let splineObject

const signedRandom = (amp) => (Math.random() * amp) - (amp / 2)

const circle = () => [...new Array(numOfCirclePoints)].map( (_, i) => { 
    let v = i * increment + time
    let disturbance = radius + signedRandom(disturbanceAmp * (i / numOfCirclePoints))
    return new THREE.Vector3(
        Math.sin(v) * disturbance, 
        Math.cos(v) * disturbance, 
        Math.sin(v * 0.35)
    )
})

let rendered = false

const generateCircle = () => {

    if (rendered) return 

    scene.remove( splineObject )

    let circlePoints = circle()
    let curve = new THREE.SplineCurve( circlePoints );
    let points = curve.getPoints( curvePoints ); // let points = curve.getPoints( numOfCirclePoints * curvePoints );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    splineObject = new THREE.Line( geometry, material );

    scene.add( splineObject );

    rendered = true
}

const animate = function () {
    renderer.setAnimationLoop( render )
};

const render = function() {
    time = (time + timeFactor) % Math.PI
    generateCircle()
    renderer.render( scene, camera );
}

animate();





