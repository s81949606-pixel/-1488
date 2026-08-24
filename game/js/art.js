/* ============================================================
   SUPRA MAGNATE — SVG-арт (иконки, сцены, графики)
   Всё рисуется кодом, без внешних зависимостей.
   ============================================================ */
let uid = 0;
const gid = p => `${p}${++uid}`;

/* ---------- МАЛЕНЬКИЕ ИКОНКИ ---------- */
const ICONS = {
  coin:'<circle cx="12" cy="12" r="10" fill="url(#G1)"/><path d="M12 5.5v13M9 8.4h4.2a2.1 2.1 0 010 4.2H9m0 0h4.8a2.4 2.4 0 010 4.8H9" stroke="#7a4a06" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  btc:'<circle cx="12" cy="12" r="10" fill="#f7931a"/><path d="M9.6 7.6h3.4a2.2 2.2 0 010 4.4H9.6zm0 4.4h3.8a2.3 2.3 0 010 4.6H9.6zm.9-6.1v10.2M11.7 5.5v1.6m1.9-1.6v1.6m-1.9 9.9v1.6m1.9-1.6v1.6" stroke="#fff" stroke-width="1.35" fill="none" stroke-linecap="round"/>',
  eth:'<path d="M12 3l6 9-6 3.6L6 12z" fill="#9fb4ff"/><path d="M12 15.6L6 12l6 9z" fill="#6b86e8"/><path d="M12 15.6L18 12l-6 9z" fill="#4c63c4"/>',
  car:'<path d="M3 14.5h18M5.6 14.5l1.6-4.2a2 2 0 011.9-1.3h5.8a2 2 0 011.9 1.3l1.6 4.2v3.2H5.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="17.6" r="1.5" fill="currentColor"/><circle cx="16" cy="17.6" r="1.5" fill="currentColor"/>',
  home:'<path d="M4 11l8-6.4 8 6.4v8.2a1 1 0 01-1 1h-4.2v-5.4H9.2v5.4H5a1 1 0 01-1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  biz:'<rect x="3.6" y="8" width="16.8" height="12" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8V6.2A1.2 1.2 0 0110.2 5h3.6A1.2 1.2 0 0115 6.2V8M3.6 12.6h16.8" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  chart:'<path d="M4 18.4l4.2-5 3.4 2.6L20 6.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.6 6.6H20v4.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  crown:'<path d="M4 17.4h16M4.6 7.4l3.2 3.2L12 5l4.2 5.6 3.2-3.2-1.4 10H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  tap:'<path d="M9 11V5.6a1.7 1.7 0 013.4 0V13l1.3-.8a2 2 0 012.7.6l2 3.4a4 4 0 01-3.4 6h-3a4.6 4.6 0 01-4.6-4.6V12" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>',
  gem:'<path d="M7.4 4h9.2l3.4 4.6L12 20 4 8.6z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M4 8.6h16M9.6 4L7.6 8.6 12 20l4.4-11.4L14.4 4" fill="none" stroke="currentColor" stroke-width="1.1"/>',
  gift:'<rect x="4" y="9.4" width="16" height="10.2" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.55"/><path d="M3.2 9.4h17.6v3.2H3.2zM12 9.4v10.2M12 9.4S10.6 4 8.2 4a2.2 2.2 0 000 5.4zM12 9.4S13.4 4 15.8 4a2.2 2.2 0 010 5.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  star:'<path d="M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  money:'<rect x="3" y="6.4" width="18" height="11.2" rx="2" fill="none" stroke="currentColor" stroke-width="1.55"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6.4 10v4M17.6 10v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  rig:'<rect x="4" y="5" width="16" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="4" y="13" width="16" height="6" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="7" cy="8" r="1" fill="currentColor"/><circle cx="7" cy="16" r="1" fill="currentColor"/>',
  gear:'<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  bolt:'<path d="M13.4 3L6 13.4h4.6L10 21l7.6-10.6H13z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  bank:'<path d="M3.6 9.6L12 4.6l8.4 5M5 9.6v8.8M19 9.6v8.8M9 9.6v8.8M15 9.6v8.8M3.2 19.4h17.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  job_box:'<path d="M4 8.6l8-3.6 8 3.6-8 3.6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 8.6v6.8l8 3.6 8-3.6V8.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  job_cup:'<path d="M6 8h9v6a4.5 4.5 0 01-9 0z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 9.4h1.8a2 2 0 010 4H15M7 19.4h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  job_chart:'<path d="M5 18V9.4M10 18V5.6M15 18v-6M20 18V8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  job_bank:'<path d="M4 9.6L12 5l8 4.6M6 9.6v7.8M18 9.6v7.8M12 9.6v7.8M4 19.4h16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  job_crown:'<path d="M4 17.4h16M4.6 7.4l3.2 3.2L12 5l4.2 5.6 3.2-3.2-1.4 10H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  work:'<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.4V12l3.4 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  trophy:'<path d="M8 5h8v4.4a4 4 0 01-8 0zM8 6.4H5.4v1.4A3.2 3.2 0 008.6 11M16 6.4h2.6v1.4A3.2 3.2 0 0115.4 11M10 13.6h4l.6 5.4H9.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  fire:'<path d="M12 3.4s4.6 4 4.6 8.2A4.6 4.6 0 0112 16.2a4.6 4.6 0 01-4.6-4.6c0-1.6.8-3 1.8-4 .2 1.4 1 2.2 1.8 2.2 1.2 0 1.6-1.6 1-6.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  target:'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  user:'<circle cx="12" cy="8.4" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.8 20a7.2 7.2 0 0114.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  city:'<path d="M4 20V9.4l4.4-3.2V20M8.4 20V11l4 2.4V20M12.4 20V6.6l4 2.6V20M16.4 20V10.4L20 13V20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
};

export function icon(name, cls = '') {
  const body = ICONS[name] || ICONS.star;
  const id = gid('g');
  const defs = name === 'coin'
    ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe89a"/><stop offset="1" stop-color="#f59a1e"/></linearGradient></defs>`
    : '';
  const body2 = body.replace('url(#G1)', `url(#${id})`);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${defs}${body2}</svg>`;
}

/* ---------- ЛОГОТИПЫ КРИПТЫ ---------- */
export function coinLogo(sym, color) {
  const map = {
    BTC:'<path d="M9.6 7.6h3.4a2.2 2.2 0 010 4.4H9.6zm0 4.4h3.8a2.3 2.3 0 010 4.6H9.6zm.9-6.1v10.2M11.7 5.5v1.6m1.9-1.6v1.6m-1.9 9.9v1.6m1.9-1.6v1.6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    ETH:'<path d="M12 4.2l5.4 8-5.4 3.2-5.4-3.2z" fill="#fff" opacity=".95"/><path d="M12 15.4L6.6 12 12 19.8l5.4-7.8z" fill="#fff" opacity=".7"/>',
    SUPRA:'<path d="M6 16.4l4.6-8.8h2.8L8.8 16.4z" fill="#fff"/><path d="M12 7.6l5 8.8h-2.8l-3.6-6.4z" fill="#fff" opacity=".75"/>',
    MEME:'<circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="9.6" cy="10.4" r="1" fill="#fff"/><circle cx="14.4" cy="10.4" r="1" fill="#fff"/><path d="M8.6 14.4c1.6 1.6 5.2 1.6 6.8 0" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
    USDX:'<path d="M12 5.6v12.8M8.4 8.6h5.4a2.2 2.2 0 010 4.4H8.4m0 0h5.8a2.4 2.4 0 010 4.8H8.4" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  };
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${color}"/><circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>${map[sym] || ''}</svg>`;
}

/* ---------- АВАТАР ---------- */
export function avatar(level = 1) {
  const hue = (level * 17) % 360;
  const crown = level >= 28 ? '<path d="M22 16l4-6 4 4 4-6 4 6v6H22z" fill="#ffcb47" stroke="#a06a10" stroke-width="1.2" stroke-linejoin="round"/>' : '';
  return `<svg viewBox="0 0 64 64">
    <defs><linearGradient id="${gid('av')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 70% 58%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360} 70% 40%)"/></linearGradient></defs>
    <rect width="64" height="64" rx="18" fill="url(#av${uid})" opacity="0"/>
    <circle cx="32" cy="26" r="12" fill="#ffd9a8"/>
    <path d="M14 60c0-11 8-17 18-17s18 6 18 17z" fill="hsl(${hue} 65% 45%)"/>
    <path d="M20 22c2-8 22-8 24 0 1 4-2 6-2 6s-2-5-10-5-10 5-10 5-3-2-2-6z" fill="#3a2b1c"/>
    <circle cx="27" cy="27" r="1.8" fill="#2b2118"/><circle cx="37" cy="27" r="1.8" fill="#2b2118"/>
    <path d="M28 33c2 1.6 6 1.6 8 0" stroke="#c98a5a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${crown}</svg>`;
}

/* ---------- ТАП-КНОПКА (монета-логотип) ---------- */
export function tapCoin() {
  const g1 = gid('tc'), g2 = gid('ts');
  return `<svg viewBox="0 0 120 120">
    <defs>
      <linearGradient id="${g1}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4cf"/><stop offset=".5" stop-color="#ffc247"/><stop offset="1" stop-color="#e07d10"/></linearGradient>
      <radialGradient id="${g2}" cx=".35" cy=".28"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="60" cy="60" r="52" fill="url(#${g1})" stroke="#b3660a" stroke-width="3"/>
    <circle cx="60" cy="60" r="43" fill="none" stroke="#fff3c4" stroke-width="2.5" opacity=".55"/>
    <circle cx="60" cy="60" r="52" fill="url(#${g2})"/>
    <path d="M60 26v68M44 42h20a11 11 0 010 22H44m0 0h22a12 12 0 010 24H44" stroke="#8a4d05" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M60 26v68M44 42h20a11 11 0 010 22H44m0 0h22a12 12 0 010 24H44" stroke="#fff8e0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- СЦЕНЫ (иллюстрации бизнесов и роскоши) ---------- */
function sky(a, b, extra = '') {
  const id = gid('sky');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="120" height="120" fill="url(#${id})"/>${extra}`;
}
function win(x, y, w, h, c = '#ffe9a8', o = .9) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${c}" opacity="${o}"/>`;
}

const SCENES = {
  kiosk: () => sky('#1b2a52', '#0e1730', '<circle cx="96" cy="22" r="8" fill="#fff" opacity=".12"/>') +
    `<rect y="96" width="120" height="24" fill="#20293d"/>
     <rect x="26" y="46" width="68" height="50" rx="3" fill="#d9dde8"/>
     <rect x="32" y="58" width="56" height="22" rx="2" fill="#12203c"/>
     <rect x="22" y="40" width="76" height="9" rx="3" fill="#e04a3f"/>
     <rect x="22" y="40" width="12" height="9" fill="#fff" opacity=".7"/><rect x="46" y="40" width="12" height="9" fill="#fff" opacity=".7"/><rect x="70" y="40" width="12" height="9" fill="#fff" opacity=".7"/>
     <rect x="34" y="84" width="20" height="12" rx="2" fill="#ffcb47"/><rect x="60" y="84" width="26" height="12" rx="2" fill="#8b93a8"/>
     <path d="M60 18v14" stroke="#7d8aa8" stroke-width="2"/><path d="M52 18h16l-2 10H54z" fill="#f0a13a"/>
     <circle cx="60" cy="34" r="4" fill="#c8763a"/>
     <circle cx="98" cy="34" r="7" fill="#ffe89a" opacity=".9"/><rect x="96" y="41" width="4" height="20" fill="#5b6784"/>`,

  coffee: () => sky('#26406e', '#101c34') +
    `<rect y="94" width="120" height="26" fill="#22293b"/>
     <rect x="20" y="38" width="80" height="58" rx="3" fill="#e8e2d5"/>
     <rect x="20" y="38" width="80" height="10" rx="3" fill="#7b4a2b"/>
     <rect x="28" y="56" width="38" height="26" rx="2" fill="#1b2c4a"/><rect x="28" y="56" width="38" height="26" rx="2" fill="#ffe9a8" opacity=".25"/>
     <rect x="74" y="56" width="18" height="40" rx="2" fill="#5a3a22"/>
     <path d="M34 26h18v10a9 9 0 01-18 0z" fill="#fff"/><path d="M52 28h4a4 4 0 010 8h-4" stroke="#fff" stroke-width="2.4" fill="none"/>
     <path d="M40 16c0-3 3-3 3-6M47 16c0-3 3-3 3-6" stroke="#fff" stroke-width="2" opacity=".7" fill="none" stroke-linecap="round"/>`,

  carwash: () => sky('#1d3a63', '#0d1a30') +
    `<rect y="92" width="120" height="28" fill="#1c2436"/>
     <rect x="14" y="40" width="92" height="54" rx="4" fill="#2f86d8" opacity=".85"/>
     <rect x="14" y="40" width="92" height="12" rx="4" fill="#1e5fa8"/>
     <rect x="24" y="60" width="72" height="34" rx="4" fill="#0f1a2e"/>
     <rect x="34" y="70" width="52" height="16" rx="6" fill="#e6ecf7"/>
     <rect x="42" y="62" width="36" height="12" rx="5" fill="#c9d5ea"/>
     <circle cx="46" cy="88" r="5" fill="#12182a"/><circle cx="74" cy="88" r="5" fill="#12182a"/>
     <g fill="#9fd8ff">${[28, 40, 52, 64, 76, 88].map(x => `<rect x="${x}" y="${48 + (x % 12)}" width="3" height="10" rx="1.5" opacity=".8"/>`).join('')}</g>
     <rect x="20" y="52" width="6" height="34" rx="3" fill="#f2c14e"/><rect x="94" y="52" width="6" height="34" rx="3" fill="#f2c14e"/>`,

  burger: () => sky('#3a2a52', '#151026') +
    `<rect y="94" width="120" height="26" fill="#241d33"/>
     <rect x="18" y="46" width="84" height="50" rx="3" fill="#f4e3c1"/>
     <rect x="18" y="46" width="84" height="14" rx="3" fill="#d9483f"/>
     <text x="60" y="57" text-anchor="middle" font-size="9" font-family="Arial Black,Arial" fill="#fff">BURGER</text>
     <rect x="26" y="66" width="30" height="20" rx="2" fill="#1d2a45" opacity=".85"/>
     <rect x="64" y="66" width="30" height="20" rx="2" fill="#1d2a45" opacity=".85"/>
     <g transform="translate(60 30)"><path d="M-14 0a14 9 0 0128 0z" fill="#e9a94c"/><rect x="-15" y="0" width="30" height="4" fill="#5aa02c"/><rect x="-15" y="4" width="30" height="6" rx="2" fill="#7a3f1f"/><path d="M-14 10h28a10 8 0 01-28 0z" fill="#e9a94c"/></g>`,

  pizza: () => sky('#2a2340', '#12101f') +
    `<rect y="94" width="120" height="26" fill="#241f31"/>
     <rect x="20" y="44" width="80" height="52" rx="3" fill="#e6d9bd"/>
     <rect x="20" y="44" width="80" height="12" rx="3" fill="#2f7d4f"/>
     <rect x="30" y="62" width="26" height="22" rx="2" fill="#22304f"/><rect x="30" y="62" width="26" height="22" rx="2" fill="#ffb84d" opacity=".25"/>
     <rect x="66" y="62" width="24" height="34" rx="2" fill="#6b4526"/>
     <g transform="translate(60 28)"><path d="M0-12l16 22H-16z" fill="#f6c766"/><path d="M0-6l10 14H-10z" fill="#e04a3f"/><circle cx="-3" cy="4" r="2" fill="#fff"/><circle cx="4" cy="1" r="2" fill="#fff"/></g>`,

  gym: () => sky('#1e3350', '#0c1526') +
    `<rect y="94" width="120" height="26" fill="#1a2130"/>
     <rect x="18" y="48" width="84" height="48" rx="3" fill="#38435e"/>
     <rect x="18" y="48" width="84" height="10" rx="3" fill="#ff7a3d"/>
     ${[26, 42, 58, 74, 90].map(x => win(x, 64, 10, 12, '#9fd8ff', .5)).join('')}
     <g transform="translate(60 30)" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M-14 0h28M-18-6v12M18-6v12M-8-4v8M8-4v8"/></g>`,

  garage: () => sky('#22324e', '#0d1524') +
    `<rect y="92" width="120" height="28" fill="#1b2231"/>
     <rect x="16" y="42" width="88" height="52" rx="3" fill="#4a5670"/>
     <rect x="26" y="54" width="68" height="40" rx="2" fill="#111827"/>
     ${[0, 1, 2, 3, 4].map(i => `<rect x="26" y="${56 + i * 8}" width="68" height="3" fill="#3a4a68" opacity=".7"/>`).join('')}
     <rect x="42" y="70" width="36" height="12" rx="5" fill="#e0553f"/><rect x="48" y="63" width="24" height="9" rx="4" fill="#f0785e"/>
     <circle cx="50" cy="84" r="4" fill="#0b0f18"/><circle cx="70" cy="84" r="4" fill="#0b0f18"/>
     <path d="M84 34v14" stroke="#8b96ad" stroke-width="2"/><path d="M78 28h12l-2 8H80z" fill="#ffcb47"/>`,

  club: () => sky('#2a1240', '#0d0718', '<circle cx="30" cy="26" r="14" fill="#ff4fd8" opacity=".18"/><circle cx="90" cy="30" r="16" fill="#4fd8ff" opacity=".16"/>') +
    `<rect y="94" width="120" height="26" fill="#160f24"/>
     <rect x="20" y="44" width="80" height="52" rx="3" fill="#1b1330"/>
     <rect x="20" y="44" width="80" height="8" rx="3" fill="#ff4fd8" opacity=".85"/>
     <rect x="30" y="60" width="24" height="36" rx="2" fill="#3b1e5e"/><rect x="30" y="60" width="24" height="36" rx="2" fill="#ff4fd8" opacity=".18"/>
     <rect x="64" y="60" width="26" height="16" rx="2" fill="#4fd8ff" opacity=".3"/>
     <g transform="translate(60 30)" fill="#fff"><circle cx="-6" cy="8" r="4"/><circle cx="8" cy="4" r="4"/><path d="M-2 8V-8l14-4v4z"/></g>
     <path d="M20 96h80" stroke="#ff4fd8" stroke-width="2" opacity=".5"/>`,

  chain: () => sky('#20405e', '#0c1826') +
    `<rect y="92" width="120" height="28" fill="#18212f"/>
     ${[8, 44, 80].map((x, i) => `<rect x="${x}" y="46" width="32" height="48" rx="3" fill="${['#e8e2d5', '#dfe6ef', '#e8e2d5'][i]}"/>
        <rect x="${x}" y="46" width="32" height="9" rx="3" fill="#7b4a2b"/>
        <rect x="${x + 6}" y="62" width="20" height="18" rx="2" fill="#1b2c4a" opacity=".8"/>`).join('')}
     <g transform="translate(60 30)"><path d="M-11-6h22v10a11 11 0 01-22 0z" fill="#fff"/><path d="M-13-6h26v4h-26z" fill="#e04a3f"/></g>`,

  rigs: () => sky('#0c1a20', '#05100f') +
    `<rect y="98" width="120" height="22" fill="#0a1512"/>
     ${[16, 44, 72].map(x => `<g><rect x="${x}" y="30" width="30" height="66" rx="3" fill="#16242c" stroke="#26414d"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${x + 4}" y="${36 + i * 10}" width="22" height="6" rx="1.5" fill="#0d1a20"/>
          <circle cx="${x + 8}" cy="${39 + i * 10}" r="1.6" fill="${i % 2 ? '#4fe08f' : '#ffcb47'}"/>`).join('')}</g>`).join('')}
     <path d="M0 92h120" stroke="#4fe08f" stroke-width="1" opacity=".35"/>
     <text x="60" y="22" text-anchor="middle" font-size="10" font-family="Arial Black,Arial" fill="#4fe08f" opacity=".8">MINING</text>`,

  office: () => sky('#12304f', '#08131f', '<circle cx="94" cy="24" r="7" fill="#fff" opacity=".14"/>') +
    `<rect y="100" width="120" height="20" fill="#0e1622"/>
     <rect x="34" y="14" width="52" height="88" rx="2" fill="#1f3d63"/>
     <rect x="34" y="14" width="52" height="88" rx="2" fill="none" stroke="#3d6a9c"/>
     ${[0, 1, 2, 3, 4, 5, 6, 7].map(r => [0, 1, 2, 3].map(c => win(40 + c * 11, 20 + r * 10, 7, 6, r % 3 ? '#9fd8ff' : '#ffe9a8', .55)).join('')).join('')}
     <rect x="54" y="10" width="12" height="6" fill="#3d6a9c"/><path d="M60 2v8" stroke="#7fb2e8" stroke-width="1.4"/>`,

  hotel: () => sky('#1b2f57', '#0a1425') +
    `<rect y="100" width="120" height="20" fill="#131c2c"/>
     <rect x="26" y="20" width="68" height="82" rx="2" fill="#e6dcc6"/>
     <rect x="26" y="20" width="68" height="10" rx="2" fill="#b08a4a"/>
     ${[0, 1, 2, 3, 4, 5, 6].map(r => [0, 1, 2, 3, 4].map(c => win(32 + c * 12, 34 + r * 9, 8, 6, (r + c) % 3 ? '#ffe9a8' : '#3a4a68', .8)).join('')).join('')}
     <text x="60" y="28" text-anchor="middle" font-size="8" font-family="Arial Black,Arial" fill="#fff">HOTEL</text>
     <rect x="52" y="90" width="16" height="12" fill="#8b6b3a"/>`,

  mall: () => sky('#22345a', '#0b1424') +
    `<rect y="96" width="120" height="24" fill="#161f30"/>
     <rect x="12" y="52" width="96" height="44" rx="3" fill="#dfe6f2"/>
     <path d="M12 52h96l-10-14H22z" fill="#9fb4d8"/>
     <path d="M40 52a20 16 0 0140 0z" fill="#8fd0ff" opacity=".55"/>
     <rect x="30" y="66" width="16" height="18" rx="2" fill="#2b3d63"/><rect x="54" y="66" width="16" height="18" rx="2" fill="#2b3d63"/><rect x="78" y="66" width="16" height="18" rx="2" fill="#2b3d63"/>
     <rect x="46" y="86" width="28" height="10" fill="#ffcb47" opacity=".8"/>`,

  factory: () => sky('#2b2f3d', '#10131b') +
    `<rect y="94" width="120" height="26" fill="#191d26"/>
     <rect x="14" y="56" width="92" height="40" rx="2" fill="#4a5468"/>
     <path d="M14 56l14-10v10l14-10v10l14-10v10l14-10v10l22-10v10z" fill="#5c6880"/>
     <rect x="88" y="26" width="10" height="32" fill="#6b7688"/><rect x="72" y="34" width="8" height="24" fill="#5d687a"/>
     <g fill="#8d97ab" opacity=".5"><circle cx="93" cy="20" r="7"/><circle cx="100" cy="12" r="5"/><circle cx="76" cy="28" r="5"/></g>
     ${[22, 38, 54, 70].map(x => win(x, 70, 10, 10, '#ffcb47', .6)).join('')}`,

  studio: () => sky('#2a1f3d', '#0f0a18') +
    `<rect y="94" width="120" height="26" fill="#171226"/>
     <rect x="16" y="42" width="88" height="54" rx="3" fill="#2c2440"/>
     <path d="M16 42h88l-8-12H24z" fill="#3d3358"/>
     <rect x="40" y="56" width="40" height="26" rx="2" fill="#101020"/>
     <path d="M60 56v26M40 69h40" stroke="#3d3358" stroke-width="1"/>
     <g transform="translate(60 26)"><path d="M-16 0h32v6h-32z" fill="#fff"/><path d="M-16 0l6-8 26 4-6 4z" fill="#e04a3f"/></g>
     <circle cx="24" cy="36" r="5" fill="#ffe89a" opacity=".8"/><circle cx="96" cy="36" r="5" fill="#ffe89a" opacity=".8"/>`,

  rocket: () => sky('#0b1c3a', '#050a18', '<g fill="#fff" opacity=".7"><circle cx="18" cy="18" r="1.2"/><circle cx="42" cy="12" r="1"/><circle cx="98" cy="20" r="1.3"/><circle cx="80" cy="10" r="1"/><circle cx="60" cy="16" r="1"/></g>') +
    `<rect y="98" width="120" height="22" fill="#0d1526"/>
     <rect x="46" y="92" width="28" height="8" rx="2" fill="#2a3550"/>
     <path d="M60 20c8 8 12 20 12 34l-6 12H54l-6-12c0-14 4-26 12-34z" fill="#e8eefc"/>
     <path d="M48 54l-10 16 10-4zM72 54l10 16-10-4z" fill="#e0553f"/>
     <circle cx="60" cy="42" r="5" fill="#4fd8ff"/>
     <path d="M56 66c0 8-2 12 4 20 6-8 4-12 4-20z" fill="#ffb03a" opacity=".9"/><path d="M58 66c0 6-1 8 2 13 3-5 2-7 2-13z" fill="#fff2c4"/>`,

  watch: () => sky('#241a10', '#0e0a06') +
    `<g transform="translate(60 60)">
       <rect x="-14" y="-46" width="28" height="26" rx="6" fill="#6b4a22"/><rect x="-14" y="20" width="28" height="26" rx="6" fill="#6b4a22"/>
       <circle r="30" fill="#f0c34e" stroke="#a97c17" stroke-width="3"/>
       <circle r="24" fill="#141a26"/>
       <g stroke="#f0c34e" stroke-width="2" stroke-linecap="round">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<path d="M0-20v4" transform="rotate(${i * 30})"/>`).join('')}</g>
       <path d="M0 0V-14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M0 0l10 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
       <circle r="2.6" fill="#f0c34e"/></g>`,

  island: () => sky('#2f86d8', '#0e4a86', '<circle cx="92" cy="24" r="10" fill="#fff4cf" opacity=".9"/>') +
    `<rect y="70" width="120" height="50" fill="#1e6fc0"/>
     <path d="M0 74c20-6 34 6 54 2s44-8 66-2v46H0z" fill="#2f86d8" opacity=".7"/>
     <ellipse cx="60" cy="82" rx="42" ry="14" fill="#f3dfae"/>
     <path d="M40 82c4-20 16-30 26-30" stroke="#7a4a22" stroke-width="5" fill="none"/>
     <g fill="#2f9e57"><path d="M66 52c10-6 20-4 24 2-8 2-16 2-24-2z"/><path d="M66 52c-10-6-20-4-24 2 8 2 16 2 24-2z"/><path d="M66 50c4-10 12-14 18-12-4 6-10 12-18 12z"/></g>
     <rect x="76" y="66" width="22" height="14" rx="2" fill="#fff"/><path d="M74 66h26l-13-8z" fill="#e0553f"/>`,

  stadium: () => sky('#17304f', '#071423') +
    `<rect y="96" width="120" height="24" fill="#0e1a28"/>
     <ellipse cx="60" cy="76" rx="50" ry="22" fill="#2a3d5c"/>
     <ellipse cx="60" cy="72" rx="40" ry="16" fill="#1b2a44"/>
     <ellipse cx="60" cy="70" rx="30" ry="11" fill="#2f8b46"/>
     <path d="M30 70h60" stroke="#fff" stroke-width="1" opacity=".6"/>
     ${[14, 40, 80, 106].map(x => `<path d="M${x} 40v30" stroke="#7f8ca6" stroke-width="3"/><rect x="${x - 7}" y="32" width="14" height="9" rx="2" fill="#ffe89a"/>`).join('')}`,

  house_penthouse: () => sky('#0d1830', '#050a16', '<g fill="#fff" opacity=".6"><circle cx="20" cy="16" r="1"/><circle cx="100" cy="12" r="1.2"/><circle cx="70" cy="8" r="1"/></g>') +
    `<rect y="100" width="120" height="20" fill="#0a1020"/>
     ${[[10, 46, 20, 56], [34, 60, 16, 42], [74, 52, 18, 50], [96, 66, 16, 36]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#16223c"/>` +
       [0, 1, 2, 3, 4].map(r => [0, 1].map(c => win(x + 3 + c * (w / 2 - 2), y + 6 + r * 9, 5, 5, '#9fd8ff', .4)).join('')).join('')).join('')}
     <rect x="46" y="22" width="26" height="80" fill="#20304f" stroke="#4a6a9c"/>
     ${[0, 1, 2, 3, 4, 5, 6].map(r => [0, 1].map(c => win(50 + c * 12, 28 + r * 10, 8, 6, '#ffcb47', .85)).join('')).join('')}
     <rect x="44" y="18" width="30" height="6" rx="2" fill="#ffcb47"/>`,

  house_mansion: () => sky('#16224a', '#080e1e', '<circle cx="96" cy="22" r="9" fill="#fff4cf" opacity=".8"/>') +
    `<rect y="90" width="120" height="30" fill="#131b2c"/>
     <rect x="18" y="48" width="84" height="44" rx="2" fill="#e8e2d5"/>
     <path d="M14 48h92L60 24z" fill="#7b4a2b"/>
     <rect x="52" y="66" width="16" height="26" rx="2" fill="#5a3a22"/>
     ${[26, 38, 74, 86].map(x => win(x, 56, 10, 12, '#ffe9a8', .9)).join('')}
     <ellipse cx="60" cy="98" rx="22" ry="6" fill="#2f86d8" opacity=".7"/>
     <path d="M60 92c-4 4-4 6 0 8 4-2 4-4 0-8z" fill="#9fd8ff" opacity=".9"/>
     ${[14, 106].map(x => `<rect x="${x - 2}" y="60" width="4" height="32" fill="#2f9e57"/><circle cx="${x}" cy="58" r="7" fill="#3aa862"/>`).join('')}`,
};

export function scene(key) {
  return `<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">${(SCENES[key] || SCENES.office)()}</svg>`;
}

/* ---------- ГОРОД (растёт вместе с империей) ---------- */
export function cityScene(owned) {
  const g = gid('cs');
  const n = owned.length;
  const palette = ['#2c3d63', '#35496f', '#25354f', '#3b5177', '#2b3f60'];
  let b = '';
  for (let i = 0; i < Math.max(n, 3); i++) {
    const x = 4 + i * (112 / Math.max(n, 3));
    const w = Math.max(10, 112 / Math.max(n, 3) - 4);
    const h = n === 0 ? 14 + (i % 3) * 8 : 20 + ((i * 37) % 56);
    const y = 120 - h;
    b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${palette[i % 5]}"/>`;
    const rows = Math.floor(h / 12), cols = Math.max(1, Math.floor(w / 10));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      if ((i * 7 + r * 3 + c) % 3 !== 0) b += `<rect x="${(x + 3 + c * 10).toFixed(1)}" y="${(y + 6 + r * 12).toFixed(1)}" width="5" height="6" rx="1" fill="#ffd76a" opacity="${0.35 + ((i + r) % 3) * 0.2}"/>`;
  }
  return `<svg viewBox="0 0 120 120" preserveAspectRatio="none">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b3a6b"/><stop offset=".55" stop-color="#152748"/><stop offset="1" stop-color="#0c1526"/></linearGradient></defs>
    <rect width="120" height="120" fill="url(#${g})"/>
    <circle cx="98" cy="22" r="9" fill="#fff0c0" opacity=".85"/>
    <g fill="#fff" opacity=".5">${[[14, 16], [34, 10], [58, 20], [76, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1"/>`).join('')}</g>
    ${b}
    <rect y="112" width="120" height="8" fill="#070c16"/>
  </svg>`;
}

/* ---------- ГРАФИК КРИПТЫ ---------- */
export function chartSvg(points, color = '#4fe08f') {
  if (!points || points.length < 2) return `<svg viewBox="0 0 300 120"></svg>`;
  const W = 300, H = 120, pad = 6;
  const min = Math.min(...points), max = Math.max(...points);
  const span = (max - min) || Math.abs(max) * 0.01 || 1;
  const step = (W - pad * 2) / (points.length - 1);
  const y = v => H - pad - ((v - min) / span) * (H - pad * 2);
  const pts = points.map((v, i) => [pad + i * step, y(v)]);
  const line = pts.map(([x, yy], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`).join('');
  const area = `${line}L${(W - pad).toFixed(1)} ${H - pad}L${pad} ${H - pad}Z`;
  const gA = gid('ar'), gL = gid('ln');
  const up = points[points.length - 1] >= points[0];
  const c = color || (up ? '#4fe08f' : '#ff6d80');
  const grid = [0.25, 0.5, 0.75].map(p => `<path d="M${pad} ${(pad + p * (H - pad * 2)).toFixed(1)}H${W - pad}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="${gA}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c}" stop-opacity=".38"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path d="${area}" fill="url(#${gA})"/>
    <path d="${line}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    <circle cx="${pts[pts.length - 1][0].toFixed(1)}" cy="${pts[pts.length - 1][1].toFixed(1)}" r="3" fill="${c}"/>
  </svg>`;
}

/* ---------- РУЛЕТКА ---------- */
export function wheelSvg(segs, angle = 0) {
  const R = 60, cx = 70, cy = 70;
  const colors = ['#f0932a', '#4fa8ff', '#a86bff', '#f7931a', '#4fe08f', '#ff5a6e', '#ffcb47'];
  const step = 360 / segs.length;
  let paths = '';
  segs.forEach((s, i) => {
    const a0 = (i * step - 90) * Math.PI / 180, a1 = ((i + 1) * step - 90) * Math.PI / 180;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const mid = ((i + .5) * step - 90) * Math.PI / 180;
    const tx = cx + (R - 22) * Math.cos(mid), ty = cy + (R - 22) * Math.sin(mid);
    paths += `<path d="M${cx} ${cy}L${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${colors[i % colors.length]}" stroke="#0d1424" stroke-width="1.5"/>
      <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="8" font-weight="900" fill="#20130a" transform="rotate(${((i + .5) * step).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})">${s.label.split(' ')[0]}</text>`;
  });
  return `<svg viewBox="0 0 140 140"><g transform="rotate(${angle} ${cx} ${cy})">${paths}<circle cx="${cx}" cy="${cy}" r="12" fill="#0d1424" stroke="#ffcb47" stroke-width="2"/></g>
    <path d="M${cx} ${cy - R - 8}l7 14h-14z" fill="#ff5a6e" stroke="#fff" stroke-width="1.5"/></svg>`;
}
