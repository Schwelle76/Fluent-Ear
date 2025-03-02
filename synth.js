const baseFrequencies = {
    'C': 16.35,
    'C#': 17.32,
    'D': 18.35,
    'D#': 19.45,
    'E': 20.60,
    'F': 21.83,
    'F#': 23.12,
    'G': 24.50,
    'G#': 25.96,
    'A': 27.50,
    'A#': 29.14,
    'B': 30.87
};

let synthIsPlaying = false;

function noteToFrequency(note) {
    const noteName = note.slice(0, -1);
    const octave = parseInt(note.slice(-1), 10);
    const baseFrequency = baseFrequencies[noteName];
    if (baseFrequency) {
        return baseFrequency * Math.pow(2, octave);
    } else {
        console.error('Invalid note:', note);
        return null;
    }
}

function playNote(note) {
    const frequency = noteToFrequency(note);
    if (frequency) {
        playNoteByFrequency(frequency);
    } else {
        console.error('Invalid note:', note);
    }
}

function playNoteByFrequency(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = 'triangle'; // Change to 'triangle' for a more piano-like sound
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioContext.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime); // Adjust the cutoff frequency as needed

    const attackTime = 0.01; // Fast attack
    const decayTime = 0.3; // Short decay
    const sustainLevel = 0.5; // Sustain level
    const releaseTime = 0.5; // Release time

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, audioContext.currentTime + attackTime + decayTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + attackTime + decayTime + releaseTime);

    synthIsPlaying = true;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + attackTime + decayTime + releaseTime);
    oscillator.onended = () => {
        setTimeout(() => {
            synthIsPlaying = false;
        }, releaseTime * 1000 + 500); // Convert releaseTime to milliseconds
    };
}

