export const PHOTO_WIDTH = 600;
export const PHOTO_HEIGHT = 800;
export const PHOTO_BLUR = 12;
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export function cropGeometry(width: number, height: number, zoom: number, x: number, y: number) {
  const scale = Math.max(PHOTO_WIDTH / width, PHOTO_HEIGHT / height) * zoom;
  const w = width * scale;
  const h = height * scale;
  return { width: w, height: h, left: -(w - PHOTO_WIDTH) * x, top: -(h - PHOTO_HEIGHT) * y };
}

/** Draw only a flattened, blurred preview. The source image is never uploaded. */
export function drawPhoto(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  rotation: number,
  zoom: number,
  x: number,
  y: number,
) {
  const turned = document.createElement("canvas");
  const sideways = Math.abs(rotation % 180) === 90;
  turned.width = sideways ? image.naturalHeight : image.naturalWidth;
  turned.height = sideways ? image.naturalWidth : image.naturalHeight;
  const tc = turned.getContext("2d");
  if (!tc) throw new Error("Seu navegador não suporta o editor de fotos.");
  tc.translate(turned.width / 2, turned.height / 2);
  tc.rotate((rotation * Math.PI) / 180);
  tc.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  const crop = document.createElement("canvas");
  crop.width = PHOTO_WIDTH;
  crop.height = PHOTO_HEIGHT;
  const cc = crop.getContext("2d");
  if (!cc) throw new Error("Não foi possível preparar a foto.");
  const geometry = cropGeometry(turned.width, turned.height, zoom, x, y);
  cc.drawImage(turned, geometry.left, geometry.top, geometry.width, geometry.height);
  canvas.width = PHOTO_WIDTH;
  canvas.height = PHOTO_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível preparar a prévia.");
  // Draw reflected edges before blurring to avoid transparent borders.
  const pad = PHOTO_BLUR * 3;
  const padded = document.createElement("canvas");
  padded.width = PHOTO_WIDTH + pad * 2;
  padded.height = PHOTO_HEIGHT + pad * 2;
  const pc = padded.getContext("2d");
  if (!pc) throw new Error("Não foi possível aplicar o desfoque.");
  pc.drawImage(crop, pad, pad);
  pc.drawImage(crop, 0, 0, 1, PHOTO_HEIGHT, 0, pad, pad, PHOTO_HEIGHT);
  pc.drawImage(
    crop,
    PHOTO_WIDTH - 1,
    0,
    1,
    PHOTO_HEIGHT,
    pad + PHOTO_WIDTH,
    pad,
    pad,
    PHOTO_HEIGHT,
  );
  pc.drawImage(crop, 0, 0, PHOTO_WIDTH, 1, pad, 0, PHOTO_WIDTH, pad);
  pc.drawImage(
    crop,
    0,
    PHOTO_HEIGHT - 1,
    PHOTO_WIDTH,
    1,
    pad,
    pad + PHOTO_HEIGHT,
    PHOTO_WIDTH,
    pad,
  );
  // A small downsample also guarantees blur in browsers without canvas filters.
  const tiny = document.createElement("canvas");
  tiny.width = 40;
  tiny.height = 53;
  tiny.getContext("2d")!.drawImage(padded, 0, 0, tiny.width, tiny.height);
  ctx.filter = `blur(${PHOTO_BLUR}px) brightness(1.1)`;
  ctx.drawImage(tiny, -pad, -pad, padded.width, padded.height);
  ctx.filter = "none";
}

export function photoBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível salvar a foto."))),
      "image/jpeg",
      0.88,
    );
  });
}
