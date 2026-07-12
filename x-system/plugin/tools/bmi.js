'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');

module.exports = {
  commands:    ['bmi', 'imt'],
  category:    'Tools',
  description: 'Hitung Body Mass Index (BMI / IMT) kamu ⚖️',
  usage:       '.bmi <berat_kg> <tinggi_cm>  contoh: .bmi 60 170',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const [beratStr, tinggiStr] = args;
    if (!beratStr || !tinggiStr) {
      return reply(`❓ Format: .bmi <berat kg> <tinggi cm>\nContoh: .bmi 60 170`);
    }
    const berat  = parseFloat(beratStr);
    const tinggi = parseFloat(tinggiStr) / 100; // cm → m
    if (isNaN(berat) || isNaN(tinggi) || tinggi <= 0 || berat <= 0) {
      return reply('❌ Masukkan angka yang valid ya.');
    }
    const bmi    = berat / (tinggi * tinggi);
    const bmiStr = bmi.toFixed(2);
    let kategori, saran, emoji;
    if      (bmi < 18.5) { kategori = 'Kurus (Underweight)'; emoji = '🔵'; saran = 'Tambah porsi makan & konsumsi protein.'; }
    else if (bmi < 25.0) { kategori = 'Normal (Ideal)';      emoji = '🟢'; saran = 'Pertahankan gaya hidup sehat!'; }
    else if (bmi < 30.0) { kategori = 'Gemuk (Overweight)';  emoji = '🟡'; saran = 'Kurangi lemak, perbanyak olahraga.'; }
    else                 { kategori = 'Obesitas';             emoji = '🔴'; saran = 'Konsultasi ke dokter gizi ya~'; }

    return reply([
      theme.header, '',
      ` ⬡  ⚖️  ${theme.bold('BMI CALCULATOR')}`, '',
      `  ${theme.bullet} ${theme.bold('Berat')}   : ${berat} kg`,
      `  ${theme.bullet} ${theme.bold('Tinggi')}  : ${parseFloat(tinggiStr)} cm`,
      '',
      theme.div,
      '',
      `  ${emoji} ${theme.bold('BMI')}      : ${bmiStr}`,
      `  📊 ${theme.bold('Kategori')}: ${kategori}`,
      `  💡 ${theme.bold('Saran')}   : ${saran}`,
      '',
      `  📐 Skala: <18.5 Kurus | 18.5-24.9 Normal | 25-29.9 Gemuk | ≥30 Obesitas`,
      '', theme.footer,
    ].join('\n'));
  },
};
