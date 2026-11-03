import type { SupabaseClient } from "@supabase/supabase-js";
import { PHOTO_BUCKET, MAX_PREVIEW_BYTES } from "./gallery-config.ts";

type BucketStorage = Pick<SupabaseClient["storage"], "getBucket" | "createBucket">;

function missingBucket(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const value = error as {
    status?: number;
    statusCode?: string | number;
    message?: string;
    code?: string;
  };
  return (
    value.status === 404 ||
    String(value.statusCode) === "404" ||
    value.code === "NoSuchBucket" ||
    /^bucket not found$/i.test(value.message ?? "")
  );
}

/** Privileged storage access is obtained only AFTER checking the caller's membership. */
export async function ensureGalleryStorage(
  isAdmin: () => Promise<boolean>,
  getStorage: () => Promise<BucketStorage>,
) {
  if (!(await isAdmin())) throw new Error("Sua conta não tem permissão para publicar fotos.");
  const storage = await getStorage();
  const existing = await storage.getBucket(PHOTO_BUCKET);
  if (existing.data) {
    if (!existing.data.public)
      throw new Error("O armazenamento de prévias está privado. Confira a configuração no Cloud.");
    return;
  }
  // A permissions or network error must never be mistaken for a missing bucket.
  if (!missingBucket(existing.error))
    throw existing.error ?? new Error("Não foi possível verificar o armazenamento.");

  const created = await storage.createBucket(PHOTO_BUCKET, {
    public: true,
    fileSizeLimit: MAX_PREVIEW_BYTES,
    allowedMimeTypes: ["image/jpeg"],
  });
  if (created.error) {
    // Two administrators may publish simultaneously on the first use.
    const retry = await storage.getBucket(PHOTO_BUCKET);
    if (!retry.data?.public) throw created.error;
  }
}
