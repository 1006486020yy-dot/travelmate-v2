(() => {
  'use strict';

  const STYLE_ID = 'tm-share-style-final';
  const BTN_CLASS = 'tm-share-btn-final';
  const SHARE_PREFIX = '#tm-share=';

  function css() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #plans .plan { position: relative !important; overflow: visible !important; }
      #plans .${BTN_CLASS} {
        position: absolute !important;
        left: 14px !important;
        top: 14px !important;
        z-index: 999999 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 82px !important;
        height: 36px !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(118,89,217,.18) !important;
        border-radius: 13px !important;
        background: #fff !important;
        color: #654bc4 !important;
        font-family: inherit !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        cursor: pointer !important;
        box-shadow: 0 5px 18px rgba(23,33,43,.14) !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      #plans .${BTN_CLASS}:hover { transform: translateY(-1px) !important; }
      .tm-share-mask {
        position: fixed; inset: 0; z-index: 2147483000;
        display: none; align-items: flex-end;
        background: rgba(23,33,43,.42);
      }
      .tm-share-mask.show { display: flex; }
      .tm-share-sheet {
        width: 100%; max-height: 86vh; overflow: auto;
        box-sizing: border-box; padding: 20px;
        background: #f7f8fb; border-radius: 28px 28px 0 0;
        box-shadow: 0 -20px 60px rgba(23,33,43,.16);
      }
      .tm-share-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
      .tm-share-actions button {
        border:0; border-radius:14px; padding:11px 15px;
        background:#eee9ff; color:#654bc4; font-weight:800; cursor:pointer;
      }
      .tm-share-actions .primary { background:linear-gradient(135deg,#7659d9,#9a7de7); color:#fff; }
      .tm-share-url {
        margin-top:10px; padding:12px; background:#fff;
        border:1px solid #e0e5ea; border-radius:14px;
        word-break:break-all; font-size:12px; color:#65717e;
      }
      .tm-public {
        position:fixed; inset:0; z-index:2147482999; overflow:auto;
        background:radial-gradient(circle at 0 0,#e8e0ff,transparent 45%),#f5f6fa;
        padding:20px; box-sizing:border-box;
      }
      .tm-public-inner { max-width:900px; margin:0 auto; padding-bottom:40px; }
      .tm-public-card {
        background:#ffffffdd; border:1px solid #fff; border-radius:22px;
        padding:18px; margin:12px 0; box-shadow:0 15px 40px #1d2b3b12;
      }
      .tm-public-day { font-weight:900; font-size:18px; margin-bottom:8px; }
      .tm-public-event { padding:13px 0; border-top:1px solid #ececf2; }
      .tm-public-event:first-child { border-top:0; }
      .tm-public-time { color:#7659d9; font-weight:900; margin-right:10px; }
      .tm-public-addr { color:#65717e; font-size:12px; margin-top:5px; }
      .tm-public-note { color:#7b8794; font-size:12px; margin-top:4px; }
      .tm-public-close { border:0; border-radius:13px; padding:10px 14px; background:#eee9ff; color:#654bc4; font-weight:800; cursor:pointer; }
    `;
    document.head.appendChild(s);
  }

  function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }

  function decode(text) {
    const base64 = text.replace(/-/g,'+').replace(/_/g,'/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function shareUrl(plan) {
    const payload = { v: 6, plan };
    return location.origin + location.pathname + SHARE_PREFIX + encode(payload);
  }

  function getShareBox() {
    let box = document.getElementById('tmShareFinal');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'tmShareFinal';
    box.className = 'tm-share-mask';
    box.innerHTML = `
      <div class="tm-share-sheet">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <b style="font-size:20px">分享行程</b>
          <button id="tmShareClose" class="tm-public-close">关闭</button>
        </div>
        <div id="tmShareName" style="font-weight:800;margin-top:14px"></div>
        <div id="tmShareUrl" class="tm-share-url"></div>
        <div class="tm-share-actions">
          <button id="tmShareCopy" class="primary">复制分享链接</button>
          <button id="tmShareNative">系统分享</button>
        </div>
        <div style="font-size:12px;color:#7b8794;line-height:1.6;margin-top:9px">
          这个链接包含当前大行程本身，不依赖你朋友设备里的本地数据。
        </div>
      </div>`;
    document.body.appendChild(box);
    box.addEventListener('click', e => {
      if (e.target === box || e.target.id === 'tmShareClose') box.classList.remove('show');
    });
    return box;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    if (typeof window.toast === 'function') window.toast('分享链接已复制');
  }

  function openShare(plan) {
    css();
    const box = getShareBox();
    const url = shareUrl(plan);
    box.querySelector('#tmShareName').textContent = plan?.name || '我的行程';
    box.querySelector('#tmShareUrl').textContent = url;
    box.querySelector('#tmShareCopy').onclick = () => copyText(url);
    box.querySelector('#tmShareNative').onclick = async () => {
      if (navigator.share) {
        try { await navigator.share({ title:'旅伴旅行管家 · ' + (plan?.name || '我的行程'), text:'查看我的旅行行程', url }); }
        catch (_) {}
      } else {
        await copyText(url);
      }
    };
    box.classList.add('show');
  }

  function addButtons() {
    css();
    const plans = document.getElementById('plans');
    if (!plans) return;
    const planEls = plans.querySelectorAll('.plan');
    planEls.forEach((el, index) => {
      let btn = el.querySelector('.' + BTN_CLASS);
      if (!btn) {
        btn = document.createElement('span');
        btn.className = BTN_CLASS;
        btn.textContent = '↗ 分享';
        btn.setAttribute('role','button');
        btn.setAttribute('tabindex','0');
        el.insertBefore(btn, el.firstChild);
      }
      const handler = e => {
        e.preventDefault();
        e.stopPropagation();
        const keys = Object.keys(window.P || {});
        const key = keys[index];
        const plan = key && window.P[key] ? JSON.parse(JSON.stringify(window.P[key])) : null;
        if (plan) openShare(plan);
      };
      btn.onclick = handler;
      btn.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') handler(e);
      };
    });
  }

  function renderPublic(plan) {
    if (!plan || !Array.isArray(plan.days)) return;
    css();
    document.querySelectorAll('.tm-public').forEach(x => x.remove());
    const root = document.createElement('div');
    root.className = 'tm-public';
    root.innerHTML = `
      <div class="tm-public-inner">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div><div style="font-size:12px;color:#7b8794">旅伴旅行管家 · 行程分享</div><h1 style="margin:6px 0 0">${escapeHtml(plan.name || '我的行程')}</h1></div>
          <button id="tmPublicClose" class="tm-public-close">返回</button>
        </div>
        <div class="tm-public-card"><b>共享行程</b><div style="font-size:12px;color:#7b8794;margin-top:6px">朋友可以直接查看，不需要拥有你的本地数据。</div></div>
        <div id="tmPublicDays"></div>
      </div>`;
    document.body.appendChild(root);
    root.querySelector('#tmPublicClose').onclick = () => {
      history.replaceState(null,'',location.pathname + location.search);
      root.remove();
      location.reload();
    };
    const days = root.querySelector('#tmPublicDays');
    plan.days.forEach((day, i) => {
      const events = Array.isArray(day[2]) ? day[2] : [];
      const card = document.createElement('div');
      card.className = 'tm-public-card';
      card.innerHTML = `<div class="tm-public-day">DAY ${i + 1} · ${escapeHtml(day[0] || '')} <span style="font-size:13px;color:#7b8794;font-weight:600">${escapeHtml(day[1] || '')}</span></div>`;
      events.forEach(ev => {
        const row = document.createElement('div');
        row.className = 'tm-public-event';
        row.innerHTML = `<span class="tm-public-time">${escapeHtml(ev[0] || '—')}</span><b>${escapeHtml(ev[1] || '')}</b><div class="tm-public-addr">📍 ${escapeHtml(ev[2] || '')}</div><div class="tm-public-note">${escapeHtml(ev[3] || '')}</div>`;
        card.appendChild(row);
      });
      days.appendChild(card);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function checkIncomingShare() {
    if (!location.hash.startsWith(SHARE_PREFIX)) return;
    try {
      const data = decode(location.hash.slice(SHARE_PREFIX.length));
      if (data && data.plan) renderPublic(data.plan);
    } catch (e) {
      console.warn('TravelMate share link invalid', e);
    }
  }

  function boot() {
    css();
    addButtons();
    [50,150,400,800,1500,3000].forEach(ms => setTimeout(addButtons, ms));
    checkIncomingShare();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  new MutationObserver(addButtons).observe(document.body, { childList:true, subtree:true });
  window.addEventListener('hashchange', checkIncomingShare);
})();
