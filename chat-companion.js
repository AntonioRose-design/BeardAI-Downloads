(()=>{
 'use strict';
 const root=document.querySelector('#tab-chat');if(!root)return;
 const $=(id)=>document.getElementById(id);
 const STORE='beardai-game-chat-drafts-v1';
 const GAME_URL='https://play.google.com/store/apps/details?id=com.global.antgame';
 const channels=['alliance','state','battle'];
 const templates={
  alliance:[['Event check-in','Alliance event check-in: please confirm who is available and whether rally support is needed.'],['Alliance reminder','Reminder: please review upcoming alliance events and coordinate timing with your team.'],['Help request','Could someone help verify the requirements for this upgrade? Please share the exact game version and a screenshot without private account details.']],
  state:[['State coordination','State coordination: please share confirmed event times and current agreements before taking action.'],['Peaceful notice','Friendly reminder: verify state rules and alliance agreements before starting rallies or attacks.'],['Event announcement','Upcoming state activity: please check the in-game event screen for confirmed timing and eligibility.']],
  battle:[['Battle rally','Battle coordination: rally leaders, please confirm target, timing, and troop assignments in the official game chat.'],['Defense call','Defense coordination: check available reinforcements and verified event rules before committing troops.'],['Battle regroup','Regroup notice: review losses, hospital capacity, and current objectives before the next push.']]
 };
 let drafts={alliance:'',state:'',battle:''};let current='alliance';
 const escaped=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 try{const o=JSON.parse(localStorage.getItem(STORE)||'{}');channels.forEach(k=>{if(typeof o[k]==='string')drafts[k]=o[k].slice(0,1000)})}catch{}
 function saved(){try{localStorage.setItem(STORE,JSON.stringify(drafts))}catch{status('Local storage is unavailable; copy important messages manually.')}}
 function status(text){$('chatStatus').textContent=text}
 function refresh(){
  $('chatDraft').value=drafts[current];$('chatLabel').textContent=current==='battle'?'Battle / Event Chat draft':current==='state'?'State Chat draft':'Alliance Chat draft';
  $('chatModeNote').textContent=current==='battle'?'Battle Chat appears only during supported in-game events.':'Open the '+current+' chat inside the official game client.';
  $('chatDraftCount').textContent=drafts[current].length+' / 1000 characters';
  root.querySelectorAll('[data-channel]').forEach(b=>{let active=b.dataset.channel===current;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  $('chatTemplates').innerHTML=templates[current].map(([name,body],i)=>`<button type="button" class="chat-template" data-template="${i}"><strong>${escaped(name)}</strong><span>${escaped(body)}</span></button>`).join('');
  $('chatTemplates').querySelectorAll('[data-template]').forEach(b=>b.addEventListener('click',()=>{drafts[current]=templates[current][Number(b.dataset.template)][1];saved();refresh();$('chatDraft').focus();status('Template loaded. Edit and copy it into the game manually.')}));
 }
 async function copy(){
  const value=drafts[current].trim();if(!value){status('Write or choose a message before copying.');return false}
  if(window.BeardNative&&typeof window.BeardNative.copyChatDraft==='function'){window.BeardNative.copyChatDraft(value);status('Copied draft to Android clipboard. Open the official game and paste manually.');return true}
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);status('Copied '+current+' draft. Open the official game chat and paste it.');return true}}catch{}
  const input=$('chatDraft');input.focus();input.select();
  let ok=false;try{ok=document.execCommand('copy')}catch{}
  if(ok){status('Copied '+current+' draft. Paste it in the official game chat.');return true}
  status('Clipboard not permitted by this browser. The draft is selected; press Ctrl+C to copy.');return false;
 }
 function openGame(){if(window.BeardNative&&typeof window.BeardNative.openGame==='function')window.BeardNative.openGame();else window.open(GAME_URL,'_blank','noopener,noreferrer')}
 root.querySelectorAll('[data-channel]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.channel;refresh();status('Switched to '+current+' drafts. No connection to in-game chat.')}));
 $('chatDraft').addEventListener('input',e=>{drafts[current]=e.target.value.slice(0,1000);saved();$('chatDraftCount').textContent=drafts[current].length+' / 1000 characters'});
 $('chatCopy').addEventListener('click',copy);
 $('chatCopyOpen').addEventListener('click',()=>{openGame();copy()});
 $('chatClear').addEventListener('click',()=>{if(!confirm('Clear this local chat draft?'))return;drafts[current]='';saved();refresh();status('Cleared local '+current+' draft.')});
 $('chatOpenGame').addEventListener('click',openGame);
 $('chatLearnPC').addEventListener('click',openGame);
 refresh();
})();