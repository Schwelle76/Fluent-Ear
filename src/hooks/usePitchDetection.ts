import { useState, useEffect, useRef } from 'react';
import { CHROMATIC_SCALE, SCALES } from '../constants/SCALES';

export default function usePitchDetection() {



  const [detectedNote, setDetectedNote] = useState<string | undefined>(undefined);
  const [audioReady, setAudioReady] = useState(false);

  const MAX_SENSITIVITY = 100;
  const MIN_SENSITIVITY = 1;
  const [sensitivity, setSensitivity] = useState(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /android|iphone|ipad/i.test(userAgent);
    const isChrome = /chrome|chromium|crios/i.test(userAgent);
    const isFirefox = /firefox|fxios/i.test(userAgent);

    let timeTillDetection = 20;
    if (isChrome) timeTillDetection = isMobile ? 2 : 9;
    if (isFirefox) timeTillDetection = 35;

    return MAX_SENSITIVITY + MIN_SENSITIVITY - timeTillDetection;
  });


  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentAssumedNote = useRef<string | null>(null);
  const previousAssumedNote = useRef<string | null>(null);
  const timeOfFirstAssumption = useRef<number>(0);

  const initAudio = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;

      if (context.state === 'suspended') {
        await context.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = context.createMediaStreamSource(stream);

      analyserRef.current = context.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      animationFrameRef.current = requestAnimationFrame(updatePitch);
      setAudioReady(true);
    } catch (err) {
      console.error('Error accessing audio devices:', err);
      setAudioReady(false);
    }
  };

  useEffect(() => {

    return () => {
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      currentAssumedNote.current = null;
      previousAssumedNote.current = null;
    };
  }, []);


  useEffect(() => {

    if (audioReady)
      animationFrameRef.current = requestAnimationFrame(updatePitch);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sensitivity]);

  const updatePitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buf = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buf);

    const pitch = autoCorrelate(buf, audioContextRef.current.sampleRate);

    const timeTillDetection = MAX_SENSITIVITY - sensitivity + MIN_SENSITIVITY ;

    let note = "";
    if (pitch > 0) {
      const detected = noteFromPitch(pitch);
      currentAssumedNote.current = detected;


      if (previousAssumedNote.current === currentAssumedNote.current) {
        if (Date.now() - timeOfFirstAssumption.current > timeTillDetection) {
          note = currentAssumedNote.current;
        }
      } else {
        previousAssumedNote.current = currentAssumedNote.current;
        timeOfFirstAssumption.current = Date.now();
      }
    }
    setDetectedNote(note);



    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  const autoCorrelate = (buf : Float32Array, sampleRate : number) => {
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

  const noteFromPitch = (frequency : number) => {
    var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    let noteIndex = Math.round(noteNum) + 69;
    return CHROMATIC_SCALE.getPitchClasses("C")[noteIndex % 12];
  };

  return {
    detectedNote,
    setSensitivity,
    sensitivity,
    MAX_SENSITIVITY,
    MIN_SENSITIVITY,
    audioReady,
    initAudio
  };
}
