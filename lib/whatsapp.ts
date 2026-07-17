/**
 * WhatsApp Cloud API (Meta) utility
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WA_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface TextMessage {
  type: 'text';
  to: string;
  body: string;
}

interface TemplateMessage {
  type: 'template';
  to: string;
  templateName: string;
  languageCode?: string;
  components?: object[];
}

type WAMessage = TextMessage | TemplateMessage;

async function sendWAMessage(msg: WAMessage): Promise<{ success: boolean; error?: string }> {
  if (!WA_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('[WhatsApp] Missing credentials. Skipping message.');
    return { success: false, error: 'Missing WhatsApp credentials' };
  }

  // Normalize phone: remove +, spaces, ensure 91 prefix for India
  let phone = msg.to.replace(/[\s\-\(\)]/g, '');
  if (!phone.startsWith('91') && phone.length === 10) phone = '91' + phone;
  if (phone.startsWith('+')) phone = phone.slice(1);

  let payload: object;

  if (msg.type === 'template') {
    payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: msg.templateName,
        language: { code: msg.languageCode || 'en_US' },
        components: msg.components || [],
      },
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: msg.body },
    };
  }

  try {
    const res = await fetch(WA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[WhatsApp] API Error:', data);
      return { success: false, error: JSON.stringify(data) };
    }
    return { success: true };
  } catch (err) {
    console.error('[WhatsApp] Fetch error:', err);
    return { success: false, error: String(err) };
  }
}

// ─── High-level helpers ────────────────────────────────────────────────────

/** Send a plain text WhatsApp message */
export async function sendWhatsApp(phone: string, message: string) {
  return sendWAMessage({ type: 'text', to: phone, body: message });
}

/** Notify candidate when their application is received */
export async function notifyCandidateApplied(phone: string, candidateName: string, jobTitle: string, companyName: string) {
  const msg =
    `Hi ${candidateName}! 👋\n\n` +
    `Your application for *${jobTitle}* at *${companyName}* has been received successfully.\n\n` +
    `We'll review your profile and get back to you soon. Stay tuned! 🚀\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}

/** Notify candidate when their status changes */
export async function notifyCandidateStatusChange(phone: string, candidateName: string, jobTitle: string, newStatus: string) {
  const statusEmoji: Record<string, string> = {
    shortlisted: '🎉',
    interview_scheduled: '📅',
    selected: '✅',
    offered: '🎊',
    offer_accepted: '🌟',
    joined: '🏆',
    rejected: '😔',
  };
  const emoji = statusEmoji[newStatus] || '📋';
  const statusLabel = newStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const msg =
    `${emoji} Hi ${candidateName}!\n\n` +
    `Your application status for *${jobTitle}* has been updated to:\n` +
    `*${statusLabel}*\n\n` +
    `${newStatus === 'rejected' ? "We appreciate your time and wish you the best in your job search." : "Our team will reach out to you with next steps soon."}\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}

/** Notify candidate when interview is scheduled */
export async function notifyInterviewScheduled(
  phone: string,
  candidateName: string,
  jobTitle: string,
  interviewDate: string,
  interviewTime: string,
  interviewMode: string,
  notes?: string
) {
  const msg =
    `📅 Hi ${candidateName}!\n\n` +
    `Your interview has been scheduled!\n\n` +
    `📌 *Position:* ${jobTitle}\n` +
    `📆 *Date:* ${interviewDate}\n` +
    `🕐 *Time:* ${interviewTime}\n` +
    `💼 *Mode:* ${interviewMode}\n` +
    (notes ? `📝 *Notes:* ${notes}\n` : '') +
    `\nPlease be on time. All the best! 💪\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}

/** Notify candidate when they are placed */
export async function notifyPlacement(phone: string, candidateName: string, jobTitle: string, companyName: string, joiningDate?: string) {
  const msg =
    `🏆 Congratulations ${candidateName}!\n\n` +
    `We're thrilled to inform you that you have been *successfully placed*! 🎉\n\n` +
    `📌 *Role:* ${jobTitle}\n` +
    `🏢 *Company:* ${companyName}\n` +
    (joiningDate ? `📅 *Joining Date:* ${joiningDate}\n` : '') +
    `\nWishing you a great career ahead! 🌟\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}

/** Notify client that invoice has been sent */
export async function notifyInvoiceSent(phone: string, clientName: string, invoiceNumber: string, amount: string) {
  const msg =
    `Hi ${clientName}! 👋\n\n` +
    `Your invoice has been sent.\n\n` +
    `🧾 *Invoice #:* ${invoiceNumber}\n` +
    `💰 *Amount:* ₹${amount}\n\n` +
    `Please check your email for the detailed invoice. For any queries, feel free to reach us.\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}

/** Notify employer when a candidate applies on the employer portal */
export async function notifyEmployerNewApplication(phone: string, employerName: string, candidateName: string, jobTitle: string) {
  const msg =
    `Hi ${employerName}! 📋\n\n` +
    `A new candidate has applied for your job posting!\n\n` +
    `👤 *Candidate:* ${candidateName}\n` +
    `📌 *Position:* ${jobTitle}\n\n` +
    `Login to your dashboard to review the application.\n\n` +
    `— The Jobsync Team`;
  return sendWhatsApp(phone, msg);
}
