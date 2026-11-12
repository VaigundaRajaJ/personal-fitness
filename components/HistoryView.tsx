"use client";

import { useState } from "react";
import { clearHistory, type SessionRecord } from "@/lib/history";

interface HistoryViewProps {
  history: SessionRecord[];
}

export function HistoryView({ history }: HistoryViewProps) {
  const totalMinutes = history.reduce((sum, record) => sum + record.minutes, 0);

  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleClear = () => {
    clearHistory();
    setConfirmingClear(false);
  };

  return (
    <article className="card">
      <div className="section-head">
        <h3>Workout history</h3>
        <span className="muted small">
          {history.length} sessions · {totalMinutes} min
        </span>
      </div>
      {history.length === 0 ? (
        <p className="muted">Finish a workout and it will show here.</p>
      ) : (
        <ul className="history">
          {history.slice(0, 60).map((record) => (
            <li key={record.id}>
              <div>
                <b>{record.title}</b>
                <div className="muted small">
                  {new Date(record.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <b>{record.minutes} min</b>
            </li>
          ))}
        </ul>
      )}
      {history.length > 0 ? (
        confirmingClear ? (
          <div className="modal-actions">
            <button className="btn" onClick={() => setConfirmingClear(false)}>
              Cancel
            </button>
            <button className="btn danger" onClick={handleClear}>
              Yes, delete all
            </button>
          </div>
        ) : (
          <button className="btn danger" onClick={() => setConfirmingClear(true)}>
            Clear history
          </button>
        )
      ) : null}
    </article>
  );
}
