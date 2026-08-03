'use strict';

const APP_VERSION = '2.0.0';
const STORAGE_KEY = 'chroniqueJeanneV2State';
const OLD_STORAGE_KEY = 'chroniqueJeanneState';

const fragments = ['JEANNE','ENTRE','DANS','ORLÉANS','LE','29','AVRIL','1429'];
const items = [
  {icon:'🛡️',name:'Blason de la Messagère',desc:'Reconnaître Jeanne et sa mission.'},
  {icon:'🔴',name:'Sceau de la maison',desc:'Décoder le message confié à Jeanne.'},
  {icon:'🗝️',name:'Clé du passage',desc:'Choisir une route et éviter les patrouilles.'},
  {icon:'🪟',name:'Vitrail de lumière',desc:'Lire l’histoire à travers les images.'},
  {icon:'⚜️',name:'Fleur de mémoire',desc:'Distinguer l’événement de son souvenir.'},
  {icon:'🕯️',name:'Jeton du silence',desc:'Mémoriser les signes du passage.'},
  {icon:'🚩',name:'Bannière d’éclaireur',desc:'Reconnaître les lieux depuis le petit train.'},
  {icon:'🏺',name:'Témoin du passé',desc:'Faire parler les objets du musée.'}
];

const missions = [
  {
    id:'sentinelle',title:'La sentinelle de bronze',place:'Place du Martroi',asset:'assets/m1.svg',fragment:'JEANNE',item:items[0],
    objective:'Prouver que tu sais reconnaître Jeanne d’Arc et reconstituer sa statue.',
    fact:'La statue équestre actuelle de la place du Martroi rappelle la place centrale de Jeanne d’Arc dans la mémoire d’Orléans.',
    short:'Retrouve Jeanne, son cheval, son armure et son épée.',games:['Puzzle de la statue','Équipement de la messagère']
  },
  {
    id:'maison',title:'La maison du secret',place:'Maison de Jeanne d’Arc',asset:'assets/m2.svg',fragment:'ENTRE',item:items[1],
    objective:'Décoder le verbe caché dans un message et vérifier trois faits sur l’arrivée de Jeanne.',
    fact:'La maison actuelle est une reconstitution de la demeure de Jacques Boucher, qui hébergea Jeanne du 29 avril au 9 mai 1429.',
    short:'Observe les pans de bois et réponds : Jeanne est-elle venue aider Orléans ?',games:['Message codé','Vrai ou faux de 1429']
  },
  {
    id:'loire',title:'La route de la Loire',place:'Rue Royale et bords de Loire',asset:'assets/m3.svg',fragment:'DANS',item:items[2],
    objective:'Choisir une route prudente puis guider la messagère dans un mini-labyrinthe.',
    fact:'Pendant un siège, contrôler les routes, les ponts et les approvisionnements est aussi important que combattre.',
    short:'Trouve la Loire et le pont, puis choisis un passage discret.',games:['Choix tactique','Labyrinthe des patrouilles']
  },
  {
    id:'vitrail',title:'Le livre de lumière',place:'Cathédrale Sainte-Croix',asset:'assets/m4.svg',fragment:'ORLÉANS',item:items[3],
    objective:'Reconstituer un vitrail et démasquer un objet impossible en 1429.',
    fact:'Les vitraux racontant Jeanne transmettent sa mémoire comme une suite d’images lumineuses.',
    short:'Repère Jeanne dans un vitrail et trouve l’objet moderne parmi les symboles.',games:['Puzzle du vitrail','L’intrus dans le temps']
  },
  {
    id:'memoire',title:'La mémoire des habitants',place:'Hôtel Groslot',asset:'assets/m5.svg',fragment:'LE',item:items[4],
    objective:'Classer les événements de 1429 et les formes de mémoire créées plus tard.',
    fact:'L’Hôtel Groslot fut construit de 1549 à 1558, bien après le passage de Jeanne à Orléans.',
    short:'Trouve les briques rouges et distingue 1429 de ce qui a été créé plus tard.',games:['Histoire ou mémoire ?','Conseil des habitants']
  },
  {
    id:'silence',title:'Le passage silencieux',place:'Campo Santo',asset:'assets/m6.svg',fragment:'29',item:items[5],
    objective:'Mémoriser une suite de signes puis retrouver le nombre caché dans la date.',
    fact:'Le Campo Santo est un ancien espace funéraire ; ses galeries et ses arches donnent à lire plusieurs siècles d’histoire urbaine.',
    short:'Passe sous une arche, observe trois signes et trouve le nombre entre 28 et 30.',games:['Mémoire des guetteurs','Le nombre caché']
  },
  {
    id:'train',title:'Le train des éclaireurs',place:'Petit train touristique',asset:'assets/m7.svg',fragment:'AVRIL',item:items[6],
    objective:'Reconnaître cinq repères de la ville et réussir le rapport des éclaireurs.',
    fact:'Revoir les monuments depuis un itinéraire continu aide à comprendre leur position dans la ville et leurs liens.',
    short:'Reconnais trois monuments et retrouve le mois situé entre mars et mai.',games:['Bingo des monuments','Rapport des éclaireurs']
  },
  {
    id:'musee',title:'Les témoins du passé',place:'Hôtel Cabu',asset:'assets/m8.svg',fragment:'1429',item:items[7],
    objective:'Associer quatre objets à leur fonction puis assembler la date de l’arrivée de Jeanne.',
    fact:'Un musée conserve des objets anciens et des œuvres plus récentes qui racontent comment l’histoire de Jeanne a été transmise.',
    short:'Choisis un objet témoin et assemble 14 avec 29 pour retrouver 1429.',games:['Memory des objets','La date reconstituée']
  }
];

function defaultState(){return {
  version:APP_VERSION,name:'',helperName:'',hasHelper:false,started:false,
  completed:[],current:0,fragments:[],inventory:[],seals:0,courage:3,
  fatigue:false,sound:true,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
  contrast:'normal',finalDone:false,createdAt:new Date().toISOString(),answers:{},hints:0
};}

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved) return {...defaultState(),...saved,version:APP_VERSION};
    const old=JSON.parse(localStorage.getItem(OLD_STORAGE_KEY)||'null');
    if(old) return {...defaultState(),name:old.name||'',helperName:old.littleName||'',hasHelper:!!old.hasLittle,sound:!!old.speech,contrast:old.contrast||'normal'};
  }catch(e){console.warn('Sauvegarde illisible',e)}
  return defaultState();
}

let state=loadState();
let currentScreen='home';
let activeMission=0;
let activeStage=0;
let deferredInstallPrompt=null;
let runtime={};

const app=document.querySelector('#app');
const bottomNav=document.querySelector('#bottomNav');
const settingsDialog=document.querySelector('#settingsDialog');
const adultDialog=document.querySelector('#adultDialog');
const hud=document.querySelector('#hud');

const q=(s,root=document)=>root.querySelector(s);
const qa=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const shuffle=(a)=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));applySettings();updateHud()}
function applySettings(){
  document.body.classList.toggle('high-contrast',state.contrast==='high');
  document.body.classList.toggle('reduced-motion',state.reducedMotion);
  q('#fatigueToggle').checked=state.fatigue;q('#soundToggle').checked=state.sound;q('#motionToggle').checked=state.reducedMotion;q('#contrastSelect').value=state.contrast;
}
function updateHud(){
  hud.hidden=!state.started;
  q('#courageHud').textContent='❤️'.repeat(Math.max(0,state.courage))+'🤍'.repeat(Math.max(0,3-state.courage));
  q('#sealHud').textContent=`🛡️ ${state.seals}`;
}
function toast(message,type=''){
  const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;q('#toastRegion').append(el);setTimeout(()=>el.remove(),3300)
}
function setScreen(name,opts={}){
  currentScreen=name;runtime={};
  bottomNav.hidden=!state.started || ['home','setup','prologue','reward','certificate'].includes(name);
  qa('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));
  const renderers={home:renderHome,setup:renderSetup,prologue:renderPrologue,map:renderMap,mission:()=>renderMission(opts.index??activeMission),inventory:renderInventory,chronicle:renderChronicle,final:renderFinal,certificate:renderCertificate,help:renderHelp,sources:renderSources};
  (renderers[name]||renderHome)();
  requestAnimationFrame(()=>{app.focus({preventScroll:true});scrollTo({top:0,behavior:state.reducedMotion?'auto':'smooth'})});
}
function speak(text){
  if(!state.sound||!('speechSynthesis'in window))return;
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.92;speechSynthesis.speak(u)
}
function tone(freq=440,duration=.12,type='sine'){
  if(!state.sound)return;
  try{const A=window.AudioContext||window.webkitAudioContext;const ctx=new A();const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.08,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration);o.onended=()=>ctx.close()}catch{}
}
function success(message='Bravo !'){tone(660,.15);setTimeout(()=>tone(880,.18),100);toast(message,'good')}
function mistake(message='Essaie encore.'){
  state.courage=Math.max(0,state.courage-1);
  if(state.courage===0){state.courage=3;toast('Jeanne t’encourage : ton courage est restauré !','good')}else toast(message,'bad');
  tone(170,.18,'sawtooth');save()
}
function confetti(){
  if(state.reducedMotion)return;
  const wrap=document.createElement('div');wrap.className='confetti';
  const colors=['#d7aa43','#a93645','#24558f','#2d7a50','#f2ce68'];
  for(let i=0;i<36;i++){const p=document.createElement('i');p.style.left=`${Math.random()*100}%`;p.style.setProperty('--c',colors[i%colors.length]);p.style.setProperty('--d',`${1.5+Math.random()*1.6}s`);p.style.setProperty('--x',`${-70+Math.random()*140}px`);p.style.setProperty('--r',`${Math.random()*180}deg`);p.style.animationDelay=`${Math.random()*.5}s`;wrap.append(p)}
  document.body.append(wrap);setTimeout(()=>wrap.remove(),3500)
}
function restoreCourage(){state.courage=3;save();toast('Le courage est au maximum.','good')}
function nextUnlocked(){for(let i=0;i<missions.length;i++)if(!state.completed.includes(i))return i;return missions.length-1}
function missionAccessible(i){return i===0||state.completed.includes(i)||state.completed.includes(i-1)}

function renderHome(){
  app.innerHTML=`<section class="hero">
    <img class="hero-visual" src="assets/hero.svg" alt="Illustration stylisée de Jeanne d’Arc à cheval devant Orléans">
    <div class="hero-body stack">
      <span class="badge">Nouvelle version ludique</span>
      <h1>La chronique perdue de Jeanne d’Arc</h1>
      <p class="lead">Une aventure historique en huit missions : puzzles, message codé, labyrinthe, memory, bingo et énigmes dans les rues d’Orléans.</p>
      ${state.started?`<button id="continueBtn" class="primary">Continuer l’aventure de ${esc(state.name)}</button><button id="newBtn" class="secondary">Recommencer depuis le début</button>`:`<button id="startBtn" class="primary">Commencer l’aventure</button>`}
      <p class="fine">Aucune inscription, aucun GPS obligatoire et aucun accessoire. La progression reste sur cet appareil.</p>
    </div></section>`;
  q('#startBtn')?.addEventListener('click',()=>setScreen('setup'));
  q('#continueBtn')?.addEventListener('click',()=>setScreen(state.finalDone?'certificate':'map'));
  q('#newBtn')?.addEventListener('click',()=>{if(confirm('Effacer la progression et recommencer ?')){state=defaultState();save();setScreen('setup')}})
}

function renderSetup(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Préparation</div><h1>Qui devient la Messagère ?</h1>
    <form id="setupForm" class="setup-form">
      <label>Prénom de la joueuse principale<input id="playerName" type="text" maxlength="24" autocomplete="given-name" value="${esc(state.name)}" required placeholder="Prénom"></label>
      <label class="helper-row"><input id="helperToggle" type="checkbox" ${state.hasHelper?'checked':''}><span>Une petite sœur ou un jeune allié participe</span></label>
      <label id="helperLabel" ${state.hasHelper?'':'hidden'}>Prénom du jeune allié<input id="helperName" type="text" maxlength="24" value="${esc(state.helperName)}" placeholder="Prénom"></label>
      <div class="story-box"><strong>Conseil :</strong> un adulte tient le téléphone. L’enfant observe le lieu, puis joue. Les mini-jeux durent environ une à trois minutes.</div>
      <button class="primary" type="submit">Recevoir la mission</button>
    </form></section>`;
  q('#helperToggle').addEventListener('change',e=>q('#helperLabel').hidden=!e.target.checked);
  q('#setupForm').addEventListener('submit',e=>{e.preventDefault();const name=q('#playerName').value.trim();if(!name)return;state.name=name;state.hasHelper=q('#helperToggle').checked;state.helperName=q('#helperName').value.trim();save();setScreen('prologue')})
}

function renderPrologue(){
  app.innerHTML=`<section class="card stack center"><img class="mission-visual" src="assets/hero.svg" alt="Jeanne à cheval devant la ville"><div class="eyebrow">Message urgent · Avril 1429</div><h1>Le vent a déchiré la chronique</h1>
  <div class="story-box" id="prologueText"><p>Bonjour, <strong>${esc(state.name)}</strong>. Je suis Guillaume, gardien des archives d’Orléans.</p><p>Huit fragments racontant l’arrivée de Jeanne d’Arc ont été dispersés. Pour les retrouver, tu devras résoudre des énigmes et réussir les épreuves laissées dans la ville.</p><p>Chaque victoire te donnera un objet, un sceau et un mot de la chronique.</p></div>
  <button id="acceptBtn" class="primary">J’accepte la mission</button></section>`;
  speak(`Bonjour ${state.name}. Huit fragments racontant l'arrivée de Jeanne d'Arc ont été dispersés. Acceptes-tu la mission ?`);
  q('#acceptBtn').addEventListener('click',()=>{state.started=true;save();confetti();setScreen('map')})
}

function renderMap(){
  const done=state.completed.length;const current=nextUnlocked();
  app.innerHTML=`<section class="card"><div class="map-head"><div><div class="eyebrow">Carte de mission</div><h1>Orléans, 1429</h1></div><span class="badge blue">${done}/8 réussies</span></div>
  <div class="progress-shell" aria-label="${done} missions sur 8"><div class="progress-bar" style="width:${done/8*100}%"></div></div>
  <p class="muted">Les étapes suivent votre programme de visite. Une mission terminée ouvre la suivante.</p></section>
  <section class="map-grid">${missions.map((m,i)=>{const completed=state.completed.includes(i),locked=!missionAccessible(i);return `<article class="mission-card ${completed?'completed':''} ${locked?'locked':''}"><img src="${m.asset}" alt=""><div><h3>${i+1}. ${m.title}</h3><p>${m.place}</p><p>${m.games.join(' · ')}</p></div><div class="state">${completed?'✅':locked?'🔒':`<button class="secondary compact open-mission" data-index="${i}">${i===current?'Jouer':'Revoir'}</button>`}</div></article>`}).join('')}</section>
  ${done===8?`<section class="card center"><h2>Les huit fragments sont retrouvés</h2><button id="goFinal" class="primary">Reconstituer la chronique</button></section>`:''}`;
  qa('.open-mission').forEach(b=>b.addEventListener('click',()=>{activeMission=Number(b.dataset.index);activeStage=0;setScreen('mission',{index:activeMission})}));
  q('#goFinal')?.addEventListener('click',()=>setScreen('final'))
}

function missionShell(i,body,stageLabel=''){const m=missions[i];return `<section class="card stack"><img class="mission-visual" src="${m.asset}" alt="Illustration de ${esc(m.title)}"><div class="mission-title"><div class="mission-number">${i+1}</div><div><div class="eyebrow">Mission ${i+1} sur 8 · ${esc(m.place)}</div><h1>${esc(m.title)}</h1>${stageLabel?`<p class="badge blue">${stageLabel}</p>`:''}</div></div>${body}</section>`}

function renderMission(i){
  activeMission=i;const m=missions[i];
  if(state.completed.includes(i)){
    app.innerHTML=missionShell(i,`<div class="story-box"><strong>Mission déjà réussie.</strong><br>Fragment : ${m.fragment} · Objet : ${m.item.icon} ${m.item.name}</div><p>${m.fact}</p><div class="button-row"><button id="replayBtn" class="secondary">Rejouer les mini-jeux</button><button id="mapBtn" class="primary">Retour au parcours</button></div>`);
    q('#replayBtn').addEventListener('click',()=>{activeStage=0;renderMissionStage(i,0,true)});q('#mapBtn').addEventListener('click',()=>setScreen('map'));return;
  }
  if(state.fatigue){renderShortMission(i);return}
  app.innerHTML=missionShell(i,`<div class="story-box"><strong>Objectif :</strong> ${m.objective}</div><div class="fact-box"><div class="fact-icon">📚</div><div><strong>Repère historique</strong><br>${m.fact}</div></div><div class="game-status"><span>Épreuves : ${m.games.length}</span><span>Récompense : ${m.item.icon}</span></div><button id="beginMission" class="primary">Commencer les épreuves</button>`);
  speak(m.objective);q('#beginMission').addEventListener('click',()=>{activeStage=0;renderMissionStage(i,0,false)})
}
function renderShortMission(i){const m=missions[i];app.innerHTML=missionShell(i,`<span class="badge">Mode mission courte</span><div class="story-box">${m.short}</div><button id="shortDone" class="primary">Mission accomplie</button><button id="fullMode" class="secondary">Faire les mini-jeux complets</button>`);q('#shortDone').addEventListener('click',()=>completeMission(i));q('#fullMode').addEventListener('click',()=>{state.fatigue=false;save();renderMission(i)})}
function renderMissionStage(i,stage,replay=false){activeStage=stage;const handlers=[missionOne,missionTwo,missionThree,missionFour,missionFive,missionSix,missionSeven,missionEight];handlers[i](stage,replay)}
function nextStage(i,stage,total,replay=false){if(stage+1>=total){if(replay){success('Entraînement terminé !');renderMission(i)}else completeMission(i)}else renderMissionStage(i,stage+1,replay)}

function completeMission(i){
  const first=!state.completed.includes(i);if(first){state.completed.push(i);state.completed.sort((a,b)=>a-b);state.fragments.push(missions[i].fragment);state.inventory.push(i);state.seals+=1}
  state.current=nextUnlocked();state.courage=3;save();
  const m=missions[i];app.innerHTML=`<section class="reward"><div class="seal-burst" id="sparkWrap"></div><div><div class="reward-icon">${m.item.icon}</div><div class="eyebrow">Mission réussie · Sceau ${state.seals}</div><h1>${m.item.name}</h1><p>${m.item.desc}</p><div class="fragment">${m.fragment}</div><p>Le fragment rejoint la chronique.</p><button id="rewardNext" class="primary">${state.completed.length===8?'Ouvrir la chronique complète':'Voir la suite du parcours'}</button></div></section>`;
  sparkles();confetti();speak(`Mission réussie. Fragment retrouvé : ${m.fragment}`);q('#rewardNext').addEventListener('click',()=>setScreen(state.completed.length===8?'final':'map'))
}
function sparkles(){const w=q('#sparkWrap');if(!w||state.reducedMotion)return;for(let i=0;i<18;i++){const s=document.createElement('span');s.className='spark';s.textContent=i%2?'✦':'★';s.style.left='50%';s.style.top='48%';s.style.setProperty('--x',`${-230+Math.random()*460}px`);s.style.setProperty('--y',`${-220+Math.random()*420}px`);s.style.animationDelay=`${Math.random()*.25}s`;w.append(s)}}

function renderSwapPuzzle({i,stage,replay,asset,title,instructions,total=2}){
  let order=shuffle([0,1,2,3,4,5]);if(order.every((x,k)=>x===k))order=[1,0,2,3,4,5];let selected=null;let moves=0;
  const render=()=>{
    app.innerHTML=missionShell(i,`<div class="game-panel"><h2>${title}</h2><p class="game-instructions">${instructions}</p><div class="game-status"><span>Mouvements : <strong>${moves}</strong></span><span id="puzzleState">Choisis deux pièces à échanger</span></div><div class="puzzle-grid">${order.map((tile,pos)=>`<button class="puzzle-tile ${selected===pos?'selected':''}" data-pos="${pos}" aria-label="Pièce ${tile+1}, position ${pos+1}" style="background-image:url('${asset}');background-position:${(tile%3)*50}% ${Math.floor(tile/3)*100}%"></button>`).join('')}</div><button id="puzzleHint" class="secondary">Voir l’image complète 3 secondes</button></div>`,'Micro-jeu 1 sur 2');
    qa('.puzzle-tile').forEach(b=>b.addEventListener('click',()=>{const pos=Number(b.dataset.pos);if(selected===null){selected=pos;tone(390,.08);render()}else if(selected===pos){selected=null;render()}else{[order[selected],order[pos]]=[order[pos],order[selected]];selected=null;moves++;tone(520,.08);if(order.every((x,k)=>x===k)){render();qa('.puzzle-tile').forEach(x=>x.classList.add('solved'));success('Image reconstituée !');setTimeout(()=>nextStage(i,stage,total,replay),800)}else render()}}));
    q('#puzzleHint').addEventListener('click',()=>{state.hints++;save();const grid=q('.puzzle-grid');const old=grid.innerHTML;grid.innerHTML=`<img src="${asset}" alt="Image modèle" style="width:100%;height:100%;object-fit:cover">`;setTimeout(()=>{grid.innerHTML=old;render()},3000)})
  };render()
}

function missionOne(stage,replay){
  if(stage===0)return renderSwapPuzzle({i:0,stage,replay,asset:'assets/m1.svg',title:'Puzzle de la sentinelle',instructions:'La statue a été brouillée. Touche deux pièces pour les échanger et reconstitue Jeanne à cheval.'});
  const correct=new Set(['armure','epee']);const chosen=new Set();
  const render=()=>{app.innerHTML=missionShell(0,`<div class="game-panel"><h2>Équipe la Messagère</h2><p>Choisis les <strong>deux éléments</strong> qui montrent que la statue représente Jeanne comme une combattante.</p><div class="icon-grid"><button class="icon-choice ${chosen.has('armure')?'correct':''}" data-v="armure"><span>🛡️</span>Armure</button><button class="icon-choice ${chosen.has('epee')?'correct':''}" data-v="epee"><span>⚔️</span>Épée</button><button class="icon-choice ${chosen.has('couronne')?'wrong':''}" data-v="couronne"><span>👑</span>Couronne royale</button><button class="icon-choice ${chosen.has('parapluie')?'wrong':''}" data-v="parapluie"><span>☂️</span>Parapluie</button><button class="icon-choice ${chosen.has('palmes')?'wrong':''}" data-v="palmes"><span>🩴</span>Palmes</button><button class="icon-choice ${chosen.has('telephone')?'wrong':''}" data-v="telephone"><span>📱</span>Téléphone</button></div><button id="gearCheck" class="primary">Valider mon équipement</button></div>`,'Micro-jeu 2 sur 2');qa('[data-v]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.v;if(chosen.has(v))chosen.delete(v);else chosen.add(v);tone(440,.08);render()}));q('#gearCheck').addEventListener('click',()=>{if(chosen.size===2&&[...correct].every(x=>chosen.has(x))){success('Armure et épée : mission comprise !');setTimeout(()=>nextStage(0,stage,2,replay),500)}else mistake('Deux choix seulement : regarde la statue et recommence.')})};render()
}

function missionTwo(stage,replay){
  if(stage===0){
    const mapping=[['🛡️','A'],['🐎','I'],['🏰','D'],['⚔️','E'],['📜','R']];const target='AIDER'.split('');let entered=[];
    const render=()=>{app.innerHTML=missionShell(1,`<div class="game-panel"><h2>Le message codé</h2><p>Chaque symbole remplace une lettre. Décode le verbe qui explique la mission de Jeanne.</p><div class="legend-grid">${mapping.map(([s,l])=>`<div class="legend-item"><span>${s}</span><strong>${l}</strong></div>`).join('')}</div><div class="cipher-sequence">${mapping.map(([s])=>`<div class="cipher-symbol">${s}</div>`).join('')}</div><div class="letter-slots">${target.map((l,k)=>`<div class="letter-slot">${entered[k]||''}</div>`).join('')}</div><div class="letter-bank">${shuffle(['D','A','R','I','E']).map(l=>`<button class="token" data-letter="${l}">${l}</button>`).join('')}</div><p class="center muted">Mot à découvrir : _ _ _ _ _</p></div>`,'Micro-jeu 1 sur 2');qa('[data-letter]').forEach(b=>b.addEventListener('click',()=>{const expected=target[entered.length],l=b.dataset.letter;if(l===expected){entered.push(l);tone(520+entered.length*45,.09);if(entered.length===target.length){render();success('AIDER : c’est bien la mission de Jeanne !');setTimeout(()=>nextStage(1,stage,2,replay),700)}else render()}else mistake(`La prochaine lettre n’est pas ${l}. Utilise la légende.`)}))};render();return
  }
  const statements=[
    {t:'Jeanne entre dans Orléans le 29 avril 1429.',v:true,why:'Cette date ouvre le séjour orléanais de Jeanne.'},
    {t:'La maison visible aujourd’hui est exactement intacte depuis 1429.',v:false,why:'Elle est une reconstitution : la demeure ancienne fut détruite en 1940.'},
    {t:'Jeanne est venue aider une ville assiégée.',v:true,why:'Son arrivée s’inscrit dans le siège d’Orléans.'}
  ];let done=Array(3).fill(false);
  const render=()=>{app.innerHTML=missionShell(1,`<div class="game-panel"><h2>Vrai ou faux de 1429</h2><p>Réponds aux trois affirmations. Une explication apparaît après chaque bonne réponse.</p>${statements.map((s,k)=>`<article class="truth-card"><strong>${s.t}</strong>${done[k]?`<p class="muted">${s.why}</p><span class="badge green">Réussi</span>`:`<div class="truth-actions"><button data-tf="${k}:true" class="secondary">Vrai</button><button data-tf="${k}:false" class="secondary">Faux</button></div>`}</article>`).join('')}${done.every(Boolean)?`<button id="tfNext" class="primary">Recevoir le fragment</button>`:''}</div>`,'Micro-jeu 2 sur 2');qa('[data-tf]').forEach(b=>b.addEventListener('click',()=>{const [kStr,valStr]=b.dataset.tf.split(':');const k=Number(kStr),val=valStr==='true';if(val===statements[k].v){done[k]=true;success('Bonne réponse');render()}else mistake('Ce n’est pas exact. Relis la phrase et réessaie.')}));q('#tfNext')?.addEventListener('click',()=>nextStage(1,stage,2,replay))};render()
}

function missionThree(stage,replay){
  if(stage===0){
    const routes=[
      {icon:'🌉',name:'Le pont en plein jour',risk:'Élevé',riskClass:'high',time:'Rapide',ok:false,text:'Le passage est direct, mais une patrouille pourrait voir la messagère.'},
      {icon:'🛶',name:'Une barque avec un guide',risk:'Modéré',riskClass:'medium',time:'Moyen',ok:true,text:'Un guide connaît le courant et peut choisir un passage discret.'},
      {icon:'🌙',name:'Attendre toute la nuit',risk:'Faible',riskClass:'low',time:'Très lent',ok:false,text:'Le message risque d’arriver trop tard.'}
    ];
    app.innerHTML=missionShell(2,`<div class="game-panel"><h2>Choix tactique</h2><p>Le pont est surveillé, le courant est fort et le message est urgent. Choisis le meilleur compromis entre discrétion, sécurité et rapidité.</p><div class="route-grid">${routes.map((r,k)=>`<button class="route-card" data-route="${k}"><span class="route-icon">${r.icon}</span><span><strong>${r.name}</strong><span class="route-meta"><span class="risk ${r.riskClass}">Risque : ${r.risk}</span><span class="risk">Temps : ${r.time}</span></span><small>${r.text}</small></span></button>`).join('')}</div></div>`,'Micro-jeu 1 sur 2');qa('[data-route]').forEach(b=>b.addEventListener('click',()=>{const r=routes[Number(b.dataset.route)];if(r.ok){success('Bon compromis tactique !');setTimeout(()=>nextStage(2,stage,2,replay),650)}else mistake('Cette solution a un défaut important. Compare risque et temps.')}));return
  }
  const grid=[
    ['S','.','#','.','.'],['#','.','#','P','.'],['.','.','.','.','#'],['.','#','P','.','.'],['.','.','.','#','E']
  ];let pos={r:0,c:0};
  const render=()=>{app.innerHTML=missionShell(2,`<div class="game-panel"><h2>Labyrinthe des patrouilles</h2><p>Guide la messagère 🐎 jusqu’à la porte verte 🏰. Les murs bloquent le passage. Une patrouille te renvoie au départ.</p><div class="maze-wrap"><div class="maze">${grid.flatMap((row,r)=>row.map((cell,c)=>`<div class="cell ${cell==='#'?'wall':''} ${cell==='P'?'patrol':''} ${cell==='E'?'exit':''} ${pos.r===r&&pos.c===c?'player':''}">${pos.r===r&&pos.c===c?'🐎':cell==='P'?'👁️':cell==='E'?'🏰':''}</div>`)).join('')}</div></div><div class="dpad"><button class="up" data-move="-1,0" aria-label="Monter">↑</button><button class="left" data-move="0,-1" aria-label="Gauche">←</button><button class="down" data-move="1,0" aria-label="Descendre">↓</button><button class="right" data-move="0,1" aria-label="Droite">→</button></div></div>`,'Micro-jeu 2 sur 2');qa('[data-move]').forEach(b=>b.addEventListener('click',()=>{const [dr,dc]=b.dataset.move.split(',').map(Number);const nr=pos.r+dr,nc=pos.c+dc;if(nr<0||nr>=5||nc<0||nc>=5||grid[nr][nc]==='#'){tone(150,.1);toast('Un mur bloque le passage.');return}if(grid[nr][nc]==='P'){pos={r:0,c:0};mistake('Patrouille repérée ! Retour discret au départ.');render();return}pos={r:nr,c:nc};tone(400,.06);if(grid[nr][nc]==='E'){render();success('Le message a franchi la porte !');setTimeout(()=>nextStage(2,stage,2,replay),650)}else render()}))};render()
}

function missionFour(stage,replay){
  if(stage===0)return renderSwapPuzzle({i:3,stage,replay,asset:'assets/m4.svg',title:'Puzzle du vitrail',instructions:'Échange les six pièces pour reformer le vitrail. Observe les couleurs et les lignes qui se prolongent.'});
  const options=[['⚔️','Épée',false],['🛡️','Bouclier',false],['🏹','Arbalète',false],['🚩','Bannière',false],['🏮','Lanterne',false],['📱','Téléphone',true]];
  app.innerHTML=missionShell(3,`<div class="game-panel"><h2>L’intrus dans le temps</h2><p>Un objet venu du futur s’est glissé parmi les objets pouvant appartenir au monde de 1429. Trouve-le.</p><div class="icon-grid">${options.map(([ic,n],k)=>`<button class="icon-choice" data-intruder="${k}"><span>${ic}</span>${n}</button>`).join('')}</div></div>`,'Micro-jeu 2 sur 2');qa('[data-intruder]').forEach(b=>b.addEventListener('click',()=>{const o=options[Number(b.dataset.intruder)];if(o[2]){b.classList.add('correct');success('Exact : le téléphone est anachronique !');setTimeout(()=>nextStage(3,stage,2,replay),650)}else{b.classList.add('wrong');mistake('Cet objet pouvait exister sous une forme médiévale. Cherche encore.')}}))
}

function missionFive(stage,replay){
  if(stage===0){
    const cards=[
      {text:'Siège d’Orléans, 1428-1429',cat:'event'},
      {text:'Entrée de Jeanne, 29 avril 1429',cat:'event'},
      {text:'Levée du siège, 8 mai 1429',cat:'event'},
      {text:'Hôtel Groslot, construit au XVIe siècle',cat:'memory'},
      {text:'Statue actuelle de la place du Martroi',cat:'memory'},
      {text:'Vitraux actuels racontant Jeanne',cat:'memory'}
    ];let left=shuffle(cards.map((_,i)=>i));let selected=null;let placed={event:[],memory:[]};
    const render=()=>{app.innerHTML=missionShell(4,`<div class="game-panel"><h2>Histoire ou mémoire ?</h2><p>Choisis une carte, puis sa bonne colonne : événement vécu en 1429 ou souvenir créé après.</p><div class="sort-deck">${left.map(idx=>`<button class="sort-card ${selected===idx?'selected':''}" data-card="${idx}">${cards[idx].text}</button>`).join('')||'<p class="center badge green">Toutes les cartes sont classées</p>'}</div><div class="sort-area"><button class="sort-zone" data-zone="event"><h3>⚔️ ÉVÉNEMENTS DE 1429</h3>${placed.event.map(idx=>`<div class="placed-card">${cards[idx].text}</div>`).join('')}</button><button class="sort-zone" data-zone="memory"><h3>🏛️ MÉMOIRE POSTÉRIEURE</h3>${placed.memory.map(idx=>`<div class="placed-card">${cards[idx].text}</div>`).join('')}</button></div></div>`,'Micro-jeu 1 sur 2');qa('[data-card]').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.card);tone(430,.06);render()}));qa('[data-zone]').forEach(z=>z.addEventListener('click',()=>{if(selected===null){toast('Choisis d’abord une carte.');return}const zone=z.dataset.zone;if(cards[selected].cat===zone){placed[zone].push(selected);left=left.filter(x=>x!==selected);selected=null;success('Bien classé !');if(left.length===0)setTimeout(()=>nextStage(4,stage,2,replay),700);else render()}else mistake('Regarde la date : est-ce 1429 ou plusieurs siècles après ?')}))};render();return
  }
  const choices=[['🗿','Une statue'],['🎉','Une fête annuelle'],['🏛️','Un musée'],['🪟','Des vitraux'],['📖','Un livre'],['✨','Tous ces moyens']];
  app.innerHTML=missionShell(4,`<div class="game-panel"><h2>Conseil des habitants</h2><p>Plusieurs siècles après Jeanne, comment transmettre son histoire aux enfants ? Choisis la réponse la plus complète.</p><div class="icon-grid">${choices.map(([ic,t],k)=>`<button class="icon-choice" data-memory="${k}"><span>${ic}</span>${t}</button>`).join('')}</div></div>`,'Micro-jeu 2 sur 2');qa('[data-memory]').forEach(b=>b.addEventListener('click',()=>{if(Number(b.dataset.memory)===5){success('Exact : la mémoire utilise plusieurs formes !');setTimeout(()=>nextStage(4,stage,2,replay),650)}else mistake('C’est une bonne idée, mais Orléans en utilise plusieurs à la fois.')}))
}

function missionSix(stage,replay){
  if(stage===0){
    const symbols=['🏛️','🕯️','👣','🪨'];const sequence=[0,2,1,3];let input=[];let playing=false;
    const render=()=>{app.innerHTML=missionShell(5,`<div class="game-panel"><h2>Mémoire des guetteurs</h2><p>Mémorise l’ordre des quatre signes, puis reproduis-le. Tu peux revoir la séquence.</p><div class="sequence-stage">${symbols.map((s,k)=>`<div class="sigil" data-sigil-display="${k}">${s}</div>`).join('')}</div><div class="sequence-buttons">${symbols.map((s,k)=>`<button data-sigil="${k}" aria-label="Choisir ${s}">${s}</button>`).join('')}</div><div class="game-status"><span>Réponse : ${input.map(k=>symbols[k]).join(' ')||'—'}</span><button id="playSequence" class="secondary compact">Voir la séquence</button></div></div>`,'Micro-jeu 1 sur 2');q('#playSequence').addEventListener('click',play);qa('[data-sigil]').forEach(b=>b.addEventListener('click',()=>{if(playing)return;input.push(Number(b.dataset.sigil));tone(350+Number(b.dataset.sigil)*90,.08);if(input.length===sequence.length){if(input.every((v,k)=>v===sequence[k])){success('Ordre mémorisé !');setTimeout(()=>nextStage(5,stage,2,replay),650)}else{input=[];mistake('La suite n’est pas exacte. Regarde-la encore.');render()}}else render()}))};
    const play=()=>{if(playing)return;playing=true;input=[];const buttons=qa('[data-sigil]');buttons.forEach(b=>b.disabled=true);sequence.forEach((v,k)=>setTimeout(()=>{const el=q(`[data-sigil-display="${v}"]`);el?.classList.add('flash');tone(360+v*90,.16);setTimeout(()=>el?.classList.remove('flash'),420);if(k===sequence.length-1)setTimeout(()=>{playing=false;buttons.forEach(b=>b.disabled=false)},600)},k*650))};render();setTimeout(play,400);return
  }
  app.innerHTML=missionShell(5,`<div class="game-panel"><h2>Le nombre caché</h2><p>Je suis plus grand que 28 et plus petit que 30. Quel nombre suis-je ?</p><div class="choice-grid"><button class="choice" data-number="28">28</button><button class="choice" data-number="29">29</button><button class="choice" data-number="30">30</button></div></div>`,'Micro-jeu 2 sur 2');qa('[data-number]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.number==='29'){b.classList.add('correct');success('29 : le jour de l’arrivée de Jeanne !');setTimeout(()=>nextStage(5,stage,2,replay),650)}else{b.classList.add('wrong');mistake('Ce nombre n’est pas entre 28 et 30.')}}))
}

function missionSeven(stage,replay){
  if(stage===0){
    const spots=[['🐎','Statue de Jeanne'],['🏠','Maison de Jeanne'],['🌊','Loire'],['🌉','Pont'],['⛪','Cathédrale'],['🏛️','Hôtel Groslot'],['🗼','Tour ou clocher'],['🏘️','Rue ancienne']];let found=new Set();
    const render=()=>{app.innerHTML=missionShell(6,`<div class="game-panel"><h2>Bingo des monuments</h2><p>Regarde surtout la ville. Touche une case seulement lorsque tu reconnais réellement le lieu. Cinq cases suffisent.</p><div class="bingo-grid">${spots.map(([ic,n],k)=>`<button class="bingo-card ${found.has(k)?'found':''}" data-bingo="${k}"><span>${ic}</span>${n}${found.has(k)?'<br>✓':''}</button>`).join('')}</div><div class="game-status"><span>Repères trouvés : <strong>${found.size}/5</strong></span><span>${found.size>=5?'Mission prête !':'Observe dehors'}</span></div>${found.size>=5?'<button id="bingoNext" class="primary">Envoyer le rapport</button>':''}</div>`,'Micro-jeu 1 sur 2');qa('[data-bingo]').forEach(b=>b.addEventListener('click',()=>{const k=Number(b.dataset.bingo);found.has(k)?found.delete(k):found.add(k);tone(500,.07);render()}));q('#bingoNext')?.addEventListener('click',()=>nextStage(6,stage,2,replay))};render();return
  }
  const questions=[
    {q:'Quel lieu rappelle la demeure où Jeanne fut accueillie ?',a:['La Maison de Jeanne d’Arc','Le petit train','Le Campo Santo'],ok:0},
    {q:'Quel bâtiment a été construit au XVIe siècle, après Jeanne ?',a:['La Loire','L’Hôtel Groslot','La statue vivante'],ok:1},
    {q:'Quel mois vient après mars et avant mai ?',a:['Avril','Août','Octobre'],ok:0}
  ];let qi=0;
  const render=()=>{const x=questions[qi];app.innerHTML=missionShell(6,`<div class="game-panel"><h2>Rapport des éclaireurs</h2><div class="game-status"><span>Question ${qi+1}/3</span><span>Observe et souviens-toi</span></div><p><strong>${x.q}</strong></p><div class="choice-grid">${x.a.map((a,k)=>`<button class="choice" data-quiz="${k}">${a}</button>`).join('')}</div></div>`,'Micro-jeu 2 sur 2');qa('[data-quiz]').forEach(b=>b.addEventListener('click',()=>{if(Number(b.dataset.quiz)===x.ok){success('Rapport exact !');qi++;if(qi===questions.length)setTimeout(()=>nextStage(6,stage,2,replay),650);else setTimeout(render,450)}else mistake('Ce n’est pas le bon repère. Souviens-toi du parcours.')}))};render()
}

function missionEight(stage,replay){
  if(stage===0){
    const cards=[
      {pair:'armor',face:'🛡️',text:'Armure'},{pair:'armor',face:'🧍',text:'Protéger le corps'},
      {pair:'seal',face:'🔴',text:'Sceau'},{pair:'seal',face:'📜',text:'Authentifier un message'},
      {pair:'boat',face:'⛵',text:'Bateau'},{pair:'boat',face:'📦',text:'Transporter sur la Loire'},
      {pair:'glass',face:'🪟',text:'Vitrail'},{pair:'glass',face:'📖',text:'Raconter en images'}
    ];let order=shuffle(cards.map((_,i)=>i)),revealed=[],matched=new Set(),locked=false;
    const render=()=>{app.innerHTML=missionShell(7,`<div class="game-panel"><h2>Memory des objets</h2><p>Associe chaque objet à sa fonction. Les deux cartes d’une paire ne sont pas identiques : il faut comprendre leur lien.</p><div class="memory-grid">${order.map((idx,pos)=>{const c=cards[idx],show=revealed.includes(pos)||matched.has(c.pair);return `<button class="memory-card ${show?'revealed':''} ${matched.has(c.pair)?'matched':''}" data-memory-pos="${pos}" ${matched.has(c.pair)?'disabled':''}><span class="front">✦</span><span class="back"><strong>${c.face}</strong><br>${c.text}</span></button>`}).join('')}</div><div class="game-status"><span>Paires : ${matched.size}/4</span><span>${locked?'Observe les deux cartes…':'Choisis une carte'}</span></div></div>`,'Micro-jeu 1 sur 2');qa('[data-memory-pos]').forEach(b=>b.addEventListener('click',()=>{if(locked)return;const pos=Number(b.dataset.memoryPos);if(revealed.includes(pos))return;revealed.push(pos);tone(450,.08);render();if(revealed.length===2){locked=true;const [a,bp]=revealed.map(p=>cards[order[p]]);if(a.pair===bp.pair){setTimeout(()=>{matched.add(a.pair);revealed=[];locked=false;success('Paire trouvée !');if(matched.size===4)setTimeout(()=>nextStage(7,stage,2,replay),700);else render()},650)}else setTimeout(()=>{revealed=[];locked=false;mistake('Ces cartes ne forment pas la même paire.');render()},900)}}))};render();return
  }
  const correct=['29','AVRIL','1429'];const bank=shuffle(['1429','MAI','29','1431','AVRIL','8']);let selected=[];
  const render=()=>{app.innerHTML=missionShell(7,`<div class="game-panel"><h2>La date reconstituée</h2><p>Choisis trois éléments pour former la date de l’entrée de Jeanne dans Orléans : le jour, le mois et l’année.</p><div class="date-slots">${[0,1,2].map(k=>`<div class="letter-slot" style="width:auto;min-width:76px">${selected[k]||'?'}</div>`).join('')}</div><div class="letter-bank">${bank.map((x,k)=>`<button class="token ${selected.includes(x)?'used':''}" data-date-token="${x}">${x}</button>`).join('')}</div><button id="dateCheck" class="primary">Vérifier la date</button><button id="dateReset" class="secondary">Effacer</button></div>`,'Micro-jeu 2 sur 2');qa('[data-date-token]').forEach(b=>b.addEventListener('click',()=>{if(selected.length<3&&!selected.includes(b.dataset.dateToken)){selected.push(b.dataset.dateToken);tone(470,.06);render()}}));q('#dateReset').addEventListener('click',()=>{selected=[];render()});q('#dateCheck').addEventListener('click',()=>{if(selected.join('|')===correct.join('|')){success('29 avril 1429 : la date est complète !');setTimeout(()=>nextStage(7,stage,2,replay),700)}else{selected=[];mistake('La date doit être : jour, mois, année. Écarte les événements du 8 mai et de 1431.');render()}})};render()
}

function renderInventory(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Inventaire numérique</div><h1>Objets de la Messagère</h1><p>Chaque objet rappelle la compétence exercée pendant une mission.</p><div class="inventory-grid">${items.map((it,i)=>`<article class="inventory-item ${state.inventory.includes(i)?'':'locked'}"><div class="item-icon">${state.inventory.includes(i)?it.icon:'🔒'}</div><h3>${state.inventory.includes(i)?it.name:'Objet verrouillé'}</h3><p class="small muted">${state.inventory.includes(i)?it.desc:`Mission ${i+1} à accomplir`}</p></article>`).join('')}</div></section>`
}
function renderChronicle(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Coffre de la chronique</div><h1>Fragments retrouvés</h1><div class="fragments">${fragments.map((f,i)=>`<div class="fragment ${state.completed.includes(i)?'':'locked'}" style="--tilt:${i%2?'1deg':'-1deg'}">${state.completed.includes(i)?f:'?'}</div>`).join('')}</div><p class="center">${state.completed.length}/8 fragments réunis</p>${state.completed.length===8?'<button id="chronicleFinal" class="primary">Assembler la chronique</button>':'<button id="chronicleMap" class="secondary">Retour aux missions</button>'}</section>`;
  q('#chronicleFinal')?.addEventListener('click',()=>setScreen('final'));q('#chronicleMap')?.addEventListener('click',()=>setScreen('map'))
}
function renderFinal(){
  if(state.completed.length<8){toast('Les huit fragments ne sont pas encore réunis.');setScreen('map');return}
  let order=shuffle(fragments),selected=[];
  const render=()=>{app.innerHTML=`<section class="card stack"><div class="eyebrow">Épreuve finale</div><h1>Répare le parchemin</h1><p>Touche les fragments dans l’ordre pour reconstituer la phrase historique.</p><div class="chronicle-target">${selected.map(f=>`<span class="fragment">${f}</span>`).join('')||'<span class="muted">La phrase apparaîtra ici…</span>'}</div><div class="fragments">${order.map(f=>`<button class="fragment fragment-button ${selected.includes(f)?'selected':''}" data-final="${f}">${f}</button>`).join('')}</div><div class="button-row"><button id="finalHint" class="secondary">Indice</button><button id="finalReset" class="secondary">Recommencer</button></div><button id="finalCheck" class="primary">Sceller la chronique</button></section>`;
    qa('[data-final]').forEach(b=>b.addEventListener('click',()=>{if(!selected.includes(b.dataset.final)){selected.push(b.dataset.final);tone(420+selected.length*35,.07);render()}}));
    q('#finalReset').addEventListener('click',()=>{selected=[];render()});q('#finalHint').addEventListener('click',()=>{state.hints++;save();toast(selected.length<3?'Commence par : JEANNE ENTRE DANS…':'La phrase se termine par la date : LE 29 AVRIL 1429.')});
    q('#finalCheck').addEventListener('click',()=>{if(selected.join('|')===fragments.join('|')){state.finalDone=true;save();success('La chronique est sauvée !');confetti();setTimeout(()=>setScreen('certificate'),900)}else{mistake('Le parchemin ne se referme pas. Vérifie l’ordre des mots.');selected=[];render()}})
  };render()
}
function renderCertificate(){
  const earned=state.inventory.length;app.innerHTML=`<section class="diploma stack"><div class="stars">✦ ⚜️ ✦</div><div class="eyebrow">Diplôme officiel de l’aventure</div><h1>Messagère de Jeanne et Gardienne d’Orléans</h1><p>Ce titre est attribué à</p><div class="diploma-name">${esc(state.name)}</div><p>pour avoir résolu les huit énigmes, réuni ${earned} objets historiques et reconstitué la chronique de l’arrivée de Jeanne d’Arc.</p><div class="final-scroll">JEANNE ENTRE DANS ORLÉANS LE 29 AVRIL 1429.</div><p><strong>${state.seals} sceaux gagnés · ${state.hints} indice${state.hints>1?'s':''} utilisé${state.hints>1?'s':''}</strong></p>${state.hasHelper?`<p>Avec l’aide de <strong>${esc(state.helperName||'la Petite Porteuse du Fanion')}</strong>.</p>`:''}<p class="fine">Aventure accomplie à Orléans · 2026</p><button id="printBtn" class="primary no-print">Imprimer ou enregistrer le diplôme</button><button id="reviewBtn" class="secondary no-print">Revoir le parcours</button></section>`;q('#printBtn').addEventListener('click',()=>print());q('#reviewBtn').addEventListener('click',()=>setScreen('map'))
}
function renderHelp(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Aide</div><h1>Comment jouer</h1><div class="story-box"><strong>Règle d’or :</strong> le téléphone sert quelques minutes, puis retourne dans la poche. L’enfant doit d’abord regarder le monument réel.</div><h2>Une erreur n’arrête jamais l’aventure</h2><p>Le courage diminue visuellement, mais Jeanne le restaure automatiquement lorsqu’il est épuisé.</p><h2>Fatigue ou lieu inaccessible</h2><p>Activez le mode mission courte dans les réglages. Le mode adulte permet aussi de valider une étape.</p><h2>Hors connexion</h2><p>Ouvrez l’application une première fois avec Internet. Les fichiers, visuels et mini-jeux seront mis en cache sur l’appareil.</p><h2>Installation</h2><p>Sur iPhone : Partager → Sur l’écran d’accueil. Sur Android/Chrome : menu du navigateur → Installer l’application.</p><button id="sourcesBtn" class="secondary">Repères historiques et sources</button></section>`;q('#sourcesBtn').addEventListener('click',()=>setScreen('sources'))
}
function renderSources(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Repères historiques</div><h1>Sources utilisées</h1><p>Le jeu distingue les faits historiques, les lieux reconstruits et les formes de mémoire postérieures.</p><article class="fact-box"><div class="fact-icon">🏠</div><div><strong>Maison de Jeanne d’Arc</strong><br>Reconstitution de la demeure de Jacques Boucher, où Jeanne séjourna du 29 avril au 9 mai 1429.<br><a href="https://www.orleans.fr/que-faire-a-orleans/musees/la-maison-de-jeanne-darc" target="_blank" rel="noopener">Ville d’Orléans</a></div></article><article class="fact-box"><div class="fact-icon">🏛️</div><div><strong>Hôtel Groslot</strong><br>Édifice Renaissance construit de 1549 à 1558, donc postérieur au passage de Jeanne.<br><a href="https://www.orleans.fr/actualites/detail/nouveau-livret-pour-lhotel-groslotnouveau-livret-pour-lhotel-groslot" target="_blank" rel="noopener">Ville d’Orléans</a></div></article><article class="fact-box"><div class="fact-icon">📜</div><div><strong>Chronologie</strong><br>Entrée de Jeanne dans Orléans le 29 avril 1429 ; levée du siège célébrée le 8 mai.<br><a href="https://www.orleans.fr/fileadmin/orleans/MEDIA/kiosque/ville_art_histoire/vdh_jeannedarc.pdf" target="_blank" rel="noopener">Focus Jeanne d’Arc — Ville d’Orléans</a></div></article><button id="backHelp" class="primary">Retour à l’aide</button></section>`;q('#backHelp').addEventListener('click',()=>setScreen('help'))
}

// Navigation, dialogs, installation
q('#homeBtn').addEventListener('click',()=>setScreen('home'));
q('#settingsBtn').addEventListener('click',()=>settingsDialog.showModal());
bottomNav.addEventListener('click',e=>{const b=e.target.closest('button[data-nav]');if(b)setScreen(b.dataset.nav)});
q('#fatigueToggle').addEventListener('change',e=>{state.fatigue=e.target.checked;save()});
q('#soundToggle').addEventListener('change',e=>{state.sound=e.target.checked;save();if(state.sound)tone(550,.1)});
q('#motionToggle').addEventListener('change',e=>{state.reducedMotion=e.target.checked;save()});
q('#contrastSelect').addEventListener('change',e=>{state.contrast=e.target.value;save()});
q('#adultModeBtn').addEventListener('click',()=>{q('#adultMissionSelect').innerHTML=missions.map((m,i)=>`<option value="${i}">${i+1}. ${m.title}</option>`).join('');settingsDialog.close();adultDialog.showModal()});
q('#adultUnlockBtn').addEventListener('click',()=>{const i=Number(q('#adultMissionSelect').value);if(!state.completed.includes(i)){state.completed.push(i);state.completed.sort((a,b)=>a-b);state.fragments.push(missions[i].fragment);state.inventory.push(i);state.seals++}save();adultDialog.close();toast(`Étape ${i+1} validée par l’adulte.`,'good');setScreen('map')});
q('#adultCourageBtn').addEventListener('click',restoreCourage);
q('#adultResetBtn').addEventListener('click',()=>{if(confirm('Effacer toute la progression ?')){localStorage.removeItem(STORAGE_KEY);state=defaultState();adultDialog.close();save();setScreen('home')}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;q('#installBtn').hidden=false});
q('#installBtn').addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;q('#installBtn').hidden=true});
window.addEventListener('appinstalled',()=>toast('Application installée !','good'));

if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('Service worker',e)))}
applySettings();updateHud();setScreen('home');
