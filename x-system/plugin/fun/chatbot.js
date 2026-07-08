'use strict';
const axios    = require('axios');
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

// Fallback responses
const RESPONSES = {
  greeting: ['Haii~! Ada yang bisa Mino bantu? UwU', 'Konnichiwa nya~! Mino siap melayani!', 'Helo helo! Mino disini OwO~'],
  howAreYou: ['Mino baik-baik aja nya~! Kamu sendiri? 💕', 'Alhamdulillah, Mino sehat dan bahagia UwU!', 'Mino happy banget bisa chat sama kamu nya~!'],
  thanks:    ['Sama-sama nya~! UwU 💕', 'Makasih juga udah chat sama Mino~ OwO', 'Heehee, Mino seneng bisa bantu~!'],
  bye:       ['Bye bye nya~! Jangan lupa balik lagi ya UwU 💕', 'Sampai jumpa~ Mino tunggu ya OwO!', 'Dadah! Mino kangen kamu loh nya~'],
  idk:       [
    'Hmm, Mino kurang tau nih nya~ 🤔',
    'Wah itu pertanyaan sulit, Mino mau mikir dulu UwU',
    'Mino belum bisa jawab itu, maaf ya nya~ >_<',
    'Hehe, Mino masih belajar nih~ Tanya yang lain aja ya UwU',
  ],
};

function localReply(text) {
  const t = text.toLowerCase();
  if (/\b(hai|helo|halo|hi|hey|oi)\b/.test(t)) return randPick(RESPONSES.greeting);
  if (/\b(apa kabar|gimana kabar|how are you|sehat)\b/.test(t)) return randPick(RESPONSES.howAreYou);
  if (/\b(makasih|terimakasih|thanks|thank you)\b/.test(t)) return randPick(RESPONSES.thanks);
  if (/\b(bye|dadah|sampai jumpa|cabut|pamit)\b/.test(t)) return randPick(RESPONSES.bye);
  if (/\b(siapa (kamu|elo|lu|kau)|nama (kamu|elo|lu)|who are you)\b/.test(t)) {
    return `Mino disini nya~! 🐾 Bot kawaii buatan KevSoft-ID UwU\nKetik .info buat lihat info lengkap Mino!`;
  }
  if (/\b(sayang|cinta|love|suka)\b/.test(t)) return `Uwu~ Mino juga sayang sama kamu nya~! 💕❤️`;
  if (/\b(makan|lapar|hungry|dinner|lunch|breakfast)\b/.test(t)) {
    return randPick(['Makan apa hari ini nya~? UwU', 'Wah lagi lapar? Mino juga pengen makan nasi goreng nya~! 🍳']);
  }
  return null;
}

module.exports = {
  commands: ['ai', 'chat', 'chatbot', 'tanya'],
  category: 'Fun',
  description: 'Ngobrol sama Mino AI chatbot~',
  usage: '.ai <pesan>',

  async handler(sock, m, { text, pushName, reply, react }) {
    if (!text) return reply(`💬 Mau ngobrol apa sama Mino nya~?\nContoh: \`.ai halo mino!\``);

    await react('💭');

    // Coba local reply dulu
    const local = localReply(text);
    if (local) {
      await react('💬');
      return reply(`🤖 *Mino AI* nya~\n\n${local}\n\n${settings.footer}`);
    }

    // Coba API eksternal
    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/ai/llama3?prompt=${encodeURIComponent(text)}`,
        { timeout: 15000 }
      );
      const ans = data?.data || data?.result || data?.message;
      if (ans) {
        await react('✅');
        return reply(`🤖 *Mino AI* nya~\n\n${ans}\n\n${settings.footer}`);
      }
      throw new Error('No response');
    } catch {
      // Fallback ke response random
      const fb = randPick(RESPONSES.idk);
      await react('💬');
      return reply(`🤖 *Mino AI* nya~\n\n${fb}\n\n${settings.footer}`);
    }
  },
};
