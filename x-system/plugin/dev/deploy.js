'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const AdmZip   = require('adm-zip');
const settings = require('../../../set/settings');

// Download quoted document from WhatsApp
async function downloadQuotedDoc(sock, m) {
  const { downloadMediaMessage } = require('@whiskeysockets/baileys');
  const pino = require('pino');

  const ctx    = m.message?.extendedTextMessage?.contextInfo;
  const qMsg   = ctx?.quotedMessage;
  if (!qMsg) return null;

  const docMsg = qMsg.documentMessage ||
                 qMsg.documentWithCaptionMessage?.message?.documentMessage;
  if (!docMsg) return null;

  const fakeMsg = {
    key:     { remoteJid: m.key.remoteJid, id: ctx.stanzaId, participant: ctx.participant },
    message: qMsg,
  };

  try {
    const buf = await downloadMediaMessage(fakeMsg, 'buffer', {}, {
      logger: pino({ level: 'silent' }),
      reuploadRequest: sock.updateMediaMessage,
    });
    return { buf, fileName: docMsg.fileName || 'file', mimetype: docMsg.mimetype || '' };
  } catch {
    return null;
  }
}

// ── GitHub Deploy ────────────────────────────────────────────────
module.exports = [
  {
    commands:    ['ghdeploy', 'gitdeploy', 'deploygit'],
    category:    'Dev',
    description: 'Deploy ZIP ke GitHub repository baru. Reply file ZIP + .ghdeploy {nama_repo}',
    usage:       '.ghdeploy {nama_repo}  (reply ke file ZIP)',
    ownerOnly:   true,

    async handler(sock, m, { text, reply, react }) {
      const { theme } = settings;

      if (!text) {
        return reply([
          theme.header, '',
          ` ⬡  🚀  ${theme.bold('GITHUB DEPLOYER')}`, '',
          `    ${theme.bullet} Reply ke file ZIP dengan: .ghdeploy {nama_repo}`,
          `    ${theme.bullet} Bot akan upload seluruh isi ZIP ke GitHub`,
          `    ${theme.bullet} GitHub Token harus diisi di settings.js`,
          '',
          `    📝 Contoh: .ghdeploy my-awesome-project`,
          `    🔗 Isi: settings.js → githubToken`,
          '',
          theme.footer,
        ].join('\n'));
      }

      const token = settings.githubToken;
      if (!token) return reply('❌ githubToken belum diisi di settings.js\nDapatkan di: https://github.com/settings/tokens');

      await react('⏳');
      await reply('⬇️ Mengunduh file ZIP...');

      const doc = await downloadQuotedDoc(sock, m);
      if (!doc) return reply('❌ Reply ke file ZIP dulu ya!\nContoh: reply ZIP → .ghdeploy nama-repo');
      if (!doc.fileName.endsWith('.zip') && !doc.mimetype.includes('zip')) {
        return reply('❌ File harus berupa ZIP!');
      }

      const repoName  = text.trim().replace(/[^a-zA-Z0-9._-]/g, '-');
      const ownerData = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'KEVSOFTBot' },
      }).catch(() => null);

      if (!ownerData) return reply('❌ GitHub token tidak valid!');
      const owner = ownerData.data.login;

      await reply(`📦 Membuat repository "${owner}/${repoName}"...`);

      try {
        // Create repository
        await axios.post('https://api.github.com/user/repos', {
          name:        repoName,
          description: `Deployed via ${settings.botName}`,
          private:     false,
          auto_init:   false,
        }, {
          headers: {
            Authorization:  `Bearer ${token}`,
            'User-Agent':   'KEVSOFTBot',
            'Content-Type': 'application/json',
          },
        }).catch(() => {}); // Repo might already exist

        // Extract ZIP and upload files
        const zip   = new AdmZip(doc.buf);
        const files = zip.getEntries().filter(e => !e.isDirectory);

        await reply(`📤 Mengupload ${files.length} file ke GitHub...`);

        let uploaded = 0;
        for (const entry of files) {
          const content = entry.getData().toString('base64');
          const path    = entry.entryName;

          // Check if file exists (get SHA)
          const existing = await axios.get(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`,
            { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'KEVSOFTBot' } }
          ).catch(() => null);

          const body = {
            message: `Deploy: ${path}`,
            content,
            branch:  'main',
          };
          if (existing?.data?.sha) body.sha = existing.data.sha;

          await axios.put(
            `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`,
            body,
            { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'KEVSOFTBot', 'Content-Type': 'application/json' } }
          );

          uploaded++;
        }

        await react('✅');
        await reply([
          `✅ *Deploy ke GitHub Berhasil!*`,
          ``,
          `📦 *Repo*    : ${owner}/${repoName}`,
          `📁 *Files*   : ${uploaded} file diupload`,
          `🌿 *Branch*  : main`,
          ``,
          `🔗 *URL*: https://github.com/${owner}/${repoName}`,
          `🌐 *Pages*: https://${owner}.github.io/${repoName}`,
          ``,
          `💡 Aktifkan GitHub Pages di Settings → Pages jika ingin website!`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Deploy gagal: ${err.response?.data?.message || err.message}`);
      }
    },
  },

  // ── Vercel Deploy ────────────────────────────────────────────
  {
    commands:    ['vercel', 'verceldeploy', 'deployvercel'],
    category:    'Dev',
    description: 'Deploy HTML ke Vercel (bisa 1 file HTML). Reply file HTML + .vercel {nama}',
    usage:       '.vercel {nama_project}  (reply ke file HTML atau ZIP)',
    ownerOnly:   true,

    async handler(sock, m, { text, reply, react }) {
      const { theme } = settings;

      if (!text) {
        return reply([
          theme.header, '',
          ` ⬡  ▲  ${theme.bold('VERCEL DEPLOYER')}`, '',
          `    ${theme.bullet} Reply ke file HTML atau ZIP`,
          `    ${theme.bullet} Ketik: .vercel {nama-project}`,
          `    ${theme.bullet} Vercel Token harus diisi di settings.js`,
          '',
          `    📝 Contoh: .vercel my-landing-page`,
          `    🔗 Token: https://vercel.com/account/tokens`,
          '',
          theme.footer,
        ].join('\n'));
      }

      const token = settings.vercelToken;
      if (!token) return reply('❌ vercelToken belum diisi di settings.js\nDapatkan di: https://vercel.com/account/tokens');

      await react('⏳');
      const doc = await downloadQuotedDoc(sock, m);
      if (!doc) return reply('❌ Reply ke file HTML atau ZIP dulu ya!');

      const projectName = text.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      await reply(`▲ Deploying ke Vercel sebagai "${projectName}"...`);

      try {
        let files = [];

        if (doc.fileName.endsWith('.zip') || doc.mimetype.includes('zip')) {
          const zip     = new AdmZip(doc.buf);
          const entries = zip.getEntries().filter(e => !e.isDirectory);
          files = entries.map(e => ({
            file:     e.entryName,
            data:     e.getData().toString('utf8'),
            encoding: 'utf8',
          }));
        } else {
          // Single file (HTML, CSS, JS, etc.)
          const filename = doc.fileName || 'index.html';
          files = [{
            file:     filename.includes('/') ? filename : filename,
            data:     doc.buf.toString('utf8'),
            encoding: 'utf8',
          }];
          // Add root index.html if needed
          if (!files.some(f => f.file === 'index.html')) {
            files.push({ file: 'index.html', data: doc.buf.toString('utf8'), encoding: 'utf8' });
          }
        }

        const { data } = await axios.post(
          'https://api.vercel.com/v13/deployments',
          {
            name:  projectName,
            files: files.map(f => ({
              file:     f.file,
              data:     Buffer.from(f.data).toString('base64'),
              encoding: 'base64',
            })),
            projectSettings: {
              framework:       null,
              outputDirectory: null,
            },
          },
          {
            headers: {
              Authorization:  `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          }
        );

        const deployUrl = data.url ? `https://${data.url}` : `https://${projectName}.vercel.app`;

        await react('✅');
        await reply([
          `✅ *Deploy ke Vercel Berhasil!*`,
          ``,
          `▲ *Project* : ${projectName}`,
          `📁 *Files*  : ${files.length} file`,
          `🔄 *Status* : ${data.readyState || 'BUILDING'}`,
          ``,
          `🌐 *URL*: ${deployUrl}`,
          `🔗 *Dashboard*: https://vercel.com/dashboard`,
          ``,
          `⏳ Tunggu 1-2 menit untuk fully deploy!`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Deploy Vercel gagal:\n${err.response?.data?.error?.message || err.message}`);
      }
    },
  },
];
