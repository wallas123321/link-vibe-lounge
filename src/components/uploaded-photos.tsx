import { useEffect, useState } from "react";
import { CHECKOUT_URL, listPhotos, photoUrl, type GalleryPhoto } from "@/lib/gallery";

export function UploadedPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    listPhotos()
      .then((data) => {
        if (active) setPhotos(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  if (failed)
    return (
      <p className="col-span-full text-center text-sm text-muted-foreground" role="status">
        Não foi possível carregar as novas fotos.{" "}
        <button className="underline" onClick={() => setAttempt(attempt + 1)}>
          Tentar novamente
        </button>
      </p>
    );
  return photos.map((photo) => (
    <a
      key={photo.id}
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-crimson/15 bg-card/40 transition-all hover:border-crimson/50 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={photoUrl(photo.storage_path)}
          alt={photo.title}
          loading="lazy"
          width={600}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-1.5 left-1.5 rounded bg-crimson/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          HD
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white">
          Foto
        </span>
      </div>
      <div className="p-2.5">
        <span className="flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 px-2 py-2 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-white shadow-md transition-all group-hover:from-amber-400 group-hover:via-orange-400 group-hover:to-rose-500 group-active:scale-95 sm:px-3 sm:text-xs">
          Acessar conteúdo exclusivo
        </span>
      </div>
    </a>
  ));
}
