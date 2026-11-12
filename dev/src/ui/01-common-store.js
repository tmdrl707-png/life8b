/* ========== 공통 ========== */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ls(k,v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem(k)); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,JSON.stringify(v)); }catch(e){ return null; } }
const PAGES=['login','hub','birth','teacher','browse'];
function show(name){ document.body.classList.toggle('landing',name==='login'); PAGES.forEach(p=>$('s-'+p).hidden=(p!==name)); $('pages').hidden=!PAGES.includes(name); $('s-game').hidden=(name!=='game'); $('s-end').hidden=(name!=='end'); window.scrollTo(0,0); if(name!=='teacher') clearInterval(TR.poll); }
document.body.classList.toggle('landing',!$('s-login').hidden);
// 첫 화면: 오늘 0시부터 세계에서 태어난 아기 수 (1년 약 1억 3,200만 명 ≒ 1초에 약 4.2명)
(function liveBirths(){ const PER=(typeof BSUM!=='undefined'&&BSUM>0?BSUM*1e4:130e6)/(365.25*86400), el=$('liveN'); let shown=-1;
  const tick=()=>{ if(!$('s-login').hidden){ const d=new Date(), sec=(d-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/1000, n=Math.floor(sec*PER); if(n!==shown){ shown=n; el.textContent=n.toLocaleString('ko-KR'); } } setTimeout(tick,120); }; tick(); })();
const G={life:null,teacher:false,sec:CFG.PERIOD_SEC,data:null,running:false,room:null,roomPi:null,roomInfo:null,spawnT:3,syncT:0,memT:0,told:false};
const TR={code:null,room:null,poll:null,armed:false};
$('btnBig').onclick=()=>{ const on=document.documentElement.classList.toggle('big'); $('btnBig').classList.toggle('on',on); };
const cleanCode=s=>String(s||'').replace(/[^\w가-힣-]/g,'').slice(0,12);
function roomEffPi(r){ if(!r) return null; let pi=r.pi||0; if(r.auto>0&&!r.paused) pi+=Math.floor((Date.now()-r.t0)/(r.auto*60000)); return clamp(pi,0,59); }

/* ========== 저장소: 학생별 계정 + 학급 방 ==========
   Firebase 설정이 있으면 Firebase 인증(REST) + Realtime Database, 없으면 이 기기(localStorage).
   비밀번호는 Firebase가 관리하며 데이터베이스에는 저장하지 않는다. 이 기기 저장 모드에서는 해시만 남긴다. */
const Store={
  fb: !!(CFG.FIREBASE_API_KEY&&CFG.FIREBASE_DB_URL), sess:null, timer:null,
  // auth: Firebase 인증(이메일/비밀번호) · db: 인증을 쓸 수 없는 프로젝트에서는 데이터베이스에 아이디와 '비밀번호를 여러 번 섞은 값'만 둔다
  mode: (CFG.FIREBASE_API_KEY&&CFG.FIREBASE_DB_URL)?(CFG.FIREBASE_AUTH?(ls('life8b_mode')||'auth'):'db'):'local',
  email(id){ return 'u'+this.hex(id)+'@life8b.example.com'; },
  hex(id){ return Array.from(new TextEncoder().encode(id)).map(b=>b.toString(16).padStart(2,'0')).join(''); },
  async hash(t,salt){ try{ const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(t),'PBKDF2',false,['deriveBits']); const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode('life8b:'+(salt||'')),iterations:60000,hash:'SHA-256'},k,256); return 'p'+Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''); }
    catch(e){ let h=5381; for(const c of (salt||'')+t) h=((h<<5)+h+c.charCodeAt(0))>>>0; return 'x'+h.toString(16); } },
  async authCall(ep,body){ const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${ep}?key=${CFG.FIREBASE_API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const d=await r.json(); if(d.error) throw new Error(d.error.message); return d; },
  async refresh(){ const r=await fetch(`https://securetoken.googleapis.com/v1/token?key=${CFG.FIREBASE_API_KEY}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(this.sess.rt)}); const d=await r.json(); if(d.error) throw new Error('SESSION'); this.sess.tok=d.id_token; this.sess.rt=d.refresh_token; this.sess.uid=d.user_id; if(this.sess.keep) ls('life8b_sess',{id:this.sess.id,rt:this.sess.rt,keep:1}); },
  async db(method,path,body,qs){ const au=this.mode==='auth'&&this.sess&&this.sess.tok, url=()=>`${CFG.FIREBASE_DB_URL.replace(/\/$/,'')}/${CFG.PATH}/${path}.json${au||qs?'?'+[au?'auth='+this.sess.tok:'',qs||''].filter(Boolean).join('&'):''}`, opt={method,body:body===undefined?undefined:JSON.stringify(body)};
    let r=await fetch(url(),opt); if(r.status===401&&au){ await this.refresh(); r=await fetch(url(),opt); } if(!r.ok) throw new Error('DB'); return r.json(); },
  msg(e){ const m=String(e.message||e); if(/CLOSED/.test(m)) return '선생님이 등록한 아이디만 쓸 수 있어요. 아이디를 선생님께 확인해 보세요.'; if(/EMAIL_EXISTS|EXISTS/.test(m)) return '이미 있는 아이디예요. 다른 아이디를 써 보세요.'; if(/INVALID|NOT_FOUND|WRONG/.test(m)) return '이미 쓰고 있는 아이디인데 비밀번호가 맞지 않아요. 내 아이디가 맞는지, 비밀번호를 다시 확인해 주세요.'; if(/WEAK/.test(m)) return '비밀번호는 6자 이상이어야 해요.'; if(/TOO_MANY/.test(m)) return '시도가 너무 많아요. 잠시 뒤에 다시 해 주세요.'; if(/Failed to fetch|Network|DB/i.test(m)) return '인터넷 연결을 확인해 주세요.'; return '문제가 생겼어요. 다시 시도해 주세요. ('+m.slice(0,40)+')'; },
  uid(){ return this.sess?(this.sess.uid||this.sess.id):'teacher-local'; },
  async login(id,pw,create,keep){ this.created=false;
    if(this.fb&&this.mode==='auth'){
      try{ let d; const body={email:this.email(id),password:pw,returnSecureToken:true};
        if(create==null){ try{ d=await this.authCall('signUp',body); this.created=true; }catch(e){ if(!/EMAIL_EXISTS/.test(String(e.message))) throw e; d=await this.authCall('signInWithPassword',body); } }
        else d=await this.authCall(create?'signUp':'signInWithPassword',body);
        this.sess={id,uid:d.localId,tok:d.idToken,rt:d.refreshToken,keep}; if(keep) ls('life8b_sess',{id,rt:d.refreshToken,keep:1}); }
      catch(e){ if(/CONFIGURATION_NOT_FOUND|OPERATION_NOT_ALLOWED|PASSWORD_LOGIN_DISABLED|ADMIN_ONLY/.test(String(e.message))){ this.mode='db'; ls('life8b_mode','db'); return this.login(id,pw,create,keep); } throw e; }
    } else if(this.fb){
      const key='d'+this.hex(id); let acc=null; try{ acc=await this.db('GET','acc/'+key); }catch(e){ throw new Error('Network'); }
      if(create==null) create=!acc;
      if(!create&&acc&&!acc.hash){ const salt=Math.random().toString(36).slice(2)+Date.now().toString(36); await this.db('PUT','acc/'+key,{salt,hash:await this.hash(pw,salt),t:acc.t||Date.now()}); this.created='reset'; }
      else if(create){ if(acc) throw new Error('EXISTS'); if(await this.closed()) throw new Error('CLOSED'); this.created='new'; const salt=Math.random().toString(36).slice(2)+Date.now().toString(36); await this.db('PUT','acc/'+key,{salt,hash:await this.hash(pw,salt),t:Date.now()}); }
      else if(!acc||acc.hash!==await this.hash(pw,acc.salt)) throw new Error('INVALID');
      try{ await this.db('PUT','reg/'+this.hex(id),{id,t:Date.now()}); }catch(e){}
      this.sess={id,uid:key,keep}; if(keep) ls('life8b_sess',{id,db:1,keep:1});
    } else {
      const key='life8b_acc_'+id, acc=ls(key);
      if(create==null) create=!acc;
      if(!create&&acc&&!acc.hash){ const salt=Math.random().toString(36).slice(2); acc.salt=salt; acc.hash=await this.hash(pw,salt); ls(key,acc); this.created='reset'; }
      else if(create){ if(acc) throw new Error('EXISTS'); if(await this.closed()) throw new Error('CLOSED'); this.created='new'; const salt=Math.random().toString(36).slice(2); ls(key,{salt,hash:await this.hash(pw,salt),data:null}); }
      else{ if(!acc||(acc.hash!==await this.hash(pw,acc.salt)&&acc.hash!==await this.hash(acc.salt+pw))) throw new Error('INVALID'); }
      this.sess={id,keep}; if(keep) ls('life8b_sess',{id,local:1,keep:1});
    }
    return this.load();
  },
  async resume(){ const s=ls('life8b_sess'); if(!s||!s.keep) return null; try{
      if(s.db&&this.fb){ this.mode='db'; this.sess={id:s.id,uid:'d'+this.hex(s.id),keep:1}; }
      else if(this.fb&&s.rt&&CFG.FIREBASE_AUTH){ this.mode='auth'; this.sess={id:s.id,rt:s.rt,keep:1}; await this.refresh(); }
      else { if(!s.local||!ls('life8b_acc_'+s.id)) return null; this.sess={id:s.id,keep:1}; }
      return await this.load(); }catch(e){ this.sess=null; return null; } },
  async load(){ let d=null; const cache=ls('life8b_cache_'+this.sess.id);
    if(this.fb){ try{ d=await this.db('GET','users/'+this.sess.uid); }catch(e){ d=null; } if(cache&&(!d||(cache.t||0)>(d.t||0))) d=cache; }
    else d=(ls('life8b_acc_'+this.sess.id)||{}).data;
    return d||{save:null,lives:[],t:0}; },
  save(data,now){ if(!this.sess||G.teacher) return; data.t=Date.now(); clearTimeout(this.timer); const go=()=>this.flush(data); if(now) return go(); this.timer=setTimeout(go,1500); },
  async flush(data){ if(!this.sess) return; if(this.fb){ ls('life8b_cache_'+this.sess.id,data); try{ await this.db('PUT','users/'+this.sess.uid,data); }catch(e){} } else { const key='life8b_acc_'+this.sess.id, acc=ls(key); if(acc){ acc.data=data; ls(key,acc); } } },
  logout(){ this.sess=null; ls('life8b_sess',null); },
  // ----- 교사용: 학생 아이디 관리 (인증 방식을 쓰는 프로젝트에서는 목록·초기화를 쓸 수 없다) -----
  async closed(){ if(this.fb){ try{ return !!(await this.db('GET','idcfg/closed')); }catch(e){ return false; } } const c=ls('life8b_idcfg'); return !!(c&&c.closed); },
  async setClosed(v){ if(this.fb) await this.db('PUT','idcfg/closed',v?1:null); else ls('life8b_idcfg',{closed:v?1:0}); },
  decKey(k){ if(k[0]!=='d') return null; try{ const h=k.slice(1).match(/../g)||[]; return new TextDecoder().decode(new Uint8Array(h.map(x=>parseInt(x,16)))); }catch(e){ return null; } },
  async adminList(){ const out=new Map(), add=(id,o)=>{ if(id) out.set(id,Object.assign(out.get(id)||{id},o)); };
    if(this.fb){ let ac,us,rg; try{ ac=await this.db('GET','acc',undefined,'shallow=true'); }catch(e){ throw new Error('Network'); }
      try{ us=await this.db('GET','users',undefined,'shallow=true'); }catch(e){} try{ rg=await this.db('GET','reg'); }catch(e){}
      Object.keys(ac||{}).forEach(k=>add(this.decKey(k),{key:k})); Object.keys(us||{}).forEach(k=>add(this.decKey(k),{key:k,data:1})); Object.values(rg||{}).forEach(v=>v&&v.id&&add(v.id,{key:'d'+this.hex(v.id),last:v.t}));
      await Promise.all([...out.values()].map(async o=>{ if(!o.data) return; try{ const t=await this.db('GET','users/'+o.key+'/t'); if(t) o.last=Math.max(o.last||0,t); }catch(e){} }));
      await Promise.all([...out.values()].map(async o=>{ try{ const a=await this.db('GET','acc/'+o.key+'/hash'); o.open=!a; }catch(e){} })); }
    else Object.keys(localStorage).filter(k=>k.startsWith('life8b_acc_')).forEach(k=>{ const id=k.slice(11), a=ls(k)||{}; add(id,{key:id,data:a.data?1:0,last:(a.data||{}).t,open:!a.hash}); });
    return [...out.values()].sort((a,b)=>a.id.localeCompare(b.id,'ko')); },
  async adminUser(o){ if(this.fb) return (await this.db('GET','users/'+o.key))||{}; return (ls('life8b_acc_'+o.id)||{}).data||{}; },
  async adminReset(o){ if(this.fb) await this.db('PUT','acc/'+o.key,{t:Date.now(),reg:1}); else { const a=ls('life8b_acc_'+o.id)||{}; a.hash=null; ls('life8b_acc_'+o.id,a); } },
  async adminDelete(o){ if(this.fb){ await this.db('PUT','acc/'+o.key,null); await this.db('PUT','users/'+o.key,null); await this.db('PUT','reg/'+this.hex(o.id),null); } else ls('life8b_acc_'+o.id,null); ls('life8b_cache_'+o.id,null); },
  async adminAdd(ids){ let n=0; for(const id of ids){ if(this.fb){ const key='d'+this.hex(id); if(!(await this.db('GET','acc/'+key))){ await this.db('PUT','acc/'+key,{t:Date.now(),reg:1}); await this.db('PUT','reg/'+this.hex(id),{id,t:0}); n++; } } else if(!ls('life8b_acc_'+id)){ ls('life8b_acc_'+id,{salt:'',hash:null,data:null,reg:1}); n++; } } return n; },
  // 학급 방: 선생님이 열고, 반 전체가 같은 나이로 움직인다
  async roomGet(code){ if(this.fb){ try{ return await this.db('GET','rooms/'+encodeURIComponent(code)); }catch(e){ return null; } } return ls('life8b_room_'+code); },
  async roomSet(code,patch){ if(this.fb) await this.db('PATCH','rooms/'+encodeURIComponent(code),patch); else ls('life8b_room_'+code,Object.assign(ls('life8b_room_'+code)||{},patch)); },
  // 학생 칸의 일부만 바꾼다 (끝난 삶은 past/<시각> 아래에 쌓여 지워지지 않는다). 값이 null이면 그 항목을 지운다
  async memberPatch(code,obj){ if(!this.sess) return; if(this.fb){ try{ await this.db('PATCH','rooms/'+encodeURIComponent(code)+'/members/'+this.sess.uid,obj); }catch(e){} return; }
    const r=ls('life8b_room_'+code); if(!r) return; r.members=r.members||{}; const m=r.members[this.sess.id]=r.members[this.sess.id]||{};
    for(const k in obj){ const ks=k.split('/'); let o=m; for(let i=0;i<ks.length-1;i++) o=o[ks[i]]=o[ks[i]]||{}; const last=ks[ks.length-1]; if(obj[k]===null) delete o[last]; else o[last]=obj[k]; } ls('life8b_room_'+code,r); },
  async memberPut(code,obj){ if(!this.sess) return; if(this.fb){ try{ await this.db('PUT','rooms/'+encodeURIComponent(code)+'/members/'+this.sess.uid,obj); }catch(e){} } else { const r=ls('life8b_room_'+code); if(r){ r.members=r.members||{}; r.members[this.sess.id]=obj; ls('life8b_room_'+code,r); } } }
};
function persist(now){ if(G.teacher){ tPersist(now); return; } if(!G.data) return; G.data.save=(G.life&&!G.life.dead)?G.life.dump():null; Store.save(G.data,now); }

