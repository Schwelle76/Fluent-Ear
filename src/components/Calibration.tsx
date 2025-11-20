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
                <h2 >Adjust sensitivity so that ONLY the notes you play are shown!</h2>
                <hr />
                <br />
            </div>

            <div style={{fontSize: '3.5vh'}}>
                <NoteInputPanel noteInput={noteInput} />
            </div>

            <div>
                <br />
                <hr />
                <p>If unplayed notes flash on the screen, lower the sensitivity.</p>
                <button onClick={() => onDone(true)}>Done</button>
            </div>
        </div>
    )
}


export default Calibration;