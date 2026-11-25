/* Raynix catalogue data.
   This creates 5,000 catalogue editions from 8 playable browser-game engines.
   These are variations/editions, not 5,000 independently developed games. */
(() => {
  const base = [
    {name:"Neon Snake",category:"Arcade",type:"snake",emoji:"🐍",colors:["#153d46","#137b78"],description:"Guide the snake, collect glowing food and beat your best score."},
    {name:"Pocket Pong",category:"Sports",type:"pong",emoji:"🏓",colors:["#15345a","#2866a2"],description:"A quick paddle duel. Keep the ball in play."},
    {name:"Brick Breaker",category:"Arcade",type:"breakout",emoji:"🧱",colors:["#54234c","#a33e74"],description:"Bounce the ball and clear every brick."},
    {name:"Memory Match",category:"Puzzle",type:"memory",emoji:"🧠",colors:["#49306b","#8d55b8"],description:"Flip cards and find matching pairs."},
    {name:"Tic Tac Toe",category:"Brain",type:"tictactoe",emoji:"⭕",colors:["#174b59","#277e91"],description:"Play a classic strategy game against the computer."},
    {name:"Reaction Rush",category:"Casual",type:"reaction",emoji:"⚡",colors:["#573b18","#bd8430"],description:"Wait for green, then test your reaction speed."},
    {name:"Tap Frenzy",category:"Action",type:"clicker",emoji:"👆",colors:["#5a263d","#b74b70"],description:"Tap as fast as you can before time runs out."},
    {name:"Number Quest",category:"Brain",type:"guess",emoji:"🔢",colors:["#203c68","#477dc1"],description:"Find the hidden number using the fewest guesses."}
  ];
  const prefixes = ["Neon","Turbo","Cosmic","Pixel","Shadow","Ultra","Nova","Hyper","Mystic","Rapid","Crystal","Cyber","Mega","Golden","Frost","Solar","Quantum","Phantom","Rocket","Jungle"];
  const suffixes = ["Challenge","Rush","Quest","Arena","Edition","Blitz","Trials","Adventure","Mode","Master"];
  const games = [];
  for (let i=0;i<5000;i++) {
    const template = base[i % base.length];
    const edition = Math.floor(i / base.length);
    const name = edition === 0 ? template.name : `${prefixes[edition % prefixes.length]} ${template.name} ${suffixes[Math.floor(edition / prefixes.length) % suffixes.length]} ${edition+1}`;
    games.push({
      id:i+1, name, category:template.category, type:template.type, emoji:template.emoji,
      colors:template.colors, description:template.description, featured:i<8
    });
  }
  window.RAYNIX_GAMES = games;
})();
