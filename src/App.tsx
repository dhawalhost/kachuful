
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GameSetup from './components/screens/GameSetup';
import BiddingScreen from './components/screens/BiddingScreen';
import TricksEntry from './components/screens/TricksEntry';
import Scoreboard from './components/screens/Scoreboard';
import FinalResults from './components/screens/FinalResults';
import GameHistory from './components/screens/GameHistory';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameSetup />} />
        <Route path="/bidding" element={<BiddingScreen />} />
        <Route path="/tricks" element={<TricksEntry />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/results" element={<FinalResults />} />
        <Route path="/history" element={<GameHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

