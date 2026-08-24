/* ============================================================
   SUPRA MAGNATE — сохранение / загрузка
   ============================================================ */
import { createState, SAVE_VER, BUSINESSES, COINS, dayKey, rollQuests } from './economy.js';

const KEY = 'supra_magnate_save_v4';
let timer = null;

/** Достаёт недостающие поля, если сохранение сделано старой версией */
export function hydrate(s) {
  const base = createState();
  const out = { ...base, ...s };
  out.biz = { ...base.biz };
  for (const def of BUSINESSES) {
    const b = s.biz && s.biz[def.id] ? s.biz[def.id] : { level: 0, mgr: 0 };
    out.biz[def.id] = { level: b.level | 0, mgr: b.mgr | 0 };
  }
  out.owned = { cars: { ...(s.owned?.cars || {}) }, houses: { ...(s.owned?.houses || {}) }, lux: { ...(s.owned?.lux || {}) } };
  out.crypto = {
    hold: Object.fromEntries(COINS.map(c => [c.id, s.crypto?.hold?.[c.id] || 0])),
    stake: Object.fromEntries(COINS.map(c => [c.id, s.crypto?.stake?.[c.id] || 0])),
    prices: { ...base.crypto.prices }, hist: base.crypto.hist, timer: 0,
  };
  if (s.crypto?.prices) for (const c of COINS) if (isFinite(s.crypto.prices[c.id]) && s.crypto.prices[c.id] > 0) out.crypto.prices[c.id] = s.crypto.prices[c.id];
  if (s.crypto?.hist) for (const c of COINS) if (Array.isArray(s.crypto.hist[c.id]) && s.crypto.hist[c.id].length > 2) out.crypto.hist[c.id] = s.crypto.hist[c.id].slice(-90);
  out.bank = { deposit: s.bank?.deposit || 0, loan: s.bank?.loan || 0 };
  out.prestige = { gems: s.prestige?.gems || 0, resets: s.prestige?.resets || 0 };
  out.boost = s.boost && isFinite(s.boost.until) ? s.boost : { until: 0, mult: 1 };
  out.daily = { last: s.daily?.last || 0, streak: s.daily?.streak || 0 };
  out.quests = s.quests && s.quests.date === dayKey() ? s.quests : base.quests;
  out.q = { ...base.q, ...(s.q || {}) };
  out.ach = s.ach || {};
  out.stats = { ...base.stats, ...(s.stats || {}) };
  out.settings = { ...base.settings, ...(s.settings || {}) };
  out.work = s.work && s.work.id && s.work.until > Date.now() ? s.work : { id: null, until: 0 };
  out.lastSeen = s.lastSeen || Date.now();
  out.v = SAVE_VER;
  if (!out.quests.date || !out.quests.list?.length) rollQuests(out);
  return out;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { state: null, fresh: true };
    return { state: hydrate(JSON.parse(raw)), fresh: false };
  } catch (e) {
    console.warn('save broken', e);
    return { state: null, fresh: true };
  }
}

export function save(state) {
  try {
    state.lastSeen = Date.now();
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) { console.warn('save failed', e); return false; }
}
export function scheduleSave(state) {
  if (timer) return;
  timer = setTimeout(() => { timer = null; save(state); }, 2500);
}
export function wipe() { try { localStorage.removeItem(KEY); } catch {} }
export function exportSave(state) { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); }
export function importSave(str) {
  try { return hydrate(JSON.parse(decodeURIComponent(escape(atob(str.trim()))))); }
  catch { return null; }
}
