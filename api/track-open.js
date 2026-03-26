import { Resend } from 'resend';

// This helps us see if the API Key is actually loaded
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log("Track-open triggered!"); // This will show in Vercel Logs

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in Vercel Settings");
    return res.status(500).json({ error: "API Key missing" });
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'yeswanthbikkavolu@gmail.com', 
      subject: '🚨 SURPRISE OPENED!',
      html: `<strong>She is looking at the letter right now!</strong>`
    });

    console.log("Email sent successfully:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Resend Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
