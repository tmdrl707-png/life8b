# 80억 분의 1 · 인생 체험 (수업용 웹 게임)

중학교 수학 교사(전주서중)가 수업에서 쓰는 웹 게임. 세계 193개 나라 가운데 실제 출생 비율대로 태어나 한 사람의 삶을 끝까지 산다. **사용자와는 한국어로 대화한다.** 설명은 짧고 쉽게, 일이 끝나면 결과와 확인한 것만 알린다.

- 배포: GitHub Pages `https://tmdrl707-png.github.io/life8b/` (저장소 `tmdrl707-png/life8b`, main 브랜치 루트의 `index.html`). 데이터: Firebase Realtime Database(`life8b/` 경로, 인증 꺼짐).
- 단일 파일 앱이다. **`index.html`은 직접 고치지 않고 `dev/src/`를 고친 뒤 빌드해서 만든다.**
- `README.md`에 기능 설명과 작업 기록이 쌓여 있다. 큰 변경을 하면 거기에 짧게 덧붙인다.

## 작업 방법
```bash
python3 dev/rebuild.py                 # dev/src/*.js 조각을 dev/src/v.html에 끼워 넣고 index.html 생성
python3 -m http.server 8765            # 저장소 맨 위에서. http://localhost:8765/index.html 로 확인
python3 dev/tests/aplay.py KR          # 한 삶을 끝까지 직접 고르며 도는 시험 (나라 코드를 여러 개 줄 수 있음)
python3 dev/tests/aendshow.py          # 엔딩 슬라이드를 모두 넘겨 보는 시험
python3 dev/tests/endL.py x            # 엔딩을 컴퓨터(1366×768)·휴대폰 가로(844×390)로 찍음 → dev/tests/out/
```
시험 스크립트는 Playwright를 쓴다 (`pip install playwright && playwright install chromium`). 외부(https) 요청은 막고 돌리므로 Firebase 없이 **이 기기 저장(localStorage) 방식**으로 동작한다. 로그인·아이디 관리 시험은 `ids.py`가 `Store.fb=false`로 바꿔서 한다.

### 파일 구조
- `dev/src/v.html` — 본체(HTML·CSS·엔진·화면). 가장 크다. 나라 자료(`COUNTRIES`), 사건, 저장소(`Store`), 교사용 모드, 엔딩이 모두 여기 있다.
- `dev/src/stats2.js`(능력치 2판), `new_ev.js`(새 사건), `conv.js`(옛 사건 효과 변환), `ui2.js`(능력치 화면), `hd.js`(고해상도 캐릭터), `ui3.js`(화면 다듬기), `art.js`(제미나이 그림 불러오기), `talk.js`(말 걸기·만져 보기·건물 안·흐르는 시간·저장하기·나의 기록·개발자 모드·오류 알림·휴대폰 화면) — `v.html` 안의 같은 이름의 주석 표시(`/* ========== …`) 자리에 `rebuild.py`가 끼워 넣는다. **이 조각들은 반드시 조각 파일을 고쳐야 한다. `v.html` 안의 그 구간을 직접 고치면 다음 빌드에서 덮어써진다.**
- `art/` — `spr.webp`(건물·나무·탈것·동물·가구 아틀라스), `tex.webp`(바닥 무늬), `atlas.json`(좌표), `sc/*.webp`(장면 그림, 필요할 때만 받음). `ph/` — 엔딩 사진(GitHub Actions가 `ph/list.json`을 보고 받아 옴).
- `dev/art-tools/` — 제미나이 그림에서 스프라이트를 잘라 아틀라스를 만드는 스크립트(`cut.py`, `build.py`). 경로가 옛 작업 환경 기준이라 쓰려면 고쳐야 한다.

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
- 동네 지도(`OUT`, 124×52칸): 나이에 따라 갈 수 있는 범위 `reachOf(age)`, 나머지는 `drawFog`로 가린다. 건물은 `bldList()`(이름 있는 건물 `OUT.b` + 이웃집 `OUT.deco`), 들어갈 수 있는 건물은 `ENTER`, 건물 안 가구·사람은 `PLACE_IN`(talk.js)과 `furnOf(map)`.
- 시간 흐름: 학생은 창이 떠 있어도 `flowTick`이 한 해를 흘려 보낸다. 선택 창은 `DEC`(제한 시간 뒤 저절로). 교사용·개발자·저장하기 창(`G.hardPause`)은 멈춘다. 한 해 길이는 `L.yl`(`secOf`).
- talk.js의 이름은 다른 조각과 겹치면 안 된다(같은 스크립트라 뒤의 것이 덮어쓴다. 예전에 `scImg`가 겹쳐 장면 그림이 깨졌다).
- `Store`: Firebase(REST) 또는 localStorage. 모드 `db`(인증 끔, 아이디·섞은 비밀번호를 `acc/`에 저장), `auth`(Firebase 인증), `local`. 경로: `acc/`, `users/`, `reg/`, `idcfg/closed`, `rooms/<코드>/…`, `tdata/…`.
- 학급 방: 선생님이 열면 반 전체가 같은 나이로 움직인다. 일찍 끝난 학생은 '다른 삶 둘러보기'. 끝난 삶은 `members/<아이디>/past/<시각>`.
- 마친 삶 기록: `lifeRecord()`(요약·오각형 최대·흐름·돈·이야기 표·기억·답) → `lifeDetailHTML()`로 학생·교사 화면에서 펼쳐 본다.
- 장면 그림 이름 규칙은 `art.js`의 `scArtName(kind,L)`: 지역(`life_<지역>_<m|f>`, `farewell_<지역>`), 시골판(`<종류>_r`), 지역판(결혼·아기·학교·집·직업·병원·축제, `SC_VAR`). 집 밖 장면 `town`은 나이 4단계(`town6|13|19|75_<지역>`, `townStage`). 일상·집 밖 장면은 `scVar(kind,문장,나이,L)`이 `'life@end_meal_EA'`처럼 종류 뒤에 그림 이름을 붙여 고른다(엔딩 카드·나의 기록·사건 창 `popup`). 지역 코드: EA·SE·SA·AF·ME·LA·WE(`RG_ART`). 이미지가 없으면 옛 도트 그림으로 대신 나온다.

## 그림 만들기 (제미나이 + Claude in Chrome)
로그인된 제미나이(gemini.google.com)에서 그림을 만들고 Claude in Chrome으로 받는다. 프롬프트는 "warm hand-painted 2D anime film look, soft watercolor, wide 16:9, no text". 스프라이트는 마젠타(#FF00FF) 배경 한 장에 여러 개를 그린 뒤 `cut.py`로 배경을 투명하게 자른다. 이미지 받기는 `blob:` 주소로 읽히는 상태(채팅을 새로 고친 뒤)에서 캔버스로 내보내 **한 번에 한 파일씩** 다운로드한다(크롬이 자동 다중 다운로드를 막는다). 하루 생성 한도에 걸리면 다음에 이어서 한다. 2026-11-12에 학교·집·직업·병원·축제 지역판, 집 밖 장면(나이×지역 28장), 엔딩 일상 장면 25장을 더했다.

## 커밋
커밋 메시지는 한국어로 짧게, 끝에 아래 줄을 붙인다.
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
