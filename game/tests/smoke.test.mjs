import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');

let _intervals = [];
function setup() {
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const _setInterval = setInterval;
  globalThis.setInterval = (fn, ms, ...a) => { const id = _setInterval(fn, ms, ...a); _intervals.push(id); return id; };
  globalThis._origClearInterval = clearInterval;
  globalThis._dom = dom;
  globalThis.window = w;
  globalThis.document = w.document;
  globalThis.localStorage = w.localStorage;
  globalThis.requestAnimationFrame = w.requestAnimationFrame.bind(w);
  globalThis.cancelAnimationFrame = w.cancelAnimationFrame.bind(w);
  return w;
}

const $ = sel => globalThis.document.querySelector(sel);
const click = el => el.dispatchEvent(new globalThis.window.MouseEvent('click', { bubbles: true, cancelable: true }));
const tap = () => {
  const b = $('[data-act="tap"]');
  b.dispatchEvent(new globalThis.window.MouseEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 100 }));
};
const tabBtn = id => $(`[data-act="tab"][data-id="${id}"]`);

test('full UI boot + interactions', async () => {
  setup();
  await import('../js/main.js');
  await new Promise(r => setTimeout(r, 60));

  // boot renders empire with tap button
  assert.ok($('[data-act="tap"]'), 'tap button exists');
  assert.ok($('main').innerHTML.includes('Задания дня'), 'quests shown');

  // tapping increases cash
  const cash0 = parseFloat($('#hudCash').textContent.replace(/[^\d.]/g, ''));
  for (let i = 0; i < 12; i++) tap();
  await new Promise(r => setTimeout(r, 300));
  const cash1 = parseFloat($('#hudCash').textContent.replace(/[^\d.]/g, ''));
  assert.ok(cash1 > cash0, `cash increased ${cash0} -> ${cash1}`);

  // earn enough cash on empire, then go to biz
  for (let i = 0; i < 40; i++) tap();

  // go to biz, give money, buy a business
  click(tabBtn('biz'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('main').innerHTML.includes('Шаурма-пойнт'), 'business list rendered');

  const buyBtn = $('[data-act="buy-biz"][data-id="shawarma"]');
  assert.ok(buyBtn, 'buy button present');
  click(buyBtn);
  await new Promise(r => setTimeout(r, 30));
  assert.ok($('main').querySelector('.lv'), 'business leveled up after buy');

  // garage shows cars and buy flow (not enough cash -> toast)
  click(tabBtn('garage'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('main').innerHTML.includes('Lada Vibe'), 'car card rendered');
  const carBuy = $('[data-act="buy-item"][data-id="c_hatch"]');
  click(carBuy);
  await new Promise(r => setTimeout(r, 20));
  // toast should appear (either bought or error)
  assert.ok($('#toasts').textContent.length > 0, 'toast feedback on buy attempt');

  // crypto tabs
  click(tabBtn('crypto'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('main').innerHTML.includes('Bitcoin'), 'exchange rendered');
  // open coin sheet
  click($('[data-act="coin"][data-id="BTC"]'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('#sheetBody').innerHTML.includes('Купить за $'), 'coin sheet buy options');

  // subtabs mining & bank render
  click($('[data-act="sub"][data-id="crypto"][data-v="mining"]'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('main').innerHTML.toLowerCase().includes('риг'), 'mining rendered');
  click($('[data-act="sub"][data-id="crypto"][data-v="bank"]'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('main').innerHTML.includes('Вклад'), 'bank rendered');

  // profile renders achievements & prestige
  click(tabBtn('profile'));
  await new Promise(r => setTimeout(r, 20));
  const prof = $('main').innerHTML;
  assert.ok(prof.includes('Достижения') && prof.includes('Престиж'), 'profile sections rendered');

  // wheel sheet opens
  click(tabBtn('empire'));
  await new Promise(r => setTimeout(r, 20));
  click($('[data-act="wheel-open"]'));
  await new Promise(r => setTimeout(r, 20));
  assert.ok($('#sheetBody').innerHTML.includes('Рулетка'), 'wheel sheet');

  console.log('SMOKE OK: tabs empire/biz/garage/crypto/profile, buy, sheet, wheel all executed');
  // cleanup so the process can exit
  _intervals.forEach(id => globalThis._origClearInterval(id));
  globalThis._dom.window.close();
});
