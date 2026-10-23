(()=>{
'use strict';
const $=s=>document.getElementById(s);
if(!$('tab-intel'))return;
const KEY='beardai-intelligence-v1', native=window.BeardNative||null;
const materials=[{key:'boxes',label:'Component boxes'},{key:'cores',label:'Fusion cores'},{key:'leaves',label:'Leaves'}];
const tiers=Array.from({length:10},(_,i)=>i+1), stages=[1,2];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const defaultSlot=i=>({name:'Piece '+(i+1),level:1,stage:0});
const initial=()=>({schema:'beardai-intelligence-v1',target:10,pieces:Array.from({length:6},(_,i)=>defaultSlot(i)),inventory:{boxes:0,cores:0,leaves:0},recipes:Object.fromEntries(tiers.flatMap(t=>stages.map(n=>[`${t}-${n}`,{boxes:null,cores:null,leaves:null}]))),snapshots:[],draft:{nick:'',cp:'',atk:'',queen:'',note:''}});
const limitNum=(v,max=1e14)=>{if(v===''||v===null||v===undefined)return null;const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=max?n:null};
function sanitize(input){const base=initial();if(!input||input.schema!==base.schema)throw new Error('Not a compatible BeardAI backup');const out={...base,target:tiers.includes(Number(input.target))?Number(input.target):10};
 out.pieces=base.pieces.map((p,i)=>{const v=Array.isArray(input.pieces)?(input.pieces[i]||{}):{};return {name:String(v.name||p.name).slice(0,42),level:tiers.includes(Number(v.level))?Number(v.level):7,stage:[0,1].includes(Number(v.stage))?Number(v.stage):0}});
 for(const m of materials)out.inventory[m.key]=limitNum(input.inventory?.[m.key],1e14)??0;
 for(const tier of tiers)for(const step of stages){const k=`${tier}-${step}`;const v=input.recipes?.[k]||{};for(const m of materials)out.recipes[k][m.key]=limitNum(v[m.key],1e12)}
 out.snapshots=(Array.isArray(input.snapshots)?input.snapshots:[]).slice(-80).filter(s=>s&&typeof s==='object'&&Number.isFinite(Date.parse(s.at))).map(s=>({at:String(s.at).slice(0,40),nick:String(s.nick||'').slice(0,40),cp:limitNum(s.cp),atk:limitNum(s.atk,1e6),queen:limitNum(s.queen,1000),note:String(s.note||'').slice(0,500)}));
 if(input.draft&&typeof input.draft==='object'){for(const k of Object.keys(base.draft))out.draft[k]=String(input.draft[k]||'').slice(0,k==='note'?500:65)}
 return out;
}
let model;try{model=sanitize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch{model=initial()}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(model));return true}catch{return false}};
const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
function stepsFor(piece,target){const found=[];if(!tiers.includes(piece.level)||!tiers.includes(target))return {steps:[],unknown:true};for(let tier=piece.level+1;tier<=target;tier++){if(!tiers.includes(tier))return {steps:found,unknown:true};for(let i=1;i<=2;i++){if(tier===piece.level+1&&i<=piece.stage)continue;found.push(`${tier}-${i}`)}}return {steps:found,unknown:false}}
function compute(m=model){const totals={boxes:0,cores:0,leaves:0},unknown=new Set(),counts={};let needed=0;
 for(const p of m.pieces){const s=stepsFor(p,m.target);if(s.unknown)unknown.add('Unsupported recorded level or target');for(const key of s.steps){needed++;counts[key]=(counts[key]||0)+1;for(const mat of materials){let value=m.recipes[key]?.[mat.key];if(value===null||value===undefined)unknown.add(`${key}: ${mat.label}`);else totals[mat.key]+=value}}}
 const deficits=Object.fromEntries(materials.map(mat=>[mat.key,Math.max(0,totals[mat.key]-(m.inventory[mat.key]||0))]));return {totals,unknown:[...unknown],deficits,needed,counts,complete:unknown.size===0,ready:unknown.size===0&&Object.values(deficits).every(n=>n===0)};
}
// Only use facts the player actually saved in the same browser profile.
// Never synthesize gear names from community references or from a generic review.
function getLocalReviews(){
 try{const direct=window.BeardAIReview?.getQueue?.();if(Array.isArray(direct))return direct.filter(x=>x&&typeof x==='object');
 const raw=JSON.parse(localStorage.getItem('beardai-review-queue-v1')||'[]');return Array.isArray(raw)?raw.filter(x=>x&&typeof x==='object'):[]}
 catch{return []}
}
const isGearReview=x=>/gear|scorpion|fusion|workshop|equipment/i.test(`${x.claim||''} ${x.evidence||''}`);
function cleanGearName(s){
 let n=String(s||'').trim().replace(/^[-•*\s]+/,'').replace(/^['"“”]+|['"“”]+$/g,'')
 .replace(/\s*\((?:Lv\.?|Level|Fusion|Stage)\s*[^)]*\)/ig,'')
 .replace(/\s*[|]\s*(?:Lv\.?|Level|Fusion|Stage)\s*\d+.*$/i,'')
 .replace(/\s+[-–—]\s+(?:Lv\.?|Level|Fusion|Stage|Costs?|Material|Boxes)\b.*$/i,'')
 .trim();
 if(n.length<3||n.length>42||/^piece\s*\d+$/i.test(n)||/^gear\s*\d+$/i.test(n))return '';
 if(/^(?:mechanical\s+scorpion\s+gear|fusion\s+(?:requirement|cost)|unknown|level\s*\d+|six\s+pieces)/i.test(n))return '';
 if(/[<>\\{}]/.test(n))return '';
 return n;
}
function parseSixNames(text){
 // Explicit ordered, numbered names receive the strongest confidence.
 const matches=new Map();
 for(const line of String(text||'').split(/\r?\n/)){
  const m=line.trim().match(/^(?:(?:slot|gear|piece|part)\s*#?\s*)?([1-6])\s*[).:：=\-–]\s*(.+)$/i)
    ||line.trim().match(/^(?:slot|gear|piece|part)\s*#?\s*([1-6])\s+(.+)$/i);
  if(m){const n=cleanGearName(m[2]);if(n)matches.set(Number(m[1]),n)}
 }
 if(matches.size===6){const names=Array.from({length:6},(_,i)=>matches.get(i+1));if(new Set(names.map(x=>x.toLowerCase())).size===6)return names}
 // Also recognize an explicitly labelled six-name list on one line.
 const list=String(text||'').match(/(?:six\s+(?:gear\s+)?(?:names|pieces)|(?:gear|piece|equipment)\s+names)\s*[:=]\s*([^\n]+)/i);
 if(list){const names=list[1].split(/[,;|]/).map(cleanGearName);if(names.length===6&&names.every(Boolean)&&new Set(names.map(x=>x.toLowerCase())).size===6)return names}
 return null;
}
function namesFromReviews(){const records=getLocalReviews().filter(isGearReview)
 .sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0));
 for(const review of records){const names=parseSixNames(String(review.evidence||'')+'\n'+String(review.claim||''));if(names)return {names,source:review.claim||'latest review',at:review.createdAt||''}}
 // Six separate named gear reviews can be used only if each claim explicitly has its slot number.
 const slots=new Map();for(const x of records){const match=String(x.claim||'').match(/^(?:slot|gear|piece)\s*#?\s*([1-6])\s*[:=\-–]\s*(.*)$/i);
  if(!match)continue;const name=cleanGearName(match[2]);if(name&&!slots.has(Number(match[1])))slots.set(Number(match[1]),name)}
 if(slots.size===6){const names=Array.from({length:6},(_,i)=>slots.get(i+1));if(new Set(names.map(x=>x.toLowerCase())).size===6)return {names,source:'six numbered gear review entries',at:records[0]?.createdAt||''}}
 return {names:null,source:records[0]?.claim||'',at:records[0]?.createdAt||'',count:records.length};
}
function statusReview(s){const el=$('intelReviewStatus');if(el)el.textContent=s}
function useLatestReview(auto=false){
 const result=namesFromReviews();
 if(!result.names){if(!auto)statusReview(result.count?`Found your last saved gear review (“${result.source.slice(0,75)}”), but it does not contain six clearly numbered gear names. Your existing names and progress were kept. Edit the review if you want BeardAI to import it.`:'No saved named gear review found in this browser profile. Your existing six-piece setup was kept.');return false}
 const current=model.pieces.map(x=>x.name),already=current.every((x,i)=>x===result.names[i]);
 if(already){statusReview('The six in-game names already match your latest saved review; no changes needed.');return true}
 const customized=current.some((x,i)=>x!==defaultSlot(i).name);
 if(auto&&customized){statusReview('Your six existing custom names are preserved. Select Use My Latest Gear Review if you want to replace their names.');return false}
 if(!auto&&customized&&!confirm('Replace ONLY the six gear names with those from your latest saved review? Levels, fusion progress, recipes, and inventory will not change.'))return false;
 const prev=model.pieces.map(x=>({...x}));
 result.names.forEach((name,i)=>{model.pieces[i].name=name});
 if(!persist()){model.pieces=prev;statusReview('Could not save the imported names to local storage. Your previous gear setup has been restored.');return false}
 drawPieces();recompute();statusReview(`Reused all six names from “${result.source.slice(0,75)}”. Levels, materials and fusion progress were preserved. Names remain player-reported, not publisher-verified.`);return true;
}
function drawPieces(){const target=$('intelPieces');target.innerHTML=model.pieces.map((p,i)=>`<div class="intel-piece"><div class="intel-piece-heading"><span>♜ ${esc(p.name)}</span><small>Slot ${i+1}</small></div><label>Nickname <input data-piece="${i}" data-pfield="name" maxlength="42" value="${esc(p.name)}"/></label><div class="intel-piece-bottom"><label>Current level <select data-piece="${i}" data-pfield="level">${tiers.map(t=>`<option value="${t}" ${t===p.level?'selected':''}>${t}</option>`).join('')}</select></label><label>Stages done toward next level <select data-piece="${i}" data-pfield="stage">${[0,1].map(n=>`<option value="${n}" ${n===p.stage?'selected':''}>${n}</option>`).join('')}</select></label></div></div>`).join('');target.querySelectorAll('[data-piece]').forEach(e=>e.addEventListener('change',()=>{const p=model.pieces[Number(e.dataset.piece)];p[e.dataset.pfield]=e.dataset.pfield==='name'?String(e.value).slice(0,42):Number(e.value);persist();recompute()}))}
function drawMaterials(){ $('intelInventory').innerHTML=materials.map(m=>`<label>${m.label} available <input type="number" min="0" max="100000000000000" data-inv="${m.key}" value="${model.inventory[m.key]}" inputmode="numeric" /></label>`).join('');$('intelInventory').querySelectorAll('[data-inv]').forEach(e=>e.addEventListener('input',()=>{model.inventory[e.dataset.inv]=limitNum(e.value)??0;persist();recompute()}));
 $('intelRecipes').innerHTML=tiers.flatMap(t=>stages.map(n=>{const k=`${t}-${n}`;return `<tr><th>To L${t} — fusion ${n}</th>${materials.map(m=>`<td><input type="number" aria-label="${m.label} for tier ${t} stage ${n}" min="0" max="1000000000000" data-recipe="${k}" data-mat="${m.key}" placeholder="Unknown" value="${model.recipes[k][m.key]??''}"/></td>`).join('')}</tr>`})).join('');$('intelRecipes').querySelectorAll('[data-recipe]').forEach(e=>e.addEventListener('input',()=>{model.recipes[e.dataset.recipe][e.dataset.mat]=limitNum(e.value,1e12);persist();recompute()})); }
function recompute(){const x=compute(), missing=x.unknown;
 const above=model.pieces.filter(p=>p.level>model.target);
 $('intelGearStat').textContent=x.needed?x.needed+' STAGES':'TARGET REACHED';
 let html=`<strong>${x.needed} planned fusion stage${x.needed===1?'':'s'} for six pieces</strong><p>${Object.entries(x.counts).map(([key,n])=>`To Level ${esc(key.split('-')[0])}, fusion ${esc(key.split('-')[1])}: ${n} piece${n===1?'':'s'}`).join(' · ')||'No outstanding fusion stages under the entered plan.'}</p>`;
 html+='<p class="intel-muted">Per-piece audit: '+model.pieces.map((p,i)=>esc(p.name)+': L'+p.level+(p.stage?' / fusion '+p.stage+' completed':'')).join(' · ')+'</p>';
 if(above.length)html+='<p class="intel-warning">⚠ '+above.length+' piece(s) already exceed the selected target. Their levels are not reduced; adjust your target to compare all six.</p>';
 html+='<p class="intel-muted">Recipe coverage: '+Object.values(x.counts).reduce((a,b)=>a+b,0)+' fusion stages tracked; '+missing.length+' unresolved field(s). Unverified recipe values never count as free materials.</p>';
 html+='<div class="intel-results-grid">'+materials.map(m=>`<div><small>${m.label}</small><strong>${fmt(x.totals[m.key])} known</strong><span>Inventory ${fmt(model.inventory[m.key])} · ${x.complete?'Shortfall '+fmt(x.deficits[m.key]):'Final shortfall unknown'}</span></div>`).join('')+'</div>';
 html+=missing.length?`<p class="intel-warning">⚠ ${missing.length} unknown recipe field${missing.length===1?'':'s'}. Totals above are <b>partial</b>. Fill in costs before relying on a shortfall calculation: ${esc(missing.slice(0,6).join(', '))}${missing.length>6?'…':''}.</p>`:`<p class="intel-success">${x.ready?'Your entered inventory covers all entered recipe costs. Verify the figures and prerequisites in-game before spending.':'All required costs are entered. See shortages above; exact results depend on your game screenshots.'}</p>`;
 $('intelForgeResult').innerHTML=html;return x}
function fillDraft(){const d=model.draft;for(const [k,id] of Object.entries({nick:'intelNick',cp:'intelCP',atk:'intelAtk',queen:'intelQueen',note:'intelNote'}))$(id).value=d[k]||'';for(const [k,id] of Object.entries({nick:'intelNick',cp:'intelCP',atk:'intelAtk',queen:'intelQueen',note:'intelNote'}))$(id).addEventListener('input',()=>{model.draft[k]=$(id).value.slice(0,k==='note'?500:65);persist()})}
function snapshot(){const d=model.draft,cp=limitNum(d.cp),atk=limitNum(d.atk,1e6),queen=limitNum(d.queen,1000);if([cp,atk,queen].every(v=>v===null)){$('intelProgressResult').textContent='Enter at least one actual in-game numeric stat before saving a snapshot.';return}model.snapshots.push({at:new Date().toISOString(),nick:d.nick.slice(0,40),cp,atk,queen,note:d.note.slice(0,500)});model.snapshots=model.snapshots.slice(-80);persist();showHistory()}
function showHistory(){const ss=model.snapshots;$('intelVaultStat').textContent=String(ss.length);if(!ss.length){$('intelProgressResult').textContent='No verified personal snapshots yet. Enter actual stats and choose Save Snapshot.';$('intelHistory').innerHTML='';return}
 const cur=ss[ss.length-1],prev=ss.length>1?ss[ss.length-2]:null;const items=[['Combat Power','cp'],['Army ATK (%)','atk'],['Queen Level','queen']];$('intelProgressResult').innerHTML=`<strong>Latest snapshot — ${esc(cur.nick||'Unnamed nest')}</strong><div class="intel-results-grid">${items.map(([label,key])=>{const value=cur[key],before=prev?.[key];const diff=before!=null&&value!=null?value-before:null;return `<div><small>${label}</small><strong>${value===null?'Unknown':fmt(value)}</strong><span>${diff===null?'No prior comparison':(diff>=0?'+':'')+fmt(diff)+' since last snapshot'}</span></div>`}).join('')}</div><p class="intel-muted">Manually recorded ${esc(new Date(cur.at).toLocaleString())}. Self-reported; not independently verified by the game.</p>`;
 $('intelHistory').innerHTML=ss.slice(-8).reverse().map(s=>`<div class="intel-history-row"><span>${esc(new Date(s.at).toLocaleString())}</span><strong>${s.cp===null?'—':fmt(s.cp)} CP</strong><small>${esc(s.note||'No note')}</small></div>`).join('')}
function backup(){const body=JSON.stringify({format:'beardai-intelligence-backup-v1',exportedAt:new Date().toISOString(),state:model},null,2);if(native&&typeof native.shareIntelligenceBackup==='function'){native.shareIntelligenceBackup(body);$('intelProgressResult').textContent='Android export chooser opened. Choose a trusted destination for your progress backup.';return}
 const blob=new Blob([body],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='BeardAI_Intelligence_Backup_'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function importBackup(){const raw=$('intelImportText').value.trim();if(raw.length>250000){$('intelProgressResult').textContent='Backup too large. Maximum 250 KB.';return}let imported;try{const x=JSON.parse(raw);if(x.format!=='beardai-intelligence-backup-v1')throw Error('Invalid backup format');imported=sanitize(x.state)}catch(e){$('intelProgressResult').textContent='Import rejected: '+e.message;return}if(!confirm('Replace this device’s local gear planner and snapshots with the imported backup? This cannot be undone without another backup.'))return;model=imported;persist();$('intelTarget').value=String(model.target);drawPieces();drawMaterials();fillDraftFields();recompute();showHistory();$('intelImportText').value='';$('intelProgressResult').textContent='Backup imported locally. No online synchronization or game login occurred.'}
function fillDraftFields(){for(const [k,id] of Object.entries({nick:'intelNick',cp:'intelCP',atk:'intelAtk',queen:'intelQueen',note:'intelNote'}))$(id).value=model.draft[k]||''}
function terms(q){const stop=new Set(['the','a','an','in','is','how','do','i','what','which','does','to','of','for','get','can','my','me','and','about','it','on']);return [...new Set(String(q).toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>=3&&!stop.has(w)))].slice(0,15)}
function lookup(q){const tokens=terms(q);if(!tokens.length)return [];const verified=window.BEARDAI_VERIFIED?.facts||[],guide=window.BEARDAI_KNOWLEDGE?.entries||[];const docs=[...verified.map(x=>({...x,kind:'Reference fact',name:x.title||'',summary:x.detail||'',evidence:x.level||'unknown',source:x.sources?.[0]?.url||'',sourceLabel:x.sources?.[0]?.label||'',extra:x.acquisition||'',period:x.version||''})),...guide.map(x=>({...x,kind:'Building guide',name:x.name||'',summary:x.summary||'',evidence:x.evidence||'community',source:x.source||'',sourceLabel:'community wiki',extra:x.tip||'',period:'Undated community reference'}))];
 return docs.map(d=>{const name=d.name.toLowerCase(),body=(d.summary+' '+d.extra+' '+d.period).toLowerCase(),matched=tokens.filter(t=>name.includes(t)||body.includes(t));return {...d,score:matched.reduce((n,t)=>n+(name.includes(t)?6:2),0),matched:matched.length}}).filter(d=>d.matched>0).sort((a,b)=>b.score-a.score).slice(0,7)}
function ask(){const q=$('intelAsk').value.trim();const results=lookup(q);if(!results.length){$('intelAnswer').innerHTML='<strong>No matching sourced reference found.</strong><p>Try the exact building or ant name, or add a screenshot to the private review queue. BeardAI will not invent missing mechanics.</p>';return}
 $('intelAnswer').innerHTML=`<div class="intel-answer-lead">${results.length} matching reference${results.length===1?'':'s'} · showing what is known, not a guaranteed live-game answer</div>`+results.map((d,i)=>`<article class="intel-answer"><div><strong>${esc(d.name)}</strong><small>${esc(d.kind)} · ${esc(d.evidence)} · ${esc(d.period||'Date unknown')}</small></div><p>${esc(d.summary)}</p>${d.extra?`<p class="intel-muted">${esc(d.extra)}</p>`:''}${/^https:\/\//.test(d.source)?`<a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">Review source ↗</a>`:'<small>Source URL unavailable; treat as unverified.</small>'}</article>`).join('')}
function assess(){const x=compute(),cur=model.snapshots[model.snapshots.length-1];let m=[];if(x.needed&&!x.complete)m.push('Highest value next step: capture exact fusion costs for '+x.unknown.length+' missing fields before opening component boxes.');else if(x.needed&&!x.ready)m.push('Plan the material shortage before upgrading; the calculator lists estimated shortfalls from your entered costs.');else if(x.needed)m.push('Your entered stock appears to cover the configured steps; double-check live in-game requirements before spending.');else m.push('Gear target reached under your recorded piece levels.');if(!cur)m.push('Save your first CP / Army ATK snapshot to establish a progress baseline.');else m.push('Progress baseline recorded on '+new Date(cur.at).toLocaleDateString()+'. Capture and save a new measurement after your next upgrade.');m.push('Daily missions are on the Command tab. The OCR engine supplies suggestions, not completion proof.');$('intelInsight').innerHTML=m.map((s,i)=>`<p><b>${i+1}.</b> ${esc(s)}</p>`).join('')}
function addPriorityMission(){const x=compute();const isUncertain=x.unknown.length>0;const title=x.needed===0?'Verify next gear goal':isUncertain?'Document Mechanical Scorpion fusion costs':x.ready?'Verify upcoming gear upgrade readiness':'Plan Mechanical Scorpion material shortfall';const reason=isUncertain?`${x.unknown.length} recipe cells still unknown; capture and verify each in the workshop.`:x.ready?'Inventory appears sufficient under your manually entered recipes. Inspect the in-game upgrade UI and confirm before using materials.':`Entered recipes indicate material deficits; review stock and plan collection.`;
 const engine=window.BeardAIMissions;
 if(!engine||typeof engine.addExternal!=='function'){$('intelInsight').textContent='Mission Command is unavailable. Keep your goal in the Intelligence planner.';return}
 const result=engine.addExternal({id:'intel-gear-priority',title,reason,priority:isUncertain?91:86,guide:'Mechanical Workshop',source:'BeardAI Intelligence planner — user-entered data'});
 if(!result||!result.ok){$('intelInsight').textContent='Mission NOT saved: '+(result?.message||'unknown error')+' Open Command to review your board.';return}
 $('intelInsight').textContent=result.status==='existing'?'This gear mission already exists. Opening it on the Command board.':'Mission saved successfully. Opening the Command board so you can start or complete it.';
 if(typeof engine.openBoard==='function')engine.openBoard(result.missionId);
}
function useOCR(){if(!native||typeof native.status!=='function'){$('intelInsight').textContent='Android OCR unavailable on desktop. Paste captured game text into the Command tab or record manual measurements.';return}try{const s=JSON.parse(native.status()),lines=s.ocrLines||[];if(!Array.isArray(lines)||!lines.length){$('intelInsight').textContent='No OCR transcript available. Start AI Vision, switch to Ant Legion, then return here.';return}const raw=lines.map(x=>String(x.text||'')).join(' ').slice(0,4000);const advice=window.BeardAIMissions?.recommend(raw)||[];$('intelInsight').innerHTML=`<strong>Current OCR: ${lines.length} lines</strong><p>Screen hint: ${esc(s.screenHint||'Unclassified')}</p>`+(advice.length?advice.slice(0,4).map(x=>`<p>→ ${esc(x.title)} — ${esc(x.reason)}</p>`).join(''):'<p>No rule-supported game task detected.</p>')+'<small>Only keyword matches were used. Inventory values have NOT been auto-filled.</small>'}catch(e){$('intelInsight').textContent='OCR bridge error. Try another capture.'}}
function start(){ $('intelTarget').value=String(model.target);$('intelUseReview').addEventListener('click',()=>useLatestReview(false));$('intelTarget').addEventListener('change',e=>{model.target=Number(e.target.value);persist();recompute()});drawPieces();drawMaterials();fillDraft();recompute();showHistory();$('intelSnapshot').addEventListener('click',snapshot);$('intelBackup').addEventListener('click',backup);$('intelImport').addEventListener('click',importBackup);$('intelAskBtn').addEventListener('click',ask);$('intelAnswer').addEventListener('click',e=>{const link=e.target.closest('a[href]');if(!link||!/^https:\/\//.test(link.href))return;if(native&&typeof native.openReference==='function'){e.preventDefault();native.openReference(link.href)}});$('intelAsk').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ask()}});$('intelUseOCR').addEventListener('click',useOCR);$('intelAnalyzeGoals').addEventListener('click',assess);$('intelPlanMission').addEventListener('click',addPriorityMission);useLatestReview(true);assess()}
window.BeardAIIntelligence={sanitize,compute,lookup,getState:()=>JSON.parse(JSON.stringify(model)),namesFromReviews,useLatestReview,assess:()=>assess()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
