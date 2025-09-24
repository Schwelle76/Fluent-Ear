import { use, useEffect, useRef, useState } from "react";
import SoundfontService from "../services/SoundFontService";


export default function useAudioPlayer() {

    const audioPlayerRef = useRef<SoundfontService | null>(null);
    const [ready, setReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const notPlayingBufferTime = 300;
    const [voiceCount, setVoiceCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        audioPlayerRef.current = new SoundfontService();
        audioPlayerRef.current.load().then(() => {
            if (isMounted) {
                setReady(true);
            }
        });

        return () => {
            isMounted = false;
            setReady(false);
            audioPlayerRef.current?.destroy();
            audioPlayerRef.current = null;
        };
    }, []);

    useEffect(() => {

        let timerId = 0;

        if (voiceCount > 0)
            setIsPlaying(true);
        else
            timerId = setTimeout(() => {
                if (voiceCount <= 0)
                    setIsPlaying(false);
            }, notPlayingBufferTime);

        return () => {
            clearTimeout(timerId);
        }
    }, [voiceCount]);

    const play = async (notes: string | string[], duration: number = 0.5, release: number = 0.1): Promise<boolean> => {

        if (audioPlayerRef.current === null) return false;

        setVoiceCount((voiceCount) => {
            return voiceCount + 1
        }
        );
        setIsPlaying(true);

        return new Promise<boolean>((resolve) => {

            if (audioPlayerRef.current === null) return resolve(false);

            audioPlayerRef.current.play(notes, duration, release).then((success) => {

                setVoiceCount((voiceCount) => {
                    const newVoiceCount = Math.max(voiceCount - 1, 0);
                    return newVoiceCount;
                });

                return resolve(success);
            });
        });
    }

    return {
        ready,
        play,
        isPlaying
    }
}