import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, '');
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!url || !key) {
  throw new Error('Missing Supabase configuration. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Must exactly match the Bucket ID shown in Supabase → Storage → Buckets.
export const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET || 'notecloud-files').trim();

function friendlyStorageError(error) {
  const message = error?.message || String(error || '');
  if (/bucket not found/i.test(message)) {
    return new Error(`Supabase bucket \"${STORAGE_BUCKET}\" was not found in this project. Create a bucket with exactly this Bucket ID, or set VITE_SUPABASE_BUCKET to your exact existing Bucket ID.`);
  }
  if (message === 'Failed to fetch' || /network|fetch/i.test(message)) {
    return new Error(
      `Cannot reach Supabase at ${url}. Open your Supabase dashboard → Settings → API and copy the Project URL exactly. ` +
      'If the Project URL is correct, check that the Supabase project is active and not paused.'
    );
  }
  return error instanceof Error ? error : new Error(message);
}

export async function uploadToStorage(folder, file) {
  if (!(file instanceof File)) throw new Error('Please select a valid file.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  const path = `${folder}/${Date.now()}-${uniqueId}-${safeName}`;

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    if (!data?.publicUrl) throw new Error('Supabase did not return a public file URL.');

    return { path, url: data.publicUrl };
  } catch (error) {
    throw friendlyStorageError(error);
  }
}

export async function removeFromStorage(paths) {
  const validPaths = (paths || []).filter(Boolean);
  if (!validPaths.length) return;

  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(validPaths);
    if (error) throw error;
  } catch (error) {
    throw friendlyStorageError(error);
  }
}
