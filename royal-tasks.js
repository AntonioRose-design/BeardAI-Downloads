(()=>{
'use strict';
const KEY='beardai-royal-automations-v1';
const load=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.slice(0,100):[]}catch{return []}};
let tasks=load();
const save=()=>{localStorage.setItem(KEY,JSON.stringify(tasks))};
const el=(tag,txt)=>{const n=document.createElement(tag);if(txt)n.textContent=txt;return n};
function start(){
 const trigger=el('button','📅 Tasks');trigger.type='button';trigger.style.cssText='position:fixed;bottom:12px;right:12px;z-index:99998;padding:12px 15px;background:#193d30;color:#fff;border:2px solid #c1a252;border-radius:10px;cursor:pointer';
 const panel=el('section');panel.hidden=true;panel.style.cssText='box-sizing:border-box;position:fixed;z-index:99998;right:12px;bottom:65px;width:min(370px,calc(100vw - 24px));max-height:76vh;overflow:auto;padding:15px;border:2px solid #c1a252;border-radius:12px;background:#10251c;color:#f5eccc;font:14px system-ui,sans-serif;box-shadow:0 6px 25px #000b';
 const heading=el('h3','Royal Tasks & Reminders');panel.append(heading);
 panel.append(el('p','Tasks are stored on this device. Due reminders appear while BeardAI is open; no game actions or background execution.'));
 const name=el('input');name.placeholder='e.g. Review Scorpion fusion costs';name.maxLength=100;name.style.width='95%';panel.append(name);
 const due=el('input');due.type='datetime-local';due.style.cssText='display:block;margin:8px 0';panel.append(due);
 const repeat=el('select');for(const [v,t] of [['none','One time'],['daily','Daily'],['weekly','Weekly']]){const o=el('option',t);o.value=v;repeat.append(o)}panel.append(repeat);
 const add=el('button','Add task');add.type='button';add.style.margin='8px';panel.append(add);
 const exportBtn=el('button','Export JSON');exportBtn.type='button';panel.append(exportBtn);
 const list=el('div');panel.append(list);
 function render(){
  list.replaceChildren();
  const now=Date.now();const dueCount=tasks.filter(t=>!t.done&&Date.parse(t.due)<=now).length;
  trigger.textContent=dueCount?'📅 Tasks ('+dueCount+' due)':'📅 Tasks';
  const summary=el('p',tasks.length+' saved · '+dueCount+' due');list.append(summary);
  for(const t of tasks.slice().sort((a,b)=>Date.parse(a.due)-Date.parse(b.due))){
   const row=el('div');row.style.cssText='padding:9px;border-top:1px solid #4b624e';
   const label=el('div',(t.done?'✓ ':'')+t.title);row.append(label);
   const date=el('small',new Date(t.due).toLocaleString()+' · '+t.repeat+(Date.parse(t.due)<=now&&!t.done?' · DUE':''));row.append(date);
   const done=el('button',t.done?'Reopen':'Complete');done.type='button';done.addEventListener('click',()=>{
    const current=tasks.find(x=>x.id===t.id);if(!current)return;
    if(current.repeat!=='none'&&!current.done){const next=new Date(current.due);if(current.repeat==='daily')next.setDate(next.getDate()+1);else next.setDate(next.getDate()+7);while(next.getTime()<=Date.now()){if(current.repeat==='daily')next.setDate(next.getDate()+1);else next.setDate(next.getDate()+7)}current.due=next.toISOString()}else current.done=!current.done;
    save();render()
   });row.append(done);
   const del=el('button','Delete');del.type='button';del.style.marginLeft='7px';del.addEventListener('click',()=>{tasks=tasks.filter(x=>x.id!==t.id);save();render()});row.append(del);list.append(row)
  }
 }
 add.addEventListener('click',()=>{const title=name.value.trim();const parsed=Date.parse(due.value);if(!title||!Number.isFinite(parsed)){alert('Enter a task and valid date/time.');return}if(tasks.length>=100){alert('Maximum 100 local tasks; archive an old task.');return}tasks.push({id:String(Date.now())+'-'+Math.floor(Math.random()*100000),title,due:new Date(parsed).toISOString(),repeat:repeat.value,done:false});save();name.value='';render()});
 exportBtn.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:KEY,exportedAt:new Date().toISOString(),tasks},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='BeardAI_Tasks_Backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)});
 trigger.addEventListener('click',()=>{panel.hidden=!panel.hidden;render()});
 document.body.append(panel,trigger);render();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
 setInterval(render,60000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();