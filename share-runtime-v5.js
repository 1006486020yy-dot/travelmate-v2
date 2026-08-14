(() => {
  const STYLE_ID='tm-share-style-v5';
  const BTN_CLASS='tm-share-btn-v5';

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #plans .plan{position:relative!important;overflow:visible!important;}
      #plans .${BTN_CLASS}{
        position:absolute!important;left:14px!important;top:14px!important;z-index:2147483000!important;
        display:flex!important;align-items:center!important;justify-content:center!important;
        width:88px!important;height:38px!important;margin:0!important;padding:0!important;
        border:1px solid rgba(118,89,217,.22)!important;border-radius:13px!important;
        background:#fff!important;color:#654bc4!important;font:800 14px/38px inherit!important;
        text-align:center!important;cursor:pointer!important;box-shadow:0 5px 18px rgba(23,33,43,.14)!important;
        opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important;
    `;
    document.head.appendChild(s);
  }

  function snapshot(){
    const data={};
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);try{data[k]=localStorage.getItem(k)}catch(e){}}
    return data;
  }
  function encode(obj){
    const bytes=new TextEncoder().encode(JSON.stringify(obj));let bin='';
    bytes.forEach(b=>bin+=String.fromCharCode(b));
    return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function openShare(planEl,index){
    let box=document.getElementById('tmShareBoxV5');
    if(!box){
      box=document.createElement('div');box.id='tmShareBoxV5';
      box.style.cssText='position:fixed;inset:0;background:rgba(23,33,43,.40);z-index:2147483001;display:none;align-items:flex-end;';
      box.innerHTML=`<div style="width:100%;max-height:82vh;overflow:auto;background:#f7f8fb;border-radius:28px 28px 0 0;padding:20px;box-sizing:border-box;box-shadow:0 -20px 60px rgba(23,33,43,.14)"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:20px">分享行程</b><button id="tmShareCloseV5" style="border:0;background:#fff;border-radius:12px;padding:9px 12px;cursor:pointer">关闭</button></div><p id="tmShareTitleV5" style="font-weight:800;margin:14px 0 8px"></p><div id="tmShareUrlV5" style="width:100%;padding:12px;border:1px solid #e0e5ea;border-radius:14px;background:#fff;word-break:break-all;font-size:12px;color:#65717e;box-sizing:border-box"></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button id="tmShareCopyV5" style="padding:11px 14px;border:0;border-radius:14px;background:linear-gradient(135deg,#7659d9,#9a7de7);color:#fff;font-weight:800;cursor:pointer">复制分享链接</button><button id="tmShareNativeV5" style="padding:11px 14px;border:0;border-radius:14px;background:#eee9ff;color:#654bc4;font-weight:800;cursor:pointer">系统分享</button></div><div style="font-size:12px;color:#7b8794;line-height:1.6;margin-top:8px">朋友打开这个链接后，会进入同一份行程数据，并自动打开这份大行程。</div></div>`;
      document.body.appendChild(box);
      box.addEventListener('click',e=>{if(e.target===box||e.target.id==='tmShareCloseV5')box.style.display='none'});
    }
    const title=planEl.querySelector('b')?.textContent?.trim()||'我的行程';
    const payload={v:5,planTitle:title,planIndex:index,storage:snapshot()};
    const url=location.origin+location.pathname+'#tm-share='+encode(payload);
    box.querySelector('#tmShareTitleV5').textContent=title;
    box.querySelector('#tmShareUrlV5').textContent=url;
    box.querySelector('#tmShareCopyV5').onclick=async()=>{try{await navigator.clipboard.writeText(url)}catch(e){const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}if(typeof window.toast==='function')window.toast('分享链接已复制')};
    box.querySelector('#tmShareNativeV5').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'旅伴旅行管家 · '+title,text:'查看我的旅行行程',url})}catch(e){}}else{try{await navigator.clipboard.writeText(url);if(typeof window.toast==='function')window.toast('已复制分享链接')}catch(e){}}};
    box.style.display='flex';
  }
  function enhance(){
    installStyle();const plans=document.getElementById('plans');if(!plans)return;
    plans.querySelectorAll('.plan').forEach((p,i)=>{
      let b=p.querySelector('.'+BTN_CLASS);
      if(!b){b=document.createElement('button');b.type='button';b.className=BTN_CLASS;b.textContent='↗ 分享';p.insertBefore(b,p.firstChild)}
      b.onclick=e=>{e.preventDefault();e.stopPropagation();openShare(p,i)};
    });
  }
  function boot(){installStyle();enhance();[50,150,500,1200,2500].forEach(ms=>setTimeout(enhance,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
})();
