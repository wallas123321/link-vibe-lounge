import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
export const galleryClient = url && key ? createClient(url, key) : null;
export const PHOTO_BUCKET = "gallery-previews";
export const CHECKOUT_URL = "https://privacy.com.br/checkout/casaldemaringa";

export type GalleryPhoto = {
  id: string;
  title: string;
  storage_path: string;
  created_at: string;
};

export async function listPhotos(): Promise<GalleryPhoto[]> {
  if (!galleryClient) return [];
  const { data, error } = await galleryClient
    .from("gallery_photos")
    .select("id, title, storage_path, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function photoUrl(path: string) {
  return galleryClient?.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl ?? "";
}
