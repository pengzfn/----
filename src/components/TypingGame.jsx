import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SESSION_SIZE, getStage } from '../data/lessons';
import './TypingGame.css';

const EXERCISE_GAP_MS = 300;

/**
 * @param {object} props
 * @param {string} props.stageId
 * @param {string[]} props.sessionDrills 当前 session 的练习文本（固定条数）
 * @param {(stats: {
 *   timeUsedSec: number;
 *   accuracy: number;
 *   wpm: number;
 *   stageId: string;
 *   sessionChunkIndex: number;
 * }) => void} props.onComplete
 * @param {() => void} props.onBack
 * @param {number} props.sessionChunkIndex
 */
export default function TypingGame({ stageId, sessionDrills, sessionChunkIndex, onComplete, onBack }) {
  const stage = useMemo(() => getStage(stageId), [stageId]);
  const [sessionExerciseIndex, setSessionExerciseIndex] = useState(0);

  const text = sessionDrills[sessionExerciseIndex] ?? '';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorFlash, setErrorFlash] = useState(false);
  const [passageBump, setPassageBump] = useState(false);
  const [correctKeys, setCorrectKeys] = useState(0);
  const [wrongKeys, setWrongKeys] = useState(0);
  const startTimeRef = useRef(null);
  const inputRef = useRef(null);
  const errorTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const sessionWallStartRef = useRef(null);
  const exerciseStatsRef = useRef(/** @type {{ timeUsedSec: number; accuracy: number; wpm: number }[]} */ ([]));
  const skipPassageBumpRef = useRef(true);

  const resetExerciseState = useCallback(() => {
    setCurrentIndex(0);
    setCorrectKeys(0);
    setWrongKeys(0);
    setErrorFlash(false);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    setSessionExerciseIndex(0);
    exerciseStatsRef.current = [];
    sessionWallStartRef.current = null;
  }, [stageId, sessionChunkIndex]);

  useEffect(() => {
    resetExerciseState();
  }, [stageId, sessionChunkIndex, sessionExerciseIndex, resetExerciseState]);

  useEffect(() => {
    if (skipPassageBumpRef.current) {
      skipPassageBumpRef.current = false;
      return;
    }
    setPassageBump(true);
    const t = setTimeout(() => setPassageBump(false), 220);
    return () => clearTimeout(t);
  }, [sessionExerciseIndex]);

  const finishedLine = text.length > 0 && currentIndex >= text.length;

  const finishSessionWithStats = useCallback(
    (lastExerciseStats) => {
      const list = [...exerciseStatsRef.current, lastExerciseStats];
      exerciseStatsRef.current = list;
      const wallStart = sessionWallStartRef.current ?? Date.now();
      const wallEnd = Date.now();
      const timeUsedSec = Math.max((wallEnd - wallStart) / 1000, 0.01);
      const avgAccuracy =
        list.length > 0 ? list.reduce((s, x) => s + x.accuracy, 0) / list.length : 100;
      const avgWpm = list.length > 0 ? list.reduce((s, x) => s + x.wpm, 0) / list.length : 0;
      onComplete({
        timeUsedSec,
        accuracy: avgAccuracy,
        wpm: avgWpm,
        stageId,
        sessionChunkIndex,
      });
    },
    [onComplete, stageId, sessionChunkIndex],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!text.length || finishedLine) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentIndex > 0) {
          const next = currentIndex - 1;
          setCurrentIndex(next);
          setCorrectKeys(next);
        }
        return;
      }

      if (e.key.length !== 1 && e.key !== ' ') return;
      e.preventDefault();

      const expected = text[currentIndex];
      const pressed = e.key === ' ' ? ' ' : e.key;

      if (!sessionWallStartRef.current) {
        sessionWallStartRef.current = Date.now();
      }
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      if (pressed === expected) {
        const nextCorrect = correctKeys + 1;
        const nextIndex = currentIndex + 1;
        setCorrectKeys(nextCorrect);
        setCurrentIndex(nextIndex);
        setErrorFlash(false);

        if (nextIndex >= text.length) {
          const end = Date.now();
          const start = startTimeRef.current ?? end;
          const timeUsedSec = Math.max((end - start) / 1000, 0.01);
          const total = nextCorrect + wrongKeys;
          const accuracy = total > 0 ? (nextCorrect / total) * 100 : 100;
          const minutes = timeUsedSec / 60;
          const wpm = minutes > 0 ? (text.length / 5) / minutes : 0;
          const exerciseStat = { timeUsedSec, accuracy, wpm };

          if (sessionExerciseIndex < SESSION_SIZE - 1) {
            exerciseStatsRef.current = [...exerciseStatsRef.current, exerciseStat];
            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
              transitionTimerRef.current = null;
              setSessionExerciseIndex((i) => i + 1);
            }, EXERCISE_GAP_MS);
          } else {
            finishSessionWithStats(exerciseStat);
          }
        }
      } else {
        setWrongKeys((w) => w + 1);
        setErrorFlash(true);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setErrorFlash(false), 120);
      }
    },
    [
      text,
      finishedLine,
      currentIndex,
      correctKeys,
      wrongKeys,
      sessionExerciseIndex,
      finishSessionWithStats,
    ],
  );

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [sessionExerciseIndex, text]);

  const progress = text.length > 0 ? (currentIndex / text.length) * 100 : 0;

  const repeatExercise = useCallback(() => {
    resetExerciseState();
    inputRef.current?.focus();
  }, [resetExerciseState]);

  const stageTitle = stage?.title ?? 'Practice';
  const sessionLabel = `${Math.min(sessionExerciseIndex + 1, SESSION_SIZE)} / ${SESSION_SIZE}`;

  const passageClass =
    'typing-game__passage' + (passageBump ? ' typing-game__passage--bump' : '');

  return (
    <div className="typing-game">
      <header className="typing-game__header">
        <button type="button" className="btn btn--ghost typing-game__back" onClick={onBack}>
          ← Stages
        </button>
        <h1 className="typing-game__stage-title">{stageTitle}</h1>
      </header>

      <div className="typing-game__session-row" aria-live="polite">
        <span className="typing-game__session-label">Session Progress</span>
        <span className="typing-game__session-num">
          Exercise {sessionLabel}
        </span>
      </div>

      <div className="typing-game__key-hint" role="note">
        {stage?.keyHint ?? ''}
      </div>

      <div className="typing-game__bar">
        <div className="typing-game__progress-wrap">
          <span className="typing-game__progress-label">Progress</span>
          <div className="typing-game__progress-track" aria-hidden>
            <div className="typing-game__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="typing-game__progress-num">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="typing-game__actions">
        <button type="button" className="btn btn--ghost typing-game__action-btn" onClick={repeatExercise}>
          Repeat
        </button>
      </div>

      <p className="typing-game__tip">Green is correct. Red means try again. Click the text box to focus.</p>

      <div
        className={passageClass}
        role="textbox"
        aria-label="Typing exercise"
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
      >
        {text.split('').map((ch, i) => {
          let cls = 'typing-game__ch typing-game__ch--todo';
          if (i < currentIndex) {
            cls = 'typing-game__ch typing-game__ch--ok';
          } else if (i === currentIndex) {
            cls = 'typing-game__ch typing-game__ch--cur';
            if (errorFlash) cls += ' typing-game__ch--bad';
          }
          const display = ch === ' ' ? '\u00a0' : ch;
          return (
            <span key={`${sessionExerciseIndex}-${i}-${ch}`} className={cls}>
              {display}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        className="typing-game__hidden-input"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-hidden
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
