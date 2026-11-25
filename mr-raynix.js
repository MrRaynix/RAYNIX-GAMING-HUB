(() => {
  const mount=document.getElementById("arenaCanvas");
  const status=document.getElementById("status");
  if(!window.THREE){status.textContent="3D library could not load. Check your internet connection.";return;}
  const THREE=window.THREE;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x10182a);scene.fog=new THREE.Fog(0x10182a,12,28);
  const camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.set(0,6.2,12.8);camera.lookAt(0,1,0);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0x9cbaff,0x242033,2));
  const key=new THREE.DirectionalLight(0xffe0b0,2.5);key.position.set(-4,9,6);key.castShadow=true;scene.add(key);
  const rim=new THREE.PointLight(0x5a83ff,35,18);rim.position.set(5,4,-4);scene.add(rim);
  const floorMat=new THREE.MeshStandardMaterial({color:0x22283a,roughness:.75,metalness:.25});
  const floor=new THREE.Mesh(new THREE.CylinderGeometry(6.5,6.5,.35,64),floorMat);floor.position.y=-.2;floor.receiveShadow=true;scene.add(floor);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(5.8,.045,8,100),new THREE.MeshBasicMaterial({color:0xd4a84f}));ring.rotation.x=Math.PI/2;ring.position.y=.02;scene.add(ring);
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const post=new THREE.Mesh(new THREE.CylinderGeometry(.09,.13,2.6,8),new THREE.MeshStandardMaterial({color:i%2?0x354d83:0x8b6735,metalness:.7,roughness:.3}));post.position.set(Math.cos(a)*6.15,1.1,Math.sin(a)*6.15);scene.add(post);}
  function makeFighter(primary,secondary,x,z){
    const root=new THREE.Group();root.position.set(x,0,z);scene.add(root);
    const mat=new THREE.MeshStandardMaterial({color:primary,metalness:.48,roughness:.35});
    const trim=new THREE.MeshStandardMaterial({color:secondary,metalness:.65,roughness:.28});
    const skin=new THREE.MeshStandardMaterial({color:0xc58d68,roughness:.8});
    function part(geo,m,pos,parent=root){const mesh=new THREE.Mesh(geo,m);mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
    part(new THREE.CylinderGeometry(.34,.43,.85,12),mat,[0,1.35,0]);
    part(new THREE.SphereGeometry(.28,16,12),skin,[0,2.05,0]);
    part(new THREE.BoxGeometry(.42,.12,.12),trim,[0,2.08,.24]);
    part(new THREE.BoxGeometry(.68,.15,.4),trim,[0,1.78,0]);
    const arms=[];
    for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.43,1.65,0);root.add(arm);part(new THREE.CylinderGeometry(.12,.16,.62,10),mat,[0,-.27,0],arm);part(new THREE.SphereGeometry(.17,12,10),trim,[0,-.62,.04],arm);arms.push(arm);}
    const legs=[];
    for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.2,.95,0);root.add(leg);part(new THREE.CylinderGeometry(.16,.2,.67,10),mat,[0,-.32,0],leg);part(new THREE.BoxGeometry(.28,.16,.45),trim,[0,-.68,.1],leg);legs.push(leg);}
    const aura=new THREE.Mesh(new THREE.TorusGeometry(.62,.025,6,32),new THREE.MeshBasicMaterial({color:secondary}));aura.rotation.x=Math.PI/2;aura.position.y=.12;root.add(aura);
    return {root,arms,legs,baseX:x,baseZ:z,attack:0,block:false};
  }
  const player=makeFighter(0x2868c7,0x70c8ff,-2.2,1.1);
  const enemy=makeFighter(0x842d4a,0xf0b45d,2.2,-1.1);
  player.root.rotation.y=.35;enemy.root.rotation.y=Math.PI-.35;
  let running=false,over=false,pHP=100,eHP=100,lastEnemy=0,keys={},lastAttack=0,clock=new THREE.Clock();
  const pBar=document.getElementById("playerHealth"),eBar=document.getElementById("enemyHealth");
  const startOverlay=document.getElementById("startOverlay"),endOverlay=document.getElementById("endOverlay");
  function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(mount);resize();
  function updateBars(){pBar.style.width=Math.max(0,pHP)+"%";eBar.style.width=Math.max(0,eHP)+"%";}
  function reset(){pHP=100;eHP=100;player.root.position.set(-2.2,0,1.1);enemy.root.position.set(2.2,0,-1.1);player.attack=enemy.attack=0;running=true;over=false;lastEnemy=performance.now();updateBars();startOverlay.classList.add("hidden");endOverlay.classList.add("hidden");status.textContent="Fight! Use J to punch, K to kick and L to block.";}
  function finish(won){running=false;over=true;document.getElementById("endTitle").textContent=won?"RAYNIX WINS!":"ROUND LOST";document.getElementById("endText").textContent=won?"The Arena Guard has been defeated. Ready for another round?":"The Arena Guard won this round. Train and try again.";endOverlay.classList.remove("hidden");status.textContent=won?"Victory!":"Match over.";}
  function attack(fighter,power){if(!running||fighter.attack>0)return;fighter.attack=power===13?.48:.34;fighter.arms[1].rotation.x=-1.65;const target=fighter===player?enemy:player;const now=performance.now();if(fighter===player){if(now-lastAttack<230)return;lastAttack=now;if(Math.abs(fighter.root.position.x-target.root.position.x)<3.15){const damage=power*(target.block?.22:1);eHP=Math.max(0,eHP-damage);updateBars();status.textContent=target.block?"Enemy blocked part of your strike!":"Clean hit!";if(eHP<=0)finish(true);}}else{if(Math.abs(fighter.root.position.x-target.root.position.x)<3.15){const damage=power*(target.block?.2:1);pHP=Math.max(0,pHP-damage);updateBars();status.textContent=target.block?"You blocked most of the hit.":"The Arena Guard landed a hit!";if(pHP<=0)finish(false);}}}
  function keyDown(e){const k=e.key.toLowerCase();if(["w","a","s","d","j","k","l"," "].includes(k))e.preventDefault();keys[k]=true;if(k==="j")attack(player,8);if(k==="k")attack(player,13);if(k==="l")player.block=true;}
  function keyUp(e){const k=e.key.toLowerCase();keys[k]=false;if(k==="l")player.block=false;}
  window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);window.addEventListener("blur",()=>{keys={};player.block=false;});
  document.querySelectorAll("[data-key]").forEach(btn=>{const k=btn.dataset.key;btn.addEventListener("pointerdown",e=>{e.preventDefault();keys[k]=true;if(k==="j")attack(player,8);if(k==="k")attack(player,13);if(k==="l")player.block=true;});["pointerup","pointerleave","pointercancel"].forEach(ev=>btn.addEventListener(ev,()=>{keys[k]=false;if(k==="l")player.block=false;}));});
  document.getElementById("startBtn").addEventListener("click",reset);document.getElementById("againBtn").addEventListener("click",reset);document.getElementById("restartTop").addEventListener("click",reset);
  function animate(){
    requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
    if(running){
      const speed=3.1*dt;
      if(keys.a)player.root.position.x-=speed;if(keys.d)player.root.position.x+=speed;if(keys.w)player.root.position.z-=speed;if(keys.s)player.root.position.z+=speed;
      player.root.position.x=THREE.MathUtils.clamp(player.root.position.x,-4.7,4.7);player.root.position.z=THREE.MathUtils.clamp(player.root.position.z,-3.5,3.5);
      player.block=!!keys.l;
      const dx=player.root.position.x-enemy.root.position.x,dz=player.root.position.z-enemy.root.position.z;
      enemy.root.rotation.y=Math.atan2(dx,dz);
      if(Math.abs(dx)>1.55)enemy.root.position.x+=Math.sign(dx)*1.25*dt;
      if(Math.abs(dz)>1.4)enemy.root.position.z+=Math.sign(dz)*.9*dt;
      if(performance.now()-lastEnemy>1150+Math.random()*500){lastEnemy=performance.now();enemy.block=Math.random()<.22;attack(enemy,7);}
      if(player.attack>0){player.attack-=dt;if(player.attack<=0)player.arms[1].rotation.x=0;}
      if(enemy.attack>0){enemy.attack-=dt;if(enemy.attack<=0)enemy.arms[1].rotation.x=0;}
    }
    player.root.position.y=Math.abs(Math.sin(t*5))*.025;enemy.root.position.y=Math.abs(Math.sin(t*4+1))*.025;
    player.legs[0].rotation.x=keys.w||keys.s?Math.sin(t*10)*.45:0;player.legs[1].rotation.x=keys.w||keys.s?-Math.sin(t*10)*.45:0;
    player.root.rotation.y=Math.atan2(enemy.root.position.x-player.root.position.x,enemy.root.position.z-player.root.position.z);
    renderer.render(scene,camera);
  }
  updateBars();animate();
})();