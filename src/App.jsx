import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_STAGE_ID, getSessionDrillsForStage } from './data/lessons';
import Home from './components/Home.jsx';
import StageSelect from './components/StageSelect.jsx';
import TypingGame from './components/TypingGame.jsx';
import Results from './components/Results.jsx';
import './App.css';

export default function App() {
  const [view, setView] = useState('home');
  const [stageId, setStageId] = useState(DEFAULT_STAGE_ID);
  const [stats, setStats] = useState(null);
  const [playKey, setPlayKey] = useState(0);
  const [sessionChunkIndex, setSessionChunkIndex] = useState(0);

  const sessionDrills = useMemo(
    () => getSessionDrillsForStage(stageId, sessionChunkIndex),
    [stageId, sessionChunkIndex],
  );

  const goHome = useCallback(() => {
    setView('home');
    setStats(null);
  }, []);

  const goStages = useCallback(() => {
    setView('stages');
  }, []);

  const startFromHome = useCallback(() => {
    setView('stages');
  }, []);

  const pickStage = useCallback((id) => {
    setStageId(id);
    setSessionChunkIndex(0);
    setPlayKey((k) => k + 1);
    setView('play');
  }, []);

  const backToStages = useCallback(() => {
    setView('stages');
  }, []);

  const onSessionComplete = useCallback((s) => {
    setStats(s);
    setView('results');
  }, []);

  const repeatSession = useCallback(() => {
    setPlayKey((k) => k + 1);
    setStats(null);
    setView('play');
  }, []);

  const continueNextSession = useCallback(() => {
    setSessionChunkIndex((c) => c + 1);
    setPlayKey((k) => k + 1);
    setStats(null);
    setView('play');
  }, []);

  return (
    <div className="app">
      {view === 'home' && <Home onStart={startFromHome} />}
      {view === 'stages' && <StageSelect onPickStage={pickStage} onBack={goHome} />}
      {view === 'play' && (
        <TypingGame
          key={`${stageId}-${playKey}`}
          stageId={stageId}
          sessionChunkIndex={sessionChunkIndex}
          sessionDrills={sessionDrills}
          onComplete={onSessionComplete}
          onBack={backToStages}
        />
      )}
      {view === 'results' && stats && (
        <Results
          stats={stats}
          onContinue={continueNextSession}
          onRepeatSession={repeatSession}
          onHome={goHome}
        />
      )}
    </div>
  );
}
