(()=>{'use strict';
const ISSUE='https://github.com/AntonioRose-design/BeardAI-Downloads/issues/new';
const KEY='beardai-feedback-drafts-v1';
function boot(){
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='💡 Feedback';toggle.style.cssText='position:fixed;z-index:99997;right:12px;bottom:65px;background:#214635;border:2px solid #c6a957;border-radius:10px;padding:10px;color:white;cursor:pointer';
 const panel=document.createElement('section');panel.hidden=true;panel.style.cssText='box-sizing:border-box;position:fixed;z-index:99997;right:12px;bottom:115px;width:min(370px,calc(100vw - 24px));max-height:70vh;overflow:auto;background:#10251c;color:#f4ead2;border:2px solid #c6a957;border-radius:12px;padding:14px;font:14px system-ui';
 const header=document.createElement('h3');header.textContent='💡 Suggest a feature or report an issue';panel.append(header);
 const note=document.createElement('p');note.textContent='We open a GitHub issue prefilled with your feedback. Review it before submitting. Do not include passwords, personal information, or private game screenshots. No AI automatically deploys submitted suggestions.';panel.append(note);
 const category=document.createElement('select');for(const t of ['Feature request','Bug report','Guide correction','Accessibility','Automation idea']){const o=document.createElement('option');o.textContent=t;category.append(o)}panel.append(category);
 const subject=document.createElement('input');subject.placeholder='Short title';subject.maxLength=110;subject.style.cssText='display:block;width:96%;margin:8px 0';panel.append(subject);
 const details=document.createElement('textarea');details.placeholder='Describe your idea, what you tried, and the result you want.';details.maxLength=3500;details.rows=6;details.style.width='96%';panel.append(details);
 const status=document.createElement('p');status.setAttribute('role','status');panel.append(status);
 const submit=document.createElement('button');submit.type='button';submit.textContent='Review on GitHub ↗';panel.append(submit);
 const save=document.createElement('button');save.type='button';save.textContent='Save draft locally';save.style.marginLeft='8px';panel.append(save);
 try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');subject.value=String(x.subject||'').slice(0,110);details.value=String(x.details||'').slice(0,3500);if(x.category)category.value=x.category}catch{}
 save.addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify({category:category.value,subject:subject.value,details:details.value}));status.textContent='Draft saved only on this device.'}catch{status.textContent='Unable to save draft.'}});
 submit.addEventListener('click',()=>{
  const title=subject.value.trim(),body=details.value.trim();
  if(title.length<5||body.length<15){status.textContent='Please include a descriptive title and at least 15 characters of detail.';return}
  const text='Category: '+category.value+'\nPlatform: '+(/Android/i.test(navigator.userAgent)?'Android':/iPhone|iPad/i.test(navigator.userAgent)?'iOS':'Desktop')+'\n\n'+body+'\n\nSubmitted through BeardAI Feedback Center; user-reviewed.';
  const url=ISSUE+'?title='+encodeURIComponent('['+category.value+'] '+title)+'&body='+encodeURIComponent(text);
  if(url.length>6500){status.textContent='Feedback is too long for an issue URL. Shorten it first.';return}
  window.open(url,'_blank','noopener,noreferrer');status.textContent='GitHub issue composer opened. Submit there to send feedback; opening does not submit automatically.';
 });
 toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden});
 document.body.append(panel,toggle);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();