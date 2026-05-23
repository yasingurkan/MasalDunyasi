'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [errors, setErrors]   = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())                e.name    = 'Ad Soyad zorunludur.';
    if (!form.email.trim())               e.email   = 'E-posta zorunludur.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                          e.email   = 'Geçerli bir e-posta adresi girin.';
    if (!form.subject.trim())             e.subject = 'Konu zorunludur.';
    if (form.message.trim().length < 20)  e.message = 'Mesaj en az 20 karakter olmalıdır.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm text-[#F3F0FF] placeholder:text-[#7B6FA0] outline-none transition-colors duration-150 focus:ring-2 focus:ring-[#F59E0B]/50';
  const inputStyle = {
    backgroundColor: 'rgba(35,21,69,0.75)',
    border: '1px solid rgba(107,33,168,0.45)',
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-5 text-center rounded-2xl p-10"
        style={{ backgroundColor: '#1A1035', border: '1px solid rgba(34,197,94,0.35)' }}
      >
        <span className="text-5xl" aria-hidden="true">✅</span>
        <h2 className="text-xl font-extrabold text-[#F3F0FF]">Mesajınız Alındı!</h2>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#B8B0CC' }}>
          Talebiniz için teşekkür ederiz. En geç 3 iş günü içinde{' '}
          <strong className="text-[#F59E0B]">{form.email}</strong> adresine yanıt vereceğiz.
        </p>
        <button
          onClick={() => { setForm(INITIAL); setSubmitted(false); }}
          className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ backgroundColor: '#F59E0B', color: '#0F0A1E' }}
        >
          Yeni Mesaj Gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Ad Soyad */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
          Ad Soyad <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClass}
          style={inputStyle}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'err-name' : undefined}
        />
        {errors.name && <p id="err-name" className="text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* E-posta */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
          E-posta <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder="ornek@email.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
          style={inputStyle}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'err-email' : undefined}
        />
        {errors.email && <p id="err-email" className="text-xs text-red-400">{errors.email}</p>}
      </div>

      {/* Konu */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
          Konu <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="Mesajınızın konusu"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className={inputClass}
          style={inputStyle}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'err-subject' : undefined}
        />
        {errors.subject && <p id="err-subject" className="text-xs text-red-400">{errors.subject}</p>}
      </div>

      {/* Mesaj */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wide" style={{ color: '#F59E0B' }}>
          Mesaj <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Mesajınızı buraya yazın… (en az 20 karakter)"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className={`${inputClass} resize-y min-h-[120px]`}
          style={inputStyle}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
        />
        {errors.message && <p id="err-message" className="text-xs text-red-400">{errors.message}</p>}
        <p className="text-xs text-right" style={{ color: '#7B6FA0' }}>
          {form.message.trim().length} / 20+ karakter
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        style={{ backgroundColor: '#F59E0B', color: '#0F0A1E', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
      >
        ✉️ Mesajı Gönder
      </button>
    </form>
  );
}
