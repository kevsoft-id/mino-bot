'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
// Handles: poke, bite, wave, cuddle, dance, cry, blush, wink, smile, bored
const settings = require('../../../settings');
const axios    = require('axios');
const { replyGif, reply: replyFn } = require('../../../lib/utils');

const ACTIONS = {
  poke:   { endpoint: 'poke',   msg: '{me} mencolok {target} ☝️' },
  bite:   { endpoint: 'bite',   msg: '{me} menggigit {target} 😬' },
  wave:   { endpoint: 'wave',   msg: '{me} melambaikan tangan ke {target} 👋' },
  cuddle: { endpoint: 'cuddle', msg: '{me} memeluk erat {target} 🥰' },
  dance:  { endpoint: 'dance',  msg: '{me} mengajak {target} dance 💃' },
  cry:    { endpoint: 'cry',    msg: '{me} menangis karena {target} 😭' },
  blush:  { endpoint: 'blush',  msg: '{me} tersipu malu lihat {target} 😳' },
  wink:   { endpoint: 'wink',   msg: '{me} mengedip ke {target} 😉' },
  smile:  { endpoint: 'smile',  msg: '{me} tersenyum ke {target} 😊' },
  bored:  { endpoint: 'bored',  msg: '{me} bosan sama {target} 😒' },
  nod:    { endpoint: 'nod',    msg: '{me} mengangguk ke {target} 🙂' },
  nom:    { endpoint: 'nom',    msg: '{me} mau memakan {target}! 🍖' },
  kick:   { endpoint: 'kick',   msg: '{me} menendang {target}! 🦵' },
};

const cmds = Object.keys(ACTIONS);

module.exports = {
  commands:    cmds,
  category:    'Fun',
  description: 'Aksi anime: poke/bite/wave/cuddle/dance/cry/blush/wink… 🎭',
  usage:       '.poke @user  |  .cuddle @user  |  .dance',

  async handler(sock, m, { command, mentions, pushName, reply }) {
    const action = ACTIONS[command];
    if (!action) return;
    const target = mentions[0] ? `@${mentions[0].split('@')[0]}` : 'semua orang';
    const caption = action.msg
      .replace('{me}', `*${pushName}*`)
      .replace('{target}', target)
      + `\n\n${settings.footer}`;
    try {
      const res    = await axios.get(`https://nekos.best/api/v2/${action.endpoint}`, { timeout: 8000 });
      const gifUrl = res.data.results[0].url;
      await replyGif(sock, m, gifUrl, caption);
    } catch {
      await reply(caption);
    }
  },
};
