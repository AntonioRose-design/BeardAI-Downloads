(()=>{'use strict';
function start(){
const button=document.createElement('button');button.textContent='📜 1K Feature Map';button.style.cssText='position:fixed;bottom:156px;right:12px;z-index:99995;padding:9px;border:1px solid #b89c6d;border-radius:8px;background:#163540;color:#eee5cf;cursor:pointer';button.setAttribute('aria-expanded','false');
const modal=document.createElement('section');modal.hidden=true;modal.setAttribute('aria-label','5.0 roadmap inventory');modal.style.cssText='position:fixed;inset:12px;z-index:99999;max-width:850px;max-height:90vh;margin:auto;overflow:auto;padding:18px;box-sizing:border-box;border:2px solid #b89c6d;border-radius:14px;background:#0d2530;color:#eff4f1;font:14px system-ui';
const h=document.createElement('h2');h.textContent='BeardAI 5.0 · 1,000-Feature Map';modal.append(h);
const info=document.createElement('p');info.textContent='An auditable engineering roadmap. Planned items are not automatically implemented, tested or released.';modal.append(info);
const close=document.createElement('button');close.textContent='Close';close.addEventListener('click',()=>{modal.hidden=true;button.setAttribute('aria-expanded','false');button.focus()});modal.append(close);
const stats=document.createElement('p');stats.setAttribute('role','status');modal.append(stats);
const input=document.createElement('input');input.placeholder='Search feature or category';input.setAttribute('aria-label','Search features');input.style.cssText='padding:10px;max-width:100%;width:350px;margin:10px';modal.append(input);
const select=document.createElement('select');select.style.padding='10px';modal.append(select);const list=document.createElement('div');modal.append(list);
let features=null;
function makeOption(text){const option=document.createElement('option');option.value=text;option.textContent=text;select.append(option)}
makeOption('All systems');
async function load(){if(features)return;stats.textContent='Loading the feature inventory…';
try{const res=await fetch('feature-matrix.json',{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);
const result=await res.json();
if(result.count!==1000||!Array.isArray(result.features)||result.features.length!==1000)throw new Error('Invalid feature inventory');
features=result.features;for(const system of [...new Set(features.map(x=>x.system))])makeOption(system);render();
}catch(e){stats.textContent='Feature catalogue unavailable: '+e.message+'. Local Workbench remains usable.'}}
function render(){if(!features)return;list.replaceChildren();const q=input.value.toLowerCase().trim();
const subset=features.filter(x=>(select.value==='All systems'||x.system===select.value)&&(x.title+' '+x.requirement+' '+x.system+' '+x.id).toLowerCase().includes(q));
const counts=features.reduce((obj,x)=>(obj[x.status]=(obj[x.status]||0)+1,obj),{});
stats.textContent=features.length+' tracked across 40 systems · '+(counts.planned||0)+' planned · '+(counts.implemented||0)+' implemented · '+(counts.tested||0)+' tested · '+(counts.released||0)+' released · '+subset.length+' shown';
for(const x of subset.slice(0,125)){const el=document.createElement('article');el.style.cssText='padding:10px 0;border-bottom:1px solid #496573';
const title=document.createElement('strong');title.textContent='#'+x.id+' '+x.title;el.append(title);
const sub=document.createElement('p');sub.textContent=x.system+' · '+x.status+' — '+x.requirement;el.append(sub);list.append(el)}
if(subset.length>125){const notice=document.createElement('p');notice.textContent='Showing first 125 results; refine your search for the rest.';list.append(notice)}
if(subset.length===0){const notice=document.createElement('p');notice.textContent='No results.';list.append(notice)}
}
button.addEventListener('click',()=>{modal.hidden=!modal.hidden;button.setAttribute('aria-expanded',String(!modal.hidden));if(!modal.hidden){load();input.focus()}});
input.addEventListener('input',render);select.addEventListener('change',render);
document.body.append(button,modal);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();