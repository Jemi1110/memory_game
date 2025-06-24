import Button from './ui/Button';
import { SpeakerWaveIcon as VolumeUpIcon, SpeakerXMarkIcon as VolumeOffIcon } from '@heroicons/react/24/outline';
import { useAudio } from '../utils/audio';

export const SoundToggle = () => {
  const { audioEnabled, toggleAudio } = useAudio();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleAudio}
      aria-label={audioEnabled ? 'Mute sound' : 'Unmute sound'}
      className="fixed top-4 right-4 z-50 text-gray-700 hover:text-amber-600 transition-colors w-10 h-10 p-0 flex items-center justify-center"
    >
      {audioEnabled ? (
        <VolumeUpIcon className="w-6 h-6" />
      ) : (
        <VolumeOffIcon className="w-6 h-6" />
      )}
    </Button>
  );
};
