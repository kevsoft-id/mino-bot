'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');

module.exports = [
  // ── .domain {nama} — Domain availability check ──────────
  {
    commands:    ['domain', 'cekdomain', 'domaincheck'],
    category:    'Tools',
    description: 'Cek ketersediaan domain untuk didaftarkan',
    usage:       '.domain {nama}  |  .domain kevsoft',

    async handler(sock, m, { text, reply, react }) {
      const { theme } = settings;

      if (!text) return reply('❓ Masukkan nama domain\nContoh: .domain kevsoft\nContoh: .domain myweb.com');
      await react('🔍');

      const name = text.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const tlds = name.includes('.') ? [name] : [
        `${name}.com`, `${name}.net`, `${name}.org`,
        `${name}.id`,  `${name}.co.id`, `${name}.io`, `${name}.dev`,
      ];

      const results = [];
      for (const domain of tlds.slice(0, 6)) {
        try {
          await axios.get(`https://dns.google/resolve?name=${domain}&type=A`, { timeout: 5000 });
          results.push({ domain, status: '🔴 Sudah dipakai' });
        } catch {
          results.push({ domain, status: '🟢 Tersedia' });
        }
      }

      // Actually check via DNS resolve — if there's an A record, it's taken
      const checked = await Promise.allSettled(
        tlds.slice(0, 6).map(async (domain) => {
          const { data } = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`, { timeout: 5000 });
          const hasRecord = data.Answer && data.Answer.length > 0;
          return { domain, taken: hasRecord };
        })
      );

      const list = checked.map(r => {
        if (r.status === 'fulfilled') {
          return `    ${r.value.taken ? '🔴' : '🟢'} \`${r.value.domain}\` — ${r.value.taken ? 'Sudah dipakai' : 'Kemungkinan tersedia'}`;
        }
        return `    ⚪ \`${r.reason?.config?.url?.split('name=')[1]?.split('&')[0] || '-'}\` — Tidak bisa dicek`;
      }).join('\n');

      await react('✅');
      await reply([
        theme.header, '',
        ` ⬡  🌐  ${theme.bold('CEK DOMAIN')}`, '',
        list,
        '',
        `    💡 🟢 = kemungkinan tersedia (tapi cek di registrar)`,
        `    💡 🔴 = sudah ada DNS record`,
        `    🔗 Daftar: Niagahoster, Dewaweb, Namecheap`,
        '',
        theme.footer,
      ].join('\n'));
    },
  },

  // ── .dns {domain} — DNS lookup ──────────────────────────
  {
    commands:    ['dns', 'dnslookup', 'nslookup', 'cekdns'],
    category:    'Tools',
    description: 'DNS lookup — cek record DNS sebuah domain',
    usage:       '.dns {domain}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan domain\nContoh: .dns google.com');
      await react('🔍');

      const domain = text.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];

      try {
        const [aRes, mxRes, nsRes, txtRes] = await Promise.allSettled([
          axios.get(`https://dns.google/resolve?name=${domain}&type=A`,   { timeout: 8000 }),
          axios.get(`https://dns.google/resolve?name=${domain}&type=MX`,  { timeout: 8000 }),
          axios.get(`https://dns.google/resolve?name=${domain}&type=NS`,  { timeout: 8000 }),
          axios.get(`https://dns.google/resolve?name=${domain}&type=TXT`, { timeout: 8000 }),
        ]);

        const getAnswers = (res, field = 'data') =>
          res.status === 'fulfilled'
            ? (res.value.data.Answer || []).map(r => r.data).slice(0, 3).join(', ') || '-'
            : '-';

        await react('✅');
        await reply([
          `🔍 *DNS LOOKUP: ${domain}*`,
          ``,
          `📌 *A Record*  : ${getAnswers(aRes)}`,
          `📧 *MX Record* : ${getAnswers(mxRes)}`,
          `🌐 *NS Record* : ${getAnswers(nsRes)}`,
          `📝 *TXT Record*: ${getAnswers(txtRes).slice(0, 100)}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ DNS lookup gagal: ${err.message}`);
      }
    },
  },

  // ── .whois {domain} — WHOIS info ────────────────────────
  {
    commands:    ['whois', 'whoisdomain', 'infosite'],
    category:    'Tools',
    description: 'Info WHOIS dan detail sebuah website/domain',
    usage:       '.whois {domain}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan domain\nContoh: .whois google.com');
      await react('🔍');

      const domain = text.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];

      try {
        // Use rdap.org for WHOIS-like info
        const { data } = await axios.get(`https://rdap.org/domain/${domain}`, {
          timeout: 10000,
          headers: { Accept: 'application/json' },
        });

        const registered = data.events?.find(e => e.eventAction === 'registration')?.eventDate;
        const expires    = data.events?.find(e => e.eventAction === 'expiration')?.eventDate;
        const updated    = data.events?.find(e => e.eventAction === 'last changed')?.eventDate;
        const nameservers = data.nameservers?.map(ns => ns.ldhName).slice(0, 3).join(', ') || '-';
        const status     = data.status?.slice(0, 2).join(', ') || '-';

        const fmt = (d) => d ? new Date(d).toLocaleDateString('id-ID') : '-';

        await react('✅');
        await reply([
          `🔍 *WHOIS: ${domain}*`,
          ``,
          `📛 *Domain*     : ${data.ldhName || domain}`,
          `📅 *Terdaftar*  : ${fmt(registered)}`,
          `⏰ *Kadaluarsa* : ${fmt(expires)}`,
          `🔄 *Diperbarui* : ${fmt(updated)}`,
          `🌐 *Nameserver* : ${nameservers}`,
          `🔒 *Status*     : ${status}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ WHOIS gagal untuk "${domain}"\nMungkin domain tidak terdaftar atau format salah`);
      }
    },
  },
];
