import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Download, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { drawPhoto, photoBlob, MAX_PHOTO_BYTES } from "@/lib/photo-editor";
import { downloadFile, photoPackage, previewFilename } from "@/lib/photo-package";
import { staticPhotos } from "@/lib/static-gallery";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Preparar fotos da galeria" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PhotoPreparer,
});
const inputClass =
  "w-full rounded-lg border border-crimson/25 bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-gold";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-crimson/30 bg-card px-4 py-2.5 text-sm font-medium hover:border-gold disabled:cursor-not-allowed disabled:opacity-50";
const primaryClass = `${buttonClass} bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 font-bold text-white`;
type PreparedPhoto = { name: string; title: string; blob: Blob; url: string };

function PhotoPreparer() {
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.5);
  const [title, setTitle] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState<PreparedPhoto[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const working = useRef(false);
  const urls = useRef(new Set<string>());
  const current = files[0];

  useEffect(
    () => () => {
      for (const url of urls.current) URL.revokeObjectURL(url);
    },
    [],
  );
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    if (files.length || prepared.length) window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [files.length, prepared.length]);
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
    const url = URL.createObjectURL(current);
    const next = new Image();
    next.onload = () => {
      if (!active) return;
      if (next.naturalWidth * next.naturalHeight > 40_000_000) {
        setMessage("Escolha uma foto com até 40 megapixels ou pule esta foto.");
        return;
      }
      setImage(next);
    };
    next.onerror = () => {
      if (active) setMessage("Não foi possível abrir a foto. Use JPG, PNG ou WebP.");
    };
    next.src = url;
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [current]);
  useEffect(() => {
    if (!image || !canvas.current) return;
    try {
      drawPhoto(canvas.current, image, rotation, zoom, x, y);
    } catch {
      setImage(null);
      setMessage("O navegador não conseguiu preparar a prévia.");
    }
  }, [image, rotation, zoom, x, y]);

  function chooseFiles(selected: FileList | null) {
    if (!selected) return;
    const next = Array.from(selected);
    if (
      next.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > MAX_PHOTO_BYTES,
      )
    ) {
      setMessage("Selecione JPG, PNG ou WebP com até 15 MB por foto.");
      return;
    }
    setFiles((previous) => [...previous, ...next]);
    setMessage("");
  }
  async function prepare(event: FormEvent) {
    event.preventDefault();
    if (working.current) return;
    if (!image || !canvas.current || !consent || !title.trim() || title.trim().length > 120) {
      setMessage("Confira a prévia, a descrição e a autorização antes de continuar.");
      return;
    }
    working.current = true;
    setBusy(true);
    try {
      const blob = await photoBlob(canvas.current);
      const url = URL.createObjectURL(blob);
      urls.current.add(url);
      setPrepared((previous) => [
        ...previous,
        { name: previewFilename(title), title: title.trim(), blob, url },
      ]);
      setFiles((previous) => previous.slice(1));
      setMessage("Foto adicionada ao pacote. Baixe o ZIP quando terminar os ajustes.");
    } catch {
      setMessage("Não foi possível preparar a foto. Tente novamente.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  function removePrepared(photo: PreparedPhoto) {
    URL.revokeObjectURL(photo.url);
    urls.current.delete(photo.url);
    setPrepared((previous) => previous.filter((item) => item.name !== photo.name));
  }
  async function downloadPackage() {
    if (working.current || !prepared.length) return;
    working.current = true;
    setBusy(true);
    try {
      downloadFile(await photoPackage(prepared), "fotos-da-galeria.zip");
      setMessage(
        "Pacote pronto. Extraia o ZIP, envie os JPGs para a pasta da galeria no GitHub e publique o site.",
      );
    } catch {
      setMessage("Não foi possível gerar o ZIP. Você também pode baixar cada foto separadamente.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="bg-hero min-h-screen px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/previas" className="text-sm text-muted-foreground hover:text-foreground">
          Ver galeria
        </Link>
        <header className="my-8">
          <p className="mb-2 text-sm uppercase tracking-widest text-gold">
            Fotos nos arquivos do site
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Preparar fotos da galeria</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Ajuste fotos não explícitas e baixe as prévias prontas. Todo o preparo acontece neste
            navegador.
          </p>
        </header>
        <section className="rounded-2xl border border-crimson/25 bg-card/50 p-5 sm:p-7">
          <h2 className="mb-4 text-xl font-semibold">Adicionar fotos</h2>
          <label className="grid gap-2 text-base">
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
          <p className="mt-2 text-sm text-muted-foreground">
            Até 15 MB por foto. Ajuste cada imagem e adicione ao pacote. Os originais não são
            enviados.
          </p>
          {current && (
            <form noValidate onSubmit={prepare} className="mt-6 grid gap-6 md:grid-cols-2">
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
              <fieldset disabled={busy} className="grid content-start gap-5 disabled:opacity-60">
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
                  Formato 3:4 · 600 × 800 pixels. A prévia já mostra o desfoque que será publicado.
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
                  <Download className="h-4 w-4" />
                  {busy ? "Preparando…" : "Adicionar ao pacote"}
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

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 rounded-lg border border-gold/40 bg-background/60 p-3 text-base"
            >
              {message}
            </p>
          )}
        </section>
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Prontas para baixar ({prepared.length})</h2>
            <button
              disabled={busy || !prepared.length}
              onClick={() => void downloadPackage()}
              className={primaryClass}
            >
              <Download className="h-4 w-4" />
              {busy ? "Preparando…" : "Baixar pacote ZIP"}
            </button>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Baixe o pacote antes de fechar esta página. As fotos preparadas ficam apenas nesta
            sessão do navegador.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {prepared.map((photo) => (
              <article
                key={photo.name}
                className="overflow-hidden rounded-xl border border-crimson/25 bg-card/50"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  width={600}
                  height={800}
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="grid gap-2 p-3">
                  <p className="break-words text-sm">{photo.title}</p>
                  <button
                    disabled={busy}
                    className={buttonClass}
                    onClick={() => downloadFile(photo.blob, photo.name)}
                  >
                    Baixar foto
                  </button>
                  <button
                    disabled={busy}
                    className={buttonClass}
                    onClick={() => removePrepared(photo)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover do pacote
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-8 rounded-2xl border border-gold/30 bg-card/50 p-5 sm:p-7">
          <h2 className="text-xl font-semibold">Colocar as fotos no site</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-base">
            <li>Baixe o pacote e extraia o ZIP no seu computador.</li>
            <li>
              Abra a pasta da galeria no GitHub e clique em <strong>Add file → Upload files</strong>
              .
            </li>
            <li>
              Arraste os arquivos JPG extraídos e confirme em <strong>Commit changes</strong>.
            </li>
            <li>
              Aguarde a sincronização e publique a versão atualizada do site. As fotos aparecem
              automaticamente na galeria.
            </li>
          </ol>
          <a
            className={`${buttonClass} mt-5`}
            href="https://github.com/wallas123321/link-vibe-lounge/tree/main/src/assets/gallery"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir pasta no GitHub
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            O pacote não publica sozinho. Somente quem tem acesso de escrita ao repositório consegue
            atualizar o site. Envie apenas as prévias já desfocadas.
          </p>
        </section>
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Fotos nos arquivos do projeto ({staticPhotos.length})
          </h2>
          {!staticPhotos.length && (
            <p className="text-base text-muted-foreground">
              As novas fotos aparecerão aqui depois de enviar os JPGs ao GitHub e atualizar a
              publicação.
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {staticPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                width={600}
                height={800}
                className="aspect-[3/4] w-full rounded-xl object-cover"
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Para retirar uma foto do site, exclua o respectivo JPG da pasta no GitHub e publique
            novamente.
          </p>
        </section>
      </div>
    </main>
  );
}
