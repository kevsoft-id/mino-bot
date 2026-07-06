const path = require("path");
const fs = require("fs");

let Canvas = null;
try { Canvas = require("@napi-rs/canvas"); } catch { Canvas = null; }

const DEFAULT_BG = path.join(__dirname, "..", "assets", "backgrounds", "default.jpg");

// ── Tema Minimalis Blue White ──
const THEME = {
  primary: "#1e6fd9",
  primaryDark: "#0d3b73",
  accent: "#4fa8ff",
  panel: "rgba(255,255,255,0.90)",
  text: "#0b2545",
  textLight: "#5b7ba3",
  white: "#ffffff",
};

function ensureCanvas() {
  if (!Canvas) {
    throw new Error("Engine canvas belum terpasang. Jalankan: npm install @napi-rs/canvas");
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitCover(img, dw, dh) {
  const ir = img.width / img.height, dr = dw / dh;
  let sw, sh, sx, sy;
  if (ir > dr) { sh = img.height; sw = sh * dr; sy = 0; sx = (img.width - sw) / 2; }
  else { sw = img.width; sh = sw / dr; sx = 0; sy = (img.height - sh) / 2; }
  return { sx, sy, sw, sh };
}

async function loadBg(bgBuffer) {
  if (bgBuffer) {
    try { return await Canvas.loadImage(bgBuffer); } catch {}
  }
  try {
    if (fs.existsSync(DEFAULT_BG)) return await Canvas.loadImage(DEFAULT_BG);
  } catch {}
  return null;
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || "").split(" ");
  const lines = []; let line = "";
  for (const w of words) {
    const test = (line ? line + " " : "") + w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// ── Kartu Profil Canvas (tema minimalis blue white) ──
async function renderProfileCard(opts) {
  ensureCanvas();
  const {
    name = "User", tag = "0000", avatarBuffer = null, bgBuffer = null,
    level = 1, xp = 0, xpNeeded = 100, coins = 0, rank = "-", bio = "",
    isPremium = false,
  } = opts;

  const W = 1000, H = 560;
  const canvas = Canvas.createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const bg = await loadBg(bgBuffer);
  if (bg) {
    const f = fitCover(bg, W, H);
    ctx.drawImage(bg, f.sx, f.sy, f.sw, f.sh, 0, 0, W, H);
  } else {
    ctx.fillStyle = THEME.primaryDark; ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = "rgba(9,22,48,0.38)";
  ctx.fillRect(0, 0, W, H);

  const topGrad = ctx.createLinearGradient(0, 0, W, 0);
  topGrad.addColorStop(0, THEME.primary); topGrad.addColorStop(1, THEME.accent);
  ctx.fillStyle = topGrad; ctx.fillRect(0, 0, W, 10);

  const panelX = 30, panelY = 350, panelW = W - 60, panelH = H - panelY - 30;
  ctx.fillStyle = THEME.panel;
  roundRect(ctx, panelX, panelY, panelW, panelH, 24); ctx.fill();
  ctx.strokeStyle = THEME.primary; ctx.lineWidth = 2;
  roundRect(ctx, panelX, panelY, panelW, panelH, 24); ctx.stroke();

  const avR = 90, avX = 130, avY = panelY - 10;
  ctx.save();
  ctx.beginPath(); ctx.arc(avX, avY, avR + 6, 0, Math.PI * 2); ctx.fillStyle = THEME.white; ctx.fill();
  ctx.beginPath(); ctx.arc(avX, avY, avR + 3, 0, Math.PI * 2); ctx.strokeStyle = THEME.primary; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.arc(avX, avY, avR, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
  try {
    const av = avatarBuffer ? await Canvas.loadImage(avatarBuffer) : null;
    if (av) {
      const f = fitCover(av, avR * 2, avR * 2);
      ctx.drawImage(av, f.sx, f.sy, f.sw, f.sh, avX - avR, avY - avR, avR * 2, avR * 2);
    } else {
      ctx.fillStyle = THEME.primary; ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);
      ctx.fillStyle = THEME.white; ctx.font = "bold 70px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText((name || "?")[0].toUpperCase(), avX, avY + 5);
    }
  } catch {}
  ctx.restore();
  ctx.textBaseline = "alphabetic";

  ctx.textAlign = "left"; ctx.fillStyle = THEME.text;
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(String(name || "User").slice(0, 20), 260, panelY + 55);

  ctx.font = "24px sans-serif"; ctx.fillStyle = THEME.textLight;
  ctx.fillText(`@${tag}`, 260, panelY + 90);
  if (isPremium) {
    const pw = ctx.measureText(`@${tag}`).width;
    ctx.fillStyle = "#f5a623";
    roundRect(ctx, 260 + pw + 16, panelY + 68, 118, 30, 15); ctx.fill();
    ctx.fillStyle = THEME.white; ctx.font = "bold 15px sans-serif"; ctx.textAlign = "left";
    ctx.fillText("★ PREMIUM", 260 + pw + 26, panelY + 89);
  }

  ctx.fillStyle = THEME.primary;
  roundRect(ctx, 260, panelY + 110, 130, 44, 22); ctx.fill();
  ctx.fillStyle = THEME.white; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(`LV ${level}`, 325, panelY + 139);

  ctx.fillStyle = THEME.accent;
  roundRect(ctx, 405, panelY + 110, 150, 44, 22); ctx.fill();
  ctx.fillStyle = THEME.white; ctx.font = "bold 20px sans-serif";
  ctx.fillText(`RANK #${rank}`, 480, panelY + 139);

  ctx.textAlign = "left"; ctx.fillStyle = THEME.text; ctx.font = "bold 24px sans-serif";
  ctx.fillText(`Rp ${Number(coins || 0).toLocaleString("id-ID")}`, 575, panelY + 139);

  const barX = 260, barY = panelY + 175, barW = panelW - 300, barH = 20;
  ctx.fillStyle = "#dbe6f5"; roundRect(ctx, barX, barY, barW, barH, 10); ctx.fill();
  const pct = Math.max(0.03, Math.min(1, xp / Math.max(1, xpNeeded)));
  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, THEME.primary); barGrad.addColorStop(1, THEME.accent);
  ctx.fillStyle = barGrad; roundRect(ctx, barX, barY, barW * pct, barH, 10); ctx.fill();
  ctx.fillStyle = THEME.textLight; ctx.font = "16px sans-serif";
  ctx.fillText(`XP ${xp}/${xpNeeded}`, barX, barY + 40);

  if (bio) {
    ctx.fillStyle = THEME.textLight; ctx.font = "italic 18px sans-serif";
    ctx.fillText(`"${String(bio).slice(0, 60)}"`, 260, panelY + panelH - 15);
  }

  ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 20px sans-serif";
  ctx.fillText("✦ Mino Bot Ultra ✦ kevsoft-id", W - 30, 45);

  return canvas.toBuffer("image/png");
}

// ── Kartu Quote Canvas (tema minimalis blue white) ──
async function renderQuoteCard(opts) {
  ensureCanvas();
  const { text = "...", author = "Anonymous", bgBuffer = null } = opts;
  const W = 900, H = 500;
  const canvas = Canvas.createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const bg = await loadBg(bgBuffer);
  if (bg) { const f = fitCover(bg, W, H); ctx.drawImage(bg, f.sx, f.sy, f.sw, f.sh, 0, 0, W, H); }
  else { ctx.fillStyle = THEME.primaryDark; ctx.fillRect(0, 0, W, H); }
  ctx.fillStyle = "rgba(6,16,35,0.5)"; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = THEME.panel;
  roundRect(ctx, 50, 60, W - 100, H - 120, 26); ctx.fill();
  ctx.strokeStyle = THEME.primary; ctx.lineWidth = 2;
  roundRect(ctx, 50, 60, W - 100, H - 120, 26); ctx.stroke();

  ctx.fillStyle = THEME.primary; ctx.font = "bold 90px serif"; ctx.textAlign = "left";
  ctx.fillText("\u201C", 80, 175);

  ctx.fillStyle = THEME.text; ctx.font = "32px sans-serif"; ctx.textAlign = "center";
  const lines = wrapText(ctx, text, W - 200);
  const startY = H / 2 - (lines.length * 20);
  lines.slice(0, 6).forEach((l, i) => ctx.fillText(l, W / 2, startY + i * 44));

  ctx.font = "italic bold 26px sans-serif"; ctx.fillStyle = THEME.primary;
  ctx.fillText(`— ${author}`, W / 2, H - 100);

  ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 18px sans-serif";
  ctx.fillText("Mino Bot Ultra ✦ kevsoft-id", W - 40, 40);

  return canvas.toBuffer("image/png");
}

module.exports = { renderProfileCard, renderQuoteCard, THEME, isAvailable: () => !!Canvas };
