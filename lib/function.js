const fs = require("fs");
const path = require("path");
const pino = require("pino");

function getRuntime(startTime) {
  const diff = Date.now() - startTime;
  const s = Math.floor(diff/1000)%60, m = Math.floor(diff/60000)%60,
        h = Math.floor(diff/3600000)%24, d = Math.floor(diff/86400000);
  return [d&&`${d}h`,h&&`${h}j`,m&&`${m}m`,`${s}d`].filter(Boolean).join(" ");
}

function getTag(jid) { return (jid||"").replace(/@.+/,"").split(":")[0]; }
function isOwner(jid, ownerList) { return ownerList.includes(getTag(jid)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function pickRandom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr, n) {
  const s = [...arr]; const r = [];
  for (let i = 0; i < n && s.length; i++) { const x = Math.floor(Math.random()*s.length); r.push(s.splice(x,1)[0]); }
  return r;
}
function formatCoins(n) { return Number(n).toLocaleString("id-ID"); }
function cleanNumber(str) { return (str||"").replace(/[^0-9]/g,""); }
function msToTime(ms) {
  const s = Math.floor(ms/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24);
  if (d) return `${d} hari ${h%24} jam`;
  if (h) return `${h} jam ${m%60} menit`;
  if (m) return `${m} menit ${s%60} detik`;
  return `${s} detik`;
}

const silentLogger = pino({ level: "silent" });

async function downloadMedia(sock, msgObj) {
  const { downloadMediaMessage } = require("@whiskeysockets/baileys");
  try {
    return await downloadMediaMessage(msgObj, "buffer", {}, {
      logger: silentLogger,
      reuploadRequest: sock.updateMediaMessage?.bind(sock),
    });
  } catch (e) { throw new Error("Gagal download media: " + e.message); }
}

async function getImageBuffer(src) {
  if (!src) return null;
  if (Buffer.isBuffer(src)) return src;
  if (typeof src !== "string") return null;
  if (src.startsWith("http")) {
    try {
      const axios = require("axios");
      const r = await axios.get(src, { responseType: "arraybuffer", timeout: 20000 });
      return Buffer.from(r.data);
    } catch { return null; }
  }
  if (fs.existsSync(src)) return fs.readFileSync(src);
  return null;
}

function getMessageType(msg) {
  if (!msg) return null;
  const ignore = ["senderKeyDistributionMessage","messageContextInfo","deviceSentMessage"];
  return Object.keys(msg).find(k => !ignore.includes(k)) || null;
}

function parseMessage(m) {
  try {
    let msg = m.message;
    if (!msg) return null;
    if (msg.deviceSentMessage?.message) msg = msg.deviceSentMessage.message;
    const type = getMessageType(msg);
    if (!type) return null;
    let body = "";
    if (type === "conversation") body = msg.conversation||"";
    else if (type === "extendedTextMessage") body = msg.extendedTextMessage?.text||"";
    else if (type === "imageMessage") body = msg.imageMessage?.caption||"";
    else if (type === "videoMessage") body = msg.videoMessage?.caption||"";
    else if (type === "buttonsResponseMessage") body = msg.buttonsResponseMessage?.selectedButtonId||"";
    else if (type === "listResponseMessage") body = msg.listResponseMessage?.singleSelectReply?.selectedRowId||"";
    else if (type === "interactiveResponseMessage") {
      try { body = JSON.parse(msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson||"{}").id||""; } catch {}
    }
    const chat = m.key.remoteJid;
    const isGroup = chat.endsWith("@g.us");
    const sender = isGroup ? (m.key.participant||m.participant||"") : (m.key.fromMe ? chat : chat);
    let quoted = null;
    const ctx = msg[type]?.contextInfo;
    if (ctx?.quotedMessage) {
      const qt = getMessageType(ctx.quotedMessage);
      quoted = { key:{ remoteJid:chat, id:ctx.stanzaId, participant:ctx.participant, fromMe:false },
        message: ctx.quotedMessage, sender: ctx.participant, type: qt };
    }
    return { ...m, body:body.trim(), sender, chat, isGroup, type, quoted, key:m.key, message:msg };
  } catch { return null; }
}

module.exports = {
  getRuntime, getTag, isOwner, sleep, pickRandom, pickN,
  formatCoins, cleanNumber, msToTime, downloadMedia, getImageBuffer,
  getMessageType, parseMessage,
};
