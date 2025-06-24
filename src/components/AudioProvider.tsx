import type { ReactNode } from 'react';
import { AudioContext, useAudio } from '../utils/audio';

type AudioProviderProps = {
  children: ReactNode;
};

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audio = useAudio();

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
