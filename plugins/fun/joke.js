const jokes=[["Kenapa programmer suka minum kopi?","Karena tanpa java mereka tidak bisa jalan! ☕😂"],["Apa persamaan programmer dan tukang masak?","Dua-duanya sering *loop* kerjaan mereka! 🔄"],["Kenapa komputer sering sakit?","Karena kebanyakan *virus*! 🦠"],["Apa bahasa pemrograman yang disukai bayi?","*Java*script... soalnya bayi sering *cry()* 😭"],["Kenapa programmer tidak suka keluar rumah?","Karena di luar tidak ada *localhost*! 🏠"],["Bagaimana cara programmer bilang 'selamat tidur'?","*404 – Sleep Not Found*! 😴"],["Kenapa ayam menyeberang jalan?","Karena *default gateway*-nya ada di seberang! 🐔"],["Knock knock. Who's there? Recursion.","Recursion who? Knock knock... 🔁"],["Berapa banyak programmer untuk mengganti lampu?","Tidak ada, itu masalah *hardware*! 💡"],["Kenapa hacker sukses?","Karena semua orang masih pakai password '123456'! 🔐"]];
module.exports={
  command:["joke","lucu","humor","ngocol"],category:"fun",description:"Joke/lelucon random",
  async run({sock,m}){
    const[q,a]=jokes[Math.floor(Math.random()*jokes.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *😂 JOKE* 」\n│● ${q}\n│\n│💡 ${a}\n╰───────────♢`},{quoted:m});
  },
};
