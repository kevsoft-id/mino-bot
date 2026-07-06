const { getRuntime } = require("../../lib/function");
const os = require("os");
module.exports={
  command:["uptime","serverinfo","sysinfo"],category:"owner",description:"Info server dan uptime",ownerOnly:true,
  async run({sock,m,startTime}){
    const runtime=getRuntime(startTime);
    const mem=process.memoryUsage();
    const freeRam=os.freemem();const totalRam=os.totalmem();
    const cpu=os.cpus()[0];
    await sock.sendMessage(m.chat,{text:
      `╭──「 *🖥️ SERVER INFO* 」\n│● Uptime   : ${runtime}\n│● Platform : ${process.platform} (${os.release()})\n│● Node.js  : ${process.version}\n│● CPU      : ${cpu?.model?.split(" ").slice(-2).join(" ")||"-"}\n│● CPU Use  : ${(process.cpuUsage().user/1000000).toFixed(2)}s\n│● RAM Used : ${(mem.rss/1024/1024).toFixed(1)}MB\n│● RAM Free : ${(freeRam/1024/1024).toFixed(0)}MB/${(totalRam/1024/1024).toFixed(0)}MB\n│● Heap     : ${(mem.heapUsed/1024/1024).toFixed(1)}MB/${(mem.heapTotal/1024/1024).toFixed(1)}MB\n╰───────────♢`
    },{quoted:m});
  },
};
