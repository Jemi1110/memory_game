import { useState, useCallback, createContext } from 'react';
import useSound from 'use-sound';

// Sound files - make sure these files exist in your public/sounds directory
const soundMap = {
  turnStart: '/sounds/turn-start.mp3',
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  timeout: '/sounds/timeout.mp3',
  victory: '/sounds/victory.mp3'
} as const;

type SoundType = keyof typeof soundMap;

export const useAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume] = useState(0.5);

  const [playTurnStart] = useSound(soundMap.turnStart, { volume, soundEnabled: audioEnabled });
  const [playCorrect] = useSound(soundMap.correct, { volume, soundEnabled: audioEnabled });
  const [playIncorrect] = useSound(soundMap.incorrect, { volume, soundEnabled: audioEnabled });
  const [playTimeout] = useSound(soundMap.timeout, { volume, soundEnabled: audioEnabled });
  const [playVictory] = useSound(soundMap.victory, { volume, soundEnabled: audioEnabled });

  const playSound = useCallback((soundType: SoundType) => {
    if (!audioEnabled) return;

    switch (soundType) {
      case 'turnStart':
        playTurnStart();
        break;
      case 'correct':
        playCorrect();
        break;
      case 'incorrect':
        playIncorrect();
        break;
      case 'timeout':
        playTimeout();
        break;
      case 'victory':
        playVictory();
        break;
      default:
        console.warn('Unknown sound type:', soundType);
    }
  }, [audioEnabled, playTurnStart, playCorrect, playIncorrect, playTimeout, playVictory]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  return { 
    playSound, 
    audioEnabled, 
    toggleAudio
  };
};

type AudioContextType = {
  audioEnabled: boolean;
  toggleAudio: () => void;
  playSound: (soundType: SoundType) => void;
};

export const AudioContext = createContext<AudioContextType>({
  audioEnabled: true,
  toggleAudio: () => {},
  playSound: () => {}
});

export type { SoundType };
