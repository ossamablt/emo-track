import { JournalEntry, CheckInEntry } from "./types";

const STORAGE_KEY = "moodlens_entries";
const CHECKIN_STORAGE_KEY = "moodlens_checkins";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveEntry(entry: JournalEntry): void {
  const entries = getEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntry(id: string): JournalEntry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Check-in storage
export function getCheckIns(): CheckInEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CHECKIN_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCheckIn(entry: CheckInEntry): void {
  const entries = getCheckIns();
  entries.unshift(entry);
  localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(entries));
}

export function deleteCheckIn(id: string): void {
  const entries = getCheckIns().filter((e) => e.id !== id);
  localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(entries));
}
