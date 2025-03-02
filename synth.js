const noteFrequencies = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
};

let synthIsPlaying = false;

function noteToFrequency(note) {
    return noteFrequencies[note];
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

