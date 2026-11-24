export const CHECKOUT_URL = "https://privacy.com.br/checkout/casaldemaringa";

// Vite bundles the images: no database, API requests, or storage account.
const images = import.meta.glob<string>("/src/assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const staticPhotos = Object.entries(images)
  .sort(([a], [b]) => b.localeCompare(a))
  .map(([path, src]) => ({
    id: path,
    src,
    title: (path.split("__").pop() ?? "Foto da galeria").replace(/\.[^.]+$/, "").replace(/-/g, " "),
  }));
