import { createHash, randomInt, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { isValidTogoLocal } from "@/lib/phoneTogo";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 10;
const OTP_RESEND_SECONDS = 60;
const OTP_HOUR_LIMIT = 10;

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

function otpPepper() {
  return (process.env.OTP_PEPPER || secretKey() || "learnflow-otp").slice(0, 64);
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

function jumiaCodeEmail(code: string) {
  const digits = code.split("").map(
    (d) =>
      `<td style="width:40px;height:48px;border:2px solid #BAE0FF;border-radius:10px;background:#E6F4FF;text-align:center;font-size:22px;font-weight:800;color:#1677FF;letter-spacing:0;">${d}</td>`,
  );
  return wrapEmail(
    "Confirme que c’est toi",
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Pour protéger ton compte, entre ce code à 6 chiffres dans <strong>LearnFlow</strong>.</p>
<table role="presentation" cellspacing="8" cellpadding="0" style="margin:0 auto 20px;"><tr>${digits.join("")}</tr></table>
<p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#57534E;">Valable <strong>10 minutes</strong>. Aucun lien à cliquer — copie seulement ces chiffres.</p>
<p style="margin:0;font-size:13px;line-height:1.5;color:#78716C;">LearnFlow ne te demandera jamais ce code par téléphone. Si tu n’as rien demandé, ignore ce message.</p>`,
  );
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

function otpPlainText(code: string) {
  return `LearnFlow — code de confirmation : ${code}\nValable 10 minutes. Aucun lien à cliquer. Ne partage ce code avec personne.`;
}

async function sendSmtp(to: string, subject: string, html: string, text?: string): Promise<{ ok: boolean; error?: string }> {
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = (process.env.SMTP_PASS ?? "").replace(/\s/g, "").trim();
  if (!user || !pass) return { ok: false, error: "no_smtp" };
  const host = (process.env.SMTP_HOST ?? "smtp.gmail.com").trim();
  const preferred = Number(process.env.SMTP_PORT || 465);
  const from = (process.env.SMTP_FROM ?? `LearnFlow <${user}>`).trim();
  const ports = preferred === 587 ? [587, 465] : [465, 587];
  let lastError = "smtp_error";
  for (const port of ports) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 20000,
        auth: { user, pass },
      });
      await transporter.sendMail({ from, to, subject, html, text: text || subject });
      return { ok: true };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "smtp_error";
    }
  }
  return { ok: false, error: lastError.slice(0, 240) };
}

async function sendHtmlEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<{ ok: boolean; error?: string; via?: string }> {
  const smtp = await sendSmtp(to, subject, html, text);
  if (smtp.ok) return { ok: true, via: "smtp" };
  const resend = await sendResend(to, subject, html);
  if (resend.ok) return { ok: true, via: "resend" };
  const smtpHint = smtp.error && smtp.error !== "no_smtp" ? smtp.error : "";
  return { ok: false, error: smtpHint || resend.error };
}

async function sendResend(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key) {
    return {
      ok: false,
      error: "Ajoute RESEND_API_KEY dans learnflow-web/.env.local pour envoyer le code à 6 chiffres.",
    };
  }
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
    const lower = body.toLowerCase();
    if (lower.includes("only send testing emails") || lower.includes("verify a domain")) {
      return {
        ok: false,
        error:
          "Resend est encore en mode test : vérifie un domaine, ou envoie d’abord vers l’email du compte Resend.",
      };
    }
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

function goTrueErrorMessage(body: string, status: number) {
  try {
    const json = JSON.parse(body) as { msg?: string; error_description?: string; error?: string; message?: string };
    return json.msg || json.error_description || json.message || json.error || `HTTP ${status}`;
  } catch {
    return body.slice(0, 240) || `HTTP ${status}`;
  }
}

/** Mailer Supabase : 6 chiffres, sans lien. create_user true sinon « otp_disabled ». */
async function sendGoTrueOtp(email: string): Promise<{ ok?: true; error?: string }> {
  const url = supabaseUrl();
  const key = secretKey() || anonKey();
  if (!url || !key) return { error: "Supabase n’est pas configuré." };
  const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/otp`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, create_user: true }),
  });
  if (!res.ok) return { error: goTrueErrorMessage(await res.text(), res.status) };
  return { ok: true };
}

async function generateEmailOtp(email: string): Promise<{ code?: string; error?: string }> {
  const url = supabaseUrl();
  const key = secretKey();
  if (!url || !key) return { error: "La vérification n’est pas configurée (clé secrète Supabase)." };
  for (const type of ["magiclink", "signup"] as const) {
    const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, email }),
    });
    const body = await res.text();
    if (!res.ok) {
      if (type === "signup") return { error: goTrueErrorMessage(body, res.status) };
      continue;
    }
    try {
      const json = JSON.parse(body) as { email_otp?: string; properties?: { email_otp?: string } };
      const code = String(json.email_otp || json.properties?.email_otp || "").replace(/\D/g, "").slice(0, 6);
      if (code.length === 6) return { code };
    } catch {
      /* try next type */
    }
  }
  return { error: "Impossible de générer le code." };
}

function secondsLeft(fromIso: string, windowMs: number) {
  const elapsed = Date.now() - new Date(fromIso).getTime();
  return Math.max(0, Math.ceil((windowMs - elapsed) / 1000));
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

export async function handleSendOtp(
  user: { id: string; email?: string | null },
  _force = false,
  _createUser = false,
) {
  const email = (user.email ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Email du compte introuvable.", status: 400 };
  const admin = adminClient();
  if (!admin) return { error: "La vérification n’est pas configurée (clé secrète Supabase).", status: 500 };

  const { data: last } = await admin
    .from("email_challenges")
    .select("created_at, consumed_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last?.created_at) {
    const wait = secondsLeft(String(last.created_at), OTP_RESEND_SECONDS * 1000);
    if (wait > 0) {
      return {
        ok: true as const,
        channel: last.consumed_at ? ("supabase" as const) : ("learnflow" as const),
        reused: true,
        retryAfterSeconds: wait,
      };
    }
  }

  const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("email_challenges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", sinceHour);
  if ((count ?? 0) >= OTP_HOUR_LIMIT) {
    const wait = last?.created_at ? secondsLeft(String(last.created_at), 60 * 60 * 1000) : 3600;
    return {
      error: "Tu as demandé trop de codes. Attends le minuteur, puis réessaie.",
      status: 429,
      retryAfterSeconds: wait || 3600,
    };
  }

  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  const generated = await generateEmailOtp(email);
  const code = generated.code || String(randomInt(100000, 1000000));
  const sent = await sendHtmlEmail(
    email,
    "LearnFlow : ton code de confirmation",
    jumiaCodeEmail(code),
    otpPlainText(code),
  );
  if (sent.ok) {
    const { error: insertError } = await admin.from("email_challenges").insert({
      user_id: user.id,
      email,
      code_hash: hashOtp(user.id, code),
      expires_at: expiresAt,
    });
    if (insertError) {
      return { error: "Impossible d’enregistrer le code. Relance le SQL schema.sql dans Supabase.", status: 500 };
    }
    await logNotice(admin, user.id, "email", "otp", "sent", sent.via || "mail");
    return { ok: true as const, channel: "learnflow" as const, retryAfterSeconds: OTP_RESEND_SECONDS };
  }

  const fallback = await sendGoTrueOtp(email);
  if (fallback.ok) {
    await admin.from("email_challenges").insert({
      user_id: user.id,
      email,
      code_hash: "supabase-mailer",
      expires_at: expiresAt,
      consumed_at: new Date().toISOString(),
    });
    await logNotice(admin, user.id, "email", "otp", "sent", "supabase");
    return { ok: true as const, channel: "supabase" as const, retryAfterSeconds: OTP_RESEND_SECONDS };
  }

  await logNotice(admin, user.id, "email", "otp", "error", `${sent.error ?? ""} | ${fallback.error ?? ""}`.slice(0, 280));
  const rate = `${fallback.error ?? ""} ${sent.error ?? ""}`.toLowerCase();
  if (rate.includes("rate") || rate.includes("too many") || rate.includes("after")) {
    return {
      error:
        "L’email n’a pas pu partir (limite d’envoi). Vérifie un domaine Resend pour envoyer à tous les élèves, puis réessaie dans une minute.",
      status: 429,
      retryAfterSeconds: OTP_RESEND_SECONDS,
    };
  }
  if ((sent.error ?? "").toLowerCase().includes("testing emails") || (sent.error ?? "").toLowerCase().includes("verify a domain") || (sent.error ?? "") === "no_smtp") {
    return {
      error:
        "Le code n’est pas parti. Sans domaine, utilise Gmail : ajoute SMTP_USER (ton Gmail) et SMTP_PASS (mot de passe d’application Google) dans .env.local et Vercel.",
      status: 502,
      retryAfterSeconds: OTP_RESEND_SECONDS,
    };
  }
  return {
    error: "Impossible d’envoyer le code pour le moment. Vérifie ta boîte mail dans une minute, ou réessaie.",
    status: 502,
    retryAfterSeconds: OTP_RESEND_SECONDS,
  };
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

  if (!row?.id || !row.code_hash || row.code_hash === "supabase-mailer") {
    return { fallback: "supabase_otp" as const };
  }
  if (Number(row.attempts) >= OTP_MAX_ATTEMPTS) {
    await admin.from("email_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
    return {
      error: "10 essais atteints. Attends le minuteur, puis demande un nouveau code.",
      status: 429,
      attemptsLeft: 0,
      retryAfterSeconds: OTP_RESEND_SECONDS,
    };
  }
  if (new Date(String(row.expires_at)).getTime() < Date.now()) {
    await admin.from("email_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
    return { error: "Code expiré. Attends le minuteur, puis demande un nouveau code.", status: 400 };
  }

  const expected = hashOtp(user.id, code);
  if (!codesEqual(expected, String(row.code_hash))) {
    const nextAttempts = Number(row.attempts) + 1;
    const attemptsLeft = Math.max(0, OTP_MAX_ATTEMPTS - nextAttempts);
    await admin.from("email_challenges").update({ attempts: nextAttempts }).eq("id", row.id);
    if (attemptsLeft <= 0) {
      await admin.from("email_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
      return {
        error: "10 essais atteints. Attends le minuteur, puis demande un nouveau code.",
        status: 429,
        attemptsLeft: 0,
        retryAfterSeconds: OTP_RESEND_SECONDS,
      };
    }
    return {
      error: `Code incorrect. Il te reste ${attemptsLeft} essai${attemptsLeft > 1 ? "s" : ""}.`,
      status: 400,
      attemptsLeft,
    };
  }

  await admin.from("email_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
  return { ok: true as const, channel: "learnflow" as const };
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
    const sent = await sendHtmlEmail(email, "LearnFlow — connexion confirmée", html);
    const emailStatus = sent.ok ? "sent" : sent.error === "no_smtp" || sent.error?.startsWith("Ajoute RESEND_API_KEY") ? "skipped" : "error";
    await logNotice(admin, user.id, "email", event, emailStatus, sent.via || sent.error);
  }

  const parentPhone = student?.parent_phone?.trim() ?? "";
  const welcomeEvents = new Set(["signup", "parent_linked"]);
  if (parentPhone && welcomeEvents.has(event) && isValidTogoLocal(parentPhone)) {
    const text =
      `LearnFlow — suivi parental\n\n` +
      `Bonjour,\n\n` +
      `${name} vient d’ouvrir un compte LearnFlow avec votre numéro WhatsApp ${maskPhone(parentPhone)}.\n\n` +
      `Vous recevrez ici un petit point sur ses progrès, toutes les une à deux semaines.\n\n` +
      `Si vous n’êtes pas le parent ou tuteur, dites-le à ${name}.`;
    const wa = await sendWhatsApp(parentPhone, text);
    await logNotice(
      admin,
      user.id,
      "whatsapp",
      event === "signup" ? "signup" : "parent_linked",
      wa.ok ? "sent" : wa.skipped ? "skipped" : "error",
      wa.error,
    );
  }

  return { ok: true as const };
}
