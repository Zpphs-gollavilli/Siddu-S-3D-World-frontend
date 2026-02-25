// src/api/leaderboard.js
import { supabase, getCurrentUser } from '../supabaseClient';

/**
 * Upsert user's score in the leaderboard.
 * If you only want to update when score is higher, fetch current and compare before upsert.
 */
export async function updateLeaderboardScore(score) {
  if (typeof score !== 'number') throw new Error('Score must be a number');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Optional: only update if new score is greater than existing.
  const { data: existing, error: selErr } = await supabase
    .from('leaderboard')
    .select('score')
    .eq('user_id', user.id)
    .maybeSingle();
  if (selErr) throw selErr;

  if (existing && Number(existing.score) >= score) {
    // No update needed
    return existing;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('leaderboard')
    .upsert(
      { user_id: user.id, score, updated_at: now },
      { onConflict: 'user_id', returning: 'representation' }
    );

  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Get top 3 leaderboard rows (highest scores).
 * Returns array of rows: { user_id, score, updated_at }.
 */
export async function getTop3Leaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('user_id, score, updated_at')
    .order('score', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data;
}