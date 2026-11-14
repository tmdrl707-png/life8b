/* 75-sc-sex: 장면 그림 속 주인공의 성별이 이 삶과 다르면 쓰지 않는다 (11-14 선생님 요청: "성별에 따른 이미지가 안 맞는 경우가 너무 많다")
   art/sc 그림을 하나씩 보고, 한 사람이 뚜렷하게 주인공인 그림에만 성별(m·f)을 적었다(가족·무리 그림은 적지 않음 = 누구에게나 맞음).
   - 일상(life@end_…) 그림은 성별이 맞는 비슷한 그림으로 바꾼다.
   - 그 밖의 그림(집 밖 town·돈·학교 못 감·반려동물 …)은 맞는 그림이 없으면 예전 도트 그림(성별 없는 풍경)으로 대신한다.
   새 그림을 더하면 여기에도 성별을 적는다. */
const SC_SEX={};
const scTag=(s,names)=>names.split(/\s+/).forEach(n=>{ if(n) SC_SEX[n]=s; });
scTag('m',`town town13_SA town13_AF town13_LA town19_EA town19_SE town19_SA town19_ME town19_AF town19_LA town19_WE
  town75_EA town75_SE town75_SA town75_ME town75_LA town75_WE money_young pet pet_SA pet_ME noschool noschool_SE noschool_SA noschool_LA
  sick_adult sick_old sport_teen travel travel_train job jobloss jobloss_SA jobloss_ME jobloss_LA money_old_SE money_old_SA money_old_ME
  friend_ME friend_old_ME friend_old_SA end_garden end_bench end_fishing end_study_night end_rain_window`);
scTag('f',`town13_SE town13_ME town75_AF money_old money_old_AF money_old_LA money_old_WE noschool_ME noschool_AF pet_WE
  jobloss_SE jobloss_AF jobloss_WE end_videocall`);
// 일상 그림 가운데 성별이 안 맞을 때 대신 쓸 비슷한 그림 (누구에게나 맞는 것)
const SC_SEXALT=a=>a<13?'end_playground':a<30?'end_friends':a<60?'end_neighbors':'end_album';
(function(){ const _n=scArtName;
  scArtName=function(kind,L){ const n=_n.apply(this,arguments); if(!n||!L||L.sex==null) return n; const t=SC_SEX[n]; if(!t||t===(L.sex===1?'f':'m')) return n;
    return /^end_/.test(n)?SC_SEXALT(L.age||0):null; };
})();
