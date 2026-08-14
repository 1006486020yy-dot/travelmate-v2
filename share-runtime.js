(() => {
  'use strict';
  const STYLE='tm-share-final-style';
  const BTN='tm-share-final-btn';
  const HASH='#tm-share=';

  function addStyle(){
    if(document.getElementById(STYLE))return;
    const s=document.createElement('style');s.id=STYLE;
    s.textContent=`
      #plans .plan{position:relative!important;overflow:visible!important}
      #plans .${BTN}{position:absolute!important;left:14px!important;top:14px!important;z-index:2147483000!important;width:82px!important;height:36px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important;border:1px solid rgba(118,89,217,.2)!important;border-radius:13px!important;background:#fff!important;color:#654bc4!important;font:800 14px/1 inherit!important;cursor:pointer!important;box-shadow:0 5px 18px rgba(23,33,43,.14)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}
      .tm-share-final-mask{position:fixed;inset:0;z-index:2147483001;background:rgba(23,33,43,.42);display:none;align-items:flex-end}
      .tm-share-final-mask.show{display:flex}
      .tm-share-final-sheet{width:100%;box-sizing:border-box;padding:20px;background:#f7f8fb;border-radius:28px 28px 0 0;max-height:84vh;overflow:auto}
      .tm-share-final-url{margin-top:10px;padding:12px;background:#fff;border:1px solid #e0e5ea;border-radius:14px;word-break:break-all;font-size:12px;color:#65717e}
      .tm-share-final-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .tm-share-final-actions button,.tm-share-public-close{border:0;border-radius:14px;padding:11px 15px;background:#eee9ff;color:#654bc4;font-weight:800;cursor:pointer}
      .tm-share-final-actions .primary{background:linear-gradient(135deg,#7659d9,#9a7de7);color:#fff}
      .tm-share-public{position:fixed;inset:0;z-index:2147483000;overflow:auto;padding:20px;box-sizing:border-box;background:radial-gradient(circle at 0 0,#e8e0ff,transparent 45%),#f5f6fa}
      .tm-share-public-inner{max-width:900px;margin:auto;padding-bottom:40px}
      .tm-share-public-card{background:#ffffffdd;border:1px solid #fff;border-radius:22px;padding:18px;margin:12px 0;box-shadow:0 15px 40px #1d2b3b12}
      .tm-share-public-event{padding:13px 0;border-top:1px solid #ececf2}.tm-share-public-event:first-child{border-top:0}
      .tm-share-public-time{color:#7659d9;font-weight:900;margin-right:10px}.tm-share-public-addr{color:#65717e;font-size:12px;margin-top:5px}.tm-share-public-note{color:#7b8794;font-size:12px;margin-top:4px}
    `;document.head.appendChild(s);
  }
  function enc(o){const b=new TextEncoder().encode(JSON.stringify(o));let x='';for(const n of b)x+=String.fromCharCode(n);return btoa(x).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function dec(x){x=x.replace(/-/g,'+').replace(/_/g,'/');x+='='.repeat((4-x.length%4)%4);const b=atob(x),a=Uint8Array.from(b,c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(a))}
  function esc(x){return String(x??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  async function copy(t){try{await navigator.clipboard.writeText(t)}catch(_){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}if(window.toast)window.toast('分享链接已复制')}

  function openShare(plan){
    let m=document.getElementById('tmShareFinalMask');
    if(!m){m=document.createElement('div');m.id='tmShareFinalMask';m.className='tm-share-final-mask';m.innerHTML=`<div class="tm-share-final-sheet"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:20px">分享行程</b><button id="tmShareFinalClose" class="tm-share-public-close">关闭</button></div><div id="tmShareFinalName" style="font-weight:800;margin-top:14px"></div><div id="tmShareFinalUrl" class="tm-share-final-url"></div><div class="tm-share-final-actions"><button id="tmShareFinalCopy" class="primary">复制分享链接</button><button id="tmShareFinalNative">系统分享</button></div><div style="font-size:12px;color:#7b8794;margin-top:9px;line-height:1.6">分享链接包含当前这份大行程，朋友打开后即可直接查看。</div></div>`;document.body.appendChild(m);m.onclick=e=>{if(e.target===m||e.target.id==='tmShareFinalClose')m.classList.remove('show')}}
    const url=location.origin+location.pathname+HASH+enc({v:7,plan:plan});
    m.querySelector('#tmShareFinalName').textContent=plan.name||'我的行程';m.querySelector('#tmShareFinalUrl').textContent=url;
    m.querySelector('#tmShareFinalCopy').onclick=()=>copy(url);
    m.querySelector('#tmShareFinalNative').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'旅伴旅行管家 · '+(plan.name||'我的行程'),text:'查看我的旅行行程',url})}catch(_){}}else await copy(url)};
    m.classList.add('show');
  }

  function addButtons(){
    addStyle();
    document.querySelectorAll('#plans .tm-share-btn-v4,#plans .tm-share-btn-v5').forEach(x=>x.remove());
    const plans=document.getElementById('plans');if(!plans)return;
    const keys=Object.keys(window.P||{});
    plans.querySelectorAll('.plan').forEach((p,i)=>{
      let b=p.querySelector('.'+BTN);if(!b){b=document.createElement('span');b.className=BTN;b.textContent='↗ 分享';b.setAttribute('role','button');b.setAttribute('tabindex','0');p.insertBefore(b,p.firstChild)}
      const fn=e=>{e.preventDefault();e.stopPropagation();const k=keys[i];if(window.P&&window.P[k])openShare(JSON.parse(JSON.stringify(window.P[k])))};
      b.onclick=fn;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){fn(e)}};
    });
  }

  function publicView(plan){
    if(!plan||!Array.isArray(plan.days))return;addStyle();
    document.querySelectorAll('.tm-share-public').forEach(x=>x.remove());
    const r=document.createElement('div');r.className='tm-share-public';r.innerHTML=`<div class="tm-share-public-inner"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><div style="font-size:12px;color:#7b8794">旅伴旅行管家 · 行程分享</div><h1 style="margin:6px 0">${esc(plan.name||'我的行程')}</h1></div><button id="tmSharePublicClose" class="tm-share-public-close">返回</button></div><div class="tm-share-public-card"><b>共享行程</b><div style="font-size:12px;color:#7b8794;margin-top:6px">此页面为只读行程，不影响朋友自己的数据。</div></div><div id="tmSharePublicDays"></div></div>`;document.body.appendChild(r);
    const out=r.querySelector('#tmSharePublicDays');
    plan.days.forEach((d,i)=>{const c=document.createElement('div');c.className='tm-share-public-card';c.innerHTML=`<div style="font-size:18px;font-weight:900;margin-bottom:8px">DAY ${i+1} · ${esc(d[0])} <span style="font-size:13px;color:#7b8794">${esc(d[1])}</span></div>`;(d[2]||[]).forEach(e=>{const q=document.createElement('div');q.className='tm-share-public-event';q.innerHTML=`<span class="tm-share-public-time">${esc(e[0])}</span><b>${esc(e[1])}</b><div class="tm-share-public-addr">📍 ${esc(e[2])}</div><div class="tm-share-public-note">${esc(e[3])}</div>`;c.appendChild(q)});out.appendChild(c)});
    r.querySelector('#tmSharePublicClose').onclick=()=>{history.replaceState(null,'',location.pathname+location.search);location.reload()};
  }
  function incoming(){if(!location.hash.startsWith(HASH))return;try{const d=dec(location.hash.slice(HASH.length));publicView(d.plan)}catch(e){console.warn('invalid share link',e)}}
  function boot(){addButtons();[50,150,400,800,1500,3000].forEach(n=>setTimeout(addButtons,n));incoming()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  new MutationObserver(addButtons).observe(document.body,{childList:true,subtree:true});
})();
