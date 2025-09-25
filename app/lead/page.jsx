'use client'
import { useState } from 'react';

export default function LeadForm() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ name:'', email:'', message:'' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
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
        setStatus(json.error || 'Error saving');
      }
    } catch (err) {
      setStatus('Network error');
    }
  };

  return (
    <main className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6">Lead Form</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Name" required />
          <input name="email" value={form.email} onChange={onChange} type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Email" required />
          <textarea name="message" value={form.message} onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Message (optional)" />
          <div className="flex items-center space-x-4">
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">
              Send
            </button>
            <p className="text-sm text-gray-600">{status}</p>
          </div>
        </form>
      </div>
    </main>
  );
}
