(()=>{
'use strict';
// BeardAI-owned, opt-in social rooms. Not an Ant Legion account integration.
const $=id=>document.getElementById(id), hub=$('communityHub');if(!hub)return;
const rooms=['general','strategy','events','help'];
const SETTINGS='beardai-community-server-v1', SESSION='beardai-community-session-v1';
let realtimeSocket=null,realtimeTopic=null,realtimeHeartbeat=null,realtimeBackoff=null,realtimeDelay=1000;
let server=null,session=null,room='general',poll=null,busy=false,latestRequest=0,lastPostAt=0,approved=false;
const safeString=(v,n)=>String(v??'').trim().slice(0,n);
const status=(t)=>{$('communityStatus').textContent=t};
const validUrl=(u)=>{try{const p=new URL(u);return p.protocol==='https:'&&/^[a-z0-9-]{6,64}\.supabase\.co$/.test(p.hostname)&&p.pathname==='/'&&p.search===''&&p.hash===''}catch{return false}};
const validKey=(k)=>/^(sb_publishable_[a-zA-Z0-9_-]{10,}|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.test(k)&&!k.toLowerCase().includes('service_role');
const safeJSON=s=>{try{return JSON.parse(s)}catch{return null}};
function readConfig(){
 const d=window.BEARDAI_COMMUNITY_DEFAULT;
 if(d&&validUrl(d.url)&&validKey(d.key))return {url:d.url,key:d.key};
 return null;
}
function readSession(){try{const v=safeJSON(sessionStorage.getItem(SESSION)||'');if(v&&typeof v.access_token==='string'&&typeof v.refresh_token==='string'&&typeof v.expires_at==='number'&&v.server===server.url)return v}catch{}return null}
function persistSession(s){try{if(s)sessionStorage.setItem(SESSION,JSON.stringify(s));else sessionStorage.removeItem(SESSION)}catch{}}
function setSession(s){session=s;persistSession(s);updateUi()}
function updateUi(){
 const on=!!(server&&session?.access_token&&approved);
 $('communityBadge').textContent=on?'APPROVED MEMBER':session?'AWAITING APPROVAL':server?'SIGN IN':'SERVICE UNAVAILABLE';
 $('communityLoginArea').hidden=!!session||!server;
 $('communitySignedIn').hidden=!session;
 $('communityOnline').hidden=!on;
 $('communityLoginNote').textContent=on?'Approved community member':session?'Signed in — awaiting owner approval':'';
 if(!server)status('Private community service unavailable in this build.');
 else if(session&&!approved)status('Account signed in, but access is pending owner approval. No rooms or private data are visible.');
 else if(!on)status('Private BeardAI Community. Register and request approval; never enter game credentials.');
}
function setConfig(c){
 stopPolling();server=c;session=readSession();approved=false;updateUi();if(session)checkMembership();
}
// Android bundled file origins cannot send cross-origin fetch when WebView file access is locked down.
// Use an explicitly scoped HTTPS bridge in the Android host only; desktop uses ordinary browser fetch.
const waiting=new Map();let requestNo=0;
const bridge=window.BeardNative&&typeof window.BeardNative.communityRequest==='function';
function nativeCall(path,method,body,auth){
 return new Promise((resolve,reject)=>{
  const id='c'+(++requestNo);const timer=setTimeout(()=>{waiting.delete(id);reject(Error('Network request timed out'))},15000);
  waiting.set(id,{resolve,reject,timer});
  try{window.BeardNative.communityRequest(id,server.url+path,method,server.key,auth||'',body===undefined?'':JSON.stringify(body))}catch(e){clearTimeout(timer);waiting.delete(id);reject(e)}
 });
}
window.BeardCommunityNetwork={complete:(id,httpStatus,body,error)=>{
 const pending=waiting.get(id);if(!pending)return;waiting.delete(id);clearTimeout(pending.timer);
 if(error)pending.reject(Error(String(error).slice(0,150)));
 else pending.resolve({status:Number(httpStatus),data:safeJSON(body)||body});
}};
async function api(path,method='GET',body=undefined,token=null){
 if(!server)throw Error('Community server not configured');
 let response;
 if(bridge) response=await nativeCall(path,method,body,token);
 else {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),14000);
  try{
   const res=await fetch(server.url+path,{method,mode:'cors',credentials:'omit',signal:controller.signal,
    headers:{'apikey':server.key,'Authorization':'Bearer '+(token||server.key), ...(body===undefined?{}:{'Content-Type':'application/json'}), 'Accept':'application/json'},
    ...(body===undefined?{}:{body:JSON.stringify(body)})});
   const raw=(await res.text()).slice(0,180000);response={status:res.status,data:safeJSON(raw)||raw};
  }finally{clearTimeout(timer)}
 }
 if(response.status<200||response.status>=300){const d=response.data;
  throw Error(safeString((d&&typeof d==='object'&&(d.msg||d.message||d.error_description||d.error))||`HTTP ${response.status}`,200));
 }
 return response.data;
}
function sessionFromAuth(response){return {server:server.url,access_token:response.access_token,refresh_token:response.refresh_token,expires_at:Date.now()+Math.max(0,(Number(response.expires_in)||3600)-90)*1000,user_id:String(response.user?.id||session?.user_id||""),display_name:safeString(response.user?.user_metadata?.display_name||session?.display_name||"BeardAI Member",30)};}
async function token(){
 if(!session)throw Error('Sign in first');
 if(Date.now()<session.expires_at)return session.access_token;
 const next=await api('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:session.refresh_token});
 if(!next.access_token){setSession(null);throw Error('Session expired. Sign in again.')}
 setSession(sessionFromAuth(next));return session.access_token;
}
async function signIn(){if(busy)return;busy=true;status('Signing in to BeardAI Community…');
 try{
  const email=safeString($('communityEmail').value,254),pass=$('communityPassword').value;
  if(!/^\S+@\S+\.\S+$/.test(email)||pass.length<8)throw Error('Enter a valid email and a password of at least 8 characters.');
  const data=await api('/auth/v1/token?grant_type=password','POST',{email,password:pass});
  if(!data.access_token)throw Error('Authentication returned no session');
  setSession(sessionFromAuth(data));$('communityPassword').value='';
  await checkMembership();
 }catch(e){status('Sign-in failed: '+e.message)}finally{busy=false}}
async function register(){if(busy)return;busy=true;status('Creating a separate BeardAI Community account…');
 try{
  const email=safeString($('communityEmail').value,254),pass=$('communityPassword').value,nick=safeString($('communityNickname').value,30);
  if(!/^\S+@\S+\.\S+$/.test(email)||pass.length<8)throw Error('Valid email and password (8+ characters) required.');
  if(nick.length<3||!/^[\p{L}\p{N} _.-]+$/u.test(nick))throw Error('Nickname must have 3–30 letters, numbers, spaces, underscores, dots or hyphens.');
  const data=await api('/auth/v1/signup','POST',{email,password:pass,data:{display_name:nick}});
  $('communityPassword').value='';
  if(data?.access_token){setSession(sessionFromAuth(data));await checkMembership()}
  else status('Registration requested. Confirm your email if prompted, then sign in. The owner must also approve your account before chat opens.');
 }catch(e){status('Registration failed: '+e.message)}finally{busy=false}}
async function checkMembership(){
 if(!session||!server){approved=false;updateUi();return false}
 try{
  const t=await token();
  const rows=await api('/rest/v1/community_members?select=user_id&limit=1','GET',undefined,t);
  approved=Array.isArray(rows)&&rows.some(x=>x.user_id===session.user_id);
  updateUi();
  if(approved){status('Your account is approved. Welcome to BeardAI Community.');startPolling();await refresh();await presencePing();await initMemberPanel()}
  else{stopPolling();await initMemberPanel();status('Account created, but room access is blocked until the owner approves your account. Contact the BeardAI administrator to request an invitation.');}
  return approved;
 }catch(e){approved=false;updateUi();status('Approval check failed: '+e.message);return false}
}

/* Member-only quick reactions: one reaction per user/emoji/message, enforced server-side. */
const REACTIONS=['❤️','😂','🔥','👑','👍','🐜'];
async function loadReactions(ids){
 if(!ids.length)return {};const t=await token();
 const rows=await api('/rest/v1/community_reactions?message_id=in.('+ids.join(',')+')&select=message_id,user_id,emoji','GET',undefined,t);
 const grouped={};for(const x of (Array.isArray(rows)?rows:[])){
  const id=String(x.message_id);if(!grouped[id])grouped[id]={};
  const group=grouped[id][x.emoji]||(grouped[id][x.emoji]={count:0,mine:false});
  group.count++;if(x.user_id===session.user_id)group.mine=true;
 }return grouped;
}
async function toggleReaction(messageId,emoji,mine){
 if(!approved||!REACTIONS.includes(emoji))return;
 try{const t=await token(),path='/rest/v1/community_reactions'+(mine?'?message_id=eq.'+encodeURIComponent(messageId)+'&user_id=eq.'+session.user_id+'&emoji=eq.'+encodeURIComponent(emoji):'');
  if(mine)await api(path,'DELETE',undefined,t);
  else await api(path,'POST',{message_id:Number(messageId),user_id:session.user_id,emoji},t);
  await refresh();
 }catch(e){status('Reaction could not be saved: '+e.message)}
}

async function refresh(){if(!session||!server||!approved)return;const request=++latestRequest;
 try{
  const t=await token(), rows=await api('/rest/v1/community_messages?room=eq.'+encodeURIComponent(room)+'&select=id,room,display_name,body,created_at&order=created_at.desc&limit=60','GET',undefined,t);
  if(request!==latestRequest)return;
  const ordered=Array.isArray(rows)?rows.slice().reverse():[];
  let reactions={};try{reactions=await loadReactions(ordered.map(x=>Number(x.id)).filter(Number.isSafeInteger));}catch(e){console.warn('Reactions unavailable',e.message)}
  render(ordered,reactions);
  status('BeardAI Community · '+room+' · refreshed '+new Date().toLocaleTimeString()+'.');
 }catch(e){if(request===latestRequest)status('Could not load chat: '+e.message+'. The community server may be offline.')}}
function render(rows,reactions={}){const box=$('communityMessages');box.replaceChildren();
 if(!rows.length){const empty=document.createElement('div');empty.className='empty-row';empty.textContent='No messages yet in '+room+'. Start the conversation.';box.append(empty);return}
 for(const m of rows){const outer=document.createElement('div');outer.className='community-message';
  const info=document.createElement('div');info.className='community-message-meta';
  const who=document.createElement('strong');who.textContent=safeString(m.display_name,30)||'Member';
  const when=document.createElement('span');when.textContent=m.created_at?new Date(m.created_at).toLocaleString():'';
  info.append(who,when);
  const body=document.createElement('div');body.className='community-message-body';body.textContent=safeString(m.body,500);
  const actions=document.createElement('div');actions.className='community-message-actions';
  const report=document.createElement('button');report.type='button';report.textContent='Report';report.title='Report this message to the BeardAI community moderator';report.addEventListener('click',()=>reportMessage(m.id));actions.append(report);
  const reactionsBar=document.createElement('div');reactionsBar.className='community-reactions';
  for(const emoji of REACTIONS){const data=(reactions[String(m.id)]||{})[emoji]||{count:0,mine:false};
   const b=document.createElement('button');b.type='button';b.textContent=emoji+(data.count?' '+data.count:'');
   b.setAttribute('aria-label',(data.mine?'Remove':'Add')+' '+emoji+' reaction');b.setAttribute('aria-pressed',String(data.mine));
   b.addEventListener('click',()=>toggleReaction(m.id,emoji,data.mine));reactionsBar.append(b)}
  outer.append(info,body,reactionsBar,actions);box.append(outer);
 }
 box.scrollTop=box.scrollHeight;
}
async function reportMessage(id){if(!session||!approved||!Number.isSafeInteger(Number(id)))return;
 const reason=prompt('Why should moderators review this message? (spam, harassment, personal information, etc.)');
 if(reason===null)return;const clean=safeString(reason,250);
 if(clean.length<6){status('Please enter a short reason for reporting.');return}
 try{const t=await token();await api('/rest/v1/community_reports','POST',{message_id:Number(id),reporter_id:session.user_id,reason:clean},t);status('Report submitted for moderator review.')}catch(e){status('Report could not be submitted: '+e.message)}}
async function post(){if(!session||!approved||busy)return;const text=safeString($('communityMessage').value,500);
 if(text.length<1){status('Write a message first.');return}
 if(Date.now()-lastPostAt<3000){status('Please wait a few seconds before posting again.');return}
 busy=true;$('communitySend').disabled=true;
 try{const t=await token();
  const name=safeString($('communityNickname').value,30)||session.display_name||'BeardAI Member';
  await api('/rest/v1/community_messages','POST',{room,user_id:session.user_id,display_name:name,body:text},t);
  lastPostAt=Date.now();$('communityMessage').value='';$('communityLength').textContent='0/500';await refresh();
 }catch(e){status('Message not sent: '+e.message)}finally{busy=false;$('communitySend').disabled=false}}
function stopPolling(){stopRealtime();if(poll){clearInterval(poll);poll=null}if(heartbeat){clearInterval(heartbeat);heartbeat=null}}
function stopRealtime(){
 if(realtimeBackoff){clearTimeout(realtimeBackoff);realtimeBackoff=null}
 if(realtimeHeartbeat){clearInterval(realtimeHeartbeat);realtimeHeartbeat=null}
 realtimeTopic=null;
 if(realtimeSocket){const ws=realtimeSocket;realtimeSocket=null;try{ws.close()}catch{}}
}
function connectRealtime(){
 stopRealtime();
 if(!server||!session?.access_token||!approved||typeof WebSocket!=='function')return;
 const path=new URL(server.url);
 const address='wss://'+path.host+'/realtime/v1/websocket?apikey='+encodeURIComponent(server.key)+'&vsn=1.0.0';
 try{
  const ws=new WebSocket(address);realtimeSocket=ws;
  ws.addEventListener('open',()=>{
   if(ws!==realtimeSocket)return;
   realtimeDelay=1000;realtimeTopic='realtime:beardai_'+Date.now();
   ws.send(JSON.stringify({topic:realtimeTopic,event:'phx_join',payload:{config:{broadcast:{self:false},presence:{key:''},postgres_changes:[{event:'INSERT',schema:'public',table:'community_messages'}]},access_token:session.access_token},ref:'1'}));
   realtimeHeartbeat=setInterval(()=>{if(ws.readyState===1)ws.send(JSON.stringify({topic:'phoenix',event:'heartbeat',payload:{},ref:String(Date.now())}))},25000);
  });
  ws.addEventListener('message',evt=>{
   if(ws!==realtimeSocket)return;
   try{const data=JSON.parse(evt.data);
    if(data.event==='postgres_changes'||data.event==='INSERT'){
     const record=data.payload?.data?.record||data.payload?.record||{};
     if(record.room===room&&!document.hidden)refresh();
    }
   }catch{}
  });
  ws.addEventListener('close',()=>{if(ws!==realtimeSocket)return;realtimeSocket=null;if(realtimeHeartbeat){clearInterval(realtimeHeartbeat);realtimeHeartbeat=null}if(session&&approved)realtimeBackoff=setTimeout(connectRealtime,realtimeDelay=Math.min(realtimeDelay*2,30000))});
  ws.addEventListener('error',()=>{try{ws.close()}catch{}});
 }catch(e){console.warn('Realtime unavailable; polling fallback in use',e.message)}
}

function startPolling(){stopPolling();if(!session||!approved)return;heartbeat=setInterval(presencePing,60000);connectRealtime();poll=setInterval(()=>{if(!document.hidden&&document.querySelector('.tab[data-tab="chat"]')?.classList.contains('active'))refresh()},3000)}

/* 2.2 preview: local Unicode emoji composer. No extra permissions or backend changes. */
function installEmojiPicker(){
 const input=$('communityMessage');if(!input||!input.parentElement||$('communityEmojiPicker'))return;
 const shell=document.createElement('div');shell.id='communityEmojiPicker';shell.style.cssText='display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0';
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='😀 Emoji';toggle.setAttribute('aria-expanded','false');
 const picker=document.createElement('div');picker.hidden=true;picker.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:7px;border:1px solid #46735e;border-radius:10px';
 for(const emoji of ['😀','😂','🤣','😊','😍','❤️','🔥','👑','⚔️','🐜','💪','🎉','👍','😭','😎','💀','🛡️','💯','👀','🚀']){
  const b=document.createElement('button');b.type='button';b.textContent=emoji;b.setAttribute('aria-label','Insert '+emoji);
  b.addEventListener('click',()=>{const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
   const next=input.value.slice(0,start)+emoji+input.value.slice(end);if(next.length>500){status('Message limit is 500 characters.');return}
   input.value=next;input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();
   try{input.setSelectionRange(start+emoji.length,start+emoji.length)}catch{}});
  picker.append(b);
 }
 toggle.addEventListener('click',()=>{picker.hidden=!picker.hidden;toggle.setAttribute('aria-expanded',String(!picker.hidden))});
 shell.append(toggle,picker);input.parentElement.insertBefore(shell,input);
}
/* Update notices check the official public release feed; installation is always user-initiated. */
function installUpdateNotice(){
 if($('communityUpdateNotice'))return;
 const panel=document.createElement('div');panel.id='communityUpdateNotice';
 panel.style.cssText='margin:12px 0;padding:10px;border:1px solid #46735e;border-radius:10px';
 const label=document.createElement('span');label.textContent='BeardAI 2.2.1 • Update status not checked';
 const button=document.createElement('button');button.type='button';button.textContent='Check updates';
 button.style.marginLeft='8px';
 const link=document.createElement('a');link.href='https://github.com/AntonioRose-design/BeardAI-Downloads/releases';link.textContent='Official releases';link.style.marginLeft='8px';
 const check=async()=>{button.disabled=true;label.textContent='Checking official GitHub releases…';
  try{let releases;
   if(window.BeardNative&&typeof window.BeardNative.checkBeardAIRelease==='function'){
    const raw=await new Promise((resolve,reject)=>{
     const timer=setTimeout(()=>{window.BeardAIReleaseFeed=null;reject(Error('Update check timeout'))},15000);
     window.BeardAIReleaseFeed={complete:(payload)=>{clearTimeout(timer);window.BeardAIReleaseFeed=null;resolve(payload)}};
     window.BeardNative.checkBeardAIRelease();
    });
    releases=JSON.parse(raw);
   }else{
    const response=await fetch('https://api.github.com/repos/AntonioRose-design/BeardAI-Downloads/releases?per_page=10',{cache:'no-store'});
    if(!response.ok)throw Error('GitHub unavailable');
    releases=await response.json();
   }if(!Array.isArray(releases))throw Error('Invalid response');
   const tags=releases.filter(x=>!x.draft&&/^v\d+\.\d+\.\d+(-[a-z0-9.]+)?$/i.test(x.tag_name||''));
   const cmp=(a,b)=>{const v=s=>s.replace(/^v/,'').split('-')[0].split('.').map(Number);
    const aa=v(a.tag_name),bb=v(b.tag_name);for(let i=0;i<3;i++){if(aa[i]!==bb[i])return bb[i]-aa[i]}return 0};
   tags.sort(cmp);const newer=tags.find(x=>cmp({tag_name:'v2.2.1'},x)>0);
   if(newer){label.textContent='New BeardAI release: '+newer.tag_name;
    if(/^https:\/\/github\.com\/AntonioRose-design\/BeardAI-Downloads\/releases\/tag\//.test(newer.html_url||''))link.href=newer.html_url;
    link.textContent='View update';}
   else label.textContent='BeardAI 2.2.1 • No newer release found';
  }catch{label.textContent='Automatic check unavailable on this device. Use Official releases.'}
  finally{button.disabled=false}};
 button.addEventListener('click',check);panel.append(label,button,link);hub.prepend(panel);
 check();
}


/* Owner-only member control: the database verifies ownership for every RPC. */
let memberPanel=null,heartbeat=null;
async function presencePing(){
 if(!session||!approved||document.hidden)return;
 try{await api('/rest/v1/rpc/beardai_presence_ping','POST',{},await token())}catch{}
}
async function initMemberPanel(){
 if(!session||!server)return;
 let list;
 try{list=await api('/rest/v1/rpc/beardai_admin_members','POST',{},await token())}
 catch{return} // Invisible to non-admins: security is enforced in Supabase.
 if(!Array.isArray(list))return;
 if(!memberPanel){
  memberPanel=document.createElement('section');memberPanel.id='beardaiOwnerMembers';
  memberPanel.style.cssText='padding:12px;margin:12px 0;border:1px solid #b59a47;border-radius:12px';
  const heading=document.createElement('h3');heading.textContent='👑 Owner Members Console';
  const detail=document.createElement('p');detail.textContent='Online means active in BeardAI within approximately 2 minutes, not active in Ant Legion.';
  const refreshButton=document.createElement('button');refreshButton.type='button';refreshButton.textContent='Refresh members';
  refreshButton.addEventListener('click',initMemberPanel);
  const rows=document.createElement('div');rows.id='beardaiOwnerMemberRows';
  memberPanel.append(heading,detail,refreshButton,rows);
  hub.prepend(memberPanel);
 }
 const rows=$('beardaiOwnerMemberRows');rows.replaceChildren();
 const counts=document.createElement('p');
 counts.textContent=list.length+' registered • '+list.filter(x=>x.approved).length+' approved • '+list.filter(x=>!x.approved&&!x.denied).length+' pending';
 rows.append(counts);
 for(const m of list){
  const card=document.createElement('div');card.style.cssText='padding:9px;margin:7px 0;background:rgba(18,40,26,.6);border-radius:8px';
  const title=document.createElement('strong');title.textContent=String(m.nickname||'Member').slice(0,30);
  const email=document.createElement('div');email.textContent=String(m.email||'').slice(0,254);
  const last=m.last_seen?Date.parse(m.last_seen):NaN;
  const online=m.approved&&Number.isFinite(last)&&(Date.now()-last<120000);
  const state=document.createElement('div');
  state.textContent=(m.denied?'Denied':m.approved?'Approved':'Pending')+' • '+(online?'🟢 Online':'⚪ Offline');
  card.append(title,email,state);
  if(m.last_seen){const activity=document.createElement('small');activity.textContent='Last active: '+new Date(m.last_seen).toLocaleString();card.append(activity)}
  if(!m.approved||m.denied){
   const approve=document.createElement('button');approve.type='button';approve.textContent='Approve';
   approve.addEventListener('click',()=>decideMember(m.user_id,'approve'));card.append(approve);
  }
  if(!m.denied){
   const deny=document.createElement('button');deny.type='button';deny.textContent=m.approved?'Revoke access':'Deny';
   deny.addEventListener('click',()=>decideMember(m.user_id,'deny'));card.append(deny);
  }
  rows.append(card);
 }
}
async function decideMember(id,decision){
 if(!confirm((decision==='approve'?'Approve':'Deny/revoke')+' this BeardAI member?'))return;
 try{await api('/rest/v1/rpc/beardai_admin_decide','POST',{target_user:id,decision},await token());
  status('Member '+(decision==='approve'?'approved':'denied')+'.');await initMemberPanel();}
 catch(e){status('Member action failed: '+e.message)}
}

function init(){
 installEmojiPicker();
 // Update notifications now appear globally in update-center.js.
 $('communityLogin').addEventListener('click',signIn);
 $('communityRegister').addEventListener('click',register);
 $('communityLogout').addEventListener('click',async()=>{try{if(session)await api('/auth/v1/logout','POST',{},await token())}catch{}setSession(null);approved=false;stopPolling();if(memberPanel){memberPanel.remove();memberPanel=null}status('Signed out of BeardAI Community on this device.')});
 $('communitySend').addEventListener('click',post);
 $('communityRefresh').addEventListener('click',refresh);
 $('communityMessage').addEventListener('input',()=>{$('communityLength').textContent=$('communityMessage').value.length+'/500'});
 hub.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{room=b.dataset.room;hub.querySelectorAll('[data-room]').forEach(x=>x.classList.toggle('active',x===b));refresh()}));
 setConfig(readConfig());
}
window.BeardAICommunity={validUrl,validKey,getRoom:()=>room,getServer:()=>server?server.url:null,refresh};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
