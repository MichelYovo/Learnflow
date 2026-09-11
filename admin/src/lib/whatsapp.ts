function whatsappDigits(e164: string) {
  return e164.replace(/\D/g, "");
}

export function isWhatsAppConfigured() {
  return Boolean(
    ((process.env.TWILIO_ACCOUNT_SID ?? "").trim() &&
      (process.env.TWILIO_AUTH_TOKEN ?? "").trim() &&
      (process.env.TWILIO_WHATSAPP_FROM ?? "").trim()) ||
      ((process.env.WHATSAPP_TOKEN ?? "").trim() && (process.env.WHATSAPP_PHONE_NUMBER_ID ?? "").trim()) ||
      (process.env.PARENT_NOTIFY_WEBHOOK_URL ?? "").trim(),
  );
}

export async function sendWhatsApp(toE164: string, text: string): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const digits = whatsappDigits(toE164);
  if (digits.length < 11) return { ok: false, skipped: true, error: "Numéro invalide." };

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
            components: [{ type: "body", parameters: [{ type: "text", text: text.slice(0, 600) }] }],
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

  return {
    ok: false,
    skipped: true,
    error: "Ajoute Twilio, WhatsApp Cloud ou PARENT_NOTIFY_WEBHOOK_URL dans admin/.env.local.",
  };
}

export function waMeLink(e164: string, text: string) {
  const digits = e164.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function welcomeParentText(opts: { name: string; classe: string; cadenceDays: number }) {
  const rythme = opts.cadenceDays <= 7 ? "chaque semaine" : "toutes les deux semaines";
  return (
    `LearnFlow — suivi parental\n\n` +
    `Bonjour,\n\n` +
    `${opts.name} (${opts.classe}) vient d’ouvrir un compte LearnFlow avec votre numéro WhatsApp.\n\n` +
    `Vous recevrez ici un petit point sur ses progrès, ${rythme}.\n\n` +
    `Si vous n’êtes pas le parent ou tuteur, dites-le à ${opts.name}.`
  );
}

export function recapParentText(opts: {
  name: string;
  classe: string;
  xp: number;
  streak: number;
  lessons: number;
  league: string;
  lastSeen?: string;
}) {
  const last = opts.lastSeen
    ? `Dernière activité : ${new Date(opts.lastSeen).toLocaleString("fr-FR", { timeZone: "Africa/Lome" })}\n\n`
    : "";
  return (
    `LearnFlow — point de progression\n\n` +
    `Bonjour,\n\n` +
    `Voici le suivi de ${opts.name} (${opts.classe}) :\n\n` +
    `• ${opts.xp.toLocaleString("fr-FR")} XP\n` +
    `• Série : ${opts.streak} jour${opts.streak > 1 ? "s" : ""}\n` +
    `• Leçons terminées : ${opts.lessons}\n` +
    `• Ligue : ${opts.league}\n\n` +
    last +
    `Merci de l’encourager à continuer.`
  );
}
