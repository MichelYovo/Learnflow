import { createHash, randomInt, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MIN_INTERVAL_MS = 25_000;
const OTP_HOUR_LIMIT = 6;

export type SecureAction = "send-otp" | "verify-otp" | "login-notice";
export type AuthPlatform = "web" | "mobile";

type StudentRow = {
  id: string;
  name: string | null;
  email: string | null;
  parent_phone: string | null;
};

function supabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
}

function anonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();
}

function secretKey() {
  return (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
}

function otpPepper() {
  return (process.env.OTP_PEPPER || secretKey() || "learnflow-otp").slice(0, 64);
}

function adminClient() {
  const url = supabaseUrl();
  const key = secretKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) as any;
}

export async function userFromBearer(authorization: string | null) {
  const token = authorization?.replace(/^Bearer\s+/i, "").trim();
  const url = supabaseUrl();
  const anon = anonKey();
  if (!token || !url || !anon) return null;
  const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user?.id) return null;
  return data.user;
}

function hashOtp(userId: string, code: string) {
  return createHash("sha256").update(`${otpPepper()}:${userId}:${code}`).digest("hex");
}

function codesEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function formatLome(date = new Date()) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Lome",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function maskPhone(e164: string) {
  const digits = e164.replace(/\D/g, "");
  const local = digits.startsWith("228") ? digits.slice(3) : digits;
  if (local.length !== 8) return "+228 ••••••••";
  return `+228 ${local.slice(0, 2)} ** ** ${local.slice(6)}`;
}

function whatsappDigits(e164: string) {
  return e164.replace(/\D/g, "");
}

function appLabel(platform: AuthPlatform) {
  return platform === "mobile" ? "l’application mobile LearnFlow" : "le site web LearnFlow";
}

function wrapEmail(title: string, inner: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#F5F5F4;font-family:Arial,Helvetica,sans-serif;color:#1C1917;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F5F4;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E7E5E4;">
<tr><td style="background:#1677FF;padding:22px 28px;">
<p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#E6F4FF;text-transform:uppercase;">LearnFlow</p>
<h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#FFFFFF;">${title}</h1>
</td></tr>
<tr><td style="padding:28px;">${inner}</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #F0EFEE;">
<p style="margin:0;font-size:12px;color:#A8A29E;">LearnFlow · collège et lycée · Togo</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

async function sendResend(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key) return { ok: false, error: "no_resend" };
  const from = (process.env.RESEND_FROM ?? "LearnFlow <noreply@learnflow.tg>").trim();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body.slice(0, 240) || `HTTP ${res.status}` };
  }
  return { ok: true };
}

async function sendWhatsApp(toE164: string, text: string): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const digits = whatsappDigits(toE164);
  if (digits.length < 11) return { ok: false, skipped: true, error: "invalid_phone" };

  const twilioSid = (process.env.TWILIO_ACCOUNT_SID ?? "").trim();
  const twilioToken = (process.env.TWILIO_AUTH_TOKEN ?? "").trim();
  const twilioFrom = (process.env.TWILIO_WHATSAPP_FROM ?? "").trim();
  if (twilioSid && twilioToken && twilioFrom) {
    const from = twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`;
    const body = new URLSearchParams({
      From: from,
      To: `whatsapp:+${digits}`,
      Body: text,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return { ok: false, error: (await res.text()).slice(0, 240) };
    return { ok: true };
  }

  const token = (process.env.WHATSAPP_TOKEN ?? "").trim();
  const phoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID ?? "").trim();
  const template = (process.env.WHATSAPP_TEMPLATE_NAME ?? "").trim();
  const templateLang = (process.env.WHATSAPP_TEMPLATE_LANG ?? "fr").trim();
  if (token && phoneId) {
    const payload = template
      ? {
          messaging_product: "whatsapp",
          to: digits,
          type: "template",
          template: {
            name: template,
            language: { code: templateLang },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: text.slice(0, 600) }],
              },
            ],
          },
        }
      : {
          messaging_product: "whatsapp",
          to: digits,
          type: "text",
          text: { body: text },
        };
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: (await res.text()).slice(0, 240) };
    return { ok: true };
  }

  const webhook = (process.env.PARENT_NOTIFY_WEBHOOK_URL ?? "").trim();
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "whatsapp", to: `+${digits}`, text }),
    });
    if (!res.ok) return { ok: false, error: `webhook ${res.status}` };
    return { ok: true };
  }

  return { ok: false, skipped: true, error: "no_whatsapp" };
}

async function logNotice(
  admin: any,
  studentId: string,
  channel: "email" | "whatsapp",
  event: string,
  status: "sent" | "skipped" | "error",
  detail?: string,
) {
  await admin.from("login_notices").insert({
    student_id: studentId,
    channel,
    event,
    status,
    detail: detail ? detail.slice(0, 280) : null,
  });
}

export async function handleSendOtp(user: { id: string; email?: string | null }, force = false) {
  const email = (user.email ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Email du compte introuvable.", status: 400 };
  const admin = adminClient();
  if (!admin || !(process.env.RESEND_API_KEY ?? "").trim()) {
    return { fallback: "supabase_otp" as const };
  }

  const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("email_challenges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", sinceHour);
  if ((count ?? 0) >= OTP_HOUR_LIMIT) {
    return { error: "Trop de tentatives. Réessaie dans une heure.", status: 429 };
  }

  const { data: last } = await admin
    .from("email_challenges")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last?.created_at && !force && Date.now() - new Date(last.created_at).getTime() < OTP_MIN_INTERVAL_MS) {
    return { ok: true as const, reused: true };
  }

  const code = String(randomInt(100000, 1000000));
  const { error } = await admin.from("email_challenges").insert({
    user_id: user.id,
    email,
    code_hash: hashOtp(user.id, code),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  if (error) return { fallback: "supabase_otp" as const };

  const html = wrapEmail(
    "Ton code de vérification",
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.5;">Bonjour,</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.5;">Voici le code à 6 chiffres pour confirmer que c’est bien toi qui te connectes à <strong>LearnFlow</strong>.</p>
<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;">Code LearnFlow</p>
<p style="margin:0 0 22px;font-size:32px;font-weight:800;letter-spacing:0.28em;color:#1677FF;">${code}</p>
<p style="margin:0;font-size:13px;line-height:1.5;color:#78716C;">Ce code expire dans 10 minutes. Ne le partage avec personne.</p>`,
  );
  const sent = await sendResend(email, "LearnFlow — ton code à 6 chiffres", html);
  if (!sent.ok) return { fallback: "supabase_otp" as const };
  return { ok: true as const, channel: "learnflow" as const };
}

export async function handleVerifyOtp(user: { id: string; email?: string | null }, token: string) {
  const code = token.replace(/\D/g, "").slice(0, 6);
  if (code.length !== 6) return { error: "Entre les 6 chiffres reçus par email.", status: 400 };
  const admin = adminClient();
  if (!admin) return { fallback: "supabase_otp" as const };

  const { data: row } = await admin
    .from("email_challenges")
    .select("id, code_hash, attempts, expires_at, consumed_at")
    .eq("user_id", user.id)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!row) return { fallback: "supabase_otp" as const };
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return { error: "Trop de tentatives. Renvoie un nouveau code.", status: 429 };
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { error: "Code expiré. Renvoie un nouveau code.", status: 400 };
  }

  const expected = hashOtp(user.id, code);
  if (!codesEqual(expected, row.code_hash)) {
    await admin
      .from("email_challenges")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    return { error: "Code incorrect ou expiré. Vérifie tes emails (et les spams) ou renvoie un code.", status: 400 };
  }

  await admin.from("email_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
  return { ok: true as const };
}

export async function handleLoginNotice(
  user: { id: string; email?: string | null },
  opts: { platform: AuthPlatform; event?: string },
) {
  const admin = adminClient();
  if (!admin) return { skipped: true as const, reason: "no_admin" };

  const { data: profile } = await admin
    .from("student_profiles")
    .select("id, name, email, parent_phone")
    .eq("id", user.id)
    .maybeSingle();

  const student = (profile as StudentRow | null) ?? null;
  const name = (student?.name || "Élève").trim();
  const email = (user.email || student?.email || "").trim().toLowerCase();
  const when = formatLome();
  const platform = opts.platform;
  const event = opts.event || "login";

  if (email.includes("@")) {
    const html = wrapEmail(
      "Connexion à LearnFlow",
      `<p style="margin:0 0 12px;font-size:15px;line-height:1.5;">Bonjour ${name},</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.5;">Une connexion à <strong>LearnFlow</strong> vient d’être confirmée.</p>
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;"><strong>Compte :</strong> ${email}<br/>
<strong>Quand :</strong> ${when} (heure du Togo)<br/>
<strong>Où :</strong> ${appLabel(platform)}</p>
<p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#78716C;">Si ce n’est pas toi, change ton mot de passe et contacte le support LearnFlow.</p>`,
    );
    const sent = await sendResend(email, "LearnFlow — connexion confirmée", html);
    await logNotice(admin, user.id, "email", event, sent.ok ? "sent" : sent.error === "no_resend" ? "skipped" : "error", sent.error);
  }

  const parentPhone = student?.parent_phone?.trim() ?? "";
  if (parentPhone) {
    const text =
      `LearnFlow — suivi parental\n\n` +
      `Bonjour,\n\n` +
      `L’élève ${name} s’est connecté(e) à LearnFlow avec votre numéro ${maskPhone(parentPhone)} pour le suivi parental sur l’application.\n\n` +
      `Quand : ${when} (heure du Togo)\n` +
      `Application : ${appLabel(platform)}\n\n` +
      `Si vous n’êtes pas d’accord, parlez-en à l’élève ou contactez LearnFlow.`;
    const wa = await sendWhatsApp(parentPhone, text);
    await logNotice(
      admin,
      user.id,
      "whatsapp",
      event,
      wa.ok ? "sent" : wa.skipped ? "skipped" : "error",
      wa.error,
    );
  }

  return { ok: true as const };
}
