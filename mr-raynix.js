(() => {
 let player=100,enemy=100,turn=0,ended=false;
 const ph=document.getElementById('player-health'),eh=document.getElementById('enemy-health'),msg=document.getElementById('arena-status');
 function paint(){ph.style.width=player+'%';eh.style.width=enemy+'%'}
 function reset(){player=100;enemy=100;turn=0;ended=false;msg.textContent='The match begins. Choose your move!';paint()}
 function move(kind){if(ended)return;turn++;let damage=kind==='special'?24:kind==='attack'?16:0;enemy=Math.max(0,enemy-damage);if(enemy===0){ended=true;msg.textContent='Victory! MR RAYNIX wins the showdown.';paint();return}
  let rival=kind==='guard'?7:kind==='special'?15:20;player=Math.max(0,player-rival);if(player===0){ended=true;msg.textContent='The rival wins this round. Restart and try a new strategy.'}else msg.textContent=(kind==='guard'?'You guarded and reduced the hit.':kind==='special'?'Special move landed!':'You attacked!')+' Rival countered. Turn '+turn+'.';paint()
 }
 document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>move(b.dataset.move)));
 document.getElementById('arena-reset').addEventListener('click',reset);paint();
})();