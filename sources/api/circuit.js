// src/api/circuit.js
import { supabase, getCurrentUser } from '../supabaseClient';

/**
 * Save or update circuit progress (level 1..10).
 * Returns the upserted row.
 */
export async function saveCircuitProgress(level) {
  if (typeof level !== 'number' || level < 1 || level > 10) {
    throw new Error('Level must be an integer between 1 and 10');
  }

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('circuit_progress')
    .upsert(
      {
        user_id: user.id,
        level,
        last_updated: now
      },
      { onConflict: 'user_id', returning: 'representation' }
    );

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Load circuit progress for current user.
 * If last_updated is older than 24 hours, resets level to 1 (client-enforced).
 * Returns the row { id, user_id, level, last_updated, ... }.
 */
export async function loadCircuitProgress() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Try to select existing row
  const { data, error } = await supabase
    .from('circuit_progress')
    .select('id, user_id, level, last_updated, last_manual_reset')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    // Create default row (level 1)
    const { data: inserted, error: insErr } = await supabase
      .from('circuit_progress')
      .insert([{ user_id: user.id, level: 1 }])
      .select()
      .maybeSingle();
    if (insErr) throw insErr;
    return inserted;
  }

  // Check 24-hour auto-reset
  const lastUpdated = data.last_updated ? new Date(data.last_updated) : null;
  const now = new Date();

  if (!lastUpdated) {
    // no timestamp -> update last_updated to now and return
    const { data: updated, error: updErr } = await supabase
      .from('circuit_progress')
      .update({ last_updated: now.toISOString() })
      .eq('user_id', user.id)
      .select()
      .maybeSingle();
    if (updErr) throw updErr;
    return updated;
  }

  const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
  if (hoursDiff >= 24) {
    // Reset to level 1 and persist
    const { data: resetRow, error: resetErr } = await supabase
      .from('circuit_progress')
      .update({ level: 1, last_updated: now.toISOString() })
      .eq('user_id', user.id)
      .select()
      .maybeSingle();
    if (resetErr) throw resetErr;
    return resetRow;
  }

  return data;
}

/**
 * Manual reset triggered by the user. Sets level to 1 and records last_manual_reset.
 */
export async function resetCircuitManual() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('circuit_progress')
    .upsert(
      {
        user_id: user.id,
        level: 1,
        last_manual_reset: now,
        last_updated: now
      },
      { onConflict: 'user_id', returning: 'representation' }
    );

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}