import './index.css';
import Router from './routes/Router';
import { AudioProvider } from './components/AudioProvider';
import { SoundToggle } from './components/SoundToggle';

function App() {
  return (
    <AudioProvider>
      <div className="relative min-h-screen">
        <SoundToggle />
        <Router />
      </div>
    </AudioProvider>
  );
}

export default App;
