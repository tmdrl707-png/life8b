# 80억 분의 1 · 인생 체험 (수업용 웹 게임)

중학교 수학 교사(전주서중)가 수업에서 쓰는 웹 게임. 세계 193개 나라 가운데 실제 출생 비율대로 태어나 한 사람의 삶을 끝까지 산다. **사용자와는 한국어로 대화한다.** 설명은 짧고 쉽게, 일이 끝나면 결과와 확인한 것만 알린다.

- 배포: GitHub Pages `https://tmdrl707-png.github.io/life8b/` (저장소 `tmdrl707-png/life8b`, main 브랜치 루트의 `index.html`). 데이터: Firebase Realtime Database(`life8b/` 경로, 인증 꺼짐).
- 단일 파일 앱이다. **`index.html`은 직접 고치지 않고 `dev/src/`를 고친 뒤 빌드해서 만든다.**
- `README.md`에 기능 설명과 작업 기록이 쌓여 있다. 큰 변경을 하면 거기에 짧게 덧붙인다.

## 작업 방법
```bash
python3 dev/rebuild.py                 # dev/src/template.html에 조각 78개를 끼워 index.html 생성 (+이름 겹침 검사, -v: 감싸기 목록)
python3 -m http.server 8765            # 저장소 맨 위에서. http://localhost:8765/index.html 로 확인
python3 dev/tests/aplay.py KR          # 한 삶을 끝까지 직접 고르며 도는 시험 (나라 코드를 여러 개 줄 수 있음)
python3 dev/tests/aendshow.py          # 엔딩 슬라이드를 모두 넘겨 보는 시험
python3 dev/tests/endearly.py          # 엔딩 2판 흐름(어린 삶 8장·어른 12장, 남긴 뒤 다른 삶 제안, 답 저장)
python3 dev/tests/career.py KR         # 진로 이야기(12·16·17살)·사람 선택 대화·대학 후보 (phone을 붙이면 휴대폰 가로)
python3 dev/tests/sim.py dev/tests/sim_money.js   # 엔진 계산만 빠르게: 여러 삶의 돈 흐름(sim_prob·sim_univ·sim_dir도 있음)
python3 dev/tests/endL.py x            # 엔딩을 컴퓨터(1366×768)·휴대폰 가로(844×390)로 찍음 → dev/tests/out/
python3 dev/tests/zones.py KR [phone]  # 옆 동네·강가 마을·산과 숲·큰 도시 오가기, 건물 드나들기, 나이 제한
python3 dev/tests/sim.py dev/tests/sim_audit.js   # 여러 삶의 기록 문장 모으기(반복·어색함 점검용, 결과가 큼)
```
시험 스크립트는 Playwright를 쓴다 (`pip install playwright && playwright install chromium`). 외부(https) 요청은 막고 돌리므로 Firebase 없이 **이 기기 저장(localStorage) 방식**으로 동작한다. 로그인·아이디 관리 시험은 `ids.py`가 `Store.fb=false`로 바꿔서 한다.

### 파일 구조 (2026-11-12에 큰 파일 v.html을 조각으로 나눔, 같은 날 밤 54-talk를 단위별로 더 나눔(57개), 11-13에 확률·진로·대화 조각 3개(60개), 같은 날 현실감·옆 동네 조각 3개(63개), 아침에 되풀이 줄이기 조각 1개를 더함(64개), 밤에 단순화·지도·공부·선택지 조각을 더함(73개). **v.html은 없다**)
- `dev/src/template.html` — 빈 틀(head·`<style>`·`<script>` 태그). `<!--#include 경로-->` 줄마다 조각이 들어간다. 이 순서가 실행 순서다.
- `dev/src/css/` 4개(01-base, 02-ending, 03-warm, 04-readable — 뒤의 것이 앞을 덮어씀). `html/screens.html` — 모든 화면의 뼈대.
- `dev/src/engine/` 33개 — 화면과 무관한 자료·계산. 01-base(설정·나라 특색), 02-countries(193개국 표), 03-names-places, 04-scenes-base, 10-kr-only, 11-common, 12-regional, 13-jobs, 14-world-map, 15-life-data, 16-result-text, **20-life-class(Life, 저장 호환 — 가장 조심)**, 30-calendar(153KB), 31-family, 32-final-record, 33-institutions, 34-variety, 35-adult-days, 36-country-life2, 37-epidemic, 38-country-events, 39-job-region-events, 40-job-fit, 50-stats2, 51-new-events, 52-convert, 53-chance(선택지 확률 2판), 54-career(진로 흥미·대학 후보·일자리 후보), 55-realism(주제 간격·횟수, 내 운동, 명절 음식, 작은 선택 '확실', 예전 저장의 달력), 56-zone-places(옆 동네 지도의 장소·장면·미션), 58-simple(성향 제거: 계산은 나이별 평균값), 59-missions(나이별 미션·집 안 가족 미션·장소 자리표·대학 형편), 60-map2(고등학교·대학교 장소, 일터 지도 `workZone`, 장소 갈래 `spotRoute`, 놀러 가 보렴 미션), 61-choices(자주 나오는 큰 사건 선택지 다시 쓰기 `majSet`·`majSure`, 확실한 선택), 63-missions2(나이별 미션 장소 무게 `QW`: 집 → 동네 → 큰길 너머 → 동네 밖), 64-young(0~20살 문장 바로잡기 `YF`: 아이에게 맞지 않는 '출근·회사·운전' 등, 살아 있는 조부모, 아기 때 일, 아이의 돈 드는 일은 집 살림 `w`로), 65-young2(되풀이 결과 문장의 다른 표현 `RES_VAR`, 대유행 학교 닫힘은 한 유행에 한 번·다시 온 유행은 '또', 학교 못 다니는 아이 미션 req `nosch`, 0~5살 집 안 사건·미션), 62-six(여섯 능력치: 열리는 나이 `SIX_AGE`·재산 `moneyIdx`·행복 무게 `valW`/`joyTarget`·고등학생 용돈 `f.sv`), 57-repeat(명절·학교 행사·큰 갈림길 횟수, 대유행 문장, 쉬운 선택 '확실', 낱말 바로잡기, 운동선수 은퇴·지도자, 월급의 나이별 모습, 장면 종류 분류 `sceneKindOf`).
- `dev/src/ui/` 36개 — 화면 동작. 01-common-store(Store), 02-teacher-records(교사 기록·아이디 관리), 03-login-home(로그인·birthReveal·endWide), 04-teacher-mode, 10/11-pixel-art, 12-world-people(동네 지도 OUT·reachOf·ENTER·조작), 20-life-settings(시간 배율), 21-game-flow(진행·사건 창·저장하기), 30-render(그리기·가림막·미니맵), 31-memory-photos, 40-ending(엔딩 슬라이드), 41-start(시작 + lifeRecord·lifeDetailHTML), 50-stats-ui, 51-hd-character, 52-polish, 53-art-loader(그림·scArtName, atlas.json은 빌드 때 끼움), **54-talk(말 걸기·만져 보기·건물 안·학교 밖 활동)**, 55-life-record-menu(인생 기록 위쪽 메뉴), 56-dev-mode(개발자 모드), 57-error-box(오류 알림), 58-time-flow(흐르는 시간·저절로 정해지는 선택·저장하기), 59-hud-style(미니맵·상태란·알림 카드 스타일), 60-end-picks(엔딩 '나의 기록 고르기'), 61-phone-style(휴대폰 가로 스타일), 62-dialog-more(사람 '!' 선택·진로 이야기를 대화창으로, 대화창 그림 카드), 63-zones(옆 동네 지도: OUT 바꿔 끼우기·문·화살표), 64-quiz(내 자리 수학 문제·도서관 상식 문제), 65-wayfind(길 안내·갈 수 있는 곳 목록), 66-play-fixes(화면 떨림 뒤 손질: 개발자 창 자리·미니맵 따라 움직이기·건물 안 미션·저절로 고를 때 '확실'), 67-study-play(미니 게임·사기·내 자리 이름표), 68-map2(고등학교·대학가·큰 도시 일터 배치), 69-six(능력치 위쪽 표시 시안 A~D·'새로 알게 된 것' 카드·삶 시작 전 설문 `vowOpen`·상호작용 무게 `tinyGain` 감싸기·반짝이·손 놓은 능력치 감소·내 정보 육각형), 70-quiz2(과목 11가지·이어 풀기·한 해 6문제까지 능력치), 71-lives(아이디 하나에 여러 삶: `data.save`=지금 삶, `data.slots`=쉬는 삶, 최대 5개), 72-young-ui(`sureWord`: '확실' 표시 낱말, 지금은 나이와 상관없이 '확실'), 73-start-simple(시작 화면은 플레이 시간 3가지만: 한 해 1·3·5분, 나머지 설정은 고정), 74-skip6(2~5살 '6살로 가기' 단추), 75-sc-sex(장면 그림의 성별 태그 `SC_SEX`: 안 맞으면 대체 그림이나 옛 도트 그림), 76-restore(탭을 닫았다 다시 열었을 때 바닥·그림이 비는 것 막기), 77-move(이사·자취: `f.res`={z 지도,i 이웃집 번호,k family|alone|couple}, 지도의 `home` 건물이 getter라 문이 옮겨 감, 집 안 미니맵 가족 표시), 78-feedback(11-14 개발자 피드백 모음: 상태란 투명·짧은 시간 막대, 내 정보 글씨 통일, 위쪽 능력치 동그라미 누르면 설명 `openStatInfo`, 미션이 일반 말 걸기보다 먼저(`nearExtra` 감싸기), 0살 안내, 아플 때 남은 시간, 아파서 쉰 해는 '몸 안 움직임' 벌점 없음, 실내 미니맵 이름표), 79-tutorial(0~5살 처음 안내: 시작 화면 `G.opts.tut` 1 안내·0 건너뛰기(바로 6살), 0살 조작·대화·메뉴·시간·능력치·건강 → 1~4살 저절로 → 5살 관계·경험·미션·미니맵·6살부터 집 밖, 한 곳만 밝히는 안내 카드 `#tut`, 진행 `L.f.tut` 1·2·3, 학급 방은 나이 건너뛰기 없이 안내만), 80-friends(오른쪽 위 파란 말풍선 단추 `#btnFr` → 지금 플레이 중인 친구 목록·1대1 메시지, `online/`·`dm/`·`inbox/`, 탭 줄 `FR_TABS`에 나중에 화면·개인 설정·게임 속도 3단계를 더할 자리), 81-hub(오른쪽 위 네 칸 그림 '모음' 단추 `#btnHub` → 메시지·설정(톱니바퀴 `#btnSet`)이 펼쳐짐, 새 메뉴는 `item(이름,단추)`로 더함. 설정 패널: 게임 속도 1·3·5분(지금 해에도 적용)·글 시간·확률 표시·능력치 모양·화면 투명도 `--hudA`·글씨 크기. 미니맵 뺀 상자 반투명, 알림 카드는 상태란 오른쪽 `placeToasts`), 90-visual-enhancer.
- 번호는 폴더 안의 순서일 뿐이고 실제 순서는 template.html이 정한다. 새 조각을 만들면 template.html에 include 줄을 넣는다.
- 모든 조각은 한 스크립트로 합쳐진다. **맨 바깥 `function 이름`이 두 조각에 있으면 rebuild.py가 멈춘다**(뒤의 것이 앞의 것까지 몰래 덮어써서 예전에 `scImg`로 장면 그림이 깨졌다). 앞 조각의 함수를 일부러 바꿀 때는 `const _x=이름; 이름=function(...){...}` 처럼 감싸고, 감싸는 조각이 뒤에 와야 한다(`python3 dev/rebuild.py -v`로 목록 확인). 예외 `treeSprite`(10번 것은 안 쓰임).
- 휴대폰 가로 화면·대화창·알림 카드 스타일은 css/가 아니라 스크립트가 끼워 넣는다(ui/54·59·61, 52-polish). 54~61은 한 파일이던 talk.js를 순서 그대로 자른 것이라 이름을 공유하고, 순서를 바꾸면 안 된다.
- `art/` — `spr.webp`(건물·나무·탈것·동물·가구 아틀라스), `tex.webp`(바닥 무늬), `atlas.json`(좌표), `sc/*.webp`(장면 그림, 필요할 때만 받음). `ph/` — 엔딩 사진(GitHub Actions가 `ph/list.json`을 보고 받아 옴).
- `dev/art-tools/` — 제미나이 그림에서 스프라이트를 잘라 아틀라스를 만드는 스크립트(`cut.py`, `build.py`). 경로가 옛 작업 환경 기준이라 쓰려면 고쳐야 한다.

## 개발 단위 (채팅 하나에 한 단위씩 맡긴다)
개발 안내서(목표·계획)·코드 구조 안내서(조각 위치) 아티팩트에 자세히 있다. 요약: **1 운영**(로그인·교사용·학생 아이디·개발자 모드: ui/01~04, 56, 57) / **2 게임 진행** — 2-1 세계·화면(ui/10·11·12·30·31·50·51·52·59·61·63), 2-2 상호작용(ui/54·62 — 말 걸기·미션·사람 선택·진로 이야기 대화·만져 보기·건물 안), 2-3 시간·사건 진행(ui/20·21·58), 2-4 그림(ui/53, art/, dev/art-tools) / **3 엔딩·기록**(ui/40·41·55·60·90, css/02) / **4 내용(자료)**(engine/ 전체). 단위가 함께 쓰는 곳(저장 형식 `Life.load`, 기록 카드 `lifeRecord`, 건물 `OUT`·`ENTER`·`PLACE_IN`, 사건 형식)을 바꿀 때는 영향받는 단위를 먼저 확인한다.

## 꼭 지킬 것 (사용자 결정)
- **본 주소(index.html)에 바로 올린다.** 현재 사이트 버전을 기준으로 고치고, 올리기 전에 `git pull --rebase origin main`을 한다(사진 받기 Actions가 `ph/`에 커밋을 남긴다).
- 보안 정리(교사 코드, Firebase 규칙)는 **학생 시범 점검 뒤에** 하기로 했다. 지금은 손대지 않는다. 학생에게 진짜 비밀번호를 쓰지 말라고 안내하는 중이다.
- 화면은 **컴퓨터와 휴대폰 가로**가 기준이다(엔딩 포함). 휴대폰 세로는 "가로로 돌려 주세요" 안내.
- 로그인은 따로 가입 없이: 처음 쓴 아이디면 그때 비밀번호가 정해지고, 이후는 확인(`Store.login(id,pw,null)`). 학생 아이디는 교사용 모드 '학생 아이디 관리'에서 목록·기록 보기·비밀번호 초기화·삭제·미리 등록·등록 전용을 한다.
- 무거운 장면(죽음·질병 등)은 기본이 '짧고 담담하게'(중학생 수업). 현실 확률은 그대로 둔다. 통계·사건은 실제 자료 위주이고 지어낸 이름은 가상임을 밝힌다.
- 능력치 균형은 "대부분 절반 안팎"으로 정했다. 11-14부터 능력치는 건강·관계·경험·지식·기술·재산 여섯(육각형)이고 행복은 이 여섯에서 나오는 마지막 값. 도구·바탕 같은 설명은 학생에게 보이지 않는다(뒤쪽 계산만). 열리는 차례: 건강 0·관계 2·경험 4(집 안) → 지식 7(초등) → 기술 13(중학교) → 재산 16(고등학교, 처음엔 용돈 모으기).
- 삶을 시작할 때 '소중한 것' 설문(밤하늘 화면 5문항, 여러 개 고르기)을 하고, 고른 것(`L.val.p`)이 행복의 무게를 키운다. 상호작용(집·동네의 사람·동물·물건)이 관계·경험·지식·기술을 넉넉히 움직이게 했다(교실에서는 한 해를 길게 잡음).
- 태어날 때 나라·사는 곳·가정 형편·성별 4칸을 화면을 눌러 하나씩 멈추는 연출(`birthReveal`). 태어나는 화면은 첫 화면과 같은 밤하늘 디자인(`body.bnight`, 그림 `art/sc/town6_<지역>`), 엔딩은 가로 배치(`endWide`).
- 저장된 삶이 예전 형식이어도 이어서 할 수 있어야 한다(`Life.load` 호환). 필드를 바꿀 때 주의.
- 문서·산출물은 PPT·한글(hwpx) 중심 환경이다. 이 프로젝트의 답변은 한국어 평문으로.

## 알아 둘 구조
- 옆 동네 지도(ui/63·68): 우리 동네 가장자리 길 → 옆 동네 대학가(서)·강가 마을(남)·산과 숲(북)·큰 도시(동, 탈것) — 모두 어른(19살)부터. 대학생의 '학교'(spot `mid`)는 대학가의 `univ`, 고등학생은 `high`(spotRoute). 도시 일의 일터 `work`는 큰 도시에(`workZone`), 농사·가축·고기잡이·광산은 우리 동네. `W.zone`, `setZone(z,x,y)`가 `OUT`의 내용을 `ZONES[z].data`로 바꿔 끼운다. 그 지도의 장소는 `SPOTS`의 z가 W·S·N·E, `SPOT_ZONE`. 새 장면·미션·달력 일은 **목록 맨 뒤에** 더한다(예전 저장의 번호, `CAL_SIG`).
- 동네 지도(`OUT`, 124×52칸): 나이에 따라 갈 수 있는 범위 `reachOf(age)`(9살 위쪽 → 12살 아래 큰길 전까지 → 15살 큰길 건너 → 18살 아래 큰길 너머 → 어른), 나머지는 `drawFog`로 가린다. 건물은 `bldList()`(이름 있는 건물 `OUT.b` + 이웃집 `OUT.deco`), 들어갈 수 있는 건물은 `ENTER`, 건물 안 가구·사람은 `PLACE_IN`(ui/54-talk.js)과 `furnOf(map)`.
- 사건이 보이는 방식은 세 가지: 사람과의 일(말 걸기·미션 `openQuest`·사람이 나오는 '!' 선택·진로 이야기)은 아래 대화창 `dlgRun`(ui/54·62), 큰 사건·갈림길·달력 선택은 가운데 팝업 `sheet`, 그 밖의 작은 일은 오른쪽 위 알림 카드 `toast`. 새 사건을 만들 때 이 셋 중 하나에 맞춘다.
- 시간 흐름: 가운데 팝업의 중요한 선택(큰 사건·갈림길·달력, DEC.mode 'auto')을 고르는 동안은 멈추고, 대화·미션·작은 일 창은 계속 흐른다. 학생은 창이 떠 있어도 `flowTick`이 한 해를 흘려 보낸다. 선택 창의 '15초 안에 고르기'는 11-14에 없앴다(`DEC_TIMED=false`, 창은 한 해가 끝날 때 저절로 정리). 교사용·개발자·저장하기 창(`G.hardPause`)은 멈춘다. 한 해 길이는 `L.yl`(`secOf`).
- `Store`: Firebase(REST) 또는 localStorage. 모드 `db`(인증 끔, 아이디·섞은 비밀번호를 `acc/`에 저장), `auth`(Firebase 인증), `local`. 경로: `acc/`, `users/`, `reg/`, `idcfg/closed`, `rooms/<코드>/…`, `tdata/…`.
- 학급 방: 선생님이 열면 반 전체가 같은 나이로 움직인다. 일찍 끝난 학생은 '다른 삶 둘러보기'. 끝난 삶은 `members/<아이디>/past/<시각>`.
- 엔딩(ui/40 `finishLife`)은 4막 12장: 마지막 순간 · 남겨진 말 · 삶의 길(`endPathSVG`) · 주어진 것/고른 것/우연(`endCross`·`endChance`) · 기억 고르기(ui/60 `pickCands`, 시기별) · 스쳐 간 장면 · 떠나보낸 것과 남긴 것(`endLossLeft`) · 같은 1초(`endMapSVG`) · 숫자로 본 이 삶 · 생각해 보기 · 나의 한 문장 · 인생 기록. 행복 점수·그래프는 기록 메뉴(ui/55 '돈과 행복')에만 둔다(선생님 결정). 일찍 끝난 삶의 다시 태어나기는 기록 뒤 `endOffer`.
- 선택지 확률(engine/53): 같은 장면 안에서 쉬운 길·어려운 길이 넉넉히 벌어지게(`setPd`), 얻는 것이 없는 선택은 '확실'. 표시는 기본 숫자(%) — `probMode`(0 숨김·1 높음/보통/낮음·2 숫자).
- 진로(engine/54): 흥미 분야 `f.dir`(DIRS 7가지)·목표 학과 `f.major`. 진로 이야기 단계 `careerDue`(1 부모님 12~14 · 2 진로 상담 15~17 · 3 진학 상담 17~18), 놓치면 오각형으로 `ensureDir`. 19살 대학 `univMenu`: 성적 `acadQ`로 알맞은 층 `myTier`(0 최상위·1 중상위·2 지역 4년제·3 2년제, 합격선 `UT_NEED`)를 정하고 도전(한 층 위)·적정(관심 계열 둘 `dirPair`)·안정(한 층 아래). 학과는 `majorsFor`가 성적에 맞는 것만(`MAJ_MD`·`MAJ_ABS`, 의예과는 최상위만). 2년제는 `f.jc`, 일자리 `jobMenu`에 흥미 분야의 일을 더함.
- 게임 화면의 작은 오각형(ui/52 `renderMiniRad`)은 11-13부터 띄우지 않는다(선생님 결정). 위쪽 능력치 표시는 ui/69 `sixHud`(기본 B 동그라미, 시안 A~D), 내 정보는 M1(육각형+카드), 육각형은 내 정보 '삶의 모양'에서.
- 되풀이 한도(engine/55 `THB`, engine/57): 명절 장면 한 해 둘·한 삶 26번(나이에 맞춰 `festPace`), 해마다 오는 학교·계절 일 3번(`SEAS_MAX`), 그 밖의 달력 일 3번, 되풀이되는 큰 갈림길 2번(`mjN`). 실패 문장은 고른 행동을 '~하려 했지만'으로(engine/16 `tryForm`·`FAIL_TAIL`). 장면 그림은 ui/53 `scAgeFix`가 문장·나이·하는 일에 맞춰 바꾼다.
- 돈(engine/20 `ledger`): 꼭 드는 생활비(`ess`) 아래로는 줄이지 못하고, 그보다 벌면 버는 만큼에 맞춰 산다. 집 대출(집값의 80%)과 그 밖의 빚을 나누고, 그 밖의 빚은 `debtCap`(보통 연봉 1~1.5년치)까지. 한도의 1.8배를 넘으면 한 번 채무 조정(`f.rehab`). 월급은 첫 일에서 경력 계수(사무·돌봄 0.7부터)로 낮게 시작해 오른다(engine/57 `setJob` 감싸기) — 일하는 사람 가운데 값이 보통 월급의 20대 0.7배·40대 1.0배·50대 1.1배.
- 마친 삶 기록: `lifeRecord()`(요약·오각형 최대·흐름·돈·이야기 표·기억·답) → `lifeDetailHTML()`로 학생·교사 화면에서 펼쳐 본다.
- 장면 그림 이름 규칙은 `ui/53-art-loader.js`의 `scArtName(kind,L)`: 지역(`life_<지역>_<m|f>`, `farewell_<지역>`), 시골판(`<종류>_r`), 지역판(결혼·아기·학교·집·직업·병원·축제, `SC_VAR`). 집 밖 장면 `town`은 나이 4단계(`town6|13|19|75_<지역>`, `townStage`). 일상·집 밖 장면은 `scVar(kind,문장,나이,L)`이 `'life@end_meal_EA'`처럼 종류 뒤에 그림 이름을 붙여 고른다(엔딩 카드·나의 기록·사건 창 `popup`). 돈·아픔·친구·여행·운동·무대·실직·수확·졸업·학교 못 감·반려동물·재난(홍수·가뭄·폭풍·산불)은 `scPick`이 (60살 이상이면 지역 노인판 `<종류>_old_<지역>`) → 지역판(`<종류>_<지역>`) → 나이판(`SC_AGEV`, 예 `money_old`) 순으로 고른다. 그림을 더하면 `SC_ALL` 목록도 고친다. 지역 코드: EA·SE·SA·AF·ME·LA·WE(`RG_ART`). 동아시아는 재난 7종(홍수·태풍·지진·폭염·한파·산불·가뭄)만 `_EA` 지역판이 있다. 이미지가 없으면 옛 도트 그림으로 대신 나온다.

## 그림 만들기 (제미나이 + Claude in Chrome)
로그인된 제미나이(gemini.google.com)에서 그림을 만들고 Claude in Chrome으로 받는다. 프롬프트는 "warm hand-painted 2D anime film look, soft watercolor, wide 16:9, no text". 스프라이트는 마젠타(#FF00FF) 배경 한 장에 여러 개를 그린 뒤 `cut.py`로 배경을 투명하게 자른다. 이미지 받기는 `blob:` 주소로 읽히는 상태(채팅을 새로 고친 뒤)에서 캔버스로 내보내 **한 번에 한 파일씩** 다운로드한다(크롬이 자동 다중 다운로드를 막는다). 하루 생성 한도에 걸리면 다음에 이어서 한다. 2026-11-12에 학교·집·직업·병원·축제 지역판, 집 밖 장면(나이×지역 28장), 엔딩 일상 장면 25장을 더했다.

## 커밋
커밋 메시지는 한국어로 짧게, 끝에 아래 줄을 붙인다.
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
