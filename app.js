'use strict';

const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'chroniqueJeanneState';
const fragments = ['JEANNE','ENTRE','DANS','ORLÉANS','LE','29','AVRIL','1429'];

const missions = [
  {
    title:'La sentinelle de bronze', place:'Place du Martroi', icon:'🐎', fragment:'JEANNE',
    intro:'Retrouve Jeanne d’Arc montée sur son cheval au centre de la place.',
    fact:'La grande statue équestre rappelle la place centrale de Jeanne d’Arc dans la mémoire d’Orléans.',
    short:'Montre Jeanne, son cheval et son épée.',
    observations:['Je vois le cheval','Je vois l’armure','Je vois l’épée'],
    question:'Sur quel animal Jeanne est-elle représentée ?', choices:['Un cerf','Un cheval','Un loup'], answer:1,
    open:'Que pourrait dire Jeanne aux habitants pour leur donner du courage ?'
  },
  {
    title:'La maison du récit', place:'Maison de Jeanne d’Arc', icon:'🏠', fragment:'ENTRE',
    intro:'Observe la façade qui rappelle la demeure où Jeanne fut accueillie lors de son séjour à Orléans.',
    fact:'Jeanne entre à Orléans le 29 avril 1429 et séjourne chez Jacques Boucher, trésorier du duc d’Orléans.',
    short:'Observe les poutres puis réponds : pourquoi Jeanne est-elle venue ?',
    observations:['Je vois les poutres de bois','Je vois plusieurs étages','Je repère une différence avec une maison moderne'],
    question:'Pourquoi Jeanne est-elle venue à Orléans ?', choices:['Pour aider à libérer la ville','Pour acheter une maison','Pour participer à une fête'], answer:0,
    open:'Imagine que tu accueilles Jeanne après son voyage. Quelle phrase lui dis-tu ?'
  },
  {
    title:'La route de la Loire', place:'Rue Royale et bords de Loire', icon:'🌊', fragment:'DANS',
    intro:'Rejoins la Loire et observe le fleuve, le pont et la rive opposée.',
    fact:'Le contrôle des ponts, des routes et des approvisionnements était essentiel pendant le siège.',
    short:'Trouve la Loire et le pont.',
    observations:['Je vois un pont','Je vois le courant','Je vois la rive opposée','Je vois quelque chose qui bouge'],
    question:'Pourquoi la Loire était-elle importante en 1429 ?', choices:['Pour déplacer personnes, messages et provisions','Uniquement pour se baigner','Parce qu’elle éclairait la ville'], answer:0,
    open:'Le pont est surveillé et le courant est fort. Comment ferais-tu passer un message ?'
  },
  {
    title:'Le livre de lumière', place:'Cathédrale Sainte-Croix', icon:'⛪', fragment:'ORLÉANS',
    intro:'Entre calmement et cherche les vitraux qui racontent l’histoire de Jeanne.',
    fact:'Les vitraux consacrés à Jeanne fonctionnent comme un récit en images et transmettent sa mémoire.',
    short:'Trouve Jeanne dans un vitrail et choisis ta couleur préférée.',
    observations:['Je vois les deux grandes tours','Je trouve un vitrail avec des personnages','Je repère du bleu ou du rouge'],
    question:'À quoi un vitrail historique ressemble-t-il le plus ?', choices:['À une bande dessinée de lumière','À une porte secrète','À une carte routière'], answer:0,
    open:'Raconte la scène choisie en trois moments : au début, ensuite, à la fin.'
  },
  {
    title:'La demeure de la mémoire', place:'Hôtel Groslot', icon:'🏛️', fragment:'LE',
    intro:'Observe cette demeure construite après l’époque de Jeanne, mais riche de sa mémoire.',
    fact:'Un lieu de mémoire peut transmettre une histoire même s’il a été construit après l’événement.',
    short:'Trouve les briques rouges et une représentation de Jeanne.',
    observations:['Je vois les briques rouges','Je trouve un décor riche','Je repère une représentation liée à Jeanne'],
    question:'L’Hôtel Groslot est surtout…', choices:['Un lieu de mémoire de Jeanne','La maison où Jeanne a dormi','Une forteresse anglaise'], answer:0,
    open:'Quel moyen choisirais-tu pour transmettre la mémoire de Jeanne : statue, fête, musée, livre ou vitrail ?'
  },
  {
    title:'Le passage silencieux', place:'Campo Santo', icon:'🏺', fragment:'29',
    intro:'Marche doucement sous les arches et écoute les sons proches et lointains.',
    fact:'Observer l’architecture et écouter un lieu aide à ressentir son ancienneté.',
    short:'Passe sous une arche et écoute dix secondes.',
    observations:['Je vois une arche','Je vois une ombre','Je remarque une vieille pierre'],
    question:'Quel nombre est plus grand que 28 et plus petit que 30 ?', choices:['28','29','30'], answer:1,
    open:'Quel mot résume le mieux ce lieu : calme, mystérieux, lumineux ou autre ?'
  },
  {
    title:'La reconnaissance de la ville', place:'Petit train touristique', icon:'🚂', fragment:'AVRIL',
    intro:'Pendant le trajet, regarde surtout la ville et reconnais les lieux déjà visités.',
    fact:'Revoir les monuments permet de relier les étapes et de reconstruire mentalement la ville.',
    short:'Reconnais au moins trois lieux depuis le petit train.',
    observations:['Je reconnais la statue de Jeanne','Je reconnais la cathédrale','Je reconnais un autre monument','Je vois la Loire ou un pont'],
    question:'Quel mois vient après mars et avant mai ?', choices:['Août','Avril','Octobre'], answer:1,
    open:'Quel monument as-tu reconnu le plus facilement et grâce à quel détail ?'
  },
  {
    title:'Le gardien des objets anciens', place:'Hôtel Cabu', icon:'🏺', fragment:'1429',
    intro:'Choisis quelques objets ou représentations qui racontent l’histoire et la mémoire de Jeanne.',
    fact:'Les objets de musée sont des témoins : certains datent des événements, d’autres montrent comment ils furent racontés plus tard.',
    short:'Choisis un objet qui raconterait Orléans aux enfants du futur.',
    observations:['Je trouve une représentation de Jeanne','Je choisis un objet mystérieux','Je choisis un objet à transmettre au futur'],
    question:'L’année commence par 14 et se termine par 29. Quelle est-elle ?', choices:['1428','1429','1492'], answer:1,
    open:'Quel objet sauverais-tu pour expliquer Jeanne d’Arc aux enfants dans 500 ans ?'
  }
];

const defaultState = () => ({
  version:APP_VERSION, name:'', littleName:'', hasLittle:false, speech:false, contrast:'normal', fatigue:false,
  started:false, completed:[], current:0, answers:{}, finalDone:false, createdAt:new Date().toISOString()
});
let state = loadState();
let currentScreen = 'home';
let selectedFinal = [];

const app = document.querySelector('#app');
const bottomNav = document.querySelector('#bottomNav');
const settingsDialog = document.querySelector('#settingsDialog');
const adultDialog = document.querySelector('#adultDialog');

function loadState(){
  try { return {...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}; }
  catch { return defaultState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); applySettings(); }
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function speak(text){
  if(!state.speech || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='fr-FR'; u.rate=.95; speechSynthesis.speak(u);
}
function toast(text){
  const t=document.querySelector('#toastTemplate').content.firstElementChild.cloneNode(true); t.textContent=text; document.body.append(t); setTimeout(()=>t.remove(),2600);
}
function applySettings(){
  document.body.classList.toggle('high-contrast',state.contrast==='high');
  document.querySelector('#fatigueToggle').checked=state.fatigue;
  document.querySelector('#speechToggle').checked=state.speech;
  document.querySelector('#contrastSelect').value=state.contrast;
}
function setScreen(name){ currentScreen=name; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function progressPct(){return Math.round((state.completed.length/8)*100)}
function nextMissionIndex(){for(let i=0;i<8;i++) if(!state.completed.includes(i)) return i; return 8;}

function render(){
  applySettings();
  bottomNav.hidden=!state.started;
  document.querySelector('#subtitle').textContent=state.started?`${progressPct()} % de la chronique sauvée`:'Jeu de piste à Orléans';
  if(currentScreen==='home') return renderHome();
  if(currentScreen==='setup') return renderSetup();
  if(currentScreen==='prologue') return renderPrologue();
  if(currentScreen==='map') return renderMap();
  if(currentScreen==='mission') return renderMission(state.current);
  if(currentScreen==='chest') return renderChest();
  if(currentScreen==='final') return renderFinal();
  if(currentScreen==='certificate') return renderCertificate();
  if(currentScreen==='help') return renderHelp();
}

function renderHome(){
  app.innerHTML=`<section class="hero stack">
    <div class="hero-mark">⚜️</div><div class="eyebrow">Aventure historique familiale</div>
    <h1>La chronique perdue de Jeanne d’Arc</h1>
    <p>Une messagère de 7 ans suit les traces de Jeanne dans Orléans et retrouve huit fragments numériques.</p>
    ${state.started?`<button class="primary" id="continueBtn">Continuer l’aventure</button><button class="secondary" id="restartPrompt">Recommencer</button>`:`<button class="primary" id="startBtn">Commencer l’aventure</button>`}
    <div class="install-note small"><strong>Application PWA :</strong> fonctionne hors connexion après le premier chargement. Pour l’installer, utilisez « Ajouter à l’écran d’accueil » dans le navigateur.</div>
  </section>
  <section class="grid" style="margin-top:1rem"><article class="card"><h2>8 missions</h2><p>Observation, énigmes et choix narratifs dans les lieux de votre programme.</p></article><article class="card"><h2>Sans accessoire</h2><p>Le téléphone contient la narration, les indices, les fragments et le diplôme.</p></article><article class="card"><h2>Rythme adaptable</h2><p>Un mode mission courte permet de préserver l’aventure en cas de fatigue.</p></article></section>`;
  document.querySelector('#startBtn')?.addEventListener('click',()=>setScreen('setup'));
  document.querySelector('#continueBtn')?.addEventListener('click',()=>setScreen(state.finalDone?'certificate':'map'));
  document.querySelector('#restartPrompt')?.addEventListener('click',()=>{if(confirm('Recommencer et effacer la progression ?')){state=defaultState();saveState();setScreen('setup')}});
}

function renderSetup(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Préparation</div><h1>Qui devient la Messagère de Jeanne ?</h1>
  <label>Prénom de la messagère<input id="nameInput" maxlength="24" autocomplete="off" value="${escapeHtml(state.name)}" placeholder="Prénom"></label>
  <label class="switch-row"><span>Une petite exploratrice participe</span><input id="littleToggle" type="checkbox" ${state.hasLittle?'checked':''}></label>
  <label id="littleWrap" class="${state.hasLittle?'':'hidden'}">Son prénom<input id="littleInput" maxlength="24" autocomplete="off" value="${escapeHtml(state.littleName)}" placeholder="Prénom"></label>
  <label>Mode de lecture<select id="readMode"><option value="read">L’enfant lit avec un adulte</option><option value="speech">Écouter la narration</option></select></label>
  <button id="setupNext" class="primary">Recevoir le message de 1429</button></section>`;
  const toggle=document.querySelector('#littleToggle'); toggle.addEventListener('change',()=>document.querySelector('#littleWrap').classList.toggle('hidden',!toggle.checked));
  document.querySelector('#setupNext').addEventListener('click',()=>{
    const name=document.querySelector('#nameInput').value.trim(); if(!name){toast('Entre le prénom de la messagère.');return;}
    state.name=name; state.hasLittle=toggle.checked; state.littleName=document.querySelector('#littleInput')?.value.trim()||''; state.speech=document.querySelector('#readMode').value==='speech'; saveState(); setScreen('prologue');
  });
}

function renderPrologue(){
  const text=`Bonjour ${escapeHtml(state.name)}. Cette nuit, un vent venu de la Loire a déchiré la chronique qui raconte l’arrivée de Jeanne d’Arc à Orléans. Huit fragments ont été dispersés dans la ville. Nous avons besoin d’une messagère attentive pour les retrouver.`;
  app.innerHTML=`<section class="hero stack center"><div class="large-icon">📜💨</div><div class="eyebrow">Message urgent reçu depuis 1429</div><h1>Le gardien de la chronique t’appelle</h1><div class="story-box">${text}</div>
  <p>Chaque mission réussie débloquera un mot. Ensemble, les huit mots formeront une phrase historique.</p>
  <button id="acceptBtn" class="primary">J’accepte la mission</button></section>`;
  speak(text);
  document.querySelector('#acceptBtn').addEventListener('click',()=>{state.started=true;state.current=nextMissionIndex();saveState();toast(`${state.name} devient Messagère de Jeanne d’Arc`);setScreen('map');});
}

function renderMap(){
  const n=nextMissionIndex(); state.current=Math.min(n,7); saveState();
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Parcours</div><h1>Les huit fragments</h1><div class="progress" aria-label="Progression"><span style="width:${progressPct()}%"></span></div><p><strong>${state.completed.length}/8 missions</strong> accomplies</p></section>
  <section class="mission-list" style="margin-top:1rem">${missions.map((m,i)=>{
    const done=state.completed.includes(i), locked=i>nextMissionIndex();
    return `<article class="mission-item ${done?'done':''} ${locked?'locked':''}"><div class="mission-number">${done?'✓':i+1}</div><div style="flex:1"><strong>${m.icon} ${m.title}</strong><div class="muted small">${m.place}</div></div>${!locked?`<button class="secondary mission-open" data-i="${i}" style="width:auto">${done?'Revoir':'Ouvrir'}</button>`:'🔒'}</article>`}).join('')}</section>
  ${state.completed.length===8?`<button id="finalBtn" class="primary" style="margin-top:1rem">Reconstituer la chronique</button>`:''}`;
  document.querySelectorAll('.mission-open').forEach(b=>b.addEventListener('click',()=>{state.current=Number(b.dataset.i);saveState();setScreen('mission')}));
  document.querySelector('#finalBtn')?.addEventListener('click',()=>setScreen('final'));
}

function renderMission(i){
  const m=missions[i], done=state.completed.includes(i);
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Mission ${i+1} sur 8 · ${m.place}</div><div class="large-icon center">${m.icon}</div><h1>${m.title}</h1><div class="story-box">${m.intro}</div>
  <p><span class="badge">Repère historique</span><br>${m.fact}</p>
  ${done?`<div class="center"><div class="fragment">${m.fragment}</div><p>Cette mission est déjà réussie.</p></div><button class="primary" id="backMap">Retour au parcours</button>`:`<div id="missionContent"></div>`}</section>`;
  if(done){document.querySelector('#backMap').addEventListener('click',()=>setScreen('map'));return;}
  speak(m.intro); renderMissionStep(i,0);
}

function renderMissionStep(i,step){
  const m=missions[i], c=document.querySelector('#missionContent');
  if(state.fatigue){
    c.innerHTML=`<div class="card stack"><span class="badge">Mode mission courte</span><p>${m.short}</p><button id="shortDone" class="primary">Mission courte accomplie</button></div>`;
    document.querySelector('#shortDone').addEventListener('click',()=>completeMission(i)); return;
  }
  if(step===0){
    c.innerHTML=`<div class="stack"><h2>Observation sur place</h2><div class="observation-list">${m.observations.map((o,k)=>`<label class="check-row"><input type="checkbox" data-check="${k}"><span>${o}</span></label>`).join('')}</div>
    ${state.hasLittle?`<div class="story-box"><strong>Mission de ${escapeHtml(state.littleName||'la petite exploratrice')}</strong><br>${littleMission(i)}</div>`:''}
    <button id="obsNext" class="primary">J’ai terminé l’observation</button></div>`;
    document.querySelector('#obsNext').addEventListener('click',()=>{if(![...document.querySelectorAll('[data-check]')].every(x=>x.checked)){toast('Coche les éléments observés, ou active le mode mission courte.');return;}renderMissionStep(i,1)});
  } else if(step===1){
    c.innerHTML=`<div class="stack"><h2>Énigme</h2><p><strong>${m.question}</strong></p>${m.choices.map((x,k)=>`<button class="choice" data-choice="${k}">${x}</button>`).join('')}<button id="hintBtn" class="secondary">Demander un indice</button></div>`;
    document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
      const ok=Number(b.dataset.choice)===m.answer; b.classList.add(ok?'correct':'wrong');
      if(ok){toast('Bonne réponse !');setTimeout(()=>renderMissionStep(i,2),500)} else toast('Regarde encore le lieu et essaie une autre réponse.');
    }));
    document.querySelector('#hintBtn').addEventListener('click',()=>toast(`Indice : la bonne réponse commence par « ${m.choices[m.answer].slice(0,12)}… »`));
  } else {
    c.innerHTML=`<div class="stack"><h2>Parole de messagère</h2><p>${m.open}</p><textarea id="openAnswer" rows="4" maxlength="300" placeholder="Tu peux dicter ou écrire une réponse courte."></textarea><button id="voiceBtn" class="secondary">🎙️ Dicter ma réponse</button><button id="finishMission" class="primary">Valider et recevoir le fragment</button></div>`;
    setupVoiceInput();
    document.querySelector('#finishMission').addEventListener('click',()=>{state.answers[i]=document.querySelector('#openAnswer').value.trim();completeMission(i)});
  }
}

function littleMission(i){return ['Montre le cheval et imite ses sabots.','Choisis une fenêtre de la maison.','Montre quelque chose qui bouge puis quelque chose d’immobile.','Trouve du bleu et du rouge dans les vitraux.','Trouve la brique la plus rouge.','Passe sous une arche avec un adulte.','Annonce « déjà vu ! » lorsqu’un monument est reconnu.','Choisis l’objet le plus joli ou le plus étrange.'][i]}
function setupVoiceInput(){
  const btn=document.querySelector('#voiceBtn'), area=document.querySelector('#openAnswer');
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){btn.hidden=true;return;}
  btn.addEventListener('click',()=>{const r=new SR();r.lang='fr-FR';r.interimResults=false;r.onresult=e=>area.value=e.results[0][0].transcript;r.onerror=()=>toast('La dictée vocale n’est pas disponible.');r.start();toast('Parle maintenant…')});
}
function completeMission(i){
  if(!state.completed.includes(i)) state.completed.push(i);
  state.completed.sort((a,b)=>a-b); state.current=nextMissionIndex(); saveState();
  const m=missions[i]; app.innerHTML=`<section class="hero stack center"><div class="large-icon">✨</div><div class="eyebrow">Fragment retrouvé</div><div class="fragment" style="font-size:1.4rem">${m.fragment}</div><p>Le fragment rejoint automatiquement le coffre de la chronique.</p><button id="rewardNext" class="primary">${state.completed.length===8?'Reconstituer la chronique':'Voir la prochaine mission'}</button></section>`;
  speak(`Fragment retrouvé : ${m.fragment}`);
  document.querySelector('#rewardNext').addEventListener('click',()=>setScreen(state.completed.length===8?'final':'map'));
}

function renderChest(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Coffre numérique</div><h1>Fragments de la chronique</h1><div class="fragments">${fragments.map((f,i)=>`<div class="fragment ${state.completed.includes(i)?'':'locked'}">${state.completed.includes(i)?f:'?'}</div>`).join('')}</div><p>${state.completed.length===8?'Tous les fragments sont retrouvés.':'Les mots restent cachés jusqu’à la réussite de leur mission.'}</p>${state.completed.length===8?`<button id="chestFinal" class="primary">Assembler la phrase</button>`:''}</section>`;
  document.querySelector('#chestFinal')?.addEventListener('click',()=>setScreen('final'));
}

function renderFinal(){
  if(state.completed.length<8){toast('Il reste des missions à accomplir.');return setScreen('map');}
  selectedFinal=[];
  const shuffled=[...fragments].sort(()=>Math.random()-.5);
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Épreuve finale</div><h1>Reconstitue la chronique</h1><p>Touche les fragments dans le bon ordre. Commence par le personnage, puis son action, le lieu et la date.</p><div id="finalTarget" class="drop-zone" aria-label="Phrase reconstituée"></div><div id="finalSource" class="fragments">${shuffled.map(f=>`<button class="fragment draggable" data-fragment="${f}">${f}</button>`).join('')}</div><button id="finalHint" class="secondary">Indice</button><button id="finalCheck" class="primary">Vérifier la phrase</button></section>`;
  document.querySelectorAll('[data-fragment]').forEach(b=>b.addEventListener('click',()=>{selectedFinal.push(b.dataset.fragment);b.disabled=true;document.querySelector('#finalTarget').insertAdjacentHTML('beforeend',`<button class="fragment" data-remove="${selectedFinal.length-1}">${b.dataset.fragment}</button>`);bindRemove()}));
  document.querySelector('#finalHint').addEventListener('click',()=>toast('La phrase commence par « JEANNE ENTRE DANS… »'));
  document.querySelector('#finalCheck').addEventListener('click',()=>{
    if(selectedFinal.join('|')===fragments.join('|')){state.finalDone=true;saveState();setScreen('certificate')} else {toast('La phrase n’est pas encore dans le bon ordre.'); selectedFinal=[]; renderFinal();}
  });
}
function bindRemove(){document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{selectedFinal=[];renderFinal()})}

function renderCertificate(){
  const little=state.hasLittle?`<article class="card center"><div class="large-icon">🚩</div><h2>Petite Porteuse du Fanion</h2><p>Ce titre est attribué à <strong>${escapeHtml(state.littleName||'la petite exploratrice')}</strong> pour son aide attentive.</p></article>`:'';
  app.innerHTML=`<section class="hero stack center"><div class="large-icon">🏅</div><div class="eyebrow">Mission accomplie</div><h1>Messagère de Jeanne d’Arc</h1><p>Ce titre est attribué à</p><h2>${escapeHtml(state.name)}</h2><p>pour avoir retrouvé les huit fragments et suivi les traces de Jeanne d’Arc dans Orléans.</p><div class="final-scroll">JEANNE ENTRE DANS ORLÉANS LE 29 AVRIL 1429.</div><p><strong>Orléans · 4 août 2026</strong></p><button id="printBtn" class="primary">Imprimer ou enregistrer le diplôme</button><button id="reviewBtn" class="secondary">Revoir le parcours</button></section>${little}`;
  document.querySelector('#printBtn').addEventListener('click',()=>window.print());
  document.querySelector('#reviewBtn').addEventListener('click',()=>setScreen('map'));
}

function renderHelp(){
  app.innerHTML=`<section class="card stack"><div class="eyebrow">Aide</div><h1>Utiliser l’application</h1><h2>Sur place</h2><p>Un adulte garde le téléphone. L’enfant regarde d’abord le monument, puis répond dans l’application.</p><h2>Pas de GPS obligatoire</h2><p>Les étapes sont ouvertes manuellement afin d’éviter les blocages de localisation.</p><h2>Fatigue ou fermeture</h2><p>Activez « Mode mission courte » dans les réglages. Le mode adulte permet aussi de valider une étape.</p><h2>Hors connexion</h2><p>Ouvrez une première fois l’application avec une connexion. Le service worker met les fichiers essentiels en cache.</p><h2>Données</h2><p>La progression reste dans le navigateur de l’appareil. Aucun compte et aucun serveur ne sont requis.</p></section>`;
}

// Navigation and settings
bottomNav.addEventListener('click',e=>{const b=e.target.closest('button[data-nav]');if(b)setScreen(b.dataset.nav)});
document.querySelector('#homeBtn').addEventListener('click',()=>setScreen('home'));
document.querySelector('#settingsBtn').addEventListener('click',()=>settingsDialog.showModal());
document.querySelector('#fatigueToggle').addEventListener('change',e=>{state.fatigue=e.target.checked;saveState();toast(state.fatigue?'Mode mission courte activé':'Mode normal activé')});
document.querySelector('#speechToggle').addEventListener('change',e=>{state.speech=e.target.checked;saveState()});
document.querySelector('#contrastSelect').addEventListener('change',e=>{state.contrast=e.target.value;saveState()});
document.querySelector('#adultModeBtn').addEventListener('click',()=>{settingsDialog.close();populateAdult();adultDialog.showModal()});
function populateAdult(){document.querySelector('#adultMissionSelect').innerHTML=missions.map((m,i)=>`<option value="${i}">${i+1}. ${m.title}</option>`).join('')}
document.querySelector('#adultUnlockBtn').addEventListener('click',()=>{const i=Number(document.querySelector('#adultMissionSelect').value);if(!state.completed.includes(i))state.completed.push(i);state.completed.sort((a,b)=>a-b);saveState();adultDialog.close();toast('Étape validée par un adulte.');setScreen('map')});
document.querySelector('#adultResetBtn').addEventListener('click',()=>{if(confirm('Effacer toute la progression ?')){localStorage.removeItem(STORAGE_KEY);state=defaultState();adultDialog.close();saveState();setScreen('home')}});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));}
applySettings();render();
