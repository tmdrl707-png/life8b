# 80억 분의 1 · 인생 체험 (수업용 웹 게임)

중학교 수학 교사(전주서중)가 수업에서 쓰는 웹 게임. 세계 193개 나라 가운데 실제 출생 비율대로 태어나 한 사람의 삶을 끝까지 산다. **사용자와는 한국어로 대화한다.** 설명은 짧고 쉽게, 일이 끝나면 결과와 확인한 것만 알린다.

- 배포: GitHub Pages `https://tmdrl707-png.github.io/life8b/` (저장소 `tmdrl707-png/life8b`, main 브랜치 루트의 `index.html`). 데이터: Firebase Realtime Database(`life8b/` 경로, 인증 꺼짐).
- 단일 파일 앱이다. **`index.html`은 직접 고치지 않고 `dev/src/`를 고친 뒤 빌드해서 만든다.**
- `README.md`에 기능 설명과 작업 기록이 쌓여 있다. 큰 변경을 하면 거기에 짧게 덧붙인다.

## 작업 방법
```bash
python3 dev/rebuild.py                 # dev/src/template.html에 조각 57개를 끼워 index.html 생성 (+이름 겹침 검사, -v: 감싸기 목록)
python3 -m http.server 8765            # 저장소 맨 위에서. http://localhost:8765/index.html 로 확인
python3 dev/tests/aplay.py KR          # 한 삶을 끝까지 직접 고르며 도는 시험 (나라 코드를 여러 개 줄 수 있음)
python3 dev/tests/aendshow.py          # 엔딩 슬라이드를 모두 넘겨 보는 시험
python3 dev/tests/endL.py x            # 엔딩을 컴퓨터(1366×768)·휴대폰 가로(844×390)로 찍음 → dev/tests/out/
```
시험 스크립트는 Playwright를 쓴다 (`pip install playwright && playwright install chromium`). 외부(https) 요청은 막고 돌리므로 Firebase 없이 **이 기기 저장(localStorage) 방식**으로 동작한다. 로그인·아이디 관리 시험은 `ids.py`가 `Store.fb=false`로 바꿔서 한다.

### 파일 구조 (2026-11-12에 큰 파일 v.html을 조각으로 나눔, 같은 날 밤 54-talk를 단위별로 더 나눔(57개). **v.html은 없다**)
- `dev/src/template.html` — 빈 틀(head·`<style>`·`<script>` 태그). `<!--#include 경로-->` 줄마다 조각이 들어간다. 이 순서가 실행 순서다.
- `dev/src/css/` 4개(01-base, 02-ending, 03-warm, 04-readable — 뒤의 것이 앞을 덮어씀). `html/screens.html` — 모든 화면의 뼈대.
- `dev/src/engine/` 26개 — 화면과 무관한 자료·계산. 01-base(설정·나라 특색), 02-countries(193개국 표), 03-names-places, 04-scenes-base, 10-kr-only, 11-common, 12-regional, 13-jobs, 14-world-map, 15-life-data, 16-result-text, **20-life-class(Life, 저장 호환 — 가장 조심)**, 30-calendar(153KB), 31-family, 32-final-record, 33-institutions, 34-variety, 35-adult-days, 36-country-life2, 37-epidemic, 38-country-events, 39-job-region-events, 40-job-fit, 50-stats2, 51-new-events, 52-convert.
- `dev/src/ui/` 26개 — 화면 동작. 01-common-store(Store), 02-teacher-records(교사 기록·아이디 관리), 03-login-home(로그인·birthReveal·endWide), 04-teacher-mode, 10/11-pixel-art, 12-world-people(동네 지도 OUT·reachOf·ENTER·조작), 20-life-settings(시간 배율), 21-game-flow(진행·사건 창·저장하기), 30-render(그리기·가림막·미니맵), 31-memory-photos, 40-ending(엔딩 슬라이드), 41-start(시작 + lifeRecord·lifeDetailHTML), 50-stats-ui, 51-hd-character, 52-polish, 53-art-loader(그림·scArtName, atlas.json은 빌드 때 끼움), **54-talk(말 걸기·만져 보기·건물 안·학교 밖 활동)**, 55-life-record-menu(인생 기록 위쪽 메뉴), 56-dev-mode(개발자 모드), 57-error-box(오류 알림), 58-time-flow(흐르는 시간·저절로 정해지는 선택·저장하기), 59-hud-style(미니맵·상태란·알림 카드 스타일), 60-end-picks(엔딩 '나의 기록 고르기'), 61-phone-style(휴대폰 가로 스타일), 90-visual-enhancer.
- 번호는 폴더 안의 순서일 뿐이고 실제 순서는 template.html이 정한다. 새 조각을 만들면 template.html에 include 줄을 넣는다.
- 모든 조각은 한 스크립트로 합쳐진다. **맨 바깥 `function 이름`이 두 조각에 있으면 rebuild.py가 멈춘다**(뒤의 것이 앞의 것까지 몰래 덮어써서 예전에 `scImg`로 장면 그림이 깨졌다). 앞 조각의 함수를 일부러 바꿀 때는 `const _x=이름; 이름=function(...){...}` 처럼 감싸고, 감싸는 조각이 뒤에 와야 한다(`python3 dev/rebuild.py -v`로 목록 확인). 예외 `treeSprite`(10번 것은 안 쓰임).
- 휴대폰 가로 화면·대화창·알림 카드 스타일은 css/가 아니라 스크립트가 끼워 넣는다(ui/54·59·61, 52-polish). 54~61은 한 파일이던 talk.js를 순서 그대로 자른 것이라 이름을 공유하고, 순서를 바꾸면 안 된다.
- `art/` — `spr.webp`(건물·나무·탈것·동물·가구 아틀라스), `tex.webp`(바닥 무늬), `atlas.json`(좌표), `sc/*.webp`(장면 그림, 필요할 때만 받음). `ph/` — 엔딩 사진(GitHub Actions가 `ph/list.json`을 보고 받아 옴).
- `dev/art-tools/` — 제미나이 그림에서 스프라이트를 잘라 아틀라스를 만드는 스크립트(`cut.py`, `build.py`). 경로가 옛 작업 환경 기준이라 쓰려면 고쳐야 한다.

## 개발 단위 (채팅 하나에 한 단위씩 맡긴다)
개발 안내서(목표·계획)·코드 구조 안내서(조각 위치) 아티팩트에 자세히 있다. 요약: **1 운영**(로그인·교사용·학생 아이디·개발자 모드: ui/01~04, 56, 57) / **2 게임 진행** — 2-1 세계·화면(ui/10·11·12·30·31·50·51·52·59·61), 2-2 상호작용(ui/54 — 말 걸기·미션 대화·만져 보기·건물 안), 2-3 시간·사건 진행(ui/20·21·58), 2-4 그림(ui/53, art/, dev/art-tools) / **3 엔딩·기록**(ui/40·41·55·60·90, css/02) / **4 내용(자료)**(engine/ 전체). 단위가 함께 쓰는 곳(저장 형식 `Life.load`, 기록 카드 `lifeRecord`, 건물 `OUT`·`ENTER`·`PLACE_IN`, 사건 형식)을 바꿀 때는 영향받는 단위를 먼저 확인한다.

## 꼭 지킬 것 (사용자 결정)
- **본 주소(index.html)에 바로 올린다.** 현재 사이트 버전을 기준으로 고치고, 올리기 전에 `git pull --rebase origin main`을 한다(사진 받기 Actions가 `ph/`에 커밋을 남긴다).
- 보안 정리(교사 코드, Firebase 규칙)는 **학생 시범 점검 뒤에** 하기로 했다. 지금은 손대지 않는다. 학생에게 진짜 비밀번호를 쓰지 말라고 안내하는 중이다.
- 화면은 **컴퓨터와 휴대폰 가로**가 기준이다(엔딩 포함). 휴대폰 세로는 "가로로 돌려 주세요" 안내.
- 로그인은 따로 가입 없이: 처음 쓴 아이디면 그때 비밀번호가 정해지고, 이후는 확인(`Store.login(id,pw,null)`). 학생 아이디는 교사용 모드 '학생 아이디 관리'에서 목록·기록 보기·비밀번호 초기화·삭제·미리 등록·등록 전용을 한다.
- 무거운 장면(죽음·질병 등)은 기본이 '짧고 담담하게'(중학생 수업). 현실 확률은 그대로 둔다. 통계·사건은 실제 자료 위주이고 지어낸 이름은 가상임을 밝힌다.
- 능력치 균형은 "대부분 절반 안팎"으로 정했다(오각형 5축 + 건강·재산 막대).
- 태어날 때 나라·사는 곳·가정 형편·가족 4칸이 차례로 뽑히는 연출(`birthReveal`), 엔딩은 가로 배치(`endWide`).
- 저장된 삶이 예전 형식이어도 이어서 할 수 있어야 한다(`Life.load` 호환). 필드를 바꿀 때 주의.
- 문서·산출물은 PPT·한글(hwpx) 중심 환경이다. 이 프로젝트의 답변은 한국어 평문으로.

## 알아 둘 구조
- 동네 지도(`OUT`, 124×52칸): 나이에 따라 갈 수 있는 범위 `reachOf(age)`, 나머지는 `drawFog`로 가린다. 건물은 `bldList()`(이름 있는 건물 `OUT.b` + 이웃집 `OUT.deco`), 들어갈 수 있는 건물은 `ENTER`, 건물 안 가구·사람은 `PLACE_IN`(ui/54-talk.js)과 `furnOf(map)`.
- 사건이 보이는 방식은 세 가지: 사람과의 일(말 걸기·미션 `openQuest`)은 아래 대화창 `dlgRun`(ui/54), 큰 사건·갈림길·달력 선택은 가운데 팝업 `sheet`, 그 밖의 작은 일은 오른쪽 위 알림 카드 `toast`. 새 사건을 만들 때 이 셋 중 하나에 맞춘다.
- 시간 흐름: 학생은 창이 떠 있어도 `flowTick`이 한 해를 흘려 보낸다. 선택 창은 `DEC`(제한 시간 뒤 저절로). 교사용·개발자·저장하기 창(`G.hardPause`)은 멈춘다. 한 해 길이는 `L.yl`(`secOf`).
- `Store`: Firebase(REST) 또는 localStorage. 모드 `db`(인증 끔, 아이디·섞은 비밀번호를 `acc/`에 저장), `auth`(Firebase 인증), `local`. 경로: `acc/`, `users/`, `reg/`, `idcfg/closed`, `rooms/<코드>/…`, `tdata/…`.
- 학급 방: 선생님이 열면 반 전체가 같은 나이로 움직인다. 일찍 끝난 학생은 '다른 삶 둘러보기'. 끝난 삶은 `members/<아이디>/past/<시각>`.
- 마친 삶 기록: `lifeRecord()`(요약·오각형 최대·흐름·돈·이야기 표·기억·답) → `lifeDetailHTML()`로 학생·교사 화면에서 펼쳐 본다.
- 장면 그림 이름 규칙은 `ui/53-art-loader.js`의 `scArtName(kind,L)`: 지역(`life_<지역>_<m|f>`, `farewell_<지역>`), 시골판(`<종류>_r`), 지역판(결혼·아기·학교·집·직업·병원·축제, `SC_VAR`). 집 밖 장면 `town`은 나이 4단계(`town6|13|19|75_<지역>`, `townStage`). 일상·집 밖 장면은 `scVar(kind,문장,나이,L)`이 `'life@end_meal_EA'`처럼 종류 뒤에 그림 이름을 붙여 고른다(엔딩 카드·나의 기록·사건 창 `popup`). 지역 코드: EA·SE·SA·AF·ME·LA·WE(`RG_ART`). 이미지가 없으면 옛 도트 그림으로 대신 나온다.

## 그림 만들기 (제미나이 + Claude in Chrome)
로그인된 제미나이(gemini.google.com)에서 그림을 만들고 Claude in Chrome으로 받는다. 프롬프트는 "warm hand-painted 2D anime film look, soft watercolor, wide 16:9, no text". 스프라이트는 마젠타(#FF00FF) 배경 한 장에 여러 개를 그린 뒤 `cut.py`로 배경을 투명하게 자른다. 이미지 받기는 `blob:` 주소로 읽히는 상태(채팅을 새로 고친 뒤)에서 캔버스로 내보내 **한 번에 한 파일씩** 다운로드한다(크롬이 자동 다중 다운로드를 막는다). 하루 생성 한도에 걸리면 다음에 이어서 한다. 2026-11-12에 학교·집·직업·병원·축제 지역판, 집 밖 장면(나이×지역 28장), 엔딩 일상 장면 25장을 더했다.

## 커밋
커밋 메시지는 한국어로 짧게, 끝에 아래 줄을 붙인다.
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
