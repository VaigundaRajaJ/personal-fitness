"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface SessionRecord {
  id: string;
  /** ISO date-time when the session was finished. */
  date: string;
  title: string;
  minutes: number;
}

const STORAGE_KEY = "personalFitnessHistory";
const MAX_RECORDS = 500;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function writeRecords(records: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
  } catch {
    // Storage full or blocked: nothing else to do for a personal app.
  }
  listeners.forEach((listener) => listener());
}

function parseRecords(raw: string): SessionRecord[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

export function addSessionRecord(title: string, minutes: number): void {
  const record: SessionRecord = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    title,
    minutes,
  };
  writeRecords([record, ...parseRecords(readRaw())]);
}

export function clearHistory(): void {
  writeRecords([]);
}

/** Saved sessions, newest first. Empty on the server, so no hydration mismatch. */
export function useHistory(): SessionRecord[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => parseRecords(raw), [raw]);
}
