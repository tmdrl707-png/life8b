/* 72-young-ui: 7살이 안 된 아이의 '확실' 표시는 '늘 이렇게 돼요'로 (확실 = 안전하다로 읽히지 않게, 11-14) */
function sureWord(){ const L=G.life; return L&&L.age<7?'늘 이렇게 돼요':'확실'; }
