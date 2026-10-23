(()=>{'use strict';
const core=window.BeardAIWorkbenchCore;
if(!core){console.error('Royal Workbench core unavailable');return}
const STORE='beardai-royal-workbench-v1';let records=[];
try{const src=JSON.parse(localStorage.getItem(STORE)||'[]');records=core.normalizeMany(src)}catch(e){console.warn('Workbench data needs recovery; saved storage is preserved.',e)}
const el=(tag,txt)=>{const x=document.createElement(tag);if(txt!==undefined)x.textContent=txt;return x};
const btn=(label,action)=>{const x=el('button',label);x.type='button';x.addEventListener('click',action);return x};
const style='background:#122d36;color:#f6ecd3;border:1px solid #698887;border-radius:8px;padding:8px;box-sizing:border-box';
function init(){
let editing=null;
const toggle=btn('⚡ Workbench 5.0',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)name.focus()});
toggle.setAttribute('aria-controls','beardai-workbench-panel');toggle.setAttribute('aria-expanded','false');toggle.style.cssText=style+';position:fixed;right:12px;bottom:107px;z-index:99996';
const panel=el('section');panel.id='beardai-workbench-panel';panel.hidden=true;panel.setAttribute('aria-label','Royal Workbench');panel.style.cssText='position:fixed;right:12px;bottom:156px;z-index:99996;width:min(450px,calc(100vw - 24px));max-height:72vh;overflow:auto;padding:15px;border:1px solid #b49a68;border-radius:12px;box-sizing:border-box;background:#0c202b;color:#f2f6f2;font:14px system-ui';
panel.append(el('h2','Royal Workbench 5.0'),el('p','Your private local planning board. No autonomous game actions. Export backups regularly.'));
const status=el('p');status.setAttribute('role','status');status.style.color='#d6c58e';panel.append(status);
const form=el('form');form.style.cssText='display:grid;gap:6px';
const label=(name,field)=>{const wrap=el('label',name);wrap.style.display='grid';wrap.style.gap='3px';wrap.append(field);return wrap};
const name=el('input');name.required=true;name.minLength=3;name.maxLength=120;name.placeholder='Upgrade, mission, or note';name.style.cssText=style;form.append(label('Name',name));
const notes=el('textarea');notes.maxLength=2000;notes.rows=2;notes.placeholder='Notes (optional)';notes.style.cssText=style;form.append(label('Details',notes));
const due=el('input');due.type='date';due.style.cssText=style;form.append(label('Target date (optional)',due));
const priority=el('select');for(const x of core.PRIORITIES){const o=el('option',x);o.value=x;priority.append(o)}priority.style.cssText=style;
const stage=el('select');for(const x of core.STAGES){const o=el('option',x);o.value=x;stage.append(o)}stage.style.cssText=style;
const line=el('div');line.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:6px';line.append(label('Priority',priority),label('Stage',stage));form.append(line);
const save=el('button','Add item');save.type='submit';save.style.cssText=style+';cursor:pointer';
const cancel=btn('Cancel edit',()=>reset());cancel.hidden=true;form.append(save,cancel);panel.append(form);
const tools=el('div');tools.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:10px 0';
const exportButton=btn('Export backup',()=>{try{const b=new Blob([core.serialize(records)],{type:'application/json'});const url=URL.createObjectURL(b),a=el('a');a.href=url;a.download='BeardAI-Workbench-5.0.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);msg('Backup exported.')}catch(e){msg(e.message)}});
const importButton=btn('Import backup',()=>file.click());const file=el('input');file.type='file';file.accept='.json,application/json';file.hidden=true;
const search=el('input');search.placeholder='Search saved items';search.setAttribute('aria-label','Search saved items');search.style.cssText=style+';width:100%';
const filter=el('select');for(const x of ['All',...core.STAGES]){const o=el('option',x);o.value=x;filter.append(o)}filter.style.cssText=style;tools.append(exportButton,importButton,file);panel.append(tools,search,filter);
const summary=el('p');panel.append(summary);const list=el('div');panel.append(list);
function msg(value){status.textContent=value}
function persist(next){try{localStorage.setItem(STORE,JSON.stringify(next));records=next;render();return true}catch(e){msg('Storage unavailable: '+e.message+'. Export your backup.');return false}}
function reset(){editing=null;form.reset();save.textContent='Add item';cancel.hidden=true}
function render(){
list.replaceChildren();const n=core.stats(records);summary.textContent=n.count+' total · '+n.done+' done · '+n.critical+' critical remaining';
const term=search.value.trim().toLowerCase();let found=0;
for(const record of records.filter(x=>(filter.value==='All'||x.stage===filter.value)&&(x.title+' '+x.notes).toLowerCase().includes(term))){
found++;const item=el('article');item.style.cssText='padding:9px 0;border-top:1px solid #47616a';
const heading=el('strong',record.title);item.append(heading);
item.append(el('div',record.priority+' · '+record.stage+(record.due?' · Due '+record.due:'')));
if(record.notes)item.append(el('p',record.notes.slice(0,180)));
const row=el('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:6px';
const edit=btn('Edit',()=>{editing=record.id;name.value=record.title;notes.value=record.notes;due.value=record.due;priority.value=record.priority;stage.value=record.stage;save.textContent='Save changes';cancel.hidden=false;name.focus();msg('Editing '+record.title)});
const finish=btn(record.stage==='Done'?'Reopen':'Mark done',()=>{persist(records.map(x=>x.id===record.id?{...x,stage:x.stage==='Done'?'Planned':'Done'}:x))});
const del=btn('Delete',()=>{if(window.confirm('Remove '+record.title+'? Export a backup first if needed.')){persist(records.filter(x=>x.id!==record.id));if(editing===record.id)reset()}});
row.append(edit,finish,del);item.append(row);list.append(item)
}if(!found)list.append(el('p','No matching items.'));
}
form.addEventListener('submit',e=>{e.preventDefault();
const original=editing?records.find(x=>x.id===editing):null;
const draft=core.normalize({id:editing||(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),title:name.value,notes:notes.value,due:due.value,stage:stage.value,priority:priority.value,created:original?.created||new Date().toISOString()});
if(!draft){msg('Please enter at least three characters.');return}
if(!editing&&records.length>=core.MAX_RECORDS){msg('Limit '+core.MAX_RECORDS+' items. Export or remove old items.');return}
const next=editing?records.map(x=>x.id===editing?draft:x):[draft,...records];
if(persist(next)){msg(editing?'Changes saved.':'Item added.');reset()}
});
file.addEventListener('change',async()=>{try{
const selected=file.files?.[0];if(!selected)return;
if(selected.size>core.MAX_IMPORT_BYTES)throw new Error('Backup exceeds size limit.');
const incoming=core.parseBackup(await selected.text());
const replace=window.confirm('Import '+incoming.length+' items. OK = REPLACE your current workbench; Cancel = MERGE without overwriting IDs.');
const next=core.merge(records,incoming,replace?'replace':'merge');
if(!window.confirm('Confirm '+(replace?'REPLACE':'MERGE')+' with '+next.length+' items?')){msg('Import cancelled.');return}
if(persist(next)){reset();msg('Imported '+incoming.length+' records. Export a fresh backup.')}
}catch(e){msg('Import stopped: '+e.message)}finally{file.value=''}});
search.addEventListener('input',render);filter.addEventListener('change',render);
document.body.append(toggle,panel);render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();