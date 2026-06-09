'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AgeCategory } from '@/types';

interface HeaderProps {
  categories: AgeCategory[];
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: 'transform 0.2s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header({ categories }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const dropdownRef    = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname       = usePathname();
  const router         = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close everything on route change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Rota değişiminde tüm menüleri kapatmak kasıtlı; pathname değişimine tepki.
    setMobileOpen(false);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Focus search input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const isActiveCategory = pathname.startsWith('/kategoriler');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length >= 2) {
      router.push(`/arama?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 relative">
      {/* backdrop-filter ayrı katmanda — içerik katmanında olursa background-clip:text bozuluyor */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundColor: 'rgba(26, 16, 53, 0.9)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(107, 33, 168, 0.35)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-1 select-none shrink-0"
            aria-label="Masal Dünyası ana sayfa"
          >
            <span
              className="sparkle-anim text-sm leading-none"
              style={{ '--delay': '0s', '--duration': '2.8s' } as React.CSSProperties}
              aria-hidden="true"
            >✦</span>
            <span
              className="logo-text text-2xl sm:text-3xl leading-none px-0.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Masal Dünyası
            </span>
            <span
              className="sparkle-anim text-xs leading-none"
              style={{ '--delay': '1.4s', '--duration': '2.8s' } as React.CSSProperties}
              aria-hidden="true"
            >✦</span>
          </Link>

          {/* ── Desktop right: Kategoriler dropdown + Search ── */}
          <div className="hidden md:flex items-center gap-2">

            {/* Kategoriler dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                  isActiveCategory
                    ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                    : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(245,158,11,0.08)]'
                }`}
              >
                <span aria-hidden="true">🗂️</span>
                Kategoriler
                <ChevronDownIcon open={dropdownOpen} />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  aria-label="Yaş kategorileri"
                  className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: '#1E1040',
                    border: '1px solid rgba(107, 33, 168, 0.5)',
                    boxShadow: '0 24px 48px rgba(15, 10, 30, 0.85)',
                  }}
                >
                  <div className="py-2">
                    {categories.map((cat) => {
                      const isActive = pathname === `/kategoriler/${cat.slug}`;
                      return (
                        <Link
                          key={cat.id}
                          href={`/kategoriler/${cat.slug}`}
                          role="menuitem"
                          className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors duration-100 ${
                            isActive
                              ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.15)]'
                              : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(147,51,234,0.18)]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                          {cat._count !== undefined && (
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(107,33,168,0.4)', color: '#FCD34D' }}
                            >
                              {cat._count.stories}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Inline search form */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="flex items-center rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'rgba(35, 21, 69, 0.75)',
                border: '1px solid rgba(107, 33, 168, 0.4)',
              }}
            >
              <input
                type="search"
                name="q"
                placeholder="Masal ara…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Masal ara"
                className="bg-transparent text-[#F3F0FF] placeholder:text-[#7B6FA0] text-sm px-3 py-2 w-36 focus:w-52 transition-[width] duration-300 outline-none"
              />
              <button
                type="submit"
                aria-label="Aramayı başlat"
                className="px-3 py-2 text-[#9C92B8] hover:text-[#F59E0B] transition-colors duration-150 shrink-0"
              >
                <SearchIcon />
              </button>
            </form>
          </div>

          {/* ── Mobile: search icon + hamburger ── */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => { setMobileSearchOpen((v) => !v); setMobileOpen(false); }}
              aria-label={mobileSearchOpen ? 'Aramayı kapat' : 'Masal ara'}
              aria-expanded={mobileSearchOpen}
              className="p-2 rounded-lg text-[#F3F0FF] hover:text-[#F59E0B] transition-colors duration-150"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => { setMobileOpen((v) => !v); setMobileSearchOpen(false); }}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-lg text-[#F3F0FF] hover:text-[#F59E0B] transition-colors duration-150"
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (slide-down) ── */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="flex items-center rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'rgba(35, 21, 69, 0.85)',
                border: '1px solid rgba(107, 33, 168, 0.5)',
              }}
            >
              <input
                ref={searchInputRef}
                type="search"
                name="q"
                placeholder="Masal ara…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Masal ara"
                className="bg-transparent text-[#F3F0FF] placeholder:text-[#7B6FA0] text-sm px-4 py-3 flex-1 outline-none"
              />
              <button
                type="submit"
                aria-label="Aramayı başlat"
                className="px-4 py-3 text-[#9C92B8] hover:text-[#F59E0B] transition-colors duration-150"
              >
                <SearchIcon />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Mobile menu drawer ── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasyon menüsü"
          className="md:hidden"
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#1A1035',
            borderTop: '1px solid rgba(107, 33, 168, 0.3)',
            maxHeight: 'calc(100dvh - 4rem)',
            overflowY: 'auto',
          }}
        >
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobil menü">
            <Link
              href="/"
              className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150 ${
                pathname === '/'
                  ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                  : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(245,158,11,0.08)]'
              }`}
            >
              🏠 Ana Sayfa
            </Link>

            {/* Mobile categories accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileDropdownOpen((v) => !v)}
                aria-expanded={mobileDropdownOpen}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150 ${
                  isActiveCategory
                    ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                    : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(245,158,11,0.08)]'
                }`}
              >
                <span>🗂️ Kategoriler</span>
                <ChevronDownIcon open={mobileDropdownOpen} />
              </button>

              {mobileDropdownOpen && (
                <div className="mt-1 ml-4 flex flex-col gap-0.5">
                  {categories.map((cat) => {
                    const isActive = pathname === `/kategoriler/${cat.slug}`;
                    return (
                      <Link
                        key={cat.id}
                        href={`/kategoriler/${cat.slug}`}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-100 ${
                          isActive
                            ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.15)]'
                            : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(147,51,234,0.2)]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                        {cat._count !== undefined && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(107,33,168,0.4)', color: '#FCD34D' }}
                          >
                            {cat._count.stories}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link href="/iletisim" className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150 ${
              pathname === '/iletisim'
                ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(245,158,11,0.08)]'
            }`}>
              ✉️ İletişim
            </Link>

            <Link href="/hakkimizda" className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150 ${
              pathname === '/hakkimizda'
                ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                : 'text-[#F3F0FF] hover:text-[#F59E0B] hover:bg-[rgba(245,158,11,0.08)]'
            }`}>
              ℹ️ Hakkımızda
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
