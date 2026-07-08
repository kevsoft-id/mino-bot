'use strict';
const axios    = require('axios');
const settings = require('../../../settings');

module.exports = {
  commands: ['ip', 'iplookup', 'cekip'],
  category: 'Tools',
  description: 'Lookup informasi IP address~',
  usage: '.ip <alamat_ip>',

  async handler(sock, m, { args, reply, react }) {
    const ip = args[0] || 'check';
    await react('🔍');

    try {
      const endpoint = ip === 'check'
        ? 'https://ipapi.co/json/'
        : `https://ipapi.co/${ip}/json/`;

      const { data } = await axios.get(endpoint, { timeout: 10000 });
      if (data.error) throw new Error(data.reason || 'IP tidak valid');

      await react('✅');
      await reply([
        `🌐 *IP LOOKUP* nya~`,
        ``,
        `🖥️ *IP       :* ${data.ip}`,
        `🏙️ *Kota     :* ${data.city || '-'}`,
        `🗺️ *Region   :* ${data.region || '-'}`,
        `🌍 *Negara   :* ${data.country_name || '-'} (${data.country_code || '-'})`,
        `📮 *Kode Pos :* ${data.postal || '-'}`,
        `📡 *ISP      :* ${data.org || '-'}`,
        `🕐 *Timezone :* ${data.timezone || '-'}`,
        `📍 *Koordinat:* ${data.latitude}, ${data.longitude}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal lookup IP nya~\n${err.message}`);
    }
  },
};
