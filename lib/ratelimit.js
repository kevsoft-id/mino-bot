'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../settings');

const store = new Map(); // jid -> { count, firstMs, cooldownUntil }

function checkRateLimit(jid) {
  if (!settings.rateLimit.enabled) return false;
  const now  = Date.now();
  const data = store.get(jid) || { count: 0, firstMs: now, cooldownUntil: 0 };

  if (now < data.cooldownUntil) return true; // masih kena cooldown

  if (now - data.firstMs > settings.rateLimit.windowMs) {
    // Reset window
    data.count   = 1;
    data.firstMs = now;
    data.cooldownUntil = 0;
  } else {
    data.count++;
    if (data.count > settings.rateLimit.maxMsg) {
      data.cooldownUntil = now + settings.rateLimit.cooldownMs;
      store.set(jid, data);
      return true;
    }
  }

  store.set(jid, data);
  return false;
}

module.exports = { checkRateLimit };
