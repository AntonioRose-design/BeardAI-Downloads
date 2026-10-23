(()=>{'use strict';const inPWA=location.protocol==='https:'&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1';if(!inPWA)return;
function ready(){
document.documentElement.classList.add('beardai-web-platform');
const note=document.createElement('aside');note.setAttribute('role','note');note.style.cssText='background:#173440;color:#eef7ed;padding:10px 14px;border-bottom:1px solid #568b8d;font:13px system-ui;text-align:center';note.textContent='BeardAI Web • iPhone/Safari preview. Screen capture, game launching, and Android-only controls are not available in this web edition.';document.querySelector('.app-top')?.after(note);
for(const [id,msg] of [['btnStart','Screen capture requires the Android app. On iPhone, use screenshot import where supported.'],['btnGame','Open Ant Legion from your iPhone Home Screen; browsers cannot launch Android apps.']]){const el=document.getElementById(id);if(el){el.disabled=true;el.title=msg;el.setAttribute('aria-label',msg);el.style.opacity='.55';el.style.cursor='not-allowed'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();