// 두 안내서(코드 구조 안내서 · 개발 안내서)를 사람이 보는 페이지로 만든다.
// 모양은 처음 안내서(2026-11-12~14)를 따른다: 번호 붙은 큰 절, 주황 머리 표, 단위 색 표시, 단위별 카드.
// 조각 목록의 크기·개수와 감싸기 목록은 dev/src 와 rebuild.py -v 에서 자동으로 읽는다.
// 조각 설명(DESC)이 없는 새 조각이 있으면 경고가 나온다 → 아래 DESC에 한 줄 더한다.
// 사용: node dev/guides.js  → dev/tests/out/guide_code.html, guide_plan.html (그 뒤 같은 아티팩트에 다시 올림)
const fs=require('fs'), path=require('path'), cp=require('child_process');
const H=__dirname, SRC=path.join(H,'src'), OUT=path.join(H,'tests','out'); fs.mkdirSync(OUT,{recursive:true});
const TODAY='2026-11-15';

/* ---------- 공통 모양 ---------- */
const CSS=`
:root{--bg:#FAF7F0;--card:#FFFFFF;--fg:#26221D;--mut:#7A7166;--line:#ECE4D6;--acc:#C2410C;--head:#C2410C;--headfg:#FFFFFF;--box:#F3EEE5;--code:#F1EBDF;
--b1:#DBEAFE;--b1f:#1E40AF;--b2:#DCFCE7;--b2f:#166534;--b3:#FEF08A;--b3f:#854D0E;--b4:#FCE7F3;--b4f:#9D174D;--b0:#ECE8E1;--b0f:#57514A;
--t1:#3B82F6;--t2:#22C55E;--t3:#EAB308;--t4:#EC4899;--tagb:#E8E6F8;--tagf:#4338CA}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17140F;--card:#211D17;--fg:#EEE8DE;--mut:#A89E90;--line:#352E25;--acc:#F28B54;--head:#9A3412;--headfg:#FFF4EC;--box:#2A241C;--code:#2E271E;
--b1:#1E3A6B;--b1f:#BFDBFE;--b2:#14532D;--b2f:#BBF7D0;--b3:#5B4A0B;--b3f:#FDE68A;--b4:#5E1A3C;--b4f:#FBCFE8;--b0:#3A342B;--b0f:#D6CFC4;--tagb:#2E2A55;--tagf:#C7C2FF;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#17140F;--card:#211D17;--fg:#EEE8DE;--mut:#A89E90;--line:#352E25;--acc:#F28B54;--head:#9A3412;--headfg:#FFF4EC;--box:#2A241C;--code:#2E271E;
--b1:#1E3A6B;--b1f:#BFDBFE;--b2:#14532D;--b2f:#BBF7D0;--b3:#5B4A0B;--b3f:#FDE68A;--b4:#5E1A3C;--b4f:#FBCFE8;--b0:#3A342B;--b0f:#D6CFC4;--tagb:#2E2A55;--tagf:#C7C2FF;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.7 "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}
main{max-width:50rem;margin:0 auto}
.kick{font-size:.82rem;font-weight:700;color:var(--mut);margin:0}
h1{font-size:1.9rem;line-height:1.3;margin:.15em 0 .35em;font-weight:800;text-wrap:balance}
.sub{color:var(--mut);font-size:.86rem;margin:0 0 1.6em}
h2{font-size:1.25rem;color:var(--acc);font-weight:800;margin:2.4em 0 .8em;padding-bottom:.35em;border-bottom:2px solid var(--acc);text-wrap:balance}
h2 small{font-size:.75rem;color:var(--mut);font-weight:600}
h3{font-size:1rem;margin:1.5em 0 .5em;font-weight:800}
ul,ol{padding-left:1.3em;margin:.4em 0} li{margin:.3em 0}
code{background:var(--code);border-radius:4px;padding:.05em .35em;font-size:.84em;font-family:ui-monospace,Consolas,monospace;word-break:break-word}
.tw{overflow-x:auto;margin:.6em 0;border-radius:8px;border:1px solid var(--line)}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:.86rem}
th{background:var(--head);color:var(--headfg);text-align:left;padding:.5em .7em;font-weight:700;white-space:nowrap}
td{border-top:1px solid var(--line);padding:.5em .7em;vertical-align:top}
td.f{font-family:ui-monospace,Consolas,monospace;font-size:.8rem;font-weight:700;white-space:nowrap}
td.n{white-space:nowrap;color:var(--mut)}
.u{display:inline-block;font-size:.72rem;font-weight:800;padding:.08em .5em;border-radius:5px;white-space:nowrap;background:var(--b0);color:var(--b0f)}
.u1{background:var(--b1);color:var(--b1f)}.u2{background:var(--b2);color:var(--b2f)}.u3{background:var(--b3);color:var(--b3f)}.u4{background:var(--b4);color:var(--b4f)}
.tag{display:inline-block;font-size:.7rem;font-weight:700;padding:.05em .5em;border-radius:5px;background:var(--tagb);color:var(--tagf);white-space:nowrap;margin-right:.25em}
.tag.ok{background:var(--b2);color:var(--b2f)}.tag.go{background:var(--b3);color:var(--b3f)}.tag.nx{background:var(--b4);color:var(--b4f)}
.note{color:var(--mut);font-size:.8rem;margin:.4em 0}
.call{background:var(--box);border-left:4px solid var(--acc);border-radius:6px;padding:.75em 1em;margin:1em 0;font-size:.9rem}
.call b:first-child{color:var(--fg)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr));gap:10px;margin:1em 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:.8em .9em;font-size:.86rem;min-width:0}
.card b{display:block;margin-bottom:.25em}
.unit{background:var(--card);border:1px solid var(--line);border-top:6px solid var(--t1);border-radius:10px;padding:1em 1.1em;margin:1.4em 0;min-width:0}
.unit.c2{border-top-color:var(--t2)}.unit.c3{border-top-color:var(--t3)}.unit.c4{border-top-color:var(--t4)}
.unit h3{font-size:1.1rem;color:var(--acc);margin:.1em 0 .6em}
.aim{background:var(--box);border-radius:6px;padding:.6em .8em;font-size:.88rem;margin-bottom:.8em}
.sec{border-left:3px solid var(--line);padding-left:.8em;margin:.8em 0}
.sec>b{font-size:.9rem}
.code{color:var(--mut);font-size:.8rem;margin-top:.6em}
.wrap{color:var(--mut);font-size:.78rem;line-height:1.8}
.foot{margin-top:3em;color:var(--mut);font-size:.8rem}
@media (max-width:600px){h1{font-size:1.55rem}td.f{white-space:normal;word-break:break-all}}`;
const page=(title,sub,body,src)=>`<title>${title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap">
<style>${CSS}</style>
<main><p class="kick">80억 분의 1 · 인생 체험</p><h1>${title}</h1><p class="sub">${sub}</p>
${body}
<p class="foot">${src} · ${TODAY}</p></main>`;
const U={'1':'u1','2':'u2','2-1':'u2','2-2':'u2','2-3':'u2','2-4':'u2','3':'u3','4':'u4'};
const ub=(u,label)=>`<span class="u ${U[u]||''}">${label||u}</span>`;
const tb=(heads,rows,cls=[])=>`<div class="tw"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td${cls[i]?` class="${cls[i]}"`:''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const ul=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const c=s=>`<code>${s}</code>`;

/* ---------- 조각 읽기 ---------- */
const FOLD=[['css','css · html','공통'],['html','','공통'],['1-ops','1-ops — 운영','1'],['2-1-world','2-1-world — 세계·화면','2-1'],['2-2-talk','2-2-talk — 상호작용','2-2'],['2-3-time','2-3-time — 시간·사건 진행','2-3'],['2-4-art','2-4-art — 그림','2-4'],['3-ending','3-ending — 엔딩·기록','3'],['4-engine','4-engine — 내용(자료·삶 계산)','4']];
const files={}; let total=0;
for(const [d] of FOLD){ files[d]=fs.readdirSync(path.join(SRC,d)).sort().map(f=>({f,kb:Math.max(1,Math.round(fs.statSync(path.join(SRC,d,f)).size/1024))})); total+=files[d].length; }
const kb=d=>files[d].reduce((s,x)=>s+x.kb,0);

/* 조각마다 한 줄 설명 (새 조각을 만들면 여기에 더한다) */
const DESC={
'css/01-base.css':'색 토큰, 게임 화면 틀, 이중 테두리 창, 기억·한 해 돌아보기 카드',
'css/02-ending.css':['3','엔딩 슬라이드, 컴퓨터·휴대폰 가로 배치'],
'css/03-warm.css':'따뜻한 레트로 픽셀 덧씌움 + 밤하늘 엔딩',
'css/04-readable.css':'사건 글씨·창 키우기, 큰 화면 대응 (맨 마지막에 덮어씀)',
'html/screens.html':'로그인·계정 홈·교사용·게임·엔딩 등 모든 화면의 뼈대',
'1-ops/01-common-store.js':['1·공통','공통 도구 '+'<code>$</code>·<code>esc</code>, 게임 상태 <code>G</code>, 저장소 <code>Store</code>(Firebase·이 기기·학급 방)'],
'1-ops/02-teacher-records.js':'교사용 삶 기록 저장·이어 하기',
'1-ops/03-login-home.js':'가입 없는 로그인, 계정 홈, 태어나는 연출 <code>birthReveal</code>, 엔딩 가로 배치 <code>endWide</code>',
'1-ops/04-teacher-mode.js':'교사용 모드: 학급 방 운영, 삶 골라 체험',
'1-ops/41-start.js':'첫 화면 시작(이어 하기 확인). 기록 부분은 3-ending/41-start-life-record',
'1-ops/56-dev-mode.js':'개발자 모드: 나라·나이를 골라 바로 플레이, 엔딩 바로 보기',
'1-ops/57-error-box.js':'오류 알림 상자, 개발자 메뉴의 최근 오류',
'1-ops/66-play-fixes-dev.js':'개발자 창 자리(미니맵 바로 아래 네모 칸)',
'1-ops/69-six-dev.js':'개발자 모드에서 능력치 표시 시안 고르기',
'1-ops/71-lives.js':'아이디 하나에 삶 여러 개(최대 5)',
'1-ops/80-friends.js':'같이 하는 친구 목록, 1대1 메시지, 개발자용 대화 API <code>FRIENDS.dev</code>',
'1-ops/82-devrec.js':"개발자 모드 탭: '기록·아이디'(학생 아이디 관리·저장된 삶 보기)와 '지금 플레이 중'(접속 학생 목록·기록 보기·대화)",
'1-ops/83-autoresume.js':'새로고침해도 하던 삶으로 돌아가기',
'2-1-world/10-pixel-art.js':'도트 그래픽 1판(사람·동물·장면)',
'2-1-world/11-pixel-art-2.js':'도트 그래픽 2판(탑다운·그림자·건물)',
'2-1-world/12-world-people.js':'동네 지도 <code>OUT</code>(124×52), 나이별 갈 수 있는 곳 <code>reachOf</code>, 사람·동물·탈것',
'2-1-world/30-render.js':'화면 그리기: 지형·방·가림막·미니맵 (87KB, 큰 조각)',
'2-1-world/50-stats-ui.js':'능력치 그림 <code>radarSVG</code>·그래프 <code>lineChartSVG</code> (엔딩도 씀)',
'2-1-world/51-hd-character.js':'매끈한 사람 그림 (지금 쓰는 캐릭터)',
'2-1-world/52-polish.js':"화면 다듬기: '내 정보' <code>openInfo</code>·'기억' <code>openMem</code> 창, 닫기 단추",
'2-1-world/59-hud-style.js':'미니맵·상태란 폭과 투명도',
'2-1-world/61-phone-style.js':'휴대폰 가로(낮은 화면) 스타일',
'2-1-world/63-zones.js':'옆 동네 지도 4곳(대학가·강가 마을·산과 숲·큰 도시), 지도 바꾸기 <code>setZone</code>',
'2-1-world/65-wayfind.js':'길 찾기: 미니맵 이름표, 목적지 화살표',
'2-1-world/66-play-fixes.js':'미니맵이 나를 따라 움직이기, 미니맵 크기',
'2-1-world/68-map2.js':'동네 지도 다시 짜기(화면 쪽, 자료는 4-engine/60-map2)',
'2-1-world/69-six.js':'여섯 능력치 상태란 <code>sixHud</code>, 열리는 안내 카드, \'내 정보\'의 육각형·행복',
'2-1-world/76-restore.js':'탭을 다시 열었을 때 그림이 까맣게 비지 않게',
'2-1-world/77-move.js':'이사·자취: 집 위치가 바뀜',
'2-1-world/78-feedback.js':'상태란 투명도, 동그라미 누르면 설명, 미니맵 이름표',
'2-1-world/81-hub.js':"오른쪽 위 '모음' 단추(내 정보·기록·메시지·설정·나가기), 설정, 화면 투명도",
'2-1-world/85-panel-style.js':"'내 정보'·'기록' 창 모양",
'2-2-talk/54-talk.js':'말 걸기·만져 보기·건물 안 <code>PLACE_IN</code>, 대화창 <code>dlgRun</code>, 미션 <code>openQuest</code> (58KB)',
'2-2-talk/62-dialog-more.js':"사람 '!' 선택·진로 이야기를 대화창으로, 그림 카드, 확률 표시",
'2-2-talk/64-quiz.js':'문제 풀기 1판(학교 내 자리)',
'2-2-talk/66-play-fixes-talk.js':'일곱 살 아래는 능력치 대신 부모님 말로',
'2-2-talk/67-study-play.js':'놀이터·운동장 미니 게임, 가게·식당에서 사기',
'2-2-talk/69-six-talk.js':'상호작용 한 번에 오르는 몫 <code>tinyGain</code>, 어른 놀이',
'2-2-talk/70-quiz2.js':'문제 풀기 2판: 과목 11가지, 한 해 6문제까지 능력치',
'2-2-talk/78-feedback-talk.js':'파란 미션이 말 걸기보다 먼저',
'2-2-talk/84-quiz-country.js':'국어·역사·사회 문제를 그 나라 이야기로 (193개국)',
'2-3-time/20-life-settings.js':'이번 삶의 설정: 빠르기, 한 해 돌아보기',
'2-3-time/21-game-flow.js':'게임 진행: 한 해 시작·끝, 매 틀 <code>loopBody</code>, 가운데 팝업 <code>sheet</code>, 알림 <code>toast</code>, 확률 <code>pct</code>, 미션이 오는 때',
'2-3-time/58-time-flow.js':'흐르는 시간 <code>flowTick</code>, 중요한 선택 동안만 멈춤, 저장하기 창',
'2-3-time/66-play-fixes-auto.js':"고르지 않은 선택은 '확실'(없으면 가장 잘될 것)으로",
'2-3-time/69-six-vow.js':"삶 시작 전 '소중한 것' 설문(5문항)",
'2-3-time/72-young-ui.js':"'확실' 표시를 '잘될 확률 100%'로",
'2-3-time/73-start-simple.js':'학생 시작 설정은 시간의 빠르기 하나',
'2-3-time/74-skip6.js':'여섯 살 첫 안내(집 밖으로 나갈 수 있음)',
'2-3-time/78-feedback-time.js':"0살 처음 '내 정보' 안내, 아플 때 남은 시간",
'2-3-time/79-tutorial.js':'0~5살 처음 안내, 5살로 건너뛰기',
'2-4-art/53-art-loader.js':'제미나이 그림: 아틀라스, 장면 그림 이름 <code>scArtName</code>, 나이 맞춤 <code>scAgeFix</code>, 그림 목록 <code>SC_ALL</code>',
'2-4-art/75-sc-sex.js':'장면 속 주인공 성별이 다르면 쓰지 않음',
'3-ending/31-memory-photos.js':'추억 사진: 그날의 한 장면을 필름 사진처럼 (57KB)',
'3-ending/40-ending.js':'엔딩 4막 12장 <code>finishLife</code>, 삶의 길·우연·떠나보낸 것·세계 지도',
'3-ending/41-start-life-record.js':'인생 기록 <code>lifeRecord</code>(요약·흐름·돈·이야기·기억)',
'3-ending/55-life-record-menu.js':"기록 위쪽 메뉴(한눈에·삶의 모양·돈과 행복·이야기·기억·남긴 말)",
'3-ending/60-end-picks.js':"엔딩 '나의 기억 고르기', 기록 카드 <code>lifeDetailHTML</code>",
'3-ending/90-visual-enhancer.js':'엔딩 밤하늘 별빛',
'4-engine/01-base.js':'설정, 도구 함수, 나라 특색, 5살 전 사망 기준 <code>u5Norm</code>',
'4-engine/02-countries.js':'193개 나라 표, 지역, 출생 비율, 소득 수준',
'4-engine/03-names-places.js':'이름·동네·학교·일터 이름, 장소',
'4-engine/04-scenes-base.js':'작은 선택·그해의 일·큰 사건·미션 기본 틀',
'4-engine/10-kr-only.js':'한국·일본에만 나오는 선택·사건',
'4-engine/11-common.js':'모든 나라 공통 사건, 자연재해, 음식·명절',
'4-engine/12-regional.js':'지역별 장면·큰 사건',
'4-engine/13-jobs.js':'직업과 월급, 직업 고르기',
'4-engine/14-world-map.js':'세계 지도(대륙 윤곽·나라 위치)',
'4-engine/15-life-data.js':'일에 따른 큰 사건, 명소·동물, 돈·집·결혼·아픔',
'4-engine/16-result-text.js':'아픈 이름, 결과 문장, 실패 문장 <code>tryForm</code>',
'4-engine/20-life-class.js':['4·공통','<b>삶 엔진 Life</b> (태어남·나이 듦·선택·저장 불러오기·사망) — 가장 조심. 돈 계산 <code>ledger</code>'],
'4-engine/30-calendar.js':'한 해의 달력: 학교·시험·입시·일·가족·돈·건강, 재해 고르기 <code>planMajors</code> (154KB, 가장 큼)',
'4-engine/31-family.js':'부모·형제·조부모·가족 종교·가족의 일',
'4-engine/32-final-record.js':'같은 1초에 태어난 사람들, 세상을 떠난 이유',
'4-engine/33-institutions.js':'군 복무·정년·연금·의료보험·이주',
'4-engine/34-variety.js':'문장 다양화, 갈림길, 이어지는 선택',
'4-engine/35-adult-days.js':'어른의 날들(30~70살)',
'4-engine/36-country-life2.js':'나라마다의 삶 2(출처 표시)',
'4-engine/37-epidemic.js':'감염병과 대유행, 감염병 사망',
'4-engine/38-country-events.js':'나라마다의 사건: 음식·말·돈·강·명절',
'4-engine/39-job-region-events.js':'일·사는 곳별 사건, 정반대 선택지',
'4-engine/40-job-fit.js':'누구에게나 오는 일을 처지에 맞게',
'4-engine/50-stats2.js':'능력치 2판 바탕(옛 오각형 계산)',
'4-engine/51-new-events.js':'능력치 2판용 새 사건',
'4-engine/52-convert.js':'옛 사건 효과 변환',
'4-engine/53-chance.js':"선택지 확률 <code>setPd</code>, 얻는 것이 없으면 '확실'",
'4-engine/54-career.js':'진로: 흥미 분야, 대학 층·학과, 일자리 후보',
'4-engine/55-realism.js':'같은 일이 너무 자주 나오지 않게(간격·횟수)',
'4-engine/56-zone-places.js':'옆 동네의 장소·작은 선택·미션',
'4-engine/57-repeat.js':'되풀이 줄이기 2, 나이별 월급 모습 <code>setJob</code>',
'4-engine/58-simple.js':'성향을 뺀 자리를 평균값으로 고정',
'4-engine/59-missions.js':'미션 손보기(건물 안 주인에게)',
'4-engine/60-map2.js':'동네 지도 다시 짜기(자료 쪽)',
'4-engine/61-choices.js':'자주 나오는 큰 사건의 선택지',
'4-engine/62-six.js':'여섯 능력치와 행복 <code>joyComps</code>, 재산 <code>moneyIdx</code>',
'4-engine/63-missions2.js':'나이에 따라 집 → 동네 → 동네 밖 미션',
'4-engine/64-young.js':'0~20살 문장 손질',
'4-engine/65-young2.js':'0~20살 점검 뒤 개선',
'4-engine/66-young3.js':'5살 집 안 미션 8개',
'4-engine/67-calib.js':'실제 통계 맞추기: 나라별 기대수명 <code>REF_ADJ</code>, 재해 잦기 <code>HZ_X</code>',
'4-engine/68-country-more.js':'나라별 다양성: 139개 나라의 가족 종교 비율 <code>RELG</code>, 출생이 많은 나라부터 그 나라만의 0~20살 달력 일 109가지(무게 6, 한 번). 달력 일을 더하는 마지막 조각',
'4-engine/u69-six-life.js':'손을 놓은 능력치가 해마다 조금 줄기',
'4-engine/u77-move-life.js':'이사 사건과 집 위치 맞추기',
};
const miss=[];
const pieceTables=FOLD.filter(([d])=>d!=='html').map(([d,label,u])=>{
  const list=d==='css'?[...files.css.map(x=>({...x,d:'css'})),...files.html.map(x=>({...x,d:'html'}))]:files[d].map(x=>({...x,d}));
  const n=list.length, size=list.reduce((s,x)=>s+x.kb,0);
  const rows=list.map(x=>{ let v=DESC[x.d+'/'+x.f], uu=u; if(Array.isArray(v)){ uu=v[0]; v=v[1]; } if(!v){ miss.push(x.d+'/'+x.f); v='<i>(설명 없음)</i>'; }
    const big=x.kb>=60?' <span class="tag nx">큼</span>':''; return [x.f, x.kb+'KB'+big, ub(uu.split('·')[0], uu), v]; });
  return `<h3>${label} <span class="note">(${n}개 · ${size}KB)</span></h3>`+tb(['파일','크기','단위','담는 내용'],rows,['f','n','','']);
}).join('');
if(miss.length) console.warn('설명 없는 조각:',miss.join(', '));

/* 감싸기 목록: rebuild.py -v */
let wraps=[];
try{ wraps=cp.execSync('python3 '+path.join(H,'rebuild.py')+' -v',{cwd:path.join(H,'..')}).toString().split('\n').filter(l=>/^\s+\S+\(.+→.+\)$/.test(l)).map(l=>l.trim()); }catch(e){}

/* ================= 코드 구조 안내서 ================= */
const code=page('코드 구조 안내서',
`게임 코드가 어떤 조각으로 나뉘어 있고, 무엇을 고칠 때 어디를 여는지 정리한 문서 · 구조가 바뀌면 이 문서도 함께 고칩니다 · ${TODAY} 기준 (조각 ${total}개, 7개 단위 폴더)`,
`<h2>1. 한눈에 보기</h2>
${ul([
 `<b>배포는 파일 하나:</b> 학생이 쓰는 ${c('index.html')} 한 파일은 ${c('dev/src/')}의 조각들을 ${c('python3 dev/rebuild.py')}로 이어 붙여 만듭니다. ${c('index.html')}은 직접 고치지 않습니다.`,
 `<b>조각 ${total}개, 폴더 = 개발 단위:</b> ${FOLD.filter(([d])=>d!=='html'&&d!=='css').map(([d,,u])=>`${ub(u)} ${c(d)} ${files[d].length}`).join(' · ')} · 함께 쓰는 ${c('css')} ${files.css.length} · ${c('html')} ${files.html.length}. 실행 순서를 정하는 빈 틀은 ${c('template.html')}.`,
 `<b>순서는 틀이 정함:</b> 파일 이름 앞 번호는 정리 번호일 뿐이고, 실제 실행 순서는 ${c('template.html')}의 ${c('&lt;!--#include 경로--&gt;')} 줄 순서입니다. 새 조각을 만들면 그 단위 폴더에 두고 이 줄을 넣습니다.`,
 `<b>번호를 지키는 규칙:</b> 장면·큰 사건·해의 사건·미션·달력의 일은 저장된 삶이 <b>번호</b>로 기억합니다. 새로 더할 때는 반드시 목록 <b>맨 뒤에</b> 더하고, 앞쪽 것은 지우지 말고 끄기만 합니다.`,
 `<b>이름은 한 번만:</b> 모든 조각은 한 스크립트로 합쳐지므로 맨 바깥 ${c('function')} 이름이 두 조각에 있으면 빌드가 멈춥니다(4장). 조각마다 문법 검사도 합니다.`,
 `<b>고칠 곳 찾기:</b> ${c('python3 dev/rebuild.py -u 2-2')} → 그 단위의 조각 목록, ${c('python3 dev/rebuild.py -w 이름')} → 그 함수를 정의·감싸는 모든 곳. 요청별로 여는 조각은 5장 표에 있습니다.`])}

<h2>2. 개발 단위와 여는 조각</h2>
<p>작업은 아래 단위로 나눠 한 채팅에 한 단위씩 맡깁니다. 단위의 목표와 계획은 「개발 안내서」에 있습니다.</p>
${tb(['단위','하는 일','주로 여는 조각','함께 확인할 곳','시험'],[
 [ub('1','1 운영'),'로그인·가입 없는 비밀번호, 계정 홈, 교사용 모드·학급 방, 개발자 모드(기록·아이디), 오류 알림, 여러 삶, 친구 메시지','1-ops/01·03·04·56·71·80·82','3 (기록 보기), Firebase 규칙(보안 정리는 시범 점검 뒤)','ids·devmode'],
 [ub('2-1','2-1 세계·화면'),'동네·옆 동네 지도, 가림막·미니맵, 길 찾기, 이사, 그리기·캐릭터, 여섯 능력치 상태란, 내 정보·기억 창, 모음 메뉴·설정, 휴대폰 가로','2-1-world/12·30·63·65·69·81, css/01·03·04','2-2 (건물·가구 위치 OUT·ENTER·PLACE_IN), 4 (장소·지도 자료 engine/56·60)','map·zones·hub·mobile'],
 [ub('2-2','2-2 상호작용'),"말 걸기·만져 보기·건물 13곳, 미션 대화, 사람 '!' 선택·진로 이야기, 문제 풀기(나라별), 놀이·사기",'2-2-talk/54·62·70·84·67','2-1 (건물 위치), 4 (미션 내용 engine/04·59·63, 진로 engine/54)','talk·quest·career'],
 [ub('2-3','2-3 시간·사건 진행'),"시간 흐름, 한 해 시작·끝, 사건 창·알림 카드, 저장하기, 시작 설정·'소중한 것' 설문·0~5살 안내",'2-3-time/21·58·69-six-vow·79','1 (저장·학급 방), 4 (사건 형식)','flow·tutorial·young'],
 [ub('2-4','2-4 그림'),'제미나이 그림, 아틀라스, 장면 그림 이름 규칙, 주인공 성별','2-4-art/53·75, art/, dev/art-tools/','2-1·3 (그림이 쓰이는 곳)','aendshow'],
 [ub('3','3 엔딩·기록'),'엔딩 4막 12장, 나의 기억 고르기, 인생 기록 메뉴, 추억 사진, 지나온 삶 목록','3-ending/40·41-start-life-record·55·60, css/02','2 (저장 형식 Life.load, 기록 형식 lifeRecord), 4 (엔딩 숫자 계산)','aendshow·endL·picks·endearly'],
 [ub('4','4 내용(자료)'),'나라 자료, 장면·달력, 직업·월급, 삶 계산 Life, 돈·확률·진로·능력치·미션 규칙, 사망·재해 통계','4-engine/ 전체','2-3 (사건이 나오는 방식), 저장 호환','golden·aplay·sim·simp'],
])}
<div class="call"><b>여러 단위가 함께 쓰는 곳 — 바꿀 때 먼저 알리기:</b> 저장된 삶의 형식(${c('Life.load')})과 기록 카드 형식(${c('lifeRecord')})은 2·3이, 건물 정보(${c('OUT')}·${c('ENTER')}·${c('PLACE_IN')})는 2-1·2-2가, 사건·선택의 형식은 2-3·4가 같이 씁니다. 공통 상태 ${c('G')}·${c('Life')}의 이름을 바꾸는 일은 한 번에 모아서 합니다.</div>

<h2>3. 조각 목록</h2>
<p class="note">단위 칸의 색: 파랑=1 운영, 초록=2 게임 진행, 노랑=3 엔딩·기록, 분홍=4 내용, 회색=공통. 60KB가 넘는 조각에는 '큼' 표시가 붙습니다(나눌 후보). 이름 끝의 ${c('-dev')}·${c('-talk')}·${c('-time')}·${c('-auto')}·${c('-vow')}와 앞의 ${c('u')}는 2026-11-15에 한 조각을 단위별로 나눈 것이며, 실행 순서는 원래 자리 그대로입니다.</p>
${pieceTables}
<div class="call"><b>사건이 보이는 방식 세 가지:</b> 사람과의 일(말 걸기·미션 ${c('openQuest')}·사람이 나오는 '!' 선택·진로 이야기)은 아래 대화창 ${c('dlgRun')}(2-2-talk/54·62) · 큰 사건·갈림길·달력 선택은 가운데 팝업 ${c('sheet')}(2-3-time/21) · 그 밖의 작은 일은 오른쪽 위 알림 카드 ${c('toast')}(2-3-time/21). 새 사건은 이 셋 중 하나에 맞춥니다.</div>

<h2>4. 이름 검사와 감싸기</h2>
${ul([
 `같은 이름이 두 조각에 있으면 ${c('rebuild.py')}가 <b>index.html을 만들지 않고 멈춥니다</b>(예전에 ${c('scImg')}가 겹쳐 장면 그림이 깨진 적이 있음). 조각마다 ${c('node --check')}로 문법도 봅니다(한 줄 함수 안의 ${c('//')} 주석이 뒤를 모두 주석으로 만든 적이 있어 ${c('/* */')}를 씁니다).`,
 `앞 조각의 함수를 일부러 바꿀 때는 ${c('const _x=이름; 이름=function(...){...}')}처럼 감쌉니다. 감싸는 조각은 원래 조각보다 뒤에 있어야 합니다. Life의 메서드는 ${c('const P=Life.prototype, _e=P.endPeriod; P.endPeriod=function(){...}')}.`,
 `지금 감싸기 ${wraps.length}곳 (${c('python3 dev/rebuild.py -v')}로 자동으로 뽑은 목록):<div class="wrap">${wraps.join(' · ')}</div>`])}

<h2>5. 이렇게 요청하면 이 조각만 열립니다</h2>
<p>고치고 싶은 것을 말하면 Claude는 아래 조각만 엽니다. 엔딩처럼 화면과 계산이 겹치는 일은 '화면만'인지 '숫자(계산)까지'인지 함께 말하면 더 적게 엽니다.</p>
${tb(['단위','고치고 싶은 것','여는 조각'],[
 [ub('3'),'엔딩 글자·배치·장 순서·구성','3-ending/40-ending.js (finishLife의 slides 목록), css/02-ending.css'],
 [ub('3'),'엔딩에 나오는 숫자(수명·돈·떠난 이유)','보여 주기 3-ending/40-ending.js, 계산 4-engine/20-life-class.js·32-final-record.js'],
 [ub('3'),"기록 메뉴 탭('돈과 행복' 등)",'3-ending/55-life-record-menu.js (기록 형식은 41-start-life-record의 lifeRecord)'],
 [ub('3'),'나의 기억 고르기, 지나온 삶 목록','3-ending/60-end-picks.js, 1-ops/71-lives.js'],
 [ub('3'),'추억 사진','3-ending/31-memory-photos.js (사진 파일 ph/)'],
 [ub('1'),'로그인·비밀번호·학생 아이디 관리','1-ops/01-common-store.js, 03-login-home.js, 82-devrec.js'],
 [ub('1'),'교사용 모드·학급 방','1-ops/04-teacher-mode.js, 02-teacher-records.js'],
 [ub('1'),'개발자 모드·오류 알림','1-ops/56-dev-mode.js, 57-error-box.js, 82-devrec.js'],
 [ub('1'),'친구 목록·메시지, 새로고침 이어 하기','1-ops/80-friends.js, 83-autoresume.js'],
 [ub('1'),'태어날 때 카드 연출','1-ops/03-login-home.js (birthReveal)'],
 [ub('2-1'),'동네 지도·가림막·미니맵','2-1-world/12-world-people.js, 30-render.js, 68-map2.js (자료 4-engine/60-map2)'],
 [ub('2-1'),'옆 동네·이사','2-1-world/63-zones.js, 77-move.js (장소 4-engine/56-zone-places)'],
 [ub('2-1'),'길 찾기·화살표','2-1-world/65-wayfind.js'],
 [ub('2-1'),"상태란·여섯 능력치 표시·'내 정보'",'2-1-world/69-six.js, 52-polish.js, 85-panel-style.js (계산 4-engine/62-six)'],
 [ub('2-1'),"오른쪽 위 '모음' 메뉴·설정·투명도",'2-1-world/81-hub.js'],
 [ub('2-1'),'휴대폰 가로 화면','2-1-world/61-phone-style.js, css/04-readable.css'],
 [ub('2-2'),'건물 안·말 걸기·만져 보기·미션 대화','2-2-talk/54-talk.js (미션 내용 4-engine/04·59·63·66)'],
 [ub('2-2'),"사람 '!' 선택 대화·진로 이야기 대사",'2-2-talk/62-dialog-more.js (진로 규칙·대학 4-engine/54-career)'],
 [ub('2-2'),'문제 풀기','2-2-talk/70-quiz2.js, 84-quiz-country.js'],
 [ub('2-2'),'놀이터·가게','2-2-talk/67-study-play.js'],
 [ub('2-3'),'시간 흐름·멈춤·저장하기','2-3-time/58-time-flow.js, 21-game-flow.js, 20-life-settings.js'],
 [ub('2-3'),'미션이 오는 때','2-3-time/21-game-flow.js (L.cur.qt)'],
 [ub('2-3'),"삶 시작 설정·'소중한 것' 설문·0~5살 안내",'2-3-time/73-start-simple.js, 69-six-vow.js, 79-tutorial.js'],
 [ub('2-3'),'선택지 확률·확률 표시','계산 4-engine/53-chance.js, 표시 2-3-time/21-game-flow.js (pct)'],
 [ub('2-4'),'장면 그림이 문장과 어긋남','2-4-art/53-art-loader.js (scAgeFix·scVar), 75-sc-sex.js, 장면 종류 4-engine/57-repeat.js'],
 [ub('2-4'),'그림 더하기','2-4-art/53-art-loader.js (SC_ALL), art/'],
 [ub('4'),'같은 이야기가 너무 자주 나옴','4-engine/55-realism.js, 57-repeat.js'],
 [ub('4'),'큰 사건 선택지','4-engine/61-choices.js, 39-job-region-events.js'],
 [ub('4'),'0~20살 문장이 어색함','4-engine/64-young.js, 65-young2.js, 16-result-text.js'],
 [ub('4'),'월급·생활비·빚','4-engine/20-life-class.js (ledger), 57-repeat.js (setJob), 13-jobs.js'],
 [ub('4'),'재산·행복 수치','4-engine/62-six.js (moneyIdx·joyComps)'],
 [ub('4'),'사망·수명·감염병·재해 확률','4-engine/20-life-class.js (endPeriod), 67-calib.js, 37-epidemic.js, 30-calendar.js (planMajors)'],
 [ub('4'),'나라 자료(출생 수·소득 수준)','4-engine/02-countries.js, 01-base.js'],
 [ub('4'),'나라별 고유 사건·가족 종교','4-engine/68-country-more.js, 36-country-life2.js, 38-country-events.js(자동), 31-family.js(RELG)'],
 [ub('4'),'한국 학교·입시','4-engine/10-kr-only.js, 30-calendar.js'],
 [ub('4'),'저장된 삶 호환','4-engine/20-life-class.js (Life.load)'],
])}

<h2>6. 일하는 방법</h2>
<ol>
<li>작업 시작 전 ${c('git pull --rebase origin main')} (사진 받기 Actions가 ${c('ph/')}에 커밋합니다).</li>
<li>해당 조각만 고치고 ${c('python3 dev/rebuild.py')} → 단위에 맞는 시험(2장 표) → 필요할 때만 화면 확인. 엔진을 고칠 때는 고치기 전에 ${c('python3 dev/tests/golden.py save')}, 고친 뒤 ${c('python3 dev/tests/golden.py')}.</li>
<li>올리기 직전에 다시 ${c('git pull --rebase origin main')}, 다시 빌드, 푸시, ${c('git ls-remote origin main')}이 HEAD와 같은지 확인합니다.</li>
<li>큰 변경은 ${c('README.md')}에 한 줄 덧붙이고, 구조가 바뀌면 ${c('dev/GUIDE.md')}와 이 문서(${c('node dev/guides.js')})를 고칩니다.</li>
</ol>

<h2>7. 나눈 이력과 다음 정리</h2>
${ul([
 `<b>2026-11-12 나눔:</b> v.html 한 파일(1.5MB)을 빈 틀 + 조각 57개로 나눔. 같은 날 90KB였던 talk.js를 8조각으로 더 나눔.`,
 `<b>2026-11-13~14:</b> 선생님 플레이 점검을 반영하며 조각이 날짜별 '모음'(66-play-fixes·69-six·78-feedback 등)으로 늘어남 → 한 조각 안에 여러 단위가 섞임.`,
 `<b>2026-11-15 정리:</b> 조각을 단위별 폴더 7개로 옮기고, 섞인 조각 5개(41·66·69·77·78)를 단위별로 나눔. 덮어써지던 빈 함수와 쓰지 않는 기능(옛 오각형, 15초 고르기, 확률을 말로 보이기) 약 32KB를 지움. 빌드에 문법 검사, 찾기 명령(${c('-u')}·${c('-w')})을 더함.`,
 `<b>다음 정리(급하지 않음):</b> 4-engine/30-calendar.js(154KB)·2-1-world/30-render.js(87KB)를 주제별로 나누기. 날짜별 모음 조각(66·69·78)의 내용을 제자리 조각으로 옮기기. 새 기능은 날짜별 새 조각이 아니라 그 단위의 알맞은 조각에 넣기.`])}`,
'저장소의 dev/guides.js로 만든 페이지 (조각 목록·감싸기는 dev/src에서 자동)');

/* ================= 개발 안내서 ================= */
const unitCard=(n,cls,title,aim,secs,foot)=>`<div class="unit ${cls}"><h3>${ub(n)} ${title}</h3><div class="aim"><b>지향점.</b> ${aim}</div>${secs.map(([h,items])=>`<div class="sec"><b>${h}</b>${ul(items)}</div>`).join('')}<p class="code">${foot}</p></div>`;
const t=(s,k='')=>`<span class="tag ${k}">${s}</span>`;

const plan=page('개발 안내서',
`수업용 웹 게임 「80억 분의 1」을 어떤 방향으로, 어떤 단위로 나누어 만들고 있는지 정리한 문서 · 앞으로의 개발은 이 문서를 기준으로 이어 갑니다 · ${TODAY} 기준 · 계획과 현황이 바뀌면 이 문서를 고칩니다`,
`<h2>1. 이 프로젝트는</h2>
<p>세계 193개 나라 가운데 <b>실제 출생 비율대로</b> 어느 한 곳에 태어나, 한 사람의 삶을 끝까지 살아 보는 웹 게임입니다. 중학교 수학 교사가 수업 시간에 학생들과 함께 쓰기 위해 만들고 있습니다.</p>
<div class="cards">
<div class="card"><b>누가 쓰나</b>중학생(학급 단위 수업), 교사(학급 방 운영), 집에서 이어 하는 학생</div>
<div class="card"><b>무엇을 느끼게 하나</b>태어난 곳과 형편이 삶에 미치는 영향, 같은 순간 태어난 다른 사람들의 서로 다른 삶</div>
<div class="card"><b>어디서 쓰나</b>컴퓨터와 휴대폰 가로 화면. 별도 설치 없이 웹 주소(GitHub Pages)로 접속</div>
<div class="card"><b>어떻게 저장하나</b>Firebase 데이터베이스(학생 아이디별), 없으면 이 기기에만 저장</div>
</div>
<div class="call"><b>지금의 초점.</b> <b>0~20살과 엔딩</b>을 먼저 완성합니다. 21살 이후는 자동 진행과 엔딩이 어색하지 않은 정도로만 손봅니다. 그다음은 학생 시범 점검 → 보안 정리 순서입니다.</div>
<h3>개발에서 지키는 원칙</h3>
${ul([
 `<b>사건이 보이는 방식 세 가지:</b> ① 사람과의 일(말 걸기·미션·사람이 나오는 '!' 선택·진로 이야기)은 <b>아래 대화창</b> ② 중요한 사건·갈림길은 <b>가운데 팝업</b> ③ 그 밖의 작은 일은 <b>오른쪽 위 알림 카드</b>. 새 사건도 이 셋 중 하나에 맞춥니다.`,
 `<b>선택에는 확률이 보인다:</b> 모든 선택지에 '잘될 확률 N%'를 숫자로 보여 줍니다(끄는 설정 없음). 얻는 것이 클수록 어렵고, 얻는 것이 없는 선택은 '잘될 확률 100%'.`,
 `<b>실제 자료 위주:</b> 나라별 통계·제도·사건은 실제 자료를 바탕으로 하고, 지어낸 이름은 가상임을 밝힙니다. 현실의 확률은 그대로 둡니다(6장).`,
 `<b>중학생 수업에 맞게:</b> 죽음·질병 같은 무거운 장면은 "짧고 담담하게". 능력치는 대부분 절반 안팎으로 균형을 맞춥니다.`,
 `<b>화면 기준:</b> 컴퓨터와 휴대폰 가로(엔딩 포함). 휴대폰 세로는 "가로로 돌려 주세요" 안내.`,
 `<b>이어서 할 수 있게:</b> 예전 형식으로 저장된 삶도 계속 이어서 할 수 있어야 합니다. 새 장면·미션·달력 일은 목록 맨 뒤에.`,
 `<b>가입 없는 로그인:</b> 학생은 별명 아이디와 비밀번호만 적습니다. 처음 쓴 아이디면 그때 비밀번호가 정해집니다.`])}

<h2>2. 개발 단위 4개</h2>
<p>작업은 아래 4개 큰 단위로 나눠 진행합니다. 한 번에 한 단위를 맡으면 열어 볼 코드가 몇 개 조각으로 정해져 있어 정확하게 작업할 수 있습니다. (단위별 코드 위치는 「코드 구조 안내서」 참고)</p>
${tb(['단위','한 줄 목표','현재','다음'],[
 [ub('1','1 운영'),'학생이 막힘없이 들어오고, 교사가 학급을 한눈에 운영한다',t('기능 갖춤','ok'),'학생 시범 점검 → 보안 정리'],
 [ub('2','2 게임 진행'),'살아 있는 동네에서 사람·물건과 부딪히며 시간이 흐른다',t('0~20살 다듬는 중','go'),'실제 기기 확인, 내용 다듬기'],
 [ub('3','3 엔딩·기록'),'삶의 끝에서 내 삶을 돌아보고, 기록으로 남긴다',t('엔딩 2판 + 점검(11-15)','ok'),'수업에서 확인, 학급 방 수업 도구와 연결'],
 [ub('4','4 내용(자료)'),'나라와 처지에 따라 다른, 근거 있는 삶의 사건들',t('실제 통계 맞춤(11-15)','go'),'21살 이후 세부, 나라별 재해 자료'],
])}
<p class="note">"기능 갖춤"은 계획한 기능이 들어 있다는 뜻이고, 학생 기기에서의 확인은 아직 남아 있습니다(5장).</p>

${unitCard('1','','운영 — 로그인 · 교사용 · 개발자 모드',
'학생은 별도 가입 없이 바로 들어와 이어서 살 수 있고, 교사는 학급 방을 열어 반 전체의 진행을 함께 운영·확인할 수 있다. 개발 중에는 어떤 나라·나이·엔딩도 바로 열어 확인할 수 있다.',
[['세부 내용',[
 '<b>로그인:</b> 시작하기 버튼 하나. 처음 쓰는 아이디면 적은 비밀번호로 만들어지고, 이후는 확인합니다.',
 `<b>여러 삶</b> ${t('11-14','ok')}: 아이디 하나에 삶을 5개까지. 새로고침해도 하던 삶으로 돌아옵니다.`,
 `<b>친구와 메시지</b> ${t('11-14','ok')}: 지금 같이 하는 친구의 간단한 정보와 1대1 메시지.`,
 "<b>교사용 모드·학급 방:</b> 방을 열면 반 전체가 같은 나이로 움직입니다. 교사는 나라·시작 나이를 골라 직접 체험할 수도 있습니다.",
 "<b>개발자 모드:</b> 나라·사는 곳·형편·성별·시작 나이를 골라 바로 플레이, 엔딩 바로 보기, 끝까지 자동으로 살기. '기록·아이디' 탭에서 학생 아이디 목록·초기화·삭제·미리 등록.",
 `<b>지금 플레이 중</b> ${t('11-15','ok')}: 개발자 창의 탭. 지금 접속한 학생(나이·나라·사는 곳)을 보고, 그 학생이 마지막으로 저장한 삶을 자세히 보고, 1대1로 대화합니다. 이 탭을 열어 두면 학생의 친구 목록에 '선생님'이 나타나 답할 수 있습니다.`,
 "<b>오류 알림:</b> 진행 중 오류가 나도 게임은 이어지고, 빨간 상자와 개발자 메뉴의 '최근 오류'에 남습니다."]],
 ['앞으로',[
 `${t('확정')} 학생 시범 점검을 한 뒤 <b>보안 정리</b>(교사 입장 코드, 데이터베이스 규칙). 지금은 학생에게 진짜 비밀번호를 쓰지 말라고 안내하는 중입니다.`,
 `${t('후보')} 시범 점검에서 나온 불편(로그인 실패 문구, 아이디 관리 화면 등) 정리.`]]],
`<b>맡은 코드:</b> 1-ops/ (${files['1-ops'].length}조각) · <b>시험:</b> ids, devmode`)}

${unitCard('2','c2','게임 진행 — 살아 있는 동네와 흐르는 시간',
'사람은 많지만 아무 일도 일어나지 않는 화면이 아니라, 사람에게 말을 걸고 물건을 만지고 건물에 들어가며 삶이 조금씩 달라지는 경험. 모두가 같은 속도로 시간이 흐르고, 어떤 선택은 때를 놓치면 사라진다.',
[[`${ub('2-1')} 세계·화면 ${t('구현됨','ok')}`,[
 '<b>동네 지도:</b> 가로 124칸 × 세로 52칸. 나이에 따라 갈 수 있는 곳이 넓어지고(집 → 큰길 아래 → 큰길 건너 → 먼 곳), 못 가는 곳은 구름처럼 가려집니다.',
 `<b>옆 동네와 이사</b> ${t('11-13~14','ok')}: 대학가(서)·강가 마을(남)·산과 숲(북)·큰 도시(동), 19살부터. 이사·자취하면 집 위치가 실제로 바뀝니다.`,
 `<b>길 찾기</b> ${t('11-13','ok')}: 미니맵 이름표, 목적지 화살표, 나를 따라 움직이는 미니맵.`,
 `<b>화면 구성</b> ${t('11-14','ok')}: 위쪽 동그라미 상태란(여섯 능력치), 오른쪽 위 '모음' 단추(내 정보·기록·메시지·설정·나가기). 설정에서 화면 투명도를 바꿉니다.`,
 `<b>앞으로</b> ${t('후보')}: 실제 휴대폰·학생 기기에서 글씨 크기와 조작 확인.`]],
 [`${ub('2-2')} 상호작용 ${t('구현됨','ok')}`,[
 '<b>말 걸기:</b> 가족·선생님·친구·이웃·동물에게 다가가 A를 누르면 아래 대화창에 말이 나옵니다.',
 '<b>미션:</b> 파란 미션은 한 해 앞쪽에 오고, 다른 상호작용보다 먼저 뜹니다. 나이에 따라 집 → 동네 → 동네 밖으로 넓어집니다.',
 '<b>만져 보기·건물 안:</b> 집·학교·동네 물건을 나이에 맞게 만지고, 친구네·가게·도서관·병원 등 13곳에 들어갑니다.',
 "<b>사람 '!' 선택과 진로 이야기:</b> 가족·친구·선생님이 나오는 선택은 대화창에서. 12~18살 진로 이야기로 흥미 분야·목표 학과를 정합니다.",
 `<b>문제 풀기 2판</b> ${t('11-14','ok')}: 학교 내 자리에서 과목 11가지, 한 해 6문제까지 능력치에 반영. 국어·역사·사회는 그 나라 이야기로(193개국).`,
 `<b>놀이·사기</b> ${t('11-13','ok')}: 놀이터·운동장 미니 게임, 가게·식당에서 사기.`,
 `<b>앞으로</b> ${t('후보')}: 새로 늘어난 대화·활동 문장을 사람이 읽고 다듬기.`]],
 [`${ub('2-3')} 시간·사건 진행 ${t('구현됨','ok')}`,[
 '<b>시간은 멈추지 않습니다(학생):</b> 가운데 팝업의 중요한 선택을 고르는 동안만 멈추고, 고르지 않은 창은 한 해 끝에 정리됩니다. (15초 안에 고르기는 11-15에 없앰)',
 '<b>빠르기:</b> 학생은 삶을 시작할 때 한 해 1·3·5분 가운데 하나만 고릅니다.',
 `<b>삶 시작</b> ${t('11-14','ok')}: '소중한 것' 설문(밤하늘 5문항, 여러 개) → 고른 것이 행복의 무게를 키웁니다. 태어날 때 나라·사는 곳·형편·성별 4칸을 눌러서 하나씩 멈추는 연출.`,
 `<b>0~5살 안내</b> ${t('11-14','ok')}: 처음 하는 학생을 위한 안내, 5살로 건너뛰기 단추.`,
 `<b>앞으로</b> ${t('확정 방향')}: 교사가 학급 방을 열고 모두가 같은 시간 배율로 진행할 때, 함께 편지를 써 보고 그 시기 다른 삶들의 통계를 보여 주는 수업 도구.`]],
 [`${ub('2-4')} 그림 자원 ${t('1차 완료','ok')}`,[
 '<b>한 화풍의 손그림:</b> 건물·나무·탈것·동물·가구·바닥(아틀라스)과 사건·엔딩의 장면 그림(지역 7곳별, 나이별, 직업·병원·축제·학교·집·결혼·아기 등).',
 `<b>이름 규칙:</b> 장면 종류 + 지역·나이로 그림을 고르고(${c('scArtName')}), 그림이 없으면 예전 도트 그림으로 대신합니다. 장면 속 주인공 성별이 다르면 쓰지 않습니다.`,
 '<b>만드는 방법:</b> 제미나이에서 그림을 만들고 크롬 확장으로 받아 배경을 자른 뒤 아틀라스를 만듭니다.',
 `<b>앞으로</b> ${t('후보')}: 새 장면·지역이 필요할 때 이어서 만들기.`]]],
'<b>맡은 코드:</b> 2-1-world/ · 2-2-talk/ · 2-3-time/ · 2-4-art/, art/ · <b>시험:</b> map, zones, hub, talk, quest, career, flow, tutorial, young')}

${unitCard('3','c3','엔딩·기록 — 삶을 돌아보고 남기기',
'한 삶을 끝까지 산 뒤 "무엇이 이 삶을 만들었나(주어진 것·내가 고른 것·우연)", "무엇을 떠나보내고 무엇을 남겼나", "같은 순간 태어난 다른 사람들은 어땠나"를 스스로 생각해 보고, 학생이 직접 고르고 쓴 것으로 자기 기록을 남긴다. 엔딩은 결론을 대신 내려 주지 않는다.',
[['세부 내용',[
 `<b>엔딩 2판 — 4막 12장</b> ${t('11-12','ok')}: <b>작별</b> ① 마지막 순간 ② 남겨진 사람들의 말 · <b>돌아보기</b> ③ 삶의 길 ④ 주어진 것·고른 것·우연 ⑤ 나의 기억 고르기 ⑥ 고른 장면이 스쳐 감 ⑦ 떠나보낸 것과 남긴 것 · <b>견주어 보기</b> ⑧ 같은 1초에 태어난 사람들(세계 지도·기대수명) ⑨ 숫자로 본 이 삶 · <b>나에게로</b> ⑩ 생각해 보기 ⑪ 나의 한 문장 ⑫ 인생 기록. 어린 나이에 끝난 삶은 8장.`,
 "<b>선생님 결정(11-12):</b> 엔딩은 12장 안팎 · 행복 점수와 결론 문장은 엔딩에서 빼고 기록 메뉴 '돈과 행복'에만 · 일찍 끝난 삶의 '다른 나라에서 태어나 보기'는 기록을 남긴 뒤 화면에서만 제안.",
 '<b>나의 기억 고르기:</b> 어린 시절·청소년·어른·노년에서 고루 뽑은 12개 가운데 3가지와 대표 장면 하나를 고르면, 다음 장에서 그 장면이 스쳐 가고 기록 카드에 남습니다.',
 '<b>기록 메뉴:</b> 한눈에·삶의 모양·돈과 행복·이야기·기억에 남은 일·남긴 말을 위쪽 메뉴로 넘겨 봅니다. 학생과 교사 화면이 같은 자세한 보기를 씁니다.',
 '<b>가로 배치·사진:</b> 컴퓨터·휴대폰 가로에서 한 장이 한 화면에. 기록 카드 사진은 위키미디어 공용 사진(라이선스 표시).',
 `<b>11-15 점검</b> ${t('완료','ok')}: 학생처럼 6~20살을 산 여러 판에서 엔딩 12장까지 넘겨 오류·이상한 글자 없음.`]],
 ['앞으로',[
 `${t('확정 방향')} 학급 방 수업 도구(2-3의 편지·통계)와 연결해, 교사가 엔딩·기록을 수업 활동으로 이어 쓰기.`,
 `${t('후보')} '생각해 보기'에서 고른 답을 반 전체로 모아 보기(예: 가장 크게 바꾼 것 — 주어진 것 18명, 내가 고른 것 7명).`,
 `${t('확인')} 학생 시범 점검에서 12장 흐름의 길이와 질문 난이도 보기.`]]],
`<b>맡은 코드:</b> 3-ending/ (${files['3-ending'].length}조각), css/02 · <b>시험:</b> aendshow, endL, picks, endearly · <b>함께 쓰는 곳:</b> 저장 형식 <code>Life.load</code>, 기록 형식 <code>lifeRecord</code> (바꿀 때는 2 단위와 확인)`)}

${unitCard('4','c4','내용(자료) — 근거 있는 삶의 사건들',
'같은 선택도 나라·형편·직업·나이에 따라 다르게 풀리도록, 실제 자료를 바탕으로 한 사건과 제도를 쌓는다. 학생이 "세상은 이렇게 다르구나"를 사건 하나하나에서 느끼게 한다.',
[['세부 내용',[
 '<b>나라 자료:</b> 193개 나라의 출생 비율, 소득 수준, 도시 인구, 대표 음식·명소·동물·말·돈·명절.',
 '<b>한 해의 달력:</b> 달마다 열 가지 안팎의 일이 찾아옵니다. 나라마다 학년 시작·방학·시험(수능·가오카오·JEE·SAT·아비투어 등)이 다릅니다.',
 '<b>가족과 일:</b> 부모·형제·조부모가 함께 나이 들고, 직업·월급·승진·실직·연금이 나라와 처지에 따라 달라집니다.',
 '<b>진로와 대학·일자리:</b> 흥미 분야 7가지, 대학 네 층(최상위·중상위·지역·전문대), 성적으로 도전·적정·안정을 보여 줍니다.',
 '<b>돈:</b> 월급에서 생활비를 빼고 남은 만큼 모입니다. 집 대출 말고 다른 빚은 한도가 있고, 크게 넘치면 채무 조정.',
 `<b>여섯 능력치와 행복</b> ${t('11-14','ok')}: 건강·관계·경험·지식·기술·재산. 열리는 나이는 0·2·4·7·13·16살. 행복은 이 여섯과 '소중한 것'의 무게에서 나옵니다.`,
 `<b>실제 통계 맞추기</b> ${t('11-15','ok')}: 5살 전·5~19살 사망, 193개국 기대수명, 재해 잦기, 우리나라 월급을 실제 자료에 맞춤(6장).`,
 '<b>삶 엔진:</b> 태어남·나이 듦·선택 처리·저장 불러오기를 맡는 중심 코드. 저장 호환이 걸려 있어 가장 조심해서 고칩니다.']],
 ['앞으로',[
 `${t('후보')} 재해: EM-DAT 나라별 자료를 받아 표를 채우기(지금은 소득 수준으로 묶음).`,
 `${t('후보')} 21살 이후 삶의 세부(지금은 자동 진행 위주).`,
 `${t('후보')} 큰 조각(달력 154KB 등)을 주제별로 나누기.`]]],
`<b>맡은 코드:</b> 4-engine/ 전체 (${files['4-engine'].length}조각) · <b>시험:</b> golden(기준값), aplay(한 삶 끝까지), sim·simp(통계)`)}

<h2>3. 전체 일정의 순서</h2>
<ol>
<li>${t('완료','ok')} 큰 한 파일을 조각으로 나누고, 4개 개발 단위의 경계를 정함 (2026-11-12).</li>
<li>${t('완료','ok')} 엔딩 2판: 여러 삶을 살아 본 점검 → 4막 12장으로 다시 짜고 엔딩 오류를 바로잡음 (11-12).</li>
<li>${t('완료','ok')} 게임 속 이야기 다듬기: 사람 '!' 선택 대화창, 모든 선택지 확률, 진로 이야기와 대학·일자리, 돈 현실화 (11-13).</li>
<li>${t('완료','ok')} 다듬기 3방향: 요소 줄이기와 '소중한 것', 길 찾기와 핵심 장소, 학교 문제 풀기 (11-13~14).</li>
<li>${t('완료','ok')} 0~20살 전면 점검: 여섯 능력치, 미션 넓히기, 0~5살 안내, 여러 삶, 친구 메시지 (11-14).</li>
<li>${t('완료','ok')} 전체 정리와 실제 통계 맞추기: 단위별 폴더, 쓰지 않는 코드 정리, 사망·수명·재해·월급 (11-15).</li>
<li>${t('다음','nx')} <b>학생 시범 점검:</b> 학생 기기에서 로그인 → 새 삶 → 몇 해 진행 → 엔딩까지 확인하고 불편한 점을 모읍니다.</li>
<li>${t('그 뒤')} <b>보안 정리:</b> 교사 입장 코드와 데이터베이스 규칙. (시범 점검 뒤로 미뤄 두었습니다.)</li>
<li>${t('그 뒤')} <b>학급 방 수업 도구:</b> 모두가 같은 속도로 편지를 쓰고 다른 삶의 통계를 비교하는 활동.</li>
<li>${t('계속')} 21살 이후 세부·내용 확장·그림 추가·다듬기를 단위별로 이어 갑니다.</li>
</ol>
<p class="note">정해진 날짜는 아직 없습니다. 수업 일정과 시범 점검 결과에 따라 순서와 범위를 조정합니다.</p>

<h2>4. 개발 방식</h2>
${ul([
 '<b>Claude와 함께:</b> 교사가 기획과 확인을, Claude가 구현을 맡습니다. 저장소는 tmdrl707-png/life8b, 안내서 두 개는 tmdrl707 계정의 것을 기준으로 합니다.',
 '<b>한 채팅 = 한 단위:</b> "2-2 상호작용: 놀이터 미션이 …"처럼 첫 메시지에 단위를 적고 시작하면 필요한 조각만 열어 작업합니다. 단위가 여럿이면 가장 큰 단위 하나로 시작합니다.',
 '<b>토큰 아끼기:</b> 요약이 한 번 일어나면 마무리하고 새 채팅으로 · 채팅 도중에 모델을 바꾸지 않기(바꾸면 처음부터 다시 읽음) · 스크린샷은 꼭 필요할 때만 · 요청은 모아서 번호를 붙여 · "무엇이 어떻게 보였다(나이·나라·화면)"로 알려 주기.',
 `<b>부딪히지 않게:</b> 작업 시작 전과 올리기 직전에 최신 내용을 받아(${c('git pull --rebase')}) 합친 뒤 올립니다. 여러 단위가 함께 쓰는 곳(저장 형식, 기록 형식, 건물 정보, 사건 형식)은 바꾸기 전에 영향받는 단위를 먼저 확인합니다.`,
 `<b>빌드와 배포:</b> 조각을 고친 뒤 ${c('python3 dev/rebuild.py')}로 ${c('index.html')}을 만들어 main에 올리면 GitHub Pages 주소에 반영됩니다. 이름이 겹치거나 문법이 틀리면 빌드가 멈춥니다.`,
 `<b>시험:</b> 단위마다 자동 시험(${c('dev/tests/')})이 있고, 한 삶을 끝까지 살아 보는 시험과 화면 캡처로 확인합니다. 외부 접속 없이 이 기기 저장 방식으로 돕니다.`])}

<h2>5. 알려진 한계와 열린 문제</h2>
${tb(['항목','내용','다루는 단위'],[
 ['<b>실제 기기 확인</b>','시험은 컴퓨터 브라우저(휴대폰 가로 크기 포함)로 했고, 실제 휴대폰·학생 기기로는 아직 확인하지 않았습니다.','1·2-1'],
 ['<b>빈 화면 보고 1건</b>','학생 화면에서 게임 화면이 비어 보인다는 보고가 있었으나 재현하지 못했습니다. 탭을 다시 열 때 다시 그리도록 고쳤고, 다시 나오면 화면과 직전에 한 조작이 필요합니다.','1·2-1'],
 ['<b>새 문장 검토</b>','최근 늘어난 대화·활동 문장, 진로 이야기 대사는 사람이 아직 읽어 보지 않았습니다.','2-2·4'],
 ['<b>재해 자료</b>','나라별 재해 자료를 받지 못해, 표에 없는 나라는 소득 수준으로 묶어 정했습니다.','4'],
 ['<b>월급 차이</b>','대부분 실제와 ±25% 안이지만 독일은 약 20%, 파키스탄은 약 40% 낮습니다. 어른 주인공은 실업 기간이 짧습니다(게임 설계).','4'],
 ['<b>보안</b>','교사 입장 코드와 데이터베이스 규칙은 시범 점검 뒤에 정리하기로 하고 현재는 손대지 않습니다.','1'],
 ['<b>큰 조각</b>','달력(154KB)·그리기(87KB) 조각이 커서 더 나눌 필요가 있습니다.','4·2-1'],
 ['<b>그림 도구 경로</b>',`${c('dev/art-tools')}의 경로가 옛 작업 환경 기준이라 그림 작업을 다시 할 때 고쳐 씁니다.`,'2-4'],
])}
<div class="call"><b>11-15 아침 — 전체 점검 반영.</b>
${ul([
 '<b>정리:</b> 조각을 단위별 폴더 7개로 옮기고 섞인 조각을 나눔. 쓰지 않는 코드 약 32KB를 지움(옛 오각형, 15초 고르기, 확률을 말로 보이기).',
 '<b>확률:</b> 언제나 숫자(%)로 보임. 게임 화면의 작은 오각형은 띄우지 않음.',
 '<b>버그:</b> 용돈이 아주 적은 나라에서 고등학생 재산이 몇만 원 때문에 94까지 튀던 것을 고침.',
 '<b>여러 판 점검:</b> 학생처럼 6~20살을 살고 엔딩까지 — 파란 미션은 해마다 한 해 앞쪽에 오고 거의 다 해냄, 오류 없음.'])}</div>

<h2>6. 실제 통계와 맞추기 <small>(2026-11-15 점검, 나라마다 삶 수백~수천 명을 돌려 비교)</small></h2>
${tb(['항목','기준 자료','게임 결과'],[
 ['5살 전 사망','UN IGME 나라별 값','표본 오차 안 (인도 실제 30 → 게임 32명/1000명). 감염병이 겹친 나라는 감염병 치명률을 줄여 맞춤'],
 ['5~19살 사망','UNICEF 5~24살 사망: 사하라 이남 1000명당 34명, 남아시아 14명','나이지리아 33, 인도 10명/1000명 (전에는 약 2배)'],
 ['기대수명','UN 나라별 기대수명','193개국 모두 보정표 <code>REF_ADJ</code>, 대부분 ±2년 안'],
 ['갑작스러운 사망','—','전체 사망의 8~16%'],
 ['자연재해','EM-DAT: 해마다 평균 약 2억 명 피해','보통 나라 10년에 0.06~0.1번, 피해가 큰 나라(방글라데시·에티오피아 등) 0.3~0.6번'],
 ['월급','통계청 2024 임금근로자 월평균 375만 원, 40대 469만 원','우리나라 보통 월급 375만 원, 게임 속 40대 약 450만 원. 다른 나라는 1인당 국민총소득에서 냄(대체로 ±25%)'],
])}

<h2>7. 관련 문서</h2>
${ul([
 `<b>코드 구조 안내서:</b> 코드 조각 ${total}개의 목록과 단위별로 여는 조각, 요청별로 여는 조각, 이름 겹침 규칙.`,
 `<b>저장소의 ${c('README.md')}와 ${c('CLAUDE.md')}:</b> 기능 설명과 작업 기록, 작업 방법. Claude가 읽는 자세한 메모는 ${c('dev/GUIDE.md')}·${c('dev/PLAN.md')}.`])}`,
'저장소의 dev/guides.js로 만든 페이지');

fs.writeFileSync(path.join(OUT,'guide_code.html'),code);
fs.writeFileSync(path.join(OUT,'guide_plan.html'),plan);
console.log('ok', total+'조각', '감싸기 '+wraps.length, miss.length?'설명 없음 '+miss.length:'');
