(() => {
  const STYLE_ID='tm-share-style-v4';
  const BTN_CLASS='tm-share-btn-v4';

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #plans .plan{position:relative!important;overflow:visible!important;}
      #plans .${BTN_CLASS}{
        position:absolute!important;
        left:14px!important;
        top:14px!important;
        z-index:99999!important;
        display:flex!important;
        width:78px!important;
        height:36px!important;
        align-items:center!important;
        justify-content:center!important;
        box-sizing:border-box!important;
        margin:0!important;
        padding:0!important;
        border:1px solid rgba(118,89,217,.18)!important;
        border-radius:13px!important;
        background:#fff!important;
        color:#654bc4!important;
        font-family:inherit!important;
        font-size:14px!important;
        font-weight:800!important;
        line-height:36px!important;
        text-align:center!important;
        cursor:pointer!important;
        box-shadow:0 5px 18px rgba(23,33,43,.14)!important;
        opacity:1!important;
        visibility:visible!important;
        pointer-events:auto!important;
        transform:none!important;
      }
      #plans .${BTN_CLASS}:hover{transform:translateY(-1px)!important;}
      .tm-share-backdrop-v4{position:fixed;inset:0;background:rgba(23,33,43,.40);z-index:999999;display:none;align-items:flex-end;}
      .tm-share-backdrop-v4.show{display:flex;}
      .tm-share-sheet-v4{width:100%;max-height:82vh;overflow:auto;background:#f7f8fb;border-radius:28px 28px 0 0;padding:20px;box-shadow:0 -20px 60px rgba(23,33,43,.14);}
      .tm-share-row-v4{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
      .tm-share-row-v4 button{padding:11px 14px;border:0;border-radius:14px;background:#eee9ff;color:#654bc4;font-weight:800;cursor:pointer;}
      .tm-share-row-v4 .primary{background:linear-gradient(135deg,#7659d9,#9a7de7);color:#fff;}
      .tm-share-url-v4{width:100%;padding:12px;border:1px solid #e0e5ea;border-radius:14px;background:#fff;word-break:break-all;font-size:12px;color:#65717e;box-sizing:border-box;}
    `;
    document.head.appendChild(s);
  }

  function snapshot(){
    const data={};
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      try{data[k]=localStorage.getItem(k);}catch(e){}
    }
    return data;
  }

  function encode(obj){
    const bytes=new TextEncoder().encode(JSON.stringify(obj));
    let bin='';
    bytes.forEach(b=>bin+=String.fromCharCode(b));
    return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }

  function showShare(planEl,index){
    installStyle();
    let box=document.getElementById('tmShareBoxV4');
    if(!box){
      box=document.createElement('div');
      box.id='tmShareBoxV4';
      box.className='tm-share-backdrop-v4';
      box.innerHTML=`
        <div class="tm-share-sheet-v4">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b style="font-size:20px">分享行程</b>
            <button id="tmShareCloseV4" style="border:0;background:#fff;border-radius:12px;padding:9px 12px;cursor:pointer">关闭</button>
          </div>
          <p id="tmShareTitleV4" style="font-weight:800;margin:14px 0 8px"></p>
          <div id="tmShareUrlV4" class="tm-share-url-v4"></div>
          <div class="tm-share-row-v4">
            <button id="tmShareCopyV4" class="primary">复制分享链接</button>
            <button id="tmShareNativeV4">系统分享</button>
          </div>
          <div style="font-size:12px;color:#7b8794;line-height:1.6;margin-top:8px">朋友打开这个链接后，会进入同一份行程数据，并自动打开这份大行程。</div>
        </div>`;
      document.body.appendChild(box);
      box.addEventListener('click',e=>{if(e.target===box||e.target.id==='tmShareCloseV4')box.classList.remove('show');});
    }

    const title=planEl.querySelector('b')?.textContent?.trim()||'我的行程';
    const payload={v:4,planTitle:title,planIndex:index,storage:snapshot()};
    const url=location.origin+location.pathname+'#tm-share='+encode(payload);
    box.querySelector('#tmShareTitleV4').textContent=title;
    box.querySelector('#tmShareUrlV4').textContent=url;
    box.querySelector('#tmShareCopyV4').onclick=async()=>{
      try{await navigator.clipboard.writeText(url);}catch(e){const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
      if(typeof window.toast==='function')window.toast('分享链接已复制');
    };
    box.querySelector('#tmShareNativeV4').onclick=async()=>{
      if(navigator.share){try{await navigator.share({title:'旅伴旅行管家 · '+title,text:'查看我的旅行行程',url});}catch(e){}}
      else{try{await navigator.clipboard.writeText(url);if(typeof window.toast==='function')window.toast('当前设备不支持系统分享，已复制链接');}catch(e){}}
    };
    box.classList.add('show');
  }

  function enhance(){
    installStyle();
    const plans=document.getElementById('plans');
    if(!plans) return;
    plans.querySelectorAll('.plan').forEach((p,i)=>{
      let b=p.querySelector('.'+BTN_CLASS);
      if(!b){
        b=document.createElement('span');
        b.className=BTN_CLASS;
        b.textContent='↗ 分享';
        b.setAttribute('role','button');
        b.setAttribute('tabindex','0');
        p.insertBefore(b,p.firstChild);
      }
      b.onclick=e=>{e.preventDefault();e.stopPropagation();showShare(p,i);return false;};
      b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showShare(p,i);}};
    });
  }

  // 不依赖原页面的渲染时序：只要方案卡片出现，就立即补上分享按钮。
  const boot=()=>{installStyle();enhance();setTimeout(enhance,100);setTimeout(enhance,500);setTimeout(enhance,1200);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
})();
