(() => {
  const params=new URLSearchParams(location.search);
  const id=Number(params.get("id"))||1;
  const game=(window.RAYNIX_GAMES||[]).find(g=>g.id===id)||(window.RAYNIX_GAMES||[])[0];
  const stage=document.getElementById("gameStage"), title=document.getElementById("gameTitle");
  const desc=document.getElementById("gameDescription"), instructions=document.getElementById("gameInstructions");
  if(!game){stage.textContent="Game catalogue unavailable.";return;}
  title.textContent=game.emoji+" "+game.name;desc.textContent=game.description;document.title=game.name+" — Raynix";
  try{
    const recent=JSON.parse(localStorage.getItem("raynixRecent")||"[]").filter(g=>g.id!==game.id);
    recent.unshift({id:game.id,name:game.name,emoji:game.emoji});localStorage.setItem("raynixRecent",JSON.stringify(recent.slice(0,10)));
  }catch{}
  document.getElementById("fullscreenBtn").addEventListener("click",()=>{if(!document.fullscreenElement)stage.requestFullscreen?.();else document.exitFullscreen?.();});
  const button=(label,fn,secondary=false)=>{const b=document.createElement("button");b.className="game-button"+(secondary?" secondary":"");b.textContent=label;b.addEventListener("click",fn);return b;};
  const ui=(heading,paragraph)=>{stage.replaceChildren();const box=document.createElement("div");box.className="game-ui";const h=document.createElement("h2");h.textContent=heading;const p=document.createElement("p");p.textContent=paragraph;box.append(h,p);stage.append(box);return box;};
  const canvasGame=(w=700,h=420)=>{stage.replaceChildren();const c=document.createElement("canvas");c.width=w;c.height=h;c.style.width="min(100%,"+w+"px)";c.style.height="auto";stage.append(c);const ctx=c.getContext("2d");return {c,ctx};};
  const scoreLabel=(text)=>{const d=document.createElement("div");d.className="score-line";d.textContent=text;stage.prepend(d);return d;};

  function snake(){
    const {c,ctx}=canvasGame(600,400);let snake,dir,food,score,timer,alive,keys={};
    const cell=20,cols=30,rows=20;
    function reset(){snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}];dir={x:1,y:0};food={x:18,y:10};score=0;alive=true;clearInterval(timer);label.textContent="SCORE: 0";timer=setInterval(step,115);draw();}
    const label=scoreLabel("SCORE: 0");
    function draw(){ctx.fillStyle="#08111d";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#193044";for(let x=0;x<cols;x++)for(let y=0;y<rows;y++)ctx.fillRect(x*cell,y*cell,1,1);ctx.fillStyle="#ffcb6b";ctx.beginPath();ctx.arc(food.x*cell+10,food.y*cell+10,8,0,Math.PI*2);ctx.fill();snake.forEach((s,i)=>{ctx.fillStyle=i?"#3b9fba":"#79f0c1";ctx.fillRect(s.x*cell+1,s.y*cell+1,18,18);});if(!alive){ctx.fillStyle="#fff";ctx.font="bold 30px Arial";ctx.textAlign="center";ctx.fillText("GAME OVER",300,190);}}
    function step(){if(!alive)return;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)){alive=false;clearInterval(timer);draw();label.textContent="FINAL SCORE: "+score;return;}snake.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;label.textContent="SCORE: "+score;food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};}else snake.pop();draw();}
    function turn(x,y){if(x!==-dir.x||y!==-dir.y)dir={x,y};}
    document.onkeydown=e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key))e.preventDefault();if(e.key==="ArrowUp"||e.key==="w")turn(0,-1);if(e.key==="ArrowDown"||e.key==="s")turn(0,1);if(e.key==="ArrowLeft"||e.key==="a")turn(-1,0);if(e.key==="ArrowRight"||e.key==="d")turn(1,0);};
    instructions.textContent="Controls: Arrow keys or WASD. On mobile, swipe on the game board.";
    let sx=0,sy=0;c.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});c.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?1:-1);},{passive:true});
    reset();return()=>clearInterval(timer);
  }
  function pong(){
    const {c,ctx}=canvasGame(700,420);let py=160,by=210,bx=350,vx=4,vy=3,score=0,ai=160,raf,active=true;
    const label=scoreLabel("YOU: 0  |  FIRST TO 5");function draw(){ctx.fillStyle="#08111d";ctx.fillRect(0,0,700,420);ctx.setLineDash([8,10]);ctx.strokeStyle="#34516c";ctx.beginPath();ctx.moveTo(350,0);ctx.lineTo(350,420);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#70c7ff";ctx.fillRect(18,py,12,100);ctx.fillStyle="#d6a4ff";ctx.fillRect(670,ai,12,100);ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(bx,by,9,0,7);ctx.fill();}
    function loop(){if(!active)return;bx+=vx;by+=vy;ai+=(by-50-ai)*.045;if(by<8||by>412)vy*=-1;if(bx<32&&by>py&&by<py+100){vx=Math.abs(vx)*1.04;score++;label.textContent="YOU: "+score+"  |  FIRST TO 5";}if(bx>660&&by>ai&&by<ai+100)vx=-Math.abs(vx);if(bx<0||bx>710){bx=350;by=210;vx=bx<10?4:-4;}draw();if(score>=5){active=false;ctx.fillStyle="#fff";ctx.font="bold 28px Arial";ctx.textAlign="center";ctx.fillText("YOU WIN!",350,210);return;}raf=requestAnimationFrame(loop);}
    c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();py=Math.max(0,Math.min(320,(e.clientY-r.top)*420/r.height-50));});document.onkeydown=e=>{if(e.key==="ArrowUp")py=Math.max(0,py-25);if(e.key==="ArrowDown")py=Math.min(320,py+25);};instructions.textContent="Move your paddle with mouse, touch or ↑ / ↓ keys. Beat the computer to 5 points.";loop();return()=>{active=false;cancelAnimationFrame(raf);};
  }
  function breakout(){
    const {c,ctx}=canvasGame(700,430);let x=350,y=350,vx=3,vy=-4,paddle=300,bricks=[],score=0,raf,active=true;
    for(let r=0;r<5;r++)for(let col=0;col<9;col++)bricks.push({x:30+col*71,y:45+r*27,on:true});
    const label=scoreLabel("BRICKS: 45");function draw(){ctx.fillStyle="#08111d";ctx.fillRect(0,0,700,430);bricks.forEach((b,i)=>{if(b.on){ctx.fillStyle=["#56a8ff","#9b79ff","#f2bd65","#5ad6b2"][Math.floor(i/9)%4];ctx.fillRect(b.x,b.y,62,17);}});ctx.fillStyle="#fff";ctx.fillRect(paddle,395,100,12);ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();}
    function loop(){if(!active)return;x+=vx;y+=vy;if(x<8||x>692)vx*=-1;if(y<8)vy*=-1;if(y>385&&y<410&&x>paddle&&x<paddle+100){vy=-Math.abs(vy);vx+=(x-(paddle+50))*.035;}let b=bricks.find(b=>b.on&&x>b.x&&x<b.x+62&&y>b.y&&y<b.y+17);if(b){b.on=false;vy*=-1;score++;label.textContent="BRICKS: "+(45-score);}if(y>430){active=false;ctx.fillStyle="#fff";ctx.font="bold 26px Arial";ctx.textAlign="center";ctx.fillText("ROUND OVER — "+score+" BRICKS",350,220);return;}if(score===45){active=false;ctx.fillStyle="#fff";ctx.font="bold 30px Arial";ctx.textAlign="center";ctx.fillText("ALL CLEAR!",350,220);return;}draw();raf=requestAnimationFrame(loop);}
    c.addEventListener("pointermove",e=>{let r=c.getBoundingClientRect();paddle=Math.max(0,Math.min(600,(e.clientX-r.left)*700/r.width-50));});document.onkeydown=e=>{if(e.key==="ArrowLeft")paddle=Math.max(0,paddle-25);if(e.key==="ArrowRight")paddle=Math.min(600,paddle+25);};instructions.textContent="Move paddle with mouse, touch or ← / → keys. Keep the ball in play.";loop();return()=>{active=false;cancelAnimationFrame(raf);};
  }
  function memory(){
    const symbols=["🚀","🎮","👾","💎","⚡","🛸","🔥","🌙"];let cards=[...symbols,...symbols].sort(()=>Math.random()-.5),open=[],matched=0,moves=0,locked=false;
    const box=ui("MEMORY MATCH","Find all matching pairs. Flip two cards at a time.");const score=document.createElement("div");score.className="score-line";score.textContent="MOVES: 0 • PAIRS: 0/8";box.append(score);const board=document.createElement("div");board.className="board";box.append(board);
    cards.forEach((sym,i)=>{const b=document.createElement("button");b.className="memory-card";b.textContent="?";b.setAttribute("aria-label","Hidden card");b.addEventListener("click",()=>{if(locked||b.dataset.done||b.textContent!=="?")return;b.textContent=sym;b.dataset.sym=sym;open.push(b);if(open.length===2){moves++;score.textContent=`MOVES: ${moves} • PAIRS: ${matched}/8`;if(open[0].dataset.sym===open[1].dataset.sym){open.forEach(x=>{x.dataset.done="1";x.style.opacity=".45";});matched++;open=[];score.textContent=`MOVES: ${moves} • PAIRS: ${matched}/8`;if(matched===8){const win=document.createElement("p");win.textContent="YOU MATCHED EVERY PAIR!";box.append(win);}}else{locked=true;setTimeout(()=>{open.forEach(x=>{x.textContent="?";delete x.dataset.sym;});open=[];locked=false;},700);}}});board.append(b);});
    instructions.textContent="Tap or click two cards to reveal them. Match all eight pairs.";
  }
  function tictactoe(){
    let cells=Array(9).fill(""),turn="X",ended=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const box=ui("TIC TAC TOE","You are X. The computer is O.");const status=document.createElement("div");status.className="score-line";status.textContent="YOUR TURN";box.append(status);const board=document.createElement("div");board.className="ttt-board";box.append(board);
    function result(){for(const w of wins){if(cells[w[0]]&&cells[w[0]]===cells[w[1]]&&cells[w[1]]===cells[w[2]])return cells[w[0]];}return cells.every(Boolean)?"Draw":null;}
    function draw(){board.replaceChildren();cells.forEach((v,i)=>{const b=document.createElement("button");b.className="ttt-cell";b.textContent=v;b.disabled=!!v||ended;b.addEventListener("click",()=>{if(ended||turn!=="X")return;cells[i]="X";afterMove();if(!ended){turn="O";status.textContent="COMPUTER THINKING…";setTimeout(computer,350);}});board.append(b);});}
    function afterMove(){const r=result();if(r){ended=true;status.textContent=r==="Draw"?"IT'S A DRAW":r==="X"?"YOU WIN!":"COMPUTER WINS";}draw();}
    function computer(){if(ended)return;let empty=cells.map((v,i)=>v?null:i).filter(v=>v!==null);if(!empty.length)return;let pick=empty.find(i=>{let t=[...cells];t[i]="O";return wins.some(w=>t[w[0]]==="O"&&t[w[1]]==="O"&&t[w[2]]==="O");});if(pick===undefined)pick=empty.find(i=>{let t=[...cells];t[i]="X";return wins.some(w=>t[w[0]]==="X"&&t[w[1]]==="X"&&t[w[2]]==="X");});if(pick===undefined)pick=empty[Math.floor(Math.random()*empty.length)];cells[pick]="O";turn="X";afterMove();if(!ended)status.textContent="YOUR TURN";}
    box.append(button("RESTART",()=>{cells=Array(9).fill("");turn="X";ended=false;status.textContent="YOUR TURN";draw();},true));draw();instructions.textContent="Tap an empty square. Try to get three in a row.";
  }
  function reaction(){
    const box=ui("REACTION RUSH","Press START, wait until the panel turns green, then click as quickly as possible.");let state="idle",start=0,timer;
    const target=document.createElement("button");target.className="game-button";target.style.cssText="width:min(100%,420px);height:180px;font:700 20px Orbitron;background:#29334a";target.textContent="START";box.append(target);
    const result=document.createElement("div");result.className="score-line";box.append(result);
    target.addEventListener("click",()=>{if(state==="idle"||state==="done"){state="waiting";target.disabled=true;target.textContent="WAIT FOR GREEN…";target.style.background="#8b3b42";result.textContent="Don't click too early!";timer=setTimeout(()=>{state="ready";start=performance.now();target.disabled=false;target.textContent="CLICK NOW!";target.style.background="#159c68";},1200+Math.random()*2800);}else if(state==="waiting"){clearTimeout(timer);state="done";target.disabled=false;target.textContent="TOO SOON — TRY AGAIN";target.style.background="#8b3b42";result.textContent="False start!";}else if(state==="ready"){let ms=Math.round(performance.now()-start);state="done";target.textContent="TRY AGAIN";target.style.background="#29334a";result.textContent=`YOUR REACTION: ${ms} ms`;}});instructions.textContent="Wait for green. Clicking early means a false start.";
  }
  function clicker(){
    const box=ui("TAP FRENZY","Tap the button as many times as possible in 10 seconds.");let score=0,left=10,active=false,interval;
    const scoreEl=document.createElement("div");scoreEl.className="score-line";scoreEl.textContent="SCORE: 0 • TIME: 10";box.append(scoreEl);
    const b=button("START TAPPING",()=>{if(!active){score=0;left=10;active=true;b.textContent="TAP! TAP! TAP!";scoreEl.textContent="SCORE: 0 • TIME: 10";interval=setInterval(()=>{left--;scoreEl.textContent=`SCORE: ${score} • TIME: ${left}`;if(left<=0){clearInterval(interval);active=false;b.textContent="PLAY AGAIN";scoreEl.textContent=`TIME UP! FINAL SCORE: ${score}`;}},1000);}else{score++;scoreEl.textContent=`SCORE: ${score} • TIME: ${left}`;}});
    box.append(b);instructions.textContent="Click or tap the big button repeatedly before the timer ends.";
  }
  function guess(){
    const box=ui("NUMBER QUEST","A secret number from 1 to 100 is waiting. Can you find it?");let secret=Math.floor(Math.random()*100)+1,tries=0;
    const input=document.createElement("input");input.type="number";input.min="1";input.max="100";input.placeholder="Enter 1–100";input.style.cssText="padding:12px;border-radius:8px;border:1px solid #526d9d;background:#101522;color:white;width:150px;margin:8px";
    const status=document.createElement("p");status.className="score-line";status.textContent="GUESSES: 0";
    const check=button("GUESS",test);const restart=button("NEW NUMBER",()=>{secret=Math.floor(Math.random()*100)+1;tries=0;status.textContent="GUESSES: 0";input.disabled=false;check.disabled=false;input.value="";},true);
    function test(){let n=Number(input.value);if(!Number.isInteger(n)||n<1||n>100){status.textContent="Enter a whole number from 1 to 100.";return;}tries++;if(n===secret){status.textContent=`CORRECT! You found it in ${tries} guesses.`;input.disabled=true;check.disabled=true;}else status.textContent=n<secret?"Too low — try higher.": "Too high — try lower.";input.value="";input.focus();}
    input.addEventListener("keydown",e=>{if(e.key==="Enter")test();});box.append(input,check,restart,status);instructions.textContent="Enter a whole number between 1 and 100, then press Guess.";
  }
  const cleanups={snake,pong,breakout,memory,tictactoe,reaction,clicker,guess};
  const cleanup=(cleanups[game.type]||snake)();
  window.addEventListener("beforeunload",()=>cleanup?.());
})();
