// app/api/leads/route.js
import { promises as fs } from 'fs';
import path from 'path';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name + email required' }), { status: 400 });
    }

    // 1) Send notification email via SendGrid
    try {
      await sgMail.send({
        to: process.env.MY_EMAIL,
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        subject: `New lead from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message || '(none)'}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message || '(none)'}</p>`
      });
      console.log('SendGrid: notification email sent');
    } catch (mailErr) {
      console.error('SendGrid error:', mailErr);
      // continue — still save lead even if email fails
    }

    // 2) Save the lead to data/leads.json
    const file = path.join(process.cwd(), 'data', 'leads.json');
    await fs.mkdir(path.dirname(file), { recursive: true });

    let data = [];
    try {
      const txt = await fs.readFile(file, 'utf8');
      data = JSON.parse(txt || '[]');
    } catch (e) {
      // file may not exist yet — that's fine
    }

    const entry = { id: Date.now(), name, email, message, createdAt: new Date().toISOString() };
    data.push(entry);
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');

    return new Response(JSON.stringify({ ok: true, entry }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
