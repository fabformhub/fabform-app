// $lib/storage.js

import { supabase } from '$lib/supabaseClient';
import { nanoid } from 'nanoid';

const BUCKET = 'media';

/**
 * Get public URL from storage path
 */
export function getImageUrl(path) {
  if (!path) return null;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Upload image → returns { path, url }
 */
export async function uploadImage({ file, folder, id }) {
  if (!file) throw new Error('No file provided');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${nanoid()}.${ext}`;
  const path = `${folder}/${id}/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) throw error;

  const url = getImageUrl(path);

  return { path, url };
}

/**
 * Delete image by path
 */
export async function deleteImage(path) {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw error;
}
