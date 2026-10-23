(()=>{
'use strict';
const id = s => document.getElementById(s);
if (!id('mcBoard')) return;
const native=window.BeardNative || null;
const boardKey='beardai-missions-v1';
const logKey='beardai-mission-history-v1';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\"':'&quot;'}[c]||'&#39;'));
const nowDay=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const time=()=>new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const clean=(s,len)=>String(s??'').replace(/[\r\n]+/g,' ').trim().slice(0,len);
const read=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key)||'null');return x??fallback}catch{return fallback}};
const save=(key,obj)=>{try{localStorage.setItem(key,JSON.stringify(obj));return true}catch{return false}};
// All recommendations are explanatory rules. No hidden model calls, account access, or game control.
const rules=[
 {id:'heal',re:/\b(healing pool|hospital|wounded|injured)\b/i,title:'Inspect healing and wounded troops',priority:95,reason:'Healing-related text detected. Check the displayed wounded count and available healing options before choosing an action.',guide:'Healing Pool'},
 {id:'conquest',re:/\b(conquest|shield|bubble|siege)\b/i,title:'Review Conquest protection',priority:92,reason:'Event/protection text detected. Check the current event schedule and shield expiration manually; BeardAI cannot activate shields.',guide:'World Map'},
 {id:'research',re:/\b(research|evolution|technology|lab(?:oratory)?)\b/i,title:'Review research upgrades',priority:79,reason:'Research-related text detected. Compare cost, time, and upgrade benefits before starting research.',guide:'Research'},
 {id:'workshop',re:/\b(mechanical workshop|gear|fusion|scorpion)\b/i,title:'Inspect Mechanical Workshop materials',priority:82,reason:'Gear/workshop text detected. Verify component and fusion requirements on screen before spending materials.',guide:'Mechanical Workshop'},
 {id:'training',re:/\b(training|troop|soldier|barracks)\b/i,title:'Check troop training queues',priority:75,reason:'Troop/training text detected. Review remaining queue time, capacity, and resource costs.',guide:'Training Grounds'},
 {id:'quest',re:/\b(daily quest|daily task|claim|reward)\b/i,title:'Review available daily rewards',priority:74,reason:'Daily reward text detected. Confirm eligibility and remaining time before collecting rewards yourself.',guide:'Daily Quests'},
 {id:'alliance',re:/\b(alliance|help request|alliance hall|contribution|donat(?:e|ion))\b/i,title:'Review alliance participation',priority:70,reason:'Alliance text detected. Check helps, contributions, and event timers on your current screen.',guide:'Alliance Hall'},
 {id:'resources',re:/\b(resource|food|leaf|water|harvest|gather)\b/i,title:'Inspect resource availability',priority:67,reason:'Resource-related text detected. Check your available resource stores and collection options.',guide:'Resource Collection'},
 {id:'world',re:/\b(world map|state map|march|rally|scout)\b/i,title:'Review world map activity',priority:63,reason:'World-map text detected. Check march slots and intended coordinates carefully before acting in the game.',guide:'World Map'},
 {id:'build',re:/\b(queen|nest|building|upgrade|construction)\b/i,title:'Check building upgrades',priority:62,reason:'Building-related text detected. Review prerequisites and resource costs before confirming any upgrade.',guide:'Nest Buildings'},
 ];
const daily=[
 {id:'daily-quest',title:'Review daily quests and pending rewards',priority:80,guide:'Daily Quests'},
 {id:'daily-research',title:'Check research progress and upgrade choices',priority:77,guide:'Research'},
 {id:'daily-training',title:'Check training and healing queues',priority:76,guide:'Healing Pool'},
 {id:'daily-alliance',title:'Review alliance helps and contributions',priority:70,guide:'Alliance Hall'},
 {id:'daily-resource',title:'Review available resources and collection',priority:65,guide:'Resource Collection'}
];
function recommend(raw){const text=String(raw||'').slice(0,12000);return rules.map(rule=>{const m=rule.re.exec(text);if(!m)return null;return {
 id:rule.id,title:rule.title,priority:rule.priority,guide:rule.guide,reason:rule.reason,
 evidence:m[0],source:'OCR / pasted text',confidence:'Keyword match only',
 };}).filter(Boolean).sort((a,b)=>b.priority-a.priority).slice(0,7)}
const fresh=()=>({day:nowDay(),missions:[],history:[]});
let data=read(boardKey,fresh()),recommendations=[],sourceLabel='';
if(!data||typeof data!=='object'||!Array.isArray(data.missions))data=fresh();
if(data.day!==nowDay()){save(logKey,[...read(logKey,[]),{day:data.day,missions:data.missions}].slice(-30));data=fresh();save(boardKey,data)}
function persist(){save(boardKey,data)}
function note(msg){id('mcFeedback').textContent=msg}
function showRecommendations(){
 id('mcRecCount').textContent=recommendations.length+' SUGGESTED';
 id('mcSuggestions').innerHTML=recommendations.length?recommendations.map(x=>`<div class="mc-card"><div class="mc-card-top"><strong>${safe(x.title)}</strong><span class="mc-rank">PRIORITY ${x.priority}</span></div><p>${safe(x.reason)}</p><small>Evidence: “${safe(x.evidence)}” · ${safe(sourceLabel)} · keyword-based only</small><div class="mc-buttons"><button type="button" data-mc-add="${x.id}" class="smart-main-button">+ ADD MISSION</button></div></div>`).join(''):'<div class="empty-row">No supported OCR terms found. Paste additional visible text or use Build Daily Routine.</div>';
 id('mcSuggestions').querySelectorAll('[data-mc-add]').forEach(b=>b.addEventListener('click',()=>{const r=recommendations.find(x=>x.id===b.dataset.mcAdd);if(r)addMission(r)}));
}
function addMission(candidate){
 if(!candidate||!clean(candidate.title,120)){note('Could not add mission: title is missing.');return {ok:false,status:'invalid',message:'Mission title is missing.'}}
 const existing=data.missions.find(x=>x.templateId===candidate.id && x.status!=='completed' && x.status!=='skipped');
 if(existing){note('This mission is already on your Command board.');renderBoard();return {ok:true,status:'existing',missionId:existing.id,title:existing.title}}
 if(data.missions.length>=25){note('Mission queue is full (25). Finish or remove some tasks first.');return {ok:false,status:'full',message:'Your Command board is full (25 missions).'}}
 const m={id:'m'+Date.now()+'-'+Math.floor(Math.random()*100000),templateId:candidate.id,title:clean(candidate.title,120),priority:Number(candidate.priority)||50,
 guide:candidate.guide||'',reason:clean(candidate.reason||'Manual daily routine',300),source:candidate.source||'Manual routine',
 status:'pending',createdAt:new Date().toISOString(),remindAt:0};
 data.missions.push(m);
 if(!save(boardKey,data)){data.missions.pop();note('Could not save mission locally. Check browser storage.');return {ok:false,status:'storage',message:'Browser storage rejected the mission.'}}
 renderBoard();note('Added '+m.title+' to today’s Command board. Nothing was performed in Ant Legion.');
 return {ok:true,status:'added',missionId:m.id,title:m.title};
}
function openBoard(missionId){
 const tab=document.querySelector('.tab[data-tab="command"]');
 if(tab)tab.click();
 const row=Array.from(id('mcBoard').querySelectorAll('[data-mc-item]')).find(el=>el.dataset.mcItem===missionId);
 const target=row||id('mcBoard');
 if(row){row.classList.add('mc-highlight');row.setAttribute('tabindex','-1');}
 // Switch tab first, then scroll into the newly visible Command mission.
 requestAnimationFrame(()=>{
   target.scrollIntoView({behavior:'smooth',block:'center'});
   if(row){row.focus({preventScroll:true});setTimeout(()=>row.classList.remove('mc-highlight'),4500)}
 });
}
function renderOverview(){
 const spot=id('mcOverviewPreview');if(!spot)return;
 const recent=data.missions.filter(x=>x.status!=='skipped'&&x.status!=='completed').slice(-3).reverse();
 spot.innerHTML=recent.length?recent.map(x=>`<div class="mc-overview-item"><strong>${safe(x.title)}</strong><small>${safe(x.status.toUpperCase())} · Priority ${Number(x.priority)||50}</small></div>`).join(''):'<div class="empty-row">No active missions yet. Use Intel to create one, or open Command to build a routine.</div>';
}
function renderBoard(){
 const list=data.missions.slice().sort((a,b)=>((a.status==='completed'||a.status==='skipped')?1:0)-((b.status==='completed'||b.status==='skipped')?1:0)||b.priority-a.priority);
 const done=data.missions.filter(x=>x.status==='completed').length;
 id('mcBoardCount').textContent=done+' DONE / '+data.missions.length+' TOTAL';
 const active=data.missions.filter(x=>x.status==='pending'||x.status==='working').length;
 if(id('mcMissionCount')) id('mcMissionCount').textContent=active;
 id('mcBoard').innerHTML=list.length?list.map(x=>{const complete=x.status==='completed',skipped=x.status==='skipped';const due=x.remindAt&&Date.now()>=x.remindAt&&!complete&&!skipped;
 return `<div class="mc-card ${complete?'mc-completed':''}" data-mc-item="${safe(x.id)}"><div class="mc-card-top"><strong>${safe(x.title)}</strong><span class="mc-status">${due?'REMINDER DUE':safe(x.status.toUpperCase())}</span></div><p>${safe(x.reason)}</p><small>${safe(x.source)} · Priority ${x.priority}${x.remindAt?' · Reminder '+safe(new Date(x.remindAt).toLocaleTimeString()):''}</small><div class="mc-buttons">
 ${complete||skipped?'':`<button type="button" data-mc-do="start">${x.status==='working'?'IN PROGRESS':'START'}</button><button type="button" data-mc-do="done">MARK DONE</button><button type="button" data-mc-do="remind">REMIND 15M</button><button type="button" data-mc-do="skip">SKIP</button>`}
 <button type="button" data-mc-do="remove">REMOVE</button></div></div>`}).join(''):'<div class="empty-row">Your action board is empty. Analyze a screenshot or build a daily routine to get started.</div>';
 id('mcBoard').querySelectorAll('[data-mc-item]').forEach(row=>row.querySelectorAll('[data-mc-do]').forEach(b=>b.addEventListener('click',()=>changeMission(row.dataset.mcItem,b.dataset.mcDo))));
 renderOverview();
}
function changeMission(missionId,action){const m=data.missions.find(x=>x.id===missionId);if(!m)return;
 if(action==='start'){m.status='working';m.startedAt=new Date().toISOString();note('Started your mission. Open the game and perform it yourself; return to confirm completion.');}
 else if(action==='done'){m.status='completed';m.completedAt=new Date().toISOString();cancelNative(m.id);m.remindAt=0;note('Recorded your completion report; no game-state verification occurred.');}
 else if(action==='skip'){m.status='skipped';cancelNative(m.id);m.remindAt=0;note('Skipped this mission.');}
 else if(action==='remove'){if(!confirm('Remove this local mission?'))return;cancelNative(m.id);data.missions=data.missions.filter(x=>x.id!==missionId);note('Mission removed.');}
 else if(action==='remind'){
   if(native&&typeof native.scheduleMissionReminder==='function'){
    let answer;try{answer=JSON.parse(native.scheduleMissionReminder(m.id,m.title,15));}catch{answer={ok:false,reason:'bridge_error'}}
    if(!answer.ok){note(answer.reason==='notification_permission_required'?'Android notifications are disabled. Allow them in system settings and tap REMIND again.':'Could not set Android reminder: '+(answer.reason||'unknown'));return}
    note('Android reminder requested for about 15 minutes from now (Android may delay it).');
   }else note('In-app 15-minute reminder set. It works while the desktop window is open; no background Windows notification.');
   m.remindAt=Date.now()+15*60000;
 }
 persist();renderBoard()}
function cancelNative(mid){if(native&&typeof native.cancelMissionReminder==='function')try{native.cancelMissionReminder(mid)}catch{}}
function analyze(){
 let text=id('mcPaste').value.trim();sourceLabel='Text pasted by user';
 if(native&&typeof native.status==='function'){
  try{const s=JSON.parse(native.status());if(!text){text=(Array.isArray(s.ocrLines)?s.ocrLines:[]).map(x=>String(x.text||'')).filter(Boolean).join('\n');sourceLabel='Local Android OCR '+(s.ocrFrameId===s.frameId?'from current frame':'from last processed frame')}}catch{}
 }
 if(!text){note('No text available. Capture a game screen with AI Vision, or paste game text below.');return}
 recommendations=recommend(text);showRecommendations();note(recommendations.length+' rule-based suggestions from '+sourceLabel+'. Review them; these are not verified gameplay facts.');
}
function routine(){daily.forEach(x=>addMission({...x,reason:'Optional routine: review the game screen and decide whether action is necessary.',source:'User-requested routine'}));note('Daily routine loaded. Use START, REMIND, and MARK DONE to manage it. No game commands executed.');}
function resetDay(){if(!confirm('Clear today’s local mission list?'))return;data=fresh();recommendations=[];save(boardKey,data);renderBoard();showRecommendations();note('Today’s mission board reset.');}
function start(){
 id('mcAnalyze').addEventListener('click',analyze);id('mcRoutine').addEventListener('click',routine);id('mcClear').addEventListener('click',resetDay);
 id('mcOpenGame').addEventListener('click',()=>{if(native&&native.openGame){native.openGame();note('Opening Ant Legion. Gameplay is controlled by you.')}else {window.open('https://play.google.com/pc-store/games/details?hl=en&id=com.global.antgame','_blank','noopener,noreferrer');note('Opened official Google Play Games on PC listing. Sign in and use the game client itself for chat.');}});
 id('mcStartCapture').addEventListener('click',()=>{if(native&&native.startVision){native.startVision();note('Requested Android screen sharing. Return here to analyze a recognized frame.')}else note('Android screen capture is unavailable on this desktop edition. Paste game text instead.');});
 id('mcDay').textContent=nowDay();renderBoard();showRecommendations();
 setInterval(()=>{if(data.day!==nowDay()){save(logKey,[...read(logKey,[]),{day:data.day,missions:data.missions}].slice(-30));data=fresh();persist();renderBoard();note('New local day: mission board reset.')}else if(data.missions.some(x=>x.remindAt&&x.remindAt<=Date.now()&&x.status!=='completed'&&x.status!=='skipped'))renderBoard()},15000)
}
window.BeardAIMissions={recommend,buildDaily:()=>daily.slice(),getMissions:()=>data.missions.map(x=>({...x})),addExternal:x=>addMission(x),openBoard};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
