// Configuração central de SEO
// ⚠️ Quando tiver domínio próprio, troque SITE_URL aqui (uma única vez)
export const SITE_URL = "https://casalmaringa.com";

export const SITE_NAME = "Casal Novinho Maringá";

export const SEO_KEYWORDS = [
  "casal maringá",
  "casal de maringá",
  "casal liberal maringá",
  "meio liberal maringá",
  "swing maringá",
  "swing paraná",
  "hotwife maringá",
  "cuckold maringá",
  "ménage maringá",
  "menage maringá",
  "casal swinger maringá",
  "relacionamento aberto maringá",
  "vida a dois liberal",
  "casal liberal paraná",
].join(", ");

export const DEFAULT_TITLE =
  "Casal Novinho Maringá — Casal Liberal | Swing, Hotwife e Ménage em Maringá PR";

export const DEFAULT_DESCRIPTION =
  "Casal liberal de Maringá-PR. Casados, do meio liberal e swing, só saímos juntos. " +
  "Conteúdo exclusivo, hotwife, ménage e encontros com casais e solteiros selecionados em Maringá e região.";

// JSON-LD do site (ProfilePage + localização)
export const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: SITE_NAME,
  url: SITE_URL,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    areaServed: {
      "@type": "City",
      name: "Maringá",
      containedInPlace: {
        "@type": "State",
        name: "Paraná",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Maringá",
      addressRegion: "PR",
      addressCountry: "BR",
    },
  },
};
