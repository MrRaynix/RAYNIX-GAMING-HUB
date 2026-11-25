(() => {
  const games = window.RAYNIX_GAMES || [];
  const grid = document.getElementById("gameGrid");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const count = document.getElementById("resultsCount");
  const loadMore = document.getElementById("loadMore");
  const PAGE_SIZE = 24;
  let category = "All", visible = PAGE_SIZE;

  const safeRecent = () => {
    try { return JSON.parse(localStorage.getItem("raynixRecent") || "[]"); }
    catch { return []; }
  };
  function card(game) {
    const card = document.createElement("article");
    card.className = "game-card";
    const thumb = document.createElement("div");
    thumb.className = "game-thumb";
    thumb.style.setProperty("--card-bg", `linear-gradient(135deg,${game.colors[0]},${game.colors[1]})`);
    const emoji = document.createElement("span"); emoji.className="game-emoji"; emoji.textContent=game.emoji;
    const number = document.createElement("span"); number.className="game-number"; number.textContent=`#${String(game.id).padStart(4,"0")}`;
    thumb.append(emoji,number);
    const info = document.createElement("div"); info.className="game-info";
    const title = document.createElement("h3"); title.className="game-title"; title.textContent=game.name;
    const meta = document.createElement("div"); meta.className="game-meta";
    const cat = document.createElement("span"); cat.textContent=game.category;
    const kind = document.createElement("span"); kind.textContent="Browser game";
    meta.append(cat,kind);
    const link = document.createElement("a"); link.className="play-link"; link.href=`player.html?id=${game.id}`; link.textContent="PLAY NOW →";
    info.append(title,meta,link); card.append(thumb,info); return card;
  }
  function filtered() {
    const q = search.value.trim().toLowerCase();
    let result = games.filter(g => (category==="All" || g.category===category) &&
      (!q || g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)));
    if(sort.value==="az") result.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort.value==="za") result.sort((a,b)=>b.name.localeCompare(a.name));
    return result;
  }
  function render() {
    const result = filtered();
    grid.replaceChildren();
    result.slice(0,visible).forEach(g=>grid.appendChild(card(g)));
    count.textContent = `${result.length.toLocaleString()} games found`;
    loadMore.hidden = visible >= result.length;
    if(result.length===0){const empty=document.createElement("p");empty.className="muted";empty.textContent="No games found. Try another search.";grid.appendChild(empty);}
  }
  document.querySelectorAll(".category-chip").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelector(".category-chip.selected")?.classList.remove("selected");
    btn.classList.add("selected"); category=btn.dataset.category; visible=PAGE_SIZE; render();
  }));
  search.addEventListener("input",()=>{visible=PAGE_SIZE;render();});
  sort.addEventListener("change",()=>{visible=PAGE_SIZE;render();});
  loadMore.addEventListener("click",()=>{visible+=PAGE_SIZE;render();});
  document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
  document.getElementById("year").textContent=new Date().getFullYear();
  document.getElementById("gameCount").textContent=games.length.toLocaleString();
  document.addEventListener("keydown",e=>{if(e.key==="/" && document.activeElement!==search){e.preventDefault();search.focus();}});
  function renderRecent(){
    const area=document.getElementById("recentGames"), recent=safeRecent().slice(0,6);
    area.replaceChildren();
    if(!recent.length){const p=document.createElement("p");p.className="muted";p.textContent="Your recently played games will appear here.";area.appendChild(p);return;}
    recent.forEach(g=>{const a=document.createElement("a");a.className="recent-item";a.href=`player.html?id=${g.id}`;a.textContent=`${g.emoji} ${g.name}`;area.appendChild(a);});
  }
  render();renderRecent();
})();
