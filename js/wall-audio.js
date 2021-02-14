// Audio
//import { Tone } from 'tone/build/esm/core/Tone';
//import * as Tone from 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js'
//import * as Tone from 'tone'
//import * as Tone from '../node_modules/tone/Tone'
//import * as Tone from '../tone/build/Tone'
//import * as Tone from '../node_modules/tone/build/Tone.js'

// attach a click listener to a play button
document.querySelector('button').addEventListener('click', async () => {
    //let Tone = await import('../node_modules/tone/build/Tone.js');
    await Tone.start()
    const player = new Tone.Player("./resources/audio/vr-f-fall.mp3").toMaster(); //.toDestination();
    player.loop = true;
    player.autostart = true;
    // your page is ready to play sounds
})
