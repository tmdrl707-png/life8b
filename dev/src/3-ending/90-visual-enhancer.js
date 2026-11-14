(function(){
  'use strict';
  var end=document.getElementById('s-end'), inner=document.getElementById('endIn');
  if(!end||!inner) return;
  var cv=document.createElement('canvas'); cv.id='star-bg-canvas'; cv.setAttribute('aria-hidden','true');
  end.insertBefore(cv,end.firstChild);              // #endIn 바깥에 두어 장면이 다시 그려져도 남는다
  var ctx=cv.getContext('2d'), stars=[], raf=0;
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size(){
    var w=window.innerWidth, h=window.innerHeight;
    cv.width=w; cv.height=h;
    var n=Math.round(Math.min(130,Math.max(60,w*h/9000)));
    stars=[];
    for(var i=0;i<n;i++) stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,a:Math.random()*.8+.15,
      da:(Math.random()*.015+.003)*(Math.random()<.5?1:-1)});
    paint();
  }
  function paint(){
    ctx.clearRect(0,0,cv.width,cv.height);
    for(var i=0;i<stars.length;i++){
      var s=stars[i]; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.2832);
      ctx.fillStyle='rgba(255,228,205,'+s.a.toFixed(2)+')'; ctx.fill();
    }
  }
  function tick(){
    if(end.hidden||document.hidden){ raf=0; return; }
    for(var i=0;i<stars.length;i++){ var s=stars[i]; s.a+=s.da; if(s.a>.95||s.a<.15) s.da*=-1; }
    paint(); raf=requestAnimationFrame(tick);
  }
  function sync(){
    if(end.hidden){ if(raf){ cancelAnimationFrame(raf); raf=0; } return; }
    size();
    if(!still&&!raf) raf=requestAnimationFrame(tick);
  }
  new MutationObserver(sync).observe(end,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',function(){ if(!end.hidden&&!document.hidden&&!still&&!raf) raf=requestAnimationFrame(tick); });
  window.addEventListener('resize',function(){ if(!end.hidden) size(); });

  // 한 장면 안에서 기억·사진이 차례로 떠오르게 한다 (장면이 바뀔 때마다 0부터 다시 센다)
  new MutationObserver(function(){
    var items=inner.querySelectorAll('.photos li, .mem > div');
    for(var i=0;i<items.length;i++) items[i].style.animationDelay=Math.min(i*.18,1.2)+'s';
  }).observe(inner,{childList:true});
})();
