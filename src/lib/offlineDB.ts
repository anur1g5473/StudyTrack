/**
 * offlineDB.ts
 * IndexedDB wrapper for offline-first data persistence.
 * Stores: profile, subjects, theme preference.
 */

const DB_NAME = 'studytrack-offline';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('keyval')) {
        db.createObjectStore('keyval');
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        const qs = db.createObjectStore('sync_queue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        qs.createIndex('by_time', 'timestamp');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ── Generic key/value store ─────────────────────────────────
export async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readonly');
    const req = tx.objectStore('keyval').get(key);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readwrite');
    tx.objectStore('keyval').put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('keyval', 'readwrite');
    tx.objectStore('keyval').delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Sync Queue ───────────────────────────────────────────────
export interface QueuedMutation {
  id?: number;
  timestamp: number;
  table: string;
  operation: 'insert' | 'update' | 'delete' | 'upsert';
  payload: Record<string, unknown>;
  matchColumn?: string;
  matchValue?: unknown;
}

export async function enqueueMutation(mutation: Omit<QueuedMutation, 'id' | 'timestamp'>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readwrite');
    tx.objectStore('sync_queue').add({ ...mutation, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllQueued(): Promise<QueuedMutation[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readonly');
    const req = tx.objectStore('sync_queue').getAll();
    req.onsuccess = () => resolve(req.result as QueuedMutation[]);
    req.onerror = () => reject(req.error);
  });
}

export async function dequeueById(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readwrite');
    tx.objectStore('sync_queue').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearQueue(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readwrite');
    tx.objectStore('sync_queue').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
