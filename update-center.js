(()=>{
'use strict';
const CURRENT='5.0.0', STORAGE='beardai-auto-check-updates-v1';
const RELEASES='https://github.com/AntonioRose-design/BeardAI-Downloads/releases';
const API='https://api.github.com/repos/AntonioRose-design/BeardAI-Downloads/releases?per_page=20';
const root=document.createElement('section');root.id='beardaiUpdateCenter';root.style.cssText='position:fixed;bottom:12px;left:12px;z-index:99999;font:14px system-ui,sans-serif;color:#f5eccc';
const toggle=document.createElement('button');toggle.type='button';toggle.textContent='🔔 Updates';toggle.style.cssText='padding:12px 15px;background:#193d30;color:white;border:2px solid #c1a252;border-radius:10px;cursor:pointer';
const pane=document.createElement('div');pane.hidden=true;pane.style.cssText='box-sizing:border-box;width:min(340px,calc(100vw - 24px));max-height:75vh;overflow:auto;padding:14px;background:#10251c;color:#f5eccc;border:2px solid #c1a252;border-radius:12px;margin-bottom:7px;box-shadow:0 5px 24px #000a';
const title=document.createElement('h3');title.textContent='🔔 BeardAI Update Center';title.style.margin='0 0 8px';
const version=document.createElement('p');version.textContent='Installed preview: v'+CURRENT;
const state=document.createElement('p');state.textContent='Update status not checked';state.setAttribute('role','status');
const settings=document.createElement('label');settings.style.cssText='display:block;margin:12px 0';
const auto=document.createElement('input');auto.type='checkbox';auto.checked=localStorage.getItem(STORAGE)!=='off';
settings.append(auto,document.createTextNode(' Automatically check for updates on launch'));
const check=document.createElement('button');check.type='button';check.textContent='Check for updates now';check.style.cssText='padding:9px;border-radius:8px;cursor:pointer';
const open=document.createElement('a');open.href=RELEASES;open.target='_blank';open.rel='noopener noreferrer';open.textContent='Open official releases ↗';open.style.cssText='display:block;color:#f1ca63;margin-top:12px';
const note=document.createElement('p');note.textContent='Automatic checks do not install software. Android installation requires your approval. Windows updates must be extracted/installed safely; existing local data may need a backup.';note.style.cssText='font-size:12px;opacity:.9';
pane.append(title,version,state,settings,check,open,note);
root.append(pane,toggle);
function versionOf(tag){const match=/^v(\d+)\.(\d+)\.(\d+)(?:-[a-z0-9.-]+)?$/i.exec(tag||'');return match?match.slice(1,4).map(Number):null}
function newer(a){const v=versionOf(a.tag_name);if(!v)return false;const curr=CURRENT.split('.').map(Number);for(let i=0;i<3;i++){if(v[i]!==curr[i])return v[i]>curr[i]}return false}
async function getReleases(){
 if(window.BeardNative&&typeof window.BeardNative.checkBeardAIRelease==='function'){
  const payload=await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{window.BeardAIReleaseFeed=null;reject(Error('Timed out'))},16000);
   window.BeardAIReleaseFeed={complete:raw=>{clearTimeout(timer);window.BeardAIReleaseFeed=null;resolve(raw)}};
   window.BeardNative.checkBeardAIRelease();
  });
  return JSON.parse(payload);
 }
 const response=await fetch(API,{cache:'no-store'});
 if(!response.ok)throw Error('GitHub returned '+response.status);
 return response.json();
}
async function doCheck(){
 check.disabled=true;state.textContent='Checking GitHub releases…';
 try{
  const records=await getReleases();
  if(!Array.isArray(records)||!records.length)throw Error('No release data returned');
  const matches=records.filter(x=>!x.draft&&newer(x));
  matches.sort((a,b)=>{const av=versionOf(a.tag_name),bv=versionOf(b.tag_name);for(let i=0;i<3;i++)if(bv[i]!==av[i])return bv[i]-av[i];return 0});
  const next=matches[0];
  if(next){state.textContent='⬆ New version available: '+next.tag_name;toggle.textContent='🔔 Update available';pane.hidden=false;
   if(typeof next.html_url==='string'&&next.html_url.startsWith(RELEASES+'/tag/'))open.href=next.html_url;
   open.textContent='View and download update ↗';
  }else{state.textContent='✓ v'+CURRENT+' is the newest published version.';toggle.textContent='🔔 Updates';open.href=RELEASES;open.textContent='Open official releases ↗'}
 }catch(e){state.textContent='Could not check: '+e.message+' — use Official releases.'}
 finally{check.disabled=false}
}
toggle.addEventListener('click',()=>{pane.hidden=!pane.hidden});
auto.addEventListener('change',()=>{localStorage.setItem(STORAGE,auto.checked?'on':'off');state.textContent=auto.checked?'Automatic check enabled for next launch.':'Automatic check disabled. Manual checks still work.'});
check.addEventListener('click',doCheck);
function boot(){document.body.append(root);if(auto.checked)doCheck()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.BeardAIUpdates={check:doCheck,version:CURRENT};
})();