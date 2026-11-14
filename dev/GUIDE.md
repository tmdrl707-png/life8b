# 코드 구조 안내서 (80억 분의 1 · 인생 체험)

필요한 단위의 절만 읽는다. 예: `grep -n "^## " dev/GUIDE.md` 로 목차를 본 뒤 그 절만 `sed -n '시작,끝p'`.
조각 목록·감싸기는 직접 찾는 편이 빠르다: `python3 dev/rebuild.py -u 2-2`(단위의 조각과 다른 단위를 감싸는 곳), `python3 dev/rebuild.py -w endPeriod`(그 함수의 모든 층).

## 0. 짜임새
- 단일 파일 앱. `dev/src/template.html`의 `<!--#include 경로-->` 줄마다 조각이 끼워져 `index.html`이 된다. **이 줄의 순서가 실행 순서**다.
- 폴더 = 개발 단위. 파일 앞 번호는 예전부터의 순서 번호일 뿐이다.
  `1-ops` 운영 · `2-1-world` 세계·화면 · `2-2-talk` 상호작용 · `2-3-time` 시간·사건 진행 · `2-4-art` 그림 · `3-ending` 엔딩·기록 · `4-engine` 내용(자료·삶 계산) · `css/`·`html/` 함께 씀.
- 모든 조각은 한 스크립트다. 맨 바깥 `function 이름`이 두 곳에 있으면 rebuild.py가 멈춘다. 앞 조각의 함수를 바꿀 때는 감싼다:
  `const _x=이름; 이름=function(...){ ... _x.apply(this,arguments) ... }` 또는 `이름=(old=>function(...){...})(이름)`. 감싸는 조각이 뒤에 와야 한다.
  Life 메서드는 `const P=Life.prototype, _e=P.endPeriod; P.endPeriod=function(){...}`.
- 2026-11-15에 여러 단위가 섞인 조각을 단위별로 나눴다: `41-start`(운영)/`41-start-life-record`(엔딩), `66-play-fixes`(+`-dev`·`-auto`·`-talk`), `69-six`(+`-talk`·`-vow`·`-dev`, 엔진 부분 `4-engine/u69-six-life`), `77-move`(엔진 부분 `u77-move-life`), `78-feedback`(+`-talk`·`-time`). `u`가 붙은 엔진 파일은 화면 쪽 순서 자리에서 실행된다.
- 새 기능은 **그 단위 폴더의 알맞은 파일에** 넣는다. 날짜별 새 조각(예전 78-feedback 같은 모음)은 만들지 않는다. 새 조각이 꼭 필요하면 단위 폴더에 만들고 template.html에 include 줄을 넣는다.
- 저장 형식(`Life.load`)·기록 카드(`lifeRecord`)·건물(`OUT`·`ENTER`·`PLACE_IN`)·사건 형식은 여러 단위가 함께 쓴다. 바꿀 때 영향받는 단위를 먼저 확인한다.

## 1 운영 (1-ops)
- `01-common-store`: `$`·`esc`·`ls`·`G`(게임 상태)·`Store`(Firebase REST 또는 localStorage; 모드 `db`·`auth`·`local`; 경로 `acc/`·`users/`·`reg/`·`idcfg/closed`·`rooms/<코드>/…`·`tdata/…`). 모든 단위가 쓰는 바탕.
- `03-login-home`: 가입 없는 로그인(`Store.login(id,pw,null)`: 처음 쓴 아이디면 그 비밀번호로 정해짐), 계정 홈, 태어나는 연출 `birthReveal`(밤하늘 `body.bnight`), 엔딩 가로 배치 `endWide`.
- `02-teacher-records`·`04-teacher-mode`: 교사용 모드는 '학급 방 운영'과 '체험하기'(나라·시작 나이·시간)만. 학급 방은 반 전체가 같은 나이로 움직이고, 끝난 삶은 `members/<아이디>/past/<시각>`.
- `56-dev-mode`(+`66-play-fixes-dev`·`69-six-dev`): 개발자 모드(코드 필요, `G.tok`). `devStart('play')`, `devSkip`, `devToEnd`. `82-devrec`: '기록·아이디' 탭(학생 아이디 목록·초기화·삭제·미리 등록·등록 전용, 저장된 삶 자세히 보기, 지우기 `Store.adminPatch`).
- `57-error-box` 오류 알림. `71-lives` 아이디 하나에 삶 여러 개(`data.save` 지금 삶, `data.slots` 쉬는 삶, 최대 5). `83-autoresume` 새로고침해도 하던 삶으로(sessionStorage `life8b_play`). `80-friends` 같이 하는 친구 목록·1대1 메시지(`online/`·`dm/`·`inbox/`, 연결 상태 줄 `net`).
- Firebase는 빈 `{}`·`[]`를 저장하지 않는다 → `Life.load`가 `done`·`used`·`hist`·`cur.scenes`·`cur.ml` 등을 되살린다. 감염병 칸은 `epiCur`가 되살린다.

## 2-1 세계·화면 (2-1-world)
- `12-world-people`: 동네 지도 `OUT`(124×52칸), 나이별 갈 수 있는 곳 `reachOf(age)`(9살 위쪽 → 12살 아래 큰길 전 → 15살 큰길 건너 → 18살 아래 큰길 너머 → 어른), 건물 `bldList()`(`OUT.b` + 이웃집 `OUT.deco`), 들어갈 수 있는 건물 `ENTER`.
- `30-render`: 낮은 해상도 버퍼에 그리고 키움. 가림막 `drawFog`, 미니맵 `drawMini`. `10/11-pixel-art`·`51-hd-character`: 사람·건물 그림(지금 쓰는 사람 그림은 51의 매끈한 그림).
- `63-zones`·`68-map2`: 옆 동네(대학가 서·강가 마을 남·산과 숲 북·큰 도시 동, 모두 19살부터). `setZone(z,x,y)`가 `OUT`을 `ZONES[z].data`로 바꿔 끼움. 장소 `SPOTS`(z: W·S·N·E). `77-move`: 이사·자취 `f.res`={z,i,k: family|alone|couple}.
- 상태란·능력치: `69-six`의 `sixHud`(위쪽 동그라미, 시안 A~D), 능력치가 열릴 때 카드 `sixUnlockShow`, '내 정보'의 육각형·행복(`sixInfoBody`·`sixJoyBody`). `78-feedback`: 동그라미 누르면 설명 `openStatInfo`, 미니맵 이름표. `50-stats-ui`: 오각형·막대·그래프(`radarSVG`·`lineChartSVG`, 엔딩도 씀).
- '내 정보' `openInfo(tab)`·'기억' `openMem`(52-polish), 모양은 `85-panel-style`. `81-hub`: 오른쪽 위 '모음' 단추 `#btnHub`(내 정보·기록·메시지·설정·나가기), 설정 패널, 화면 꾸미기 `UI`(localStorage `life8b_ui`, `<html>` 클래스 `ui-ms-*` 등), 알림 자리 `placeToasts`. 옛 단추 줄 `.hbtns`는 숨겨 두고 그 단추(#btnInfo·#btnMem·#btnExit)를 모음 메뉴가 눌러 준다.
- `59-hud-style`·`61-phone-style`: 휴대폰 가로·상태란 스타일(스크립트가 `<style>`을 끼움). `65-wayfind` 길 안내. `76-restore` 탭 복귀 때 그림 다시 그리기.

## 2-2 상호작용 (2-2-talk)
- `54-talk`: 말 걸기·만져 보기·건물 안(`PLACE_IN`, `furnOf(map)`), 대화창 `dlgRun`/`dlgShow`, 미션 `openQuest`(파란 미션 `L.q`). `62-dialog-more`: 사람 '!' 선택·진로 이야기를 대화창으로, 그림 카드, 확률 `dlgPct`.
- 가까운 대상 고르기: 2-3의 `loopBody`가 `targets()`·`near`·`nearExtra`로 정한다. **파란 미션이 일반 상호작용보다 먼저**(78-feedback-talk의 `nearExtra` 감싸기 + loopBody의 미션 우선).
- `64-quiz`·`70-quiz2`: 내 자리 문제(과목 11가지 `QZ2_SUB`, 한 해 6문제까지 능력치). `84-quiz-country`: 국어·역사·사회를 그 나라 이야기로(193개국).
- `67-study-play`: 놀이터·운동장 미니 게임, 가게·식당에서 사기. `69-six-talk`: 상호작용 무게 `tinyGain`·반짝이·어른 놀이 `PLAY_AO`.

## 2-3 시간·사건 진행 (2-3-time)
- `21-game-flow`: `startGame`, 한 해 시작 `beginPeriod`/끝 `endPeriod`, 매 틀 `loopBody`, 가운데 팝업 `sheet`, 작은 알림 `toast`, 확률 표시 `pct`(늘 숫자 %), 미션이 오는 때 `L.cur.qt`(한 해 앞쪽에 냄).
- 사건이 보이는 길은 셋: 사람과의 일 → 아래 대화창(2-2), 큰 사건·갈림길·달력 선택 → 가운데 팝업 `sheet`, 그 밖의 작은 일 → 알림 카드 `toast`.
- `58-time-flow`: 학생은 시간이 계속 흐른다(`flowTick`). 가운데 팝업의 중요한 선택(DEC.mode 'auto')을 고르는 동안만 멈춘다. 고르지 않은 창은 한 해 끝에 `resolveOpen`이 정리. 교사용·개발자·나가기 창(`G.hardPause`)은 멈춤. 한 해 길이 `L.yl`(`secOf`).
- 시작: `69-six-vow`('소중한 것' 설문 `vowOpen`, 고른 것 `L.val.p`), `73-start-simple`(한 해 1·3·5분만), `79-tutorial`(0~5살 안내 `G.opts.tut`, 진행 `L.f.tut`), `74-skip6`(5살로 건너뛰기 단추), `20-life-settings`.
- `72-young-ui` `sureWord`(확실 = '잘될 확률 100%'). `78-feedback-time`: 아플 때 남은 시간, 아파서 쉰 해는 '몸 안 움직임' 벌점 없음.

## 2-4 그림 (2-4-art)
- `53-art-loader`: 아틀라스(`art/spr.webp`·`tex.webp`, 좌표 `art/atlas.json`은 빌드 때 `ART_MAP`으로 끼움), 장면 그림 `art/sc/*.webp`(필요할 때 받음). 그림 이름 `scArtName(kind,L)`, 지역 코드 `RG_ART`(EA·SE·SA·AF·ME·LA·WE), 일상 장면 `scVar`, 돈·아픔 등 `scPick`(노인판 → 지역판 → 나이판 `SC_AGEV`), 나이 맞춤 `scAgeFix`. 그림을 더하면 `SC_ALL`도 고친다.
- `75-sc-sex`: 장면 속 주인공 성별 `SC_SEX`. 그림 만들기: 제미나이 + Claude in Chrome(CLAUDE.md의 '그림 만들기').

## 3 엔딩·기록 (3-ending)
- `40-ending` `finishLife`: 4막 12장(마지막 순간 · 남겨진 말 · 삶의 길 `endPathSVG` · 주어진 것/고른 것/우연 `endCross`·`endChance` · 기억 고르기 · 스쳐 간 장면 · 떠나보낸 것과 남긴 것 `endLossLeft` · 같은 1초 `endMapSVG` · 숫자로 본 이 삶 · 생각해 보기 · 나의 한 문장 · 인생 기록). 일찍 끝난 삶은 기록 뒤 `endOffer`.
- `41-start-life-record` `lifeRecord()`(요약·흐름·돈·이야기·기억·답) → `60-end-picks`의 `lifeDetailHTML`/`lifeSummaryHTML`. `55-life-record-menu` 기록 위쪽 메뉴(행복 점수·그래프는 '돈과 행복'에만). `31-memory-photos` 추억 사진(`ph/`, Actions가 `ph/list.json`을 보고 받음). `90-visual-enhancer` 엔딩 밤하늘.

## 4 내용·삶 계산 (4-engine)
- 자료: `02-countries`(193개국 `COUNTRIES`, `CKEYS`), `03-names-places`, `04-scenes-base`·`10-kr-only`·`11-common`·`12-regional`(장면), `13-jobs`, `14-world-map`, `15-life-data`, `16-result-text`(실패 문장 `tryForm`·`FAIL_TAIL`), `30-calendar`(153KB, 달력 일 `CAL_SIG`), `34~39`(다양한 일·어른의 날·나라별 삶·감염병·나라 사건·직업·지역 사건).
- `20-life-class` **Life(가장 조심)**: `Life.load`(저장 호환), `dump`, `runAuto`, `startPeriod`/`endPeriod`, 돈 `ledger`(꼭 드는 생활비 `ess`, 집 대출 80%, 그 밖의 빚 `debtCap`, 1.8배 넘으면 채무 조정 `f.rehab`).
- 덧붙인 규칙: `50-stats2`, `53-chance`(선택지 확률 `setPd`, 얻는 것이 없으면 '확실'), `54-career`(흥미 `f.dir`, 목표 학과 `f.major`, `careerDue`, 대학 `univMenu`·`myTier`·`majorsFor`), `55-realism`·`57-repeat`(되풀이 한도 `THB`·`festPace`·`SEAS_MAX`·`mjN`, 월급의 나이별 모습 `setJob`), `58-simple`, `59-missions`·`63-missions2`·`66-young3`(나이별 미션, 장소 무게 `QW`), `60-map2`(`workZone`·`spotRoute`), `61-choices`(`majSet`·`majSure`), `62-six`(여섯 능력치 `SIX_AGE`·`moneyIdx`·`valW`/`joyTarget`), `64-young`·`65-young2`(0~20살 문장 바로잡기 `YF`·`RES_VAR`), `66-young3`; 행복 `joyComps`(`SIX_MAX`·`JOY_GAMMA`).
- 새 장면·미션·달력 일은 **목록 맨 뒤에** 더한다(예전 저장의 번호).
- 엔진을 고칠 때: `python3 dev/tests/golden.py save`(고치기 전) → 고친 뒤 `python3 dev/tests/golden.py`. 결과가 바뀌어야 하는 수정이면 다름이 나오는 게 맞고, 정리만 했으면 '같음'이어야 한다.

## 시험 (dev/tests)
- 공통 도우미 `lib.py`: `page(b,phone)`, `dev(pg,'KR',age)`, `teacher(pg,'KR',age)`, `student(pg,id)`, `settle(pg)`, `to_end(pg)`. 화면이 바뀌면 lib.py만 고친다.
- 엔진: `golden.py`(기준값), `sim.py <js>`(sim_money·sim_prob·sim_univ·sim_dir·sim_debt·sim_audit).
- 화면: `aplay.py KR`(한 삶 직접 고르며), `aendshow.py`·`endearly.py`·`endL.py`·`picks.py`(엔딩), `career.py`, `quest.py`, `talk.py`, `map.py`, `zones.py`, `tutorial.py`, `hub.py`, `flow.py`·`flow2.py`(시간 흐름), `ids.py`(로그인·아이디), `devmode.py`, `mobile.py`·`rot.py`·`m1.py`, `roll.py`(태어나는 연출).
- 결과 그림은 `dev/tests/out/`(커밋 안 함). 출력은 짧게: 오류와 핵심 값만 찍는다.
