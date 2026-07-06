function toRoman(n){
  const v=[1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const s=["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let r="";for(let i=0;i<v.length;i++)while(n>=v[i]){r+=s[i];n-=v[i];}return r;
}
function fromRoman(s){
  const m={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let r=0;const a=s.toUpperCase().split("");
  for(let i=0;i<a.length;i++){const c=m[a[i]];const n=m[a[i+1]]||0;r+=c<n?-c:c;}return r;
}
module.exports={
  command:["roman","romawi"],category:"converter",description:"Konversi angka ke/dari Romawi",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .roman <angka> atau .roman <ROMAWI>"},{quoted:m});
    const input=args[0];
    const isNum=/^\d+$/.test(input);
    try{
      const result=isNum?toRoman(parseInt(input)):fromRoman(input);
      await sock.sendMessage(m.chat,{text:`╭──「 *🏛️ ROMAWI* 」\n│● Input : ${input}\n│● Output: ${result}\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
