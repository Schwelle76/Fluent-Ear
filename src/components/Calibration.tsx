import useNoteInput from "../hooks/useNoteInput";
import { Note } from "../models/Note";
import NoteInputPanel from "./NoteInputPanel"


interface CalibrationProps {
    noteInput: ReturnType<typeof useNoteInput>;
    onDone: (success: boolean) => void;
}

const Calibration : React.FC<CalibrationProps> = ({ noteInput, onDone }) => {
    return (
        <div style={{ fontSize: '2.5vh' }}>
            <div>
                <span>Sit in a <strong>quiet</strong> place and</span>
                <hr />
                <h3 style = {{marginTop: '0'}} >Adjust sensitivity so that ONLY the notes you play are shown!</h3>
            </div>

            <div style={{fontSize: '3.5vh'}}>
                <NoteInputPanel noteInput={noteInput} />
            </div>

            <div>
                <hr />
                <p><strong>lower the sensitivity</strong> if unplayed notes flash on the screen.<br />
                If played notes dont show on the screen <strong>increase the sensitivity</strong>.</p>
                <button onClick={() => onDone(true)}>Done</button>
            </div>
        </div>
    )
}


export default Calibration;