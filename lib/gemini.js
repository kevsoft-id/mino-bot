const config = require("../config");

let genAI = null;

function getClient() {
  if (!config.geminiKey) throw new Error("GEMINI_API_KEY belum diset! Set di .env atau config.js");
  if (!genAI) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    genAI = new GoogleGenerativeAI(config.geminiKey);
  }
  return genAI;
}

async function ask(prompt, systemInstruction = null, imageBase64 = null, mimeType = "image/jpeg") {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction: systemInstruction || config.aiPersona,
    generationConfig: { maxOutputTokens: 2048, temperature: 0.9 },
  });

  const parts = [];
  if (imageBase64) parts.push({ inlineData: { data: imageBase64, mimeType } });
  parts.push({ text: prompt });

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  return result.response.text().trim();
}

// Chat session per user (stateful conversation)
const sessions = new Map();
const SESSION_TTL = 30 * 60 * 1000; // 30 menit

function getOrCreateSession(userId) {
  const now = Date.now();
  const existing = sessions.get(userId);
  if (existing && (now - existing.lastUsed) < SESSION_TTL) {
    existing.lastUsed = now;
    return existing;
  }
  const client = getClient();
  const model = client.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction: config.aiPersona,
    generationConfig: { maxOutputTokens: 2048, temperature: 0.9 },
  });
  const chat = model.startChat({ history: [] });
  const session = { chat, lastUsed: now };
  sessions.set(userId, session);
  return session;
}

async function chat(userId, message) {
  const session = getOrCreateSession(userId);
  const result = await session.chat.sendMessage(message);
  return result.response.text().trim();
}

function clearSession(userId) { sessions.delete(userId); }

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of sessions) if (now - v.lastUsed > SESSION_TTL) sessions.delete(k);
}, 5 * 60 * 1000);

module.exports = { ask, chat, clearSession };
