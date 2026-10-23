(()=>{
'use strict';
const $=id=>document.getElementById(id);
const native=window.BeardNative||null;
const db=window.BEARDAI_KNOWLEDGE||{entries:[],referenceLinks:{}};
const entries=db.entries||[];
const categories=['All','Nest','Alliance','World Map','Needs Verification'];
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category='All',search='',selected=null,latest=null,ocrSearch='',lastOCRKey='',overlayKey='',lastSeenHint='';
const get=(key,fallback)=>{try{let s=localStorage.getItem('beardai03_'+key);return s?JSON.parse(s):fallback}catch{return fallback}};
const set=(key,val)=>{try{localStorage.setItem('beardai03_'+key,JSON.stringify(val))}catch{}};
const ensureDate=()=>{const d=new Date(),day=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');return day;};
const findEntry=(name)=>entries.find(e=>e.name.toLowerCase()===String(name||'').toLowerCase()||e.aliases.some(a=>a.toLowerCase()===String(name||'').toLowerCase()))||null;
const toText=e=>[e.name,e.summary,e.tip,...e.aliases].join(' ').toLowerCase();
function chooseKnowledge(id){selected=entries.find(x=>x.id===id)||null;renderGuide();if(selected){$('smartGuideDetailPanel')?.scrollIntoView({behavior:'smooth',block:'start'});}}
function renderGuide(){
 const filtered=entries.filter(e=>(category==='All'||e.category===category)&&(!search||toText(e).includes(search)));
 $('smartGuideCount').textContent=entries.length+' ENTRIES';$('smartGuideSummary').textContent=`${filtered.length} results · ${entries.filter(e=>e.category==='Needs Verification').length} entries need newer evidence · offline reference`;
 $('smartGuideFilters').innerHTML=categories.map(c=>`<button class="smart-chip ${category===c?'active':''}" data-guide-category="${html(c)}">${html(c)}</button>`).join('');
 $('smartGuideFilters').querySelectorAll('[data-guide-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.guideCategory;renderGuide();}));
 $('smartGuideList').innerHTML=filtered.length?filtered.map(e=>`<button class="smart-entry ${selected?.id===e.id?'active':''}" data-guide-id="${html(e.id)}"><span><span class="smart-entry-name">${html(e.name)}</span><span class="smart-entry-desc">${html(e.summary)}</span></span><span class="smart-category ${e.category==='Needs Verification'?'unverified':''}">${html(e.category)}</span></button>`).join(''):'<div class="empty-row">No matches. Try a different building name.</div>';
 $('smartGuideList').querySelectorAll('[data-guide-id]').forEach(b=>b.addEventListener('click',()=>chooseKnowledge(b.dataset.guideId)));
 renderDetail();
}
function renderDetail(){
 const root=$('smartGuideDetail');if(!selected){root.textContent='Select a building or activity above. Each entry includes research provenance and suggested checks.';return;}
 $('smartGuideEvidence').textContent=selected.category==='Needs Verification'?'NEEDS PROOF':'COMMUNITY REFERENCE';
 const notes=get('notes',{}), note=notes[selected.id]||'';
 root.innerHTML=`<h3>${html(selected.name)}</h3><span class="smart-category ${selected.category==='Needs Verification'?'unverified':''}">${html(selected.category)}</span><p>${html(selected.summary)}</p><p><strong>Suggested check:</strong> ${html(selected.tip)}</p><p><strong>Evidence:</strong> ${html(selected.evidence)}. Confirm current gameplay UI before drawing conclusions.</p>${selected.source?`<a class="source" href="${html(selected.source)}" target="_blank" rel="noopener noreferrer">Community reference ↗</a>`:'<p><em>Unverified: no authoritative mechanics source yet.</em></p>'}<p><strong>Your private field notes:</strong></p><textarea id="smartNote" class="smart-note" maxlength="2500" placeholder="What does this building show on your current game screen?">${html(note)}</textarea><div class="smart-actions"><button type="button" id="smartSaveNote" class="text-btn">SAVE NOTE</button><button type="button" id="smartPlan" class="smart-main-button">+ PLAN MANUAL CHECK</button></div>`;
 root.querySelectorAll('a.source').forEach(a=>a.addEventListener('click',event=>{if(native&&native.openReference){event.preventDefault();native.openReference(a.href);}}));
 $('smartSaveNote').addEventListener('click',()=>{const all=get('notes',{});all[selected.id]=$('smartNote').value;set('notes',all);$('smartSaveNote').textContent='✓ SAVED';});
 $('smartPlan').addEventListener('click',()=>{const name='Review '+selected.name;if(native){native.addTask(name);$('smartPlan').textContent='✓ SAVED TO PLAN';}else{const key='beardaiTasks',list=JSON.parse(localStorage.getItem(key)||'[]');list.push({id:Date.now(),title:name});localStorage.setItem(key,JSON.stringify(list));$('smartPlan').textContent='✓ SAVED TO PLAN';}});
}
function renderOCR(){if(!latest)return;
 const lines=Array.isArray(latest.ocrLines)?latest.ocrLines:[];
 const analyzed=latest.ocrFrameId&&String(latest.ocrFrameId)===String(latest.frameId);
 const key=[latest.frameId,latest.ocrFrameId,latest.ocrStatus,ocrSearch].join('|');
 $('smartOCRStatus').textContent=latest.ocrStatus||'WAITING';
 $('smartScreenHint').textContent=`Text-based screen hint: ${analyzed?latest.screenHint||'Unclassified':'Processing frame…'} — not verified gameplay state`;
 if(key!==lastOCRKey){
  const filtered=lines.filter(x=>String(x.text||'').toLowerCase().includes(ocrSearch));
  $('smartOCRCount').textContent=`${lines.length} captured OCR lines · ${filtered.length} matching search · Frame ${latest.frameId||'none'}`;
  $('smartOCRList').innerHTML=filtered.length?filtered.map((t,i)=>`<div class="smart-line"><span style="color:#78bc93">${i+1}. </span>${html(t.text)}</div>`).join(''):'<div class="empty-row">No OCR text matched. If the screenshot has readable words, check whether the capture is still processing or review Logs.</div>';
  lastOCRKey=key;
 }
 const found=analyzed?findEntry(latest.screenHint):null;
 if(found){$('smartAdvice').textContent=`Detected text suggests: ${found.name}. ${found.summary} Next check: ${found.tip} This is a text-based reference, not a verified screen or automated action.`;lastSeenHint=found.id;}
 else {$('smartAdvice').textContent='No specific game screen could be classified from OCR titles yet. Use the Guide tab or search text manually. Capturing a readable building title helps.';lastSeenHint='';}
 renderTextBoxes();
}
function renderTextBoxes(){
 const layer=$('smartBoxes'),img=$('visionFrame'),wrap=$('visionViewport');
 if(!layer||!img||!wrap)return;
 if(!$('smartAllBoxes').checked){layer.innerHTML='';overlayKey='';return;}
 if(!latest||!latest.width||!latest.height||!img.naturalWidth||img.hidden)return;
 // The native screenshot image and OCR are frame-linked. Avoid overlaying stale boxes.
 if(String(latest.ocrFrameId)!==String(latest.frameId))return;
 const lines=Array.isArray(latest.ocrLines)?latest.ocrLines:[];
 const key=[latest.frameId,lines.length,wrap.clientWidth,wrap.clientHeight].join('|');if(key===overlayKey)return;overlayKey=key;
 const scale=Math.min(wrap.clientWidth/latest.width,wrap.clientHeight/latest.height),ox=(wrap.clientWidth-latest.width*scale)/2,oy=(wrap.clientHeight-latest.height*scale)/2;
 layer.innerHTML='';
 for(const b of lines.slice(0,85)){
  const x=Number(b.x),y=Number(b.y),w=Number(b.w),h=Number(b.h);
  if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)continue;
  let element=document.createElement('div');element.className='smart-all-box';element.title=String(b.text||'').slice(0,120);
  element.style.left=(ox+x*scale)+'px';element.style.top=(oy+y*scale)+'px';element.style.width=(w*scale)+'px';element.style.height=(h*scale)+'px';layer.appendChild(element);
 }
}
const defaults=['Check daily quests','Review Healing Pool','Review troop-training queues','Check Research Lab','Review resource collection','Review Peanut and alliance help','Review alliance responsibilities'];
function checklistData(){return get('checklist',{});}
function renderChecklist(){
 const d=ensureDate(),data=checklistData(),today=data.day===d?data.checked:{},custom=get('customChecklist',[]),list=[...defaults,...custom];
 $('smartChecklistCount').textContent=`${list.filter(x=>today[x]).length} / ${list.length}`;
 $('smartChecklist').innerHTML=list.map((v,i)=>`<label class="smart-checkrow ${today[v]?'done':''}"><input type="checkbox" data-check="${html(v)}" ${today[v]?'checked':''}/><span>${html(v)}</span>${i>=defaults.length?`<button aria-label="Remove ${html(v)}" data-del-check="${html(v)}" type="button">×</button>`:''}</label>`).join('');
 $('smartChecklist').querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{let state=checklistData();if(state.day!==d)state={day:d,checked:{}};state.checked[el.dataset.check]=el.checked;set('checklist',state);renderChecklist();}));
 $('smartChecklist').querySelectorAll('[data-del-check]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();let custom=get('customChecklist',[]).filter(v=>v!==el.dataset.delCheck);set('customChecklist',custom);renderChecklist();}));
}
function poll(){if(!native)return;try{latest=JSON.parse(native.status());renderOCR()}catch(e){$('smartOCRStatus').textContent='BRIDGE ERROR'}}
function setup(){
 $('smartGuideSearch').addEventListener('input',e=>{search=e.target.value.toLowerCase().trim();renderGuide()});
 $('smartOCRSearch').addEventListener('input',e=>{ocrSearch=e.target.value.toLowerCase().trim();lastOCRKey='';renderOCR()});
 $('smartAllBoxes').addEventListener('change',()=>{overlayKey='';renderTextBoxes()});
 $('smartShare').addEventListener('click',()=>{if(native&&native.exportVision)native.exportVision();else{const text=(latest?.ocrLines||[]).map(x=>x.text).join('\n');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text);else alert('OCR export requires the installed Android app.');}});
 $('smartGuideFromOCR').addEventListener('click',()=>{const e=entries.find(x=>x.id===lastSeenHint);const tab=document.querySelector('[data-tab="knowledge"]');tab?.click();if(e)chooseKnowledge(e.id)});
 $('smartResetChecklist').addEventListener('click',()=>{set('checklist',{day:ensureDate(),checked:{}});renderChecklist()});
 $('smartAddChecklist').addEventListener('click',()=>{const next=window.prompt('Name a manual check to add to today’s list:');if(!next)return;const title=String(next).trim().slice(0,72);if(!title)return;const list=get('customChecklist',[]);if(!list.includes(title)&&list.length<30){list.push(title);set('customChecklist',list)}renderChecklist()});
 const img=$('visionFrame');img?.addEventListener('load',()=>{overlayKey='';renderTextBoxes()});
 window.addEventListener('resize',()=>{overlayKey='';renderTextBoxes()});
 const container=$('visionViewport');const boxes=document.createElement('div');boxes.className='boxes';boxes.id='smartBoxes';container.appendChild(boxes);
 renderGuide();renderChecklist();
 if(native){poll();setInterval(poll,2200);}else{$('smartOCRStatus').textContent='BROWSER PREVIEW';$('smartScreenHint').textContent='OCR and screen analysis require the installed BeardAI Android app.';}
}
document.addEventListener('DOMContentLoaded',setup);
})();
