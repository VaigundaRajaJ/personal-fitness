"use client";

import type { Exercise } from "@/lib/routine";

interface ExerciseSidebarProps {
  open: boolean;
  stage: string;
  entries: { index: number; item: Exercise }[];
  currentIndex: number;
  completed: Set<number>;
  onSelect: (index: number) => void;
  onClose: () => void;
}

/** Slide-in list of every exercise in the current section. */
export function ExerciseSidebar({
  open,
  stage,
  entries,
  currentIndex,
  completed,
  onSelect,
  onClose,
}: ExerciseSidebarProps) {
  return (
    <>
      <div className={`backdrop${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`sidebar${open ? " open" : ""}`} aria-hidden={!open} aria-label="Exercises in this section">
        <div className="sidebar-head">
          <div>
            <div className="eyebrow">{stage}</div>
            <div className="muted small">{entries.length} exercises</div>
          </div>
          <button className="btn ghost" onClick={onClose} aria-label="Close list">
            ✕
          </button>
        </div>
        <ul className="sidebar-list">
          {entries.map(({ index, item }) => (
            <li key={index}>
              <button
                className={`sidebar-item${index === currentIndex ? " current" : ""}`}
                onClick={() => onSelect(index)}
                tabIndex={open ? 0 : -1}
              >
                <span className="sidebar-check">{completed.has(index) ? "✓" : index === currentIndex ? "●" : "○"}</span>
                <span>
                  <b>{item.name}</b>
                  <small className="muted">
                    {item.kind === "timed" ? `${item.seconds} sec` : item.target}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
