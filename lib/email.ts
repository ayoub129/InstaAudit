import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL || "support@instaaudit.org"

const APP_URL =
  process.env.NEXTAUTH_URL || process.env.APP_URL || "http://localhost:3000"

const FROM_EMAIL =
  process.env.EMAIL_FROM || "InstaAudit <support@instaaudit.org>"

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const url = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your InstaAudit email",
    html: `
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  })

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`)
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const url = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}`

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your InstaAudit password",
    html: `
      <p>Hi ${name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  })

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`)
  }
}

export async function sendSupportTicketEmail(ticket: {
  ticketId: string
  userName: string
  userEmail: string
  category: string
  subject: string
  message: string
}): Promise<void> {
  // Notify the support team
  await resend.emails.send({
    from: FROM_EMAIL,
    to: SUPPORT_EMAIL,
    replyTo: ticket.userEmail,
    subject: `[Support #${ticket.ticketId.slice(-6).toUpperCase()}] ${ticket.subject}`,
    html: `
      <h2>New Support Ticket</h2>
      <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
      <p><strong>From:</strong> ${ticket.userName} &lt;${ticket.userEmail}&gt;</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <hr />
      <p>${ticket.message.replace(/\n/g, "<br />")}</p>
    `,
  })

  // Send confirmation to the user
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ticket.userEmail,
    subject: `We received your message — Ticket #${ticket.ticketId.slice(-6).toUpperCase()}`,
    html: `
      <p>Hi ${ticket.userName},</p>
      <p>Thanks for reaching out! We've received your support request and will get back to you within <strong>24 hours</strong>.</p>
      <p><strong>Ticket ID:</strong> #${ticket.ticketId.slice(-6).toUpperCase()}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <hr />
      <p style="color:#666;">Your message:</p>
      <p>${ticket.message.replace(/\n/g, "<br />")}</p>
      <hr />
      <p>You can reply directly to this email if you have anything to add.</p>
      <p>— The InstaAudit Support Team</p>
    `,
  })
}