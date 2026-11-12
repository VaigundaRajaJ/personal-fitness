"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beep } from "@/lib/feedback";
import { REST_SECONDS, type Exercise } from "@/lib/routine";

const TICK_MS = 250;

/**
 * Runs one workout. All times come from one "active time" counter that only
 * grows while the session is not paused, so pause stops everything together.
 * The counter adds real elapsed time each tick, so it stays correct even if
 * the browser slows the tab down.
 */
export function useWorkoutSession(items: Exercise[]) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeMs, setActiveMs] = useState(0);
  // Active time when this exercise's timer was started; null = not started yet.
  const [itemStartMs, setItemStartMs] = useState<number | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [restStartMs, setRestStartMs] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());

  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let lastTick = Date.now();
    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTick;
      lastTick = now;
      if (!pausedRef.current) setActiveMs((total) => total + elapsed);
    }, TICK_MS);
    return () => clearInterval(intervalId);
  }, []);

  // Keep the phone screen on during the workout (if the browser allows it).
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const requestLock = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        // Not supported or denied: fine.
      }
    };
    void requestLock();
    const onVisible = () => {
      if (document.visibilityState === "visible") void requestLock();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, []);

  const item = items[index];
  const isTimed = item.kind === "timed";
  const totalSets = item.kind === "sets" ? (item.sets ?? 1) : 1;

  const timedTotalMs = isTimed ? (item.seconds ?? 0) * 1000 : 0;
  const timerStarted = itemStartMs !== null;
  const timedRemainingMs = !isTimed
    ? 0
    : timerStarted
      ? Math.max(0, timedTotalMs - (activeMs - itemStartMs))
      : timedTotalMs;
  const timerFinished = isTimed && timerStarted && timedRemainingMs === 0;
  const timedProgress = timedTotalMs > 0 ? 1 - timedRemainingMs / timedTotalMs : 0;

  const resting = restStartMs !== null;
  const restRemainingMs = resting ? Math.max(0, REST_SECONDS * 1000 - (activeMs - restStartMs)) : 0;
  const restFinished = resting && restRemainingMs === 0;

  useEffect(() => {
    if (timerFinished || restFinished) beep();
  }, [timerFinished, restFinished, index]);

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex);
      setItemStartMs(null);
      setCurrentSet(1);
      setRestStartMs(null);
    },
    [],
  );

  const isLast = index === items.length - 1;

  // Next marks the current exercise complete; Previous marks the one we return to incomplete.
  const next = useCallback(() => {
    setCompleted((done) => new Set(done).add(index));
    if (!isLast) goTo(index + 1);
  }, [goTo, index, isLast]);
  const previous = useCallback(() => {
    if (index === 0) return;
    setCompleted((done) => {
      const remaining = new Set(done);
      remaining.delete(index - 1);
      return remaining;
    });
    goTo(index - 1);
  }, [goTo, index]);

  // Sets exercises only: records one set and starts the rest timer between sets.
  const completeSet = useCallback(() => {
    if (item.kind !== "sets" || currentSet > totalSets) return;
    if (currentSet < totalSets) setRestStartMs(activeMs);
    setCurrentSet(currentSet + 1);
  }, [activeMs, currentSet, item.kind, totalSets]);
  const setsFinished = item.kind === "sets" && currentSet > totalSets;

  return {
    index,
    item,
    isLast,
    paused,
    activeMs,
    timedRemainingMs,
    timedProgress,
    timerStarted,
    timerFinished,
    completed,
    currentSet: Math.min(currentSet, totalSets),
    totalSets,
    setsFinished,
    resting,
    restRemainingMs,
    restFinished,
    togglePause: () => setPaused((value) => !value),
    startTimer: () => setItemStartMs(activeMs),
    resetTimer: () => setItemStartMs(null),
    skipRest: () => setRestStartMs(null),
    completeSet,
    next,
    previous,
    /** Jump straight to any exercise (does not change completed marks). */
    jumpTo: goTo,
  };
}
