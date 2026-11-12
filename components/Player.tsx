"use client";

import { useEffect, useRef, useState } from "react";
import { ExerciseSidebar } from "@/components/ExerciseSidebar";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import type { Exercise } from "@/lib/routine";
import { formatClock } from "@/lib/time";

interface PlayerProps {
  items: Exercise[];
  title: string;
  onExit: () => void;
  onFinish: (minutes: number) => void;
}

export function Player({ items, title, onExit, onFinish }: PlayerProps) {
  const session = useWorkoutSession(items);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // In-page confirm box: browser confirm() popups can be blocked, which made Exit do nothing.
  const [confirmingExit, setConfirmingExit] = useState(false);
  const stageBarRef = useRef<HTMLDivElement>(null);

  // Keep the current section's tab visible inside the scrolling row.
  useEffect(() => {
    stageBarRef.current
      ?.querySelector(".chip.active")
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [session.item.stage]);
  const { item, index } = session;

  const stages = items
    .map((entry) => entry.stage)
    .filter((stage, position, all) => all.indexOf(stage) === position);
  const sectionEntries = items
    .map((entry, entryIndex) => ({ index: entryIndex, item: entry }))
    .filter((entry) => entry.item.stage === item.stage);

  const handleSelectFromSidebar = (targetIndex: number) => {
    session.jumpTo(targetIndex);
    // On a phone the list covers the screen, so close it after choosing.
    if (window.matchMedia("(max-width: 720px)").matches) setSidebarOpen(false);
  };

  const finishMinutes =() => Math.max(1, Math.round(session.activeMs / 60000));


  const handleNext = () => {
    if (session.isLast) onFinish(finishMinutes());
    else session.next();
  };

  const nextName = session.isLast ? "Finish" : items[index + 1].name;

  return (
    <div className="player">
      <div className="player-top">
        <button className="btn ghost" onClick={() => setConfirmingExit(true)}>
          ← Exit
        </button>
        <div className="session-clock" aria-label="Total workout time">
          <span className="label">TOTAL TIME</span>
          <strong>{formatClock(session.activeMs)}</strong>
        </div>
        <button className="btn ghost" onClick={session.togglePause}>
          {session.paused ? "▶ Resume" : "Ⅱ Pause"}
        </button>
      </div>

      <div className="stage-bar" ref={stageBarRef}>
        <button className="chip list-chip" onClick={() => setSidebarOpen(true)}>
          ☰ Exercises
        </button>
        {stages.map((stage) => (
          <button
            key={stage}
            className={`chip${stage === item.stage ? " active" : ""}`}
            onClick={() => session.jumpTo(items.findIndex((entry) => entry.stage === stage))}
          >
            {stage}
          </button>
        ))}
      </div>

      {confirmingExit ? (
        <div className="modal-backdrop" onClick={() => setConfirmingExit(false)}>
          <div className="modal card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>Exit this workout?</h3>
            <p className="muted">Your progress for this session will not be saved.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmingExit(false)}>
                Keep going
              </button>
              <button className="btn primary" onClick={onExit}>
                Exit workout
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ExerciseSidebar
        open={sidebarOpen}
        stage={item.stage}
        entries={sectionEntries}
        currentIndex={index}
        completed={session.completed}
        onSelect={handleSelectFromSidebar}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="muted small">
        {title} · ITEM {index + 1} OF {items.length}
      </div>
      <div className="progress">
        <i style={{ width: `${(session.completed.size / items.length) * 100}%` }} />
      </div>

      <article className="card player-card">
        <div className="eyebrow">
          {item.stage}
          {session.completed.has(index) ? " · ✓ DONE" : ""}
        </div>
        <h2>{item.name}</h2>
        <p className="muted">{item.desc}</p>

        {item.kind === "timed" ? (
          <>
            <div className="ring-wrap">
              <div
                className="ring"
                style={{ "--pct": `${session.timedProgress * 100}%` } as React.CSSProperties}
              >
                <div className="ring-inner">
                  <div className="ring-value">{formatClock(session.timedRemainingMs + 999)}</div>
                  <div className="label">
                    {session.timerFinished ? "DONE ✓" : session.timerStarted ? "REMAINING" : "READY"}
                  </div>
                </div>
              </div>
            </div>
            <div className="controls">
              {session.timerStarted ? (
                <button className="btn" onClick={session.resetTimer}>
                  ↺ Restart
                </button>
              ) : (
                <button className="btn primary big" onClick={session.startTimer}>
                  ▶ Start
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="repbox">
              <div className="label">{item.kind === "sets" ? `SET ${session.currentSet} OF ${session.totalSets}` : "TARGET"}</div>
              <strong>{item.target}</strong>
            </div>
            {session.resting ? (
              <div className="rest">
                <div className="eyebrow">REST</div>
                <strong>{formatClock(session.restRemainingMs + 999)}</strong>
                <div className="muted small">
                  {session.restFinished ? "Rest done. Start the next set." : "Breathe and recover."}
                </div>
                <button className="btn" onClick={session.skipRest}>
                  Skip rest
                </button>
              </div>
            ) : null}
            {item.kind === "sets" ? (
              <div className="controls">
                {session.setsFinished ? (
                  <span className="muted">All sets done ✓</span>
                ) : (
                  <button className="btn" onClick={session.completeSet}>
                    ✓ Set {session.currentSet} done
                  </button>
                )}
              </div>
            ) : null}
          </>
        )}

        <div className="player-meta">
          <span>Previous: {index > 0 ? items[index - 1].name : "—"}</span>
          <span>Next: {nextName}</span>
        </div>

      </article>

      <div className="player-nav">
        <button className="btn" onClick={session.previous} disabled={index === 0}>
          ← Previous
        </button>
        <button
          className={`btn${item.kind === "timed" && session.timerFinished ? " primary" : ""}`}
          onClick={handleNext}
        >
          {session.isLast ? "Finish workout ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}
