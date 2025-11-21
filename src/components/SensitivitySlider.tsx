import React from 'react';
import './SensitivitySlider.css';
import useNoteInput from '../hooks/useNoteInput';

interface SensitivitySliderProps {
  noteInput : ReturnType<typeof useNoteInput>;
}

const SensitivitySlider: React.FC<SensitivitySliderProps> = ({noteInput }) => {



  return (
    <div className="sensitivity-slider-container">
      <input
        type="range"
        min= {noteInput.MIN_SENSITIVITY}
        max= {noteInput.MAX_SENSITIVITY}
        value={noteInput.sensitivity}
        onChange={(e) => noteInput.setSensitivity(parseInt(e.target.value))}
        className="sensitivity-slider"
      />
      <p className="sensitivity-label">Microphone sensitivity: {noteInput.sensitivity}</p>
    </div>
  );
};

export default SensitivitySlider;
