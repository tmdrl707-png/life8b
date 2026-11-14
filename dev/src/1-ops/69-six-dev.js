/* [1 운영] 69-six.js 에서 나눈 부분 (2026-11-15 단위별 정리). 실행 순서는 template.html 그대로 */
// 진로 이야기 대화창의 작은 그림 카드도 육각형으로

/* ---------- 개발자 모드: 시안 고르기 ---------- */
openDev=(old=>function(){ old(); try{ const d=$('devP'), box=d&&d.querySelector('.dbox'); if(!G.tok||!box||box.querySelector('#sixDev')) return;
  const sg=(k,arr,cur)=>`<div class="seg" data-six="${k}">${arr.map(([v,t])=>`<button data-v="${v}" class="${cur===v?'on':''}">${t}</button>`).join('')}</div>`;
  const row=document.createElement('div'); row.id='sixDev'; row.style.cssText='display:flex;flex-direction:column;gap:8px';
  row.innerHTML=`<div class="drow"><label>능력치 표시</label>${sg('life8b_sixhud',[['A','A 막대'],['B','B 동그라미'],['C','C 육각형'],['D','D 점']],sixHudV())}</div>
    <div class="drow"><label>내 정보</label>${sg('life8b_sixinfo',[['M1','육각형+카드'],['M2','막대 목록']],sixInfoV())}<button class="btn" id="vowTry">'소중한 것' 설문 미리 보기</button></div>`;
  const err=$('devErr'); box.insertBefore(row,err); row.querySelectorAll('.seg').forEach(s=>s.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; ls(s.dataset.six,b.dataset.v); [...s.children].forEach(x=>x.classList.toggle('on',x===b)); if(G.life) renderHud(); });
  $('vowTry').onclick=()=>{ d.hidden=true; vowOpen(v=>{ if(G.life){ G.life.val=v; renderHud(); } }); }; }catch(e){ console.warn(e); } })(openDev);
// 개발자 모드로 시작한 삶은 '새로 알게 된 것' 카드를 띄우지 않는다 (시험·확인용)
devStart=(old=>function(){ const r=old.apply(this,arguments); try{ const L=G.life; if(L&&L.f){ L.f.unS=L.f.unS||{}; SIX.forEach(k=>L.f.unS[k]=1); } }catch(e){} return r; })(devStart);
