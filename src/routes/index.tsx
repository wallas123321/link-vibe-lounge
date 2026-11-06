import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Crown } from "lucide-react";
import { ZapLiberalDownload } from "@/components/zapliberal-download";
import heroAvatar from "@/assets/casal.jpg";

import maringaLogo from "@/assets/maringa-hot-logo.png.asset.json";
import privacyLogo from "@/assets/privacy-logo.png.asset.json";
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, SEO_KEYWORDS, SITE_JSONLD } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "keywords", content: SEO_KEYWORDS },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(SITE_JSONLD),
      },
    ],
  }),
  component: Index,
});

type LinkItem = {
  label: string;
  sub?: string;
  href?: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  logo?: string;
  featured?: boolean;
};

const links: LinkItem[] = [
  {
    label: "Maringá Hot",
    sub: "Nossa rede social",
    href: "https://maringahot.club",
    icon: Heart,
    logo: maringaLogo.url,
  },
  {
    label: "Conteúdo VIP Exclusivo",
    sub: "Acesso completo",
    to: "/previas",
    icon: Crown,
    logo: privacyLogo.url,
    featured: true,
  },
];

function Index() {
  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-crimson/30 blur-[120px] animate-smoke" />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose/20 blur-[140px] animate-smoke"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-crimson/40 blur-2xl animate-pulse-glow" />
          <div className="relative h-36 w-36 overflow-hidden rounded-full ring-2 ring-crimson/60 ring-offset-4 ring-offset-background shadow-glow">
            <img src={heroAvatar} alt="Casal Novinho Maringá" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mb-2 rounded-full border border-gold/40 bg-background/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-md">
          CRS 192294
        </div>
        <h1 className="text-center text-4xl font-semibold italic leading-tight">
          <span className="text-gold-gradient">Casal Novinho</span>
          <br />
          <span className="text-foreground">Maringá</span>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground max-w-xs">
          Casados, liberais, só saímos juntos. Confira nossos conteúdos exclusivos no botão abaixo.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Casados", "Liberais", "Maringá"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-card-gradient border border-crimson/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-rose"
            >
              {t}
            </span>
          ))}
        </div>

        <nav className="mt-10 flex w-full flex-col gap-3">
          <ZapLiberalDownload />
          {links.map((l) => {
            const Icon = l.icon;
            const isInternal = !!l.to;
            const Wrapper = isInternal ? Link : "a";
            const wrapperProps = isInternal ? { to: l.to } : { href: l.href };

            const content = (
              <>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/95 backdrop-blur-sm p-1.5 ${l.featured ? "" : "text-crimson"}`}>
                  {l.logo ? (
                    <img src={l.logo} alt={l.label} className="h-full w-full object-contain" />
                  ) : (
                    <Icon className={`h-5 w-5 ${l.featured ? "text-foreground" : ""}`} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-semibold text-foreground ${l.featured ? "tracking-wide" : ""}`}>{l.label}</div>
                  {l.sub && (
                    <div className={`text-foreground/70 ${l.featured ? "text-[11px] uppercase tracking-widest" : "text-xs"}`}>
                      {l.sub}
                    </div>
                  )}
                </div>
                {l.featured ? (
                  <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                    VIP
                  </span>
                ) : (
                  <span className="text-foreground/80 transition-transform group-hover:translate-x-1">→</span>
                )}
              </>
            );

            return (
              <Wrapper
                key={l.label}
                {...wrapperProps}
                className="bg-button-gradient group relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 shadow-button-elegant transition-all hover:scale-[1.02] hover:shadow-glow"
              >
                {content}
              </Wrapper>
            );
          })}
        </nav>

        <section className="mt-12 w-full max-w-xs text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Casal Liberal em Maringá — PR
          </h2>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
            Somos um casal de Maringá do meio liberal. Produzimos conteúdo exclusivo.
            Relacionamento aberto, ménage, hotwife. Casal de Maringá, Casal Maringá, Secrets Maringá, Secrets Club Maringá
            consentimento.
          </p>
        </section>

        <footer className="mt-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 fill-crimson text-crimson" />
            <span>Maringá-Pr</span>
            <Heart className="h-3 w-3 fill-crimson text-crimson" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            © {new Date().getFullYear()} Casal Novinho Maringá
          </p>
        </footer>
      </div>
    </main>
  );
}
