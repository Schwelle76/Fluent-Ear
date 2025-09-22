import { PitchClass, PITCH_CLASSES, Note } from '../models/Note';

export default class MicrophoneNoteDetector {


    onNote: (note: Note | undefined) => void;
    sensitivity: number;
    detectedNote: PitchClass | undefined;
    audioReady: boolean = false;
    MIN_SENSITIVITY = 1;
    MAX_SENSITIVITY = 200;

    audioContext: AudioContext | undefined;
    analyser: AnalyserNode | undefined;
    animationFrame: number | undefined;
    currentAssumedNote: Note | undefined;
    previousAssumedNote: Note | undefined;
    timeOfFirstAssumption: number = 0;

    constructor(onNote: (note: Note | undefined) => void) {
        this.onNote = onNote;
        this.sensitivity = this.computeDefaultSensitivity();
        // kein bind nötig mehr
    }







    public initAudio = async (): Promise<boolean> => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.audioContext = context;

            if (context.state === 'suspended') {
                await context.resume();
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = context.createMediaStreamSource(stream);

            this.analyser = context.createAnalyser();
            this.analyser.fftSize = 2048;
            source.connect(this.analyser);

            this.animationFrame = requestAnimationFrame(this.updatePitch);
            this.audioReady = true;
        } catch (err) {
            console.error('Error accessing audio devices:', err);
            this.audioReady = false;
        } finally { return this.audioReady; }
    };

    public destroy = () => {


        if (this.analyser) {
            this.analyser.disconnect();
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.currentAssumedNote = undefined;
        this.previousAssumedNote = undefined;
    }


    public setSensitivity = (sensitivity: number) => {

        if (this.animationFrame)
            cancelAnimationFrame(this.animationFrame);

        this.sensitivity = Math.max(this.MIN_SENSITIVITY, Math.min(sensitivity, this.MAX_SENSITIVITY))

        if (this.audioReady)
            this.animationFrame = requestAnimationFrame(this.updatePitch);

    }


    private updatePitch = () => {
        if (!this.analyser || !this.audioContext) return;

        const buf = new Float32Array(this.analyser.fftSize);
        this.analyser.getFloatTimeDomainData(buf);

        const pitch = this.autoCorrelate(buf, this.audioContext.sampleRate);

        const timeTillDetection = this.MAX_SENSITIVITY - this.sensitivity + this.MIN_SENSITIVITY;

        let note = undefined;
        if (pitch > 0) {
            const detected = this.noteFromPitch(pitch);
            this.currentAssumedNote = detected;


            if (this.previousAssumedNote?.equals(this.currentAssumedNote)) {
                if (Date.now() - this.timeOfFirstAssumption > timeTillDetection) {
                    note = this.currentAssumedNote;
                }
            } else {
                this.previousAssumedNote = this.currentAssumedNote;
                this.timeOfFirstAssumption = Date.now();
            }
        }

        
        this.onNote(note);



        this.animationFrame = requestAnimationFrame(this.updatePitch);
    };

    private autoCorrelate = (buf: Float32Array, sampleRate: number) => {
        // Existing auto-correlation implementation
        var SIZE = buf.length;
        var rms = 0;

        for (var i = 0; i < SIZE; i++) {
            var val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1;

        var r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for (var i = 0; i < SIZE / 2; i++)
            if (Math.abs(buf[i]) < thres) { r1 = i; break; }
        for (var i = 1; i < SIZE / 2; i++)
            if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

        buf = buf.slice(r1, r2);
        SIZE = buf.length;

        var c = new Array(SIZE).fill(0);
        for (var i = 0; i < SIZE; i++)
            for (var j = 0; j < SIZE - i; j++)
                c[i] = c[i] + buf[j] * buf[j + i];

        var d = 0; while (c[d] > c[d + 1]) d++;
        var maxval = -1, maxpos = -1;
        for (var i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;

        var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        let a = (x1 + x3 - 2 * x2) / 2;
        let b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    };

    private noteFromPitch = (frequency: number) => {
        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        let noteIndex = Math.round(noteNum) + 69;
        return new Note(PITCH_CLASSES[noteIndex % 12], Math.floor(noteIndex / 12) - 1);
    };

    private computeDefaultSensitivity() {
        const userAgent = navigator.userAgent;
        const isMobile = /android|iphone|ipad/i.test(userAgent);
        const isChrome = /chrome|chromium|crios/i.test(userAgent);
        const isFirefox = /firefox|fxios/i.test(userAgent);

        let timeTillDetection = 20;
        if (isChrome) timeTillDetection = isMobile ? 2 : 9;
        if (isFirefox) timeTillDetection = 35;

        return this.MAX_SENSITIVITY + this.MIN_SENSITIVITY - timeTillDetection;
    }

}
