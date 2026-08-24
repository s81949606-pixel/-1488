/* ============================================================
   SUPRA MAGNATE — точка входа: игровой цикл, экраны, события
   ============================================================ */
import * as E from './economy.js';
import { icon, scene, tapCoin, avatar, coinLogo, cityScene, chartSvg, wheelSvg } from './art.js';
import { load, save, scheduleSave, wipe, exportSave, importSave } from './state.js';
import { BUSINESSES, CARS, HOUSES, LUXURY, COINS, JOBS, NEWS, WHEEL, ACHIEVEMENTS, RIG, BANK, STATUS } from './data.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const view = $('#view');

let S = null;
let tab = 'empire';
let sub = { biz: 'all', garage: 'cars', crypto: 'exchange', profile: 'stats' };
let buyMode = 1;              // 1 | 10 | 'max'
let selCoin = 'BTC';
let wheelAngle = 0, wheelSpinning = false;

/* ================= ЗВУК / ВИБРАЦИЯ ================= */
let AC = null;
function beep(freq = 620, dur = .06, type = 'sine', vol = .04) {
  if (!S?.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol; o.connect(g); g.connect(AC.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + dur);
    o.stop(AC.currentTime + dur + .02);
  } catch {}
}
const vib = ms => { if (S?.settings.haptic && navigator.vibrate) navigator.vibrate(ms); };

/* ================= ТОСТЫ / ЭФФЕКТЫ ================= */
function toast(text, kind = '', ico = 'coin') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<span style="color:${kind === 'err' ? '#ff6d80' : '#ffcb47'}">${icon(ico)}</span><div>${text}</div>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 2600);
}
function floatText(x, y, txt, color = '#ffd76a') {
  const el = document.createElement('div');
  el.className = 'float'; el.textContent = txt;
  el.style.cssText = `left:${x}px;top:${y}px;color:${color}`;
  $('#fxLayer').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function sparks(x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 45;
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
    $('#fxLayer').appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}

/* ================= SHEET ================= */
function sheet(html, opts = {}) {
  $('#sheetBody').innerHTML = `<button class="close" data-act="close-sheet">✕</button>${html}`;
  $('#sheet').hidden = false; $('#sheetBackdrop').hidden = false;
  if (opts.onMount) opts.onMount();
}
const closeSheet = () => { $('#sheet').hidden = true; $('#sheetBackdrop').hidden = true; };
$('#sheetBackdrop').onclick = closeSheet;

/* ================= HUD ================= */
function updateHud() {
  $('#hudCash').textContent = E.fmt(S.cash);
  $('#hudIncome').textContent = E.money(E.incomePerSec(S)) + '/сек';
  $('#hudBtc').textContent = '₿ ' + E.fmtCoin(S.crypto.hold.BTC || 0);
  const { into, need } = E.levelFromXp(S.xp);
  $('#hudLevel').textContent = S.level;
  $('#hudXp').style.width = Math.min(100, into / need * 100).toFixed(1) + '%';
  $('#hudStatus').textContent = E.statusForLevel(S.level);
  $('#hudNet').textContent = 'Активы: ' + E.money(E.netWorth(S));
  const on = Date.now() < S.boost.until;
  const b = $('#btnBoost');
  b.classList.toggle('on', on);
  $('#boostLabel').textContent = on ? E.fmtTime((S.boost.until - Date.now()) / 1000) : 'x2';
  $('#hudAvatar').innerHTML = avatar(S.level);
}

/* ================= TABBAR ================= */
const TABS = [
  { id: 'empire', label: 'Империя', ico: 'city' },
  { id: 'biz', label: 'Бизнес', ico: 'biz' },
  { id: 'garage', label: 'Гараж', ico: 'car' },
  { id: 'crypto', label: 'Крипта', ico: 'chart' },
  { id: 'profile', label: 'Профиль', ico: 'user' },
];
function renderTabbar() {
  $('#tabbar').innerHTML = TABS.map(t =>
    `<button class="tab ${tab === t.id ? 'on' : ''}" data-act="tab" data-id="${t.id}">${icon(t.ico)}<span>${t.label}</span></button>`).join('');
}

/* ================= ВСПОМОГАТЕЛЬНЫЕ ================= */
function thumb(def) {
  return def.img
    ? `<picture><source srcset="assets/img/${def.img}.webp" type="image/webp"><img src="assets/img/${def.img}.jpg" alt="${def.name}" loading="lazy" onerror="window.SUPRA_imgFail(this,'${def.fb || def.art || 'office'}')"></picture>`
    : scene(def.art || 'office');
}
/* если фото не загрузилось — подставляем SVG-сцену */
window.SUPRA_imgFail = (img, key) => {
  const t = img.closest('.thumb');
  if (t) t.innerHTML = scene(key);
};
const locked = def => S.level < def.unlock;
function nextMilestone(lv) {
  for (const m of [25, 50, 100, 200, 300]) if (lv < m) return m;
  return 500;
}
function bulkCost(def, level, mode) {
  if (mode === 'max') {
    let n = 0, c = 0;
    while (n < 10000) { const p = E.bizCost(def, level + n); if (S.cash < c + p) break; c += p; n++; }
    return { n: Math.max(n, 1), cost: n ? c : E.bizCost(def, level) };
  }
  return { n: mode, cost: E.bizCostBulk(def, level, mode) };
}

/* ================= ЭКРАН: ИМПЕРИЯ ================= */
function renderEmpire() {
  const owned = BUSINESSES.filter(b => S.biz[b.id].level > 0).map(b => b.id);
  const { into, need } = E.levelFromXp(S.xp);
  const job = S.work.id ? JOBS.find(j => j.id === S.work.id) : null;
  const jobsHtml = JOBS.map(j => {
    const lock = S.level < j.unlock;
    const busy = !!S.work.id;
    return `<button class="item ${lock ? 'locked' : ''}" data-act="work" data-id="${j.id}" ${lock || busy ? 'disabled' : ''}>
      <div class="thumb" style="width:46px;height:46px">${icon(j.icon)}</div>
      <div class="item-body">
        <div class="item-name">${j.name}</div>
        <div class="item-desc">${lock ? `Откроется на ${j.unlock} уровне` : `${j.desc} · ${j.time} сек`}</div>
      </div>
      <div class="right"><div class="bonus gold">${E.money(j.pay * E.globalMult(S))}</div></div>
    </button>`;
  }).join('');

  const q = S.quests.list.map((qq, i) => {
    const p = E.questProgress(S, qq);
    const done = p >= qq.target, got = S.quests.done[i];
    return `<div class="ach ${got ? 'done' : ''}">
      <div class="ic">${icon('target')}</div>
      <div class="grow">
        <div class="item-name">${qq.name}</div>
        <div class="bar grn" style="margin-top:5px"><i style="width:${Math.min(100, p / qq.target * 100).toFixed(1)}%"></i></div>
        <div class="small" style="margin-top:3px">${E.fmt(Math.min(p, qq.target))} / ${E.fmt(qq.target)} · награда ${E.money(qq.rew)}</div>
      </div>
      <button class="btn sm ${got ? '' : done ? 'grn' : ''}" data-act="quest" data-id="${i}" ${got || !done ? 'disabled' : ''}>${got ? '✓' : done ? 'Забрать' : '...'}</button>
    </div>`;
  }).join('');

  return `<div class="page">
    <div class="city">${cityScene(owned)}</div>
    <div class="tapwrap">
      <div class="tap-ring"></div>
      <button class="tapbtn" data-act="tap">${tapCoin()}</button>
    </div>
    <div class="tap-stat">+${E.money(E.tapPower(S))} за нажатие · ${E.money(E.incomePerSec(S))}/сек пассивно</div>
    <div class="tapprogress"><i style="width:${Math.min(100, into / need * 100).toFixed(1)}%"></i></div>
    <div class="small" style="text-align:center;margin-top:5px">До ${S.level + 1} уровня: ${E.fmt(Math.max(0, need - into))} XP</div>

    ${job ? `<div class="sec"><h2>Смена идёт</h2></div>
      <div class="card">
        <div class="row"><div class="grow"><h3>${job.name}</h3>
        <div class="muted" data-dyn="jobleft">Осталось ${E.fmtTime((S.work.until - Date.now()) / 1000)}</div></div>
        <div class="bonus gold">${E.money(job.pay * E.globalMult(S))}</div></div>
        <div class="bar gold" style="margin-top:10px"><i data-dyn="jobbar" style="width:0%"></i></div>
      </div>` : `
    <div class="sec"><h2>Работа</h2><span class="small">быстрые деньги</span></div>
    <div class="list">${jobsHtml}</div>`}

    <div class="sec"><h2>Задания дня</h2><span class="small">${E.dayKey()}</span></div>
    <div class="list">${q}</div>

    <div class="sec"><h2>Быстрые действия</h2></div>
    <div class="grid2">
      <button class="btn" data-act="daily">${icon('gift')} Ежедневка</button>
      <button class="btn" data-act="wheel-open">${icon('gem')} Рулетка</button>
      <button class="btn" data-act="boost">${icon('bolt')} Буст x2</button>
      <button class="btn" data-act="news-open">${icon('fire')} Новости</button>
    </div>
    <div class="small" style="text-align:center;margin-top:14px">SUPRA MAGNATE · v1.0 · прогресс сохраняется автоматически</div>
  </div>`;
}

/* ================= ЭКРАН: БИЗНЕС ================= */
function renderBiz() {
  const mine = BUSINESSES.filter(b => S.biz[b.id].level > 0);
  const list = sub.biz === 'mine' ? mine : BUSINESSES;
  const totalInc = E.incomePerSec(S);
  const mgrCount = BUSINESSES.filter(b => S.biz[b.id].mgr).length;
  const cards = list.map(def => {
    const b = S.biz[def.id];
    const lock = locked(def);
    const { n, cost } = bulkCost(def, b.level, buyMode);
    const inc = E.bizBaseIncome(def, b.level, b.mgr) * E.globalMult(S);
    const ms = nextMilestone(b.level);
    const can = S.cash >= cost && !lock;
    return `<div class="item ${lock ? 'locked' : ''}" id="bz-${def.id}">
      <div class="thumb">${thumb(def)}</div>
      <div class="item-body">
        <div class="item-name">${def.name} ${b.level ? `<span class="lv">${b.level} ур</span>` : ''}</div>
        <div class="item-desc">${lock ? `Откроется на ${def.unlock} уровне` : b.level ? `${E.money(inc)}/сек · x${E.milestone(b.level)} бонус` : def.desc}</div>
        ${b.level ? `<div class="bar grn" style="margin-top:5px"><i style="width:${Math.min(100, b.level / ms * 100).toFixed(1)}%"></i></div>
          <div class="small" style="margin-top:3px">до x2 бонуса: ${ms - b.level} ур.</div>` : ''}
        <div style="display:flex;gap:5px;margin-top:6px;flex-wrap:wrap">
          <span class="bonus">+${E.money(E.bizBaseIncome(def, 1, 0) * E.globalMult(S))}/сек</span>
          ${b.mgr ? '<span class="bonus gold">менеджер</span>' : b.level >= 5 ? `<button class="btn sm pur" data-act="buy-mgr" data-id="${def.id}">Менеджер ${E.fmt(def.mgr)}</button>` : ''}
        </div>
      </div>
      <div style="width:92px;flex:0 0 auto">
        <button class="btn buy sm" data-act="buy-biz" data-id="${def.id}" ${can ? '' : 'disabled'}>
          <span>${lock ? '🔒' : E.fmt(cost)}</span></button>
        <div class="small right" style="margin-top:4px">${lock ? `ур. ${def.unlock}` : buyMode === 'max' ? `макс: ${n} ур.` : `x${n}`}</div>
      </div>
    </div>`;
  }).join('');

  return `<div class="page">
    <div class="card">
      <div class="row">
        <div class="grow"><div class="small">Пассивный доход</div><h3 style="color:#8ef0bb">${E.money(totalInc)}/сек</h3></div>
        <div class="right"><div class="small">Бизнесов</div><h3>${mine.length}/${BUSINESSES.length}</h3></div>
        <div class="right"><div class="small">Менеджеров</div><h3>${mgrCount}</h3></div>
      </div>
      <div class="muted" style="margin-top:8px">Множитель империи: <b style="color:#ffd98a">x${E.globalMult(S).toFixed(2)}</b>
        ${Date.now() < S.boost.until ? ' · <b style="color:#8ef0bb">буст активен</b>' : ''}</div>
    </div>
    <div class="subtabs">
      <button class="subtab ${sub.biz === 'all' ? 'on' : ''}" data-act="sub" data-id="biz" data-v="all">Все</button>
      <button class="subtab ${sub.biz === 'mine' ? 'on' : ''}" data-act="sub" data-id="biz" data-v="mine">Мои (${mine.length})</button>
      <button class="subtab ${buyMode === 1 ? 'on' : ''}" data-act="buymode" data-v="1">x1</button>
      <button class="subtab ${buyMode === 10 ? 'on' : ''}" data-act="buymode" data-v="10">x10</button>
      <button class="subtab ${buyMode === 'max' ? 'on' : ''}" data-act="buymode" data-v="max">MAX</button>
    </div>
    <div class="list">${cards || '<div class="empty">Пока нет купленных бизнесов</div>'}</div>
  </div>`;
}

/* ================= ЭКРАН: ГАРАЖ ================= */
function renderGarage() {
  const src = sub.garage === 'cars' ? CARS : sub.garage === 'houses' ? HOUSES : LUXURY;
  const kind = sub.garage === 'cars' ? 'cars' : sub.garage === 'houses' ? 'houses' : 'lux';
  const cards = src.map(def => {
    const own = !!S.owned[kind][def.id];
    const can = S.cash >= def.price;
    return `<div class="item big">
      ${own ? '<div class="owned">КУПЛЕНО</div>' : ''}
      <div class="thumb">${thumb(def)}</div>
      <div class="row" style="margin-top:10px">
        <div class="grow"><div class="item-name">${def.name}</div><div class="item-desc">${def.sub}</div></div>
        <div class="right"><div class="bonus gold">${E.money(def.price)}</div></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        <span class="bonus">тап +${Math.round((def.tap || 0) * 100)}%</span>
        <span class="bonus">доход +${Math.round((def.income || 0) * 100)}%</span>
        ${def.offline ? `<span class="bonus gold">офлайн ${def.offline} ч</span>` : ''}
        <span class="bonus gold">+${E.fmt(def.xp)} XP</span>
      </div>
      <button class="btn ${own ? '' : 'buy'}" style="margin-top:10px" data-act="buy-item" data-kind="${kind}" data-id="${def.id}" ${own || !can ? 'disabled' : ''}>
        ${own ? 'В собственности' : can ? 'Купить' : `Нужно ${E.money(def.price)}`}</button>
    </div>`;
  }).join('');
  const ownedCount = Object.keys(S.owned[kind]).length;
  return `<div class="page">
    <div class="subtabs">
      <button class="subtab ${sub.garage === 'cars' ? 'on' : ''}" data-act="sub" data-id="garage" data-v="cars">Авто</button>
      <button class="subtab ${sub.garage === 'houses' ? 'on' : ''}" data-act="sub" data-id="garage" data-v="houses">Дома</button>
      <button class="subtab ${sub.garage === 'lux' ? 'on' : ''}" data-act="sub" data-id="garage" data-v="lux">Роскошь</button>
    </div>
    <div class="card" style="margin-bottom:10px">
      <div class="row"><div class="grow"><div class="small">Собрано</div><h3>${ownedCount} / ${src.length}</h3></div>
      <div class="right"><div class="small">Бонус к доходу</div><h3 style="color:#8ef0bb">+${Math.round((E.ownedItems(S).reduce((a, b) => a + (b.income || 0), 0)) * 100)}%</h3></div></div>
    </div>
    <div class="list">${cards}</div>
  </div>`;
}

/* ================= ЭКРАН: КРИПТА ================= */
function renderCrypto() {
  if (sub.crypto === 'mining') return renderMining();
  if (sub.crypto === 'bank') return renderBank();
  const total = E.cryptoValue(S);
  const rows = COINS.map(c => {
    const p = S.crypto.prices[c.id];
    const h = S.crypto.hist[c.id];
    const first = h[0] || p;
    const ch = (p - first) / first * 100;
    const hold = (S.crypto.hold[c.id] || 0) + (S.crypto.stake[c.id] || 0);
    return `<button class="coin-row" data-act="coin" data-id="${c.id}" id="cr-${c.id}">
      <div class="coin-ico">${coinLogo(c.id, c.color)}</div>
      <div class="grow">
        <div class="item-name">${c.name} <span class="small">${c.id}</span></div>
        <div class="muted" data-dyn="price-${c.id}">${E.money(p)}</div>
      </div>
      <div class="right">
        <div class="${ch >= 0 ? 'up' : 'down'}" data-dyn="chg-${c.id}">${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%</div>
        <div class="small" data-dyn="hold-${c.id}">${E.fmtCoin(hold, c.dec)} ${c.id}</div>
      </div>
    </button>`;
  }).join('');
  return `<div class="page">
    <div class="subtabs">
      <button class="subtab on" data-act="sub" data-id="crypto" data-v="exchange">Биржа</button>
      <button class="subtab" data-act="sub" data-id="crypto" data-v="mining">Майнинг</button>
      <button class="subtab" data-act="sub" data-id="crypto" data-v="bank">Банк</button>
    </div>
    <div class="card">
      <div class="row"><div class="grow"><div class="small">Крипто-портфель</div><h3 data-dyn="cval">${E.money(total)}</h3></div>
      <div class="right"><div class="small">Доля активов</div><h3>${E.netWorth(S) > 0 ? (total / E.netWorth(S) * 100).toFixed(1) : '0'}%</h3></div></div>
      <div class="chart" style="margin-top:10px">${chartSvg(S.crypto.hist.BTC, '#f7931a')}</div>
      <div class="small" style="text-align:center;margin-top:6px">Bitcoin · последние 3 минуты</div>
    </div>
    <div class="sec"><h2>Рынок</h2><span class="small">комиссия 0.8–1.5%</span></div>
    <div class="list">${rows}</div>
    <button class="btn" style="margin-top:12px" data-act="news-open">${icon('fire')} Новости рынка</button>
  </div>`;
}

function renderMining() {
  const cost = E.rigCost(S.rigs);
  const btcS = E.rigIncome(S);
  const usdS = btcS * S.crypto.prices.BTC;
  const rigs = Array.from({ length: Math.min(S.rigs, 24) }, (_, i) =>
    `<rect x="${4 + (i % 6) * 20}" y="${74 - Math.floor(i / 6) * 16}" width="16" height="12" rx="2" fill="#16242c" stroke="#2c4a56"/>
     <circle cx="${7 + (i % 6) * 20}" cy="${80 - Math.floor(i / 6) * 16}" r="1.4" fill="#4fe08f"/>`).join('');
  return `<div class="page">
    <div class="subtabs">
      <button class="subtab" data-act="sub" data-id="crypto" data-v="exchange">Биржа</button>
      <button class="subtab on" data-act="sub" data-id="crypto" data-v="mining">Майнинг</button>
      <button class="subtab" data-act="sub" data-id="crypto" data-v="bank">Банк</button>
    </div>
    <div class="card">
      <svg viewBox="0 0 120 90" style="width:100%;height:120px">
        <rect width="120" height="90" fill="#08120f"/><rect width="120" height="90" fill="url(#none)"/>
        ${rigs || '<text x="60" y="48" text-anchor="middle" font-size="7" fill="#4a6b60">нет оборудования</text>'}
        <rect y="76" width="120" height="14" fill="#0a1512"/>
      </svg>
      <div class="row" style="margin-top:10px">
        <div class="grow"><div class="small">Ригов</div><h3>${S.rigs}</h3></div>
        <div class="right"><div class="small">Майнинг</div><h3 style="color:#ffd98a">${btcS.toExponential(2)} BTC/с</h3></div>
      </div>
      <div class="muted" style="margin-top:6px">≈ ${E.money(usdS)}/сек · всего намайнено ${E.fmtCoin(S.stats.mined || 0, 6)} BTC</div>
      <button class="btn buy" style="margin-top:12px" data-act="buy-rig" ${S.cash >= cost ? '' : 'disabled'}>Купить риг · ${E.money(cost)}</button>
      <div class="small" style="margin-top:8px">Каждый риг: +${RIG.btcPerSec.toExponential(2)} BTC/сек. Следующая цена растёт на ${Math.round((RIG.costMult - 1) * 100)}%.</div>
    </div>
    <div class="sec"><h2>Стейкинг</h2><span class="small">≈0.5%/час</span></div>
    <div class="list">
      ${COINS.filter(c => c.id !== 'USDX').map(c => {
        const hold = S.crypto.hold[c.id] || 0, st = S.crypto.stake[c.id] || 0;
        return `<div class="item">
          <div class="thumb" style="width:46px;height:46px">${coinLogo(c.id, c.color)}</div>
          <div class="item-body"><div class="item-name">${c.name}</div>
            <div class="item-desc">в кошельке ${E.fmtCoin(hold, c.dec)} · в стейке ${E.fmtCoin(st, c.dec)}</div></div>
          <div style="width:96px;flex:0 0 auto">
            <button class="btn sm grn" data-act="stake" data-id="${c.id}" ${hold > 0 ? '' : 'disabled'}>В стейк</button>
            <button class="btn sm" style="margin-top:6px" data-act="unstake" data-id="${c.id}" ${st > 0 ? '' : 'disabled'}>Вывести</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderBank() {
  const dep = S.bank.deposit, loan = S.bank.loan;
  return `<div class="page">
    <div class="subtabs">
      <button class="subtab" data-act="sub" data-id="crypto" data-v="exchange">Биржа</button>
      <button class="subtab" data-act="sub" data-id="crypto" data-v="mining">Майнинг</button>
      <button class="subtab on" data-act="sub" data-id="crypto" data-v="bank">Банк</button>
    </div>
    <div class="card">
      <div class="row"><div class="grow"><div class="small">Вклад</div><h3 data-dyn="dep">${E.money(dep)}</h3></div>
      <div class="right"><span class="pill g">+${(BANK.depositRate * 60).toFixed(1)}%/час</span></div></div>
      <div class="muted" style="margin:8px 0">Проценты капают каждую секунду и считаются даже офлайн.</div>
      <div class="grid2">
        <button class="btn sm grn" data-act="bank" data-v="dep-in">Положить</button>
        <button class="btn sm" data-act="bank" data-v="dep-out">Снять</button>
      </div>
    </div>
    <div class="card">
      <div class="row"><div class="grow"><div class="small">Кредит</div><h3 data-dyn="loan">${E.money(loan)}</h3></div>
      <div class="right"><span class="pill r">-${(BANK.loanRate * 60).toFixed(1)}%/час</span></div></div>
      <div class="muted" style="margin:8px 0">Лимит: ${E.money(E.netWorth(S) * BANK.loanMaxPart)} от активов.</div>
      <div class="grid2">
        <button class="btn sm" data-act="bank" data-v="loan-take">Взять</button>
        <button class="btn sm red" data-act="bank" data-v="loan-repay">Погасить</button>
      </div>
    </div>
    <div class="card">
      <h3>Как это работает</h3>
      <div class="kv"><span>Ставка по вкладу</span><b>${(BANK.depositRate * 100).toFixed(3)}% / мин</b></div>
      <div class="kv"><span>Ставка по кредиту</span><b>${(BANK.loanRate * 100).toFixed(3)}% / мин</b></div>
      <div class="kv"><span>Макс. кредит</span><b>${Math.round(BANK.loanMaxPart * 100)}% активов</b></div>
      <div class="kv"><span>Офлайн-лимит</span><b>${E.fmtTime(E.offlineCap(S))}</b></div>
    </div>
  </div>`;
}

/* ================= ЭКРАН: ПРОФИЛЬ ================= */
function renderProfile() {
  const st = S.stats;
  const gain = E.prestigeGain(S);
  const nw = E.netWorth(S);
  const dIdx = Math.min(S.daily.streak, 7) - 1;
  const canDaily = !S.daily.last || Date.now() - S.daily.last >= 20 * 3600 * 1000;
  const dailyHtml = [15000, 60000, 250000, 1000000, 5000000, 25000000, 100000000].map((v, i) =>
    `<div class="stat" style="text-align:center;${i <= dIdx ? 'border-color:rgba(255,203,71,.5)' : ''}">
      <span>День ${i + 1}</span><b style="font-size:12px">${E.fmt(v * (1 + S.level * .15))}</b></div>`).join('');
  const ach = ACHIEVEMENTS.map(a => {
    const done = !!S.ach[a.id];
    return `<div class="ach ${done ? 'done' : ''}"><div class="ic">${icon(a.icon)}</div>
      <div class="grow"><div class="item-name">${a.name}</div><div class="item-desc">${a.desc}</div></div>
      <div class="right"><div class="small">${done ? '✓ получено' : a.reward ? E.money(a.reward) : '—'}</div></div></div>`;
  }).join('');

  return `<div class="page">
    <div class="card">
      <div class="row">
        <div class="hud-avatar" style="width:58px;height:58px;border-radius:18px">${avatar(S.level)}</div>
        <div class="grow">
          <h3>${E.statusForLevel(S.level)}</h3>
          <div class="muted">Уровень ${S.level} · ${E.fmt(S.xp)} XP</div>
          <div class="bar" style="margin-top:6px"><i style="width:${Math.min(100, E.levelFromXp(S.xp).into / E.levelFromXp(S.xp).need * 100)}%"></i></div>
        </div>
        <div class="right"><span class="pill b">${icon('gem')}</span><h3 style="color:#b98bff">${S.prestige.gems}</h3></div>
      </div>
    </div>

    <div class="sec"><h2>Активы</h2></div>
    <div class="stat-grid">
      <div class="stat"><span>Всего активов</span><b>${E.money(nw)}</b></div>
      <div class="stat"><span>Доход</span><b style="color:#8ef0bb">${E.money(E.incomePerSec(S))}/с</b></div>
      <div class="stat"><span>Наличные</span><b>${E.money(S.cash)}</b></div>
      <div class="stat"><span>Крипта</span><b>${E.money(E.cryptoValue(S))}</b></div>
      <div class="stat"><span>Заработано</span><b>${E.money(st.earned)}</b></div>
      <div class="stat"><span>Потрачено</span><b>${E.money(st.spent)}</b></div>
      <div class="stat"><span>Нажатий</span><b>${E.fmtGroup(st.taps)}</b></div>
      <div class="stat"><span>Сделок</span><b>${st.trades}</b></div>
      <div class="stat"><span>Намайнено</span><b>${E.fmtCoin(st.mined || 0, 6)} ₿</b></div>
      <div class="stat"><span>В игре</span><b>${E.fmtTime(st.playtime)}</b></div>
    </div>

    <div class="sec"><h2>Престиж</h2><span class="small">порог ${E.money(E.PRESTIGE_GATE)}</span></div>
    <div class="card">
      <div class="muted">Сбрось бизнесы и наличные — получи <b style="color:#b98bff">алмазы</b>. Каждый алмаз: +3% к доходу и +2% к тапу навсегда.</div>
      <div class="kv"><span>Получишь сейчас</span><b style="color:#b98bff">${gain} 💎</b></div>
      <div class="kv"><span>Перерождений</span><b>${S.prestige.resets}</b></div>
      <button class="btn pur" style="margin-top:10px" data-act="prestige" ${gain > 0 ? '' : 'disabled'}>${gain > 0 ? `Переродиться за ${gain} 💎` : `Нужно активов на ${E.money(E.PRESTIGE_GATE)}`}</button>
    </div>

    <div class="sec"><h2>Ежедневная награда</h2><span class="small">серия: ${S.daily.streak} дн.</span></div>
    <div class="card">
      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr);gap:6px">${dailyHtml}</div>
      <button class="btn ${canDaily ? 'buy' : ''}" style="margin-top:12px" data-act="daily-claim" ${canDaily ? '' : 'disabled'}>
        ${canDaily ? 'Забрать награду' : `Следующая через ${E.fmtTime(20 * 3600 - (Date.now() - S.daily.last) / 1000)}`}</button>
    </div>

    <div class="sec"><h2>Достижения</h2><span class="small">${Object.keys(S.ach).length}/${ACHIEVEMENTS.length}</span></div>
    <div class="list">${ach}</div>

    <div class="sec"><h2>Настройки</h2></div>
    <div class="card">
      <div class="row" style="padding:6px 0"><div class="grow"><h3 style="font-size:14px">Звук</h3><div class="small">эффекты нажатий</div></div>
        <div class="switch ${S.settings.sound ? 'on' : ''}" data-act="toggle" data-id="sound"><i></i></div></div>
      <div class="row" style="padding:6px 0"><div class="grow"><h3 style="font-size:14px">Вибрация</h3><div class="small">отклик на тапы</div></div>
        <div class="switch ${S.settings.haptic ? 'on' : ''}" data-act="toggle" data-id="haptic"><i></i></div></div>
      <div class="grid2" style="margin-top:10px">
        <button class="btn sm" data-act="export">${icon('money')} Копия сейва</button>
        <button class="btn sm" data-act="import">${icon('gear')} Вставить сейв</button>
      </div>
      <button class="btn red sm" style="margin-top:8px" data-act="reset">${icon('fire')} Сбросить прогресс</button>
    </div>
    <div class="small" style="text-align:center;margin-top:14px">SUPRA MAGNATE · сделано с любовью к деньгам</div>
  </div>`;
}

/* ================= РЕНДЕР ================= */
function render(keepScroll = false) {
  const y = view.scrollTop;
  const html = { empire: renderEmpire, biz: renderBiz, garage: renderGarage, crypto: renderCrypto, profile: renderProfile }[tab]();
  view.innerHTML = html;
  if (keepScroll) view.scrollTop = y;
  renderTabbar();
  updateHud();
}

/* ================= ДИНАМИЧЕСКИЕ ЗНАЧЕНИЯ ================= */
function updateDynamic() {
  if (tab === 'empire') {
    const el = $('[data-dyn="jobleft"]'), bar = $('[data-dyn="jobbar"]');
    if (el && S.work.id) {
      const left = (S.work.until - Date.now()) / 1000;
      el.textContent = left > 0 ? 'Осталось ' + E.fmtTime(left) : 'Готово!';
      const j = JOBS.find(x => x.id === S.work.id);
      if (bar) bar.style.width = (100 - Math.max(0, left) / j.time * 100).toFixed(1) + '%';
      if (left <= 0) { const r = E.finishWork(S); toast(`Смена завершена: +${E.money(r.pay)}`, 'ok', 'money'); beep(880, .12, 'triangle', .05); render(true); }
    }
    S.quests.list.forEach((qq, i) => {
      const btn = $(`[data-act="quest"][data-id="${i}"]`);
      if (btn && !S.quests.done[i] && E.questProgress(S, qq) >= qq.target && btn.disabled) render(true);
    });
  }
  if (tab === 'biz') {
    for (const def of BUSINESSES) {
      const card = $(`#bz-${def.id}`);
      if (!card) continue;
      const b = S.biz[def.id], { cost } = bulkCost(def, b.level, buyMode);
      const btn = card.querySelector('[data-act="buy-biz"]');
      if (btn) { btn.disabled = S.cash < cost || locked(def); btn.querySelector('span').textContent = locked(def) ? '🔒' : E.fmt(cost); }
      const inc = card.querySelector('.item-desc');
      if (inc && b.level) inc.textContent = `${E.money(E.bizBaseIncome(def, b.level, b.mgr) * E.globalMult(S))}/сек · x${E.milestone(b.level)} бонус`;
    }
  }
  if (tab === 'crypto' && sub.crypto === 'exchange') {
    for (const c of COINS) {
      const p = S.crypto.prices[c.id], h = S.crypto.hist[c.id], first = h[0] || p;
      const ch = (p - first) / first * 100;
      const pe = $(`[data-dyn="price-${c.id}"]`); if (pe) pe.textContent = E.money(p);
      const ce = $(`[data-dyn="chg-${c.id}"]`);
      if (ce) { ce.textContent = `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`; ce.className = ch >= 0 ? 'up' : 'down'; }
      const he = $(`[data-dyn="hold-${c.id}"]`);
      if (he) he.textContent = `${E.fmtCoin((S.crypto.hold[c.id] || 0) + (S.crypto.stake[c.id] || 0), c.dec)} ${c.id}`;
    }
    const cv = $('[data-dyn="cval"]'); if (cv) cv.textContent = E.money(E.cryptoValue(S));
  }
  if (tab === 'crypto' && sub.crypto === 'bank') {
    const d = $('[data-dyn="dep"]'); if (d) d.textContent = E.money(S.bank.deposit);
    const l = $('[data-dyn="loan"]'); if (l) l.textContent = E.money(S.bank.loan);
  }
}

/* ================= ДЕЙСТВИЯ ================= */
function after() { scheduleSave(S); render(true); }

const ACTIONS = {
  tab(el) { tab = el.dataset.id; view.scrollTop = 0; render(); beep(520, .04, 'sine', .025); },
  sub(el) { sub[el.dataset.id] = el.dataset.v; render(); },
  buymode(el) { buyMode = el.dataset.v === 'max' ? 'max' : +el.dataset.v; render(true); },
  'close-sheet'() { closeSheet(); },

  tap(el, ev) {
    const v = E.tap(S);
    const r = el.getBoundingClientRect();
    const x = ev?.clientX ?? r.left + r.width / 2, y = ev?.clientY ?? r.top + 30;
    floatText(x, y, '+' + E.fmt(v));
    if (Math.random() < .5) sparks(x, y, 4);
    beep(560 + Math.min(240, S.stats.taps % 12 * 20), .05, 'sine', .03);
    vib(8);
    updateHud();
    const s = $('.tap-stat'); if (s) s.textContent = `+${E.money(E.tapPower(S))} за нажатие · ${E.money(E.incomePerSec(S))}/сек пассивно`;
  },

  'buy-biz'(el) {
    const id = el.dataset.id, def = BUSINESSES.find(b => b.id === id);
    const n = buyMode === 'max' ? bulkCost(def, S.biz[id].level, 'max').n : buyMode;
    const r = E.buyBiz(S, id, n);
    if (!r.ok) { toast(r.msg, 'err', 'fire'); vib(40); return; }
    toast(`${def.name}: +${r.bought} ур. · -${E.money(r.spent)}`, 'ok', 'biz');
    beep(720, .08, 'triangle', .05); vib(15);
    E.checkAchievements(S).forEach(a => toast(`🏆 Достижение: ${a.name}`, 'gold', 'trophy'));
    after();
  },
  'buy-mgr'(el) {
    const r = E.buyManager(S, el.dataset.id);
    toast(r.ok ? 'Менеджер нанят: авто-сбор и +25% дохода' : r.msg, r.ok ? 'ok' : 'err', 'user');
    if (r.ok) beep(880, .1, 'triangle', .05);
    after();
  },
  'buy-item'(el) {
    const r = E.buyItem(S, el.dataset.kind, el.dataset.id);
    if (!r.ok) { toast(r.msg, 'err', 'fire'); vib(40); return; }
    toast(`${r.def.name} — твоё! Бонус активирован`, 'gold', 'trophy');
    beep(1000, .14, 'triangle', .06); vib([12, 40, 12]);
    sparks(window.innerWidth / 2, window.innerHeight / 2, 16);
    E.checkAchievements(S).forEach(a => toast(`🏆 Достижение: ${a.name}`, 'gold', 'trophy'));
    after();
  },
  'buy-rig'() {
    const r = E.buyRig(S);
    toast(r.ok ? `Риг #${r.rigs} установлен: -${E.money(r.cost)}` : r.msg, r.ok ? 'ok' : 'err', 'rig');
    if (r.ok) beep(300, .12, 'sawtooth', .04);
    after();
  },
  work(el) {
    const r = E.startWork(S, el.dataset.id);
    if (!r.ok) { toast(r.msg, 'err', 'fire'); return; }
    toast(`Смена началась: ${r.job.name}`, 'ok', 'work');
    beep(660, .08, 'sine', .04);
    after();
  },
  quest(el) {
    const r = E.claimQuest(S, +el.dataset.id);
    toast(r.ok ? `Задание выполнено: +${E.money(r.rew)}` : r.msg, r.ok ? 'ok' : 'err', 'target');
    if (r.ok) beep(920, .1, 'triangle', .05);
    after();
  },
  coin(el) { selCoin = el.dataset.id; coinSheet(); },
  stake(el) { const r = E.stakeCrypto(S, el.dataset.id, S.crypto.hold[el.dataset.id]); toast(r.ok ? 'Всё отправлено в стейкинг' : r.msg, r.ok ? 'ok' : 'err', 'gem'); after(); },
  unstake(el) { const r = E.unstakeCrypto(S, el.dataset.id, S.crypto.stake[el.dataset.id]); toast(r.ok ? 'Выведено из стейкинга' : r.msg, r.ok ? 'ok' : 'err', 'gem'); after(); },
  bank(el) { bankSheet(el.dataset.v); },
  'daily'() { sheet(dailySheetHtml()); },
  'daily-claim'() {
    const r = E.claimDaily(S);
    if (!r.ok) { toast(r.msg, 'err', 'gift'); return; }
    toast(`День ${r.day}: +${E.money(r.cash)}${r.gems ? ` и +${r.gems} 💎` : ''}`, 'gold', 'gift');
    beep(1040, .16, 'triangle', .06); sparks(window.innerWidth / 2, 200, 14);
    E.checkAchievements(S).forEach(a => toast(`🏆 Достижение: ${a.name}`, 'gold', 'trophy'));
    after();
  },
  'wheel-open'() { wheelSheet(); },
  spin() {
    if (wheelSpinning) return;
    const r = E.spinWheel(S, 1);
    if (!r.ok) { toast(r.msg, 'err', 'gem'); return; }
    wheelSpinning = true;
    const seg = 360 / WHEEL.length;
    const target = 360 * 5 - (r.index * seg + seg / 2);
    wheelAngle = 0;
    const w = $('#wheelSvg');
    const start = performance.now(), dur = 2600;
    const anim = now => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const a = target * e;
      if (w) w.innerHTML = wheelSvg(WHEEL, a);
      if (p < 1) requestAnimationFrame(anim);
      else {
        wheelSpinning = false;
        const pr = r.prize;
        const txt = pr.cash ? `+${E.money(pr.cash)}` : pr.gems ? `+${pr.gems} 💎` : pr.btc ? `+${pr.btc} BTC` : 'Буст x2 на 60 сек';
        toast(`Рулетка: ${txt}`, 'gold', 'gem');
        beep(1200, .18, 'triangle', .06);
        after(); wheelSheet();
      }
    };
    requestAnimationFrame(anim);
  },
  boost() { boostSheet(); },
  'boost-now'() {
    S.boost = { until: Date.now() + 120000, mult: 2 };
    closeSheet(); toast('Буст x2 на 2 минуты!', 'gold', 'bolt');
    beep(1100, .12, 'triangle', .05); after();
  },
  'news-open'() { newsSheet(); },
  prestige() { prestigeSheet(); },
  'prestige-do'() {
    const g = E.doPrestige(S);
    closeSheet();
    toast(`Перерождение! Получено ${g} 💎`, 'gold', 'gem');
    beep(240, .3, 'sawtooth', .06);
    sparks(window.innerWidth / 2, window.innerHeight / 2, 24);
    E.checkAchievements(S).forEach(a => toast(`🏆 Достижение: ${a.name}`, 'gold', 'trophy'));
    save(S); render();
  },
  toggle(el) {
    const k = el.dataset.id;
    S.settings[k] = !S.settings[k];
    el.classList.toggle('on', S.settings[k]);
    if (k === 'sound' && S.settings.sound) beep(800, .08, 'sine', .05);
    scheduleSave(S);
  },
  export() {
    const code = exportSave(S);
    sheet(`<h2>Копия сейва</h2><div class="muted">Скопируй код, чтобы перенести прогресс на другой телефон.</div>
      <textarea id="saveCode" rows="6" style="width:100%;margin-top:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid var(--line2);color:var(--tx);font-size:11px">${code}</textarea>
      <button class="btn buy" style="margin-top:10px" data-act="copy-save">Скопировать</button>`);
  },
  'copy-save'() {
    const t = $('#saveCode'); t.select(); t.setSelectionRange(0, 99999);
    try { navigator.clipboard.writeText(t.value); toast('Сейв скопирован', 'ok', 'money'); }
    catch { document.execCommand('copy'); toast('Сейв скопирован', 'ok', 'money'); }
  },
  import() {
    sheet(`<h2>Вставить сейв</h2><div class="muted">Текущий прогресс будет заменён.</div>
      <textarea id="loadCode" rows="5" placeholder="Вставь код сохранения" style="width:100%;margin-top:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid var(--line2);color:var(--tx);font-size:11px"></textarea>
      <button class="btn buy" style="margin-top:10px" data-act="import-do">Загрузить</button>`);
  },
  'import-do'() {
    const st = importSave($('#loadCode').value);
    if (!st) { toast('Код не подошёл', 'err', 'fire'); return; }
    S = st; closeSheet(); save(S); render(); toast('Сейв загружен', 'ok', 'gear');
  },
  reset() {
    sheet(`<h2>Сбросить прогресс?</h2><div class="muted">Всё пропадёт: деньги, бизнесы, тачки, крипта. Действие необратимо.</div>
      <div class="grid2" style="margin-top:16px">
        <button class="btn" data-act="close-sheet">Отмена</button>
        <button class="btn red" data-act="reset-do">Удалить всё</button></div>`);
  },
  'reset-do'() {
    wipe(); S = E.createState(); E.rollQuests(S);
    closeSheet(); save(S); render(); toast('Новая игра началась', 'ok', 'fire');
  },
  'coin-buy'(el) {
    const pct = +el.dataset.v / 100;
    const usd = S.cash * pct;
    const r = E.buyCrypto(S, selCoin, usd);
    if (!r.ok) { toast(r.msg, 'err', 'fire'); return; }
    toast(`Куплено ${E.fmtCoin(r.got, 6)} ${selCoin} за ${E.money(usd)}`, 'ok', 'btc');
    beep(760, .09, 'triangle', .05);
    E.checkAchievements(S).forEach(a => toast(`🏆 Достижение: ${a.name}`, 'gold', 'trophy'));
    after(); coinSheet();
  },
  'coin-sell'(el) {
    const pct = +el.dataset.v / 100;
    const r = E.sellCrypto(S, selCoin, (S.crypto.hold[selCoin] || 0) * pct);
    if (!r.ok) { toast(r.msg, 'err', 'fire'); return; }
    toast(`Продано за ${E.money(r.usd)}`, 'ok', 'money');
    beep(520, .09, 'triangle', .05);
    after(); coinSheet();
  },
};

/* ================= SHEET-ЭКРАНЫ ================= */
function coinSheet() {
  const c = COINS.find(x => x.id === selCoin);
  const p = S.crypto.prices[c.id], h = S.crypto.hist[c.id], first = h[0] || p;
  const ch = (p - first) / first * 100;
  const hold = S.crypto.hold[c.id] || 0, st = S.crypto.stake[c.id] || 0;
  sheet(`<h2 style="display:flex;align-items:center;gap:10px"><span style="width:34px;height:34px;display:block">${coinLogo(c.id, c.color)}</span>${c.name}</h2>
    <div class="row"><div class="grow"><h3 style="font-size:24px">${E.money(p)}</h3>
      <div class="${ch >= 0 ? 'up' : 'down'}">${ch >= 0 ? '▲' : '▼'} ${Math.abs(ch).toFixed(2)}% за 3 мин</div></div>
      <div class="right"><div class="small">в кошельке</div><b>${E.fmtCoin(hold, c.dec)} ${c.id}</b>
      <div class="small">${E.money(hold * p)}</div></div></div>
    <div class="chart" style="margin-top:12px">${chartSvg(h, c.color)}</div>
    <div class="kv"><span>В стейкинге</span><b>${E.fmtCoin(st, c.dec)} ${c.id}</b></div>
    <div class="kv"><span>Комиссия</span><b>${(c.fee * 100).toFixed(1)}%</b></div>
    <div class="kv"><span>Волатильность</span><b>${(c.vol * 100).toFixed(1)}%</b></div>
    <div class="sec" style="margin:14px 0 8px"><h2>Купить за $</h2></div>
    <div class="grid3">
      ${[25, 50, 100].map(v => `<button class="btn sm buy" data-act="coin-buy" data-v="${v}">${v}%<br><span class="small">${E.money(S.cash * v / 100)}</span></button>`).join('')}
    </div>
    <div class="sec" style="margin:14px 0 8px"><h2>Продать</h2></div>
    <div class="grid3">
      ${[25, 50, 100].map(v => `<button class="btn sm red" data-act="coin-sell" data-v="${v}">${v}%<br><span class="small">${E.money(hold * v / 100 * p)}</span></button>`).join('')}
    </div>`);
}
function bankSheet(mode) {
  const isIn = mode === 'dep-in', isOut = mode === 'dep-out', isTake = mode === 'loan-take';
  const max = isIn ? S.cash : isOut ? S.bank.deposit : isTake ? Math.max(0, E.netWorth(S) * BANK.loanMaxPart - S.bank.loan) : S.bank.loan;
  const title = { 'dep-in': 'Положить на вклад', 'dep-out': 'Снять с вклада', 'loan-take': 'Взять кредит', 'loan-repay': 'Погасить кредит' }[mode];
  sheet(`<h2>${title}</h2><div class="muted">Доступно: <b>${E.money(max)}</b></div>
    <input type="number" id="bankSum" value="${Math.floor(max)}" min="0" max="${Math.floor(max)}" style="margin-top:12px">
    <div class="grid3" style="margin-top:10px">
      ${[25, 50, 100].map(v => `<button class="btn sm" data-act="bank-pct" data-v="${v}">${v}%</button>`).join('')}</div>
    <button class="btn buy" style="margin-top:12px" data-act="bank-do" data-v="${mode}">Подтвердить</button>`, {
    onMount() {
      $$('[data-act="bank-pct"]').forEach(b => b.onclick = () => { $('#bankSum').value = Math.floor(max * (+b.dataset.v / 100)); });
    }
  });
}
function dailySheetHtml() {
  const can = !S.daily.last || Date.now() - S.daily.last >= 20 * 3600 * 1000;
  const dIdx = Math.min(S.daily.streak, 7) - 1;
  return `<h2>Ежедневная награда</h2>
    <div class="muted">Серия: ${S.daily.streak} дней. Заходи каждый день — награды растут.</div>
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px">
      ${[15000, 60000, 250000, 1000000, 5000000, 25000000, 100000000].map((v, i) =>
        `<div class="stat" style="text-align:center;${i <= dIdx ? 'border-color:rgba(255,203,71,.5)' : ''}"><span>День ${i + 1}</span><b style="font-size:11px">${E.fmt(v * (1 + S.level * .15))}</b></div>`).join('')}
    </div>
    <button class="btn ${can ? 'buy' : ''}" style="margin-top:14px" data-act="daily-claim" ${can ? '' : 'disabled'}>
      ${can ? 'Забрать' : `Следующая через ${E.fmtTime(20 * 3600 - (Date.now() - S.daily.last) / 1000)}`}</button>`;
}
function wheelSheet() {
  sheet(`<h2>Рулетка магната</h2><div class="muted">Крутка стоит 1 💎. Джекпот — 7200 секунд твоего дохода.</div>
    <div id="wheelSvg" style="margin:14px auto;width:220px">${wheelSvg(WHEEL, wheelAngle)}</div>
    <button class="btn pur" data-act="spin">Крутить за 1 💎</button>
    <div class="kv" style="margin-top:12px"><span>Твои алмазы</span><b style="color:#b98bff">${S.prestige.gems} 💎</b></div>`);
}
function boostSheet() {
  const left = Math.max(0, S.boost.until - Date.now());
  if (left) { toast(`Буст уже активен: ${E.fmtTime(left / 1000)}`, '', 'bolt'); return; }
  sheet(`<h2>Буст x2</h2><div class="muted">Удвой весь доход на 2 минуты. Посмотри «рекламу» — и буст твой.</div>
    <div id="adBox" style="margin:14px 0;padding:22px;border-radius:16px;text-align:center;background:linear-gradient(140deg,#243455,#131c30);border:1px dashed var(--line2)">
      <div style="font-size:13px;color:var(--tx2)">Реклама</div>
      <div id="adCount" style="font-size:40px;font-weight:900;color:#ffcb47">5</div>
      <div class="small">не закрывай окно</div></div>
    <button class="btn buy" data-act="boost-now" id="boostBtn" disabled>Получить буст</button>`, {
    onMount() {
      let n = 5;
      const t = setInterval(() => {
        n--;
        const el = $('#adCount');
        if (!el) { clearInterval(t); return; }
        el.textContent = n > 0 ? n : '✓';
        if (n <= 0) { clearInterval(t); const b = $('#boostBtn'); if (b) b.disabled = false; }
      }, 900);
    }
  });
}
function newsSheet() {
  const items = COINS.filter(c => c.id !== 'USDX').map(c => {
    const p = S.crypto.prices[c.id], h = S.crypto.hist[c.id], ch = (p - h[0]) / h[0] * 100;
    return `<div class="coin-row"><div class="coin-ico">${coinLogo(c.id, c.color)}</div>
      <div class="grow"><div class="item-name">${c.name}</div><div class="muted">${E.money(p)}</div></div>
      <div class="${ch >= 0 ? 'up' : 'down'}">${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%</div></div>`;
  }).join('');
  sheet(`<h2>Новости рынка</h2>${items}
    <div class="sec"><h2>Лента</h2></div>
    ${NEWS.slice(0, 6).map(n => `<div class="ach"><div class="ic">${icon(n.up ? 'chart' : 'fire')}</div>
      <div class="grow"><div class="item-desc" style="font-size:12.5px;color:var(--tx)">${n.t}</div></div>
      <div class="${n.up ? 'up' : 'down'}">${n.up ? '▲' : '▼'}</div></div>`).join('')}`);
}
function prestigeSheet() {
  const g = E.prestigeGain(S);
  sheet(`<h2>Перерождение</h2>
    <div class="muted">Ты потеряешь наличные, бизнесы, риги, вклад и крипто-кошелёк.<br>
      Алмазы, тачки, дома, предметы роскоши и достижения останутся навсегда.</div>
    <div class="kv"><span>Получишь</span><b style="color:#b98bff">${g} 💎</b></div>
    <div class="kv"><span>Новый бонус к доходу</span><b>+${((S.prestige.gems + g) * 3)}%</b></div>
    <div class="grid2" style="margin-top:16px">
      <button class="btn" data-act="close-sheet">Отмена</button>
      <button class="btn pur" data-act="prestige-do">Переродиться</button></div>`);
}
function offlineSheet(r) {
  sheet(`<h2>С возвращением!</h2>
    <div class="muted">Тебя не было ${E.fmtTime(r.sec)}. Империя работала без тебя.</div>
    <div class="card" style="margin-top:14px">
      <div class="kv"><span>Заработано</span><b style="color:#8ef0bb">${E.money(r.earned)}</b></div>
      <div class="kv"><span>Темп</span><b>${E.money(r.inc)}/сек</b></div>
      ${r.btc ? `<div class="kv"><span>Намайнено</span><b>${E.fmtCoin(r.btc, 6)} ₿</b></div>` : ''}
    </div>
    <div class="muted" style="margin-top:10px">💡 Найми менеджеров в бизнесы — офлайн-доход вырастет до 100%.</div>
    <button class="btn buy" style="margin-top:14px" data-act="close-sheet">Забрать</button>`);
}

/* ================= СОБЫТИЯ ================= */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.dataset.act === 'tap') return; // тап обрабатывается на pointerdown
  const fn = ACTIONS[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el, e); }
});
$('#view').addEventListener('pointerdown', e => {
  const btn = e.target.closest('[data-act="tap"]');
  if (btn) ACTIONS.tap(btn, e);
});
window.addEventListener('beforeunload', () => save(S));
document.addEventListener('visibilitychange', () => { if (document.hidden) save(S); });

/* ================= ИГРОВОЙ ЦИКЛ ================= */
let lastT = performance.now(), acc = 0, newsT = 0;
function loop(now) {
  const dt = Math.min((now - lastT) / 1000, 2);
  lastT = now;
  const before = S.cash;
  E.tick(S, dt);
  updateHud();
  acc += dt;
  if (acc > 0.25) { acc = 0; updateDynamic(); }
  // новости рынка раз в ~75 секунд
  newsT += dt;
  if (newsT > 75) {
    newsT = 0;
    const n = NEWS[Math.floor(Math.random() * NEWS.length)];
    const c = COINS.filter(x => x.id !== 'USDX')[Math.floor(Math.random() * 4)];
    E.newsPump(S, c.id, n.up ? 1 : -1, 0.04 + Math.random() * 0.09);
    toast(`${n.t} <span class="small">${c.id} ${n.up ? '▲' : '▼'}</span>`, n.up ? 'ok' : 'err', 'chart');
  }
  // автопроверка достижений раз в 3 секунды
  if (Math.floor(now / 3000) !== Math.floor((now - dt * 1000) / 3000)) {
    E.checkAchievements(S).forEach(a => { toast(`🏆 Достижение: ${a.name}${a.reward ? ` · +${E.money(a.reward)}` : ''}`, 'gold', 'trophy'); beep(1040, .14, 'triangle', .05); });
  }
  requestAnimationFrame(loop);
}

/* ================= СТАРТ ================= */
function boot() {
  const { state, fresh } = load();
  S = state || E.createState();
  if (!S.quests.list?.length || S.quests.date !== E.dayKey()) E.rollQuests(S);
  if (!fresh) {
    const r = E.offlineReport(S);
    if (r && r.earned > 0) setTimeout(() => offlineSheet(r), 700);
  } else {
    setTimeout(() => sheet(`<h2>Добро пожаловать, магнат!</h2>
      <div class="muted">У тебя ${E.money(S.cash)} и огромные амбиции.</div>
      <div class="card" style="margin-top:12px">
        <div class="kv"><span>1. Тапай по монете</span><b>быстрый кэш</b></div>
        <div class="kv"><span>2. Покупай бизнесы</span><b>пассивный доход</b></div>
        <div class="kv"><span>3. Качай уровни</span><b>открывай новое</b></div>
        <div class="kv"><span>4. Тачки и дома</span><b>бонусы навсегда</b></div>
        <div class="kv"><span>5. Крипта и майнинг</span><b>иксы или слив</b></div>
      </div>
      <button class="btn buy" style="margin-top:14px" data-act="close-sheet">Начать империю</button>`), 500);
  }
  render();
  requestAnimationFrame(loop);
  setInterval(() => {
    save(S);
    if (S.quests.date !== E.dayKey()) { E.rollQuests(S); toast('Новые задания дня!', 'gold', 'target'); }
  }, 15000);
  setTimeout(() => { $('#boot').classList.add('gone'); $('#app').hidden = false; }, 450);
  // PWA
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
