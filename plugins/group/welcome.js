const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["welcome","setwelcome","goodbye","setgoodbye"], category: "group",
  description: "Atur pesan welcome/goodbye", adminOnly:true, groupOnly:true,
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isWelcome = !body.toLowerCase().startsWith(p + "goodbye") && !body.toLowerCase().startsWith(p + "setgoodbye");
    const isSet = body.toLowerCase().startsWith(p + "set");
    const grp = getGroup(m.chat);
    if (isSet) {
      if (!args[0]) return sock.sendMessage(m.chat, { text: `❌ .${isWelcome?"setwelcome":"setgoodbye"} <pesan>\nVariabel: @user @group` }, { quoted: m });
      const msg = args.join(" ");
      if (isWelcome) grp.welcomeMsg = msg; else grp.goodbyeMsg = msg;
      saveGroup(m.chat, grp);
      return sock.sendMessage(m.chat, { text: `✅ Pesan ${isWelcome?"welcome":"goodbye"} disimpan!` }, { quoted: m });
    }
    const mode = (args[0]||"").toLowerCase();
    if (!["on","off"].includes(mode)) return sock.sendMessage(m.chat, { text: `❌ .${isWelcome?"welcome":"goodbye"} on/off` }, { quoted: m });
    if (isWelcome) grp.welcome = mode === "on"; else grp.goodbye = mode === "on";
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `✅ ${isWelcome?"Welcome":"Goodbye"} message *${mode.toUpperCase()}*` }, { quoted: m });
  },
};
