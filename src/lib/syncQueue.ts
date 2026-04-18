/**
 * syncQueue.ts
 * Flushes queued offline mutations to Supabase when the device comes back online.
 * Called from AppContext whenever navigator.onLine transitions to true.
 */

import { supabase } from '@/lib/supabase';
import { getAllQueued, dequeueById } from '@/lib/offlineDB';
import type { QueuedMutation } from '@/lib/offlineDB';

async function applyMutation(m: QueuedMutation): Promise<void> {
  const table = supabase.from(m.table);

  switch (m.operation) {
    case 'insert': {
      const { error } = await table.insert(m.payload);
      if (error) throw error;
      break;
    }
    case 'upsert': {
      const { error } = await table.upsert(m.payload);
      if (error) throw error;
      break;
    }
    case 'update': {
      if (!m.matchColumn || m.matchValue === undefined) throw new Error('update needs matchColumn/matchValue');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (table as any).update(m.payload).eq(m.matchColumn, m.matchValue);
      if (error) throw error;
      break;
    }
    case 'delete': {
      if (!m.matchColumn || m.matchValue === undefined) throw new Error('delete needs matchColumn/matchValue');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (table as any).delete().eq(m.matchColumn, m.matchValue);
      if (error) throw error;
      break;
    }
  }
}

export async function flushOfflineQueue(): Promise<{ synced: number; failed: number }> {
  const queued = await getAllQueued();
  if (queued.length === 0) return { synced: 0, failed: 0 };

  console.log(`[StudyTrack Sync] Flushing ${queued.length} queued mutation(s)…`);

  let synced = 0;
  let failed = 0;

  // Sort oldest first
  const sorted = [...queued].sort((a, b) => a.timestamp - b.timestamp);

  for (const mutation of sorted) {
    try {
      await applyMutation(mutation);
      await dequeueById(mutation.id!);
      synced++;
    } catch (err) {
      console.error(`[StudyTrack Sync] Failed to apply mutation id=${mutation.id}:`, err);
      failed++;
    }
  }

  console.log(`[StudyTrack Sync] Done — synced: ${synced}, failed: ${failed}`);
  return { synced, failed };
}
