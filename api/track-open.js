import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = await resend.emails.send({
        from: 'Tracking <onboarding@resend.dev>', // Or your verified domain
        to: 'yeswanthbikkavolu@gmail.com', // YOUR email address
        subject: '🚨 SHE OPENED THE LINK! ❤️',
        html: `<p>Your surprise website was just opened at <strong>${new Date().toLocaleString()}</strong>.</p>`
      });

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}