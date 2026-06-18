// $lib/storage.js

import { supabase } from '$lib/supabaseClient';
import { nanoid } from 'nanoid';

const BUCKET = 'media';


export function getImageUrl(path) {
  if (!path) return '';

  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)
    .data
    .publicUrl;
}


export async function uploadImage({ file, folder, id }) {
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

  if (error) {
    throw error;
  }

  return path;
}


export async function deleteImage(path) {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}
