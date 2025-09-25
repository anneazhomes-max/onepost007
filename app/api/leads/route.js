import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name + email required' }), { status: 400 });
    }
    const file = path.join(process.cwd(), 'data', 'leads.json');
    await fs.mkdir(path.dirname(file), { recursive: true });

    let data = [];
    try {
      const txt = await fs.readFile(file, 'utf8');
      data = JSON.parse(txt || '[]');
    } catch (e) {
      // file may not exist yet
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
