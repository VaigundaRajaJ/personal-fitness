"use client";

import { useMemo } from "react";
import { buildSession, estimateMinutes, WORKOUTS } from "@/lib/routine";
import type { SessionRecord } from "@/lib/history";
import { startOfWeek, weekdayIndex } from "@/lib/time";

interface HomeProps {
  selectedDay: number;
  todayIndex: number;
  history: SessionRecord[];
  onSelectDay: (dayIndex: number) => void;
  onStart: () => void;
}

export function Home({ selectedDay, todayIndex, history, onSelectDay, onStart }: HomeProps) {
  const workout = WORKOUTS[selectedDay];
  const items = useMemo(() => buildSession(workout), [workout]);

  const { doneDays, weekMinutes } = useMemo(() => {
    const weekStart = startOfWeek(new Date()).getTime();
    const done = new Set<number>();
    let minutes = 0;
    for (const record of history) {
      const finishedAt = new Date(record.date);
      if (finishedAt.getTime() >= weekStart) {
        done.add(weekdayIndex(finishedAt));
        minutes += record.minutes;
      }
    }
    return { doneDays: done, weekMinutes: minutes };
  }, [history]);

  return (
    <div className="home">
      <article className="card today">
        <div className="eyebrow">{selectedDay === todayIndex ? "TODAY'S WORKOUT" : `${workout.day.toUpperCase()} WORKOUT`}</div>
        <h2>{workout.title}</h2>
        <p className="muted">{workout.summary}</p>
        <div className="stats">
          <div>
            <strong>~{estimateMinutes(items)} min</strong>
            <span>Estimated time</span>
          </div>
          <div>
            <strong>{items.length}</strong>
            <span>Exercises</span>
          </div>
          <div>
            <strong>{workout.focus}</strong>
            <span>Main focus</span>
          </div>
        </div>
        <button className="btn primary big" onClick={onStart}>
          ▶ Start workout
        </button>
        <p className="muted small">Starts with the warm-up: March in Place, with the timer running.</p>
      </article>

      <article className="card">
        <div className="section-head">
          <h3>This week</h3>
          <span className="muted small">
            {doneDays.size} / 7 done · {weekMinutes} min
          </span>
        </div>
        <div className="week">
          {WORKOUTS.map((day, dayIndex) => (
            <button
              key={day.day}
              className={`day${dayIndex === selectedDay ? " active" : ""}${doneDays.has(dayIndex) ? " done" : ""}`}
              onClick={() => onSelectDay(dayIndex)}
            >
              <small>{day.shortDay}</small>
              <strong>{doneDays.has(dayIndex) ? "✓" : day.focus.slice(0, 3)}</strong>
              {dayIndex === todayIndex ? <small>today</small> : <small>&nbsp;</small>}
            </button>
          ))}
        </div>
      </article>

      <article className="card">
        <div className="section-head">
          <h3>Plan for {workout.day}</h3>
        </div>
        <ol className="plan">
          <li>
            <b>Warm-up</b> <span className="muted">16 movements</span>
          </li>
          <li>
            <b>Main</b> <span className="muted">{workout.main.length} items</span>
          </li>
          <li>
            <b>Cool-down</b> <span className="muted">12 movements</span>
          </li>
        </ol>
        <p className="muted small">
          Sitting a lot? Every 45–60 minutes, stand up for 2–5 minutes: walk, roll your shoulders, move your wrists.
        </p>
      </article>
    </div>
  );
}
