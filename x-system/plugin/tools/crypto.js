'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');

const COIN_IDS = {
  btc:  'bitcoin', bitcoin: 'bitcoin',
  eth:  'ethereum', ethereum: 'ethereum',
  bnb:  'binancecoin', binance: 'binancecoin',
  sol:  'solana', solana: 'solana',
  ada:  'cardano', cardano: 'cardano',
  dot:  'polkadot', polkadot: 'polkadot',
  doge: 'dogecoin', dogecoin: 'dogecoin',
  shib: 'shiba-inu',
  xrp:  'ripple', ripple: 'ripple',
  matic:'matic-network', polygon: 'matic-network',
  avax: 'avalanche-2',
  link: 'chainlink',
  ltc:  'litecoin',
  uni:  'uniswap',
  atom: 'cosmos',
};

function fmt(n) { return n?.toLocaleString('id-ID', { maximumFractionDigits: 4 }) ?? '-'; }
function fmtUSD(n) { return '$' + (n?.toFixed(n > 1 ? 2 : 6) ?? '-'); }

module.exports = {
  commands:    ['crypto', 'koin', 'hargacrypto', 'btc', 'eth', 'coin'],
  category:    'Tools',
  description: 'Cek harga cryptocurrency real-time (CoinGecko)',
  usage:       '.crypto {nama}  |  .btc  |  .eth',

  async handler(sock, m, { command, text, reply, react }) {
    const { theme } = settings;

    // Map command aliases
    let query = text?.trim().toLowerCase() || command;
    if (command === 'btc' && !text) query = 'bitcoin';
    if (command === 'eth' && !text) query = 'ethereum';

    if (!query || query === 'list') {
      return reply([
        theme.header, '',
        ` ⬡  💰  ${theme.bold('CRYPTO PRICE CHECKER')}`, '',
        `    ${theme.bullet} .crypto {nama}   → cek harga`,
        `    ${theme.bullet} .btc             → Bitcoin`,
        `    ${theme.bullet} .eth             → Ethereum`,
        `    ${theme.bullet} .crypto top      → top 10 crypto`,
        '',
        `    📊 Coin tersedia: ${Object.keys(COIN_IDS).filter((_, i) => i % 2 === 0).join(', ')}`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('💰');

    // Top 10 mode
    if (query === 'top' || query === 'top10') {
      try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: { vs_currency: 'idr', order: 'market_cap_desc', per_page: 10, page: 1 },
          timeout: 12000,
        });

        const list = data.map((c, i) => {
          const chg = c.price_change_percentage_24h?.toFixed(2) ?? '0';
          const arrow = parseFloat(chg) >= 0 ? '📈' : '📉';
          return `${i + 1}. *${c.symbol.toUpperCase()}* — Rp${fmt(c.current_price)} ${arrow}${chg}%`;
        }).join('\n');

        await react('✅');
        return reply([
          `💰 *TOP 10 CRYPTOCURRENCY*`,
          `📅 ${new Date().toLocaleString('id-ID', { timeZone: settings.timezone })}`,
          ``,
          list,
          ``,
          `_Data dari CoinGecko_`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        return reply(`❌ Gagal ambil data: ${err.message}`);
      }
    }

    // Single coin
    const coinId = COIN_IDS[query] || query;

    try {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        params: { localization: false, tickers: false, community_data: false, developer_data: false },
        timeout: 12000,
      });

      const p      = data.market_data;
      const idr    = p.current_price.idr;
      const usd    = p.current_price.usd;
      const chg24  = p.price_change_percentage_24h?.toFixed(2) ?? '-';
      const chg7d  = p.price_change_percentage_7d?.toFixed(2) ?? '-';
      const high24 = p.high_24h?.idr;
      const low24  = p.low_24h?.idr;
      const cap    = p.market_cap?.idr;
      const arrow  = parseFloat(chg24) >= 0 ? '📈' : '📉';

      await react('✅');
      await reply([
        `💰 *${data.name} (${data.symbol.toUpperCase()})*`,
        ``,
        `💵 *Harga USD*  : ${fmtUSD(usd)}`,
        `🇮🇩 *Harga IDR*  : Rp${fmt(idr)}`,
        ``,
        `${arrow} *24h*         : ${chg24}%`,
        `${parseFloat(chg7d) >= 0 ? '📈' : '📉'} *7 Hari*      : ${chg7d}%`,
        ``,
        `📊 *High 24h*   : Rp${fmt(high24)}`,
        `📊 *Low 24h*    : Rp${fmt(low24)}`,
        `💎 *Market Cap* : Rp${fmt(cap)}`,
        `🏆 *Rank*       : #${data.market_cap_rank || '-'}`,
        ``,
        `📅 ${new Date().toLocaleString('id-ID', { timeZone: settings.timezone })}`,
        `_Data dari CoinGecko_`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      if (err.response?.status === 404) {
        await reply(`❌ Koin "${query}" tidak ditemukan\nCoba: bitcoin, ethereum, dogecoin, dll`);
      } else {
        await reply(`❌ ${err.message}`);
      }
    }
  },
};
