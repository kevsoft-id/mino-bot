module.exports = {
  command: ["password","passgen","buatpassword"], category: "tools",
  description: "Generate password acak yang kuat",
  async run({ sock, m, args }) {
    const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
    const type = (args[1] || "all").toLowerCase();
    const chars = {
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      num: "0123456789",
      sym: "!@#$%^&*()_+-=[]{}|;:,.<>?"
    };
    let pool = chars.lower;
    if (type !== "lower") { pool += chars.upper; pool += chars.num; }
    if (type === "all" || type === "complex") pool += chars.sym;
    let pass = "";
    for (let i = 0; i < length; i++) pass += pool[Math.floor(Math.random() * pool.length)];
    // Strength
    const strength = length >= 16 && pool.includes("!") ? "🔴 Sangat Kuat" : length >= 12 ? "🟠 Kuat" : "🟡 Sedang";
    await sock.sendMessage(m.chat, { text: `╭──「 *🔐 PASSWORD GENERATOR* 」\n│● Password : \`${pass}\`\n│● Panjang  : ${length} karakter\n│● Kekuatan : ${strength}\n│\n│ ⚠️ Simpan dengan aman!\n╰───────────♢` }, { quoted: m });
  },
};
