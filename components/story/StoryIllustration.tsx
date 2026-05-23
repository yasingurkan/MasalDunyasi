interface StoryIllustrationProps {
  slug: string;
  imageQuery: string;
  imageUrl?: string | null;
  categoryColor?: string;
  categoryIcon?: string;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

// ─── Deterministic hash ───────────────────────────────────────────────────────
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ─── Color utilities ──────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 107;
  const g = parseInt(clean.slice(2, 4), 16) || 33;
  const b = parseInt(clean.slice(4, 6), 16) || 168;
  return [r, g, b];
}

function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

function lighten(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * factor))},${Math.min(255, Math.round(g + (255 - g) * factor))},${Math.min(255, Math.round(b + (255 - b) * factor))})`;
}

// ─── Emoji map ────────────────────────────────────────────────────────────────
const TAG_EMOJI_MAP: Record<string, [string, string, string]> = {
  prenses:    ['👸', '🏰', '✨'],
  prens:      ['🤴', '🏰', '⚜️'],
  kral:       ['👑', '🏰', '⚜️'],
  kraliçe:    ['👑', '💎', '✨'],
  padisah:    ['👑', '🪄', '⚜️'],
  sultan:     ['👑', '🌙', '⚜️'],
  balo:       ['🎭', '💃', '✨'],
  sindirella: ['👠', '🎭', '✨'],
  uyuyan:     ['😴', '🌹', '🏰'],
  güzel:      ['🌹', '✨', '💫'],
  güzellik:   ['🌹', '💎', '✨'],
  canavar:    ['👹', '🌲', '⚡'],
  ejderha:    ['🐉', '🔥', '⚔️'],
  dragon:     ['🐉', '🔥', '⚔️'],
  kahraman:   ['⚔️', '🛡️', '🌟'],
  cesur:      ['⚔️', '🌟', '🏆'],
  savaşçı:    ['⚔️', '🛡️', '🌟'],
  deniz:      ['🌊', '⚓', '🐚'],
  balik:      ['🐟', '🌊', '🪸'],
  balık:      ['🐟', '🌊', '🪸'],
  mermaid:    ['🧜', '🌊', '🐚'],
  kaplumbaga: ['🐢', '🌿', '🌊'],
  orman:      ['🌲', '🦊', '🍄'],
  hayvan:     ['🦁', '🐘', '🦒'],
  kurt:       ['🐺', '🌕', '🌲'],
  wolf:       ['🐺', '🌕', '🌲'],
  ayı:        ['🐻', '🍯', '🌲'],
  bear:       ['🐻', '🍯', '🌲'],
  tilki:      ['🦊', '🌲', '🍂'],
  fox:        ['🦊', '🌲', '🍂'],
  aslan:      ['🦁', '👑', '🌟'],
  lion:       ['🦁', '👑', '🌟'],
  fil:        ['🐘', '🌿', '💫'],
  elephant:   ['🐘', '🌿', '💫'],
  kus:        ['🦅', '☁️', '🌤️'],
  kuş:        ['🦅', '☁️', '🌤️'],
  kelebek:    ['🦋', '🌸', '✨'],
  tavsan:     ['🐰', '🌷', '🌈'],
  tavşan:     ['🐰', '🌷', '🌈'],
  rabbit:     ['🐰', '🌷', '🌈'],
  ninni:      ['🌙', '⭐', '🎵'],
  bebek:      ['🍼', '🌙', '💫'],
  uyku:       ['😴', '🌙', '⭐'],
  peri:       ['🧚', '✨', '🌈'],
  fairy:      ['🧚', '✨', '🌈'],
  cadı:       ['🧙', '🔮', '⚡'],
  witch:      ['🧙', '🔮', '⚡'],
  sihir:      ['🪄', '✨', '🌟'],
  büyü:       ['🔮', '🪄', '✨'],
  magic:      ['🪄', '✨', '🌟'],
  macera:     ['🗺️', '⚡', '🌟'],
  adventure:  ['🗺️', '⚡', '🌟'],
  hazine:     ['💎', '🗺️', '🏆'],
  treasure:   ['💎', '🗺️', '🏆'],
  altin:      ['💛', '✨', '👑'],
  gold:       ['💛', '✨', '👑'],
  çiçek:      ['🌸', '🌺', '🦋'],
  flower:     ['🌸', '🌺', '🦋'],
  bahçe:      ['🌻', '🌹', '🍃'],
  garden:     ['🌻', '🌹', '🍃'],
  güneş:      ['☀️', '🌈', '✨'],
  sun:        ['☀️', '🌈', '✨'],
  ay:         ['🌙', '⭐', '🌟'],
  moon:       ['🌙', '⭐', '🌟'],
  yıldız:     ['⭐', '🌙', '✨'],
  star:       ['⭐', '🌙', '✨'],
  kar:        ['❄️', '⛄', '🌨️'],
  snow:       ['❄️', '⛄', '🌨️'],
  ateş:       ['🔥', '✨', '💫'],
  fire:       ['🔥', '✨', '💫'],
  dağ:        ['🏔️', '🌲', '⛰️'],
  mountain:   ['🏔️', '🌲', '⛰️'],
  köy:        ['🏡', '🌻', '🌿'],
  village:    ['🏡', '🌻', '🌿'],
  arkadaş:    ['🤝', '💛', '🌟'],
  keloglan:   ['👦', '🪄', '✨'],
  nasreddin:  ['🎭', '🃏', '😄'],
  hoca:       ['📚', '🌙', '⭐'],
  gemi:       ['⛵', '🌊', '⚓'],
  ship:       ['⛵', '🌊', '⚓'],
  yolculuk:   ['🗺️', '⚡', '🌍'],
  journey:    ['🗺️', '⚡', '🌍'],
  carriage:   ['🎠', '✨', '🌟'],
  pumpkin:    ['🎃', '✨', '🌟'],
  gown:       ['👗', '✨', '💎'],
  princess:   ['👸', '🏰', '✨'],
  prince:     ['🤴', '🏰', '⚜️'],
  castle:     ['🏰', '👑', '✨'],
  witch_hat:  ['🧙', '🔮', '🌙'],
  apple:      ['🍎', '🌿', '✨'],
  elma:       ['🍎', '🌿', '✨'],
  ormanci:    ['🪓', '🌲', '🏠'],
  woodcutter: ['🪓', '🌲', '🏠'],
  çoban:      ['🐑', '🌿', '🏔️'],
  shepherd:   ['🐑', '🌿', '🏔️'],
};

const FALLBACK_EMOJIS: [string, string, string] = ['📖', '✨', '🌙'];

// ─── Emoji resolver ───────────────────────────────────────────────────────────
function resolveEmojis(imageQuery: string, categoryIcon?: string): [string, string, string] {
  const words = imageQuery.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    const direct = TAG_EMOJI_MAP[word];
    if (direct) return direct;
    for (const [key, val] of Object.entries(TAG_EMOJI_MAP)) {
      if (word.includes(key) || key.includes(word)) return val;
    }
  }
  if (categoryIcon) return [categoryIcon, '📖', '✨'];
  return FALLBACK_EMOJIS;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StoryIllustration({
  slug,
  imageQuery,
  imageUrl,
  categoryColor = '#6B21A8',
  categoryIcon,
  title,
  width = 400,
  height = 250,
  className,
}: StoryIllustrationProps) {
  const hash = hashSlug(slug);
  const safeId = 'il-' + slug.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const emojis  = resolveEmojis(imageQuery, categoryIcon);
  const darkBg  = darken(categoryColor, 0.35);
  const midBg   = darken(categoryColor, 0.55);
  const glowCol = lighten(categoryColor, 0.3);

  const cx1 = 15 + (hash % 25);
  const cy1 = 10 + ((hash >> 4) % 25);
  const r1  = 35 + ((hash >> 2) % 20);
  const cx2 = width - 20 - ((hash >> 6) % 30);
  const cy2 = height - 15 - ((hash >> 8) % 25);
  const r2  = 28 + ((hash >> 10) % 18);
  const cx3 = (width / 2) + ((hash % 2 === 0 ? 1 : -1) * (20 + (hash >> 12) % 30));
  const cy3 = (height / 2) + ((hash % 3 === 0 ? 1 : -1) * (15 + (hash >> 14) % 20));
  const r3  = 20 + ((hash >> 16) % 15);

  const emSize0 = Math.round(height * 0.42);
  const emSize1 = Math.round(height * 0.26);
  const emY0    = Math.round(height / 2 + emSize0 * 0.15);
  const em1X    = Math.round(width / 2 - emSize0 * 0.55);
  const em2X    = Math.round(width / 2 + emSize0 * 0.55);
  const em12Y   = Math.round(height * 0.72);

  const emojiFont = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  return (
    // Wrapper div — SVG ve gerçek resim katmanlarını tutar
    <div className={`relative overflow-hidden ${className ?? ''}`}>

      {/* SVG çizimi — her zaman görünür (placeholder / fallback) */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={!!imageUrl}
        role={imageUrl ? undefined : 'img'}
        aria-label={imageUrl ? undefined : title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id={`bg-${safeId}`} cx="50%" cy="40%" r="72%">
            <stop offset="0%"   stopColor={midBg} />
            <stop offset="100%" stopColor={darkBg} />
          </radialGradient>
          <radialGradient id={`glow-${safeId}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor={glowCol} stopOpacity="0.22" />
            <stop offset="100%" stopColor={glowCol} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`vig-${safeId}`} cx="50%" cy="50%" r="70%">
            <stop offset="30%"  stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          <pattern id={`dots-${safeId}`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,0.055)" />
          </pattern>
        </defs>

        <rect width={width} height={height} fill={`url(#bg-${safeId})`} />
        <rect width={width} height={height} fill={`url(#dots-${safeId})`} />
        <circle cx={cx1} cy={cy1} r={r1} fill={categoryColor} fillOpacity="0.22" />
        <circle cx={cx2} cy={cy2} r={r2} fill={midBg}         fillOpacity="0.28" />
        <circle cx={cx3} cy={cy3} r={r3} fill={glowCol}       fillOpacity="0.14" />
        <rect width={width} height={height} fill={`url(#glow-${safeId})`} />
        <text x="9"          y="20"          fontSize="13" fill="#FCD34D" fillOpacity="0.85" fontFamily="serif">✦</text>
        <text x={width - 19} y="20"          fontSize="11" fill="#FCD34D" fillOpacity="0.70" fontFamily="serif">✦</text>
        <text x="11"         y={height - 7}  fontSize="9"  fill="#FCD34D" fillOpacity="0.60" fontFamily="serif">✦</text>
        <text x={width - 17} y={height - 7}  fontSize="13" fill="#FCD34D" fillOpacity="0.80" fontFamily="serif">✦</text>
        <text x={width / 2} y={emY0}  fontSize={emSize0} textAnchor="middle" dominantBaseline="auto" fontFamily={emojiFont}>{emojis[0]}</text>
        <text x={em1X}      y={em12Y} fontSize={emSize1} textAnchor="middle" dominantBaseline="auto" fontFamily={emojiFont} opacity="0.82">{emojis[1]}</text>
        <text x={em2X}      y={em12Y} fontSize={emSize1} textAnchor="middle" dominantBaseline="auto" fontFamily={emojiFont} opacity="0.82">{emojis[2]}</text>
        <rect width={width} height={height} fill={`url(#vig-${safeId})`} />
      </svg>

      {/* Gerçek AI görseli — yüklenince SVG'nin üstüne oturur, hata olursa sessizce gizlenir */}
      {imageUrl && (
        <div
          role="img"
          aria-label={title}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      )}
    </div>
  );
}
