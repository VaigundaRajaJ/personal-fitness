"use client";

import { useState, useSyncExternalStore } from "react";
import { HistoryView } from "@/components/HistoryView";
import { Home } from "@/components/Home";
import { Player } from "@/components/Player";
import { unlockAudio } from "@/lib/feedback";
import { addSessionRecord, useHistory } from "@/lib/history";
import { buildSession, WORKOUTS } from "@/lib/routine";
import { weekdayIndex } from "@/lib/time";

type Tab = "today" | "history";

const noopSubscribe = () => () => {};

export default function Page() {
  // False on the server and true in the browser, so date-based UI never mismatches.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const history = useHistory();

  const [tab, setTab] = useState<Tab>("today");
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finishedSummary, setFinishedSummary] = useState<string | null>(null);

  if (!hydrated) return <main className="app" />;

  const todayIndex = weekdayIndex(new Date());
  const selectedDay = pickedDay ?? todayIndex;
  const workout = WORKOUTS[selectedDay];

  if (playing) {
    return (
      <main className="app player-app">
        <Player
          items={buildSession(workout)}
          title={workout.title}
          onExit={() => setPlaying(false)}
          onFinish={(minutes) => {
            addSessionRecord(workout.title, minutes);
            setFinishedSummary(`${workout.title} · ${minutes} min`);
            setPlaying(false);
          }}
        />
      </main>
    );
  }

  if (finishedSummary) {
    return (
      <main className="app">
        <article className="card session-complete">
          <div className="check">✓</div>
          <div className="eyebrow">SESSION COMPLETE</div>
          <h1>You showed up.</h1>
          <p className="muted">{finishedSummary}. Saved on this device.</p>
          <button className="btn primary big" onClick={() => setFinishedSummary(null)}>
            Back to home
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="top">
        <div className="brand">
          <span className="mark">P</span> Personal Fitness
        </div>
        <span className="muted small">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </span>
      </header>

      <nav className="tabs">
        <button className={`tab${tab === "today" ? " active" : ""}`} onClick={() => setTab("today")}>
          Today
        </button>
        <button className={`tab${tab === "history" ? " active" : ""}`} onClick={() => setTab("history")}>
          History
        </button>
      </nav>

      {tab === "today" ? (
        <Home
          selectedDay={selectedDay}
          todayIndex={todayIndex}
          history={history}
          onSelectDay={setPickedDay}
          onStart={() => {
            unlockAudio();
            setPlaying(true);
          }}
        />
      ) : (
        <HistoryView history={history} />
      )}
    </main>
  );
}
