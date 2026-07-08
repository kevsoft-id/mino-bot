'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyList } = require('../../../lib/utils');

const CURRENCIES = {
  USD: '🇺🇸 US Dollar',
  IDR: '🇮🇩 Rupiah Indonesia',
  EUR: '🇪🇺 Euro',
  SGD: '🇸🇬 Dollar Singapura',
  MYR: '🇲🇾 Ringgit Malaysia',
  JPY: '🇯🇵 Yen Jepang',
  CNY: '🇨🇳 Yuan China',
  GBP: '🇬🇧 Pound Sterlin',
  AUD: '🇦🇺 Dollar Australia',
  KRW: '🇰🇷 Won Korea',
  SAR: '🇸🇦 Riyal Saudi',
};

module.exports = {
  commands:    ['kurs', 'rate', 'valas'],
  category:    'Tools',
  description: 'Cek kurs mata uang dunia secara real-time 💱',
  usage:       '.kurs  |  .kurs USD IDR 100  |  .kurs IDR',

  async handler(sock, m, { args, reply }) {
    const { theme, prefix } = settings;

    // .kurs <FROM> <TO> <AMOUNT>  — konversi spesifik
    if (args.length >= 2) {
      const from   = args[0].toUpperCase();
      const to     = args[1].toUpperCase();
      const amount = parseFloat(args[2]) || 1;
      try {
        const res  = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, { timeout: 8000 });
        const rate = res.data.rates[to];
        if (!rate) return reply(`❌ Kode mata uang tidak ditemukan.\nContoh: .kurs USD IDR 100`);
        const result = (amount * rate).toLocaleString('id-ID', { maximumFractionDigits: 4 });
        return reply([
          theme.header, '',
          ` ⬡  💱  ${theme.bold('KONVERSI KURS')}`, '',
          `  💵 ${amount.toLocaleString()} ${from}`,
          `  ═  ${result} ${to}`,
          '',
          `  📅 Data: ${res.data.date}`,
          '', theme.footer,
        ].join('\n'));
      } catch {
        return reply('❌ Gagal mengambil data kurs. Coba lagi nanti.');
      }
    }

    // .kurs <FROM>  — lihat rates dari currency tertentu
    const from = args[0]?.toUpperCase() || 'USD';
    const targets = Object.keys(CURRENCIES).filter(c => c !== from).slice(0, 9).join(',');
    try {
      const res   = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${targets}`, { timeout: 8000 });
      const rates = res.data.rates;
      const lines = [
        theme.header, '',
        ` ⬡  💱  ${theme.bold('KURS ' + from + ' — ' + (CURRENCIES[from] || from))}`,
        ` 📅 Update: ${res.data.date}`, '',
      ];
      for (const [code, rate] of Object.entries(rates)) {
        const label = CURRENCIES[code] || code;
        lines.push(`  ${theme.bullet} 1 ${from} = ${rate.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${code}`);
      }
      lines.push('');
      lines.push(` 💡 Konversi: .kurs ${from} IDR 100`);
      lines.push('', theme.footer);

      // Show list for quick conversion from USD
      if (from === 'USD') {
        const sections = [{
          title: '💱 PILIH KURS',
          rows: Object.keys(rates).slice(0, 8).map(code => ({
            id:          `${prefix}kurs USD ${code} 1`,
            title:       `${code}  —  ${CURRENCIES[code] || code}`,
            description: `1 USD = ${rates[code]} ${code}`,
          })),
        }];
        return replyList(sock, m, theme.bold('KURS MATA UANG'), lines.join('\n'),
          '💱 Pilih untuk Konversi', sections, settings.footer, settings.images.thumb);
      }
      return reply(lines.join('\n'));
    } catch {
      return reply('❌ Gagal mengambil data kurs. Coba lagi nanti.');
    }
  },
};
