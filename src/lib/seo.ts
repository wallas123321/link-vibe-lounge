export const SITE_URL = "https://casalmaringa.com";
export const SITE_NAME = "Casal Secrets Maringá";

export const PROFILE_DESCRIPTION =
  "Conheça o Casal Secrets Maringá, casal liberal de Maringá (PR). Veja as prévias da galeria e encontre o perfil do casal no Privacy. Para maiores de 18 anos.";

export function pageHead(path: "/" | "/previas", title: string, description: string) {
  const url = new URL(path, SITE_URL).href;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: "Secrets Maringá",
      inLanguage: "pt-BR",
    },
    {
      "@type": "ProfilePage",
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: {
        "@type": "Organization",
        name: SITE_NAME,
        description: PROFILE_DESCRIPTION,
        location: {
          "@type": "City",
          name: "Maringá",
          containedInPlace: { "@type": "State", name: "Paraná" },
        },
      },
    },
  ],
};
