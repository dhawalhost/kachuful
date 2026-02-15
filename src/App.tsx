
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GameSetup from './components/screens/GameSetup';
import BiddingScreen from './components/screens/BiddingScreen';
import TricksEntry from './components/screens/TricksEntry';
import Scoreboard from './components/screens/Scoreboard';
import FinalResults from './components/screens/FinalResults';
import GameHistory from './components/screens/GameHistory';
import './index.css';

import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

function App() {
  useEffect(() => {
    // Platform-specific initialization
    if (Capacitor.isNativePlatform()) {
      const initNativeFeatures = async () => {
        try {
          // Status Bar: Transparent and Overlay
          await StatusBar.setStyle({ style: Style.Dark });
          if (Capacitor.getPlatform() === 'android') {
            await StatusBar.setOverlaysWebView({ overlay: true });
            await StatusBar.setBackgroundColor({ color: 'transparent' });
          }

          // Keyboard: Resize webview
          await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
        } catch (e) {
          console.error('Error initializing native features:', e);
        }
      };

      initNativeFeatures();
    }
  }, []);

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

