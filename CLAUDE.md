# 80억 분의 1 · 인생 체험 (수업용 웹 게임)

중학교 수학 교사(전주서중)가 수업에서 쓰는 웹 게임. 세계 193개 나라 가운데 실제 출생 비율대로 태어나 한 사람의 삶을 끝까지 산다. **사용자와는 한국어로, 짧고 쉽게.** 일이 끝나면 결과와 확인한 것만 알린다.

- 배포: GitHub Pages `https://tmdrl707-png.github.io/life8b/` (저장소 `tmdrl707-png/life8b`, main 루트의 `index.html`). 데이터: Firebase Realtime Database(`life8b/`, 인증 꺼짐).
- **`index.html`은 직접 고치지 않는다.** `dev/src/`의 조각을 고치고 `python3 dev/rebuild.py`로 만든다.
- 코드 위치·구조: **`dev/GUIDE.md`(코드 구조 안내서)** — 통째로 읽지 말고 필요한 단위의 절만. 목표·결정·일하는 방법: `dev/PLAN.md`(개발 안내서).
- 사용자가 보는 안내서 아티팩트(tmdrl707 소유, 이것만 기준): 코드 구조 안내서 `ba04f801-9396-4f76-b9cd-28b83fb1b9fc`, 개발 안내서 `89c0a939-b445-47d4-812e-9c7771c418b3`. 모양은 처음 안내서(번호 절·주황 머리 표·단위 색·단위 카드)를 따른다. 내용은 `dev/guides.js` 안에 있다(조각 목록 크기·감싸기는 dev/src에서 자동, 조각 설명은 `DESC`). 조각을 더하거나 계획이 바뀌면 guides.js를 고치고 `node dev/guides.js`(설명 없는 조각 경고 확인) 뒤 `dev/tests/out/guide_code.html`·`guide_plan.html`을 같은 아티팩트에 다시 올린다(get_artifact로 version 확인 → publish_files에 slug·base_version).
- `README.md`는 기능 설명과 작업 기록. 큰 변경을 하면 한 줄 덧붙인다.

## 폴더 = 개발 단위 (채팅 하나에 한 단위씩)
`dev/src/` 아래 `1-ops` 운영 · `2-1-world` 세계·화면 · `2-2-talk` 상호작용 · `2-3-time` 시간·사건 · `2-4-art` 그림 · `3-ending` 엔딩·기록 · `4-engine` 내용·삶 계산 · `css/`·`html/`.
- 실행 순서는 `dev/src/template.html`의 include 줄 순서. 새 조각을 만들면 그 단위 폴더에 두고 include 줄을 넣는다(날짜별 '모음' 조각은 만들지 않는다).
- `python3 dev/rebuild.py -u 2-2` → 그 단위의 조각 목록·다른 단위를 감싸는 곳. `python3 dev/rebuild.py -w 이름` → 그 함수·Life 메서드를 정의·감싸는 모든 곳(실행 순서대로). 파일을 찾을 때는 이것과 grep을 먼저 쓴다.
- 맨 바깥 `function 이름`이 두 조각에 있으면 빌드가 멈춘다. 앞 조각의 함수를 바꿀 때는 `const _x=이름; 이름=function(...){...}`로 감싸고, 감싸는 조각이 뒤에 온다.

## 일을 시작하기 전에 (사용자 결정 2026-11-15)
- 요청을 받으면 코드를 열기 전에 **한 번 확인**한다: "단위: 2-2 상호작용 · 열 조각: 54-talk, 62-dialog-more · 같이 볼 곳: 없음(또는 2-3)" 처럼 3줄 안으로 알리고 사용자가 맞다고 하면 시작한다. 단위는 첫 줄에 적어 주지 않아도 요청 내용으로 직접 판단한다.
- 화면만 고치는지 계산(엔진)까지 건드리는지 함께 적는다. 단위가 둘 이상 섞이면 가장 큰 단위 하나만 하고 나머지는 새 채팅으로 넘기자고 제안한다.
- 일이 끝나면 실제로 연 조각 수를 한 줄로 알린다(예: "열어 본 조각 3개").

## 작업 방법
```bash
python3 dev/rebuild.py                 # index.html 만들기 (+이름 겹침 검사)
python3 -m http.server 8765            # 저장소 맨 위에서 (시험 전에 띄움)
python3 dev/tests/golden.py save       # 엔진을 고치기 전 기준값 저장 → 고친 뒤 python3 dev/tests/golden.py (정리만 했으면 '같음')
python3 dev/tests/aplay.py KR          # 한 삶을 끝까지 직접 고르며
python3 dev/tests/endearly.py          # 엔딩 흐름 / aendshow.py 엔딩 장 넘기기 / endL.py x 엔딩 화면 찍기
python3 dev/tests/career.py KR         # 진로·대학 / quest.py 미션 / talk.py 말 걸기 / zones.py 옆 동네 / tutorial.py / hub.py
python3 dev/tests/sim.py dev/tests/sim_money.js   # 엔진 계산만 (sim_prob·sim_univ·sim_dir·sim_audit)
```
- 시험은 Playwright로 외부 요청을 막고 이 기기 저장(localStorage)으로 돈다. 시작 방법은 `dev/tests/lib.py`(dev·teacher·student·settle)에 모여 있어 화면이 바뀌면 거기만 고친다. 결과 그림은 `dev/tests/out/`(커밋 안 함).
- 토큰 아끼기: 큰 파일(예: 4-engine/30-calendar 153KB)은 grep으로 필요한 줄만. 시험 출력은 짧게. 스크린샷은 꼭 필요할 때만, 한 번에 모아서.

## 꼭 지킬 것 (사용자 결정, 자세히는 dev/PLAN.md)
- **본 주소(index.html)에 바로 올린다.** 올리기 전에 `git pull --rebase origin main`(사진 받기 Actions가 `ph/`에 커밋), 다시 빌드, 푸시, `git ls-remote origin main`이 HEAD와 같은지 확인.
- 보안 정리(교사 코드, Firebase 규칙)는 학생 시범 점검 뒤에. 지금은 손대지 않는다.
- 화면 기준은 컴퓨터와 휴대폰 가로(엔딩 포함). 휴대폰 세로는 "가로로 돌려 주세요".
- 무거운 장면은 짧고 담담하게. 현실 확률은 그대로. 실제 자료 위주, 지어낸 이름은 가상임을 밝힌다.
- 저장된 예전 삶도 이어서 할 수 있어야 한다(`Life.load` 호환). 새 장면·미션·달력 일은 목록 맨 뒤에.
- 지금 초점은 0~20살과 엔딩.
- 문서·산출물은 PPT·한글(hwpx) 중심 환경. 이 프로젝트의 답변은 한국어 평문으로.

## 그림 만들기 (제미나이 + Claude in Chrome)
로그인된 제미나이에서 만들고 Claude in Chrome으로 받는다. 프롬프트 "warm hand-painted 2D anime film look, soft watercolor, wide 16:9, no text". 스프라이트는 마젠타(#FF00FF) 배경에 여러 개 → `dev/art-tools/cut.py`(경로는 옛 환경 기준이라 고쳐 써야 함). 받기는 `blob:` 이미지를 캔버스로 내보내 **한 번에 한 파일씩**. 그림을 더하면 `2-4-art/53-art-loader.js`의 `SC_ALL`도 고친다.

## 커밋
한국어로 짧게, 끝에:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
