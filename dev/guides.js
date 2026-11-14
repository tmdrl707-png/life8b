// dev/GUIDE.md(코드 구조 안내서)·dev/PLAN.md(개발 안내서)를 아티팩트로 올릴 HTML로 만든다.
// 사용: node dev/guides.js  → dev/tests/out/guide_code.html, guide_plan.html (그 뒤 Claude가 같은 아티팩트에 다시 올림)
const fs=require('fs'), path=require('path');
const marked=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'marked'));
const H=__dirname, OUT=path.join(H,'tests','out'); fs.mkdirSync(OUT,{recursive:true});
const page=(title,md)=>`<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;800&display=swap">
<style>
:root{--bg:#F7F4EC;--card:#FFFDF8;--fg:#232A35;--mut:#6B6457;--line:#E5DCC9;--acc:#2E3C58;--acc2:#C9821E;--code:#EFE8D8}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#141922;--card:#1C2330;--fg:#E7EAF0;--mut:#A6A08F;--line:#2C3545;--acc:#9DB4E0;--acc2:#E8B25A;--code:#252E3D;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#141922;--card:#1C2330;--fg:#E7EAF0;--mut:#A6A08F;--line:#2C3545;--acc:#9DB4E0;--acc2:#E8B25A;--code:#252E3D;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:16px/1.75 "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 60px}
main{max-width:52rem;margin:0 auto}
h1{font-size:1.75rem;line-height:1.3;margin:0 0 .4em;color:var(--acc);text-wrap:balance}
h1+p{color:var(--mut)}
h2{font-size:1.2rem;margin:2.2em 0 .6em;padding:.45em .8em;background:var(--card);border-left:5px solid var(--acc2);border-radius:8px}
ul{padding-left:1.2em} li{margin:.25em 0} li::marker{color:var(--acc2)}
code{background:var(--code);border-radius:5px;padding:.08em .35em;font-size:.88em;word-break:break-all}
table{border-collapse:collapse;width:100%;background:var(--card);border-radius:10px;overflow:hidden;font-size:.94rem}
.tw{overflow-x:auto} th,td{border-bottom:1px solid var(--line);padding:.5em .7em;text-align:left;vertical-align:top} th{background:var(--code)}
strong{color:var(--acc)} a{color:var(--acc)}
.foot{margin-top:3em;color:var(--mut);font-size:.85rem}
</style></head><body>
<main>${marked.parse(md).replace(/<table>/g,'<div class="tw"><table>').replace(/<\/table>/g,'</table></div>')}
<p class="foot">저장소의 ${title==='코드 구조 안내서'?'dev/GUIDE.md':'dev/PLAN.md'}에서 만든 페이지 · ${new Date().toISOString().slice(0,10)}</p></main></body></html>`;
fs.writeFileSync(path.join(OUT,'guide_code.html'),page('코드 구조 안내서',fs.readFileSync(path.join(H,'GUIDE.md'),'utf8')));
fs.writeFileSync(path.join(OUT,'guide_plan.html'),page('개발 안내서',fs.readFileSync(path.join(H,'PLAN.md'),'utf8')));
console.log('ok', OUT);
