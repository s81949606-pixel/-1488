/* ============================================================
   SUPRA MAGNATE — экономика (чистая логика, без DOM)
   Все функции принимают state и мутируют его.
   ============================================================ */
import { BUSINESSES, CARS, HOUSES, LUXURY, COINS, RIG, BANK, STATUS, JOBS, QUEST_POOL, WHEEL, ACHIEVEMENTS } from './data.js';

export const SAVE_VER = 4;

/* ---------- ФОРМАТИРОВАНИЕ ---------- */
const SUF = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg', 'UVg'];

export function fmt(n, dec = 2) {
  if (n === null || n === undefined || !isFinite(n)) return '∞';
  const neg = n < 0; n = Math.abs(n);
  let out;
  if (n < 1000) out = n < 10 && n % 1 !== 0 ? n.toFixed(Math.max(dec, 1)) : String(Math.floor(n));
  else {
    const t = Math.min(Math.floor(Math.log10(n) / 3), SUF.length - 1);
    const v = n / Math.pow(1000, t);
    out = (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0)) + SUF[t];
  }
  return (neg ? '-' : '') + out;
}
export const money = n => '$' + fmt(n);
export function fmtGroup(n) {
  if (!isFinite(n)) return '∞';
  const s = Math.floor(Math.abs(n)).toString();
  return (n < 0 ? '-' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
export function fmtCoin(v, dec = 4) {
  if (!isFinite(v)) return '∞';
  if (v === 0) return '0';
  if (Math.abs(v) >= 1000) return fmt(v);
  return v.toFixed(dec).replace(/\.?0+$/, m => (m.includes('.') ? '' : m)) || '0';
}
export function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  if (d) return `${d}д ${h}ч`;
  if (h) return `${h}ч ${m}м`;
  if (m) return `${m}м ${s}с`;
  return `${s}с`;
}
export function fmtPrice(p, dec) {
  if (p >= 1000) return fmt(p);
  return p.toFixed(dec !== undefined ? dec : (p < 1 ? 6 : 2));
}

/* ---------- УРОВНИ / СТАТУСЫ ---------- */
export const xpForLevel = lv => Math.floor(55 * Math.pow(lv, 1.55));
export function levelFromXp(xp) {
  let lv = 1, need = xpForLevel(1), acc = 0;
  while (xp >= acc + need && lv < 999) { acc += need; lv++; need = xpForLevel(lv); }
  return { level: lv, into: xp - acc, need };
}
export function statusForLevel(lv) {
  let s = STATUS[0].name;
  for (const x of STATUS) if (lv >= x.lv) s = x.name;
  return s;
}

/* ---------- БИЗНЕСЫ ---------- */
export const milestone = lv =>
  (lv >= 25 ? 2 : 1) * (lv >= 50 ? 3 : 1) * (lv >= 100 ? 4 : 1) * (lv >= 200 ? 6 : 1) * (lv >= 300 ? 10 : 1);

export function bizCost(def, level) { return def.cost * Math.pow(def.costMult, level); }
export function bizCostBulk(def, level, count = 1) {
  let sum = 0;
  for (let i = 0; i < count; i++) sum += bizCost(def, level + i);
  return sum;
}
/** Доход одного бизнеса в секунду (без глобального множителя) */
export function bizBaseIncome(def, level, mgr = 0) {
  if (level <= 0) return 0;
  let v = def.income * level * Math.pow(def.incMult, level) * milestone(level);
  if (mgr) v *= 1.25;
  return v;
}

/* ---------- МУЛЬТИПЛИКАТОРЫ ---------- */
export function ownedItems(state) {
  return [
    ...Object.keys(state.owned.cars).map(id => CARS.find(c => c.id === id)).filter(Boolean),
    ...Object.keys(state.owned.houses).map(id => HOUSES.find(c => c.id === id)).filter(Boolean),
    ...Object.keys(state.owned.lux).map(id => LUXURY.find(c => c.id === id)).filter(Boolean),
  ];
}
export function boostMult(state) { return Date.now() < state.boost.until ? state.boost.mult : 1; }
export function gemMult(state) { return 1 + state.prestige.gems * 0.03; }

export function globalMult(state) {
  let m = 1;
  for (const it of ownedItems(state)) m += it.income || 0;
  return m * gemMult(state) * boostMult(state);
}
export function tapMult(state) {
  let m = 1;
  for (const it of ownedItems(state)) m += it.tap || 0;
  return m * (1 + state.prestige.gems * 0.02) * boostMult(state);
}
export function incomePerSec(state) {
  let s = 0;
  for (const def of BUSINESSES) {
    const b = state.biz[def.id];
    if (b && b.level > 0) s += bizBaseIncome(def, b.level, b.mgr);
  }
  return s * globalMult(state) + rigIncome(state) * state.crypto.prices.BTC;
}
export function tapPower(state) {
  const base = 3 * (1 + (state.level - 1) * 0.35);
  return Math.max(base, incomePerSec(state) * 0.05) * tapMult(state);
}
export function offlineCap(state) {
  let h = 2;
  for (const id of Object.keys(state.owned.houses)) {
    const def = HOUSES.find(x => x.id === id);
    if (def && def.offline > h) h = def.offline;
  }
  return h * 3600;
}
export function netWorth(state) {
  let nw = state.cash + state.bank.deposit + cryptoValue(state);
  for (const def of BUSINESSES) {
    const b = state.biz[def.id];
    if (b && b.level > 0) nw += bizCostBulk(def, 0, b.level) * 0.6;
  }
  nw += rigTotalSpent(state.rigs);
  for (const it of ownedItems(state)) nw += it.price * 0.7;
  return nw;
}
export function cryptoValue(state) {
  let v = 0;
  for (const c of COINS) v += (state.crypto.hold[c.id] || 0) * state.crypto.prices[c.id];
  for (const c of COINS) v += (state.crypto.stake[c.id] || 0) * state.crypto.prices[c.id];
  return v;
}

/* ---------- МАЙНИНГ ---------- */
export const rigCost = n => RIG.baseCost * Math.pow(RIG.costMult, n);
export function rigTotalSpent(n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += rigCost(i);
  return s;
}
export const rigIncome = state => state.rigs * RIG.btcPerSec * (1 + state.prestige.gems * 0.02);

/* ---------- ПРЕСТИЖ ---------- */
export const PRESTIGE_GATE = 1e9;
export function prestigeGain(state) {
  const nw = netWorth(state);
  if (nw < PRESTIGE_GATE) return 0;
  return Math.floor(Math.pow(nw / PRESTIGE_GATE, 0.45));
}
export function doPrestige(state) {
  const gain = prestigeGain(state);
  if (gain <= 0) return 0;
  state.prestige.gems += gain;
  state.prestige.resets++;
  state.cash = 250;
  state.xp = 0; state.level = 1;
  for (const def of BUSINESSES) state.biz[def.id] = { level: 0, mgr: 0 };
  state.rigs = 0;
  state.bank = { deposit: 0, loan: 0 };
  state.crypto.hold = Object.fromEntries(COINS.map(c => [c.id, 0]));
  state.crypto.stake = Object.fromEntries(COINS.map(c => [c.id, 0]));
  state.boost = { until: 0, mult: 1 };
  state.work = { id: null, until: 0 };
  return gain;
}

/* ---------- СОЗДАНИЕ СОСТОЯНИЯ ---------- */
export function createState() {
  const now = Date.now();
  const prices = {}, hist = {};
  for (const c of COINS) {
    let p = c.price;
    prices[c.id] = p;
    const h = [];
    for (let i = 0; i < 60; i++) {
      p = Math.max(c.price * 0.2, p * (1 + (Math.random() - 0.5) * 2 * c.vol * 0.6));
      h.push(p);
    }
    hist[c.id] = h;
  }
  return {
    v: SAVE_VER,
    cash: 250, xp: 0, level: 1,
    biz: Object.fromEntries(BUSINESSES.map(b => [b.id, { level: 0, mgr: 0 }])),
    owned: { cars: {}, houses: {}, lux: {} },
    crypto: {
      hold: Object.fromEntries(COINS.map(c => [c.id, 0])),
      stake: Object.fromEntries(COINS.map(c => [c.id, 0])),
      prices, hist, timer: 0,
    },
    rigs: 0,
    bank: { deposit: 0, loan: 0 },
    prestige: { gems: 0, resets: 0 },
    boost: { until: 0, mult: 1 },
    daily: { last: 0, streak: 0 },
    quests: { date: '', list: [], done: {} },
    q: { taps: 0, levels: 0, earned: 0, trades: 0, works: 0, tapCash: 0 },
    ach: {},
    stats: { taps: 0, earned: 0, spent: 0, trades: 0, peak: 0, playtime: 0, mined: 0, bestTap: 0, tapsTotal: 0 },
    settings: { sound: true, haptic: true },
    work: { id: null, until: 0 },
    lastSeen: now,
  };
}

/* ---------- ПОКУПКИ ---------- */
export function addCash(state, v) {
  state.cash += v;
  if (v > 0) { state.stats.earned += v; state.q.earned += v; }
}
export function addXp(state, v) {
  state.xp += v;
  const { level } = levelFromXp(state.xp);
  const gained = level - state.level;
  state.level = level;
  return gained;
}

export function buyBiz(state, id, count = 1) {
  const def = BUSINESSES.find(b => b.id === id);
  const b = state.biz[id];
  if (!def || !b) return { ok: false, msg: 'Нет такого бизнеса' };
  if (state.level < def.unlock) return { ok: false, msg: `Нужен ${def.unlock} уровень` };
  let bought = 0, spent = 0;
  for (let i = 0; i < count; i++) {
    const c = bizCost(def, b.level);
    if (state.cash < c) break;
    state.cash -= c; spent += c; b.level++; bought++;
  }
  if (!bought) return { ok: false, msg: 'Не хватает денег' };
  state.stats.spent += spent;
  state.q.levels += bought;
  addXp(state, bought * 1.5);
  return { ok: true, bought, spent, level: b.level };
}
export function buyManager(state, id) {
  const def = BUSINESSES.find(b => b.id === id);
  const b = state.biz[id];
  if (!def || !b || b.level < 5) return { ok: false, msg: 'Нужен 5-й уровень бизнеса' };
  if (b.mgr) return { ok: false, msg: 'Менеджер уже нанят' };
  if (state.cash < def.mgr) return { ok: false, msg: 'Не хватает денег' };
  state.cash -= def.mgr; state.stats.spent += def.mgr; b.mgr = 1;
  addXp(state, 10);
  return { ok: true };
}
export function buyItem(state, kind, id) {
  const src = kind === 'cars' ? CARS : kind === 'houses' ? HOUSES : LUXURY;
  const def = src.find(x => x.id === id);
  if (!def) return { ok: false, msg: 'Нет такого товара' };
  if (state.owned[kind][id]) return { ok: false, msg: 'Уже куплено' };
  if (state.cash < def.price) return { ok: false, msg: 'Не хватает денег' };
  state.cash -= def.price; state.stats.spent += def.price;
  state.owned[kind][id] = 1;
  addXp(state, def.xp || 10);
  return { ok: true, def };
}
export function buyRig(state) {
  const c = rigCost(state.rigs);
  if (state.cash < c) return { ok: false, msg: 'Не хватает денег', cost: c };
  state.cash -= c; state.stats.spent += c; state.rigs++;
  addXp(state, 8);
  return { ok: true, cost: c, rigs: state.rigs };
}

/* ---------- ТАП ---------- */
export function tap(state) {
  const v = tapPower(state);
  addCash(state, v);
  state.stats.taps++; state.stats.tapsTotal++; state.q.taps++; state.q.tapCash += v;
  if (v > state.stats.bestTap) state.stats.bestTap = v;
  addXp(state, 0.5);
  return v;
}

/* ---------- КРИПТА ---------- */
export function buyCrypto(state, sym, usd) {
  const c = COINS.find(x => x.id === sym);
  if (!c) return { ok: false, msg: 'Нет монеты' };
  usd = Math.min(usd, state.cash);
  if (!(usd > 0)) return { ok: false, msg: 'Не хватает денег' };
  const got = usd * (1 - c.fee) / state.crypto.prices[sym];
  state.cash -= usd; state.stats.spent += usd;
  state.crypto.hold[sym] = (state.crypto.hold[sym] || 0) + got;
  state.stats.trades++; state.q.trades++;
  return { ok: true, got };
}
export function sellCrypto(state, sym, amount) {
  const c = COINS.find(x => x.id === sym);
  if (!c) return { ok: false, msg: 'Нет монеты' };
  amount = Math.min(amount, state.crypto.hold[sym] || 0);
  if (!(amount > 0)) return { ok: false, msg: 'Нечего продавать' };
  const usd = amount * state.crypto.prices[sym] * (1 - c.fee);
  state.crypto.hold[sym] -= amount;
  addCash(state, usd);
  state.stats.trades++; state.q.trades++;
  return { ok: true, usd };
}
export function stakeCrypto(state, sym, amount) {
  amount = Math.min(amount, state.crypto.hold[sym] || 0);
  if (!(amount > 0)) return { ok: false, msg: 'Нечего стейкать' };
  state.crypto.hold[sym] -= amount;
  state.crypto.stake[sym] = (state.crypto.stake[sym] || 0) + amount;
  return { ok: true };
}
export function unstakeCrypto(state, sym, amount) {
  amount = Math.min(amount, state.crypto.stake[sym] || 0);
  if (!(amount > 0)) return { ok: false, msg: 'Нечего выводить' };
  state.crypto.stake[sym] -= amount;
  state.crypto.hold[sym] = (state.crypto.hold[sym] || 0) + amount;
  return { ok: true };
}
export function stepPrices(state) {
  for (const c of COINS) {
    const cur = state.crypto.prices[c.id];
    let p;
    if (c.id === 'USDX') p = 1 + (Math.random() - 0.5) * 0.002;
    else {
      p = cur * (1 + (Math.random() - 0.5) * 2 * c.vol + c.drift);
      p = Math.max(p, c.price * 0.05);
    }
    state.crypto.prices[c.id] = p;
    const h = state.crypto.hist[c.id];
    h.push(p); if (h.length > 90) h.shift();
  }
}
/** Резкое движение из-за новости */
export function newsPump(state, sym, dir, power) {
  const p = state.crypto.prices[sym] * (1 + dir * power);
  state.crypto.prices[sym] = p;
  state.crypto.hist[sym].push(p);
}

/* ---------- БАНК ---------- */
export function deposit(state, amount) {
  amount = Math.min(amount, state.cash);
  if (!(amount > 0)) return { ok: false, msg: 'Не хватает денег' };
  state.cash -= amount; state.bank.deposit += amount;
  return { ok: true, amount };
}
export function withdraw(state, amount) {
  amount = Math.min(amount, state.bank.deposit);
  if (!(amount > 0)) return { ok: false, msg: 'Вклад пуст' };
  state.bank.deposit -= amount; state.cash += amount;
  return { ok: true, amount };
}
export function takeLoan(state, amount) {
  const max = netWorth(state) * BANK.loanMaxPart;
  amount = Math.min(amount, Math.max(0, max - state.bank.loan));
  if (!(amount > 0)) return { ok: false, msg: 'Лимит исчерпан' };
  state.bank.loan += amount; state.cash += amount;
  return { ok: true, amount };
}
export function repayLoan(state, amount) {
  amount = Math.min(amount, state.cash, state.bank.loan);
  if (!(amount > 0)) return { ok: false, msg: 'Нет долга или денег' };
  state.cash -= amount; state.bank.loan -= amount;
  return { ok: true, amount };
}

/* ---------- РАБОТА ---------- */
export function startWork(state, id) {
  const j = JOBS.find(x => x.id === id);
  if (!j) return { ok: false, msg: 'Нет работы' };
  if (state.level < j.unlock) return { ok: false, msg: `Нужен ${j.unlock} уровень` };
  if (state.work.id) return { ok: false, msg: 'Смена уже идёт' };
  state.work = { id, until: Date.now() + j.time * 1000 };
  return { ok: true, job: j };
}
export function finishWork(state) {
  const j = JOBS.find(x => x.id === state.work.id);
  if (!j) return null;
  const pay = j.pay * globalMult(state);
  addCash(state, pay);
  addXp(state, 4);
  state.work = { id: null, until: 0 };
  state.q.works++;
  return { job: j, pay };
}

/* ---------- ЕЖЕДНЕВНОЕ / ЗАДАНИЯ ---------- */
export const dayKey = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);
export function rollQuests(state) {
  const pool = [...QUEST_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
  state.quests = {
    date: dayKey(), done: {},
    list: pool.map(q => {
      const n = q.gen();
      return { id: q.id, name: q.name.replace('{n}', fmt(n)), target: Math.round(n), rew: Math.round(q.rew()) };
    }),
  };
  state.q = { taps: 0, levels: 0, earned: 0, trades: 0, works: 0, tapCash: 0 };
}
export function questProgress(state, q) {
  const m = { q_tap: s => s.q.taps, q_biz: s => s.q.levels, q_earn: s => s.q.earned, q_trade: s => s.q.trades, q_work: s => s.q.works, q_tap2: s => s.q.tapCash }[q.id];
  return m ? m(state) : 0;
}
export function claimQuest(state, idx) {
  const q = state.quests.list[idx];
  if (!q || state.quests.done[idx]) return { ok: false, msg: 'Уже получено' };
  if (questProgress(state, q) < q.target) return { ok: false, msg: 'Задание не выполнено' };
  state.quests.done[idx] = 1;
  addCash(state, q.rew); addXp(state, 15);
  return { ok: true, rew: q.rew };
}
export function claimDaily(state) {
  const now = Date.now(), last = state.daily.last;
  if (last && now - last < 20 * 3600 * 1000) return { ok: false, msg: 'Приходи позже', wait: 24 * 3600 - (now - last) / 1000 };
  state.daily.streak = last && now - last < 44 * 3600 * 1000 ? state.daily.streak + 1 : 1;
  state.daily.last = now;
  const day = Math.min(state.daily.streak, 7) - 1;
  const d = [15000, 60000, 250000, 1000000, 5000000, 25000000, 100000000][day] * (1 + state.level * 0.15);
  const gems = [0, 0, 1, 1, 1, 2, 3][day];
  state.cash += d; state.stats.earned += d;
  state.prestige.gems += gems;
  if (state.daily.streak % 7 === 0) state.boost = { until: Date.now() + 180000, mult: 2 };
  return { ok: true, cash: d, gems, day: state.daily.streak };
}

/* ---------- ДОСТИЖЕНИЯ ---------- */
export function checkAchievements(state) {
  const list = [];
  for (const a of ACHIEVEMENTS) {
    if (state.ach[a.id]) continue;
    let ok = false;
    try { ok = a.check(state); } catch { ok = false; }
    if (ok) {
      state.ach[a.id] = Date.now();
      if (a.reward) { state.cash += a.reward; state.stats.earned += a.reward; }
      list.push(a);
    }
  }
  return list;
}

/* ---------- РУЛЕТКА ---------- */
export function spinWheel(state, cost) {
  if (state.prestige.gems < cost) return { ok: false, msg: 'Не хватает алмазов' };
  state.prestige.gems -= cost;
  const total = WHEEL.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total, seg = WHEEL[0], i = 0;
  for (let k = 0; k < WHEEL.length; k++) { r -= WHEEL[k].w; if (r <= 0) { seg = WHEEL[k]; i = k; break; } }
  const ips = incomePerSec(state);
  let prize = { ...seg, cash: 0, gems: 0, btc: 0 };
  if (seg.kind === 'cash') prize.cash = Math.max(1000, ips * 30);
  if (seg.kind === 'cash2') prize.cash = Math.max(3000, ips * 180);
  if (seg.kind === 'cash3') prize.cash = Math.max(10000, ips * 900);
  if (seg.kind === 'jack') prize.cash = Math.max(50000, ips * 7200);
  if (seg.kind === 'gems') prize.gems = 2;
  if (seg.kind === 'btc') prize.btc = 0.005;
  if (seg.kind === 'boost') state.boost = { until: Date.now() + 60000, mult: 2 };
  state.cash += prize.cash; state.stats.earned += prize.cash;
  state.prestige.gems += prize.gems;
  state.crypto.hold.BTC = (state.crypto.hold.BTC || 0) + prize.btc;
  return { ok: true, prize, index: i };
}

/* ---------- ТИК ---------- */
export function tick(state, dt) {
  if (!(dt > 0)) return { earned: 0 };
  const inc = incomePerSec(state);
  let earned = 0;
  // бизнесы
  const bizPart = inc - rigIncome(state) * state.crypto.prices.BTC;
  if (bizPart > 0) { addCash(state, bizPart * dt); earned += bizPart * dt; }
  // майнинг
  if (state.rigs > 0) {
    const btc = rigIncome(state) * dt;
    state.crypto.hold.BTC = (state.crypto.hold.BTC || 0) + btc;
    state.stats.mined += btc;
    earned += btc * state.crypto.prices.BTC;
  }
  // стейкинг: ~0.5% в час
  for (const c of COINS) {
    const st = state.crypto.stake[c.id];
    if (st > 0) state.crypto.stake[c.id] = st * (1 + 1.39e-6 * dt);
  }
  // вклад / кредит (ставки за минуту)
  if (state.bank.deposit > 0) {
    const i = state.bank.deposit * BANK.depositRate * (dt / 60);
    state.bank.deposit += i; earned += i;
  }
  if (state.bank.loan > 0) state.bank.loan += state.bank.loan * BANK.loanRate * (dt / 60);
  // цены
  state.crypto.timer = (state.crypto.timer || 0) + dt;
  if (state.crypto.timer >= 2) { state.crypto.timer = 0; stepPrices(state); }
  state.stats.playtime += dt;
  const nw = netWorth(state);
  if (nw > state.stats.peak) state.stats.peak = nw;
  return { earned, inc };
}

/* ---------- ОФЛАЙН ---------- */
export function offlineReport(state) {
  const now = Date.now();
  const sec = Math.min((now - state.lastSeen) / 1000, offlineCap(state));
  if (sec < 60) return null;
  const mgrShare = ownedBizCount(state) > 0
    ? Object.values(state.biz).filter(b => b.level > 0 && b.mgr).length / ownedBizCount(state)
    : 0;
  const rate = 0.4 + 0.6 * mgrShare;      // 40% базово, до 100% с менеджерами
  const inc = incomePerSec(state) * rate;
  const earned = inc * sec;
  if (earned > 0) addCash(state, earned);
  if (state.rigs > 0) {
    const btc = rigIncome(state) * sec * 0.5;
    state.crypto.hold.BTC = (state.crypto.hold.BTC || 0) + btc;
    state.stats.mined += btc;
  }
  return { sec, earned, inc, btc: rigIncome(state) * sec * 0.5 };
}
export function ownedBizCount(state) {
  return Object.values(state.biz).filter(b => b.level > 0).length;
}

/* ---------- ЭКСПОРТ СПИСКОВ (для UI) ---------- */
export { BUSINESSES, CARS, HOUSES, LUXURY, COINS, JOBS, STATUS, WHEEL, RIG, BANK };
