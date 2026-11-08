// Game: state machine, loop, world update and rendering.
const R=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
class Game{
 constructor(cv){this.c=cv.getContext('2d');this.W=960;this.H=540;this.fx=new Particles();this.pl=new Player();
  this.k={left:0,right:0,jump:0,jumpP:0,boostP:0};this.state='menu';this.t=0;this.camX=0;this.li=0;this.lv=makeLevel(0);this.bind();
  requestAnimationFrame(n=>{this.last=n;this.loop(n)})}
 bind(){
  const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ShiftLeft:'boost',ShiftRight:'boost',KeyX:'boost'};
  const set=(n,v)=>{if(n==='boost'){if(v)this.k.boostP=1}else{if(v&&!this.k[n]&&n==='jump')this.k.jumpP=1;this.k[n]=v}};
  addEventListener('keydown',e=>{if(e.code==='Escape'||e.code==='KeyP'){this.pause();return}if(map[e.code]){e.preventDefault();set(map[e.code],1)}});
  addEventListener('keyup',e=>{if(map[e.code])set(map[e.code],0)});
  document.querySelectorAll('[data-k]').forEach(b=>{const n=b.dataset.k;
   b.addEventListener('pointerdown',e=>{e.preventDefault();set(n,1)});
   ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>set(n,0)))})}
 start(i){this.li=i;this.lv=makeLevel(i);this.coins=0;this.lives=3;this.time=0;this.cp=this.lv.K[0];this.respawn();this.state='play';UI.show('');$('hN').textContent='Level '+(i+1)}
 respawn(){this.pl.reset(this.cp.x,this.cp.y);this.camX=Math.max(0,this.cp.x-300)}
 pause(){if(this.state==='play'){this.state='pause';UI.show('pause')}else if(this.state==='pause'){this.state='play';UI.show('')}}
 loop(now){const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.t+=dt;
  if(this.state==='play')this.update(dt);else if(this.state==='menu')this.camX=(this.t*60)%1500;
  this.fx.update(dt);this.draw();requestAnimationFrame(n=>this.loop(n))}
 update(dt){
  const lv=this.lv,pl=this.pl;this.time+=dt;
  for(const m of lv.M){m.dx=0;const nx=m.x+m.dir*m.sp*dt;if(nx>m.x1||nx<m.x0)m.dir*=-1;else{m.dx=nx-m.x;m.x=nx}}
  pl.update(dt,this.k,lv.P.concat(lv.M),this);this.k.jumpP=this.k.boostP=0;
  if(pl.boost>0)this.fx.burst(pl.x+25-pl.face*25,pl.y+40,'#ff9f1c',1,60,.3);
  const hb={x:pl.x+10,y:pl.y+8,w:pl.w-20,h:pl.h-12};
  for(const c of lv.C)if(!c.got&&Math.abs(c.x-pl.x-25)<34&&Math.abs(c.y-pl.y-32)<44){c.got=true;this.coins++;Sfx.play('coin');this.fx.burst(c.x,c.y,'#ffd23f',8,120,.4)}
  for(const u of lv.U)if(!u.got&&Math.abs(u.x-pl.x-25)<36&&Math.abs(u.y-pl.y-32)<46){u.got=true;pl.boost=2;pl.cool=0;Sfx.play('boost');this.fx.burst(u.x,u.y,'#ff9f1c',12,160,.5)}
  for(const b of lv.B){b.a=Math.max(0,b.a-dt);if(pl.vy>0&&R(pl,b)){pl.vy=-1050;pl.jumps=1;pl.nc=true;b.a=.3;Sfx.play('bounce')}}
  for(const k of lv.K)if(!k.on&&pl.x>k.x){k.on=true;this.cp=k;Sfx.play('check');this.fx.burst(k.x,k.y-60,'#7CFC9a',14,160,.6)}
  if(pl.inv<=0)for(const s of lv.S)if(R(hb,s)){this.die();return}
  if(pl.y>700){this.die();return}
  if(pl.x+pl.w>lv.F.x){this.end(true);return}
  this.camX+=(Math.max(0,Math.min(lv.W-this.W,pl.x-this.W*.35))-this.camX)*Math.min(1,dt*8);
  $('hC').textContent=this.coins;$('hS').textContent=this.coins*10;$('hV').textContent=this.lives;$('bf').style.width=Math.max(0,Math.min(1,1-pl.cool/3))*100+'%'}
 die(){const pl=this.pl;Sfx.play('die');this.fx.burst(pl.x+25,pl.y+32,'#ff5d73',24,300,.8);this.lives--;$('hV').textContent=this.lives;
  if(this.lives<=0)this.end(false);else this.respawn()}
 end(win){this.state=win?'win':'over';let sc=this.coins*10;Store.d.coins+=this.coins;
  if(win){sc+=Math.max(0,Math.round(500-this.time*3))+this.lives*100;Sfx.play('win');
   Store.d.best[this.li]=Math.max(Store.d.best[this.li]||0,sc);Store.d.unlocked=Math.max(Store.d.unlocked,Math.min(LEVELS,this.li+2));
   $('wS').textContent=`Score ${sc}. Coins ${this.coins}. Time ${this.time.toFixed(1)}s.`+(this.li+1>=LEVELS?' You beat every level!':'');
   $('nx').style.display=this.li+1>=LEVELS?'none':''}
  else $('oS').textContent=`You collected ${this.coins} coins.`;
  Store.save();UI.show(win?'win':'over')}
 hills(c,off,col,base,amp,fq){c.fillStyle=col;c.beginPath();c.moveTo(0,this.H);for(let x=0;x<=this.W+12;x+=12)c.lineTo(x,base+Math.sin((x+off)*fq)*amp+Math.sin((x+off)*fq*2.3)*amp*.4);c.lineTo(this.W,this.H);c.fill()}
 draw(){
  const c=this.c,lv=this.lv,T=lv.theme,W=this.W,H=this.H,cx=this.camX,t=this.t;
  const g=c.createLinearGradient(0,0,0,H);T.sky.forEach((s,i)=>g.addColorStop(i/2,s));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(780,110,46,0,6.283);c.fill();
  c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<5;i++){const x=((i*260-cx*.1+t*12)%(W+300)+W+300)%(W+300)-150,y=60+i%3*45;c.beginPath();c.ellipse(x,y,50,16,0,0,6.283);c.ellipse(x+26,y-10,28,14,0,0,6.283);c.fill()}
  this.hills(c,cx*.25,T.h1,300,60,.008);this.hills(c,cx*.5,T.h2,360,45,.012);
  c.save();c.translate(-Math.round(cx),0);const vis=o=>o.x+(o.w||60)>cx-60&&o.x<cx+W+60;
  for(const p of lv.P.concat(lv.M))if(vis(p)){c.fillStyle=T.d;c.fillRect(p.x,p.y,p.w,p.h);c.fillStyle=T.g;c.fillRect(p.x,p.y,p.w,12)}
  for(const b of lv.B)if(vis(b)){const h=b.h*(1-b.a);c.fillStyle='#ff6fb5';c.beginPath();c.roundRect(b.x,b.y+b.h-h,b.w,h,5);c.fill();c.fillStyle='#fff';c.fillRect(b.x+8,b.y+b.h-h,b.w-16,3)}
  c.fillStyle='#e9e9f5';for(const s of lv.S)if(vis(s))for(let k=0;k<3;k++){c.beginPath();c.moveTo(s.x+k*12,s.y+s.h);c.lineTo(s.x+k*12+6,s.y);c.lineTo(s.x+k*12+12,s.y+s.h);c.fill()}
  for(const k of lv.K){c.fillStyle='#fff';c.fillRect(k.x,k.y-80,5,80);c.fillStyle=k.on?'#3ddc84':'#9a9ab0';c.beginPath();c.moveTo(k.x+5,k.y-80);c.lineTo(k.x+40,k.y-68+Math.sin(t*5)*3);c.lineTo(k.x+5,k.y-54);c.fill()}
  const F=lv.F;c.fillStyle='#fff';c.fillRect(F.x,F.y-140,6,140);for(let a=0;a<4;a++)for(let b=0;b<6;b++){c.fillStyle=(a+b)%2?'#fff':'#222';c.fillRect(F.x+6+b*9,F.y-140+a*9+Math.sin(t*5+b)*2,9,9)}
  for(const co of lv.C)if(!co.got&&vis(co)){const w=Math.abs(Math.cos(t*4+co.x*.01))*9+2;c.fillStyle='#e0a800';c.beginPath();c.ellipse(co.x,co.y,w,11,0,0,6.283);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.ellipse(co.x,co.y,w*.7,8,0,0,6.283);c.fill()}
  for(const u of lv.U)if(!u.got&&vis(u)){const r=14+Math.sin(t*6)*2;c.fillStyle='#ff9f1c';c.beginPath();c.arc(u.x,u.y,r,0,6.283);c.fill();c.fillStyle='#fff';c.beginPath();c.moveTo(u.x+3,u.y-9);c.lineTo(u.x-6,u.y+2);c.lineTo(u.x,u.y+2);c.lineTo(u.x-3,u.y+10);c.lineTo(u.x+6,u.y-2);c.lineTo(u.x,u.y-2);c.fill()}
  if(this.state!=='menu')this.pl.draw(c,t);
  this.fx.draw(c);c.restore()}
}
