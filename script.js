(() => {
 const grid=document.getElementById('game-grid'), search=document.getElementById('search'), filters=document.getElementById('filters');
 if(!grid) return;
 let category='All';
 const cats=['All',...new Set(GAMES.map(g=>g.category))];
 filters.innerHTML=cats.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-cat="${c}">${c}</button>`).join('');
 function render(){
  const q=(search.value||'').toLowerCase();
  const list=GAMES.filter(g=>(category==='All'||g.category===category)&&(g.title+' '+g.description+' '+g.category).toLowerCase().includes(q));
  document.getElementById('game-count').textContent=`${list.length} GAMES`;
  grid.innerHTML=list.length?list.map(g=>`<article class="game-card"><div class="game-visual">${g.icon}</div><div class="game-info"><h3>${g.title}</h3><p>${g.description}</p><div class="game-meta"><span class="tag">${g.category}</span><button class="play-btn" data-play="${g.id}">PLAY ↗</button></div></div></article>`).join(''):'<div class="empty">No games found. Try another search.</div>';
 }
 filters.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;category=b.dataset.cat;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});
 search.addEventListener('input',render);
 grid.addEventListener('click',e=>{const b=e.target.closest('[data-play]');if(b)location.href=`player.html?game=${encodeURIComponent(b.dataset.play)}`});
 document.getElementById('year').textContent=new Date().getFullYear();render();
})();