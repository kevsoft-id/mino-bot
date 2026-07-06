const { ask } = require("../../lib/gemini");
const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = `Kamu adalah generator plugin WhatsApp Bot berbasis @whiskeysockets/baileys.
Tugas: Buat plugin JavaScript yang lengkap berdasarkan deskripsi pengguna.

FORMAT PLUGIN (WAJIB ikuti persis):
module.exports = {
  command: ["nama_perintah"],  // array string, tanpa prefix
  category: "addfitur",        // selalu "addfitur"
  description: "Deskripsi singkat",
  ownerOnly: false,            // opsional
  groupOnly: false,            // opsional
  cooldown: 3000,              // opsional ms
  async run({ sock, m, args, body, prefix, startTime }) {
    // Kode plugin di sini
    // m.chat = JID chat
    // m.sender = JID pengirim
    // m.quoted = pesan yang direply
    // args = array argumen setelah command
    // Untuk kirim: await sock.sendMessage(m.chat, { text: "teks" }, { quoted: m });
    // Untuk kirim gambar: await sock.sendMessage(m.chat, { image: Buffer/URL, caption: "teks" }, { quoted: m });
    // Gunakan axios untuk HTTP requests
    // Jangan gunakan module yang tidak ada di package.json
  }
};

ATURAN:
1. Kembalikan HANYA kode JavaScript, tanpa penjelasan, tanpa markdown code block
2. Gunakan try-catch untuk semua operasi async
3. Selalu berikan pesan error yang jelas
4. command harus lowercase, tanpa spasi (gunakan underscore jika perlu)
5. Jangan import module yang tidak tersedia (hanya: axios, fs, path, moment, moment-timezone, sharp)
6. Harus bisa langsung dijalankan tanpa install package tambahan`;

module.exports = {
  command: ["addfitur", "addfeature", "tambahfitur"],
  category: "addfitur",
  description: "🧠 Tambah fitur baru secara otomatis dengan AI Gemini! (Owner only)",
  ownerOnly: true,
  cooldown: 10000,

  async run({ sock, m, args, reloadPlugins }) {
    if (!args[0]) {
      return sock.sendMessage(m.chat, {
        text: `╭──「 *✨ ADD FITUR* 」\n│\n│ Tambah fitur baru dengan AI!\n│\n│ *Cara pakai:*\n│ .addfitur <deskripsi fitur>\n│\n│ *Contoh:*\n│ .addfitur buat command .kalkulator yang bisa menghitung operasi matematika dasar\n│\n│ .addfitur buat command .motivasiinggris yang menampilkan kata motivasi dalam Bahasa Inggris\n│\n│ .addfitur buat command .palindrom yang mengecek apakah kata adalah palindrom\n│\n│ ⚠️ Butuh GEMINI_API_KEY\n╰───────────♢`
      }, { quoted: m });
    }

    const desc = args.join(" ");
    const wait = await sock.sendMessage(m.chat, {
      text: `🧠 _AI sedang membuat plugin..._\n\n📝 Deskripsi: ${desc}`
    }, { quoted: m });

    try {
      // Generate plugin code dengan Gemini
      const prompt = `Buat plugin WhatsApp bot berdasarkan deskripsi ini: "${desc}"\n\nIkuti format yang sudah ditentukan.`;
      let code = await ask(prompt, SYSTEM_PROMPT);

      // Bersihkan dari markdown code block jika ada
      code = code.replace(/^```javascript?\n?/i, "").replace(/\n?```$/i, "").trim();

      // Validasi kode dasar
      if (!code.includes("module.exports") || !code.includes("command")) {
        throw new Error("Kode yang dihasilkan tidak valid. Coba lagi dengan deskripsi lebih spesifik.");
      }

      // Ekstrak nama command dari kode
      const cmdMatch = code.match(/command\s*:\s*\[["']([^"']+)["']/);
      const cmdName = cmdMatch ? cmdMatch[1] : `fitur_${Date.now()}`;

      // Simpan ke plugins/addfitur/
      const dir = path.join(__dirname, "../../plugins/addfitur");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filename = path.join(dir, `${cmdName}.js`);
      fs.writeFileSync(filename, code, "utf-8");

      // Test apakah bisa di-require
      try {
        delete require.cache[require.resolve(filename)];
        require(filename);
      } catch (e) {
        fs.unlinkSync(filename);
        throw new Error(`Kode yang dihasilkan mengandung error: ${e.message}`);
      }

      // Reload semua plugin
      if (typeof reloadPlugins === "function") reloadPlugins();

      await sock.sendMessage(m.chat, {
        text: `╭──「 *✅ FITUR BERHASIL DITAMBAH!* 」\n│\n│● Nama File : ${cmdName}.js\n│● Command   : .${cmdName}\n│● Lokasi    : plugins/addfitur/\n│\n│ Coba sekarang: *.${cmdName}*\n│\n│ 🔄 Plugin sudah di-reload!\n╰───────────♢`
      }, { quoted: m });

      // Kirim kode yang dihasilkan sebagai info
      await sock.sendMessage(m.chat, {
        text: `📄 *Kode yang dihasilkan:*\n\n\`\`\`\n${code.substring(0, 2000)}\n\`\`\``
      }).catch(() => {});

    } catch (e) {
      await sock.sendMessage(m.chat, {
        text: `╭──「 *❌ GAGAL* 」\n│● Error: ${e.message}\n│\n│ Tips:\n│● Pastikan GEMINI_API_KEY sudah diset\n│● Coba deskripsi yang lebih spesifik\n│● Contoh: "buat command .halo yang membalas salam"\n╰───────────♢`
      }, { quoted: m });
    }
  },
};
