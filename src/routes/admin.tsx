import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, RotateCcw, RotateCw, Upload, Trash2, LogOut, LockKeyhole } from "lucide-react";
import {
  galleryClient,
  listPhotos,
  photoUrl,
  PHOTO_BUCKET,
  type GalleryPhoto,
} from "@/lib/gallery";
import { drawPhoto, photoBlob, MAX_PHOTO_BYTES } from "@/lib/photo-editor";
import { prepareGalleryUpload } from "@/lib/gallery-upload.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrar fotos — Casal Novinho Maringá" },
      { name: "description", content: "Acesso administrativo à galeria de Casal Novinho Maringá." },
      { property: "og:title", content: "Administrar fotos — Casal Novinho Maringá" },
      {
        property: "og:description",
        content: "Acesso administrativo à galeria de Casal Novinho Maringá.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const inputClass =
  "w-full rounded-lg border border-crimson/25 bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-gold";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-crimson/30 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-50";
const primaryClass = `${buttonClass} bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 font-bold text-white`;

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.5);
  const [title, setTitle] = useState("");
  const [consent, setConsent] = useState(false);
  const [publishStatus, setPublishStatus] = useState("");
  const [publishFailed, setPublishFailed] = useState(false);
  const publishNotice = useRef<HTMLParagraphElement>(null);
  const publishing = useRef(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = files[0];

  useEffect(() => {
    if (publishFailed)
      publishNotice.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [publishFailed, publishStatus]);

  useEffect(() => {
    if (!galleryClient) {
      setChecking(false);
      return;
    }
    const {
      data: { subscription },
    } = galleryClient.auth.onAuthStateChange((_event, value) => {
      setSession(value);
      if (!value) {
        setAllowed(false);
        setChecking(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!galleryClient || !session) return;
    setAllowed(false);
    setChecking(true);
    let active = true;
    galleryClient
      .from("gallery_admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        setAllowed(Boolean(data) && !error);
        setChecking(false);
        if (!data || error) setMessage("Esta conta não tem permissão para administrar as fotos.");
      });
    return () => {
      active = false;
    };
  }, [session?.user.id]);

  async function refreshPhotos() {
    setLoadingPhotos(true);
    try {
      setPhotos(await listPhotos());
    } catch {
      setMessage("Não foi possível carregar as fotos. Tente atualizar a lista.");
    } finally {
      setLoadingPhotos(false);
    }
  }

  useEffect(() => {
    if (allowed) void refreshPhotos();
  }, [allowed]);

  useEffect(() => {
    setImage(null);
    setRotation(0);
    setZoom(1);
    setX(0.5);
    setY(0.5);
    setTitle("");
    setConsent(false);
    if (!current) return;
    let active = true;
    const objectUrl = URL.createObjectURL(current);
    const next = new Image();
    next.onload = () => {
      if (!active) return;
      if (next.naturalWidth * next.naturalHeight > 40_000_000) {
        setMessage("A imagem é muito grande. Escolha uma foto com até 40 megapixels.");
        return;
      }
      setImage(next);
    };
    next.onerror = () => {
      if (active) setMessage("Não foi possível abrir esta foto. Use JPG, PNG ou WebP.");
    };
    next.src = objectUrl;
    return () => {
      active = false;
      URL.revokeObjectURL(objectUrl);
    };
  }, [current]);

  useEffect(() => {
    if (!image || !canvas.current) return;
    try {
      drawPhoto(canvas.current, image, rotation, zoom, x, y);
    } catch {
      setImage(null);
      setMessage("Seu navegador não conseguiu preparar a prévia.");
    }
  }, [image, rotation, zoom, x, y]);

  async function login(event: FormEvent) {
    event.preventDefault();
    if (!galleryClient) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await galleryClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setPassword("");
    } catch {
      setMessage("Não foi possível entrar. Confira seu e-mail e senha e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!galleryClient) return;
    setBusy(true);
    try {
      const { error } = await galleryClient.auth.signOut();
      if (error) throw error;
      setFiles([]);
      setPhotos([]);
      setMessage("");
    } catch {
      setMessage("Não foi possível sair. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  function chooseFiles(selected: FileList | null) {
    if (!selected) return;
    const picked = Array.from(selected);
    if (
      picked.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > MAX_PHOTO_BYTES,
      )
    ) {
      setMessage("Escolha apenas fotos JPG, PNG ou WebP com até 15 MB cada.");
      return;
    }
    setMessage("");
    setPublishStatus("");
    setPublishFailed(false);
    setFiles(picked);
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    if (publishing.current) return;
    setPublishFailed(false);
    if (!galleryClient || !session || !allowed) {
      setPublishFailed(true);
      setPublishStatus("Sua sessão não está disponível. Entre novamente no painel.");
      return;
    }
    if (!canvas.current || !image || !consent || !title.trim() || title.trim().length > 120) {
      setPublishFailed(true);
      setPublishStatus(
        "Aguarde a prévia, preencha uma descrição de até 120 caracteres e confirme a autorização.",
      );
      return;
    }
    publishing.current = true;
    setBusy(true);
    setMessage("");
    let path: string | undefined;
    let uploaded = false;
    let stage = "preparar a foto";
    try {
      setPublishStatus("Preparando a prévia…");
      path = `${session.user.id}/${crypto.randomUUID()}.jpg`;
      const blob = await photoBlob(canvas.current);
      stage = "preparar o armazenamento";
      setPublishStatus("Preparando o armazenamento…");
      const prepared = await prepareGalleryUpload();
      if (!prepared.ok) throw new Error(prepared.error);
      stage = "enviar a foto";
      setPublishStatus("Enviando a foto…");
      const { error: uploadError } = await galleryClient.storage
        .from(PHOTO_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (uploadError) throw uploadError;
      uploaded = true;
      stage = "salvar a foto na galeria";
      setPublishStatus("Salvando na galeria…");
      const { data, error } = await galleryClient
        .from("gallery_photos")
        .insert({ title: title.trim(), storage_path: path })
        .select("id, title, storage_path, created_at")
        .single();
      if (error) throw error;
      setPhotos((previous) => [data as GalleryPhoto, ...previous]);
      setFiles((previous) => previous.slice(1));
      setPublishStatus("Foto publicada na galeria.");
    } catch (error) {
      console.error(`Falha ao ${stage}`, error);
      let recoveryNotice = "";
      if (uploaded && path) {
        // A lost insert response may still mean success; never delete that preview.
        try {
          const recovered = await galleryClient
            .from("gallery_photos")
            .select("id, title, storage_path, created_at")
            .eq("storage_path", path)
            .maybeSingle();
          if (recovered.data && !recovered.error) {
            const photo = recovered.data as GalleryPhoto;
            setPhotos((previous) => [photo, ...previous.filter((item) => item.id !== photo.id)]);
            setFiles((previous) => previous.slice(1));
            setPublishStatus("Foto publicada na galeria.");
            return;
          }
          if (!recovered.error && !recovered.data) {
            const removed = await galleryClient.storage.from(PHOTO_BUCKET).remove([path]);
            if (removed.error) recoveryNotice = " O arquivo enviado ainda está no armazenamento.";
          } else {
            recoveryNotice = " Atualize a lista antes de tentar novamente.";
          }
        } catch {
          recoveryNotice = " Atualize a lista antes de tentar novamente.";
        }
      }
      const detail =
        error && typeof error === "object" && "message" in error
          ? String(error.message).slice(0, 400)
          : "Erro inesperado. Tente novamente.";
      setPublishFailed(true);
      setPublishStatus(`Não foi possível ${stage}: ${detail}${recoveryNotice}`);
    } finally {
      publishing.current = false;
      setBusy(false);
    }
  }

  async function removePhoto(photo: GalleryPhoto) {
    if (!galleryClient || !window.confirm(`Excluir “${photo.title}” da galeria?`)) return;
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await galleryClient
        .from("gallery_photos")
        .delete()
        .eq("id", photo.id)
        .select("id");
      if (error || !data?.length) throw error ?? new Error("Sem permissão");
      setPhotos((previous) => previous.filter((item) => item.id !== photo.id));
      const { error: storageError } = await galleryClient.storage
        .from(PHOTO_BUCKET)
        .remove([photo.storage_path]);
      setMessage(
        storageError
          ? "Foto removida da galeria. O arquivo ainda precisa ser removido do armazenamento."
          : "Foto excluída.",
      );
    } catch {
      setMessage("Não foi possível excluir a foto. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-hero min-h-screen px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/previas"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Ver galeria
          </Link>
          {session && (
            <button className={buttonClass} disabled={busy} onClick={() => void logout()}>
              <LogOut className="h-4 w-4" /> Sair
            </button>
          )}
        </div>
        <header className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <LockKeyhole className="h-4 w-4" /> Área administrativa
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Gerenciar fotos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Publique fotos não explícitas com enquadramento vertical e desfoque automático.
          </p>
        </header>
        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg border border-gold/40 bg-card p-4 text-sm"
          >
            {message}
          </p>
        )}
        {!galleryClient ? (
          <div className="rounded-xl border border-crimson/25 bg-card/50 p-6">
            <h2 className="text-xl">Painel aguardando configuração</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              O login e o armazenamento precisam ser conectados antes da primeira publicação.
            </p>
          </div>
        ) : checking ? (
          <p role="status">Verificando acesso…</p>
        ) : !session ? (
          <form
            onSubmit={login}
            className="mx-auto grid max-w-md gap-5 rounded-2xl border border-crimson/25 bg-card/50 p-6"
          >
            <h2 className="text-xl font-semibold">Entrar no painel</h2>
            <label className="grid gap-2 text-sm">
              E-mail
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                disabled={busy}
              />
            </label>
            <label className="grid gap-2 text-sm">
              Senha
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                disabled={busy}
              />
            </label>
            <button disabled={busy} className={primaryClass}>
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        ) : !allowed ? (
          <p className="text-sm text-muted-foreground">
            Entre com uma conta de administrador autorizada para continuar.
          </p>
        ) : (
          <>
            <section className="rounded-2xl border border-crimson/25 bg-card/50 p-5 sm:p-7">
              <h2 className="mb-4 text-xl font-semibold">Adicionar fotos</h2>
              <label className="grid gap-2 text-sm">
                Selecionar fotos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={busy}
                  onChange={(event) => {
                    chooseFiles(event.target.files);
                    event.target.value = "";
                  }}
                  className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-crimson/25 file:px-3 file:py-2 file:text-foreground`}
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG ou WebP · até 15 MB por foto. Ajuste e publique uma foto por vez.
              </p>
              {current && (
                <form noValidate onSubmit={publish} className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-2 break-all text-xs text-muted-foreground">
                      {current.name} · {files.length} foto(s) na fila
                    </p>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                      <canvas
                        ref={canvas}
                        aria-label="Prévia vertical desfocada da foto"
                        className={`h-full w-full object-cover ${image ? "" : "invisible"}`}
                      />
                    </div>
                    {!image && (
                      <p className="mt-2 text-sm" role="status">
                        Preparando imagem. Se ela não abrir, pule esta foto.
                      </p>
                    )}
                  </div>
                  <fieldset
                    disabled={busy}
                    className="grid content-start gap-5 disabled:opacity-60"
                  >
                    <legend className="sr-only">Ajustes da foto</legend>
                    <label className="grid gap-2 text-sm">
                      Descrição da foto
                      <input
                        required
                        maxLength={120}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className={inputClass}
                        placeholder="Ex.: Foto do ensaio"
                      />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!image}
                        className={buttonClass}
                        onClick={() => setRotation((value) => (value + 270) % 360)}
                      >
                        <RotateCcw className="h-4 w-4" /> Girar à esquerda
                      </button>
                      <button
                        type="button"
                        disabled={!image}
                        className={buttonClass}
                        onClick={() => setRotation((value) => (value + 90) % 360)}
                      >
                        <RotateCw className="h-4 w-4" /> Girar à direita
                      </button>
                    </div>
                    <label className="grid gap-2 text-sm">
                      Aproximação ({zoom.toFixed(1)}×)
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(event) => setZoom(Number(event.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      Posição horizontal
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={x}
                        onChange={(event) => setX(Number(event.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      Posição vertical
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={y}
                        onChange={(event) => setY(Number(event.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Formato 3:4 · 600 × 800 pixels. A prévia já mostra o desfoque que será
                      publicado.
                    </p>
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 accent-rose-500"
                      />
                      <span>
                        Confirmo que a foto não é explícita e tenho autorização para publicá-la.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={!image || !consent || !title.trim() || busy}
                      className={primaryClass}
                    >
                      <Upload className="h-4 w-4" />
                      {busy ? "Publicando…" : "Publicar foto"}
                    </button>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => setFiles((previous) => previous.slice(1))}
                    >
                      Pular esta foto
                    </button>
                  </fieldset>
                </form>
              )}
              {publishStatus && (
                <p
                  ref={publishNotice}
                  role={publishFailed ? "alert" : "status"}
                  className={`mt-4 rounded-lg border p-3 text-sm ${publishFailed ? "border-rose-500/60 bg-rose-950/50" : "border-gold/40 bg-background/60"}`}
                >
                  {publishStatus}
                </p>
              )}
            </section>
            <section className="mt-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Fotos adicionadas ({photos.length})</h2>
                <button
                  disabled={busy || loadingPhotos}
                  className={buttonClass}
                  onClick={() => void refreshPhotos()}
                >
                  {loadingPhotos ? "Carregando…" : "Atualizar lista"}
                </button>
              </div>
              {!photos.length && !loadingPhotos && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma foto adicionada pelo painel ainda.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo) => (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-xl border border-crimson/25 bg-card/50"
                  >
                    <img
                      src={photoUrl(photo.storage_path)}
                      alt={photo.title}
                      loading="lazy"
                      width={600}
                      height={800}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="grid gap-3 p-3">
                      <p className="break-words text-sm">{photo.title}</p>
                      <button
                        disabled={busy}
                        className={buttonClass}
                        onClick={() => void removePhoto(photo)}
                      >
                        <Trash2 className="h-4 w-4" /> Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
