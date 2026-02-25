// src/api/whispers.js
import { supabase, getCurrentUser } from '../supabaseClient';

/**
 * Save a whisper message to the DB.
 * Throws on error.
 * @param {string} content
 */
export async function saveWhisper(content) {
  if (!content || typeof content !== 'string') throw new Error('Invalid content');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('whispers')
    .insert([{ user_id: user.id, content }]);

  if (error) throw error;
  return true;
}

/**
 * Load recent whispers, newest first.
 * @param {object} opts { limit: number }
 */
export async function loadWhispers({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from('whispers')
    .select('id, user_id, content, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}