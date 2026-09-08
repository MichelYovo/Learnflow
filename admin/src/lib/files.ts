export const IMAGE_ACCEPT =
  "image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif";

export const COURSE_ACCEPT =
  "application/pdf,.pdf,text/plain,.txt,image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif";

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

function tokens(accept: string) {
  return accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export function fileMatchesAccept(file: File, accept: string) {
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return tokens(accept).some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      if (type.startsWith(prefix)) return true;
      if (prefix === "image/") return /\.(png|jpe?g|webp|gif|bmp)$/i.test(name);
      return false;
    }
    if (type && (type === token || (token === "application/pdf" && type.includes("pdf")))) return true;
    if (token === "application/pdf") return name.endsWith(".pdf");
    if (token === "text/plain") return name.endsWith(".txt");
    if (token.startsWith("image/")) {
      const ext = token.slice("image/".length);
      return name.endsWith(`.${ext}`) || (ext === "jpeg" && name.endsWith(".jpg"));
    }
    return false;
  });
}

function dedupe(files: File[]) {
  const seen = new Set<string>();
  return files.filter((f) => {
    const key = `${f.name}:${f.size}:${f.lastModified}:${f.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function filesFromDataTransfer(dt: DataTransfer | null | undefined): File[] {
  if (!dt) return [];
  const out: File[] = [];
  if (dt.files?.length) out.push(...Array.from(dt.files));
  if (dt.items) {
    for (const item of Array.from(dt.items)) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) out.push(file);
      }
    }
  }
  return dedupe(out);
}

export function filesFromClipboard(e: ClipboardEvent): File[] {
  return filesFromDataTransfer(e.clipboardData);
}

export function transferHasFiles(dt: DataTransfer | null | undefined) {
  if (!dt) return false;
  const types = Array.from(dt.types ?? []);
  return types.includes("Files") || (dt.files?.length ?? 0) > 0;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

export function pickIncomingFile(files: File[], accept: string): { file?: File; error?: string } {
  if (!files.length) return { error: "Aucun fichier." };
  const match = files.find((f) => fileMatchesAccept(f, accept));
  if (!match) {
    return { error: "Ce type de fichier n’est pas accepté ici." };
  }
  if (match.size > MAX_UPLOAD_BYTES) {
    return { error: `Fichier trop lourd (max ${formatBytes(MAX_UPLOAD_BYTES)}).` };
  }
  if (match.size === 0) {
    return { error: "Fichier vide." };
  }
  return { file: match };
}

export function isImageFile(file: File) {
  return (file.type || "").startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name);
}

export function isPdfFile(file: File) {
  return (file.type || "").includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
}
