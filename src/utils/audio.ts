import { useState } from 'react';
import React from 'react';

export const sounds = {
    turnStart: '/sounds/turn-start.mp3',
    correct: '/sounds/correct.mp3',
    incorrect: '/sounds/incorrect.mp3',
    timeout: '/sounds/timeout.mp3',
    victory: '/sounds/victory.mp3'
} as const;

export type SoundType = keyof typeof sounds;

export const useAudio = () => {
    const [audioEnabled, setAudioEnabled] = useState(true);

    const playSound = (soundType: SoundType) => {
        if (!audioEnabled) return;

        const audio = new Audio(sounds[soundType]);
        audio.play().catch(error => {
            console.error('Error al reproducir sonido:', error);
        });
    };

    const toggleAudio = () => {
        setAudioEnabled(prev => !prev);
    };

    return {
        audioEnabled,
        toggleAudio,
        playSound
    };
};

export const AudioContext = React.createContext({
    audioEnabled: true,
    toggleAudio: () => {},
    playSound: (soundType: SoundType) => {}
});
