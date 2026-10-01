/**
 * Downscale + compress user-uploaded images before storing as dataURL.
 * Prevents localStorage quota blowout from raw phone photos (5-10MB).
 * Returns a JPEG dataURL <= ~200KB in most cases.
 */
export async function compressImageFile(file: File, maxDim = 800, quality = 0.72): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(async () => {
    // Fallback for browsers without createImageBitmap file support
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      return await drawToCanvas(img, maxDim, quality);
    } finally {
      URL.revokeObjectURL(url);
    }
  });

  if (typeof bitmap === 'string') return bitmap;

  const canvas = document.createElement('canvas');
  let { width, height } = bitmap as ImageBitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(bitmap as ImageBitmap, 0, 0, width, height);
  (bitmap as ImageBitmap).close?.();
  return canvas.toDataURL('image/jpeg', quality);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function drawToCanvas(img: HTMLImageElement, maxDim: number, quality: number): Promise<string> {
  const canvas = document.createElement('canvas');
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

export function isValidEmail(email: string): boolean {
  if (!email) return true; // optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // optional field
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function parseBirthYear(input: string, fallback = 0): number {
  if (!input) return fallback;
  const match = input.match(/(1[5-9]\d{2}|20\d{2})/);
  if (match) return parseInt(match[1], 10);
  const num = parseInt(input.slice(0, 4), 10);
  return Number.isFinite(num) ? num : fallback;
}

export function isValidYear(year: number): boolean {
  const current = new Date().getFullYear();
  return Number.isFinite(year) && year >= 1850 && year <= current + 1;
}
