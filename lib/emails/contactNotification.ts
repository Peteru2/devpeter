import { site } from "@/data/site";

export type ContactEmailData = {
  name: string;
  email: string;
  reason: "job" | "project" | "other";
  service?: string;
  budget?: string;
  message: string;
};

const reasonLabels = { job: "Job opportunity", project: "Project", other: "Something else" } as const;

/* Never put visitor input into HTML without escaping it */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const colors = {
  page: "#f2efe8",
  card: "#faf8f3",
  ink: "#16181d",
  muted: "#5b6070",
  line: "#e3dfd6",
  accent: "#2747c8",
  white: "#ffffff",
};

const fonts = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, Menlo, Consolas, 'Courier New', monospace",
};

export function contactNotification(d: ContactEmailData) {
  const reason = reasonLabels[d.reason];
  const subject = `${reason} from ${d.name}`;

  const received = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date());

  const name = escapeHtml(d.name);
  const email = escapeHtml(d.email);
  const message = escapeHtml(d.message).replace(/\r?\n/g, "<br>");
  const preview = escapeHtml(d.message.slice(0, 110));
  const replyHref = `mailto:${encodeURIComponent(d.email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const siteLabel = site.url ? escapeHtml(site.url.replace(/^https?:\/\//, "")) : "your portfolio";

  const rows: [string, string][] = [
    [
      "From",
      `${name}<br><a href="mailto:${email}" style="color:${colors.accent};text-decoration:none;">${email}</a>`,
    ],
    ["About", reason],
    ...(d.service ? ([["Service", escapeHtml(d.service)]] as [string, string][]) : []),
    ...(d.budget ? ([["Budget", escapeHtml(d.budget)]] as [string, string][]) : []),
    ["Received", `${received} (WAT)`],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px 12px 0;border-top:1px solid ${colors.line};width:96px;vertical-align:top;font-family:${fonts.mono};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${colors.muted};">${label}</td>
          <td style="padding:12px 0;border-top:1px solid ${colors.line};vertical-align:top;font-family:${fonts.sans};font-size:15px;line-height:1.5;color:${colors.ink};">${value}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${colors.card};border:1px solid ${colors.line};border-radius:16px;">
          <tr>
            <td style="padding:28px 32px 0;font-family:${fonts.mono};font-size:11px;letter-spacing:0.08em;color:${colors.muted};">
              <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${colors.accent};vertical-align:middle;"></span>
              &nbsp;NEW MESSAGE · PORTFOLIO
            </td>
          </tr>

          <tr>
            <td style="padding:14px 32px 0;">
              <h1 style="margin:0;font-family:${fonts.serif};font-weight:400;font-size:30px;line-height:1.15;color:${colors.ink};">
                ${escapeHtml(reason)} from <em style="color:${colors.accent};">${name}</em>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 10px;font-family:${fonts.mono};font-size:11px;letter-spacing:0.06em;color:${colors.muted};">MESSAGE</p>
              <div style="background:${colors.white};border:1px solid ${colors.line};border-radius:12px;padding:20px;font-family:${fonts.sans};font-size:16px;line-height:1.65;color:${colors.ink};">
                ${message}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 32px;">
              <a href="${replyHref}" style="display:inline-block;background:${colors.ink};color:${colors.card};padding:14px 24px;border-radius:999px;font-family:${fonts.sans};font-size:15px;font-weight:600;text-decoration:none;">
                Reply to ${name} &rarr;
              </a>
              <p style="margin:14px 0 0;font-family:${fonts.sans};font-size:13px;line-height:1.5;color:${colors.muted};">
                Or just hit Reply. It goes straight to ${email}.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0;font-family:${fonts.sans};font-size:12px;color:${colors.muted};">
          Sent from the contact form on ${siteLabel}
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `${reason} from ${d.name}`,
    "",
    `From: ${d.name} <${d.email}>`,
    `About: ${reason}`,
    d.service ? `Service: ${d.service}` : null,
    d.budget ? `Budget: ${d.budget}` : null,
    `Received: ${received} (WAT)`,
    "",
    "Message:",
    d.message,
    "",
    "Reply to this email to respond directly.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}