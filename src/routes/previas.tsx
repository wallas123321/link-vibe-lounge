import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, Flame } from "lucide-react";
import snap46 from "@/assets/previas/snap46.png";
import snap39 from "@/assets/previas/snap39.png";
import picsart from "@/assets/previas/picsart.jpg";
import fotinha from "@/assets/previas/fotinha.png";
import marido from "@/assets/previas/marido.jpg";
import vid9 from "@/assets/previas/vid9.jpg";
import foto7 from "@/assets/previas/foto7.jpg";
import foto9 from "@/assets/previas/foto9.png";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/previas")({
  head: () => ({
    meta: [
      { title: "Prévias e Conteúdo Exclusivo — Casal Liberal de Maringá | Hotwife e Ménage" },
      {
        name: "description",
        content:
          "Prévias do conteúdo exclusivo do Casal Novinho Maringá. Casal liberal de Maringá-PR: hotwife, ménage e o melhor do meio swing do Paraná.",
      },
      {
        property: "og:title",
        content: "Prévias e Conteúdo Exclusivo — Casal Liberal de Maringá | Hotwife e Ménage",
      },
      {
        property: "og:description",
        content:
          "Prévias do conteúdo exclusivo do Casal Novinho Maringá. Casal liberal de Maringá-PR: hotwife, ménage e o melhor do meio swing do Paraná.",
      },
      { property: "og:url", content: `${SITE_URL}/previas` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/previas` }],
  }),
  component: PreviasPage,
});

const CHECKOUT_URL = "https://privacy.com.br/checkout/casaldemaringa";

type PhotoItem = {
  id: string;
  title: string;
  views: string;
  thumb: string;
};

const items: PhotoItem[] = [
  { id: "1", title: "Prévia quente na cama", views: "12.4k", thumb: snap46 },
  { id: "2", title: "De quatro pra ele", views: "8.9k", thumb: snap39 },
  { id: "3", title: "Boquete molhado", views: "5.2k", thumb: picsart },
  { id: "4", title: "Bundão sentando", views: "21.1k", thumb: fotinha },
  { id: "5", title: "Marido dotado", views: "17.7k", thumb: marido },
  { id: "6", title: "Chupando gostoso", views: "9.3k", thumb: vid9 },
  { id: "7", title: "Sentando gostoso", views: "14.6k", thumb: foto7 },
  { id: "8", title: "Gozada na boca", views: "19.8k", thumb: foto9 },
];

function PreviasPage() {
  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-crimson/30 blur-[120px] animate-smoke" />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose/20 blur-[140px] animate-smoke"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <Link
          to="/"
          className="self-start mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold italic leading-tight">
            <span className="text-gold-gradient">Conteúdos</span>{" "}
            <span className="text-foreground">Exclusivos do Casal</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Clique para assistir
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block cursor-pointer overflow-hidden rounded-xl border border-crimson/15 bg-card/40 text-left transition-all hover:border-crimson/50 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={item.thumb}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover blur-[5px] brightness-110 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-1.5 left-1.5 rounded bg-crimson/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  HD
                </span>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white">
                  Foto
                </span>
              </div>

              <div className="p-2.5">
                <span className="flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 px-2 py-2 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-white shadow-md transition-all group-hover:from-amber-400 group-hover:via-orange-400 group-hover:to-rose-500 group-hover:shadow-[0_0_20px_-2px_rgba(249,115,22,0.6)] group-active:scale-95 sm:px-3 sm:text-xs">
                  Acessar conteúdo exclusivo
                </span>
                <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {item.views} views
                </div>
              </div>
            </a>
          ))}
        </section>

        <section className="mt-12 mb-4 flex flex-col items-center gap-4 rounded-2xl border border-crimson/20 bg-card/40 px-5 py-8 text-center sm:px-10">
          <h2 className="text-lg font-semibold leading-snug sm:text-xl">
            <span className="text-gold-gradient">Estes e muitos outros</span>{" "}
            <span className="text-foreground">conteúdos exclusivos</span>
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Fotos e vídeos completos do casal, sem censura, te esperando no botão
            abaixo 💋
          </p>
          <a
            href="https://privacy.com.br/checkout/casaldemaringa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:from-amber-400 hover:via-orange-400 hover:to-rose-500 hover:shadow-[0_0_30px_-2px_rgba(249,115,22,0.6)] active:scale-95 sm:px-8 sm:text-base"
          >
            <Flame className="h-5 w-5" />
            Ver conteúdo completo
          </a>
        </section>
      </div>
    </main>
  );
}
