import { NextResponse } from "next/server";

const TOPICS = new Set(["support", "waitlist"]);
const hits = new Map<string, { n: number; t: number }>();

function adminInboxUrl() {
  return (process.env.ADMIN_INBOX_URL ?? process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001").replace(/\/$/, "");
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 60 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  if (row.n >= 8) return true;
  row.n += 1;
  return false;
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "Trop de messages. Réessaie dans un moment." }, { status: 429 });
  }

  let body: { name?: string; email?: string; message?: string; topic?: string; company?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if ((body.company ?? "").trim()) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  const topic = (body.topic ?? "support").trim();

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Indique ton prénom (2 caractères minimum)." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ error: "Indique un email valide." }, { status: 400 });
  }
  if (message.length < 8 || message.length > 2000) {
    return NextResponse.json({ error: "Écris un message un peu plus long." }, { status: 400 });
  }
  if (!TOPICS.has(topic)) {
    return NextResponse.json({ error: "Sujet inconnu." }, { status: 400 });
  }

  try {
    const res = await fetch(`${adminInboxUrl()}/api/public/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, topic }),
      cache: "no-store",
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      return NextResponse.json(
        { error: json.error || "Le message n’a pas pu partir. Vérifie que l’admin tourne (port 3001)." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Impossible de joindre le dashboard admin. Lance-le sur le port 3001." },
      { status: 502 },
    );
  }
}
