/* 64-young: 0~20살 전면 점검(11-14)에서 찾은 문장 손질
   - 누구에게나 쓰던 '출근(등교)', '학교(일터)', '회사(일터)', '형(언니)', '엄마(아빠)', '아빠 회사(일)'를 그 삶의 나이·성별·가족에 맞는 한 낱말로
   - 가난한 나라·시골 아이에게 '어린이집'에서 첫 친구 → 이웃 아이
   - 어린아이가 오토바이로 '출근' → 부모님 오토바이 뒤에 타고 등교
   tx(사건·선택 글)와 pv(기억에 남는 글) 둘 다에 건다. */
(function(){ const P=Life.prototype;
  const kid=L=>L.age<19||!!(L.f&&L.f.school);
  const par=L=>{ const fm=L.fam, f=L.f||{}; const mom=!f.pgone&&(!fm||fm.mom.al&&f.div!=='mom'), dad=!f.pgone&&(!fm||fm.dad.al&&f.div!=='dad'); return {mom,dad}; };
  const YF=[
    [/빗속에 우비를 뒤집어쓰고 오토바이로 출근\(등교\)했다\./,L=>L.age<16?`빗속에 우비를 뒤집어쓰고 ${par(L).dad?'아빠':par(L).mom?'엄마':'어른'} 오토바이 뒤에 타고 등교했다.`:null],
    [/출근\(등교\)/,L=>kid(L)?'등교':'출근'],
    [/학교\(일터\)/,L=>kid(L)?'학교':'일터'],
    [/회사\(일터\)/,L=>kid(L)?'학교':'회사'],
    [/형\(언니\)/,L=>L.sex?'언니':'형'],
    [/아빠 회사\(일\)가/,L=>{ const p=par(L); return p.dad?'아빠가 하는 일이':p.mom?'엄마가 하는 일이':'집안 형편이'; }],
    [/할머니\(할아버지\)/,L=>{ const gp=(L.fam&&L.fam.gp)||[]; if(!gp.length) return L.gran?'할머니':'친척 어르신'; return gp.some(g=>g.al&&g.sx)?'할머니':gp.some(g=>g.al)?'할아버지':'친척 어르신'; }],
    [/좋아하는 가수\(선수\)의 경기를 보러 갔다/,L=>(String(L.name||'').length+(L.by||0))%2?'좋아하는 가수의 공연을 보러 갔다':'좋아하는 선수의 경기를 보러 갔다'],
    [/엄마\(아빠\)/,L=>{ const p=par(L); return p.mom||!p.dad?'엄마':'아빠'; }],
    // 어린아이에게 어른의 일·장사·돈벌이를 고르게 하던 큰 사건의 선택지와 결과
    [/^평소처럼 한낮에도 일하러 나간다$/,L=>L.age<15?'그래도 한낮에 밖에서 뛰어논다':null],
    [/^일을 다 마쳤다\. 버는 날을 놓치지 않았다\.$/,L=>L.age<15?'땀범벅이 되도록 실컷 놀았다. 다행히 탈은 없었다.':null],
    [/^내 일이 밀려 한동안 바빴다\.$/,L=>L.age<7?'엄마 아빠 일이 밀려 한동안 집이 바빴다.':L.age<15?'숙제가 밀려 한동안 바빴다.':null],
    [/^음식을 만들어 보낸다$/,L=>L.age<12?'엄마를 도와 음식을 날라다 드린다':null],
    [/^행사장에서 음식을 판다$/,L=>L.age<15?'엄마 아빠를 도와 행사장에서 음식을 판다':null],
    [/^행사장 장사로 쏠쏠하게 벌었다\.$/,L=>L.age<15?'엄마 아빠를 도와 음식을 날랐다. 행사장 장사가 쏠쏠했다.':null],
    [/^가축을 팔아 도시로 일하러 간다$/,L=>L.age<15?'가족을 따라 도시로 떠난다':null],
    [/^정든 마을을 떠나 일감을 찾아 나섰다\.$/,L=>L.age<15?'정든 마을을 떠나 가족과 함께 도시로 갔다.':null],
    [/^가축을 팔아 도시로 일하러 가려 했지만/,L=>L.age<15?'가족을 따라 도시로 떠나려 했지만':null],
    [/^어른들과 함께 불길 막는 일을 돕는다$/,L=>L.age<12?'어른들 곁에서 물통을 나르며 돕는다':null],
    [/^세계 경기가 크게 가라앉았다\. 졸업한 선배들이 일자리를 구하지 못한다는 이야기가 들렸다\.$/,L=>L.age<12?'세계 경기가 크게 가라앉았다. 저녁마다 어른들의 얼굴이 어두웠다.':null],
    [/^편한 말로만 지냈다\. 학교 수업이 조금 어려웠다\.$/,L=>L.f&&!L.f.school&&!L.f.elem&&!L.f.sec?'편한 말로만 지냈다. 다른 말을 쓰는 어른들과 이야기하기가 조금 어려웠다.':null],
    // 아기는 장례식을 기억하지 못한다, 돌도 안 된 아기가 친구를 그리워하지 않는다
    [/^(.+세상을 떠나셨다\.) 장례식에서 어른들이 우는 모습을 처음 보았다\.$/,L=>L.age<3?'$1 너무 어려서 기억나지 않지만, 가족들은 오래 슬퍼했다.':null],
    [/^집에서 지내는 날이 길어졌다\. 친구들이 보고 싶었다\.$/,L=>L.age<4?'집에서 지내는 날이 길어졌다. 온 가족이 한집에 오래 붙어 있었다.':null],
    [/^집 둘레의 고인 물을 모두 비웠다\.$/,L=>L.age<6?'어른들이 집 둘레의 고인 물을 모두 비웠다.':null],
    [/^곡식을 모두 통에 담고 뚜껑을 닫았다\.$/,L=>L.age<6?'어른들이 곡식을 모두 통에 담고 뚜껑을 닫았다.':null],
    [/^집 안을 깨끗이 청소했다\.$/,L=>L.age<6?'어른들이 집 안을 깨끗이 청소했다.':null],
    [/^물은 늘 끓여서 식혀 마셨다\. 손 씻기도 빼먹지 않았다\.$/,L=>L.age<5?'엄마가 물을 늘 끓여 식혀 먹였다. 손도 자주 씻겨 주었다.':null],
    [/^어린이집에서 첫 친구를 사귀었다\.$/,L=>(L.C.tier<=1||(L.C.tier<=2&&L.set==='R'))?'옆집 아이와 처음으로 단짝이 되었다.':null]];
  const fix=(L,s)=>{ if(typeof s!=='string'||s.length>400) return s; for(const [re,f] of YF) if(re.test(s)){ const v=f(L); if(v!=null) s=s.replace(re,v); } return s; };
  const _tx=P.tx; P.tx=function(s){ return _tx.call(this,fix(this,s)); };
  const _pv=P.pv; P.pv=function(t){ return fix(this,_pv.call(this,t)); };
})();

// 진로 이야기의 '너는 ○○과 ○○이 돋보여': 행복·재산은 빼고, 아직 열리지 않은 능력치도 빼고 여섯 능력치에서 고른다
Object.assign(AX_BASE,{h:80});
topAxes=function(L){ const ks=['h','r','e','k','t'].filter(k=>L.s[k]!=null&&(!L.sixOpen||L.sixOpen(k))); const out=ks.sort((a,b)=>L.s[b]/AX_BASE[b]-L.s[a]/AX_BASE[a]).slice(0,2); while(out.length<2) out.push(['r','h','e'].find(k=>!out.includes(k))); return out; };

// 아이(16살 전)가 겪는 돈 드는 일(전기 나가 발전기, 홍수 피해 …)은 내 통장이 아니라 집 살림(w)에서 나간다.
// 예전에는 아이의 '가진 돈'이 마이너스가 되어, 어른이 되는 날 빚을 안고 시작했다. 받은 돈(세뱃돈·품삯)은 그대로 모인다.
(function(){ const P=Life.prototype, _ap=P.apply; P.apply=function(fx){ if(fx&&this.age<16&&fx['@']<0&&!this.f.job){ const g=Object.assign({},fx), v=g['@']; delete g['@']; this.w=Math.max(.02,(this.w||0)+v*.012); this.f.famPay=(this.f.famPay||0)+v; return _ap.call(this,g); } return _ap.call(this,fx); };
  const _ld=Life.load; Life.load=function(o){ const L=_ld.call(this,o); try{ if(L.age<16&&L.cash<0&&!L.f.job){ L.cash=0; } }catch(e){} return L; }; })();
