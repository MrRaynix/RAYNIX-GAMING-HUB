(() => {
 const params=new URLSearchParams(location.search), id=params.get('game'), game=GAMES.find(g=>g.id===id);
 const panel=document.getElementById('game-panel');
 if(!game){panel.innerHTML='<p class="game-status">Game not found.</p><div class="game-actions"><a class="action-btn" href="index.html">Back to library</a></div>';return}
 document.getElementById('game-name').textContent=game.title;
 document.getElementById('game-description').textContent=game.description;
 const btn=(label,cls='action-btn',action='')=>`<button class="${cls}" ${action}>${label}</button>`;
 const status=t=>{const el=document.getElementById('status');if(el)el.textContent=t};
 const resetBtn=`<div class="game-actions">${btn('RESTART','secondary-btn','id="restart"')}<a class="secondary-btn" href="index.html">LIBRARY</a></div>`;
 function mount(html){panel.innerHTML=html+`<div class="game-status" id="status"></div>`+resetBtn}
 function start(){
  switch(id){
   case 'word-hunt': wordHunt();break;
   case 'memory-flip': memory();break;
   case 'number-quest': numberQuest();break;
   case 'tic-tac-toe': tic();break;
   case 'maze-runner': maze();break;
   case 'neon-snake': snake();break;
   case 'brick-breaker': bricks();break;
   case 'reaction-rush': reaction();break;
   case 'goal-shot': goal();break;
   case 'raynix-showdown': location.href='mr-raynix.html';break;
  }
  const r=document.getElementById('restart');if(r)r.onclick=start;
 }
 function wordHunt(){
  const words=['STAR','MOON','PLAY'];let chosen=words[Math.floor(Math.random()*words.length)],letters=chosen.split('');
  const grid=Array.from({length:5},()=>Array.from({length:5},()=>String.fromCharCode(65+Math.floor(Math.random()*26))));
  const row=Math.floor(Math.random()*5),col=Math.floor(Math.random()*(6-chosen.length));
  letters.forEach((l,i)=>grid[row][col+i]=l);
  let picked=[];mount(`<p class="game-status">Find the hidden word: <b>${chosen}</b></p><div class="board word-board">${grid.flat().map((l,i)=>`<button data-i="${i}">${l}</button>`).join('')}</div><div class="small-note">Tap the letters in order, left to right.</div>`);
  panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{if(picked.length>=chosen.length)return;let i=+b.dataset.i, r=Math.floor(i/5),c=i%5;if(r!==row||c!==col+picked.length){picked=[];panel.querySelectorAll('[data-i]').forEach(x=>x.classList.remove('selected'));status('Not that letter — try again.');return}picked.push(i);b.style.background='#14665f';if(picked.length===chosen.length)status('Word found! Great job.');});
 }
 function memory(){
  let values=['🍋','🚀','🎮','👑','🍋','🚀','🎮','👑'].sort(()=>Math.random()-.5),open=[],matched=0,lock=false;
  mount(`<div class="board memory-board">${values.map((v,i)=>`<button data-i="${i}">?</button>`).join('')}</div><p class="small-note">Find all four matching pairs.</p>`);
  panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(lock||open.includes(i)||b.dataset.done)return;b.textContent=values[i];open.push(i);if(open.length===2){lock=true;let [a,c]=open;if(values[a]===values[c]){matched+=2;[a,c].forEach(n=>panel.querySelector(`[data-i="${n}"]`).dataset.done='1');open=[];lock=false;status(matched===8?'All pairs matched!':'Match found!')}else setTimeout(()=>{[a,c].forEach(n=>{let x=panel.querySelector(`[data-i="${n}"]`);if(x)x.textContent='?'});open=[];lock=false},650)}})
 }
 function numberQuest(){
  let a=2+Math.floor(Math.random()*8),b=2+Math.floor(Math.random()*8),ans=a+b,opts=[ans,ans+2,ans-1,ans+4].sort(()=>Math.random()-.5);
  mount(`<h2 style="text-align:center">What is ${a} + ${b}?</h2><div class="number-options">${opts.map(n=>`<button class="action-btn" data-n="${n}">${n}</button>`).join('')}</div>`);
  panel.querySelectorAll('[data-n]').forEach(x=>x.onclick=()=>{status(+x.dataset.n===ans?'Correct answer!':'Try again — keep thinking.')});
 }
 function tic(){
  let board=Array(9).fill(''),over=false;
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  mount(`<div class="board tic-board">${board.map((_,i)=>`<button data-i="${i}"></button>`).join('')}</div>`);
  function winner(){for(const w of wins){if(board[w[0]]&&board[w[0]]===board[w[1]]&&board[w[1]]===board[w[2]])return board[w[0]]}return board.every(Boolean)?'draw':null}
  function draw(){panel.querySelectorAll('[data-i]').forEach((b,i)=>{b.textContent=board[i];b.disabled=!!board[i]||over})}
  panel.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(over||board[i])return;board[i]='X';let w=winner();if(w){over=true;status(w==='X'?'You win!': 'Draw!');draw();return}let empty=board.map((v,n)=>v?null:n).filter(v=>v!==null),move=empty[Math.floor(Math.random()*empty.length)];board[move]='O';w=winner();if(w){over=true;status(w==='O'?'Computer wins this round.':'Draw!')}draw()});draw();
 }
 function maze(){
  let map=['#########','#S#...#E#','#.#.#...#','#...#.#.#','###...#.#','#.......#','#########'],pos=[1,1],won=false;
  mount(`<div id="maze" class="maze"></div><div class="game-actions">${['↑','←','↓','→'].map((v,i)=>`<button class="action-btn" data-m="${i}">${v}</button>`).join('')}</div><p class="small-note">Use arrow keys or tap the arrows.</p>`);
  function draw(){document.getElementById('maze').textContent=map.map((line,r)=>line.split('').map((ch,c)=>r===pos[0]&&c===pos[1]?'🟢':ch==='S'?' ':ch==='E'?'🏁':ch==='.'?'·':'█').join('')).join('\n')}
  function move(d){if(won)return;let ds=[[-1,0],[0,-1],[1,0],[0,1]][d],r=pos[0]+ds[0],c=pos[1]+ds[1];if(map[r]?.[c]==='#')return;if(map[r]?.[c]==='E'){won=true;status('You escaped the maze!');return}pos=[r,c];draw()}
  panel.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>move(+b.dataset.m));const key=e=>{let d={'ArrowUp':0,'ArrowLeft':1,'ArrowDown':2,'ArrowRight':3}[e.key];if(d!==undefined)move(d)};window.addEventListener('keydown',key,{once:false});draw();
 }
 function snake(){
  mount(`<div class="canvas-wrap"><canvas id="cv" width="320" height="320"></canvas></div><div class="game-actions">${['↑','←','↓','→'].map((v,i)=>`<button class="action-btn" data-dir="${i}">${v}</button>`).join('')}</div><p class="small-note">Arrow keys or buttons. Eat the gold square; don't hit the wall or yourself.</p>`);
  const c=document.getElementById('cv'),ctx=c.getContext('2d'),size=16;let s=[[5,8],[4,8],[3,8]],d=[1,0],food=[12,8],score=0,alive=true;
  function tick(){if(!alive)return;let h=[s[0][0]+d[0],s[0][1]+d[1]];if(h[0]<0||h[0]>=20||h[1]<0||h[1]>=20||s.some(p=>p[0]===h[0]&&p[1]===h[1])){alive=false;status('Game over. Score: '+score);return}s.unshift(h);if(h[0]===food[0]&&h[1]===food[1]){score++;food=[Math.floor(Math.random()*20),Math.floor(Math.random()*20)];status('Score: '+score)}else s.pop();ctx.fillStyle='#08111f';ctx.fillRect(0,0,320,320);ctx.fillStyle='#f5bd4b';ctx.fillRect(food[0]*size,food[1]*size,size-2,size-2);ctx.fillStyle='#43e0e8';s.forEach(p=>ctx.fillRect(p[0]*size,p[1]*size,size-2,size-2));if(alive)timer=setTimeout(tick,125)}
  let timer;const dirs=[[0,-1],[-1,0],[0,1],[1,0]];panel.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{let nd=dirs[+b.dataset.dir];if(nd[0]!==-d[0]||nd[1]!==-d[1])d=nd});const key=e=>{let nd={'ArrowUp':[0,-1],'ArrowLeft':[-1,0],'ArrowDown':[0,1],'ArrowRight':[1,0]}[e.key];if(nd&&(nd[0]!==-d[0]||nd[1]!==-d[1]))d=nd};window.addEventListener('keydown',key);tick();
 }
 function bricks(){
  mount(`<div class="canvas-wrap"><canvas id="cv" width="420" height="300"></canvas></div><p class="small-note">Move your mouse or finger horizontally to control the paddle.</p>`);
  const c=document.getElementById('cv'),ctx=c.getContext('2d');let x=210,y=245,dx=3,dy=-3,p=175,blocks=Array.from({length:3},(_,r)=>Array.from({length:8},(_,col)=>({x:8+col*51,y:20+r*24,on:true}))),alive=true;
  function draw(){ctx.fillStyle='#08111f';ctx.fillRect(0,0,420,300);blocks.flat().forEach(b=>{if(b.on){ctx.fillStyle='#43e0e8';ctx.fillRect(b.x,b.y,43,14)}});ctx.fillStyle='#f5bd4b';ctx.fillRect(p,275,70,10);ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();if(!alive)return;x+=dx;y+=dy;if(x<7||x>413)dx*=-1;if(y<7)dy*=-1;if(y>267&&x>p&&x<p+70)dy=-Math.abs(dy);if(y>300){alive=false;status('Game over. Press restart.')}blocks.flat().forEach(b=>{if(b.on&&x>b.x&&x<b.x+43&&y>b.y&&y<b.y+14){b.on=false;dy*=-1}});if(blocks.flat().every(b=>!b.on)){alive=false;status('All blocks cleared!')}if(alive)requestAnimationFrame(draw)}
  function pointer(e){let rect=c.getBoundingClientRect();p=Math.max(0,Math.min(350,(e.clientX-rect.left)*420/rect.width-35))}c.addEventListener('pointermove',pointer);draw();
 }
 function reaction(){
  mount(`<div class="big-emoji">⚡</div><p style="text-align:center">Wait until the panel turns green, then tap as fast as you can.</p><div class="game-actions"><button id="react" class="action-btn">START</button></div>`);
  let phase='idle',timer;const b=document.getElementById('react');b.onclick=()=>{if(phase==='idle'){phase='wait';b.textContent='WAIT…';b.style.background='#c74a5a';timer=setTimeout(()=>{phase='go';b.textContent='TAP NOW!';b.style.background='#36c98b';},1200+Math.random()*2500)}else if(phase==='wait'){clearTimeout(timer);phase='idle';b.textContent='START';b.style.background='';status('Too early! Try again.')}else if(phase==='go'){phase='idle';b.textContent='START';b.style.background='';status('Your reaction: '+Math.round(performance.now()%1000)+' ms (approx.)')}};
 }
 function goal(){
  mount(`<div class="big-emoji">🥅</div><h2 style="text-align:center">Penalty challenge</h2><p style="text-align:center">Choose a direction. You have five shots.</p><div class="game-actions">${['LEFT','CENTER','RIGHT'].map(v=>`<button class="action-btn" data-shot="${v}">${v}</button>`).join('')}</div>`);
  let shots=0,score=0;panel.querySelectorAll('[data-shot]').forEach(b=>b.onclick=()=>{if(shots>=5)return;shots++;let keeper=['LEFT','CENTER','RIGHT'][Math.floor(Math.random()*3)],goal=b.dataset.shot!==keeper;if(goal)score++;status(`${goal?'GOAL!':'Saved!'} Score ${score}/${shots}`);if(shots===5)status(`Full time! Final score: ${score}/5`)});
 }
 start();
})();