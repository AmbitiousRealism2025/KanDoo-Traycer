/**
 * LocalStorage utility module with debounced save functionality
 * Provides type-safe storage operations for board state persistence
 */

import type { Column } from '../types';

const isLocalStorageAvailable =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Storage key for localStorage
export const STORAGE_KEY = 'kandoo-flowboard-state';

// Type definition for stored data structure
export interface StorageData {
  columns: Column[];
}

/**
 * Loads board state from localStorage
 * @returns Parsed storage data or null if no data exists or parsing fails
 */
export function loadFromStorage(): StorageData | null {
  if (!isLocalStorageAvailable) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored) as StorageData;
    return parsed;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Saves board state to localStorage
 * @param data - Board state data to save
 */
export function saveToStorage(data: StorageData): void {
  if (!isLocalStorageAvailable) {
    return;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Timeout reference for debouncing
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced save to localStorage (500ms delay)
 * Batches rapid successive saves to avoid performance issues
 * @param data - Board state data to save
 */
export function debouncedSaveToStorage(data: StorageData): void {
  if (!isLocalStorageAvailable) {
    return;
  }

  // Clear any pending timeout
  if (saveTimeout !== null) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout for debounced save
  saveTimeout = setTimeout(() => {
    saveToStorage(data);
    saveTimeout = null;
  }, 500);
}
