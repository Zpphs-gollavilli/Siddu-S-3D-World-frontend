// src/api/counters.js
import { supabase, getCurrentUser } from '../supabaseClient';

/**
 * Atomically increment cookie count by delta (default 1).
 * Returns the updated counters row.
 *
 * For highest safety, create the RPC 'increment_cookie_count' server-side and call rpc().
 * This implementation uses safe upsert/read-modify-write for a portfolio app.
 */
export async function incrementCookieCount(delta = 1) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing, error: selErr } = await supabase
    .from('user_counters')
    .select('cookie_count')
    .eq('user_id', user.id)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing) {
    const newCount = Number(existing.cookie_count || 0) + delta;
    const { data, error } = await supabase
      .from('user_counters')
      .update({ cookie_count: newCount, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_counters')
      .insert([{ user_id: user.id, cookie_count: delta }])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}

/**
 * Set or update an alert key/value in the alerts JSONB.
 * Example: setAlertValue('warning', 3)
 */
export async function setAlertValue(key, value) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Load existing alerts (if any)
  const { data: row, error: selErr } = await supabase
    .from('user_counters')
    .select('alerts')
    .eq('user_id', user.id)
    .maybeSingle();

  if (selErr) throw selErr;

  const alerts = (row && row.alerts) ? { ...row.alerts } : {};
  alerts[key] = value;

  const { data, error } = await supabase
    .from('user_counters')
    .upsert(
      { user_id: user.id, alerts, updated_at: new Date().toISOString() },
      { onConflict: 'user_id', returning: 'representation' }
    );

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Load counters for current user. Returns { cookie_count, alerts, updated_at } (defaults if missing).
 */
export async function loadCounters() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_counters')
    .select('cookie_count, alerts, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { cookie_count: 0, alerts: {} };
  return data;
}