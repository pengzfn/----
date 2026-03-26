import { useState } from 'react';
import { DEFAULT_STAGE_ID, STAGE_ORDER, STAGES } from '../data/lessons';
import './StageSelect.css';

export default function StageSelect({ onPickStage, onBack }) {
  const [selectedId, setSelectedId] = useState(DEFAULT_STAGE_ID);

  return (
    <div className="stage-select">
      <div className="stage-select__inner">
        <h2 className="stage-select__title">Choose a practice stage</h2>
        <p className="stage-select__intro">
          Beginners start with <strong>Step 1: Home Row</strong>. Steps 5–6 are for later.
        </p>
        <div className="stage-select__grid">
          {STAGE_ORDER.map((id) => {
            const S = STAGES[id];
            const selected = selectedId === id;
            return (
              <button
                key={id}
                type="button"
                className={
                  'stage-select__btn' +
                  (selected ? ' stage-select__btn--selected' : '') +
                  (S.laterStage ? ' stage-select__btn--later' : '')
                }
                onClick={() => setSelectedId(id)}
              >
                <span className="stage-select__label-row">
                  <span className="stage-select__label">{S.title}</span>
                  {S.laterStage && (
                    <span className="stage-select__badge" title="Practice after finger basics">
                      Later stage
                    </span>
                  )}
                </span>
                <span className="stage-select__desc">{S.description}</span>
              </button>
            );
          })}
        </div>
        <div className="stage-select__actions">
          <button
            type="button"
            className="btn btn--primary stage-select__start"
            onClick={() => onPickStage(selectedId)}
          >
            Start Practice
          </button>
          <button type="button" className="btn btn--ghost stage-select__back" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
