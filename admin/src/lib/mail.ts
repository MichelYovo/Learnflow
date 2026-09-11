function fromAddress() {
  return (
    process.env.SMTP_FROM?.trim() ||
    process.env.RESEND_FROM?.trim() ||
    (process.env.SMTP_USER ? `LearnFlow <${process.env.SMTP_USER.trim()}>` : "LearnFlow <noreply@learnflow.tg>")
  );
}

export function isMailConfigured() {
  return Boolean(
    (process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()) || process.env.RESEND_API_KEY?.trim(),
  );
}

export function wrapLearnflowEmail(title: string, innerHtml: string) {
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
<tr><td style="padding:28px;">${innerHtml}</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #F0EFEE;">
<p style="margin:0;font-size:12px;color:#A8A29E;">LearnFlow · collège et lycée · Togo</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function bodyToHtml(body: string, link?: string) {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const button = link
    ? `<p style="margin:24px 0 8px;text-align:center;"><a href="${link}" style="display:inline-block;background:#1677FF;color:#FFFFFF;text-decoration:none;font-weight:800;padding:12px 22px;border-radius:14px;">Continuer sur LearnFlow</a></p>
<p style="margin:0;font-size:12px;color:#78716C;word-break:break-all;">${link}</p>`
    : "";
  return `<p style="margin:0;font-size:15px;line-height:1.6;">${escaped}</p>${button}`;
}

async function sendSmtp(to: string, subject: string, html: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = (process.env.SMTP_PASS ?? "").replace(/\s/g, "").trim();
  if (!user || !pass) return { ok: false, error: "no_smtp" };
  const host = (process.env.SMTP_HOST ?? "smtp.gmail.com").trim();
  const preferred = Number(process.env.SMTP_PORT || 587);
  const from = fromAddress();
  const ports = preferred === 465 ? [465, 587] : [587, 465];
  let lastError = "smtp_error";
  for (const port of ports) {
    try {
      const nodemailer = await import("nodemailer");
      const createTransport = nodemailer.createTransport ?? nodemailer.default.createTransport;
      const transporter = createTransport({
        host,
        port,
        secure: port === 465,
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 20000,
        auth: { user, pass },
      });
      await transporter.sendMail({ from, to, subject, html, text });
      return { ok: true };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "smtp_error";
    }
  }
  return { ok: false, error: lastError.slice(0, 240) };
}

async function sendResend(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key) return { ok: false, error: "no_resend" };
  const from = (process.env.RESEND_FROM ?? fromAddress()).trim();
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

export async function sendStudentEmail(opts: {
  to: string;
  subject: string;
  body: string;
  link?: string;
}): Promise<{ ok: boolean; via?: string; error?: string }> {
  const to = opts.to.trim();
  if (!to || !to.includes("@")) return { ok: false, error: "Email élève manquant." };
  const html = wrapLearnflowEmail(opts.subject, bodyToHtml(opts.body, opts.link));
  const text = opts.link ? `${opts.body}\n\nContinuer : ${opts.link}` : opts.body;
  const smtp = await sendSmtp(to, opts.subject, html, text);
  if (smtp.ok) return { ok: true, via: "smtp" };
  const resend = await sendResend(to, opts.subject, html);
  if (resend.ok) return { ok: true, via: "resend" };
  const hint = smtp.error && smtp.error !== "no_smtp" ? smtp.error : resend.error;
  return { ok: false, error: hint || "Configure SMTP ou RESEND_API_KEY dans admin/.env.local." };
}
