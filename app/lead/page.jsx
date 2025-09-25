'use client'
import { useState } from 'react';

export default function LeadForm() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ name:'', email:'', message:'' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const json = await res.json();
    if (res.ok) {
      setStatus('Saved ✅');
      setForm({ name:'', email:'', message:'' });
    } else {
      setStatus(json.error || 'Error');
    }
  };

  return (
    <main style={{padding:20, maxWidth:600}}>
      <h1>Lead Form</h1>
      <form onSubmit={onSubmit}>
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" required />
        <br/><br/>
        <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" required />
        <br/><br/>
        <textarea name="message" value={form.message} onChange={onChange} placeholder="Message (optional)" />
        <br/><br/>
        <button type="submit">Send</button>
      </form>
      <p>{status}</p>
    </main>
  );
}
