import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const prepareGalleryUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { ensureGalleryStorage } = await import("./gallery-storage.server");
      await ensureGalleryStorage(
        async () => {
          const { data, error } = await context.supabase
            .from("gallery_admins")
            .select("user_id")
            .eq("user_id", context.userId)
            .maybeSingle();
          if (error) throw new Error("Não foi possível verificar sua permissão de administrador.");
          return Boolean(data);
        },
        async () => {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          return supabaseAdmin.storage;
        },
      );
      return { ok: true as const, error: null };
    } catch (error) {
      console.error("Gallery storage preparation failed", error);
      return {
        ok: false as const,
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível preparar o armazenamento de fotos.",
      };
    }
  });
