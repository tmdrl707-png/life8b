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
  const ref=(...names)=>{ const ns=names.filter(Boolean).map(String).filter(n=>n.length>=2); if(!ns.length) return null; const ms=L.mem.filter(m=>m.a>0&&ns.some(n=>String(m.t).includes(n)||String(m.q||'').includes(n))); return ms.length?ms.reduce((b,m)=>memScore(m)>memScore(b)?m:b,ms[0]):null; };
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
  const lastCo=(L.jobs||[]).filter(j=>j.co).slice(-1)[0];
  if(L.s.k>=60&&lastCo) out.push([`${lastCo.co}에서 함께 일한 후배`,pk(['모르는 걸 물으면 한 번도 귀찮아하지 않으셨어요.','힘든 날 먼저 남아서 도와주시던 분이었어요.'],'co'),ref(lastCo.co)]);
  else out.push([`${L.town||'동네'}의 이웃`,pk(['길에서 마주치면 늘 먼저 인사해 주던 분이었어요.','우리 동네에 그런 사람이 있어서 고마웠어요.','어려울 때 말없이 문 앞에 먹을 것을 두고 가시던 분이에요.'],'nb'),null]);
  return out.slice(0,4); }
function finishLife(){
  const L=G.life, a=L.lifespan, top=L.topTrait(), P=L.ppl||{}, sp=P.spouse, kids=L.kids||[], by=L.by||2026, C=L.C, K=COUNTRIES.KR, W=worldAvg(), fm=L.fam, young=a<15, nm=L.name;
  const kidN=kids.map(k=>k.n), cz=causeOf(L);
  const list=arr=>{ if(arr.length<=1) return arr.join(''); const h=arr.slice(0,-1); h[h.length-1]=josa(h[h.length-1],'과','와'); return h.join(', ')+' '+arr[arr.length-1]; };
  // 1막 · 마지막 순간
  const withN=[sp&&!L.f.widow&&sp.n].concat(kidN.slice(0,3)).filter(Boolean);
  const momN=fm?fm.mom.n:(P.mom?P.mom.n:''), dadOK=fm?fm.dad.al&&L.f.div!=='dad':!!P.dad, dadN=fm?fm.dad.n:(P.dad?P.dad.n:'');
  const who = young ? (dadOK?`엄마 ${josa(momN,'과','와')} 아빠 ${josa(dadN,'이','가')} 곁을 지키고 있었습니다.`:`엄마 ${josa(momN,'이','가')} 곁을 지키고 있었습니다.`)
    : withN.length?`${josa(list(withN),'이','가')} 곁을 지키고 있었습니다.`:(L.s.r>=55?`오랜 친구 ${P.friend?josa(P.friend.n,'이','가'):'친구들이'} 곁을 지키고 있었습니다.`:'창밖으로는 늘 걷던 길이 보였습니다.');
  const how = L.cause==='epi'?`${josa(cz.n,'이','가')} 번진 해, 갑작스러운 이별이었습니다.`:L.cause==='sudden'?'예고 없이 찾아온, 갑작스러운 이별이었습니다.':young?'한동안 앓던 끝이었습니다.':'오래 앓던 끝에, 마지막 시간은 집에서 가족과 함께 보냈습니다.';
  const s1=`<p class="soft">${by+a}년 · ${a}살 · ${seasonOf(L)} · ${esc(C.n)} ${esc(L.town||'')}</p><p class="big">${esc(nm)}<span class="nw">(${by}~${by+a})${josa(nm,'은','는').slice(nm.length)}</span> ${young?'짧은 삶을 마쳤습니다.':'조용히 눈을 감았습니다.'}</p><p>${esc(who)} ${how}</p><p class="soft">${young?'짧았지만, 분명히 있었던 삶이었습니다.':`${a}년 동안 ${L.n}번의 선택을 하며 살았습니다.`}</p><figure class="lastart"><img src="art/sc/${scArtName(young&&!softOn()?'farewell':'life',L)}.webp" alt="" onerror="this.parentNode.remove()"></figure>`;
  // 2막 · 세 장면
  const three=pickThree(L), hp=(L.hist||[]).reduce((b,x)=>x.j>(b?b.j:-1)?x:b,null);
  const photosHTML=arr=>`<ul class="photos">${arr.map((m,i)=>`<li style="animation-delay:${i*.6}s"><figure class="pf" style="margin:0"><canvas data-mi="${L.mem.indexOf(m)}" width="320" height="240"></canvas><figcaption>${by+m.a}년 · ${m.a}살</figcaption><small class="cr"></small></figure><div><b>${m.a}살 · ${by+m.a}년</b>${m.q?`<p class="mq">${esc(m.q)}${m.l?`<span class="ml">→ ${esc(m.l)}</span>`:''}</p>`:''}<p>${esc(memT(m))}${m.rp>1?` <small class="rp">(그 뒤로도 ${m.rp-1}번 더)</small>`:''}</p></div></li>`).join('')}</ul><p class="note">사진은 위키백과·위키미디어 공용에 자유 이용으로 공개된 실제 사진입니다(사진 아래에 찍은 사람과 라이선스 표시). 사람이 나오는 장면(결혼·졸업·가족 등)은 이 삶의 모습으로 그린 그림이고, 사진을 불러오지 못하면 그림으로 대신합니다.</p>`;
  const s2=`<p class="soft">눈을 감자, 세 장면이 사진처럼 스쳐 갑니다.</p>${three.length?photosHTML(three):'<p>엄마 품에서 방긋 웃던 날이 있었습니다.</p>'}${hp&&!young?`<p class="soft">가장 행복했던 해는 ${by+hp.a}년, ${hp.a}살 무렵이었습니다.</p>`:''}`;
  // 3막 · 남겨진 사람들의 말
  const voices=voicesOf(L), cut=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
  const s3=`<p class="soft">남겨진 사람들의 말</p>${voices.map(v=>`<blockquote>${esc(v[1])}<cite>${esc(v[0])}</cite>${v[2]?`<span class="mref">함께한 기억 · ${v[2].a}살: ${esc(cut(memT(v[2]),70))}</span>`:''}</blockquote>`).join('')}`;
  // 4막 · 다른 삶들과 나란히 (자세한 기록은 접어 둔다)
  const det=(t,h)=>`<details><summary>${t}</summary><div>${String(h).replace(/^\s*<p class="soft">[^<]*<\/p>/,'')}</div></details>`;
  const traitHTML=`${Object.keys(TRAIT).map(k=>`<div class="tbar"><span>${TRAIT[k]}</span><i style="width:${Math.max(3,L.tr[k]/Math.max(...Object.values(L.tr),1)*100)}%"></i><span class="num">${L.tr[k]}번</span></div>`).join('')}<p>가장 많이 고른 쪽은 '${TRAIT[top]}'이었습니다. 뜻대로 되지 않은 일이 ${L.fail||0}번, 시간이 모자라 놓친 순간이 ${L.miss||0}번 있었습니다.</p>`;
  const s4=`${deathRecord(L)}<p>${esc(C.n)}에서 태어난 아기의 기대수명은 약 ${C.le}세, 대한민국은 약 ${K.le}세, 지금 태어나는 아기 평균은 약 ${Math.round(W.le)}세입니다.${young?` ${esc(C.n)}에서는 아이 1000명 가운데 약 ${C.u5}명이 다섯 살이 되기 전에 삶을 마칩니다. 대한민국은 약 ${K.u5}명입니다.`:''}</p><p class="big">어디에서 태어났는가가, 얼마나 그리고 어떻게 사는가를 바꾸기도 합니다.</p>
    <p class="soft">더 자세히 보기</p>${det('이 사람의 이야기',lifeStory(L))}${young?'':det('돈 이야기',moneyStep(L))}${det(`${esc(nm)}의 선택 ${L.n}번`,traitHTML)}${young?'':det('행복은 어디서 왔을까',happyStep(L))}`;
  // 5막 · 나에게로
  const ppl=[]; if(sp) ppl.push(`${L.sex?'남편':'아내'} ${sp.n}`); kids.slice(0,3).forEach(k=>ppl.push(`${k.sex?'딸':'아들'} ${k.n}`)); if(P.friend&&!young) ppl.push(`친구 ${P.friend.n}`); if(momN) ppl.push(`엄마 ${momN}`); if(dadOK&&dadN) ppl.push(`아빠 ${dadN}`);
  const notes=L.notes||[];
  const s5=(young?`<p class="big">${esc(nm)}의 ${a}년은 짧았지만, 가족에게는 전부였습니다.</p><p>태어날 곳도, 가정도 고를 수 없었습니다. 같은 1초에 태어났어도 어떤 아이는 어른이 되고, 어떤 아이는 그러지 못합니다.</p><p class="big">지금 이 화면 앞의 당신이 여기까지 자라 온 시간도, 누군가가 지켜 준 시간이었습니다.</p>`
      :`<p class="big">${esc(nm)}의 ${a}년은 다시 오지 않습니다.</p><p>80억 개의 삶 가운데 똑같은 삶은 하나도 없습니다. 태어날 곳과 가정은 고를 수 없었고, 뜻대로 되지 않은 날도 많았습니다.</p>${ppl.length?`<p>그래도 그 삶에는 ${esc(josa(list(ppl),'이','가'))} 있었습니다.</p>`:''}<p class="big">지금 이 화면 앞에 있는 당신의 삶도, 단 한 번뿐입니다.</p><p class="soft">오늘 만나는 사람도, 오늘 하는 작은 선택도 다시 오지 않습니다.</p>`)
    +(notes.length?`<p class="soft">삶의 중간에 당신이 남긴 말</p><ul class="notes">${notes.map(n=>`<li><small>${n.a}살 · ${esc(n.q)}</small>${esc(n.t)}</li>`).join('')}</ul>`:'')
    +`<p class="help">이 활동을 하며 마음이 무거워졌다면 혼자 담아 두지 마세요. 담임 선생님이나 Wee클래스 상담 선생님, 청소년상담 1388(전화·문자·카카오톡)에서 이야기를 들어 줍니다.</p>`;
  const RQ=[`${josa(nm,'과','와')} 나의 가장 큰 차이는 무엇이었나요?`,'이 삶을 살고 나서, 내 삶에서 당연하다고 여기던 것 가운데 다르게 보이는 것이 있나요?','오늘 고맙다고 말하고 싶은 사람은 누구인가요? 무엇이 고마운가요?'];
  const s6=`<p class="soft">이제 당신에게로</p>${RQ.map((q,i)=>`<label class="stack-s" for="rq${i}">${esc(q)}<textarea id="rq${i}" maxlength="100" rows="2"></textarea></label>`).join('')}
    <label class="stack-s" for="ltitle">이 삶의 제목<input id="ltitle" maxlength="30" placeholder="예: 바다를 사랑한 어부의 일흔두 해"></label><label class="stack-s" for="epi">${esc(nm)}에게 남기는 한마디<input id="epi" maxlength="40" placeholder="예: 다음에는 더 자주 연락할게"></label>${!G.teacher&&G.data&&G.data.room?`<label class="row small sharebox" for="shareOK"><input type="checkbox" id="shareOK"> 이 삶(제목 · 한마디 · 답)을 우리 반 친구들에게 보여 줘도 좋아요</label><p class="small">적은 답은 선생님이 읽습니다. 친구들에게는 위에 체크한 경우에만, 내 아이디 없이 게임 속 이름으로 보입니다.</p>`:''}`;
  const s6b=`<p class="soft">인생 기록</p><div id="recBox"></div><div class="row"><button class="btn primary" id="btnDone">${G.teacher?'마치기':'남기고 돌아가기'}</button><button class="btn" id="btnSave">카드 저장</button></div>`;
  // ----- 슬라이드쇼: 정보를 한 장씩 살펴보며 넘긴다. 사진은 맨 끝의 마무리 장면으로 -----
  const dr=deathRecord(L), dcut=dr.indexOf('<p class="soft" style="margin-top:14px">'), recHTML=dcut>0?dr.slice(0,dcut):dr, compsHTML=dcut>0?dr.slice(dcut).replace('<p class="soft" style="margin-top:14px">','<p class="soft">'):'';
  const strip=h=>String(h).replace(/^\s*<p class="soft">[^<]*<\/p>/,'');
  const SL=(k,b,t)=>({k,b,t:t||''}), slides=[SL('마지막 순간',s1)];
  voices.forEach((v,j)=>slides.push(SL('남겨진 사람들의 말',`<blockquote class="bigq">${esc(v[1])}<cite>${esc(v[0])}</cite>${v[2]?`<span class="mref">함께한 기억 · ${v[2].a}살: ${esc(cut(memT(v[2]),70))}</span>`:''}</blockquote>`,voices.length>1?`${j+1} / ${voices.length}`:'')));
  slides.push(SL('사망 기록',strip(recHTML)));
  if(compsHTML) slides.push(SL('같은 1초에 태어난 사람들',strip(compsHTML)));
  slides.push(SL('어디에서 태어났는가',`<p>${esc(C.n)}에서 태어난 아기의 기대수명은 약 ${C.le}세, 대한민국은 약 ${K.le}세, 지금 태어나는 아기 평균은 약 ${Math.round(W.le)}세입니다.${young?` ${esc(C.n)}에서는 아이 1000명 가운데 약 ${C.u5}명이 다섯 살이 되기 전에 삶을 마칩니다. 대한민국은 약 ${K.u5}명입니다.`:''}</p><p class="big">어디에서 태어났는가가, 얼마나 그리고 어떻게 사는가를 바꾸기도 합니다.</p>`));
  slides.push(SL('이 사람의 이야기',strip(lifeStory(L))));
  if(!young) slides.push(SL('돈 이야기',strip(moneyStep(L))));
  slides.push(SL(`${nm}의 선택 ${L.n}번`,traitHTML));
  if(!young) slides.push(SL('행복은 어디서 왔을까',strip(happyStep(L))));
  slides.push(SL('삶의 모양',shapeHTML(L)));
  // 스쳐 간 장면: 사진 대신 이 삶의 모습으로 움직이는 그림 (할아버지와의 이별 장면 같은 그림)
  const scKind=m=>{ const k=m.sc||(typeof sceneKindOf==='function'?sceneKindOf(memT(m)+' '+(m.q||'')):'life'); if(softOn()&&/^(farewell|sick|hosp|unrest)$/.test(k)) return 'life'; const k2=SCENE_TITLE[k]?k:'life'; return typeof scVar==='function'?scVar(k2,memT(m)+' '+(m.q||''),m.a,L):k2; };
  const card=(m,j)=>`<article class="ncard anim"><div class="nimg"><canvas class="escene" data-sc="${scKind(m)}" width="640" height="320"></canvas><span class="nage">${m.a}살 · ${by+m.a}년</span>${three.length>1?`<span class="nno">${j+1} / ${three.length}</span>`:''}</div><div class="nbody">${m.q?`<p class="mq">${esc(m.q)}${m.l?`<span class="ml">→ ${esc(m.l)}</span>`:''}</p>`:''}<p>${esc(memT(m))}${m.rp>1?` <small class="rp">(그 뒤로도 ${m.rp-1}번 더)</small>`:''}</p></div></article>`;
  three.forEach((m,j)=>slides.push(SL('마지막으로 스쳐 간 장면',(j===0?`<p class="soft">눈을 감기 전, ${three.length>1?three.length+'개의 장면이':'한 장면이'} 스쳐 갑니다.</p>`:'')+card(m,j)+(j===three.length-1&&hp&&!young?`<p class="soft">가장 행복했던 해는 ${by+hp.a}년, ${hp.a}살 무렵이었습니다.</p>`:''))));
  if(!three.length) slides.push(SL('마지막으로 스쳐 간 장면','<p class="big">엄마 품에서 방긋 웃던 날이 있었습니다.</p>'));
  // 오각형이 가장 넓었던 때: 그 무렵의 실제 모습(사진)
  const pk=typeof peakOf==='function'?peakOf(L):null, pkA=pk?pk.a:null, pkJ=pkA==null?null:(L.jobs||[]).filter(x=>x.a<=pkA).slice(-1)[0], pkM=pkA==null?null:(pkJ&&pkA>=19?{a:pkA,t:`${pkJ.n}${josa(pkJ.n,'으로','로').slice(pkJ.n.length)} 출근하던 나날. ${L.town||L.C.city}의 일터에서 하루를 보냈다.`,sc:'job'}:{a:pkA,t:`${L.town||L.C.city}에서 보낸 나날.`,sc:'town'});
  if(pkM&&!young){ const jb=(L.jobs||[]).filter(x=>x.a<=pkA).slice(-1)[0], kidsN=(L.kids||[]).filter(k=>k.a!=null?k.a<=pkA:true).length, P=L.ppl||{};
    const life=[`${pkA}살 무렵, ${esc(L.town||L.C.city)}에서`, jb?`${esc(jb.n)}${josa(jb.n,'으로','로').slice(jb.n.length)} 일하며`:'', L.f.family||L.f.widow?(kidsN?`가족과 아이 ${kidsN}명 곁에서`:'가족 곁에서'):''].filter(Boolean).join(' ');
    slides.push(SL('가장 넓었던 때의 모습',`<p class="big">${life} 살았습니다.</p><article class="ncard"><div class="nimg"><canvas data-k="pk" width="480" height="360"></canvas><span class="nage">${pkA}살 · ${by+pkA}년</span></div><div class="nbody"><p>${esc(memT(pkM))}</p><small class="cr"></small></div></article><p class="soft">이때 오각형이 가장 넓었습니다. ${AXES.map(k=>`${AX_N[k]} ${pk[k]}`).join(' · ')}</p><p class="note">사진은 위키백과·위키미디어 공용에 자유 이용으로 공개된 실제 사진입니다(아래에 찍은 사람과 라이선스). 꼭 맞는 사진이 없으면 그림으로 대신합니다.</p>`)); }
  slides.push(SL('나에게로',s5)); slides.push(SL('이제 당신에게로',strip(s6)));
  // 마지막 장 앞: 가장 기억에 남는 순간 3가지 · 대표 장면 · 한 마디 요약을 고른다 (개인 기록에도 남는다)
  const PKC=pickCands(L), PK={sel:[],fav:null}; slides.push(SL('나의 기록 고르기',pickSlideHTML(L,PKC,scKind)));
  // 마지막: 다른 사람의 말을 빌려, 이 삶을 단 한 문장으로
  const oneLine=(()=>{ const v=pk||L.s, top=AXES.slice().sort((a,b)=>(v[b]||0)-(v[a]||0))[0], vs=(typeof voicesOf==='function'?voicesOf(L):[])||[], who=vs.length?vs[0][0]:'오랜 이웃', jb=(L.jobs||[]).slice(-1)[0], given=L.given||L.name;
    const SAY={j:'작은 일에도 먼저 웃을 줄 알던 사람',k:'궁금한 것을 끝까지 그냥 넘기지 않던 사람',t:'무엇이든 손에 익을 때까지 놓지 않던 사람',e:'낯선 길로 겁내지 않고 먼저 걸어가던 사람',r:'자기보다 곁의 사람을 먼저 챙기던 사람'};
    const pre=jb&&!young?`${L.town||L.C.city}의 ${jb.n}${josa(jb.n,'이었던','였던').slice(jb.n.length)} `:`${L.town||L.C.city}에서 ${a}년을 산 `;
    const tail=young?'짧았지만 누구보다 많이 사랑받은 아이':SAY[top]; return {who,t:`${pre}${josa(given,'은','는')}, ${tail}${josa(tail,'이었어요','였어요').slice(tail.length)}.`}; })();
  // 일찍 끝난 삶: 끝난 뒤 할 수 있는 일을 눈에 띄게 (확률은 그대로, 끝난 뒤의 길만 더한다)
  const inRoom=!G.teacher&&G.data&&G.data.room, longC=(L.comps||[]).slice().sort((x,y)=>y.ls-x.ls)[0], again=inRoom?`<div class="again"><p class="soft">${a<20?'이 삶은 일찍 끝났습니다. ':''}남은 시간에는 같은 1초에 태어난 사람들과 우리 반 친구들의 삶을 둘러보세요.</p><div class="row"><button class="btn primary" id="btnBrowseE">다른 삶 둘러보기</button></div><p class="small">누르면 이 삶의 기록과 위에 적은 답이 먼저 저장됩니다.</p></div>`:a<20?`<div class="again"><p class="soft">이 삶은 일찍 끝났습니다. 남은 시간에는 이렇게 해 볼 수 있어요.</p><div class="row">${longC&&longC.c?`<button class="btn primary" id="btnAgainC">${esc(longC.cn)}에서 태어나 보기<small>같은 1초에 태어난 ${esc(longC.n)}${josa(longC.n,'은','는').slice(longC.n.length)} ${longC.ls}세까지 살았어요</small></button>`:''}<button class="btn" id="btnAgain">무작위로 다시 태어나기</button></div><p class="small">누르면 이 삶의 기록과 위에 적은 답이 먼저 저장됩니다.</p></div>`:'';
  slides.push(SL('한 문장',`<figure class="oneline"><blockquote>“${esc(oneLine.t)}”</blockquote><figcaption>— ${esc(oneLine.who)}</figcaption></figure>${again}${s6b}`));
  // 사진은 엔딩이 시작될 때 미리 받아 둔다
  const pre=[]; if(pkM&&!young){ const c=document.createElement('canvas'); c.width=480; c.height=360; try{ drawPhoto(c,pkM,L,0); }catch(e){} pre.pk={c,pr:drawMemPhoto(c,pkM,L,0).catch(()=>null)}; }
  let sceneRAF=0; const animEnd=()=>{ cancelAnimationFrame(sceneRAF); const cs=[...$('endIn').querySelectorAll('canvas.escene')]; if(!cs.length) return; const t0=performance.now();
    const step=()=>{ let alive=false; cs.forEach(c=>{ if(!c.isConnected) return; alive=true; const x=c.getContext('2d'); x.setTransform(c.width/160,0,0,c.width/160,0,0); x.imageSmoothingEnabled=false; x.clearRect(0,0,160,80); try{ drawScene(x,c.dataset.sc,(performance.now()-t0)/1000,L); }catch(e){} }); if(alive) sceneRAF=requestAnimationFrame(step); }; step(); };
  let i=0; const keep={}; show('end');
  const go=d=>{ const j=i+d; if(j<0||j>=slides.length) return; $('endIn').querySelectorAll('input,textarea').forEach(e=>keep[e.id]=e.type==='checkbox'?e.checked:e.value); i=j; render(); };
  const render=()=>{ const sl=slides[i];
    $('endIn').innerHTML=`<div class="slideshow"><div class="sprog" aria-hidden="true"><i style="width:${((i+1)/slides.length*100).toFixed(1)}%"></i></div><div class="shead"><span class="kick">${esc(sl.k)}${sl.t?` · ${sl.t}`:''}</span><span class="snum">${i+1} / ${slides.length}</span></div><div class="step slide">${sl.b}</div><div class="snav">${i>0?'<button class="btn" id="btnPrev">← 이전</button>':'<span></span>'}${i<slides.length-1?'<button class="btn primary" id="btnStep">다음 →</button>':''}</div></div>`;
    $('s-end').scrollTo(0,0); endWide();
    $('endIn').querySelectorAll('input,textarea').forEach(e=>{ if(keep[e.id]!=null){ if(e.type==='checkbox') e.checked=!!keep[e.id]; else e.value=keep[e.id]; } });
    animEnd(); if($('pkBox')) pickWire($('pkBox'),PK);
    $('endIn').querySelectorAll('canvas[data-k]').forEach(c=>{ const p=pre[c.dataset.k]; if(!p) return; const paint=()=>{ c.width=p.c.width; c.height=p.c.height; c.getContext('2d').drawImage(p.c,0,0); }; paint();
      p.pr.then(src=>{ if(!c.isConnected) return; paint(); const cr=c.closest('.ncard').querySelector('.cr'); if(cr) cr.innerHTML=photoCredit(src); }); });
    if($('btnPrev')) $('btnPrev').onclick=()=>go(-1);
    if(i<slides.length-1) $('btnStep').onclick=()=>go(1);
    else{ const val=id=>String(($(id)?$(id).value:keep[id])||'').trim(), PO=pickOut(PK,PKC,scKind,val('lsum')), opts=()=>({title:val('ltitle').slice(0,30),epi:val('epi').slice(0,40),sum:PO.sum}), cardM=PO.mems.length?PO.mems:three;
      { const ans0=RQ.map((q,k)=>val('rq'+k).slice(0,100)).filter(Boolean), nts0=notes.map(n=>[n.a,String(n.t).slice(0,120)]);   // 인생 기록: 카드 + 내 정보처럼 위쪽 메뉴로 넘겨 보기
        $('recBox').innerHTML=lifeTabs(Object.assign(lifeRecord(L,{...opts(),top,kids:kidN.length,ans:ans0,notes:nts0,top3:PO.top3,fav:PO.fav}),{name:L.name}),{card:'<canvas id="card" width="720" height="1180"></canvas>'}); }
      drawCard(cardM,opts()).catch(()=>{});
      $('btnSave').onclick=async()=>{ try{ await drawCard(cardM,opts()); }catch(e){} $('card').toBlob(b=>{ const l=document.createElement('a'); l.href=URL.createObjectURL(b); l.download='인생기록_'+L.name+'.png'; document.body.appendChild(l); l.click(); l.remove(); }); };
      if($('btnAgainC')) $('btnAgainC').onclick=()=>{ G.afterEnd=()=>birth({c:longC.c,set:longC.set,sex:longC.sex}); $('btnDone').click(); };
      if($('btnBrowseE')) $('btnBrowseE').onclick=()=>{ G.afterEnd=()=>openBrowse(); $('btnDone').click(); };
      if($('btnAgain')) $('btnAgain').onclick=()=>{ G.afterEnd=()=>birth(); $('btnDone').click(); };
      $('btnDone').onclick=()=>{ G.endNav=null; if(G.dev){ G.dev=false; G.teacher=false; G.life=null; if(Store.sess&&G.data) openHub(); else show('login'); openDev(); return; }   // 개발자 모드: 저장하지 않고 개발자 메뉴로
        const {title,epi}=opts(), ans=RQ.map((q,k)=>val('rq'+k).slice(0,100)).filter(Boolean), nts=notes.map(n=>[n.a,String(n.t).slice(0,120)]);
        if(G.teacher){ const d=TStore.data||(TStore.data=TStore.fresh(null)); if(G.tid){ delete d.saves[G.tid]; TStore.dirty.add(G.tid); }
          d.lives=d.lives.concat(lifeRecord(L,{title,epi,top,kids:kidN.length,ans,notes:nts,sum:PO.sum,top3:PO.top3,fav:PO.fav})).slice(-60); TStore.save(true,'lives');
          G.teacher=false; G.life=null; G.tid=null; if(G.afterEnd){ const f=G.afterEnd; G.afterEnd=null; G.teacher=true; G.tid=tNewId(); f(); return; } openTeacherBody(); return; }
        const tNow=Date.now(), share=!!(($('shareOK')&&$('shareOK').checked)||keep.shareOK), comps=(L.comps||[]).map(p=>({n:p.n,cn:p.cn,sex:p.sex,ls:p.ls,cause:p.cause,fam:p.fam,town:p.town,set:p.set,jobs:(p.jobs||[]).map(j=>j[1]).slice(-2),kids:(p.kb||[]).length,mar:p.marA?1:0}));
        G.data.lives=(G.data.lives||[]).concat(Object.assign(lifeRecord(L,{title,epi,top,kids:kidN.length,ans,notes:nts,sum:PO.sum,top3:PO.top3,fav:PO.fav}),{comps,room:G.data.room||null,t:tNow})).slice(-20); G.data.save=null; G.life=null;
        if(G.data.room){ (G.data.roomDone||(G.data.roomDone={}))[G.data.room]=tNow; } Store.save(G.data,true);
        if(G.data.room&&Store.sess){ const rec={name:L.name,age:a,n:L.n,c:L.c,cause:causeOf(L).n,title,epi,ans,sum:PO.sum||'',share:share?1:0,t:tNow}; Store.memberPatch(G.data.room,Object.assign({id:Store.sess.id,name:L.name,age:a,n:L.n,dead:1,c:L.c,t:tNow,title:null,epi:null,ans:null,cause:null},{['past/'+tNow]:rec})); } if(G.afterEnd){ const f=G.afterEnd; G.afterEnd=null; f(); } else openHub(); }; } };
  G.endNav=go;
  const ei=$('endIn'); let tx0=null, ty0=0; ei.ontouchstart=e=>{ const t=e.touches[0]; tx0=t.clientX; ty0=t.clientY; };
  ei.ontouchend=e=>{ if(tx0==null) return; const t=e.changedTouches[0], dx=t.clientX-tx0, dy=t.clientY-ty0; tx0=null; if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&!/INPUT|TEXTAREA|CANVAS/.test(e.target.tagName)) go(dx<0?1:-1); };
  if(!G.teacher){ G.data.save=null; } else tPersist(true);
  render();
}
document.addEventListener('keydown',e=>{ if(!G.endNav||$('s-end').hidden||/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')) return; if(e.key==='ArrowRight') G.endNav(1); else if(e.key==='ArrowLeft') G.endNav(-1); });
// 마지막 기록: 무엇으로, 같은 해 태어난 사람들 가운데 얼마나, 누가 배웅했는지, 같은 1초에 태어난 사람들은
function deathRecord(L){ const C=L.C, a=L.lifespan, cz=causeOf(L), sv=survTo(C,a+1), longer=Math.round((1-sv)*100), P=L.ppl||{}, fm=L.fam;
  const hp=(L.hist||[]).reduce((b,x)=>x.j>(b?b.j:-1)?x:b,null);
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
  const hp=L.hp||{}, n=Math.max(1,hp.cnt||1), nm={m:'살림(돈)',n:'나라의 형편',r:'곁의 사람들',g:'감사하는 마음',c:'함께 웃는 문화',h:'건강'}, avg={}; for(const k in nm) avg[k]=(hp[k]||0)/n;
  const aj=L.hist.length?Math.round(L.hist.reduce((s,x)=>s+x.j,0)/L.hist.length):Math.round(L.s.j), ks=Object.keys(nm).sort((a,b)=>avg[b]-avg[a]), best=ks[0], mx=Math.max(...Object.values(avg).map(Math.abs),1);
  const fmt=v=>{ const r=Math.round(v); return (r>0?'+':'')+(r===0?0:r); };
  const bars=Object.keys(nm).map(k=>`<div class="tbar hp"><span>${nm[k]}</span><i style="width:${Math.max(2,Math.abs(avg[k])/mx*100)}%;background:${avg[k]>=0?'#8FD3B0':'#E8A0A0'}"></i><span class="num">${fmt(avg[k])}</span></div>`).join('');
  const poor=L.C.tier<=2, moneyLow=avg.m<0, msg = best==='m'||best==='n' ? '이 삶에서는 넉넉한 살림이 행복을 크게 받쳐 주었습니다. 그래도 곁의 사람들과 감사하는 마음이 없었다면 그 행복은 훨씬 작았을 거예요.'
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
  T(L.lifespan+'년',48,276,64,'#B4501E',800); T(`의 삶 · 선택 ${L.n}번 · ${TRAIT[L.topTrait()]}`,48+x.measureText(L.lifespan+'년').width+70,276,24,'#5A6A78',500);
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

