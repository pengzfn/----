import { STAGES } from '../data/lessons';
import './Results.css';

function pickEncouragement(accuracy) {
  if (accuracy >= 98) return 'Amazing! You are a typing star!';
  if (accuracy >= 90) return 'Great job! Keep practicing!';
  if (accuracy >= 80) return 'Nice work! A little more practice and you will shine!';
  return 'Good try! Slow down and watch each key — you can do it!';
}

/**
 * @param {object} props
 * @param {{
 *   timeUsedSec: number;
 *   accuracy: number;
 *   wpm: number;
 *   stageId: string;
 *   sessionChunkIndex: number;
 * }} props.stats
 * @param {() => void} props.onContinue
 * @param {() => void} props.onRepeatSession
 * @param {() => void} props.onHome
 */
export default function Results({ stats, onContinue, onRepeatSession, onHome }) {
  const stage = STAGES[stats.stageId];
  const stageTitle = stage?.title ?? stats.stageId;
  const encouragement = pickEncouragement(stats.accuracy);

  return (
    <div className="results">
      <div className="results__card">
        <h2 className="results__title">Well done!</h2>
        <p className="results__stage">
          Stage: <strong>{stageTitle}</strong>
        </p>

        <ul className="results__stats">
          <li className="results__row">
            <span className="results__label">Total Time</span>
            <span className="results__value">{stats.timeUsedSec.toFixed(1)} s</span>
          </li>
          <li className="results__row">
            <span className="results__label">Avg Accuracy</span>
            <span className="results__value">{stats.accuracy.toFixed(1)}%</span>
          </li>
          <li className="results__row">
            <span className="results__label">Avg WPM</span>
            <span className="results__value">{stats.wpm.toFixed(1)}</span>
          </li>
        </ul>

        <p className="results__encourage">{encouragement}</p>

        <div className="results__actions">
          <button type="button" className="btn btn--primary results__btn" onClick={onContinue}>
            Continue
          </button>
          <button type="button" className="btn btn--ghost results__btn" onClick={onRepeatSession}>
            Repeat Session
          </button>
          <button type="button" className="btn btn--ghost results__btn" onClick={onHome}>
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
