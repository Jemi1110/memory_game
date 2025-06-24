import './index.css'
import Router from './routes/Router'
import { AudioContext } from './utils/audio';

function App() {
  return (
    <AudioContext.Provider value={{
      audioEnabled: true,
      toggleAudio: () => {},
      playSound: (soundType: 'turnStart' | 'correct' | 'incorrect' | 'timeout' | 'victory') => {
        // Aquí podríamos implementar la lógica de reproducción de sonidos
        console.log(`Playing sound: ${soundType}`);
      }
    }}>
      <Router/>
    </AudioContext.Provider>
  )
}

export default App
