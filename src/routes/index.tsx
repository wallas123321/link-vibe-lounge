import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Página em manutenção` },
      {
        name: "description",
        content:
          "Esta página está temporariamente em manutenção. Voltaremos em breve.",
      },
      { property: "og:title", content: `${SITE_NAME} — Página em manutenção` },
      {
        property: "og:description",
        content: "Esta página está temporariamente em manutenção.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="text-center text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Página em manutenção
      </p>
    </main>
  );
}
