import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../js/economy.js';
import { BUSINESSES, COINS } from '../js/data.js';

test('formatters', () => {
  assert.equal(E.fmt(999), '999');
  assert.equal(E.fmt(1234), '1.23K');
  assert.equal(E.fmt(1.5e9), '1.50B');
  assert.equal(E.fmt(3.2e15), '3.20Qa');
  assert.ok(E.money(1000).startsWith('$'));
});

test('fresh state has start cash and level 1', () => {
  const s = E.createState();
  assert.equal(s.cash, 250);
  assert.equal(s.level, 1);
  assert.equal(E.incomePerSec(s), 0);
  assert.ok(E.tapPower(s) >= 3);
});

test('buying a business raises income and level', () => {
  const s = E.createState();
  s.cash = 10000;
  const r = E.buyBiz(s, 'shawarma', 5);
  assert.ok(r.ok);
  assert.equal(r.bought, 5);
  assert.equal(s.biz.shawarma.level, 5);
  assert.ok(E.incomePerSec(s) > 0);
});

test('locked business cannot be bought at level 1', () => {
  const s = E.createState();
  s.cash = 1e12;
  const r = E.buyBiz(s, 'space', 1); // unlock 45
  assert.equal(r.ok, false);
});

test('tick accrues cash', () => {
  const s = E.createState();
  s.cash = 10000;
  E.buyBiz(s, 'shawarma', 10); // unlock 1
  const before = s.cash;
  E.tick(s, 5);
  assert.ok(s.cash > before);
});

test('milestone multipliers', () => {
  assert.equal(E.milestone(10), 1);
  assert.equal(E.milestone(25), 2);
  assert.equal(E.milestone(50), 6);
  assert.equal(E.milestone(100), 24);
});

test('tap increases taps and cash', () => {
  const s = E.createState();
  const t0 = s.stats.taps;
  const v = E.tap(s);
  assert.ok(v > 0);
  assert.equal(s.stats.taps, t0 + 1);
  assert.ok(s.cash > 250);
});

test('crypto buy/sell round trip keeps trade count', () => {
  const s = E.createState();
  s.cash = 10000;
  const b = E.buyCrypto(s, 'BTC', 5000);
  assert.ok(b.ok);
  assert.ok(s.crypto.hold.BTC > 0);
  const sell = E.sellCrypto(s, 'BTC', s.crypto.hold.BTC);
  assert.ok(sell.ok);
  assert.equal(s.stats.trades, 2);
});

test('prestige gate', () => {
  const s = E.createState();
  assert.equal(E.prestigeGain(s), 0);
  s.cash = 5e9;
  assert.ok(E.prestigeGain(s) > 0);
});

test('offline report grants cash after long absence', () => {
  const s = E.createState();
  s.cash = 10000;
  E.buyBiz(s, 'shawarma', 10);
  s.lastSeen = Date.now() - 2 * 3600 * 1000; // 2h ago
  const r = E.offlineReport(s);
  assert.ok(r && r.earned > 0);
});

test('rigs produce BTC in tick', () => {
  const s = E.createState();
  s.cash = 1e7;
  E.buyRig(s);
  const before = s.crypto.hold.BTC;
  E.tick(s, 10);
  assert.ok(s.crypto.hold.BTC > before);
});

test('bank deposit earns interest', () => {
  const s = E.createState();
  s.cash = 10000;
  E.deposit(s, 5000);
  const d0 = s.bank.deposit;
  E.tick(s, 60);
  assert.ok(s.bank.deposit > d0);
});

test('quests roll three items and can be claimed', () => {
  const s = E.createState();
  E.rollQuests(s);
  assert.equal(s.quests.list.length, 3);
});
