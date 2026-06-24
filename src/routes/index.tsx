import { createFileRoute } from "@tanstack/react-router";
import { Heart, Instagram, MessageCircle, Sparkles, Crown, Star, Mail, Camera, Gift } from "lucide-react";
import heroAvatar from "@/assets/hero-avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lust & Co. — Seus desejos em um só lugar" },
      { name: "description", content: "Acesse todos os meus links exclusivos. Conteúdo adulto, sensual e picante para maiores de 18 anos." },
      { property: "og:title", content: "Lust & Co. — Seus desejos em um só lugar" },
      { property: "og:description", content: "Acesse todos os meus links exclusivos. Conteúdo adulto e picante." },
    ],
  }),
  component: Index,
});

type LinkItem = {
  label: string;
  sub?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
};

const links: LinkItem[] = [
  { label: "Conteúdo VIP Exclusivo", sub: "Acesso completo • +18", href: "#", icon: Crown, featured: true },
  { label: "Pack Personalizado", sub: "Só pra você, do meu jeito", href: "#", icon: Gift },
  { label: "Chat Privado", sub: "Vamos conversar a sós", href: "#", icon: MessageCircle },
  { label: "Galeria Sensual", sub: "Ensaios e bastidores", href: "#", icon: Camera },
  { label: "Instagram", sub: "@seuperfil", href: "#", icon: Instagram },
  { label: "Lista de Desejos", sub: "Me presenteie", href: "#", icon: Heart },
  { label: "Agendar Encontro", sub: "Disponibilidade limitada", href: "#", icon: Star },
  { label: "Contato Direto", sub: "Negócios & parcerias", href: "#", icon: Mail },
];

function Index() {
  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      {/* Smoky glow accents */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-crimson/30 blur-[120px] animate-smoke" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-rose/20 blur-[140px] animate-smoke" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-12">
        {/* +18 badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-crimson/40 bg-background/40 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-crimson" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Conteúdo Adulto • +18
          </span>
        </div>

        {/* Avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-crimson/40 blur-2xl animate-pulse-glow" />
          <div className="relative h-36 w-36 overflow-hidden rounded-full ring-2 ring-crimson/60 ring-offset-4 ring-offset-background shadow-glow">
            <img
              src={heroAvatar}
              alt="Foto de perfil sensual"
              width={768}
              height={768}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Name + bio */}
        <h1 className="text-center text-5xl font-semibold italic leading-none">
          <span className="text-gold-gradient">Lust</span>
          <span className="text-foreground"> & </span>
          <span className="text-gold-gradient">Co.</span>
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground max-w-xs">
          Bem-vindo ao meu mundo. Aqui você encontra tudo que sua imaginação pede — sem censura, sem pressa.
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Sensual", "Exclusivo", "Sem Tabu"].map((t) => (
            <span key={t} className="rounded-full bg-card-gradient border border-crimson/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-rose">
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <nav className="mt-10 flex w-full flex-col gap-3">
          {links.map((l) => {
            const Icon = l.icon;
            if (l.featured) {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  className="bg-button-gradient group relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 shadow-button-elegant transition-all hover:scale-[1.02] hover:shadow-glow"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/25 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold tracking-wide text-foreground">{l.label}</div>
                    {l.sub && <div className="text-[11px] uppercase tracking-widest text-foreground/70">{l.sub}</div>}
                  </div>
                  <span className="rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                    VIP
                  </span>
                </a>
              );
            }
            return (
              <a
                key={l.label}
                href={l.href}
                className="bg-card-gradient group flex items-center gap-4 rounded-2xl border border-crimson/20 px-5 py-4 backdrop-blur-md shadow-card-elegant transition-all hover:scale-[1.02] hover:border-crimson/60 hover:bg-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crimson/15 text-crimson transition-colors group-hover:bg-crimson/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-foreground">{l.label}</div>
                  {l.sub && <div className="text-xs text-muted-foreground">{l.sub}</div>}
                </div>
                <span className="text-muted-foreground transition-transform group-hover:translate-x-1">→</span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 fill-crimson text-crimson" />
            <span>Apenas para maiores de 18 anos</span>
            <Heart className="h-3 w-3 fill-crimson text-crimson" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            © {new Date().getFullYear()} Lust & Co.
          </p>
        </footer>
      </div>
    </main>
  );
}
