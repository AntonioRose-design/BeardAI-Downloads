(()=>{
'use strict';
// BeardAI 2.0 local-first command suite. No game automation, no unofficial account/API access.
const $=id=>document.getElementById(id);
if(!$('tab-ascend'))return;
const KEY='beardai-ascension-v2';
const clean=(s,n)=>String(s??'').trim().slice(0,n);
const max={operations:80,events:40,battles:80,goals:60,visuals:80};
const initial=()=>({schema:2,alliance:'WAD',server:'374',operations:[],events:[],battles:[],goals:[],visuals:[]});
const num=(v,maxN=1e15)=>{if(v===''||v===null||v===undefined)return null;const x=Number(v);return Number.isFinite(x)&&x>=0&&x<=maxN?x:null};
const stamp=()=>new Date().toISOString();
const uid=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2,9);
const safeDate=s=>{if(typeof s!=='string'||s.length>35)return false;const x=new Date(s);return Number.isFinite(x.getTime())};
function sanitize(raw){
 if(!raw||raw.schema!==2||typeof raw!=='object')throw Error('Not an Ascension v2 backup');
 let d=initial();d.alliance=clean(raw.alliance,24)||'Alliance';d.server=clean(raw.server,12);
 for(const k of Object.keys(max)){
  if(!Array.isArray(raw[k])||raw[k].length>max[k])throw Error('Invalid '+k+' collection');
  d[k]=raw[k].map(x=>{
   if(!x||typeof x!=='object')throw Error('Invalid '+k+' row');
   const b={id:clean(x.id,80),at:clean(x.at,35)};
   if(!b.id||!safeDate(b.at))throw Error('Missing record identifier or creation time');
   if(k==='operations')return {...b,title:clean(x.title,110),owner:clean(x.owner,50),due:safeDate(x.due)?clean(x.due,35):'',status:['pending','working','done'].includes(x.status)?x.status:'pending'};
   if(k==='events')return {...b,title:clean(x.title,90),when:safeDate(x.when)?clean(x.when,35):''};
   if(k==='battles')return {...b,title:clean(x.title,100),result:['win','loss','draw'].includes(x.result)?x.result:'draw',losses:num(x.losses,1e12),notes:clean(x.notes,350)};
   if(k==='goals')return {...b,title:clean(x.title,90),current:num(x.current)??0,target:num(x.target)??1};
   if(k==='visuals')return {...b,label:clean(x.label,75),hash:/^[01]{64}$/.test(x.hash||'')?x.hash:''};
  });
 }
 for(const x of d.operations)if(!x.title)throw Error('Blank operation');
 for(const x of d.events)if(!x.title||!x.when)throw Error('Invalid event');
 for(const x of d.visuals)if(!x.label||!x.hash)throw Error('Invalid screenshot fingerprint');
 return d;
}
function load(){try{return sanitize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch{return initial()}}
let data=load();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{status('Local storage is unavailable. Nothing was saved.');return false}}
function commit(change){const before=JSON.stringify(data);change();if(!persist()){data=JSON.parse(before);render();return false}render();return true}
function status(m){$('ascStatus').textContent=m}
function el(tag,txt,cls){const x=document.createElement(tag);if(txt!==undefined)x.textContent=String(txt);if(cls)x.className=cls;return x}
function addRow(id,title,sub,controls,extra){const box=el('div',undefined,'asc-card');const top=el('div',undefined,'asc-card-top');top.append(el('strong',title),el('small',sub));box.append(top);if(extra)box.append(extra);const actions=el('div',undefined,'asc-actions');for(const [text,click] of controls){const b=el('button',text);b.type='button';b.addEventListener('click',click);actions.append(b)}box.append(actions);$(id).append(box)}
const format=x=>Number(x).toLocaleString(undefined,{maximumFractionDigits:2});
function parseWhen(s){if(!s)return 0;const n=new Date(s).getTime();return Number.isFinite(n)?n:0}
function countdown(s){const delta=parseWhen(s)-Date.now();if(!Number.isFinite(delta))return 'Invalid date';if(delta<=0)return 'STARTED / PAST';const day=Math.floor(delta/86400000),h=Math.floor((delta%86400000)/3600000),m=Math.floor((delta%3600000)/60000);return `${day}d ${h}h ${m}m remaining`}
function pulse(){const pending=data.operations.filter(x=>x.status!=='done').length;const soon=data.operations.filter(x=>x.status!=='done'&&parseWhen(x.due)>Date.now()&&parseWhen(x.due)<Date.now()+86400000).length;const done=data.operations.filter(x=>x.status==='done').length;const next=data.events.filter(x=>parseWhen(x.when)>Date.now()).sort((a,b)=>parseWhen(a.when)-parseWhen(b.when))[0];
 $('ascPulse').textContent=`${data.alliance} · S:${data.server||'?'}  |  ${pending} open operations · ${done} completed · ${soon} due within 24h`+(next?`  |  Next: ${next.title} (${countdown(next.when)})`:'  |  No upcoming event saved');}
function render(){
 $('ascAlliance').value=data.alliance;$('ascServer').value=data.server;
 for(const id of ['ascOperations','ascEvents','ascBattles','ascGoals','ascVisualCatalog'])$(id).replaceChildren();
 pulse();
 for(const o of [...data.operations].sort((a,b)=>parseWhen(a.due||'9999')-parseWhen(b.due||'9999'))){
  const sub=`${o.status.toUpperCase()} · ${o.owner||'Unassigned'}`+(o.due?' · '+new Date(o.due).toLocaleString():'');
  const controls=[
   [o.status==='done'?'REOPEN':'MARK DONE',()=>{commit(()=>{o.status=o.status==='done'?'pending':'done'});status('Operation updated. No game action was performed.')}],
   ['TO MISSION',()=>{const m=window.BeardAIMissions;if(!m?.addExternal){status('Mission board is unavailable.');return}const result=m.addExternal({id:'asc-'+o.id,title:o.title,priority:80,guide:'Alliance',reason:`Owner: ${o.owner||'Unassigned'}; deadline: ${o.due||'not set'}`,source:'BeardAI Ascension plan'});if(result.ok){m.openBoard(result.missionId);status('Operation linked to Command board.')}else status(result.message||'Mission was not saved.')}],
   ['REMOVE',()=>{if(confirm('Delete this operation?'))commit(()=>data.operations=data.operations.filter(x=>x.id!==o.id))}]
  ];addRow('ascOperations',o.title,sub,controls);
 }
 if(!data.operations.length)$('ascOperations').append(el('div','No alliance operations yet.','empty-row'));
 for(const e of [...data.events].sort((a,b)=>parseWhen(a.when)-parseWhen(b.when))){
  addRow('ascEvents',e.title,`${new Date(e.when).toLocaleString()} · ${countdown(e.when)}`,[['REMOVE',()=>{if(confirm('Remove this event?'))commit(()=>data.events=data.events.filter(x=>x.id!==e.id))}]]);
 }
 if(!data.events.length)$('ascEvents').append(el('div','Add the actual date of your next event.','empty-row'));
 for(const b of [...data.battles].reverse().slice(0,30)){
  addRow('ascBattles',b.title,`${b.result.toUpperCase()}${b.losses===null?'':' · losses '+format(b.losses)} · ${new Date(b.at).toLocaleDateString()}`,[['REMOVE',()=>{if(confirm('Remove battle report?'))commit(()=>data.battles=data.battles.filter(x=>x.id!==b.id))}]],b.notes?el('p',b.notes,'asc-note'):null);
 }
 if(!data.battles.length)$('ascBattles').append(el('div','Battle reports will appear here.','empty-row'));
 for(const g of data.goals){const pc=g.target>0?Math.min(100,Math.max(0,g.current/g.target*100)):0;
  const outer=el('div',undefined,'asc-goal-wrap');const bar=el('div',undefined,'asc-goal-bar');bar.style.width=pc.toFixed(1)+'%';outer.append(bar);
  addRow('ascGoals',g.title,`${format(g.current)} / ${format(g.target)} · ${pc.toFixed(1)}%`,[['+ UPDATE',()=>{const raw=prompt('New verified current value:',String(g.current));if(raw===null)return;const n=num(raw);if(n===null){status('Please enter a valid nonnegative number.');return}commit(()=>g.current=n)}],['REMOVE',()=>{if(confirm('Remove goal?'))commit(()=>data.goals=data.goals.filter(x=>x.id!==g.id))}]],outer);
 }
 if(!data.goals.length)$('ascGoals').append(el('div','Track your own verified progress.','empty-row'));
 for(const v of data.visuals.slice().reverse().slice(0,25))addRow('ascVisualCatalog',v.label,`Local screenshot example · ${new Date(v.at).toLocaleDateString()} · no image bytes saved`,[['REMOVE',()=>{commit(()=>data.visuals=data.visuals.filter(x=>x.id!==v.id))}]]);
 if(!data.visuals.length)$('ascVisualCatalog').append(el('div','No building screenshots labeled yet.','empty-row'));
}
function add(k,record){if(data[k].length>=max[k]){status('You reached the local '+k+' limit. Export your backup and remove old entries.');return false}return commit(()=>data[k].push({id:uid(),at:stamp(),...record}))}
function fileOut(name,text,mime){const blob=new Blob([text],{type:mime||'text/plain'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
function briefing(){let lines=[`BeardAI Royal Ascension · ${data.alliance} · Server ${data.server}`,'Prepared: '+new Date().toLocaleString(),'', 'OPEN OPERATIONS'];for(const o of data.operations.filter(x=>x.status!=='done'))lines.push(`• ${o.title} | Owner ${o.owner||'TBD'} | Due ${o.due||'TBD'}`);lines.push('','UPCOMING EVENTS');for(const e of data.events.filter(x=>parseWhen(x.when)>Date.now()))lines.push(`• ${e.title} | ${new Date(e.when).toLocaleString()}`);lines.push('','PLAYER-ENTERED GOALS');for(const g of data.goals)lines.push(`• ${g.title} | ${format(g.current)}/${format(g.target)}`);lines.push('','Private player plan. Nothing is automatically posted or performed in Ant Legion.');return lines.join('\n')}
function buildDraft(){const alliance=clean($('ascAlliance').value,24)||'our alliance',server=clean($('ascServer').value,12),cp=clean($('ascRecruitCP').value,24),benefit=clean($('ascRecruitBenefit').value,110)||'active teamwork and well-coordinated events';$('ascRecruitText').value=`⚔ ${alliance}${server?' · S:'+server:''} is recruiting!${cp?' Minimum '+cp+' CP.':''} We value ${benefit}. Join us to coordinate events, learn tactics, and build a stronger team. Message our leadership if interested!`;
 status('Recruitment draft prepared. It is not posted in-game or online.')}
async function clipboard(v){try{await navigator.clipboard.writeText(v);status('Copied locally to clipboard.')}catch{const t=el('textarea');t.value=v;document.body.append(t);t.select();try{document.execCommand('copy');status('Copy requested; check clipboard before using.')}catch{status('Select and copy the draft manually.')}t.remove()}}
function hashDistance(a,b){let n=0;for(let i=0;i<64;i++)if(a[i]!==b[i])n++;return n}
async function imageHash(){const f=$('ascVisualFile').files?.[0];if(!f)throw Error('Select a screenshot');if(f.size>9000000)throw Error('Image must be under 9 MB');if(!['image/png','image/jpeg','image/webp'].includes(f.type))throw Error('Use PNG, JPEG or WEBP');
 const src=URL.createObjectURL(f);try{
  const pic=new Image();await new Promise((resolve,reject)=>{pic.onload=resolve;pic.onerror=()=>reject(Error('Unreadable image'));pic.src=src});
  if(!pic.naturalWidth||!pic.naturalHeight)throw Error('Empty image');
  const canvas=document.createElement('canvas');canvas.width=9;canvas.height=8;const cx=canvas.getContext('2d',{willReadFrequently:true});if(!cx)throw Error('Image analysis unavailable');cx.drawImage(pic,0,0,9,8);
  const pix=cx.getImageData(0,0,9,8).data;let hash='';for(let y=0;y<8;y++)for(let x=0;x<8;x++){const p=(y*9+x)*4,q=p+4;const gray=i=>.299*pix[i]+.587*pix[i+1]+.114*pix[i+2];hash+=gray(p)>gray(q)?'1':'0'}return hash;
 }finally{URL.revokeObjectURL(src)}
}
async function visual(save){try{const hash=await imageHash();if(save){const label=clean($('ascVisualLabel').value,75);if(label.length<3){status('Label must be at least 3 characters.');return}if(add('visuals',{label,hash})){$('ascVisualResult').textContent='Saved a local visual fingerprint for '+label+'. This is a user label, not a trained classifier.';status('Screenshot sample labeled; no image bytes uploaded.')}}else{
  if(!data.visuals.length){$('ascVisualResult').textContent='Learn at least one labeled screenshot first.';return}
  const best=data.visuals.map(v=>({label:v.label,dist:hashDistance(v.hash,hash)})).sort((a,b)=>a.dist-b.dist).slice(0,3);
  $('ascVisualResult').textContent='Closest local fingerprint examples: '+best.map(v=>`${v.label} (${(100-v.dist/64*100).toFixed(1)}% hash similarity)`).join(' · ')+'. These are NOT accuracy/confidence scores. Check the building yourself.';
 }
 }catch(e){$('ascVisualResult').textContent='Image comparison unavailable: '+e.message}}
function init(){
 render();
 $('ascAlliance').addEventListener('change',()=>commit(()=>data.alliance=clean($('ascAlliance').value,24)||'Alliance'));
 $('ascServer').addEventListener('change',()=>commit(()=>data.server=clean($('ascServer').value,12)));
 $('ascAddOperation').addEventListener('click',()=>{const title=clean($('ascOperation').value,110);if(title.length<4){status('Add a descriptive operation title.');return}if(add('operations',{title,owner:clean($('ascOwner').value,50),due:parseWhen($('ascDue').value)?$('ascDue').value:'',status:'pending'})){$('ascOperation').value='';status('Operation saved locally.')}});
 $('ascAddEvent').addEventListener('click',()=>{const title=clean($('ascEventTitle').value,90),when=$('ascEventDate').value;if(title.length<3||!parseWhen(when)){status('Enter a title and valid event date.');return}if(add('events',{title,when})){$('ascEventTitle').value='';status('Event saved locally.')}});
 $('ascAddBattle').addEventListener('click',()=>{const title=clean($('ascBattleTitle').value,100);if(title.length<3){status('Enter the battle name.');return}const losses=$('ascBattleLosses').value===''?null:num($('ascBattleLosses').value,1e12);if($('ascBattleLosses').value!==''&&losses===null){status('Invalid loss count.');return}if(add('battles',{title,result:$('ascBattleResult').value,losses,notes:clean($('ascBattleNotes').value,350)})){$('ascBattleTitle').value='';status('Battle journal entry saved.')}});
 $('ascAddGoal').addEventListener('click',()=>{const title=clean($('ascGoalName').value,90),cur=num($('ascGoalCurrent').value),target=num($('ascGoalTarget').value);if(title.length<3||cur===null||target===null||target<=0){status('Enter a valid goal and positive target.');return}if(add('goals',{title,current:cur,target})){$('ascGoalName').value='';status('Progress goal created.')}});
 $('ascCalculate').addEventListener('click',()=>{const a=num($('ascAvailable').value),c=num($('ascCost').value),q=num($('ascQuantity').value,1e6);if(a===null||c===null||c===0||q===null||q===0||!Number.isInteger(q)){ $('ascCalculation').textContent='Enter valid nonnegative resources, a positive cost and a whole-number quantity.';return}const need=c*q,affordable=Math.floor(a/c),short=Math.max(0,need-a),left=Math.max(0,a-need);if(!Number.isSafeInteger(need)||!Number.isSafeInteger(affordable)){ $('ascCalculation').textContent='Values are too large for exact whole-number calculations. Use smaller values.';return} $('ascCalculation').textContent=`Plan cost ${format(need)} · Affordable now ${format(affordable)} actions · ${short?'Shortfall '+format(short):'Surplus '+format(left)}. Inputs are player supplied; no Ant Legion recipe verified.`});
 $('ascRecruitBuild').addEventListener('click',buildDraft);$('ascRecruitCopy').addEventListener('click',()=>clipboard($('ascRecruitText').value));
 $('ascBrief').addEventListener('click',()=>{fileOut('BeardAI_Royal_War_Brief.txt',briefing());status('War brief downloaded locally. No online message sent.')});
 $('ascBackup').addEventListener('click',()=>{fileOut('BeardAI_Ascension_Backup_v2.json',JSON.stringify(data,null,2),'application/json');status('Ascension JSON backup downloaded. Keep it private.')});
 $('ascRestore').addEventListener('click',()=>{try{const raw=$('ascRestoreText').value;if(raw.length>125000)throw Error('Backup too large');const verified=sanitize(JSON.parse(raw));if(!confirm('Replace local Ascension operations, events, goals, battles and screenshot labels with this backup? Other BeardAI tabs remain unchanged.'))return;let old=data;data=verified;if(!persist()){data=old;return}render();status('Validated Ascension backup imported successfully.')}catch(e){status('Import rejected: '+e.message)}});
 $('ascVisualSave').addEventListener('click',()=>visual(true));$('ascVisualCompare').addEventListener('click',()=>visual(false));
 setInterval(()=>{if($('tab-ascend').classList.contains('active')){pulse();for(const e of $('ascEvents').querySelectorAll('.asc-card')){ /* list refresh only on active tab every minute */ }}},60000);
}
window.BeardAIAscension={get:()=>JSON.parse(JSON.stringify(data)),sanitize,briefing,hashDistance};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
