import styles from './CircledCharacter.module.css';

interface CircledCharacterProps {
    character: string;

}

const CircledCharacter: React.FC<CircledCharacterProps> = ({ character}) => {



    return (
        <div className={styles.characterContainer}>
            <span className={styles.character}>{character ? character : " "}</span>
        </div>
    )
}

export default CircledCharacter;