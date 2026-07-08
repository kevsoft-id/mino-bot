'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../settings');

class MessageQueue {
  constructor() {
    this.queue   = [];
    this.running = false;
  }

  add(fn) {
    if (!settings.queue.enabled) return Promise.resolve().then(fn);
    if (this.queue.length >= settings.queue.maxQueueSize) {
      return Promise.resolve(); // Drop silently when queue is full
    }
    return new Promise((resolve, reject) => {
      this.queue.push(() => Promise.resolve().then(fn).then(resolve).catch(reject));
      if (!this.running) this._run();
    });
  }

  async _run() {
    this.running = true;
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      try { await fn(); } catch {}
      await new Promise(r => setTimeout(r, settings.queue.delayMs));
    }
    this.running = false;
  }
}

module.exports = new MessageQueue();
