'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { CookieConsent as CookieConsentType } from '@/types';

const STORAGE_KEY = 'kvkk-consent';

type ConsentState = Omit<CookieConsentType, 'essential' | 'timestamp'>;

function loadStoredConsent(): CookieConsentType | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentType;
    if (
      parsed.essential === true &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.preferences === 'boolean' &&
      typeof parsed.timestamp === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, preferences: boolean): void {
  const consent: CookieConsentType = {
    essential: true,
    analytics,
    preferences,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

// --- Sub-icons ---

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// --- Toggle component ---

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  id: string;
}

function Toggle({ checked, onChange, disabled = false, id }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1035]"
      style={{
        backgroundColor: checked
          ? disabled
            ? '#4C1D95'
            : '#6B21A8'
          : 'rgba(255,255,255,0.12)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.75 : 1,
      }}
      aria-label={disabled ? 'Bu çerez kategorisi zorunludur ve devre dışı bırakılamaz' : undefined}
    >
      <span
        className="inline-block h-5 w-5 rounded-full shadow-sm transition-transform duration-200"
        style={{
          transform: checked ? 'translateX(1.25rem)' : 'translateX(0.125rem)',
          marginTop: '0.125rem',
          backgroundColor: checked ? '#F59E0B' : '#9CA3AF',
        }}
      />
    </button>
  );
}

// --- Detailed settings modal ---

interface ModalProps {
  draft: ConsentState;
  onChange: (key: keyof ConsentState, val: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

function DetailModal({ draft, onChange, onSave, onClose }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent background scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const categories = [
    {
      key: 'essential' as const,
      title: 'Zorunlu Çerezler',
      description:
        'Sitenin temel işlevleri için gereklidir. Oturum yönetimi, güvenlik ve erişilebilirlik gibi işlevleri kapsar. Bu çerezler devre dışı bırakılamaz.',
      disabled: true,
      value: true,
    },
    {
      key: 'analytics' as const,
      title: 'Analitik Çerezler',
      description:
        'Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Bu veriler anonim olarak toplanır ve site performansını iyileştirmek için kullanılır.',
      disabled: false,
      value: draft.analytics,
    },
    {
      key: 'preferences' as const,
      title: 'Tercih Çerezleri',
      description:
        'Dil tercihi, ses ayarları ve tema gibi kişisel tercihlerinizi hatırlamamızı sağlar. Bu çerezler deneyiminizi kişiselleştirir.',
      disabled: false,
      value: draft.preferences,
    },
  ] as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(15, 10, 30, 0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#1A1035',
          border: '1px solid rgba(107, 33, 168, 0.5)',
          boxShadow: '0 24px 64px rgba(15, 10, 30, 0.9), 0 0 0 1px rgba(107,33,168,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(107, 33, 168, 0.3)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#F59E0B]">
              <ShieldIcon />
            </span>
            <h2 id="cookie-modal-title" className="text-base font-bold text-[#F3F0FF]">
              Çerez Tercihleri
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Modalı kapat"
            className="p-1 rounded-lg text-[#B8B0CC] hover:text-[#F3F0FF] hover:bg-white/10 transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <p className="text-sm leading-relaxed" style={{ color: '#B8B0CC' }}>
            Aşağıdan hangi çerez kategorilerini etkinleştirmek istediğinizi seçebilirsiniz.
            Zorunlu çerezler her zaman aktiftir.
          </p>

          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: 'rgba(35, 21, 69, 0.8)',
                  border: '1px solid rgba(107, 33, 168, 0.25)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor={`toggle-${cat.key}`}
                    className="text-sm font-bold text-[#F3F0FF] cursor-pointer"
                    style={{ cursor: cat.disabled ? 'default' : 'pointer' }}
                  >
                    {cat.title}
                    {cat.disabled && (
                      <span
                        className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(76, 29, 149, 0.5)',
                          color: '#FCD34D',
                        }}
                      >
                        Zorunlu
                      </span>
                    )}
                  </label>
                  {cat.key === 'essential' ? (
                    <Toggle
                      id={`toggle-${cat.key}`}
                      checked={true}
                      onChange={() => {}}
                      disabled={true}
                    />
                  ) : (
                    <Toggle
                      id={`toggle-${cat.key}`}
                      checked={cat.value as boolean}
                      onChange={(val) => onChange(cat.key as keyof ConsentState, val)}
                    />
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#9C92B8' }}>
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="px-6 py-4 flex flex-col sm:flex-row gap-3 shrink-0"
          style={{ borderTop: '1px solid rgba(107, 33, 168, 0.3)' }}
        >
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F0A1E',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D97706'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F59E0B'; }}
          >
            Seçimlerimi Kaydet
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
            style={{
              backgroundColor: 'rgba(107, 33, 168, 0.2)',
              color: '#F3F0FF',
              border: '1px solid rgba(107, 33, 168, 0.4)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(107, 33, 168, 0.35)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(107, 33, 168, 0.2)'; }}
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main CookieConsent component ---

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>({ analytics: false, preferences: false });

  useEffect(() => {
    // Only show banner when no valid consent exists in storage
    const stored = loadStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent(true, true);
    setVisible(false);
    setModalOpen(false);
  }, []);

  const acceptEssentialOnly = useCallback(() => {
    saveConsent(false, false);
    setVisible(false);
    setModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    // Pre-populate draft from existing storage if available
    const stored = loadStoredConsent();
    setDraft({
      analytics: stored?.analytics ?? false,
      preferences: stored?.preferences ?? false,
    });
    setModalOpen(true);
  }, []);

  const saveDraft = useCallback(() => {
    saveConsent(draft.analytics, draft.preferences);
    setVisible(false);
    setModalOpen(false);
  }, [draft]);

  const handleDraftChange = useCallback(
    (key: keyof ConsentState, val: boolean) => {
      setDraft((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        role="region"
        aria-label="Çerez onay bildirimi"
        aria-live="polite"
        className="fixed bottom-0 left-0 right-0 z-[9998] px-4 pb-4 sm:px-6 lg:px-8"
      >
        <div
          className="max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: '#1A1035',
            border: '1px solid rgba(107, 33, 168, 0.55)',
            boxShadow: '0 -4px 32px rgba(15, 10, 30, 0.8), 0 0 0 1px rgba(107,33,168,0.2)',
          }}
        >
          {/* Gold top accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #F59E0B 30%, #FCD34D 70%, transparent)',
            }}
            aria-hidden="true"
          />

          <div className="px-5 py-5 flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <span className="text-[#F59E0B] mt-0.5 shrink-0">
                <ShieldIcon />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-sm font-bold text-[#F3F0FF] leading-snug">
                  Gizliliğinize Önem Veriyoruz
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: '#B8B0CC' }}>
                  Masal Dünyası,{' '}
                  <strong className="text-[#F3F0FF]">
                    Kişisel Verilerin Korunması Kanunu (KVKK)
                  </strong>{' '}
                  kapsamında çerezler kullanmaktadır. Zorunlu çerezler sitenin çalışması için
                  gereklidir; analitik ve tercih çerezlerini aşağıdan yönetebilirsiniz. Daha fazla
                  bilgi için{' '}
                  <Link
                    href="/kvkk"
                    className="underline underline-offset-2 transition-colors duration-150 hover:text-[#F59E0B]"
                    style={{ color: '#9333EA' }}
                  >
                    KVKK Aydınlatma Metni
                  </Link>{' '}
                  ve{' '}
                  <Link
                    href="/gizlilik-politikasi"
                    className="underline underline-offset-2 transition-colors duration-150 hover:text-[#F59E0B]"
                    style={{ color: '#9333EA' }}
                  >
                    Gizlilik Politikamızı
                  </Link>{' '}
                  inceleyebilirsiniz.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:justify-end">
              <button
                type="button"
                onClick={openModal}
                className="order-3 sm:order-1 py-2 px-4 rounded-xl text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
                style={{
                  backgroundColor: 'transparent',
                  color: '#B8B0CC',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.color = '#F3F0FF';
                  btn.style.borderColor = 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.color = '#B8B0CC';
                  btn.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                Detaylı Ayarlar
              </button>

              <button
                type="button"
                onClick={acceptEssentialOnly}
                className="order-2 py-2 px-4 rounded-xl text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
                style={{
                  backgroundColor: 'rgba(107, 33, 168, 0.2)',
                  color: '#F3F0FF',
                  border: '1px solid rgba(107, 33, 168, 0.4)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(107, 33, 168, 0.35)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(107, 33, 168, 0.2)'; }}
              >
                Yalnızca Zorunlular
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="order-1 sm:order-3 py-2 px-5 rounded-xl text-xs font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                style={{
                  backgroundColor: '#F59E0B',
                  color: '#0F0A1E',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D97706'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F59E0B'; }}
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed settings modal */}
      {modalOpen && (
        <DetailModal
          draft={draft}
          onChange={handleDraftChange}
          onSave={saveDraft}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
