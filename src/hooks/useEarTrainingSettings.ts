import { useRef, useEffect, useState, use } from 'react';
import { SCALES } from '../constants/SCALES';
import { Scale } from '../models/Scale';
import { Direction } from '../models/Direction';
import { Interval } from '../models/Note';
import { LEVELS } from '../constants/LEVELS';

export default function useEarTrainingSettings() {
  
  const [root, setRoot] = useState(localStorage.getItem('root') || 'random');
  const [direction, setDirection] = useState<Direction>(localStorage.getItem('direction') || 'ascending');
  const [scale, setScale] = useState(SCALES[0]);
  const [scalePreset, setScalePreset] = useState<string | undefined>(undefined);
  const [melodyLength, setMelodyLength] = useState(parseInt(localStorage.getItem('melodyLength') || '1') || 1);
  const [level, setLevel] = useState(parseInt(localStorage.getItem('level') || '0') || 0);
  const customScale = useRef(new Scale("Custom Scale", [0]));

  useEffect(() => {
    localStorage.setItem('root', root);
  }, [root]);

  useEffect(() => {
    localStorage.setItem('direction', direction);
  }, [direction]);

  useEffect(() => {
    localStorage.setItem('melodyLength', melodyLength.toString());
  }, [melodyLength]);


  useEffect(() => {

    const lastUsedPreset = localStorage.getItem('scalePreset');
    const lastUsedHalfsteps = localStorage.getItem('scale')?.split(',').map(halfStep => parseInt(halfStep));


    if (lastUsedHalfsteps && lastUsedHalfsteps.length > 0)
      customScale.current = new Scale("Custom Scale", lastUsedHalfsteps);


    if(lastUsedPreset) setScalePreset(lastUsedPreset);
    else setScalePreset(SCALES[0].name);


  }, []);

  useEffect(() => {
    if(level >= 0){
      setScalePreset("Level Scale");
      setMelodyLength(LEVELS[level].melodyLength);
      setDirection(LEVELS[level].direction);
      setScale(LEVELS[level].scale);
      setRoot(LEVELS[level].root);
    }

  },[level]);



  useEffect(() => {


    if (scalePreset === customScale.current.name) {
      setScale(customScale.current);
    } else {
      const foundScale = SCALES.find(scale => scale.name === scalePreset);
      if (foundScale) {
        setScale(foundScale);
      }
    }

    if(scalePreset !== undefined) 
      localStorage.setItem('scalePreset', scalePreset);

  }, [scalePreset]);


  const toggleInterval = (interval: Interval) => {

    if (scale.getIntervals().includes(interval)) {
      if (scale.getIntervals().length === 1)
        customScale.current = new Scale(customScale.current.name, scale.getIntervals());
      else {
        customScale.current = new Scale(customScale.current.name, scale.getIntervals().filter(i => i !== interval))
      }
    }
    else customScale.current = new Scale(customScale.current.name, [...scale.getIntervals(), interval])

    localStorage.setItem('scale', customScale.current.halftoneSteps.join(','));
    setScale(customScale.current);
    setScalePreset(customScale.current.name);
    setLevel(-1);
  };

  const setCustomRoot = (root: string) => {
    setLevel(-1);
    setRoot(root);
  };

  const setCustomDirection = (direction: Direction) => {
    setLevel(-1);
    setDirection(direction);
  };

  const setCustomMelodyLength = (melodyLength: number) => {
    setLevel(-1);
    setMelodyLength(melodyLength);
  };

  const setCustomScalePreset = (scalePreset: string) => {
    setLevel(-1);
    setScalePreset(scalePreset);
  };

  return {
    scale,
    root,
    scalePreset,
    direction,
    toggleInterval,
    setCustomRoot,
    setCustomScalePreset,
    setCustomDirection,
    customScale,
    melodyLength,
    setCustomMelodyLength,
    level,
    setLevel
  };
}
