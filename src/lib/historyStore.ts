import type { HistoryEntry } from "@/types/api";

const STORAGE_KEY = "rfid_simulator_history";

export function saveToHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  
  const history = getHistory();
  history.unshift(entry);
  
  // Keep only last 100 entries
  if (history.length > 100) {
    history.splice(100);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}