(()=>{
'use strict';
const $=id=>document.getElementById(id);
if(!$('rvReviewPanel'))return;
const native=window.BeardNative||null;
const storageKey='beardai-review-queue-v1';
const url='https://raw.githubusercontent.com/AntonioRose-design/BeardAI-Downloads/main/verified/approved-facts-v1.json';
const allowedLevels=['official'];
const maxNotes=40;
let queue=[];
let previousState='';
let activeVersion='bundled';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\"':'&quot;'}[c]||'&#39;'));
const trim=(s,n)=>String(s||'').trim().slice(0,n);
function redact(t){return String(t||'').replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[EMAIL REDACTED]').replace(/\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,'[PHONE REDACTED]');}
function setStatus(t){$('rvStatus').textContent=t;}
function getQueue(){try{const v=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(v)?v.slice(0,maxNotes).filter(x=>x&&typeof x==='object'):[]}catch{return []}}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(queue))}catch{setStatus('Could not save locally. Check device storage.')}}
function renderQueue(){
 $('rvQueueCount').textContent=queue.length+' LOCAL';
 $('rvQueue').innerHTML=queue.length?queue.map(x=>`<div class="rv-queue-row"><strong>${esc(x.claim)}</strong><div class="rv-note">${esc(x.version||'Version not specified')} · LOCAL / UNVERIFIED · ${esc(x.createdAt)}</div><div class="rv-note">${esc(x.evidence.slice(0,180))}${x.evidence.length>180?'…':''}</div><div class="rv-queue-actions"><button type="button" data-edit="${esc(x.id)}">EDIT</button><button type="button" data-export="${esc(x.id)}">REVIEW & SHARE ↗</button><button type="button" data-delete="${esc(x.id)}">DELETE</button></div></div>`).join(''):'<div class="empty-row">No private evidence drafts yet. Add one above.</div>';
 $('rvQueue').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>{const x=queue.find(y=>y.id===b.dataset.edit);if(!x)return;$('rvClaim').value=x.claim;$('rvVersion').value=x.version;$('rvSource').value=x.source;$('rvEvidence').value=x.evidence;setStatus('Editing a copy. Save creates a new draft; delete the old draft separately.');$('rvClaim').focus()}));
 $('rvQueue').querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{if(!confirm('Delete this local observation?'))return;queue=queue.filter(x=>x.id!==b.dataset.delete);persist();renderQueue()}));
 $('rvQueue').querySelectorAll('[data-export]').forEach(b=>b.addEventListener('click',()=>share(queue.find(x=>x.id===b.dataset.export))));
}
function collect(){return {claim:trim($('rvClaim').value,140),version:trim($('rvVersion').value,90),source:trim($('rvSource').value,500),evidence:trim($('rvEvidence').value,2400)}}
function clearForm(){for(const id of ['rvClaim','rvVersion','rvSource','rvEvidence'])$(id).value=''}
function save(){let x=collect();if(x.claim.length<5||x.evidence.length<8){setStatus('Enter a descriptive claim (5+ characters) and evidence (8+ characters).');return}if(x.source&&(!/^https:\/\//i.test(x.source)||x.source.includes(' '))){setStatus('Source link must begin with https:// or be blank.');return}if(queue.length>=maxNotes){setStatus('Local queue is full. Delete or export old drafts first.');return}x.id='note-'+Date.now()+'-'+Math.floor(Math.random()*100000);x.createdAt=new Date().toISOString();x.status='unverified_local';queue.unshift(x);persist();renderQueue();clearForm();setStatus('Saved on this device. No network request or submission occurred.')}
function share(x){if(!x)return;
 const reviewed={format:'beardai-user-evidence-v1',status:'UNVERIFIED_SUBMISSION',note:'User-supplied observation. Verify against source and in-game version before approval.',claim:trim(x.claim,140),version:trim(x.version,90),source:trim(x.source,500),evidence:trim(x.evidence,2400),recordedAt:x.createdAt};
 const payload=JSON.stringify(reviewed,null,2);
 const confirmation='READ THIS EXACT EVIDENCE BEFORE SENDING:\n\n'+payload.slice(0,4000)+'\n\nCould this reveal a player name, account ID, location, coordinates or private chat? Press OK ONLY if you approve sharing it with your chosen app.';
 if(!confirm(confirmation))return;
 if(native&&typeof native.shareReviewedEvidence==='function'){native.shareReviewedEvidence(payload);setStatus('Android share chooser opened. Data goes only where you explicitly choose to send it.');}
 else{const blob=new Blob([payload],{type:'application/json'});const loc=URL.createObjectURL(blob);const a=document.createElement('a');a.href=loc;a.download='BeardAI_Unverified_Evidence_'+x.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(loc),1000);setStatus('Saved a local JSON file. No data was sent to a server.');}
}
function captureOCR(){if(!native||typeof native.status!=='function'){setStatus('Last OCR is only available inside the Android app; you can paste observations manually on Windows.');return}
 try{const s=JSON.parse(native.status());const lines=Array.isArray(s.ocrLines)?s.ocrLines:[];const raw=lines.map(x=>x.text||'').filter(Boolean).join('\n').slice(0,2000);if(!raw){setStatus('No recognized OCR transcript yet. Start Vision, capture game text, and return here.');return}
 $('rvEvidence').value=redact(raw);setStatus('Imported recognized text with email/phone redaction. REVIEW IT MANUALLY for names, coordinates, chats or account IDs before saving.');}
 catch{setStatus('Could not read the latest local OCR text.')}}
function validate(payload){if(!payload||payload.schemaVersion!==1||!/^\d{4}-\d\d-\d\d\.\d{1,5}$/.test(payload.datasetVersion||'')||!Array.isArray(payload.facts)||payload.facts.length<1||payload.facts.length>500)throw Error('Invalid approved dataset');const ids=new Set();for(const f of payload.facts){if(!f||typeof f.id!=='string'||ids.has(f.id)||typeof f.title!=='string'||typeof f.detail!=='string'||f.detail.length>3000||!allowedLevels.includes(f.level)||!Array.isArray(f.sources)||!f.sources.length||f.sources.some(s=>!s||typeof s.url!=='string'||!s.url.startsWith('https://')))throw Error('Invalid approved fact entry');ids.add(f.id)}return payload}
function applyApproved(payload){const checked=validate(payload);activeVersion=checked.datasetVersion;if(typeof window.BEARDAI_APPLY_APPROVED==='function')window.BEARDAI_APPLY_APPROVED(checked);$('rvFeedBadge').textContent='APPROVED '+activeVersion;$('rvSyncInfo').textContent=checked.facts.length+' publisher-attributed records · editorial dataset '+activeVersion+'. User drafts are not included.';}
function initial(){queue=getQueue();renderQueue();if(native&&typeof native.approvedFacts==='function'){try{const raw=native.approvedFacts();if(raw)applyApproved(JSON.parse(raw));}catch{$('rvSyncInfo').textContent='Saved approved dataset invalid; using bundled content.'}}else{try{const raw=localStorage.getItem('beardai-approved-cache-v1');if(raw)applyApproved(JSON.parse(raw));}catch{}}
 $('rvSave').addEventListener('click',save);$('rvUseOCR').addEventListener('click',captureOCR);$('rvSyncButton').addEventListener('click',checkUpdate);
 if(native&&typeof native.approvedSyncState==='function')setInterval(pollAndroid,1200);
}
async function checkUpdate(){const b=$('rvSyncButton');if(b.disabled)return;b.disabled=true;$('rvSyncInfo').textContent='Checking approved source on GitHub. No local evidence is uploaded.';
 if(native&&typeof native.checkApprovedFacts==='function'){try{native.checkApprovedFacts()}catch{$('rvSyncInfo').textContent='Android bridge cannot start update check.';b.disabled=false}return}
 try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);let resp;try{resp=await fetch(url,{cache:'no-store',signal:controller.signal,credentials:'omit'})}finally{clearTimeout(timer)}if(!resp.ok)throw Error('HTTP '+resp.status);const raw=await resp.text();if(raw.length>450000)throw Error('Data too large');const data=validate(JSON.parse(raw));applyApproved(data);try{localStorage.setItem('beardai-approved-cache-v1',JSON.stringify(data))}catch{}}catch(err){$('rvSyncInfo').textContent='Update check failed: '+err.message+'. Bundled content remains available.'}finally{b.disabled=false}
}
function pollAndroid(){if(!native||!native.approvedSyncState)return;let cur;try{cur=native.approvedSyncState()}catch{return}if(cur===previousState)return;previousState=cur;if(cur==='CHECKING'){$('rvSyncInfo').textContent='Checking public approved facts over HTTPS…';return}if(cur.startsWith('READY:')){try{applyApproved(JSON.parse(native.approvedFacts()))}catch{$('rvSyncInfo').textContent='Remote dataset was not usable. The built-in guide is still available.'}$('rvSyncButton').disabled=false}else if(cur.startsWith('ERROR:')){$('rvSyncInfo').textContent='Update check failed ('+cur.slice(6)+'). Bundled guide remains available.';$('rvSyncButton').disabled=false}}
window.BeardAIReview={getQueue:()=>queue.slice(),validate,redact};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initial);else initial();
})();
