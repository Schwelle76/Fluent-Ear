import React from 'react';
import styles from './EntryPage.module.css';
import { useNavigate } from 'react-router';
import TitleText from '../TitleText';


const EntryPage: React.FC = () => {

  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {

    navigate(`/#${sectionId}`);
    // 1. Element direkt über seine ID im DOM finden
    const targetSection = document.getElementById(sectionId);

    // 2. Prüfen, ob das Element existiert (wichtig!)
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (

    <div>
      <section className={styles.entryPage}>

        <div className={styles.titleTextContainer}>
          <TitleText />
        </div>


        <div className={styles.navigationButtonContainer}>
          <button className={`${styles.navigationButton} ${styles.startButton}`} onClick={() => navigate('/training')}>Start</button>
          <button className={`${styles.navigationButton} ${styles.aboutButton}`} onClick={() => scrollToSection('about')}>About</button>
        </div>

      </section>
      <section id="about" className={styles.aboutPage}>
        <h1>About</h1>

        <p>
          <strong>Fluent Ear</strong> is an ear training web app for musicians that takes input directly from your instrument through the microphone.
          Instead of clicking UI buttons, you play the requested note or interval on your instrument — training your ability to play what you hear and thus play what you imagine just like speaking a language fluently.
          <br /><br />
          For those who don't have their instrument on hand, UI buttons are still available, making it possible to practice in the train or in the waiting room.
        </p>

        <hr />

        <h2>Features</h2>
        <ul>
          <li><strong>Ear training</strong> – learn to detect musical intervals and play them right away</li>
          <li><strong>Microphone input</strong> – practice on your instrument using the microphone of your device</li>
          <li><strong>Customizable training</strong> – choose your own intervals, scales, and root notes as well as the direction of the intervals</li>
          <li><strong>Responsive & lightweight</strong> – runs directly in your browser on both mobile and desktop devices - no installation needed.</li>
        </ul>

        <hr />

        <h2>Acknowledgements</h2>
        <p>This project would not be possible without the excellent work of the open-source community. Special thanks go to:</p>
        <ul>
          <li>
            <strong>Chris Wilson</strong> for the original
            <a href="https://github.com/cwilso/PitchDetect"> PitchDetect code</a>, which is the foundation of the microphone pitch detection in this app.
          </li>
          <li>
            <strong>Benjamin Gleitzman</strong> for providing a simple way to integrate <strong>FluidR3, Musyng Kites and FatBoys</strong> high quality samples through the
            <a href="https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages"> midi-js-soundfonts project</a>.
          </li>
        </ul>


        <p>This application uses sound fonts from the midi-js-soundfonts project (licensed under MIT), which contains the following sound fonts:</p>
        <ul>
          <li>FluidR3_GM.sf2, licensed under CC BY 3.0.</li>
          <li>Musyng Kite, licensed under CC BY-SA 3.0.</li>
          <li>FatBoy, licensed under CC BY-SA 3.0.</li>
        </ul>
      </section>

      <section className={styles.footer}></section>



    </div>
  );
};

export default EntryPage;
