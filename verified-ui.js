(()=>{
'use strict';
const bundled=window.BEARDAI_VERIFIED;
let data=bundled;
if(!data||!Array.isArray(data.facts))return;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const cats=['All','Specialized Ants','Patch Notes','Fundamentals'];
let chosen='All',selected=null;
function link(url){if(typeof url!=='string'||!/^https:\/\//i.test(url))return;if(window.BeardNative&&typeof window.BeardNative.openReference==='function'){window.BeardNative.openReference(url)}else{window.open(url,'_blank','noopener,noreferrer')}}
function card(x){const name=x.title;const status=x.level==='official'?'PUBLISHER-PUBLISHED':x.level==='historical_correlated'?'HISTORICAL · 2 GUIDES':'ARCHIVED PATCH NOTES';return `<button type="button" class="smart-entry" data-v-id="${esc(x.id)}"><span><span class="smart-entry-name">${esc(name)}</span><span class="smart-entry-desc">${esc(x.detail.slice(0,120))}</span><span class="v-meta">${esc(x.version)}</span></span><span class="smart-category ${x.level==='official'?'':'unverified'}">${esc(status)}</span></button>`}
function detail(x){selected=x.id;$('vEvidence').textContent=x.level==='official'?'PUBLISHER SOURCE':x.level==='historical_correlated'?'HISTORICAL SOURCES':'VERSION ARCHIVE';$('vDetail').innerHTML=`<h3>${esc(x.title)}</h3><div class="v-label ${x.level==='official'?'':'history'}">${esc(x.level==='official'?'Published by game publisher':x.level==='historical_correlated'?'Corroborated old guides; current status unverified':'Third-party archived changelog')}</div><p>${esc(x.detail)}</p><div class="v-meta">Category: ${esc(x.category)} · Applicable timeframe: ${esc(x.version||'not recorded')}</div>${x.gameplay?`<p><strong>How to obtain:</strong> ${esc(x.acquisition)}</p>`:''}${x.notes?`<div class="v-warning">${esc(x.notes)}</div>`:''}<strong>Evidence links</strong><div id="vSources">${x.sources.map((s,i)=>`<button class="v-source" type="button" data-url="${esc(s.url)}">${i+1}. ${esc(s.label)} ↗</button>`).join('')}</div><div class="v-meta">Source references establish a published claim—not direct verification inside your game.</div>`;
$('vDetail').querySelectorAll('[data-url]').forEach(b=>b.addEventListener('click',()=>link(b.dataset.url)));
}
function render(){const text=$('vSearch').value.trim().toLowerCase();const list=data.facts.filter(x=>(chosen==='All'||x.category===chosen)&&(!text||(x.title+' '+x.detail+' '+x.version+' '+x.acquisition).toLowerCase().includes(text)));$('vCount').textContent=data.facts.length+' SOURCED';$('vPending').textContent=data.researchQueue.length;$('vSummary').textContent=list.length+' of '+data.facts.length+' source-backed records · '+data.facts.filter(x=>x.level==='official').length+' publisher-posted · '+data.facts.filter(x=>x.level==='historical_correlated').length+' corroborated historical ants · not exhaustive.';$('vList').innerHTML=list.length?list.map(card).join(''):'<div class="empty-row">No matching facts. This entry may need fresh source evidence.</div>';$('vList').querySelectorAll('[data-v-id]').forEach(b=>b.addEventListener('click',()=>detail(data.facts.find(x=>x.id===b.dataset.vId))));}
function setup(){const host=$('vFilters');if(!host)return;host.innerHTML=cats.map(x=>`<button class="smart-chip ${x===chosen?'active':''}" data-cat="${esc(x)}">${esc(x)}</button>`).join('');host.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{chosen=b.dataset.cat;host.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()}));$('vSearch').addEventListener('input',render);$('vDiscord').addEventListener('click',()=>link(data.discord.officialServerUrl));$('vDiscordDev').addEventListener('click',()=>link('https://discord.com/developers/docs'));
render();renderPatchNotes();detail(data.facts.find(x=>x.id==='ant-arcane')||data.facts[0]);}
function renderPatchNotes(){const updates=data.facts.filter(x=>x.category==='Patch Notes').reverse();$('vUpdates').innerHTML=updates.map(card).join('');$('vUpdates').querySelectorAll('[data-v-id]').forEach(b=>b.addEventListener('click',()=>{detail(data.facts.find(x=>x.id===b.dataset.vId));const target=$('vDetail');if(target&&target.scrollIntoView)target.scrollIntoView({behavior:'smooth',block:'center'})}));}
// Review-sync replaces by ID with editor-approved publisher claims, but keeps dated historical records distinct.
window.BEARDAI_APPLY_APPROVED=function(approved){
 if(!approved||!Array.isArray(approved.facts))return;
 const map=new Map(bundled.facts.map(x=>[x.id,x]));
 for(const x of approved.facts){if(x&&x.level==='official')map.set(x.id,Object.assign({},x,{approvedDataset:approved.datasetVersion}));}
 data=Object.assign({},bundled,{facts:Array.from(map.values())});
 render();renderPatchNotes();
 if(selected){const match=data.facts.find(x=>x.id===selected);if(match)detail(match);}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
