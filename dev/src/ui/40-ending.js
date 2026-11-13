/* ========== 마지막 장면 ========== */
const FONT='"Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif';
// 세 장면: 어린 시절 · 한창때 · 나이 들어서, 각 시기에서 가장 마음에 남을 기억 하나씩 (직접 고른 일·가족의 일이 먼저)
function pickThree(L){ const a=L.lifespan||L.age, M=L.mem.filter(m=>m.a>0&&m.t&&!/^(몸이 많이 약해져|크게 아파 집에서)/.test(m.t));
  const best=arr=>arr.length?arr.reduce((b,m)=>memScore(m)>memScore(b)?m:b,arr[0]):null;
  if(a<15) return M.slice().sort((x,y)=>memScore(y)-memScore(x)).slice(0,3).sort((x,y)=>x.a-y.a);
  const c1=Math.min(13,a*.3), c2=Math.max(c1+2,Math.min(50,a*.7));
  return [...new Set([best(M.filter(m=>m.a<c1)),best(M.filter(m=>m.a>=c1&&m.a<c2)),best(M.filter(m=>m.a>=c2))].filter(Boolean))]; }
// 남겨진 사람들의 말: 그 사람의 성향·관계에 맞는 말 + 그 사람과 실제로 함께한 기억
function voicesOf(L){ const P=L.ppl||{}, sp=P.spouse, kids=L.kids||[], top=L.topTrait(), fm=L.fam, him=L.sex===0?'아버지':'어머니', out=[];
  const hs=s=>{ let x=7; for(const c of String(s)) x=(x*31+c.charCodeAt(0))>>>0; return x; }, pk=(arr,salt)=>arr[(hs(L.name+salt)+(L.ws||0))%arr.length];
  const ref=(...names)=>{ const ns=names.filter(Boolean).map(String).filter(n=>n.length>=2); if(!ns.length) return null; const ms0=L.mem.filter(m=>m.a>0&&ns.some(n=>String(m.t).includes(n)||String(m.q||'').includes(n))), ms1=ms0.filter(m=>!/(돈을 갚|돈을 빌|빌려준 돈|빌린 돈)/.test(m.t)), ms=ms1.length?ms1:ms0; return ms.length?ms.reduce((b,m)=>memScore(m)>memScore(b)?m:b,ms[0]):null; };
  if((L.lifespan||0)<15){
    if(fm&&fm.mom.al) out.push([`엄마 ${fm.mom.n}`,pk(['네가 우리 아이로 와 줘서 고마웠어. 너와 함께한 날들이 엄마의 전부였단다.','작은 손으로 내 손가락을 꼭 쥐던 날을 잊지 못할 거야.','더 오래 안아 주고 싶었어. 그래도 너를 만나서 행복했단다.'],'mom'),null]);
    if(fm&&fm.dad.al&&L.f.div!=='dad') out.push([`아빠 ${fm.dad.n}`,pk(['네 웃음소리가 집 안을 채우던 날들을 기억할게.','아빠가 더 지켜 주지 못해 미안해. 사랑한다.'],'dad'),null]);
    const sb=fm?fm.sibs.filter(x=>x.born&&x.al):[]; if(sb.length) out.push([`${sibTerm(L,sb[0])} ${sb[0].n}`,'같이 놀던 마당에 가면 아직도 네가 있을 것 같아.',ref(sb[0].n,sb[0].g)]);
    if(!out.length) out.push(['이웃','그 집 아이의 웃음소리를 동네 사람들이 오래 기억했어요.',null]);
    return out; }
  if(sp&&!L.f.widow) out.push([`${L.sex?'남편':'아내'} ${sp.n}`,pk(L.s.r>=55?['함께여서 다행이었어요. 다음에도 꼭 다시 만나요.','평범한 날들이 가장 좋았어요. 당신이 있어서요.','당신 옆에서 늙어 가서 행복했어요.']:['더 많이 웃게 해 주지 못해 미안해요. 고마웠어요.','서로 바빠 마음을 다 전하지 못했네요. 그래도 늘 고마웠어요.'],'sp'),ref(sp.n,sp.given)]);
  if(kids.length){ const k=kids[0], KL={K:`${him}는 아무리 바빠도 제 이야기를 끝까지 들어 주셨어요.`,D:`새벽마다 일하러 나가시던 ${him}의 뒷모습을 기억해요. 그게 저를 키웠어요.`,G:`가진 게 많지 않아도 ${him}는 늘 웃으셨어요. 저도 그렇게 살고 싶어요.`,C:`세상이 궁금하다며 저를 데리고 여기저기 다니셨죠. 그 길들이 다 제 것이 되었어요.`,B:`해 보라고, 틀려도 괜찮다고 ${him}는 늘 제 등을 밀어 주셨어요.`};
    out.push([`${k.sex?'딸':'아들'} ${k.n}`,KL[top]||`${him}는 말수는 적었지만, 늘 저를 위해 애쓰셨다는 걸 이제는 알아요.`,ref(k.n,k.given)]); }
  if(P.friend){ const FL={K:'누구에게나 다정했지. 나한테는 특히 더.',C:'같이 있으면 늘 새로운 걸 보게 해 주던 친구였어.',B:'내가 망설일 때마다 먼저 한 걸음 내디뎌 준 사람.',D:'약속은 꼭 지키던 사람. 그래서 믿을 수 있었어.',G:'작은 일에도 고맙다고 말하던 네 목소리가 그리워.'};
    out.push([`친구 ${P.friend.n}`,L.s.r>=60?pk(['힘들 때마다 네가 먼저 연락해 줬지. 그게 얼마나 고마웠는지 몰라.',FL[top]||'너랑 웃던 날들이 아직도 생생해.'],'fr'):pk(['늘 다음에 보자고만 했네. 조금 더 자주 볼걸 그랬어.','바쁘다는 핑계로 미뤘던 약속들이 이제야 마음에 걸려.'],'fr'),ref(P.friend.n)]); }
  if(!kids.length&&fm){ const sb=fm.sibs.filter(x=>x.born&&x.al); if(sb.length) out.push([`${sibTerm(L,sb[0])} ${sb[0].n}`,pk(['어릴 때 한 이불을 덮고 자던 사이였지. 네 덕분에 덜 외로웠어.','싸우기도 많이 했지만, 결국 제일 먼저 달려와 준 건 너였어.'],'sib'),ref(sb[0].n,sb[0].g)]); }
  const JJ=L.jobs||[], lastCo=JJ.map((j,i)=>({...j,y:(i<JJ.length-1?JJ[i+1].a:(L.lifespan||L.age))-j.a})).filter(j=>j.co&&!/이곳저곳/.test(j.co)).sort((x,y)=>y.y-x.y)[0];
  if(L.s.k>=60&&lastCo) out.push([`${lastCo.co}에서 함께 일한 후배`,pk(['모르는 걸 물으면 한 번도 귀찮아하지 않으셨어요.','힘든 날 먼저 남아서 도와주시던 분이었어요.'],'co'),ref(lastCo.co)]);
  else out.push([`${L.town||'동네'}의 이웃`,pk(['길에서 마주치면 늘 먼저 인사해 주던 분이었어요.','우리 동네에 그런 사람이 있어서 고마웠어요.','어려울 때 말없이 문 앞에 먹을 것을 두고 가시던 분이에요.'],'nb'),null]);
  return out.slice(0,4); }
// ----- 엔딩 재료: 갈림길 · 우연 · 잃은 것과 남긴 것 · 삶의 길 · 세계 지도 -----
const END_CHANCE_SC=/^(sick|hosp|flood|quake|storm|fire|drought|heat|cold|volcano|unrest|jobloss|farewell|epi)$/;
const END_CHANCE_TX=/(사고|다쳤|크게 아파|입원|가뭄|홍수|지진|태풍|산불|폭염|한파|화산|감염|전염|유행|뜻밖|복권|당첨|문을 닫|사람을 줄인|다른 나라로 옮겨|세상을 떠났|먼저 떠났)/;
const END_HELP=/(돕|도와|나눠|나누|챙|가르|빌려|봉사|양보|돌본|돌보|함께 준비|맡아)/;
function endCut(s,n){ s=String(s||''); return s.length>n?s.slice(0,n-1)+'…':s; }
function endKindOf(m){ return m.sc||(typeof sceneKindOf==='function'?sceneKindOf(memT(m)+' '+(m.q||'')):'life'); }
function endSpread(arr,n){ if(arr.length<=n) return arr.slice(); const out=[]; for(let i=0;i<n;i++){ const m=arr[Math.round(i*(arr.length-1)/Math.max(1,n-1))]; if(!out.includes(m)) out.push(m); } return out; }
// 갈림길: 큰 일 가운데 고른 것 (학교·일·가정·이주처럼 길을 바꾼 선택이 먼저)
function endCross(L,n){ const W=/(학교|진학|대학|입학|졸업|일자리|일을|회사|공장|직업|결혼|이사|도시|다른 나라|유학|그만두|가게|농사|군대|복무|고등학교|중학교|기술)/;
  const M=L.mem.filter(m=>m.a>0&&m.q&&m.l&&m.big), pool=M.filter(m=>W.test(m.q+' '+m.l));
  return endSpread((pool.length>=3?pool:M).slice().sort((a,b)=>a.a-b.a),n||5); }
// 우연: 고를 수 없었던 일 (병·사고·재해·뜻밖의 일·이별)
function endChance(L,n){ return endSpread(L.mem.filter(m=>m.a>0&&(END_CHANCE_SC.test(endKindOf(m))||END_CHANCE_TX.test(String(m.t)))).sort((a,b)=>a.a-b.a),n||4); }
function endLossLeft(L){ const fm=L.fam, P=L.ppl||{}, lost=[], left=[];
  if(fm){ if(!fm.dad.al&&fm.dad.dA!=null) lost.push([fm.dad.dA,`아빠 ${fm.dad.n}`]); if(!fm.mom.al&&fm.mom.dA!=null) lost.push([fm.mom.dA,`엄마 ${fm.mom.n}`]);
    fm.sibs.filter(x=>x.born&&!x.al&&x.dA!=null).forEach(x=>lost.push([x.dA,`${sibTerm(L,x)} ${x.n}`])); }
  if(L.f.widow&&P.spouse) lost.push([L.f.widA,`${L.sex?'남편':'아내'} ${P.spouse.n}`]); lost.sort((x,y)=>x[0]-y[0]);
  const J=L.jobs||[], jobs=[]; J.forEach((j,i)=>{ if(i>0&&j.why&&/(줄인|문을 닫|옮겨 간|잃|어려워|그만)/.test(j.why)) jobs.push([j.a,`${J[i-1].n} 일자리`]); });
  if(P.spouse&&!L.f.widow) left.push(`${L.sex?'남편':'아내'} ${P.spouse.n}`);
  (L.kids||[]).forEach(k=>left.push(`${k.sex?'딸':'아들'} ${k.n}`)); if(P.friend) left.push(`친구 ${P.friend.n}`);
  const helped=L.mem.filter(m=>m.a>0&&m.l&&END_HELP.test(m.l));
  const longJ=J.map((j,i)=>({j,y:(i<J.length-1?J[i+1].a:L.lifespan)-j.a})).sort((x,y)=>y.y-x.y)[0];
  const hob=(L.f.hob||[]).slice().sort((x,y)=>y.lv-x.lv)[0];
  return {lost,jobs,left,helped,longJ,hob,miss:L.miss||0,fail:L.fail||0}; }
// 삶의 길: 나이 축 위에 고른 갈림길(위)과 일어난 일(아래)
function endPathSVG(L){ const a=Math.max(1,L.lifespan||L.age), W=760, H=250, x0=20, x1=W-20, my=125, X=v=>x0+(x1-x0)*Math.min(1,Math.max(0,v/a));
  const up=endCross(L,6).map(m=>({a:m.a,t:endCut(m.l,13),c:'#FFC9A8'})), dn=[], LL=endLossLeft(L);
  (L.jobs||[]).forEach(j=>dn.push({a:j.a,t:endCut(j.n,9)+' 시작',c:'#9FC6E8'})); if(L.f.marA) dn.push({a:L.f.marA,t:'결혼',c:'#F2C14E'});
  (L.kids||[]).forEach(k=>dn.push({a:k.b,t:`${k.sex?'딸':'아들'} ${k.given||''} 태어남`,c:'#F2C14E'}));
  LL.lost.forEach(l=>dn.push({a:l[0],t:endCut(l[1],8)+' 떠남',c:'#B9A6D6'})); LL.jobs.forEach(l=>dn.push({a:l[0],t:'일자리 잃음',c:'#B9A6D6'}));
  const lay=(arr,dir)=>{ const lanes=[[],[],[]], out=[]; arr.sort((p,q)=>p.a-q.a).forEach(p=>{ const x=X(p.a), w=(String(p.a).length+2+p.t.length)*12.5+8, x0b=Math.min(Math.max(x-6,0),W-w);
      for(let li=0;li<3;li++){ if(lanes[li].every(r=>x0b>r[1]+6||x0b+w<r[0]-6)){ lanes[li].push([x0b,x0b+w]); out.push({...p,x,lx:x0b,y:my+dir*(30+li*30)}); return; } } });
    return out; };
  const U=lay(up,-1), D=lay(dn,1);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="나이에 따른 삶의 길" class="pathsvg"><line x1="${x0}" x2="${x1}" y1="${my}" y2="${my}" stroke="#6B7E8D" stroke-width="3" stroke-linecap="round"/>`;
  for(let t=0;t<=a;t+=10) s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${my-5}" y2="${my+5}" stroke="#6B7E8D"/><text x="${X(t)}" y="${my+(t%20?-9:18)}" font-size="11" fill="#8FA2B2" text-anchor="middle">${t}살</text>`;
  [...U,...D].forEach(p=>{ s+=`<line x1="${p.x}" x2="${p.x}" y1="${my}" y2="${p.y+(p.y<my?6:-14)}" stroke="${p.c}" stroke-opacity=".55"/><circle cx="${p.x}" cy="${my}" r="5" fill="${p.c}"/><text x="${p.lx}" y="${p.y}" font-size="13" fill="${p.c}" font-weight="700">${p.a}살 ${esc(p.t)}</text>`; });
  s+=`<circle cx="${X(a)}" cy="${my}" r="7" fill="#EEF3F6"/></svg>`; return s; }
// 같은 1초에 태어난 사람들을 세계 지도에
function endMapSVG(L){ let s=worldSVG(L,'world'); const lab=(L.comps||[]).map(p=>{ const q=GEO[p.c]; if(!q) return ''; const x=q[0]+180, y=90-q[1];
    return `<text x="${x+3}" y="${y-2.5}" font-size="4.6" font-weight="700" fill="#1E3F7A">${esc(p.n)} · ${p.ls}세</text>`; }).join('');
  return s.replace(/<\/svg>$/,lab+'</svg>'); }

function finishLife(){
  const L=G.life, a=L.lifespan, P=L.ppl||{}, sp=P.spouse, kids=L.kids||[], by=L.by||2026, C=L.C, K=COUNTRIES.KR, W=worldAvg(), fm=L.fam, young=a<15, nm=L.name;
  const top=L.topTrait(), kidN=kids.map(k=>k.n), cz=causeOf(L), sudden=L.cause==='sudden'||L.cause==='epi';
  const list=arr=>{ if(arr.length<=1) return arr.join(''); const h=arr.slice(0,-1); h[h.length-1]=josa(h[h.length-1],'과','와'); return h.join(', ')+' '+arr[arr.length-1]; };
  const hp=(L.hist||[]).filter(x=>x.a>=1).reduce((b,x)=>x.j>(b?b.j:-1)?x:b,null);
  // ① 마지막 순간: 곁에 누가 있었는지, 어떻게 떠났는지에 맞는 문장
  const withN=[sp&&!L.f.widow&&sp.n].concat(kidN.slice(0,3)).filter(Boolean);
  const momN=fm?fm.mom.n:(P.mom?P.mom.n:''), momOK=fm?fm.mom.al:!!P.mom, dadOK=fm?fm.dad.al&&L.f.div!=='dad':!!P.dad, dadN=fm?fm.dad.n:(P.dad?P.dad.n:'');
  const sibA=fm?fm.sibs.filter(x=>x.born&&x.al).map(x=>`${sibTerm(L,x)} ${x.n}`):[];
  const near=young?[momOK&&`엄마 ${momN}`,dadOK&&`아빠 ${dadN}`].filter(Boolean):withN.length?withN:sibA.length?sibA.slice(0,2):P.friend?[`오랜 친구 ${P.friend.n}`]:[];
  const who=near.length?(sudden?`소식을 들은 ${josa(list(near),'이','가')} 달려왔습니다.`:`${josa(list(near),'이','가')} 곁을 지키고 있었습니다.`):(sudden?'소식은 이웃들에게 천천히 전해졌습니다.':'창밖으로는 늘 걷던 길이 보였습니다.');
  const how=L.cause==='epi'?`${josa(cz.n,'이','가')} 번진 해, 갑작스러운 이별이었습니다.`:sudden?'예고 없이 찾아온, 갑작스러운 이별이었습니다.':young?'한동안 앓던 끝이었습니다.':near.length?'오래 앓던 끝에, 마지막 시간은 가까운 사람들과 함께 보냈습니다.':'오래 앓던 끝에, 마지막 시간은 조용히 보냈습니다.';
  const s1=`<p class="soft">${by+a}년 · ${a}살 · ${seasonOf(L)} · ${esc(C.n)} ${esc(L.town||'')}</p><p class="big">${esc(nm)}<span class="nw">(${by}~${by+a})${josa(nm,'은','는').slice(nm.length)}</span> ${young?'짧은 삶을 마쳤습니다.':sudden?'갑작스럽게 삶을 마쳤습니다.':'조용히 눈을 감았습니다.'}</p><p>${esc(who)} ${how}</p><p class="soft">${young?'짧았지만, 분명히 있었던 삶이었습니다.':`${a}년 동안 ${L.n}번의 선택을 하며 살았습니다.`}</p><figure class="lastart"><img src="art/sc/${scArtName(young&&!softOn()?'farewell':'life',L)}.webp" alt="" onerror="this.parentNode.remove()"></figure>`;
  // ② 남겨진 사람들의 말 (한 장에)
  const voices=voicesOf(L);
  const s2=`<div class="voices">${voices.map(v=>`<blockquote class="vq">${esc(v[1])}<cite>${esc(v[0])}</cite>${v[2]?`<span class="mref">함께한 기억 · ${v[2].a}살: ${esc(endCut(memT(v[2]),60))}</span>`:''}</blockquote>`).join('')}</div>`;
  // ③ 삶의 길
  const cross=endCross(L,5), LL=endLossLeft(L), chance=endChance(L,4);
  const s3=`<div class="eone"><p class="big">${a}년의 길</p><p class="soft"><b style="color:#FFC9A8">위</b>는 갈림길에서 고른 것, <b style="color:#9FC6E8">아래</b>는 일·가족에게 일어난 일입니다.</p><div class="epath">${endPathSVG(L)}</div></div>`;
  // ④ 주어진 것 · 고른 것 · 우연
  const given=[`${C.n} ${esc(L.town||'')}(${SETN[L.set]||''})`,`${FAM[L.famI].n} 가정`,L.sex?'여자':'남자',fm?`아빠는 ${esc(fm.dad.job)}, 엄마는 ${esc(fm.mom.job)}`:''].filter(Boolean);
  const gcol=(t,c,arr,empty)=>`<div class="gcol ${c}"><h4>${t}</h4>${arr.length?`<ul>${arr.join('')}</ul>`:`<p class="note">${empty}</p>`}</div>`;
  const s4=`<div class="eone"><p class="big">무엇이 이 삶을 만들었을까요?</p><div class="gcr">${gcol('주어진 것','g',given.map(x=>`<li>${x}</li>`),'')}${gcol('내가 고른 것','c',cross.map(m=>`<li><b>${m.a}살</b> ${esc(endCut(m.l,26))}${m.au?' <small>(시간이 다 되어 저절로)</small>':''}</li>`),'큰 갈림길이 기록되지 않았어요.')}${gcol('우연히 일어난 일','u',chance.map(m=>`<li><b>${m.a}살</b> ${esc(endCut(memT(m),26))}</li>`).concat([`<li><b>${a}살</b> ${esc(cz.n)}</li>`]),'')}</div>
    <p class="ask">이 삶을 가장 크게 바꾼 것은 무엇이었다고 생각하나요?</p><div class="ansrow">${['주어진 것','내가 고른 것','우연히 일어난 일'].map(v=>`<button type="button" class="btn ans" data-ans="big" data-v="${v}">${v}</button>`).join('')}</div></div>`;
  // ⑤ 기억 고르기 → ⑥ 고른 장면이 스쳐 간다
  const scKind=m=>{ const k=endKindOf(m); if(softOn()&&/^(farewell|sick|hosp|unrest)$/.test(k)) return 'life'; const k2=SCENE_TITLE[k]?k:'life'; return typeof scVar==='function'?scVar(k2,memT(m)+' '+(m.q||''),m.a,L):k2; };
  const card=(m,j,n)=>`<article class="ncard anim"><div class="nimg"><canvas class="escene" data-sc="${scKind(m)}" width="640" height="320"></canvas><span class="nage">${m.a}살 · ${by+m.a}년</span>${n>1?`<span class="nno">${j+1} / ${n}</span>`:''}</div><div class="nbody">${m.q?`<p class="mq">${esc(m.q)}${m.l?`<span class="ml">→ ${esc(m.l)}</span>`:''}</p>`:''}<p>${esc(memT(m))}</p></div></article>`;
  const PKC=pickCands(L), PK={sel:[],fav:null}, three=pickThree(L);
  const sceneSlide=()=>{ const ms=PK.sel.length?PK.sel.slice().sort((x,y)=>(x===PK.fav?-1:y===PK.fav?1:0)).map(i=>PKC[i]).filter(Boolean):three;
    if(!ms.length) return '<p class="big">엄마 품에서 방긋 웃던 날이 있었습니다.</p>';
    return `<div class="eone"><p class="soft">눈을 감기 전, ${PK.sel.length?'고른 장면이':'마음에 남은 장면이'} 스쳐 갑니다.</p><div class="cardrow n${ms.length}">${ms.map((m,j)=>card(m,j,ms.length)).join('')}</div>${hp&&!young?`<p class="soft">가장 행복했던 해는 ${by+hp.a}년, ${hp.a}살 무렵이었습니다.</p>`:''}</div>`; };
  // ⑦ 잃은 것과 남긴 것
  const lj=LL.longJ, hb=LL.hob;
  const lostL=LL.lost.map(l=>`<li><b>${l[0]}살</b> ${esc(l[1])}${josa(l[1],'과','와').slice(l[1].length)} 헤어졌습니다</li>`).concat(LL.jobs.map(l=>`<li><b>${l[0]}살</b> ${esc(l[1])}를 잃었습니다</li>`));
  if(LL.miss) lostL.push(`<li>망설이다 놓친 순간 ${LL.miss}번</li>`);
  const leftL=[LL.left.length?`<li>곁에 남은 사람: ${esc(LL.left.slice(0,5).join(', '))}</li>`:'',lj&&lj.y>=3?`<li>${esc(lj.j.n)}${josa(lj.j.n,'으로','로').slice(lj.j.n.length)} ${lj.y}년${L.f.rkTop?` (${esc(L.f.rkTop)}까지)`:''}</li>`:'',hb?`<li>${esc(hb.n)}${josa(hb.n,'을','를').slice(hb.n.length)} ${a-hb.a}년 동안 (Lv.${hb.lv})</li>`:'',
    LL.helped.length?`<li>누군가를 돕거나 나눈 선택 ${LL.helped.length}번 — 예: ${LL.helped.slice(-2).map(m=>`${m.a}살 ‘${esc(endCut(m.l,18))}’`).join(', ')}</li>`:'',
    `<li>${L.house?'살던 집과 ':''}${fmtWon(L.nw||0)}${(L.nw||0)<0?'의 빚':''}</li>`].filter(Boolean);
  const s7=`<div class="eone"><p class="big">떠나보낸 것과 남긴 것</p><div class="ll"><div class="gcol u"><h4>떠나보낸 것</h4>${lostL.length?`<ul>${lostL.join('')}</ul>`:'<p class="note">큰 이별 없이 지나온 삶이었습니다.</p>'}</div><div class="gcol c"><h4>남긴 것</h4><ul>${leftL.join('')}</ul></div></div></div>`;
  // ⑧ 같은 1초에 태어난 사람들 · 어디서 태어났는가
  const le=`${esc(C.n)}에서 태어난 아기의 기대수명은 약 ${C.le}세, 지금 세계 평균은 약 ${Math.round(W.le)}세${L.c!=='KR'?`, 대한민국은 약 ${K.le}세`:''}입니다.${young||C.u5>=20?` ${esc(C.n)}에서는 아이 1000명 가운데 약 ${C.u5}명이 다섯 살이 되기 전에 삶을 마칩니다${L.c!=='KR'?`(대한민국은 약 ${K.u5}명)`:''}.`:''}`;
  const comps=(L.comps||[]).length?`<dl class="whoami">${L.comps.map(p=>`<dt>${esc(p.n)}</dt><dd>${esc(p.cn)} · ${p.sex?'여':'남'} · ${p.ls}세까지 (${esc(p.cause)})</dd>`).join('')}</dl>`:'';
  const s8=`<p class="big">같은 1초에 태어난 사람들</p>${comps}<p>${le}</p><p class="soft">어디에서 태어났는가가, 얼마나 그리고 어떻게 사는가를 바꾸기도 합니다.</p><figure class="emap">${endMapSVG(L)}<figcaption>주황 ${esc(C.n)} · 파랑 같은 1초에 태어난 사람들${L.c!=='KR'?' · 검정 대한민국':''}</figcaption></figure>`;
  // ⑨ 숫자로 본 이 삶 (사망 기록 + 돈) — 행복 점수·자세한 그래프는 마지막 기록 메뉴에
  const dr=deathRecord(L), dcut=dr.indexOf('<p class="soft" style="margin-top:14px">'), recHTML=(dcut>0?dr.slice(0,dcut):dr).replace(/^\s*<p class="soft">[^<]*<\/p>/,'');
  const money=(L.money||[]).length?`<div class="msum"><div><b>${fmtWon(L.earned||0)}</b><span>평생 번 돈 (배우자 포함)</span></div><div><b>${fmtWon(L.nw||0)}</b><span>${(L.nw||0)<0?'남긴 빚':'남긴 재산 (집 포함)'}</span></div><div><b>${L.house?fmtWon(L.house):(L.f.houseN?'팔았음':'없음')}</b><span>내 집</span></div><div><b>${fmtWon(C.med*12)}</b><span>${esc(C.n)}의 보통 한 해 벌이</span></div></div>`:'';
  const s9=`<div class="eone"><p class="big">숫자로 본 ${esc(nm)}의 삶</p>${recHTML}${money}<p class="note">행복·능력치의 흐름과 돈의 흐름은 마지막 '인생 기록'에서 볼 수 있어요.</p></div>`;
  // ⑩ 생각해 보기: 이 삶의 갈림길에 붙인 질문 (고르기 + 한 줄)
  const cq=young?null:(cross.filter(m=>m.a>=10).slice(-2)[0]||cross[0]), notes=L.notes||[];
  const s10=(young?`<p class="big">${esc(nm)}의 ${a}년은 짧았지만, 가족에게는 전부였습니다.</p><p class="soft">태어날 곳도, 가정도 고를 수 없었습니다. 지금 이 화면 앞의 당신이 여기까지 자라 온 시간도, 누군가가 지켜 준 시간이었습니다.</p>`
      :`<p class="big">${esc(nm)}의 ${a}년은 다시 오지 않습니다. 지금 당신의 삶도 단 한 번뿐입니다.</p>`)
    +(cq?`<p class="ask">${cq.a}살, “${esc(endCut(cq.q,60))}” — ${esc(josa(nm,'은','는'))} ‘${esc(cq.l)}’ 쪽을 골랐습니다. 당신이라면?</p><div class="ansrow">${['나도 같은 쪽','나라면 다른 쪽','잘 모르겠다'].map(v=>`<button type="button" class="btn ans" data-ans="cross" data-v="${v}">${v}</button>`).join('')}</div><label class="stack-s" for="rq0">왜 그렇게 생각했나요? (한 줄)<input id="rq0" maxlength="80"></label>`
        :`<label class="stack-s" for="rq0">${esc(josa(nm,'과','와'))} 나의 가장 큰 차이는 무엇이었나요? (한 줄)<input id="rq0" maxlength="80"></label>`)
    +`<label class="stack-s" for="rq1">오늘 고맙다고 말하고 싶은 사람은 누구인가요? 무엇이 고마운가요? (한 줄)<input id="rq1" maxlength="80"></label>`
    +(notes.length?`<p class="soft">삶의 중간에 당신이 남긴 말</p><ul class="notes">${notes.map(n=>`<li><small>${n.a}살 · ${esc(n.q)}</small>${esc(n.t)}</li>`).join('')}</ul>`:'');
  // ⑪ 내가 쓰는 한 문장 · 제목 (자동 문장은 예시로만)
  const oneLine=(()=>{ const vs=voices, whoS=vs.length?vs[0][0]:'오랜 이웃', given=L.given||nm, jb=lj&&lj.y>=3?lj.j:null, tw=String(L.town||C.city).split(' ').slice(-2).join(' ');
    const SAY={K:'곁의 사람을 먼저 챙기던 사람',D:'맡은 일을 끝까지 해내던 사람',B:'망설일 때 먼저 한 걸음 내딛던 사람',C:'궁금한 것을 그냥 넘기지 않던 사람',G:'작은 일에도 고맙다고 말하던 사람'};
    const pre=jb&&!young?`${tw}에서 ${lj.y}년 동안 ${jb.n}${josa(jb.n,'으로','로').slice(jb.n.length)} 일한 `:`${tw}에서 ${a}년을 산 `, tail=young?'짧았지만 누구보다 많이 사랑받은 아이':(SAY[top]||'곁의 사람을 먼저 챙기던 사람');
    return {who:whoS,t:`${pre}${josa(given,'은','는')}, ${tail}${josa(tail,'이었어요','였어요').slice(tail.length)}.`}; })();
  const inRoom=!G.teacher&&G.data&&G.data.room;
  const s11=`<p class="big">이 삶을 한 문장으로 남겨 주세요.</p><p class="soft">다른 사람은 이렇게 기억할지도 몰라요 — “${esc(oneLine.t)}” (${esc(oneLine.who)})</p>
    <label class="stack-s" for="lsum">이 삶을 한 문장으로<input id="lsum" maxlength="40" placeholder="예: 바다를 사랑해 끝까지 바다 곁에 산 사람"></label>
    <label class="stack-s" for="ltitle">이 삶의 제목<input id="ltitle" maxlength="30" placeholder="예: 바다를 사랑한 어부의 일흔두 해"></label>
    <label class="stack-s" for="epi">${esc(nm)}에게 남기는 한마디 (하고 싶으면)<input id="epi" maxlength="40" placeholder="예: 다음에는 더 자주 연락할게"></label>${inRoom?`<label class="row small sharebox" for="shareOK"><input type="checkbox" id="shareOK"> 이 삶(제목 · 한 문장 · 한마디 · 답)을 우리 반 친구들에게 보여 줘도 좋아요</label><p class="small">적은 답은 선생님이 읽습니다. 친구들에게는 위에 체크한 경우에만, 내 아이디 없이 게임 속 이름으로 보입니다.</p>`:''}`;
  // ⑫ 인생 기록 · 마치기
  const longC=(L.comps||[]).slice().sort((x,y)=>y.ls-x.ls)[0];
  const browse=inRoom?`<div class="again"><p class="soft">${a<20?'이 삶은 일찍 끝났습니다. ':''}남은 시간에는 같은 1초에 태어난 사람들과 우리 반 친구들의 삶을 둘러보세요.</p><div class="row"><button class="btn primary" id="btnBrowseE">다른 삶 둘러보기</button></div><p class="small">누르면 이 삶의 기록과 적은 답이 먼저 저장됩니다.</p></div>`:'';
  const s12=`<p class="soft">인생 기록</p><div id="recBox"></div><div class="row"><button class="btn primary" id="btnDone">${G.teacher?'마치기':'남기고 돌아가기'}</button><button class="btn" id="btnSave">카드 저장</button></div>${browse}<p class="help">이 활동을 하며 마음이 무거워졌다면 혼자 담아 두지 마세요. 담임 선생님이나 Wee클래스 상담 선생님, 청소년상담 1388(전화·문자·카카오톡)에서 이야기를 들어 줍니다.</p>`;
  // 슬라이드: 작별 → 돌아보기 → 견주어 보기 → 나에게로
  const SL=(k,b,t)=>({k,b,t:t||''}), slides=[SL('마지막 순간',s1)];
  if(voices.length) slides.push(SL('남겨진 사람들의 말',s2));
  if(!young){ slides.push(SL('삶의 길',s3)); slides.push(SL('주어진 것 · 고른 것 · 우연',s4)); }
  slides.push(SL('나의 기억 고르기',pickSlideHTML(L,PKC,scKind))); slides.push(SL('마지막으로 스쳐 간 장면',sceneSlide));
  if(!young) slides.push(SL('떠나보낸 것과 남긴 것',s7));
  slides.push(SL('같은 1초에 태어난 사람들',s8)); if(!young) slides.push(SL('숫자로 본 이 삶',s9));
  slides.push(SL('생각해 보기',s10)); slides.push(SL('나의 한 문장',s11)); slides.push(SL('인생 기록',s12));
  const ANS={};
  const ansOf=()=>{ const v=id=>String(($(id)?$(id).value:keep[id])||'').trim().slice(0,100), out=[];
    if(ANS.big) out.push(`이 삶을 가장 크게 바꾼 것: ${ANS.big}`);
    if(cq){ if(ANS.cross||v('rq0')) out.push(`${cq.a}살 갈림길(‘${endCut(cq.l,30)}’) — ${ANS.cross||'답 고르지 않음'}${v('rq0')?' · '+v('rq0'):''}`); } else if(v('rq0')) out.push(`나와의 가장 큰 차이: ${v('rq0')}`);
    if(v('rq1')) out.push(`고마운 사람: ${v('rq1')}`); return out; };
  // 그림이 움직이는 장면
  let sceneRAF=0; const animEnd=()=>{ cancelAnimationFrame(sceneRAF); const cs=[...$('endIn').querySelectorAll('canvas.escene')]; if(!cs.length) return; const t0=performance.now();
    const step=()=>{ let alive=false; cs.forEach(c=>{ if(!c.isConnected) return; alive=true; const x=c.getContext('2d'); x.setTransform(c.width/160,0,0,c.width/160,0,0); x.imageSmoothingEnabled=false; x.clearRect(0,0,160,80); try{ drawScene(x,c.dataset.sc,(performance.now()-t0)/1000,L); }catch(e){} }); if(alive) sceneRAF=requestAnimationFrame(step); }; step(); };
  let i=0; const keep={}; show('end');
  const go=d=>{ const j=i+d; if(j<0||j>=slides.length) return; $('endIn').querySelectorAll('input,textarea').forEach(e=>keep[e.id]=e.type==='checkbox'?e.checked:e.value); i=j; render(); };
  const render=()=>{ const sl=slides[i], body=typeof sl.b==='function'?sl.b():sl.b;
    $('endIn').innerHTML=`<div class="slideshow"><div class="sprog" aria-hidden="true"><i style="width:${((i+1)/slides.length*100).toFixed(1)}%"></i></div><div class="shead"><span class="kick">${esc(sl.k)}${sl.t?` · ${sl.t}`:''}</span><span class="snum">${i+1} / ${slides.length}</span></div><div class="step slide">${body}</div><div class="snav">${i>0?'<button class="btn" id="btnPrev">← 이전</button>':'<span></span>'}${i<slides.length-1?'<button class="btn primary" id="btnStep">다음 →</button>':''}</div></div>`;
    $('s-end').scrollTo(0,0); endWide();
    $('endIn').querySelectorAll('input,textarea').forEach(e=>{ if(keep[e.id]!=null){ if(e.type==='checkbox') e.checked=!!keep[e.id]; else e.value=keep[e.id]; } });
    $('endIn').querySelectorAll('[data-ans]').forEach(b=>{ b.classList.toggle('on',ANS[b.dataset.ans]===b.dataset.v); b.onclick=()=>{ ANS[b.dataset.ans]=b.dataset.v; $('endIn').querySelectorAll(`[data-ans="${b.dataset.ans}"]`).forEach(x=>x.classList.toggle('on',x===b)); }; });
    animEnd(); if($('pkBox')) pickWire($('pkBox'),PK);
    if($('btnPrev')) $('btnPrev').onclick=()=>go(-1);
    if(i<slides.length-1) $('btnStep').onclick=()=>go(1);
    else{ const val=id=>String(($(id)?$(id).value:keep[id])||'').trim(), PO=pickOut(PK,PKC,scKind,val('lsum')), opts=()=>({title:val('ltitle').slice(0,30),epi:val('epi').slice(0,40),sum:PO.sum}), cardM=PO.mems.length?PO.mems:three;
      const nts=notes.map(n=>[n.a,String(n.t).slice(0,120)]), recOf=()=>lifeRecord(L,{...opts(),top,kids:kidN.length,ans:ansOf(),notes:nts,top3:PO.top3,fav:PO.fav});
      $('recBox').innerHTML=lifeTabs(Object.assign(recOf(),{name:L.name}),{card:'<canvas id="card" width="720" height="1180"></canvas>'});
      drawCard(cardM,opts()).catch(()=>{});
      $('btnSave').onclick=async()=>{ try{ await drawCard(cardM,opts()); }catch(e){} $('card').toBlob(b=>{ const l=document.createElement('a'); l.href=URL.createObjectURL(b); l.download='인생기록_'+L.name+'.png'; document.body.appendChild(l); l.click(); l.remove(); }); };
      if($('btnBrowseE')) $('btnBrowseE').onclick=()=>{ G.afterEnd=()=>openBrowse(); $('btnDone').click(); };
      $('btnDone').onclick=()=>{ G.endNav=null; if(G.dev){ G.dev=false; G.teacher=false; G.life=null; if(Store.sess&&G.data) openHub(); else show('login'); openDev(); return; }   // 개발자 모드: 저장하지 않고 개발자 메뉴로
        const {title,epi}=opts(), ans=ansOf(), rec=recOf(), early=a<20&&!G.afterEnd;
        if(G.teacher){ const d=TStore.data||(TStore.data=TStore.fresh(null)); if(G.tid){ delete d.saves[G.tid]; TStore.dirty.add(G.tid); }
          d.lives=d.lives.concat(rec).slice(-60); TStore.save(true,'lives');
          G.teacher=false; G.life=null; G.tid=null; if(G.afterEnd){ const f=G.afterEnd; G.afterEnd=null; G.teacher=true; G.tid=tNewId(); f(); return; }
          if(early){ endOffer(longC,true); return; } openTeacherBody(); return; }
        const tNow=Date.now(), share=!!(keep.shareOK||($('shareOK')&&$('shareOK').checked)), comps=(L.comps||[]).map(p=>({n:p.n,cn:p.cn,sex:p.sex,ls:p.ls,cause:p.cause,fam:p.fam,town:p.town,set:p.set,jobs:(p.jobs||[]).map(j=>j[1]).slice(-2),kids:(p.kb||[]).length,mar:p.marA?1:0}));
        G.data.lives=(G.data.lives||[]).concat(Object.assign(rec,{comps,room:G.data.room||null,t:tNow})).slice(-20); G.data.save=null; G.life=null;
        if(G.data.room){ (G.data.roomDone||(G.data.roomDone={}))[G.data.room]=tNow; } Store.save(G.data,true);
        if(G.data.room&&Store.sess){ const r2={name:L.name,age:a,n:L.n,c:L.c,cause:cz.n,title,epi,ans,sum:PO.sum||'',share:share?1:0,t:tNow}; Store.memberPatch(G.data.room,Object.assign({id:Store.sess.id,name:L.name,age:a,n:L.n,dead:1,c:L.c,t:tNow,title:null,epi:null,ans:null,cause:null},{['past/'+tNow]:r2})); }
        if(G.afterEnd){ const f=G.afterEnd; G.afterEnd=null; f(); } else if(early&&!G.data.room){ endOffer(longC,false); } else openHub(); }; } };
  G.endNav=go;
  const ei=$('endIn'); let tx0=null, ty0=0; ei.ontouchstart=e=>{ const t=e.touches[0]; tx0=t.clientX; ty0=t.clientY; };
  ei.ontouchend=e=>{ if(tx0==null) return; const t=e.changedTouches[0], dx=t.clientX-tx0, dy=t.clientY-ty0; tx0=null; if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&!/INPUT|TEXTAREA|CANVAS|svg|path|text/i.test(e.target.tagName)) go(dx<0?1:-1); };
  if(!G.teacher){ G.data.save=null; } else tPersist(true);
  render();
}
// 일찍 끝난 삶: 기록을 남긴 뒤에 다른 삶을 제안한다 (확률은 그대로, 끝난 뒤의 길만 더한다)
function endOffer(longC,teacher){ show('end'); G.endNav=null;
  $('endIn').innerHTML=`<div class="slideshow"><div class="step slide"><p class="big">기록을 남겼습니다.</p><p class="soft">이 삶은 일찍 끝났습니다. 원하면 다른 삶을 살아 볼 수 있어요.</p><div class="again"><div class="row">${longC&&longC.c?`<button class="btn primary" id="btnAgainC">${esc(longC.cn)}에서 태어나 보기<small>같은 1초에 태어난 ${esc(longC.n)}${josa(longC.n,'은','는').slice(longC.n.length)} ${longC.ls}세까지 살았어요</small></button>`:''}<button class="btn" id="btnAgain">무작위로 다시 태어나기</button></div></div><div class="row"><button class="btn" id="btnBack">${teacher?'교사용 화면으로':'처음 화면으로'}</button></div></div></div>`;
  const re=o=>{ if(teacher){ G.teacher=true; G.tid=tNewId(); } birth(o); };
  if($('btnAgainC')) $('btnAgainC').onclick=()=>re({c:longC.c,set:longC.set,sex:longC.sex});
  $('btnAgain').onclick=()=>re(); $('btnBack').onclick=()=>teacher?openTeacherBody():openHub(); }
document.addEventListener('keydown',e=>{ if(!G.endNav||$('s-end').hidden||/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')) return; if(e.key==='ArrowRight') G.endNav(1); else if(e.key==='ArrowLeft') G.endNav(-1); });
// 마지막 기록: 무엇으로, 같은 해 태어난 사람들 가운데 얼마나, 누가 배웅했는지, 같은 1초에 태어난 사람들은
function deathRecord(L){ const C=L.C, a=L.lifespan, cz=causeOf(L), sv=survTo(C,a+1), longer=Math.round((1-sv)*100), P=L.ppl||{}, fm=L.fam;
  const hp=(L.hist||[]).filter(x=>x.a>=1).reduce((b,x)=>x.j>(b?b.j:-1)?x:b,null);
  const see=[]; if(P.spouse&&!L.f.widow) see.push((L.sex?'남편 ':'아내 ')+P.spouse.n); (L.kids||[]).slice(0,4).forEach(k=>see.push((k.sex?'딸 ':'아들 ')+k.n)); if(fm) fm.sibs.filter(x=>x.born&&x.al).slice(0,3).forEach(x=>see.push(sibTerm(L,x)+' '+x.n)); if(a<19&&fm){ if(fm.mom.al) see.push('엄마'); if(fm.dad.al&&L.f.div!=='dad') see.push('아빠'); } if(!see.length&&P.friend) see.push('친구 '+P.friend.n);
  const rows=[['사인',esc(cz.n)],['향년',`${a}세 · ${C.n} 기대수명 약 ${C.le}세`],['같은 해 태어난 사람들 가운데',`약 ${longer}%보다 오래 살았습니다`],['마지막 길을 배웅한 사람',see.length?see.map(esc).join(', '):'이웃들'],['가장 행복했던 해',hp?`${(L.by||2026)+hp.a}년 · ${hp.a}살`:'—']];
  const comps=L.comps&&L.comps.length?`<p class="soft" style="margin-top:14px">같은 1초에 태어난 사람들</p><dl class="whoami">${L.comps.map(p=>`<dt>${esc(p.n)}</dt><dd>${esc(p.cn)} · ${p.sex?'여':'남'} · ${p.ls}세까지 (${esc(p.cause)})</dd>`).join('')}</dl><p class="note">같은 순간에 태어나도 어디서 태어났는지에 따라 삶의 길이와 모양이 달랐습니다.</p>`:'';
  return `<p class="soft">사망 기록</p><dl class="whoami">${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl><p class="note">${esc(cz.nt)}</p>${comps}`; }
// 이 사람의 이야기: 이름 · 가족 · 학교 · 일 · 함께한 사람들
function lifeStory(L){ const P=L.ppl||{}, sc=L.sch||{}, f=L.f, by=L.by||2026, rows=[];
  rows.push(['이름',`${esc(L.name)} (${by}~${by+L.lifespan})`]);
  rows.push(['태어난 곳',`${L.C.n} · ${esc(L.town||'')} · ${FAM[L.famI].n}`]);
  const fm=L.fam;
  if(fm){ rows.push(['부모님',`아빠 ${esc(fm.dad.n)} (${esc(fm.dad.job)}${fm.dad.al?'':`, 내가 ${fm.dad.dA}살 때 떠나심`}) · 엄마 ${esc(fm.mom.n)} (${esc(fm.mom.job)}${fm.mom.al?'':`, 내가 ${fm.mom.dA}살 때 떠나심`})${L.f.div?' · 부모님은 따로 사셨습니다':''}`]);
    const sb=fm.sibs.filter(x=>x.born); rows.push(['형제자매',sb.length?sb.sort((x,y)=>x.d-y.d).map(x=>`${sibTerm(L,x)} ${esc(x.n)}${x.al?(x.away===2?' (외국에서 일함)':x.mar?' (결혼)':''):` (${x.dA}살 때 먼저 떠남)`}`).join('<br>'):'외동으로 자랐습니다']);
    if(fm.rel&&fm.rel!=='종교 없음') rows.push(['가족의 종교',esc(fm.rel)]); }
  else { rows.push(['부모님',`아빠 ${esc(P.dad?P.dad.n:'')} · 엄마 ${esc(P.mom?P.mom.n:'')}`]); if(P.sib||P.gran) rows.push(['함께 자란 가족',[P.gran?`할머니 ${esc(P.gran.n)}`:'',P.sib?`동생 ${esc(P.sib.n)}`:''].filter(Boolean).join(' · ')]); }
  const schs=[f.elem&&sc.elem,f.sec&&sc.mid,f.hs&&(f.hs==='voc'?sc.voc:sc.high),f.univ&&sc.univ].filter(Boolean);
  rows.push(['다닌 학교',schs.length?schs.map(esc).join(' → '):'학교에 다니지 못했습니다']);
  if(f.elem&&P.teacher) rows.push(['첫 담임',`${esc(P.teacher.n)} 선생님`]);
  if(L.jobs&&L.jobs.length) rows.push(['해 온 일',L.jobs.map((j,i)=>`${esc(j.co||'')} ${esc(j.n)}(${j.a}살~)${i>0&&j.why?`<br><span class="note">└ 계기: ${esc(j.why)}</span>`:''}`).join('<br>')]);
  if(f.rkTop&&f.rkMax) rows.push(['일의 계단',`${f.rkCo?esc(f.rkCo)+'에서 ':''}${esc(f.rkTop)}까지 올랐습니다${f.frmY?` · 공식 일자리에서 ${f.frmY}년`:''}`]); else if(f.frmY) rows.push(['일의 계단',`공식 일자리에서 ${f.frmY}년 일했습니다`]);
  if(f.svcDone&&f.svcN) rows.push(['군 복무',`${(L.by||2026)+(f.svcA||19)}년 무렵 복무를 마쳤습니다`]);
  if(f.migTo&&(L.jobs||[]).some(j=>/다른 나라/.test(j.n))) rows.push(['다른 나라에서 일한 날',`${esc(f.migTo)}에서 일했습니다`]);
  if(f.abrDone) rows.push(['유학',`${esc(f.abrDone)}에서 대학원을 마쳤습니다`]);
  rows.push(['함께한 사람',P.spouse?`${esc(P.spouse.n)} (${L.f.marA||''}살에 결혼${L.f.widow?` · ${L.f.widA}살에 사별`:''})`:'가정을 꾸리지 않았습니다']);
  if(L.kids&&L.kids.length) rows.push(['아이',L.kids.map(k=>`${k.sex?'딸':'아들'} ${esc(k.n)} (${by+k.b}년생)`).join('<br>')]);
  if(P.friend) rows.push(['평생 친구',esc(P.friend.n)]);
  if(L.f.hob&&L.f.hob.length) rows.push(['취미',L.f.hob.map(h=>`${esc(h.n)} (Lv.${h.lv}, ${h.a}살부터)`).join(' · ')]);
  return `<p class="soft">이 사람의 이야기</p><dl class="whoami">${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl><p class="note">대학은 실제 대학 이름이고, 사람·회사·가게 이름은 그 나라에 있을 법한 가상의 이름입니다.</p>`; }
// 돈 이야기
function moneyStep(L){ const C=L.C, h=(L.money||[]), nw=L.nw, yr=C.med*12;
  if(!h.length) return `<p class="soft">돈 이야기</p><p>${esc(L.name)}의 삶에서 돈은 가족이 꾸렸습니다.</p>`;
  const pts=h.map(m=>({a:m.a,v:m.cash+m.house})), mx=Math.max(...pts.map(p=>Math.abs(p.v)),1), W=320, H=120, x=i=>i/(pts.length-1||1)*W, y=v=>H/2-v/mx*(H/2-8);
  const svg=`<svg class="nwsvg" viewBox="0 0 ${W} ${H+18}" role="img" aria-label="나이에 따른 재산의 흐름"><rect x="0" y="0" width="${W}" height="${H}" fill="rgba(255,255,255,.04)"/><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" stroke="#4A5C6B"/><polyline points="${pts.map((p,i)=>x(i).toFixed(1)+','+y(p.v).toFixed(1)).join(' ')}" fill="none" stroke="#FFC9A8" stroke-width="2.5"/><text x="0" y="${H+14}" fill="#AFC0CD" font-size="11">${pts[0].a}살</text><text x="${W}" y="${H+14}" fill="#AFC0CD" font-size="11" text-anchor="end">${pts[pts.length-1].a}살</text><text x="4" y="${H/2-4}" fill="#8FA3B3" font-size="10">0원</text></svg>`;
  const cards=[[fmtWon(L.earned||0),'평생 번 돈 (배우자 포함)'],[fmtWon(L.maxNW||0),'재산이 가장 많았을 때'],[fmtWon(nw),nw<0?'남긴 빚':'남긴 재산 (집 포함)'],[L.house?fmtWon(L.house):(L.f.houseN?'팔았음':'없음'),L.f.houseA?`마지막 집 (${L.f.houseA}살에 마련)`:'내 집']];
  const yrs=nw/yr, msg = nw<0?'빚이 남았지만, 그 돈으로 가족이 함께 살 집과 시간을 얻었습니다.':yrs>=15?`이 나라 보통 벌이로 ${Math.round(yrs)}년을 모아야 하는 만큼을 남겼습니다. 넉넉한 편이었습니다.`:yrs>=4?`이 나라 보통 벌이 ${Math.round(yrs)}년치쯤을 남겼습니다. 큰 부자는 아니었지만, 그때그때 필요한 만큼으로 살았습니다.`:'남긴 재산은 많지 않았습니다. 버는 만큼 가족과 함께 쓰며 살았습니다.';
  return `<p class="soft">돈 이야기</p><div class="msum">${cards.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')}</div>${svg}<p>${msg}</p><p class="note">${C.n}의 보통 한 해 벌이는 약 ${fmtWon(yr)}입니다. 모든 돈은 그 나라 돈을 한국 돈으로 바꾼 근사치이고, 집을 살 때 빌린 돈은 '가진 돈'에서 마이너스로 셉니다.</p>`; }
// 행복은 어디서 왔을까: 한 삶 동안 행복을 받쳐 준 것들의 평균
function happyStep(L){
  const hp=L.hp||{}, n=Math.max(1,hp.cnt||1), nm={m:'살림(돈)',n:'나라의 형편',r:'곁의 사람들',c:'함께 웃는 문화',h:'건강'}, avg={}; for(const k in nm) avg[k]=(hp[k]||0)/n;
  const aj=L.hist.length?Math.round(L.hist.reduce((s,x)=>s+x.j,0)/L.hist.length):Math.round(L.s.j), ks=Object.keys(nm).sort((a,b)=>avg[b]-avg[a]), best=ks[0], mx=Math.max(...Object.values(avg).map(Math.abs),1);
  const fmt=v=>{ const r=Math.round(v); return (r>0?'+':'')+(r===0?0:r); };
  const bars=Object.keys(nm).map(k=>`<div class="tbar hp"><span>${nm[k]}</span><i style="width:${Math.max(2,Math.abs(avg[k])/mx*100)}%;background:${avg[k]>=0?'#8FD3B0':'#E8A0A0'}"></i><span class="num">${fmt(avg[k])}</span></div>`).join('');
  const poor=L.C.tier<=2, moneyLow=avg.m<0, msg = best==='m'||best==='n' ? '이 삶에서는 넉넉한 살림이 행복을 크게 받쳐 주었습니다. 그래도 곁의 사람들이 없었다면 그 행복은 훨씬 작았을 거예요.'
    : moneyLow ? '살림은 넉넉하지 않았습니다. 그래도 '+josa(nm[best],'이','가')+' 행복을 더 크게 받쳐 주었습니다. 가진 것이 적어도 행복할 수 있었습니다.'
    : josa(nm[best],'이','가')+' 이 삶의 행복을 가장 크게 받쳐 주었습니다.';
  const job=L.jobs&&L.jobs.length?`<p class="soft">거쳐 온 일: ${L.jobs.map(x=>esc(x.n)).join(' → ')}${L.maxInc?` · 가장 많이 벌 때 한 달 약 ${fmtPay(L.maxInc)} (이 나라 보통 벌이 약 ${fmtPay(L.C.med)})`:''}</p>`:'';
  return `<p class="soft">행복은 어디서 왔을까</p><p class="big">${esc(L.name)}의 평균 행복은 ${aj}점이었습니다.</p>${bars}<p>${msg}</p>${job}
    <blockquote>세계행복보고서 2026에서 코스타리카는 4위, 멕시코는 12위, 한국은 67위였습니다. 두 나라 모두 한국보다 1인당 소득이 적지만 스스로 행복하다고 답한 정도는 훨씬 높았습니다. 행복은 돈만이 아니라 서로 기댈 수 있는 사람, 스스로 삶을 정할 수 있는 자유, 나누는 마음 같은 것들이 함께 만듭니다.<cite>세계행복보고서(World Happiness Report) 2026</cite></blockquote>
    <p>${poor?'넉넉하지 않은 곳에서도':'어디에서 태어나든'} 지금 가진 것에 감사하고 곁의 사람을 아끼며 사는 삶은, 충분히 행복할 수 있습니다.</p>`;
}
async function drawCard(mems,o){
  const L=G.life, c=$('card'), x=c.getContext('2d'), Wd=c.width, H=c.height, F=FONT, by=L.by||2026;
  const T=(s,px,py,size,color,weight,align)=>{ x.font=`${weight||400} ${size}px ${F}`; x.fillStyle=color; x.textAlign=align||'left'; x.textBaseline='alphabetic'; x.fillText(s,px,py); };
  x.fillStyle='#fff'; x.fillRect(0,0,Wd,H); x.fillStyle='#1E2B37'; x.fillRect(0,0,Wd,210);
  T(o&&o.title?`「${o.title}」`:'인생 기록',48,60,24,'#FFC9A8',700); T('80억 분의 1',Wd-48,60,22,'#C5D2DC',500,'right');
  x.font=`800 52px ${F}`; const nmW=x.measureText(L.name).width; T(L.name,48,126,Math.min(52,52*560/Math.max(nmW,1)),'#fff',800); T(`${by}~${by+L.lifespan} · ${L.C.n} ${L.town||''} · ${FAM[L.famI].n}`,48,172,22,'#C5D2DC',500);
  T(L.lifespan+'년',48,276,64,'#B4501E',800); T(`의 삶 · 선택 ${L.n}번`,48+x.measureText(L.lifespan+'년').width+70,276,24,'#5A6A78',500);
  const lastJ=(L.jobs||[]).slice(-1)[0]; let ly=312; if(lastJ){ T(`${lastJ.co?lastJ.co+' · ':''}${lastJ.n} · 남긴 재산 ${fmtWon(L.nw)}`,48,ly,20,'#5A6A78',500); ly+=30; }
  if(L.ppl&&L.ppl.spouse) T(`함께한 사람 ${L.ppl.spouse.n}${L.kids.length?' · 아이 '+L.kids.map(k=>k.given).join(', '):''}`,48,ly,20,'#5A6A78',500);
  // 사진 세 장
  // 어릴 때 · 한창때 · 나이 들어서 한 장씩 (돈·아픔 같은 기억보다는 장면이 있는 기억을 먼저)
  const pool0=(mems||[]).filter(m=>m&&m.a>0), nice=pool0.filter(m=>!/^(money|sick|hosp|jobloss|farewell)$/.test(photoKind(m))), pool=nice.length>=3?nice:pool0;
  const ps=pool.length<=3?pool:[pool[0],pool[Math.floor(pool.length/2)],pool[pool.length-1]], pw=196, ph=147, gap=(Wd-96-pw*3)/2;
  const pcs=await Promise.all(ps.map(async(m,i)=>{ const pc=document.createElement('canvas'); try{ await drawMemPhoto(pc,m,L,L.mem.indexOf(m)); }catch(e){ try{ drawPhoto(pc,m,L,i); }catch(e2){} } return pc; }));
  ps.forEach((m,i)=>{ const pc=pcs[i]; const px=48+i*(pw+gap), py=380+(i%2)*10;
    x.save(); x.translate(px+pw/2,py+ph/2); x.rotate((i-1)*.03); x.fillStyle='rgba(0,0,0,.18)'; x.fillRect(-pw/2-6,-ph/2-4,pw+16,ph+40); x.fillStyle='#F6F2EA'; x.fillRect(-pw/2-8,-ph/2-8,pw+16,ph+40); x.drawImage(pc,-pw/2,-ph/2,pw,ph);
    x.font='26px "Nanum Pen Script",cursive'; x.fillStyle='#3A3530'; x.textAlign='center'; x.fillText(`${by+m.a}년 · ${m.a}살`,0,ph/2+24); x.restore(); });
  const gx=64,gy=640,gw=Wd-112,gh=180,n=L.hist.length,xm=Math.max(1,n-1),col={h:'#2F8F7A',j:'#C98A12',k:'#3F7FBF',r:'#C2577A'},nm={h:'건강',j:'행복',k:'지식',r:'관계'};
  x.strokeStyle='#D3DEE6'; x.lineWidth=1; [0,50,100].forEach(v=>{ const y=gy+gh-gh*v/100; x.beginPath(); x.moveTo(gx,y); x.lineTo(gx+gw,y); x.stroke(); T(String(v),gx-10,y+6,16,'#5A6A78',500,'right'); });
  for(const k in col){ x.strokeStyle=col[k]; x.lineWidth=3.5; x.lineJoin='round'; x.beginPath(); L.hist.forEach((h,i)=>{ const px=gx+gw*i/xm, py=gy+gh-gh*h[k]/100; i?x.lineTo(px,py):x.moveTo(px,py); }); x.stroke(); }
  T('0살',gx,gy+gh+26,16,'#5A6A78',500); T(L.lifespan+'살',gx+gw,gy+gh+26,16,'#5A6A78',500,'right');
  let lx=gx; for(const k in col){ x.fillStyle=col[k]; x.fillRect(lx,gy+gh+48,22,6); T(nm[k],lx+30,gy+gh+58,18,'#1E2B37',600); lx+=30+x.measureText(nm[k]).width+26; }
  T('기억에 남은 일',48,gy+gh+110,22,'#1E2B37',700); let y=gy+gh+148; const all=L.mem.filter(m=>m.big&&m.a>0), big=[]; for(let i=0;i<8&&all.length;i++){ const m=all[Math.floor(i*all.length/Math.min(8,all.length))]; if(m&&!big.includes(m)) big.push(m); }
  for(const e of big){ T(e.a+'살',48,y,19,'#B4501E',700); x.font=`500 19px ${F}`; let line='', lines=[]; for(const ch of e.t){ if(x.measureText(line+ch).width>Wd-175){ lines.push(line); line=ch; } else line+=ch; } lines.push(line); lines.slice(0,2).forEach((s,i)=>T(s,122,y+i*25,19,'#1E2B37',500)); y+=Math.min(2,lines.length)*25+11; if(y>H-(o&&o.epi?80:30)) break; }
  if(o&&o.epi){ x.fillStyle='#F4F1EA'; x.fillRect(0,H-64,Wd,64); T(`“${o.epi}”`,Wd/2,H-24,22,'#B4501E',600,'center'); }
}

